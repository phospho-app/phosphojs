"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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

// src/config.ts
var DEFAULT_API_BASE_URL, DEFAULT_API_VERSION, BASE_URL;
var init_config = __esm({
  "src/config.ts"() {
    DEFAULT_API_BASE_URL = "https://api.phospho.ai";
    DEFAULT_API_VERSION = "/v2";
    BASE_URL = DEFAULT_API_BASE_URL + DEFAULT_API_VERSION;
  }
});

// node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/dotenv/package.json"(exports, module) {
    module.exports = {
      name: "dotenv",
      version: "16.3.1",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        "lint-readme": "standard-markdown",
        pretest: "npm run lint && npm run dts-check",
        test: "tap tests/*.js --100 -Rspec",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      funding: "https://github.com/motdotla/dotenv?sponsor=1",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@definitelytyped/dtslint": "^0.0.133",
        "@types/node": "^18.11.3",
        decache: "^4.6.1",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-markdown": "^7.1.0",
        "standard-version": "^9.5.0",
        tap: "^16.3.0",
        tar: "^6.1.11",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports, module) {
    var fs = __require("fs");
    var path = __require("path");
    var os = __require("os");
    var crypto = __require("crypto");
    var packageJson = require_package();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    __name(parse, "parse");
    function _parseVault(options) {
      const vaultPath = _vaultPath(options);
      const result = DotenvModule.configDotenv({ path: vaultPath });
      if (!result.parsed) {
        throw new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    __name(_parseVault, "_parseVault");
    function _log(message) {
      console.log(`[dotenv@${version}][INFO] ${message}`);
    }
    __name(_log, "_log");
    function _warn(message) {
      console.log(`[dotenv@${version}][WARN] ${message}`);
    }
    __name(_warn, "_warn");
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    __name(_debug, "_debug");
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    __name(_dotenvKey, "_dotenvKey");
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          throw new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenv.org/vault/.env.vault?environment=development");
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        throw new Error("INVALID_DOTENV_KEY: Missing key part");
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        throw new Error("INVALID_DOTENV_KEY: Missing environment part");
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        throw new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
      }
      return { ciphertext, key };
    }
    __name(_instructions, "_instructions");
    function _vaultPath(options) {
      let dotenvPath = path.resolve(process.cwd(), ".env");
      if (options && options.path && options.path.length > 0) {
        dotenvPath = options.path;
      }
      return dotenvPath.endsWith(".vault") ? dotenvPath : `${dotenvPath}.vault`;
    }
    __name(_vaultPath, "_vaultPath");
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    __name(_resolveHome, "_resolveHome");
    function _configVault(options) {
      _log("Loading env from encrypted .env.vault");
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    __name(_configVault, "_configVault");
    function configDotenv(options) {
      let dotenvPath = path.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      if (options) {
        if (options.path != null) {
          dotenvPath = _resolveHome(options.path);
        }
        if (options.encoding != null) {
          encoding = options.encoding;
        }
      }
      try {
        const parsed = DotenvModule.parse(fs.readFileSync(dotenvPath, { encoding }));
        let processEnv = process.env;
        if (options && options.processEnv != null) {
          processEnv = options.processEnv;
        }
        DotenvModule.populate(processEnv, parsed, options);
        return { parsed };
      } catch (e) {
        if (debug) {
          _debug(`Failed to load ${dotenvPath} ${e.message}`);
        }
        return { error: e };
      }
    }
    __name(configDotenv, "configDotenv");
    function config(options) {
      const vaultPath = _vaultPath(options);
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      if (!fs.existsSync(vaultPath)) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    __name(config, "config");
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.slice(0, 12);
      const authTag = ciphertext.slice(-16);
      ciphertext = ciphertext.slice(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const msg = "INVALID_DOTENV_KEY: It must be 64 characters long (or more)";
          throw new Error(msg);
        } else if (decryptionFailed) {
          const msg = "DECRYPTION_FAILED: Please check your DOTENV_KEY";
          throw new Error(msg);
        } else {
          console.error("Error: ", error.code);
          console.error("Error: ", error.message);
          throw error;
        }
      }
    }
    __name(decrypt, "decrypt");
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        throw new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    __name(populate, "populate");
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config,
      decrypt,
      parse,
      populate
    };
    module.exports.configDotenv = DotenvModule.configDotenv;
    module.exports._configVault = DotenvModule._configVault;
    module.exports._parseVault = DotenvModule._parseVault;
    module.exports.config = DotenvModule.config;
    module.exports.decrypt = DotenvModule.decrypt;
    module.exports.parse = DotenvModule.parse;
    module.exports.populate = DotenvModule.populate;
    module.exports = DotenvModule;
  }
});

