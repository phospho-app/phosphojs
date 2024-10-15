import axios from "axios";
import { randomUUID } from "node:crypto";
import { debounce, lookupEnvVariable } from "./utils";
import { PhosphoInit, LogContent, LogEvent, UserFeedback } from "./types";
import { getInputOutput, extractMetadataFromInputOutput } from "./extractor";
import { BASE_URL } from "./config";
import { sendUserFeedback } from "./user-feedback";
import { hashCode } from "./utils";

/**
 * Phospho class for logging and processing events
 * @class
 */
class Phospho {
  /**
   * @property {string} apiKey - The API key for authentication, found in your Phospho dashboard
   */
  apiKey: string;
  /**
   * @property {string} projectId - The project id for the project you want to log events to, found in your Phospho dashboard
   */
  projectId: string;
  /**
   * @property {number} tick - The delay in milliseconds for debounced operations
   * @default 500
   */
  tick: number = 500;
  /**
   * @property {string} baseUrl - The base URL for API requests, defaults to the Phospho API
   * @default "https://api.phospho.ai/v2"
   */
  baseUrl: string = BASE_URL;
  /**
   * @property {string} path_to_hash - The path to your codebase to hash for versioning
   * @example "process.cwd()"
   */
  path_to_hash: string | null = null;

  // Queue of log events as a Mapping of {taskId: logEvent}
  /**
   * @property {Map<string, LogEvent>} logQueue - The queue of log events to be sent to Phospho
   */
  logQueue = new Map<string, LogEvent>();
  /**
   * @property {string | null} latestTaskId - The latest task id generated
   */
  latestTaskId: string | null = null;
  /**
   * @property {string | null} latestSessionId - The latest session id generated
   */
  latestSessionId: string | null = null;

  // Version ID
  /**
   * @property {Promise<string> | string | null} version_id - The version id of your app, to be used for versioning
   */
  version_id: Promise<string> | string | null = null;

  /**
   * Initialize the Phospho instance
   *
   * Basic usage:
   *
   * phospho.init({apiKey: "...", projectId: "..."})
   *
   * or
   *
   * phospho.init() // Will look for PHOSPHO_API_KEY and PHOSPHO_PROJECT_ID in the environment variables
   *
   * @param {PhosphoInit} options - The initialization options
   * @param {string} [options.apiKey] - The API key
   * @param {string} [options.projectId] - The project ID
   * @param {number} [options.tick] - The tick value for debounced operations, no need to change unless you know what you're doing
   * @param {string} [options.baseUrl] - The base URL for API requests, defaults to the Phospho API
   * @param {string} [options.path_to_hash] - The path to hash for version identification, defaults to the current working directory
   * @returns {Promise<void>}
   */
  async init({
    apiKey,
    projectId,
    tick,
    baseUrl,
    path_to_hash,
  }: PhosphoInit = {}): Promise<void> {
    if (apiKey) {
      this.apiKey = apiKey;
    } else {
      this.apiKey = lookupEnvVariable("PHOSPHO_API_KEY");
    }
    if (projectId) {
      this.projectId = projectId;
    } else {
      this.projectId = lookupEnvVariable("PHOSPHO_PROJECT_ID");
    }
    if (tick) this.tick = tick;
    if (baseUrl) this.baseUrl = baseUrl;
    if (path_to_hash) {
      this.version_id = hashCode(path_to_hash);
    } else {
      path_to_hash = process.cwd();
      this.version_id = hashCode(path_to_hash);
    }
  }

  /**
   * Generate a new session ID
   * @returns {string} The new session ID
   */
  newSession(): string {
    this.latestSessionId = randomUUID();
    return this.latestSessionId;
  }

  /**
   * Generate a new task ID
   * @returns {string} The new task ID
   */
  newTask(): string {
    this.latestTaskId = randomUUID();
    return this.latestTaskId;
  }

