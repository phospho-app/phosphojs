import axios from "axios";
const { v4: uuidv4 } = require("uuid");

import { debounce, lookupEnvVariable } from "./utils";
import { PhosphoInit, LogEvent, UserFeedback } from "./types";

const DEFAULT_API_BASE_URL = "https://api.phospho.ai";
const DEFAULT_API_VERSION = "/v0";
const BASE_URL = DEFAULT_API_BASE_URL + DEFAULT_API_VERSION;

class Phospho {
  apiKey: string;
  projectId: string;
  tick: number = 500;
  context: any;

  // Queue of log events to send
  logQueue: any[] = [];
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

  newSession() {
    this.latestSessionId = uuidv4();
    return this.latestSessionId;
  }

  newTask() {
    this.latestTaskId = uuidv4();
    return this.latestTaskId;
  }

  /**
   * Log a task to Phospho. The input and output are processed to extract a string representation.
   * @param input The input to the task
   * @param output The output of the task
   * @param sessionId The session id
   * @param taskId The task id
   * @param rawInput The raw input
   * @param rawOutput The raw output
   * @param inputToStrFunction A function to convert the input to a string
   * @param outputToStrFunction A function to convert the output to a string
   * @param outputToTaskIdAndToLogFunction A function to convert the output to a task id and a boolean indicating whether to log the output
   * @param concatenateRawOutputsIfTaskIdExists Whether to concatenate the raw outputs if a task id exists
   * @param stream Enable compatibility with streaming input
   * @param rest Any other data to log
   * @returns The logged event
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
    outputToTaskIdAndToLogFunction,
    concatenateRawOutputsIfTaskIdExists,
    stream,
    ...rest
  }: LogEvent) {
    const logEventData = {
      // The UTC timestamp rounded to the second
      client_created_at: Math.floor(Date.now() / 1000),
      // Metadata
      project_id: this.projectId,
      session_id: sessionId || uuidv4(),
      task_id: taskId || uuidv4(),
      // Input
      input: input,
      raw_input: rawInput || input,
      raw_input_type_name: typeof rawInput,
      // Output
      output: output || this.context,
      raw_output: rawOutput || output,
      raw_output_type_name: typeof rawOutput,
      // Other
      ...rest,
    };

    this.logQueue.push(logEventData);
    // Trigger sendBatch after a delay (500ms by default)
    this.debouncedProcessQueue();
    return logEventData;
  }

  /**
   * Send a batch of log events to Phospho
   */
  async sendBatch() {
    try {
      const url = `${BASE_URL}/log/${this.projectId}`;
      const data = {
        batched_log_events: this.logQueue,
      };

      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error posting log data:", error);
      throw error;
    }
  }

  // Used to delay the sending of the batch and to avoid sending too many requests
  private debouncedProcessQueue = debounce(() => this.sendBatch(), this.tick);

  wrap = (fn) => {
    // TODO
    return async (...args) => {
      const result = await fn(...args);
      this.log({
        input: args,
        output: result,
        sessionId: this.latestSessionId,
        taskId: this.latestTaskId,
      });
      return result;
    };
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