// src/instrumentation.ts
var _sdknode = require('@opentelemetry/sdk-node');
var _exportertraceotlphttp = require('@opentelemetry/exporter-trace-otlp-http');
var _instrumentationopenai = require('@traceloop/instrumentation-openai');
var _sdktracenode = require('@opentelemetry/sdk-trace-node');
var _instrumentation = require('@opentelemetry/instrumentation');
var _sdktracebase = require('@opentelemetry/sdk-trace-base');
var require_instrumentation = __commonJS({
  "src/instrumentation.ts"(exports) {
    init_config();
    require_main().config();
    var provider = new (0, _sdktracenode.NodeTracerProvider)();
    _instrumentation.registerInstrumentations.call(void 0, {
      instrumentations: [
        new (0, _instrumentationopenai.OpenAIInstrumentation)()
      ]
    });
    if (!process.env.PHOSPHO_PROJECT_ID) {
      throw new Error("PHOSPHO_PROJECT_ID environment variable is not set");
    }
    if (!process.env.PHOSPHO_API_KEY) {
      throw new Error("PHOSPHO_API_KEY environment variable is not set");
    }
    var traceExporter = new (0, _exportertraceotlphttp.OTLPTraceExporter)({
      url: `${BASE_URL}/log/${process.env.PHOSPHO_PROJECT_ID}/opentelemetry`,
      headers: { Authorization: `Bearer ${process.env.PHOSPHO_API_KEY}`, "Content-Type": "application/json" }
    });
    provider.addSpanProcessor(new (0, _sdktracebase.SimpleSpanProcessor)(traceExporter));
    provider.register();
    var sdk = new (0, _sdknode.NodeSDK)({ traceExporter });
    (() => __async(exports, null, function* () {
      try {
        yield sdk.start();
        console.log("Phospho initialised...");
      } catch (error) {
        console.error(error);
      }
    }))();
    process.on("SIGINT", () => __async(exports, null, function* () {
      try {
        yield sdk.shutdown();
        console.log("Phospho disconnected.");
      } catch (error) {
        console.error(error);
      } finally {
        process.exit(0);
      }
    }));
  }
});

// src/user-feedback.ts
init_config();
var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);
var sendUserFeedback = /* @__PURE__ */ __name((_0) => __async(void 0, [_0], function* ({
  projectId,
  taskId,
  flag,
  notes,
  source,
  rawFlag,
  rawFlagToFlag,
  baseUrl
}) {
  if (!projectId) {
    console.warn(
      "projectId must be specified when calling user_feedback. Nothing logged"
    );
    return;
  }
  if (!baseUrl) {
    baseUrl = BASE_URL;
  }
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
  const updatedTask = yield _axios2.default.post(`${baseUrl}/tasks/${taskId}/flag`, {
    flag,
    notes,
    source,
    project_id: projectId
  }).then((response) => {
    return response.data;
  });
  return updatedTask;
}), "sendUserFeedback");

// src/phospho.ts

