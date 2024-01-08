import axios from "axios";
const { v4: uuidv4 } = require("uuid");

import { debounce, lookupEnvVariable } from "./utils";
import { PhosphoInit, LogEvent } from "./types";

const DEFAULT_API_BASE_URL = "https://api.phospho.ai";
const DEFAULT_API_VERSION = "/v0";
const BASE_URL = DEFAULT_API_BASE_URL + DEFAULT_API_VERSION;

class Phospho {
  apiKey: string;
  projectId: string;
  tick: number = 500;
  context: any;

  logQueue: any[] = [];

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

  private debouncedProcessQueue = debounce(() => this.sendBatch(), this.tick);
}

export default Phospho;
