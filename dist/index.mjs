var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/context.ts
import { createContext } from "unctx";
import { AsyncLocalStorage } from "async_hooks";
var user = createContext({
  asyncContext: true,
  AsyncLocalStorage
});
var context_default = {
  user
};

// src/phospho.ts
import axios from "axios";

// src/utils.ts
var lookupEnvVariable = /* @__PURE__ */ __name((variable) => {
  var _a, _b;
  if (typeof process !== "undefined" && ((_a = process.env) == null ? void 0 : _a[variable])) {
    return process.env[variable];
  }
  if (typeof Deno !== "undefined" && ((_b = Deno.env) == null ? void 0 : _b.get(variable))) {
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
var { v4: uuidv4 } = __require("uuid");
var DEFAULT_API_BASE_URL = "https://api.phospho.ai";
var DEFAULT_API_VERSION = "/v0";
var BASE_URL = DEFAULT_API_BASE_URL + DEFAULT_API_VERSION;
var _Phospho = class _Phospho {
  constructor(context) {
    this.tick = 500;
    this.logQueue = [];
    this.debouncedProcessQueue = debounce(() => this.sendBatch(), this.tick);
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
  log(_a) {
    return __async(this, null, function* () {
      var _b = _a, {
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
        stream
      } = _b, rest = __objRest(_b, [
        "input",
        "output",
        "sessionId",
        "taskId",
        "rawInput",
        "rawOutput",
        "inputToStrFunction",
        "outputToStrFunction",
        "outputToTaskIdAndToLogFunction",
        "concatenateRawOutputsIfTaskIdExists",
        "stream"
      ]);
      const logEventData = __spreadValues({
        // The UTC timestamp rounded to the second
        client_created_at: Math.floor(Date.now() / 1e3),
        // Metadata
        project_id: this.projectId,
        session_id: sessionId || uuidv4(),
        task_id: taskId || uuidv4(),
        // Input
        input,
        raw_input: rawInput || input,
        raw_input_type_name: typeof rawInput,
        // Output
        output: output || this.context,
        raw_output: rawOutput || output,
        raw_output_type_name: typeof rawOutput
      }, rest);
      this.logQueue.push(logEventData);
      this.debouncedProcessQueue();
    });
  }
  sendBatch() {
    return __async(this, null, function* () {
      try {
        const url = `${BASE_URL}/log/${this.projectId}`;
        const data = {
          batched_log_events: this.logQueue
        };
        const response = yield axios.post(url, data, {
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
    });
  }
};
__name(_Phospho, "Phospho");
var Phospho = _Phospho;
var phospho_default = Phospho;

// src/index.ts
var phospho = new phospho_default(context_default);
var src_default = phospho;
export {
  src_default as default
};