var _crypto = require('crypto');

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
var detectUsageFromInputOutput = /* @__PURE__ */ __name((input, output) => {
  var _a, _b;
  if (typeof output === "object") {
    if (output == null ? void 0 : output.usage) {
      return output.usage;
    }
    if ((_b = (_a = output == null ? void 0 : output.chat) == null ? void 0 : _a.completion) == null ? void 0 : _b.chunk) {
      return { completion_tokens: 1 };
    }
  }
  return null;
}, "detectUsageFromInputOutput");
var detectSystemPromptFromInputOutput = /* @__PURE__ */ __name((input, output) => {
  var _a, _b;
  if (typeof input === "object") {
    if (input == null ? void 0 : input.messages) {
      const messages = input.messages;
      if (Array.isArray(messages) && messages.length > 0) {
        if (((_a = messages[0]) == null ? void 0 : _a.role) === "system") {
          return (_b = messages[0]) == null ? void 0 : _b.content;
        }
      }
    }
    if (input == null ? void 0 : input.system) {
      return input.system;
    }
  }
  return null;
}, "detectSystemPromptFromInputOutput");
var detectModelFromInputOutput = /* @__PURE__ */ __name((input, output) => {
  if (typeof output === "object") {
    if (output == null ? void 0 : output.model) {
      return output.model;
    }
  }
  if (typeof input === "object") {
    if (input == null ? void 0 : input.model) {
      return input.model;
    }
  }
  return null;
}, "detectModelFromInputOutput");
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
var extractMetadataFromInputOutput = /* @__PURE__ */ __name(({
  input,
  output,
  inputOutputToUsageFunction
}) => {
  const usage = inputOutputToUsageFunction ? inputOutputToUsageFunction(input, output) : detectUsageFromInputOutput(input, output);
  const model = detectModelFromInputOutput(input, output);
  const systemPrompt = detectSystemPromptFromInputOutput(input, output);
  const metadata = {
    usage,
    model,
    system_prompt: systemPrompt
  };
  const filteredMetadata = Object.keys(metadata).reduce((acc, key) => {
    if (metadata[key] !== null) {
      acc[key] = metadata[key];
    }
    return acc;
  }, {});
  return filteredMetadata;
}, "extractMetadataFromInputOutput");

// src/phospho.ts
init_config();
var import_instrumentation2 = __toESM(require_instrumentation());
var _Phospho = class _Phospho {
  constructor() {
    this.tick = 500;
    this.baseUrl = BASE_URL;
    // context: any;
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
      return sendUserFeedback({
        projectId: this.projectId,
        taskId,
        flag,
        notes,
        source,
        rawFlag,
        rawFlagToFlag,
        baseUrl: this.baseUrl
      });
    }, "userFeedback");
  }
  // constructor(context?) {
  //   this.context = context;
  // }
  init({ apiKey, projectId, tick, baseUrl } = {}) {
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
    if (baseUrl)
      this.baseUrl = baseUrl;
  }
  /**
   * Generate a new session id
   */
  newSession() {
    this.latestSessionId = _crypto.randomUUID.call(void 0, );
    return this.latestSessionId;
  }
  /**
   * Generate a new task id
   */
  newTask() {
    this.latestTaskId = _crypto.randomUUID.call(void 0, );
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
      const metadataToLog = extractMetadataFromInputOutput({
        input,
        output,
        // TODO : Add support for custom functions
        inputOutputToUsageFunction: null
      });
      taskId = taskId || _crypto.randomUUID.call(void 0, );
      if (!sessionId)
        sessionId = null;
      this.latestSessionId = sessionId;
      this.latestTaskId = taskId;
      const logContent = __spreadValues(__spreadValues({
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
      }, metadataToLog), rest);
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
      const logTaskId = taskId || _crypto.randomUUID.call(void 0, );
      const phospho2 = this;
      if (output[Symbol.asyncIterator]) {
        const originalOutput = output[Symbol.asyncIterator];
        output[Symbol.asyncIterator] = function() {
          return __asyncGenerator(this, null, function* () {
            const iterator = originalOutput.call(output);
            while (true) {
              const { done, value } = yield new __await(iterator.next());
              if (done) {
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
                break;
              }
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
        const url = `${this.baseUrl}/log/${this.projectId}`;
        const data = {
          batched_log_events: batchedLogContent
        };
        const response = yield _axios2.default.post(url, data, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json"
          }
        }).then((response2) => {
          batchedLogEvents.forEach((logEvent) => {
            this.logQueue.delete(logEvent.id);
          });
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
var phospho = new phospho_default();
var src_default = phospho;




exports.default = src_default; exports.phospho = phospho; exports.sendUserFeedback = sendUserFeedback;
