"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; } var _class;var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/context.ts
var _unctx = require('unctx');
var user = _unctx.createContext.call(void 0, {
  asyncContext: true
});
var context_default = {
  user
};

// src/phospho.ts
var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);

// src/utils.ts
var lookupEnvVariable = /* @__PURE__ */ __name((variable) => {
  if (typeof process !== "undefined" && _optionalChain([process, 'access', _ => _.env, 'optionalAccess', _2 => _2[variable]])) {
    return process.env[variable];
  }
  if (typeof Deno !== "undefined" && _optionalChain([Deno, 'access', _3 => _3.env, 'optionalAccess', _4 => _4.get, 'call', _5 => _5(variable)])) {
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
var Phospho = (_class = class {
  static {
    __name(this, "Phospho");
  }
  
  
  __init() {this.tick = 500}
  
  __init2() {this.logQueue = []}
  constructor(context) {;_class.prototype.__init.call(this);_class.prototype.__init2.call(this);_class.prototype.__init3.call(this);
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
      const response = await _axios2.default.post(url, data, {
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
  __init3() {this.debouncedProcessQueue = debounce(() => this.sendBatch(), this.tick)}
}, _class);
var phospho_default = Phospho;

// src/index.ts
var phospho = new phospho_default(context_default);
var src_default = phospho;


exports.default = src_default;

module.exports = exports.default;
