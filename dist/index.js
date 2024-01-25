"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __knownSymbol = (name, symbol) => {
  return (symbol = Symbol[name]) ? symbol : Symbol.for("Symbol." + name);
};
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
var __await = function(promise, isYieldStar) {
  this[0] = promise;
  this[1] = isYieldStar;
};
var __asyncGenerator = (__this, __arguments, generator) => {
  var resume = (k, v, yes, no) => {
    try {
      var x = generator[k](v), isAwait = (v = x.value) instanceof __await, done = x.done;
      Promise.resolve(isAwait ? v[0] : v).then((y) => isAwait ? resume(k === "return" ? k : "next", v[1] ? { done: y.done, value: y.value } : y, yes, no) : yes({ value: y, done })).catch((e) => resume("throw", e, yes, no));
    } catch (e) {
      no(e);
    }
  };
  var method = (k) => it[k] = (x) => new Promise((yes, no) => resume(k, x, yes, no));
  var it = {};
  return generator = generator.apply(__this, __arguments), it[__knownSymbol("asyncIterator")] = () => it, method("next"), method("throw"), method("return"), it;
};
var __forAwait = (obj, it, method) => (it = obj[__knownSymbol("asyncIterator")]) ? it.call(obj) : (obj = obj[__knownSymbol("iterator")](), it = {}, method = (key, fn) => (fn = obj[key]) && (it[key] = (arg) => new Promise((yes, no, done) => (arg = fn.call(obj, arg), done = arg.done, Promise.resolve(arg.value).then((value) => yes({ value, done }), no)))), method("next"), method("return"), it);

// src/context.ts
var _unctx = require('unctx');
var _async_hooks = require('async_hooks');
var user = _unctx.createContext.call(void 0, {
  asyncContext: true,
  AsyncLocalStorage: _async_hooks.AsyncLocalStorage
});
var context_default = {
  user
};

// src/phospho.ts
var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);
var _uuid = require('uuid');

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

// src/extractor.ts
var detectStrFromInput = /* @__PURE__ */ __name((input) => {
  var _a;
  if (typeof input === "string") {
    return input;
  }
  if (typeof input === "object") {
    const inputMessages = input == null ? void 0 : input.messages;
    if (inputMessages) {
      const lastMessage = (_a = inputMessages[inputMessages.length - 1]) == null ? void 0 : _a.content;
      if (lastMessage) {
        return lastMessage;
      }
    }
    return JSON.stringify(input);
  }
  return input.toString();
}, "detectStrFromInput");
var detectStrFromOutput = /* @__PURE__ */ __name((output) => {
  var _a, _b, _c, _d;
  if (typeof output === "string") {
    return output;
  }
  if (typeof output === "object") {
    const choiceMessageContent = (_b = (_a = output == null ? void 0 : output.choices[0]) == null ? void 0 : _a.message) == null ? void 0 : _b.content;
    if (choiceMessageContent !== void 0)
      return choiceMessageContent;
    const choiceDelta = (_c = output == null ? void 0 : output.choices[0]) == null ? void 0 : _c.delta;
    if (choiceDelta !== void 0) {
      const choiceDeltaContent = choiceDelta == null ? void 0 : choiceDelta.content;
      if (choiceDeltaContent !== void 0)
        return choiceDeltaContent;
      const choiceFinishReason = (_d = output == null ? void 0 : output.choices[0]) == null ? void 0 : _d.finish_reason;
      if (choiceFinishReason !== void 0)
        return "";
    }
    return JSON.stringify(output);
  }
  return output.toString();
}, "detectStrFromOutput");
var getInputOutput = /* @__PURE__ */ __name(({
  input,
  output,
  rawInput,
  rawOutput,
  inputToStrFunction,
  outputToStrFunction
}) => {
  if (!inputToStrFunction) {
    inputToStrFunction = detectStrFromInput;
  }
  if (!outputToStrFunction) {
    outputToStrFunction = detectStrFromOutput;
  }
  let inputToLog = null;
  let rawInputToLog = null;
  let outputToLog = null;
  let rawOutputToLog = null;
  rawInputToLog = input;
  if (typeof input === "string") {
    inputToLog = input;
  } else {
    inputToLog = inputToStrFunction(input);
  }
  if (rawInput) {
    rawInputToLog = rawInput;
  }
  rawOutputToLog = output;
  if (typeof output === "string") {
    outputToLog = output;
  } else if (output) {
    outputToLog = outputToStrFunction(output);
  }
  if (rawOutput) {
    rawOutputToLog = rawOutput;
  }
  return {
    inputToLog,
    rawInputToLog,
    outputToLog,
    rawOutputToLog
  };
}, "getInputOutput");

