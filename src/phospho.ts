import axios from "axios";
const { v4: uuidv4 } = require("uuid");

import { debounce, lookupEnvVariable } from "./utils";
import { PhosphoInit, LogContent, LogEvent, UserFeedback } from "./types";
import { getInputOutput } from "./extractor";

const DEFAULT_API_BASE_URL = "https://api.phospho.ai";
const DEFAULT_API_VERSION = "/v2";
const BASE_URL = DEFAULT_API_BASE_URL + DEFAULT_API_VERSION;

class Phospho {
  apiKey: string;
  projectId: string;
  tick: number = 500;
  context: any;

  // Queue of log events as a Mapping of {taskId: logEvent}
  logQueue = new Map<string, LogEvent>();
  latestTaskId: string | null = null;
  latestSessionId: string | null = null;

  constructor(context?) {
    this.init({
      apiKey: lookupEnvVariable("PHOSPHO_API_KEY"),
      projectId: lookupEnvVariable("PHOSPHO_PROJECT_ID"),
    });

    this.context = context;
  }

  init({ apiKey, projectId, tick }: PhosphoInit = {}) {
    if (apiKey) this.apiKey = apiKey;
    if (projectId) this.projectId = projectId;
    if (tick) this.tick = tick;
  }

  /**
   * Generate a new session id
   */
  newSession() {
    this.latestSessionId = uuidv4();
    return this.latestSessionId;
  }

  /**
   * Generate a new task id
   */
  newTask() {
    this.latestTaskId = uuidv4();
    return this.latestTaskId;
  }

  private async _log({
    input,
    output,
    sessionId,
    taskId,
    rawInput,
    rawOutput,
    inputToStrFunction,
    outputToStrFunction,
    concatenateRawOutputsIfTaskIdExists,
    toLog,
    ...rest
  }) {
    // If input or output are async, await them
    if (input instanceof Promise) {
      input = await input;
    }
    if (output instanceof Promise) {
      output = await output;
    }

    const extractedInputOutputToLog = getInputOutput({
      input,
      output,
      rawInput,
      rawOutput,
      inputToStrFunction,
      outputToStrFunction,
    });

    // Generate a taskId if not specified
    taskId = taskId || uuidv4();
    if (!sessionId) sessionId = null;

    // Keep track of taskId and sessionId
    this.latestSessionId = sessionId;
    this.latestTaskId = taskId;

    const logContent = {
      // The UTC timestamp rounded to the second
      client_created_at: Math.floor(Date.now() / 1000),
      // Metadata
      project_id: this.projectId,
      session_id: sessionId,
      task_id: taskId,
      // Input
      input: extractedInputOutputToLog.inputToLog,
      raw_input: extractedInputOutputToLog.rawInputToLog,
      raw_input_type_name: typeof extractedInputOutputToLog.rawInputToLog,
      // Output
      output: extractedInputOutputToLog.outputToLog,
      raw_output: extractedInputOutputToLog.rawOutputToLog,
      raw_output_type_name: typeof extractedInputOutputToLog.rawOutputToLog,
      // Other
      ...rest,
    };

    // If taskId exists in the logQueue, concatenate the raw outputs
    if (this.logQueue.has(taskId)) {
      const existingLogEvent = this.logQueue.get(taskId);

      let newOutput: string = logContent.output;
      let newRawOutput = logContent.raw_output;

      // If output is a string, concatenate
      if (
        typeof existingLogEvent.content.output === "string" &&
        typeof logContent.output === "string"
      ) {
        newOutput = existingLogEvent.content.output + logContent.output;
        logContent.output = newOutput;
      }

      // Concatenate raw outputs if specified
      if (concatenateRawOutputsIfTaskIdExists === undefined)
        concatenateRawOutputsIfTaskIdExists = true;
      if (concatenateRawOutputsIfTaskIdExists) {
        // If rawOutput is a list, concatenate
        if (Array.isArray(existingLogEvent.content.raw_output)) {
          newRawOutput = [
            ...existingLogEvent.content.raw_output,
            logContent.raw_output,
          ];
        } else {
          newRawOutput = [
            existingLogEvent.content.raw_output,
            logContent.raw_output,
          ];
        }
        logContent.raw_output = newRawOutput;
      }
    }

    // Add to the log queue
    this.logQueue.set(taskId, { id: taskId, content: logContent, toLog });
    // Trigger sendBatch after a delay (500ms by default)
    this.debouncedProcessQueue();

    // if async, await
    return logContent;
  }