  /**
   * Check if phospho has been initialized
   * @returns {boolean} Whether phospho has been initialized
   */
  isInitialized(): boolean {
    return !!this.apiKey && !!this.projectId;
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
    version_id,
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
    const metadataToLog = extractMetadataFromInputOutput({
      input,
      output,
      // TODO : Add support for custom functions
      inputOutputToUsageFunction: null,
    });

    // Generate a taskId if not specified
    taskId = taskId || randomUUID();
    if (!sessionId) sessionId = null;

    // Keep track of taskId and sessionId
    this.latestSessionId = sessionId;
    this.latestTaskId = taskId;

    // Handle version_id
    if (this.version_id instanceof Promise) {
      version_id = await this.version_id;
    } else if (
      typeof version_id !== "string" &&
      typeof this.version_id === "string"
    ) {
      version_id = this.version_id;
    }

    const logContent = {
      // The UTC timestamp rounded to the second
      client_created_at: Math.floor(Date.now() / 1000),
      // Metadata
      project_id: this.projectId,
      session_id: sessionId,
      task_id: taskId,
      version_id: version_id,
      // Input
      input: extractedInputOutputToLog.inputToLog,
      raw_input: extractedInputOutputToLog.rawInputToLog,
      raw_input_type_name: typeof extractedInputOutputToLog.rawInputToLog,
      // Output
      output: extractedInputOutputToLog.outputToLog,
      raw_output: extractedInputOutputToLog.rawOutputToLog,
      raw_output_type_name: typeof extractedInputOutputToLog.rawOutputToLog,
      // Other
      ...metadataToLog,
      ...rest,
    };

    // If taskId exists in the logQueue, concatenate the raw outputs
    if (this.logQueue.has(taskId)) {
      const existingLogEvent = this.logQueue.get(taskId);

      let newOutput: string | null = logContent.output;
      let newRawOutput = logContent.raw_output;

      // If output is a string, concatenate
      if (
        typeof existingLogEvent.content.output === "string" &&
        typeof logContent.output === "string"
      ) {
        newOutput = existingLogEvent.content.output + logContent.output;
      }
      // It output is null, use the existing output
      else if (logContent.output === null) {
        newOutput = existingLogEvent.content.output.toString();
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
      }

      // Update the logContent
      logContent.output = newOutput;
      logContent.raw_output = newRawOutput;
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
   * @param rest Any other data to log as keyword arguments (ex: flag: "success", metadata: {...})
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
    version_id,
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
        version_id,
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
    const logTaskId = taskId || randomUUID();
    const phospho = this;

    // Mutate inplace the iterator to log when called
    // Async case
    if (output[Symbol.asyncIterator]) {
      const originalOutput = output[Symbol.asyncIterator];
      output[Symbol.asyncIterator] = async function* () {
        const iterator = originalOutput.call(output);

        // TODO: Improve this syntax
        while (true) {
          const { done, value } = await iterator.next();
          if (done) {
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
              version_id,
              ...rest,
            });
            break;
          }
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
            version_id,
            ...rest,
          });
          yield value;
        }
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
            version_id,
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
          version_id,
          ...rest,
        });
      };
    }
  }

  /**
   * Send a batch of log events to Phospho
   * @returns {Promise<void>}
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

      const url = `${this.baseUrl}/log/${this.projectId}`;
      const data = {
        batched_log_events: batchedLogContent,
      };
      await axios
        .post(url, data, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          // Clear the log queue from the log events where toLog is true
          batchedLogEvents.forEach((logEvent) => {
            this.logQueue.delete(logEvent.id);
          });
        });

      return;
    } catch (error) {
      console.warn("Error sending batch to Phospho", error);
    }
  }

  // Used to delay the sending of the batch and to avoid sending too many requests
  private debouncedProcessQueue = debounce(() => this.sendBatch(), this.tick);

  /**
   * Wrap a function to automatically log its input and output
   * @param {Function} fn - The function to wrap
   * @returns {Function} The wrapped function
   */
  wrap = (fn: Function): Function => {
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
    return sendUserFeedback({
      projectId: this.projectId,
      taskId,
      flag,
      notes,
      source,
      rawFlag,
      rawFlagToFlag,
      baseUrl: this.baseUrl,
    });
  };
}

export default Phospho;
export { Phospho };
