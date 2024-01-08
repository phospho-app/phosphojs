var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/context.ts
import { createContext } from "unctx";
var user = createContext({
  asyncContext: true
});
var context_default = {
  user
};

// src/phospho.ts
import axios from "axios";

// src/utils.ts
var lookupEnvVariable = /* @__PURE__ */ __name((variable) => {
  if (typeof process !== "undefined" && process.env?.[variable]) {
    return process.env[variable];
  }
  if (typeof Deno !== "undefined" && Deno.env?.get(variable)) {
    return Deno.env.get(variable);
  }
  return void 0;
}, "lookupEnvVariable");
var debounce = /* @__PURE__ */ __name((func, timeout = 500) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(void 0, args);
    }, timeout);
  };
}, "debounce");

// src/phospho.ts
var DEFAULT_API_BASE_URL = "https://api.phospho.ai";
var DEFAULT_API_VERSION = "/v0";
var BASE_URL = DEFAULT_API_BASE_URL + DEFAULT_API_VERSION;
var Phospho = class {
  static {
    __name(this, "Phospho");
  }
  apiKey;
  projectId;
  tick = 500;
  context;
  logQueue = [];
  constructor(context) {
    this.init({
      apiKey: lookupEnvVariable("PHOSPHO_API_KEY"),
      projectId: lookupEnvVariable("PHOSPHO_PROJECT_ID")
    });
    this.context = context;
  }
  init({ apiKey, projectId, tick } = {}) {
    if (apiKey)
      this.apiKey = apiKey;
    if (projectId)
      this.projectId = projectId;
    if (tick)
      this.tick = tick;
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
  }) {
    const logEventData = {
      // The UTC timestamp rounded to the second
      client_created_at: Math.floor(Date.now() / 1e3),
      // Metadata
      project_id: this.projectId,
      session_id: sessionId || crypto.randomUUID(),
      task_id: taskId || crypto.randomUUID(),
      // Input
      input,
      raw_input: rawInput || input,
      raw_input_type_name: typeof rawInput,
      // Output
      output: output || this.context,
      raw_output: rawOutput || output,
      raw_output_type_name: typeof rawOutput,
      // Other
      ...rest
    };
    this.logQueue.push(logEventData);
    this.debouncedProcessQueue();
  }
  async sendBatch() {
    try {
      const url = `${BASE_URL}/log/${this.projectId}`;
      const data = {
        batched_log_events: this.logQueue
      };
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error posting log data:", error);
      throw error;
    }
  }
  debouncedProcessQueue = debounce(() => this.sendBatch(), this.tick);
};
var phospho_default = Phospho;

// src/index.ts
var phospho = new phospho_default(context_default);
var src_default = phospho;
export {
  src_default as default
};