  /**
   * Phospho's main all-purpose logging endpoint, with support for streaming.

    Usage:
    ```
    phospho.log(input="input", output="output")
    ```

    By default, phospho will try to interpret a string representation from `input` and `output`.
    For example, OpenAI API calls. Arguments passed as `input` and `output` are then stored
    in `rawInput` and `rawOutput`, unless those are specified.

    You can customize this behaviour using `inputToStrFunction` and `outputToStrFunction`.

    `sessionId` is used to group logs together. For example, a single conversation.

    `taskId` is used to identify a single task. For example, a single message in a conversation.
    This is useful to log user feedback on a specific task (see phospho.userFeedback).

    `stream` is used to log a stream of data. For example, a generator. If `stream=True`, then
    `phospho.log` returns a generator that also logs every individual output. See `phospho.wrap`
    for more details.

    Every other keyword parameters in `...rest` will be added to the log content and stored.

   * @param input The input to the task
   * @param output The output of the task
   * @param sessionId The session id
   * @param taskId The task id
   * @param rawInput The raw input
   * @param rawOutput The raw output
   * @param inputToStrFunction A function to convert the input to a string
   * @param outputToStrFunction A function to convert the output to a string
   * @param outputToTaskIdAndToLogFunction A function to convert the output to a task id and a boolean indicating whether to log the output. Useful for streaming.
   * @param concatenateRawOutputsIfTaskIdExists Whether to concatenate the raw outputs if a task id exists
   * @param stream Enable compatibility with streaming input
   * @param rest Any other data to log as keyword arguments (ex: flag="success", metadata={...})
   * @returns The logged event, including the taskId.
   */
  async log({
    input,
    output,
    sessionId,
    taskId,
    rawInput,
    rawOutput,
    inputToStrFunction,
    outputToStrFunction,
    concatenateRawOutputsIfTaskIdExists,
    stream,
    ...rest
  }: LogContent) {
    // Verify if phospho.init has been called
    if (!this.apiKey) {
      throw new Error(
        "Phospho API key not found. Please call phospho.init({apiKey: ...}) first."
      );
    }
    if (!this.projectId) {
      throw new Error(
        "Phospho project id not found. Please call phospho.init({projectId: ...}) first."
      );
    }

    // If stream=False, log the input and output directly
    if (!stream) {
      return this._log({
        input,
        output,
        sessionId,
        taskId,
        rawInput,
        rawOutput,
        inputToStrFunction,
        outputToStrFunction,
        concatenateRawOutputsIfTaskIdExists,
        toLog: true, // Always log if stream=False
        ...rest,
      });
    }

    // stream=True. Check if output iterable
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
    if (!(output[Symbol.asyncIterator] || output[Symbol.iterator])) {
      throw new Error(
        `Logging output ${JSON.stringify(
          output
        )} is not supported with stream=True. Pass an Symbol.asynIterator or Symbol.iterator instead`
      );
    }

    // Generate a taskId to group logs of the stream
    const logTaskId = taskId || uuidv4();
    const phospho = this;

    // Mutate inplace the iterator to log when called
    // Async case
    if (output[Symbol.asyncIterator]) {
      const originalOutput = output[Symbol.asyncIterator];
      output[Symbol.asyncIterator] = async function* () {
        const iterator = originalOutput.call(output);

        for await (const value of iterator) {
          // Log the value
          phospho._log({
            input,
            output: value,
            sessionId,
            taskId: logTaskId,
            rawInput,
            rawOutput,
            inputToStrFunction,
            outputToStrFunction,
            concatenateRawOutputsIfTaskIdExists,
            toLog: false, // Don't log if not done
            ...rest,
          });
          yield value;
        }
        // Done logging, push the batch
        phospho._log({
          input,
          output: null,
          sessionId,
          taskId: logTaskId,
          rawInput,
          rawOutput,
          inputToStrFunction,
          outputToStrFunction,
          concatenateRawOutputsIfTaskIdExists,
          toLog: true, // Log if done
          ...rest,
        });
      };
    }

    // Sync case
    if (output[Symbol.iterator]) {
      const originalOutput = output[Symbol.iterator];
      output[Symbol.iterator] = function* () {
        const iterator = originalOutput.call(output);

        for (const value of iterator) {
          // Log the value
          phospho._log({
            input,
            output: value,
            sessionId,
            taskId: logTaskId,
            rawInput,
            rawOutput,
            inputToStrFunction,
            outputToStrFunction,
            concatenateRawOutputsIfTaskIdExists,
            toLog: false, // Don't log if not done
            ...rest,
          });
          yield value;
        }
        // Done logging, push the batch
        phospho._log({
          input,
          output: null,
          sessionId,
          taskId: logTaskId,
          rawInput,
          rawOutput,
          inputToStrFunction,
          outputToStrFunction,
          concatenateRawOutputsIfTaskIdExists,
          toLog: true, // Log if done
          ...rest,
        });
      };
    }
  }