// src/phospho.ts
var DEFAULT_API_BASE_URL = "https://api.phospho.ai";
var DEFAULT_API_VERSION = "/v2";
var BASE_URL = DEFAULT_API_BASE_URL + DEFAULT_API_VERSION;
var _Phospho = class _Phospho {
  constructor(context) {
    this.tick = 500;
    // Queue of log events as a Mapping of {taskId: logEvent}
    this.logQueue = /* @__PURE__ */ new Map();
    this.latestTaskId = null;
    this.latestSessionId = null;
    // Used to delay the sending of the batch and to avoid sending too many requests
    this.debouncedProcessQueue = debounce(() => this.sendBatch(), this.tick);
    this.wrap = /* @__PURE__ */ __name((fn) => {
      if (typeof fn === "function") {
        return (...args) => __async(this, null, function* () {
          const result = yield fn(...args);
          this.log({
            input: args,
            output: result
          });
          return result;
        });
      }
    }, "wrap");
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
    this.userFeedback = /* @__PURE__ */ __name(({
      taskId,
      flag,
      notes,
      source,
      rawFlag,
      rawFlagToFlag
    }) => {
      if (!flag) {
        if (!rawFlag) {
          console.warn(
            "Either flag or raw_flag must be specified when calling user_feedback. Nothing logged"
          );
          return;
        } else {
          if (!rawFlagToFlag) {
            rawFlagToFlag = /* @__PURE__ */ __name((rawFlag2) => {
              if (["success", "\u{1F44D}", "\u{1F642}", "\u{1F600}"].includes(rawFlag2)) {
                return "success";
              } else {
                return "failure";
              }
            }, "rawFlagToFlag");
          }
          flag = rawFlagToFlag(rawFlag);
        }
      }
      const updatedTask = _axios2.default.post(
        `${BASE_URL}/task/${taskId}`,
        {
          flag,
          notes,
          source
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json"
          }
        }
      ).then((response) => {
        return response.data;
      });
      return updatedTask;
    }, "userFeedback");
    this.context = context;
  }
  init({ apiKey, projectId, tick } = {}) {
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
    if (tick)
      this.tick = tick;
  }
  /**
   * Generate a new session id
   */
  newSession() {
    this.latestSessionId = _uuid.v4.call(void 0, );
    return this.latestSessionId;
  }
  /**
   * Generate a new task id
   */
  newTask() {
    this.latestTaskId = _uuid.v4.call(void 0, );
    return this.latestTaskId;
  }
  _log(_a) {
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
        concatenateRawOutputsIfTaskIdExists,
        toLog
      } = _b, rest = __objRest(_b, [
        "input",
        "output",
        "sessionId",
        "taskId",
        "rawInput",
        "rawOutput",
        "inputToStrFunction",
        "outputToStrFunction",
        "concatenateRawOutputsIfTaskIdExists",
        "toLog"
      ]);
      if (input instanceof Promise) {
        input = yield input;
      }
      if (output instanceof Promise) {
        output = yield output;
      }
      const extractedInputOutputToLog = getInputOutput({
        input,
        output,
        rawInput,
        rawOutput,
        inputToStrFunction,
        outputToStrFunction
      });
      taskId = taskId || _uuid.v4.call(void 0, );
      if (!sessionId)
        sessionId = null;
      this.latestSessionId = sessionId;
      this.latestTaskId = taskId;
      const logContent = __spreadValues({
        // The UTC timestamp rounded to the second
        client_created_at: Math.floor(Date.now() / 1e3),
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
        raw_output_type_name: typeof extractedInputOutputToLog.rawOutputToLog
      }, rest);
      if (this.logQueue.has(taskId)) {
        const existingLogEvent = this.logQueue.get(taskId);
        let newOutput = logContent.output;
        let newRawOutput = logContent.raw_output;
        if (typeof existingLogEvent.content.output === "string" && typeof logContent.output === "string") {
          newOutput = existingLogEvent.content.output + logContent.output;
        } else if (logContent.output === null) {
          newOutput = existingLogEvent.content.output.toString();
        }
        if (concatenateRawOutputsIfTaskIdExists === void 0)
          concatenateRawOutputsIfTaskIdExists = true;
        if (concatenateRawOutputsIfTaskIdExists) {
          if (Array.isArray(existingLogEvent.content.raw_output)) {
            newRawOutput = [
              ...existingLogEvent.content.raw_output,
              logContent.raw_output
            ];
          } else {
            newRawOutput = [
              existingLogEvent.content.raw_output,
              logContent.raw_output
            ];
          }
        }
        logContent.output = newOutput;
        logContent.raw_output = newRawOutput;
      }
      this.logQueue.set(taskId, { id: taskId, content: logContent, toLog });
      this.debouncedProcessQueue();
      return logContent;
    });
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
  log(_c) {
    return __async(this, null, function* () {
      var _d = _c, {
        input,
        output,
        sessionId,
        taskId,
        rawInput,
        rawOutput,
        inputToStrFunction,
        outputToStrFunction,
        concatenateRawOutputsIfTaskIdExists,
        stream
      } = _d, rest = __objRest(_d, [
        "input",
        "output",
        "sessionId",
        "taskId",
        "rawInput",
        "rawOutput",
        "inputToStrFunction",
        "outputToStrFunction",
        "concatenateRawOutputsIfTaskIdExists",
        "stream"
      ]);
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
      if (!stream) {
        return this._log(__spreadValues({
          input,
          output,
          sessionId,
          taskId,
          rawInput,
          rawOutput,
          inputToStrFunction,
          outputToStrFunction,
          concatenateRawOutputsIfTaskIdExists,
          toLog: true
        }, rest));
      }
      if (!(output[Symbol.asyncIterator] || output[Symbol.iterator])) {
        throw new Error(
          `Logging output ${JSON.stringify(
            output
          )} is not supported with stream=True. Pass an Symbol.asynIterator or Symbol.iterator instead`
        );
      }
      const logTaskId = taskId || _uuid.v4.call(void 0, );
      const phospho2 = this;
      if (output[Symbol.asyncIterator]) {
        const originalOutput = output[Symbol.asyncIterator];
        output[Symbol.asyncIterator] = function() {
          return __asyncGenerator(this, null, function* () {
            const iterator = originalOutput.call(output);
            try {
              for (var iter = __forAwait(iterator), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
                const value = temp.value;
                phospho2._log(__spreadValues({
                  input,
                  output: value,
                  sessionId,
                  taskId: logTaskId,
                  rawInput,
                  rawOutput,
                  inputToStrFunction,
                  outputToStrFunction,
                  concatenateRawOutputsIfTaskIdExists,
                  toLog: false
                }, rest));
                yield value;
              }
            } catch (temp) {
              error = [temp];
            } finally {
              try {
                more && (temp = iter.return) && (yield new __await(temp.call(iter)));
              } finally {
                if (error)
                  throw error[0];
              }
            }
            phospho2._log(__spreadValues({
              input,
              output: null,
              sessionId,
              taskId: logTaskId,
              rawInput,
              rawOutput,
              inputToStrFunction,
              outputToStrFunction,
              concatenateRawOutputsIfTaskIdExists,
              toLog: true
            }, rest));
          });
        };
      }
      if (output[Symbol.iterator]) {
        const originalOutput = output[Symbol.iterator];
        output[Symbol.iterator] = function* () {
          const iterator = originalOutput.call(output);
          for (const value of iterator) {
            phospho2._log(__spreadValues({
              input,
              output: value,
              sessionId,
              taskId: logTaskId,
              rawInput,
              rawOutput,
              inputToStrFunction,
              outputToStrFunction,
              concatenateRawOutputsIfTaskIdExists,
              toLog: false
            }, rest));
            yield value;
          }
          phospho2._log(__spreadValues({
            input,
            output: null,
            sessionId,
            taskId: logTaskId,
            rawInput,
            rawOutput,
            inputToStrFunction,
            outputToStrFunction,
            concatenateRawOutputsIfTaskIdExists,
            toLog: true
          }, rest));
        };
      }
    });
  }
  /**
   * Send a batch of log events to Phospho
   */
  sendBatch() {
    return __async(this, null, function* () {
      try {
        if (this.logQueue.size === 0) {
          return;
        }
        const batchedLogEvents = Array.from(this.logQueue.values());
        batchedLogEvents.filter((logEvent) => logEvent.toLog);
        if (batchedLogEvents.length === 0) {
          return;
        }
        const batchedLogContent = batchedLogEvents.map(
          (logEvent) => logEvent.content
        );
        const url = `${BASE_URL}/log/${this.projectId}`;
        const data = {
          batched_log_events: batchedLogContent
        };
        const response = yield _axios2.default.post(url, data, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json"
          }
        });
        return;
      } catch (error) {
        console.warn("Error sending batch to Phospho", error);
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


exports.default = src_default;

module.exports = exports.default;