  /**
   * Send a batch of log events to Phospho
   */
  async sendBatch() {
    try {
      if (this.logQueue.size === 0) {
        return;
      }
      const batchedLogEvents = Array.from(this.logQueue.values());
      // Keep only the log events marked as toLog
      batchedLogEvents.filter((logEvent) => logEvent.toLog);
      if (batchedLogEvents.length === 0) {
        return;
      }
      // Keep only the content
      const batchedLogContent = batchedLogEvents.map(
        (logEvent) => logEvent.content
      );

      const url = `${BASE_URL}/log/${this.projectId}`;
      const data = {
        batched_log_events: batchedLogContent,
      };

      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      return;
    } catch (error) {
      console.warn("Error sending batch to Phospho", error);
    }
  }

  // Used to delay the sending of the batch and to avoid sending too many requests
  private debouncedProcessQueue = debounce(() => this.sendBatch(), this.tick);

  wrap = (fn) => {
    // If Async function, return a wrapped async function
    if (typeof fn === "function") {
      return async (...args) => {
        const result = await fn(...args);
        this.log({
          input: args,
          output: result,
        });
        return result;
      };
    }
  };

  /**
   * Flag a task already logged to phospho as a `success` or a `failure`. This is useful to collect human feedback.
   *
   * Note: Feedback can be directly logged with `phospho.log` by passing `flag` as a keyword argument.
   *
   * @param taskId The task id. Get the taskId from the returned value of phospho.log, use phospho.newTask to generate a new task id, or use pospho.latestTaskId
   * @param flag The flag to set, either `success` or `failure`
   * @param notes Optional notes to add to the task. For example, the reason for the flag.
   * @param source Optional source of the flag. For example, the name of the user who flagged the task.
   * @param rawFlag Optional raw flag. If flag is not specified, rawFlag is used to determine the flag. For example, if rawFlag is "👍", then flag is "success".
   * @param rawFlagToFlag Optional function to convert rawFlag to flag. By default, "success", "👍", "🙂", "😀" are set to be "success"
   * @returns The updated task
   */
  userFeedback = ({
    taskId,
    flag,
    notes,
    source,
    rawFlag,
    rawFlagToFlag,
  }: UserFeedback) => {
    if (!flag) {
      if (!rawFlag) {
        // Raise warning
        console.warn(
          "Either flag or raw_flag must be specified when calling user_feedback. Nothing logged"
        );
        return;
      } else {
        if (!rawFlagToFlag) {
          // Default rawFlagToFlag function
          rawFlagToFlag = (rawFlag: string) => {
            if (["success", "👍", "🙂", "😀"].includes(rawFlag)) {
              return "success";
            } else {
              return "failure";
            }
          };
        }
        // Convert rawFlag to flag
        flag = rawFlagToFlag(rawFlag);
      }
    }

    const updatedTask = axios
      .post(
        `${BASE_URL}/task/${taskId}`,
        {
          flag: flag,
          notes: notes,
          source: source,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        return response.data;
      });

    return updatedTask;
  };
}

export default Phospho;
