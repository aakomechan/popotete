var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../../.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../../.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../../.npm/_npx/32026684e21afda6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../../.npm/_npx/32026684e21afda6/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../../.npm/_npx/32026684e21afda6/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var isWorkerdProcessV2 = globalThis.Cloudflare.compatibilityFlags.enable_nodejs_process_v2;
var unenvProcess = new Process({
  env: globalProcess.env,
  // `hrtime` is only available from workerd process v2
  hrtime: isWorkerdProcessV2 ? workerdProcess.hrtime : hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  // Always implemented by workerd
  env,
  // Only implemented in workerd v2
  hrtime: hrtime3,
  // Always implemented by workerd
  nextTick
} = unenvProcess;
var {
  _channel,
  _disconnect,
  _events,
  _eventsCount,
  _handleQueue,
  _maxListeners,
  _pendingMessage,
  _send,
  assert: assert2,
  disconnect,
  mainModule
} = unenvProcess;
var {
  // @ts-expect-error `_debugEnd` is missing typings
  _debugEnd,
  // @ts-expect-error `_debugProcess` is missing typings
  _debugProcess,
  // @ts-expect-error `_exiting` is missing typings
  _exiting,
  // @ts-expect-error `_fatalException` is missing typings
  _fatalException,
  // @ts-expect-error `_getActiveHandles` is missing typings
  _getActiveHandles,
  // @ts-expect-error `_getActiveRequests` is missing typings
  _getActiveRequests,
  // @ts-expect-error `_kill` is missing typings
  _kill,
  // @ts-expect-error `_linkedBinding` is missing typings
  _linkedBinding,
  // @ts-expect-error `_preload_modules` is missing typings
  _preload_modules,
  // @ts-expect-error `_rawDebug` is missing typings
  _rawDebug,
  // @ts-expect-error `_startProfilerIdleNotifier` is missing typings
  _startProfilerIdleNotifier,
  // @ts-expect-error `_stopProfilerIdleNotifier` is missing typings
  _stopProfilerIdleNotifier,
  // @ts-expect-error `_tickCallback` is missing typings
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  availableMemory,
  // @ts-expect-error `binding` is missing typings
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  // @ts-expect-error `domain` is missing typings
  domain,
  emit,
  emitWarning,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  // @ts-expect-error `initgroups` is missing typings
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  memoryUsage,
  // @ts-expect-error `moduleLoadList` is missing typings
  moduleLoadList,
  off,
  on,
  once,
  // @ts-expect-error `openStdin` is missing typings
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  // @ts-expect-error `reallyExit` is missing typings
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = isWorkerdProcessV2 ? workerdProcess : unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../../.npm/_npx/32026684e21afda6/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// showdown-extracted-data.ts
var EXTRACTED_TYPE_CHART = {
  "normal": {
    "normal": 1,
    "fire": 1,
    "water": 1,
    "grass": 1,
    "electric": 1,
    "ice": 1,
    "fighting": 1,
    "poison": 1,
    "ground": 1,
    "flying": 1,
    "psychic": 1,
    "bug": 1,
    "rock": 0.5,
    "ghost": 0,
    "dragon": 1,
    "dark": 1,
    "steel": 0.5,
    "fairy": 1
  },
  "fire": {
    "normal": 1,
    "fire": 0.5,
    "water": 0.5,
    "grass": 2,
    "electric": 1,
    "ice": 2,
    "fighting": 1,
    "poison": 1,
    "ground": 1,
    "flying": 1,
    "psychic": 1,
    "bug": 2,
    "rock": 0.5,
    "ghost": 1,
    "dragon": 0.5,
    "dark": 1,
    "steel": 2,
    "fairy": 1
  },
  "water": {
    "normal": 1,
    "fire": 2,
    "water": 0.5,
    "grass": 0.5,
    "electric": 1,
    "ice": 1,
    "fighting": 1,
    "poison": 1,
    "ground": 2,
    "flying": 1,
    "psychic": 1,
    "bug": 1,
    "rock": 2,
    "ghost": 1,
    "dragon": 0.5,
    "dark": 1,
    "steel": 1,
    "fairy": 1
  },
  "grass": {
    "normal": 1,
    "fire": 0.5,
    "water": 2,
    "grass": 0.5,
    "electric": 1,
    "ice": 1,
    "fighting": 1,
    "poison": 0.5,
    "ground": 2,
    "flying": 0.5,
    "psychic": 1,
    "bug": 0.5,
    "rock": 2,
    "ghost": 1,
    "dragon": 0.5,
    "dark": 1,
    "steel": 0.5,
    "fairy": 1
  },
  "electric": {
    "normal": 1,
    "fire": 1,
    "water": 2,
    "grass": 0.5,
    "electric": 0.5,
    "ice": 1,
    "fighting": 1,
    "poison": 1,
    "ground": 0,
    "flying": 2,
    "psychic": 1,
    "bug": 1,
    "rock": 1,
    "ghost": 1,
    "dragon": 0.5,
    "dark": 1,
    "steel": 1,
    "fairy": 1
  },
  "ice": {
    "normal": 1,
    "fire": 0.5,
    "water": 0.5,
    "grass": 2,
    "electric": 1,
    "ice": 0.5,
    "fighting": 1,
    "poison": 1,
    "ground": 2,
    "flying": 2,
    "psychic": 1,
    "bug": 1,
    "rock": 1,
    "ghost": 1,
    "dragon": 2,
    "dark": 1,
    "steel": 0.5,
    "fairy": 1
  },
  "fighting": {
    "normal": 2,
    "fire": 1,
    "water": 1,
    "grass": 1,
    "electric": 1,
    "ice": 2,
    "fighting": 1,
    "poison": 0.5,
    "ground": 1,
    "flying": 0.5,
    "psychic": 0.5,
    "bug": 0.5,
    "rock": 2,
    "ghost": 0,
    "dragon": 1,
    "dark": 2,
    "steel": 2,
    "fairy": 0.5
  },
  "poison": {
    "normal": 1,
    "fire": 1,
    "water": 1,
    "grass": 2,
    "electric": 1,
    "ice": 1,
    "fighting": 1,
    "poison": 0.5,
    "ground": 0.5,
    "flying": 1,
    "psychic": 1,
    "bug": 1,
    "rock": 0.5,
    "ghost": 0.5,
    "dragon": 1,
    "dark": 1,
    "steel": 0,
    "fairy": 2
  },
  "ground": {
    "normal": 1,
    "fire": 2,
    "water": 1,
    "grass": 0.5,
    "electric": 2,
    "ice": 1,
    "fighting": 1,
    "poison": 2,
    "ground": 1,
    "flying": 0,
    "psychic": 1,
    "bug": 0.5,
    "rock": 2,
    "ghost": 1,
    "dragon": 1,
    "dark": 1,
    "steel": 2,
    "fairy": 1
  },
  "flying": {
    "normal": 1,
    "fire": 1,
    "water": 1,
    "grass": 2,
    "electric": 0.5,
    "ice": 1,
    "fighting": 2,
    "poison": 1,
    "ground": 1,
    "flying": 1,
    "psychic": 1,
    "bug": 2,
    "rock": 0.5,
    "ghost": 1,
    "dragon": 1,
    "dark": 1,
    "steel": 0.5,
    "fairy": 1
  },
  "psychic": {
    "normal": 1,
    "fire": 1,
    "water": 1,
    "grass": 1,
    "electric": 1,
    "ice": 1,
    "fighting": 2,
    "poison": 2,
    "ground": 1,
    "flying": 1,
    "psychic": 0.5,
    "bug": 1,
    "rock": 1,
    "ghost": 1,
    "dragon": 1,
    "dark": 0,
    "steel": 0.5,
    "fairy": 1
  },
  "bug": {
    "normal": 1,
    "fire": 0.5,
    "water": 1,
    "grass": 2,
    "electric": 1,
    "ice": 1,
    "fighting": 0.5,
    "poison": 0.5,
    "ground": 1,
    "flying": 0.5,
    "psychic": 2,
    "bug": 1,
    "rock": 1,
    "ghost": 0.5,
    "dragon": 1,
    "dark": 2,
    "steel": 0.5,
    "fairy": 0.5
  },
  "rock": {
    "normal": 1,
    "fire": 2,
    "water": 1,
    "grass": 1,
    "electric": 1,
    "ice": 2,
    "fighting": 0.5,
    "poison": 1,
    "ground": 0.5,
    "flying": 2,
    "psychic": 1,
    "bug": 2,
    "rock": 1,
    "ghost": 1,
    "dragon": 1,
    "dark": 1,
    "steel": 0.5,
    "fairy": 1
  },
  "ghost": {
    "normal": 0,
    "fire": 1,
    "water": 1,
    "grass": 1,
    "electric": 1,
    "ice": 1,
    "fighting": 1,
    "poison": 1,
    "ground": 1,
    "flying": 1,
    "psychic": 2,
    "bug": 1,
    "rock": 1,
    "ghost": 2,
    "dragon": 1,
    "dark": 0.5,
    "steel": 1,
    "fairy": 1
  },
  "dragon": {
    "normal": 1,
    "fire": 1,
    "water": 1,
    "grass": 1,
    "electric": 1,
    "ice": 1,
    "fighting": 1,
    "poison": 1,
    "ground": 1,
    "flying": 1,
    "psychic": 1,
    "bug": 1,
    "rock": 1,
    "ghost": 1,
    "dragon": 2,
    "dark": 1,
    "steel": 0.5,
    "fairy": 0
  },
  "dark": {
    "normal": 1,
    "fire": 1,
    "water": 1,
    "grass": 1,
    "electric": 1,
    "ice": 1,
    "fighting": 0.5,
    "poison": 1,
    "ground": 1,
    "flying": 1,
    "psychic": 2,
    "bug": 1,
    "rock": 1,
    "ghost": 2,
    "dragon": 1,
    "dark": 0.5,
    "steel": 1,
    "fairy": 0.5
  },
  "steel": {
    "normal": 1,
    "fire": 0.5,
    "water": 0.5,
    "grass": 1,
    "electric": 0.5,
    "ice": 2,
    "fighting": 1,
    "poison": 1,
    "ground": 1,
    "flying": 1,
    "psychic": 1,
    "bug": 1,
    "rock": 2,
    "ghost": 1,
    "dragon": 1,
    "dark": 1,
    "steel": 0.5,
    "fairy": 2
  },
  "fairy": {
    "normal": 1,
    "fire": 0.5,
    "water": 1,
    "grass": 1,
    "electric": 1,
    "ice": 1,
    "fighting": 2,
    "poison": 0.5,
    "ground": 1,
    "flying": 1,
    "psychic": 1,
    "bug": 1,
    "rock": 1,
    "ghost": 1,
    "dragon": 2,
    "dark": 2,
    "steel": 0.5,
    "fairy": 1
  }
};
var EXTRACTED_POKEDEX = [
  {
    "id": "bulbasaur",
    "name": "\u30D5\u30B7\u30AE\u30C0\u30CD",
    "nameEn": "Bulbasaur",
    "type": "grass",
    "type2": "poison",
    "baseStats": {
      "hp": 45,
      "atk": 49,
      "def": 49,
      "spa": 65,
      "spd": 65,
      "spe": 45
    },
    "abilities": [
      "overgrow",
      "chlorophyll"
    ]
  },
  {
    "id": "ivysaur",
    "name": "\u30D5\u30B7\u30AE\u30BD\u30A6",
    "nameEn": "Ivysaur",
    "type": "grass",
    "type2": "poison",
    "baseStats": {
      "hp": 60,
      "atk": 62,
      "def": 63,
      "spa": 80,
      "spd": 80,
      "spe": 60
    },
    "abilities": [
      "overgrow",
      "chlorophyll"
    ]
  },
  {
    "id": "venusaur",
    "name": "\u30D5\u30B7\u30AE\u30D0\u30CA",
    "nameEn": "Venusaur",
    "type": "grass",
    "type2": "poison",
    "baseStats": {
      "hp": 80,
      "atk": 82,
      "def": 83,
      "spa": 100,
      "spd": 100,
      "spe": 80
    },
    "abilities": [
      "overgrow",
      "chlorophyll"
    ]
  },
  {
    "id": "charmander",
    "name": "\u30D2\u30C8\u30AB\u30B2",
    "nameEn": "Charmander",
    "type": "fire",
    "baseStats": {
      "hp": 39,
      "atk": 52,
      "def": 43,
      "spa": 60,
      "spd": 50,
      "spe": 65
    },
    "abilities": [
      "blaze",
      "solarpower"
    ]
  },
  {
    "id": "charmeleon",
    "name": "\u30EA\u30B6\u30FC\u30C9",
    "nameEn": "Charmeleon",
    "type": "fire",
    "baseStats": {
      "hp": 58,
      "atk": 64,
      "def": 58,
      "spa": 80,
      "spd": 65,
      "spe": 80
    },
    "abilities": [
      "blaze",
      "solarpower"
    ]
  },
  {
    "id": "charizard",
    "name": "\u30EA\u30B6\u30FC\u30C9\u30F3",
    "nameEn": "Charizard",
    "type": "fire",
    "type2": "flying",
    "baseStats": {
      "hp": 78,
      "atk": 84,
      "def": 78,
      "spa": 109,
      "spd": 85,
      "spe": 100
    },
    "abilities": [
      "blaze",
      "solarpower"
    ]
  },
  {
    "id": "squirtle",
    "name": "\u30BC\u30CB\u30AC\u30E1",
    "nameEn": "Squirtle",
    "type": "water",
    "baseStats": {
      "hp": 44,
      "atk": 48,
      "def": 65,
      "spa": 50,
      "spd": 64,
      "spe": 43
    },
    "abilities": [
      "torrent",
      "raindish"
    ]
  },
  {
    "id": "wartortle",
    "name": "\u30AB\u30E1\u30FC\u30EB",
    "nameEn": "Wartortle",
    "type": "water",
    "baseStats": {
      "hp": 59,
      "atk": 63,
      "def": 80,
      "spa": 65,
      "spd": 80,
      "spe": 58
    },
    "abilities": [
      "torrent",
      "raindish"
    ]
  },
  {
    "id": "blastoise",
    "name": "\u30AB\u30E1\u30C3\u30AF\u30B9",
    "nameEn": "Blastoise",
    "type": "water",
    "baseStats": {
      "hp": 79,
      "atk": 83,
      "def": 100,
      "spa": 85,
      "spd": 105,
      "spe": 78
    },
    "abilities": [
      "torrent",
      "raindish"
    ]
  },
  {
    "id": "caterpie",
    "name": "\u30AD\u30E3\u30BF\u30D4\u30FC",
    "nameEn": "Caterpie",
    "type": "bug",
    "baseStats": {
      "hp": 45,
      "atk": 30,
      "def": 35,
      "spa": 20,
      "spd": 20,
      "spe": 45
    },
    "abilities": [
      "shielddust",
      "runaway"
    ]
  },
  {
    "id": "metapod",
    "name": "\u30C8\u30E9\u30F3\u30BB\u30EB",
    "nameEn": "Metapod",
    "type": "bug",
    "baseStats": {
      "hp": 50,
      "atk": 20,
      "def": 55,
      "spa": 25,
      "spd": 25,
      "spe": 30
    },
    "abilities": [
      "shedskin"
    ]
  },
  {
    "id": "butterfree",
    "name": "\u30D0\u30BF\u30D5\u30EA\u30FC",
    "nameEn": "Butterfree",
    "type": "bug",
    "type2": "flying",
    "baseStats": {
      "hp": 60,
      "atk": 45,
      "def": 50,
      "spa": 90,
      "spd": 80,
      "spe": 70
    },
    "abilities": [
      "compoundeyes",
      "tintedlens"
    ]
  },
  {
    "id": "weedle",
    "name": "\u30D3\u30FC\u30C9\u30EB",
    "nameEn": "Weedle",
    "type": "bug",
    "type2": "poison",
    "baseStats": {
      "hp": 40,
      "atk": 35,
      "def": 30,
      "spa": 20,
      "spd": 20,
      "spe": 50
    },
    "abilities": [
      "shielddust",
      "runaway"
    ]
  },
  {
    "id": "kakuna",
    "name": "\u30B3\u30AF\u30FC\u30F3",
    "nameEn": "Kakuna",
    "type": "bug",
    "type2": "poison",
    "baseStats": {
      "hp": 45,
      "atk": 25,
      "def": 50,
      "spa": 25,
      "spd": 25,
      "spe": 35
    },
    "abilities": [
      "shedskin"
    ]
  },
  {
    "id": "beedrill",
    "name": "\u30B9\u30D4\u30A2\u30FC",
    "nameEn": "Beedrill",
    "type": "bug",
    "type2": "poison",
    "baseStats": {
      "hp": 65,
      "atk": 90,
      "def": 40,
      "spa": 45,
      "spd": 80,
      "spe": 75
    },
    "abilities": [
      "swarm",
      "sniper"
    ]
  },
  {
    "id": "pidgey",
    "name": "\u30DD\u30C3\u30DD",
    "nameEn": "Pidgey",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 40,
      "atk": 45,
      "def": 40,
      "spa": 35,
      "spd": 35,
      "spe": 56
    },
    "abilities": [
      "keeneye",
      "tangledfeet",
      "bigpecks"
    ]
  },
  {
    "id": "pidgeotto",
    "name": "\u30D4\u30B8\u30E7\u30F3",
    "nameEn": "Pidgeotto",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 63,
      "atk": 60,
      "def": 55,
      "spa": 50,
      "spd": 50,
      "spe": 71
    },
    "abilities": [
      "keeneye",
      "tangledfeet",
      "bigpecks"
    ]
  },
  {
    "id": "pidgeot",
    "name": "\u30D4\u30B8\u30E7\u30C3\u30C8",
    "nameEn": "Pidgeot",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 83,
      "atk": 80,
      "def": 75,
      "spa": 70,
      "spd": 70,
      "spe": 101
    },
    "abilities": [
      "keeneye",
      "tangledfeet",
      "bigpecks"
    ]
  },
  {
    "id": "rattata",
    "name": "\u30B3\u30E9\u30C3\u30BF",
    "nameEn": "Rattata",
    "type": "normal",
    "baseStats": {
      "hp": 30,
      "atk": 56,
      "def": 35,
      "spa": 25,
      "spd": 35,
      "spe": 72
    },
    "abilities": [
      "runaway",
      "guts",
      "hustle"
    ]
  },
  {
    "id": "raticate",
    "name": "\u30E9\u30C3\u30BF",
    "nameEn": "Raticate",
    "type": "normal",
    "baseStats": {
      "hp": 55,
      "atk": 81,
      "def": 60,
      "spa": 50,
      "spd": 70,
      "spe": 97
    },
    "abilities": [
      "runaway",
      "guts",
      "hustle"
    ]
  },
  {
    "id": "spearow",
    "name": "\u30AA\u30CB\u30B9\u30BA\u30E1",
    "nameEn": "Spearow",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 40,
      "atk": 60,
      "def": 30,
      "spa": 31,
      "spd": 31,
      "spe": 70
    },
    "abilities": [
      "keeneye",
      "sniper"
    ]
  },
  {
    "id": "fearow",
    "name": "\u30AA\u30CB\u30C9\u30EA\u30EB",
    "nameEn": "Fearow",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 65,
      "atk": 90,
      "def": 65,
      "spa": 61,
      "spd": 61,
      "spe": 100
    },
    "abilities": [
      "keeneye",
      "sniper"
    ]
  },
  {
    "id": "ekans",
    "name": "\u30A2\u30FC\u30DC",
    "nameEn": "Ekans",
    "type": "poison",
    "baseStats": {
      "hp": 35,
      "atk": 60,
      "def": 44,
      "spa": 40,
      "spd": 54,
      "spe": 55
    },
    "abilities": [
      "intimidate",
      "shedskin",
      "unnerve"
    ]
  },
  {
    "id": "arbok",
    "name": "\u30A2\u30FC\u30DC\u30C3\u30AF",
    "nameEn": "Arbok",
    "type": "poison",
    "baseStats": {
      "hp": 60,
      "atk": 95,
      "def": 69,
      "spa": 65,
      "spd": 79,
      "spe": 80
    },
    "abilities": [
      "intimidate",
      "shedskin",
      "unnerve"
    ]
  },
  {
    "id": "pikachu",
    "name": "\u30D4\u30AB\u30C1\u30E5\u30A6",
    "nameEn": "Pikachu",
    "type": "electric",
    "baseStats": {
      "hp": 35,
      "atk": 55,
      "def": 40,
      "spa": 50,
      "spd": 50,
      "spe": 90
    },
    "abilities": [
      "static",
      "lightningrod"
    ]
  },
  {
    "id": "raichu",
    "name": "\u30E9\u30A4\u30C1\u30E5\u30A6",
    "nameEn": "Raichu",
    "type": "electric",
    "baseStats": {
      "hp": 60,
      "atk": 90,
      "def": 55,
      "spa": 90,
      "spd": 80,
      "spe": 110
    },
    "abilities": [
      "static",
      "lightningrod"
    ]
  },
  {
    "id": "sandshrew",
    "name": "\u30B5\u30F3\u30C9",
    "nameEn": "Sandshrew",
    "type": "ground",
    "baseStats": {
      "hp": 50,
      "atk": 75,
      "def": 85,
      "spa": 20,
      "spd": 30,
      "spe": 40
    },
    "abilities": [
      "sandveil",
      "sandrush"
    ]
  },
  {
    "id": "sandslash",
    "name": "\u30B5\u30F3\u30C9\u30D1\u30F3",
    "nameEn": "Sandslash",
    "type": "ground",
    "baseStats": {
      "hp": 75,
      "atk": 100,
      "def": 110,
      "spa": 45,
      "spd": 55,
      "spe": 65
    },
    "abilities": [
      "sandveil",
      "sandrush"
    ]
  },
  {
    "id": "nidoranf",
    "name": "\u30CB\u30C9\u30E9\u30F3\u2640",
    "nameEn": "Nidoran-F",
    "type": "poison",
    "baseStats": {
      "hp": 55,
      "atk": 47,
      "def": 52,
      "spa": 40,
      "spd": 40,
      "spe": 41
    },
    "abilities": [
      "poisonpoint",
      "rivalry",
      "hustle"
    ]
  },
  {
    "id": "nidorina",
    "name": "\u30CB\u30C9\u30EA\u30FC\u30CA",
    "nameEn": "Nidorina",
    "type": "poison",
    "baseStats": {
      "hp": 70,
      "atk": 62,
      "def": 67,
      "spa": 55,
      "spd": 55,
      "spe": 56
    },
    "abilities": [
      "poisonpoint",
      "rivalry",
      "hustle"
    ]
  },
  {
    "id": "nidoqueen",
    "name": "\u30CB\u30C9\u30AF\u30A4\u30F3",
    "nameEn": "Nidoqueen",
    "type": "poison",
    "type2": "ground",
    "baseStats": {
      "hp": 90,
      "atk": 92,
      "def": 87,
      "spa": 75,
      "spd": 85,
      "spe": 76
    },
    "abilities": [
      "poisonpoint",
      "rivalry",
      "sheerforce"
    ]
  },
  {
    "id": "nidoranm",
    "name": "\u30CB\u30C9\u30E9\u30F3\u2642",
    "nameEn": "Nidoran-M",
    "type": "poison",
    "baseStats": {
      "hp": 46,
      "atk": 57,
      "def": 40,
      "spa": 40,
      "spd": 40,
      "spe": 50
    },
    "abilities": [
      "poisonpoint",
      "rivalry",
      "hustle"
    ]
  },
  {
    "id": "nidorino",
    "name": "\u30CB\u30C9\u30EA\u30FC\u30CE",
    "nameEn": "Nidorino",
    "type": "poison",
    "baseStats": {
      "hp": 61,
      "atk": 72,
      "def": 57,
      "spa": 55,
      "spd": 55,
      "spe": 65
    },
    "abilities": [
      "poisonpoint",
      "rivalry",
      "hustle"
    ]
  },
  {
    "id": "nidoking",
    "name": "\u30CB\u30C9\u30AD\u30F3\u30B0",
    "nameEn": "Nidoking",
    "type": "poison",
    "type2": "ground",
    "baseStats": {
      "hp": 81,
      "atk": 102,
      "def": 77,
      "spa": 85,
      "spd": 75,
      "spe": 85
    },
    "abilities": [
      "poisonpoint",
      "rivalry",
      "sheerforce"
    ]
  },
  {
    "id": "clefairy",
    "name": "\u30D4\u30C3\u30D4",
    "nameEn": "Clefairy",
    "type": "fairy",
    "baseStats": {
      "hp": 70,
      "atk": 45,
      "def": 48,
      "spa": 60,
      "spd": 65,
      "spe": 35
    },
    "abilities": [
      "cutecharm",
      "magicguard",
      "friendguard"
    ]
  },
  {
    "id": "clefable",
    "name": "\u30D4\u30AF\u30B7\u30FC",
    "nameEn": "Clefable",
    "type": "fairy",
    "baseStats": {
      "hp": 95,
      "atk": 70,
      "def": 73,
      "spa": 95,
      "spd": 90,
      "spe": 60
    },
    "abilities": [
      "cutecharm",
      "magicguard",
      "unaware"
    ]
  },
  {
    "id": "vulpix",
    "name": "\u30ED\u30B3\u30F3",
    "nameEn": "Vulpix",
    "type": "fire",
    "baseStats": {
      "hp": 38,
      "atk": 41,
      "def": 40,
      "spa": 50,
      "spd": 65,
      "spe": 65
    },
    "abilities": [
      "flashfire",
      "drought"
    ]
  },
  {
    "id": "ninetales",
    "name": "\u30AD\u30E5\u30A6\u30B3\u30F3",
    "nameEn": "Ninetales",
    "type": "fire",
    "baseStats": {
      "hp": 73,
      "atk": 76,
      "def": 75,
      "spa": 81,
      "spd": 100,
      "spe": 100
    },
    "abilities": [
      "flashfire",
      "drought"
    ]
  },
  {
    "id": "jigglypuff",
    "name": "\u30D7\u30EA\u30F3",
    "nameEn": "Jigglypuff",
    "type": "normal",
    "type2": "fairy",
    "baseStats": {
      "hp": 115,
      "atk": 45,
      "def": 20,
      "spa": 45,
      "spd": 25,
      "spe": 20
    },
    "abilities": [
      "cutecharm",
      "competitive",
      "friendguard"
    ]
  },
  {
    "id": "wigglytuff",
    "name": "\u30D7\u30AF\u30EA\u30F3",
    "nameEn": "Wigglytuff",
    "type": "normal",
    "type2": "fairy",
    "baseStats": {
      "hp": 140,
      "atk": 70,
      "def": 45,
      "spa": 85,
      "spd": 50,
      "spe": 45
    },
    "abilities": [
      "cutecharm",
      "competitive",
      "frisk"
    ]
  },
  {
    "id": "zubat",
    "name": "\u30BA\u30D0\u30C3\u30C8",
    "nameEn": "Zubat",
    "type": "poison",
    "type2": "flying",
    "baseStats": {
      "hp": 40,
      "atk": 45,
      "def": 35,
      "spa": 30,
      "spd": 40,
      "spe": 55
    },
    "abilities": [
      "innerfocus",
      "infiltrator"
    ]
  },
  {
    "id": "golbat",
    "name": "\u30B4\u30EB\u30D0\u30C3\u30C8",
    "nameEn": "Golbat",
    "type": "poison",
    "type2": "flying",
    "baseStats": {
      "hp": 75,
      "atk": 80,
      "def": 70,
      "spa": 65,
      "spd": 75,
      "spe": 90
    },
    "abilities": [
      "innerfocus",
      "infiltrator"
    ]
  },
  {
    "id": "oddish",
    "name": "\u30CA\u30BE\u30CE\u30AF\u30B5",
    "nameEn": "Oddish",
    "type": "grass",
    "type2": "poison",
    "baseStats": {
      "hp": 45,
      "atk": 50,
      "def": 55,
      "spa": 75,
      "spd": 65,
      "spe": 30
    },
    "abilities": [
      "chlorophyll",
      "runaway"
    ]
  },
  {
    "id": "gloom",
    "name": "\u30AF\u30B5\u30A4\u30CF\u30CA",
    "nameEn": "Gloom",
    "type": "grass",
    "type2": "poison",
    "baseStats": {
      "hp": 60,
      "atk": 65,
      "def": 70,
      "spa": 85,
      "spd": 75,
      "spe": 40
    },
    "abilities": [
      "chlorophyll",
      "stench"
    ]
  },
  {
    "id": "vileplume",
    "name": "\u30E9\u30D5\u30EC\u30B7\u30A2",
    "nameEn": "Vileplume",
    "type": "grass",
    "type2": "poison",
    "baseStats": {
      "hp": 75,
      "atk": 80,
      "def": 85,
      "spa": 110,
      "spd": 90,
      "spe": 50
    },
    "abilities": [
      "chlorophyll",
      "effectspore"
    ]
  },
  {
    "id": "paras",
    "name": "\u30D1\u30E9\u30B9",
    "nameEn": "Paras",
    "type": "bug",
    "type2": "grass",
    "baseStats": {
      "hp": 35,
      "atk": 70,
      "def": 55,
      "spa": 45,
      "spd": 55,
      "spe": 25
    },
    "abilities": [
      "effectspore",
      "dryskin",
      "damp"
    ]
  },
  {
    "id": "parasect",
    "name": "\u30D1\u30E9\u30BB\u30AF\u30C8",
    "nameEn": "Parasect",
    "type": "bug",
    "type2": "grass",
    "baseStats": {
      "hp": 60,
      "atk": 95,
      "def": 80,
      "spa": 60,
      "spd": 80,
      "spe": 30
    },
    "abilities": [
      "effectspore",
      "dryskin",
      "damp"
    ]
  },
  {
    "id": "venonat",
    "name": "\u30B3\u30F3\u30D1\u30F3",
    "nameEn": "Venonat",
    "type": "bug",
    "type2": "poison",
    "baseStats": {
      "hp": 60,
      "atk": 55,
      "def": 50,
      "spa": 40,
      "spd": 55,
      "spe": 45
    },
    "abilities": [
      "compoundeyes",
      "tintedlens",
      "runaway"
    ]
  },
  {
    "id": "venomoth",
    "name": "\u30E2\u30EB\u30D5\u30A9\u30F3",
    "nameEn": "Venomoth",
    "type": "bug",
    "type2": "poison",
    "baseStats": {
      "hp": 70,
      "atk": 65,
      "def": 60,
      "spa": 90,
      "spd": 75,
      "spe": 90
    },
    "abilities": [
      "shielddust",
      "tintedlens",
      "wonderskin"
    ]
  },
  {
    "id": "diglett",
    "name": "\u30C7\u30A3\u30B0\u30C0",
    "nameEn": "Diglett",
    "type": "ground",
    "baseStats": {
      "hp": 10,
      "atk": 55,
      "def": 25,
      "spa": 35,
      "spd": 45,
      "spe": 95
    },
    "abilities": [
      "sandveil",
      "arenatrap",
      "sandforce"
    ]
  },
  {
    "id": "dugtrio",
    "name": "\u30C0\u30B0\u30C8\u30EA\u30AA",
    "nameEn": "Dugtrio",
    "type": "ground",
    "baseStats": {
      "hp": 35,
      "atk": 100,
      "def": 50,
      "spa": 50,
      "spd": 70,
      "spe": 120
    },
    "abilities": [
      "sandveil",
      "arenatrap",
      "sandforce"
    ]
  },
  {
    "id": "meowth",
    "name": "\u30CB\u30E3\u30FC\u30B9",
    "nameEn": "Meowth",
    "type": "normal",
    "baseStats": {
      "hp": 40,
      "atk": 45,
      "def": 35,
      "spa": 40,
      "spd": 40,
      "spe": 90
    },
    "abilities": [
      "pickup",
      "technician",
      "unnerve"
    ]
  },
  {
    "id": "persian",
    "name": "\u30DA\u30EB\u30B7\u30A2\u30F3",
    "nameEn": "Persian",
    "type": "normal",
    "baseStats": {
      "hp": 65,
      "atk": 70,
      "def": 60,
      "spa": 65,
      "spd": 65,
      "spe": 115
    },
    "abilities": [
      "limber",
      "technician",
      "unnerve"
    ]
  },
  {
    "id": "psyduck",
    "name": "\u30B3\u30C0\u30C3\u30AF",
    "nameEn": "Psyduck",
    "type": "water",
    "baseStats": {
      "hp": 50,
      "atk": 52,
      "def": 48,
      "spa": 65,
      "spd": 50,
      "spe": 55
    },
    "abilities": [
      "damp",
      "cloudnine",
      "swiftswim"
    ]
  },
  {
    "id": "golduck",
    "name": "\u30B4\u30EB\u30C0\u30C3\u30AF",
    "nameEn": "Golduck",
    "type": "water",
    "baseStats": {
      "hp": 80,
      "atk": 82,
      "def": 78,
      "spa": 95,
      "spd": 80,
      "spe": 85
    },
    "abilities": [
      "damp",
      "cloudnine",
      "swiftswim"
    ]
  },
  {
    "id": "mankey",
    "name": "\u30DE\u30F3\u30AD\u30FC",
    "nameEn": "Mankey",
    "type": "fighting",
    "baseStats": {
      "hp": 40,
      "atk": 80,
      "def": 35,
      "spa": 35,
      "spd": 45,
      "spe": 70
    },
    "abilities": [
      "vitalspirit",
      "angerpoint",
      "defiant"
    ]
  },
  {
    "id": "primeape",
    "name": "\u30AA\u30B3\u30EA\u30B6\u30EB",
    "nameEn": "Primeape",
    "type": "fighting",
    "baseStats": {
      "hp": 65,
      "atk": 105,
      "def": 60,
      "spa": 60,
      "spd": 70,
      "spe": 95
    },
    "abilities": [
      "vitalspirit",
      "angerpoint",
      "defiant"
    ]
  },
  {
    "id": "growlithe",
    "name": "\u30AC\u30FC\u30C7\u30A3",
    "nameEn": "Growlithe",
    "type": "fire",
    "baseStats": {
      "hp": 55,
      "atk": 70,
      "def": 45,
      "spa": 70,
      "spd": 50,
      "spe": 60
    },
    "abilities": [
      "intimidate",
      "flashfire",
      "justified"
    ]
  },
  {
    "id": "arcanine",
    "name": "\u30A6\u30A4\u30F3\u30C7\u30A3",
    "nameEn": "Arcanine",
    "type": "fire",
    "baseStats": {
      "hp": 90,
      "atk": 110,
      "def": 80,
      "spa": 100,
      "spd": 80,
      "spe": 95
    },
    "abilities": [
      "intimidate",
      "flashfire",
      "justified"
    ]
  },
  {
    "id": "poliwag",
    "name": "\u30CB\u30E7\u30ED\u30E2",
    "nameEn": "Poliwag",
    "type": "water",
    "baseStats": {
      "hp": 40,
      "atk": 50,
      "def": 40,
      "spa": 40,
      "spd": 40,
      "spe": 90
    },
    "abilities": [
      "waterabsorb",
      "damp",
      "swiftswim"
    ]
  },
  {
    "id": "poliwhirl",
    "name": "\u30CB\u30E7\u30ED\u30BE",
    "nameEn": "Poliwhirl",
    "type": "water",
    "baseStats": {
      "hp": 65,
      "atk": 65,
      "def": 65,
      "spa": 50,
      "spd": 50,
      "spe": 90
    },
    "abilities": [
      "waterabsorb",
      "damp",
      "swiftswim"
    ]
  },
  {
    "id": "poliwrath",
    "name": "\u30CB\u30E7\u30ED\u30DC\u30F3",
    "nameEn": "Poliwrath",
    "type": "water",
    "type2": "fighting",
    "baseStats": {
      "hp": 90,
      "atk": 95,
      "def": 95,
      "spa": 70,
      "spd": 90,
      "spe": 70
    },
    "abilities": [
      "waterabsorb",
      "damp",
      "swiftswim"
    ]
  },
  {
    "id": "abra",
    "name": "\u30B1\u30FC\u30B7\u30A3",
    "nameEn": "Abra",
    "type": "psychic",
    "baseStats": {
      "hp": 25,
      "atk": 20,
      "def": 15,
      "spa": 105,
      "spd": 55,
      "spe": 90
    },
    "abilities": [
      "synchronize",
      "innerfocus",
      "magicguard"
    ]
  },
  {
    "id": "kadabra",
    "name": "\u30E6\u30F3\u30B2\u30E9\u30FC",
    "nameEn": "Kadabra",
    "type": "psychic",
    "baseStats": {
      "hp": 40,
      "atk": 35,
      "def": 30,
      "spa": 120,
      "spd": 70,
      "spe": 105
    },
    "abilities": [
      "synchronize",
      "innerfocus",
      "magicguard"
    ]
  },
  {
    "id": "alakazam",
    "name": "\u30D5\u30FC\u30C7\u30A3\u30F3",
    "nameEn": "Alakazam",
    "type": "psychic",
    "baseStats": {
      "hp": 55,
      "atk": 50,
      "def": 45,
      "spa": 135,
      "spd": 95,
      "spe": 120
    },
    "abilities": [
      "synchronize",
      "innerfocus",
      "magicguard"
    ]
  },
  {
    "id": "machop",
    "name": "\u30EF\u30F3\u30EA\u30AD\u30FC",
    "nameEn": "Machop",
    "type": "fighting",
    "baseStats": {
      "hp": 70,
      "atk": 80,
      "def": 50,
      "spa": 35,
      "spd": 35,
      "spe": 35
    },
    "abilities": [
      "guts",
      "noguard",
      "steadfast"
    ]
  },
  {
    "id": "machoke",
    "name": "\u30B4\u30FC\u30EA\u30AD\u30FC",
    "nameEn": "Machoke",
    "type": "fighting",
    "baseStats": {
      "hp": 80,
      "atk": 100,
      "def": 70,
      "spa": 50,
      "spd": 60,
      "spe": 45
    },
    "abilities": [
      "guts",
      "noguard",
      "steadfast"
    ]
  },
  {
    "id": "machamp",
    "name": "\u30AB\u30A4\u30EA\u30AD\u30FC",
    "nameEn": "Machamp",
    "type": "fighting",
    "baseStats": {
      "hp": 90,
      "atk": 130,
      "def": 80,
      "spa": 65,
      "spd": 85,
      "spe": 55
    },
    "abilities": [
      "guts",
      "noguard",
      "steadfast"
    ]
  },
  {
    "id": "bellsprout",
    "name": "\u30DE\u30C0\u30C4\u30DC\u30DF",
    "nameEn": "Bellsprout",
    "type": "grass",
    "type2": "poison",
    "baseStats": {
      "hp": 50,
      "atk": 75,
      "def": 35,
      "spa": 70,
      "spd": 30,
      "spe": 40
    },
    "abilities": [
      "chlorophyll",
      "gluttony"
    ]
  },
  {
    "id": "weepinbell",
    "name": "\u30A6\u30C4\u30C9\u30F3",
    "nameEn": "Weepinbell",
    "type": "grass",
    "type2": "poison",
    "baseStats": {
      "hp": 65,
      "atk": 90,
      "def": 50,
      "spa": 85,
      "spd": 45,
      "spe": 55
    },
    "abilities": [
      "chlorophyll",
      "gluttony"
    ]
  },
  {
    "id": "victreebel",
    "name": "\u30A6\u30C4\u30DC\u30C3\u30C8",
    "nameEn": "Victreebel",
    "type": "grass",
    "type2": "poison",
    "baseStats": {
      "hp": 80,
      "atk": 105,
      "def": 65,
      "spa": 100,
      "spd": 70,
      "spe": 70
    },
    "abilities": [
      "chlorophyll",
      "gluttony"
    ]
  },
  {
    "id": "tentacool",
    "name": "\u30E1\u30CE\u30AF\u30E9\u30B2",
    "nameEn": "Tentacool",
    "type": "water",
    "type2": "poison",
    "baseStats": {
      "hp": 40,
      "atk": 40,
      "def": 35,
      "spa": 50,
      "spd": 100,
      "spe": 70
    },
    "abilities": [
      "clearbody",
      "liquidooze",
      "raindish"
    ]
  },
  {
    "id": "tentacruel",
    "name": "\u30C9\u30AF\u30AF\u30E9\u30B2",
    "nameEn": "Tentacruel",
    "type": "water",
    "type2": "poison",
    "baseStats": {
      "hp": 80,
      "atk": 70,
      "def": 65,
      "spa": 80,
      "spd": 120,
      "spe": 100
    },
    "abilities": [
      "clearbody",
      "liquidooze",
      "raindish"
    ]
  },
  {
    "id": "geodude",
    "name": "\u30A4\u30B7\u30C4\u30D6\u30C6",
    "nameEn": "Geodude",
    "type": "rock",
    "type2": "ground",
    "baseStats": {
      "hp": 40,
      "atk": 80,
      "def": 100,
      "spa": 30,
      "spd": 30,
      "spe": 20
    },
    "abilities": [
      "rockhead",
      "sturdy",
      "sandveil"
    ]
  },
  {
    "id": "graveler",
    "name": "\u30B4\u30ED\u30FC\u30F3",
    "nameEn": "Graveler",
    "type": "rock",
    "type2": "ground",
    "baseStats": {
      "hp": 55,
      "atk": 95,
      "def": 115,
      "spa": 45,
      "spd": 45,
      "spe": 35
    },
    "abilities": [
      "rockhead",
      "sturdy",
      "sandveil"
    ]
  },
  {
    "id": "golem",
    "name": "\u30B4\u30ED\u30FC\u30CB\u30E3",
    "nameEn": "Golem",
    "type": "rock",
    "type2": "ground",
    "baseStats": {
      "hp": 80,
      "atk": 120,
      "def": 130,
      "spa": 55,
      "spd": 65,
      "spe": 45
    },
    "abilities": [
      "rockhead",
      "sturdy",
      "sandveil"
    ]
  },
  {
    "id": "ponyta",
    "name": "\u30DD\u30CB\u30FC\u30BF",
    "nameEn": "Ponyta",
    "type": "fire",
    "baseStats": {
      "hp": 50,
      "atk": 85,
      "def": 55,
      "spa": 65,
      "spd": 65,
      "spe": 90
    },
    "abilities": [
      "runaway",
      "flashfire",
      "flamebody"
    ]
  },
  {
    "id": "rapidash",
    "name": "\u30AE\u30E3\u30ED\u30C3\u30D7",
    "nameEn": "Rapidash",
    "type": "fire",
    "baseStats": {
      "hp": 65,
      "atk": 100,
      "def": 70,
      "spa": 80,
      "spd": 80,
      "spe": 105
    },
    "abilities": [
      "runaway",
      "flashfire",
      "flamebody"
    ]
  },
  {
    "id": "slowpoke",
    "name": "\u30E4\u30C9\u30F3",
    "nameEn": "Slowpoke",
    "type": "water",
    "type2": "psychic",
    "baseStats": {
      "hp": 90,
      "atk": 65,
      "def": 65,
      "spa": 40,
      "spd": 40,
      "spe": 15
    },
    "abilities": [
      "oblivious",
      "owntempo",
      "regenerator"
    ]
  },
  {
    "id": "slowbro",
    "name": "\u30E4\u30C9\u30E9\u30F3",
    "nameEn": "Slowbro",
    "type": "water",
    "type2": "psychic",
    "baseStats": {
      "hp": 95,
      "atk": 75,
      "def": 110,
      "spa": 100,
      "spd": 80,
      "spe": 30
    },
    "abilities": [
      "oblivious",
      "owntempo",
      "regenerator"
    ]
  },
  {
    "id": "magnemite",
    "name": "\u30B3\u30A4\u30EB",
    "nameEn": "Magnemite",
    "type": "electric",
    "type2": "steel",
    "baseStats": {
      "hp": 25,
      "atk": 35,
      "def": 70,
      "spa": 95,
      "spd": 55,
      "spe": 45
    },
    "abilities": [
      "magnetpull",
      "sturdy",
      "analytic"
    ]
  },
  {
    "id": "magneton",
    "name": "\u30EC\u30A2\u30B3\u30A4\u30EB",
    "nameEn": "Magneton",
    "type": "electric",
    "type2": "steel",
    "baseStats": {
      "hp": 50,
      "atk": 60,
      "def": 95,
      "spa": 120,
      "spd": 70,
      "spe": 70
    },
    "abilities": [
      "magnetpull",
      "sturdy",
      "analytic"
    ]
  },
  {
    "id": "farfetchd",
    "name": "\u30AB\u30E2\u30CD\u30AE",
    "nameEn": "Farfetch\u2019d",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 52,
      "atk": 90,
      "def": 55,
      "spa": 58,
      "spd": 62,
      "spe": 60
    },
    "abilities": [
      "keeneye",
      "innerfocus",
      "defiant"
    ]
  },
  {
    "id": "doduo",
    "name": "\u30C9\u30FC\u30C9\u30FC",
    "nameEn": "Doduo",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 35,
      "atk": 85,
      "def": 45,
      "spa": 35,
      "spd": 35,
      "spe": 75
    },
    "abilities": [
      "runaway",
      "earlybird",
      "tangledfeet"
    ]
  },
  {
    "id": "dodrio",
    "name": "\u30C9\u30FC\u30C9\u30EA\u30AA",
    "nameEn": "Dodrio",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 60,
      "atk": 110,
      "def": 70,
      "spa": 60,
      "spd": 60,
      "spe": 110
    },
    "abilities": [
      "runaway",
      "earlybird",
      "tangledfeet"
    ]
  },
  {
    "id": "seel",
    "name": "\u30D1\u30A6\u30EF\u30A6",
    "nameEn": "Seel",
    "type": "water",
    "baseStats": {
      "hp": 65,
      "atk": 45,
      "def": 55,
      "spa": 45,
      "spd": 70,
      "spe": 45
    },
    "abilities": [
      "thickfat",
      "hydration",
      "icebody"
    ]
  },
  {
    "id": "dewgong",
    "name": "\u30B8\u30E5\u30B4\u30F3",
    "nameEn": "Dewgong",
    "type": "water",
    "type2": "ice",
    "baseStats": {
      "hp": 90,
      "atk": 70,
      "def": 80,
      "spa": 70,
      "spd": 95,
      "spe": 70
    },
    "abilities": [
      "thickfat",
      "hydration",
      "icebody"
    ]
  },
  {
    "id": "grimer",
    "name": "\u30D9\u30C8\u30D9\u30BF\u30FC",
    "nameEn": "Grimer",
    "type": "poison",
    "baseStats": {
      "hp": 80,
      "atk": 80,
      "def": 50,
      "spa": 40,
      "spd": 50,
      "spe": 25
    },
    "abilities": [
      "stench",
      "stickyhold",
      "poisontouch"
    ]
  },
  {
    "id": "muk",
    "name": "\u30D9\u30C8\u30D9\u30C8\u30F3",
    "nameEn": "Muk",
    "type": "poison",
    "baseStats": {
      "hp": 105,
      "atk": 105,
      "def": 75,
      "spa": 65,
      "spd": 100,
      "spe": 50
    },
    "abilities": [
      "stench",
      "stickyhold",
      "poisontouch"
    ]
  },
  {
    "id": "shellder",
    "name": "\u30B7\u30A7\u30EB\u30C0\u30FC",
    "nameEn": "Shellder",
    "type": "water",
    "baseStats": {
      "hp": 30,
      "atk": 65,
      "def": 100,
      "spa": 45,
      "spd": 25,
      "spe": 40
    },
    "abilities": [
      "shellarmor",
      "skilllink",
      "overcoat"
    ]
  },
  {
    "id": "cloyster",
    "name": "\u30D1\u30EB\u30B7\u30A7\u30F3",
    "nameEn": "Cloyster",
    "type": "water",
    "type2": "ice",
    "baseStats": {
      "hp": 50,
      "atk": 95,
      "def": 180,
      "spa": 85,
      "spd": 45,
      "spe": 70
    },
    "abilities": [
      "shellarmor",
      "skilllink",
      "overcoat"
    ]
  },
  {
    "id": "gastly",
    "name": "\u30B4\u30FC\u30B9",
    "nameEn": "Gastly",
    "type": "ghost",
    "type2": "poison",
    "baseStats": {
      "hp": 30,
      "atk": 35,
      "def": 30,
      "spa": 100,
      "spd": 35,
      "spe": 80
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "haunter",
    "name": "\u30B4\u30FC\u30B9\u30C8",
    "nameEn": "Haunter",
    "type": "ghost",
    "type2": "poison",
    "baseStats": {
      "hp": 45,
      "atk": 50,
      "def": 45,
      "spa": 115,
      "spd": 55,
      "spe": 95
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "gengar",
    "name": "\u30B2\u30F3\u30AC\u30FC",
    "nameEn": "Gengar",
    "type": "ghost",
    "type2": "poison",
    "baseStats": {
      "hp": 60,
      "atk": 65,
      "def": 60,
      "spa": 130,
      "spd": 75,
      "spe": 110
    },
    "abilities": [
      "cursedbody"
    ]
  },
  {
    "id": "onix",
    "name": "\u30A4\u30EF\u30FC\u30AF",
    "nameEn": "Onix",
    "type": "rock",
    "type2": "ground",
    "baseStats": {
      "hp": 35,
      "atk": 45,
      "def": 160,
      "spa": 30,
      "spd": 45,
      "spe": 70
    },
    "abilities": [
      "rockhead",
      "sturdy",
      "weakarmor"
    ]
  },
  {
    "id": "drowzee",
    "name": "\u30B9\u30EA\u30FC\u30D7",
    "nameEn": "Drowzee",
    "type": "psychic",
    "baseStats": {
      "hp": 60,
      "atk": 48,
      "def": 45,
      "spa": 43,
      "spd": 90,
      "spe": 42
    },
    "abilities": [
      "insomnia",
      "forewarn",
      "innerfocus"
    ]
  },
  {
    "id": "hypno",
    "name": "\u30B9\u30EA\u30FC\u30D1\u30FC",
    "nameEn": "Hypno",
    "type": "psychic",
    "baseStats": {
      "hp": 85,
      "atk": 73,
      "def": 70,
      "spa": 73,
      "spd": 115,
      "spe": 67
    },
    "abilities": [
      "insomnia",
      "forewarn",
      "innerfocus"
    ]
  },
  {
    "id": "krabby",
    "name": "\u30AF\u30E9\u30D6",
    "nameEn": "Krabby",
    "type": "water",
    "baseStats": {
      "hp": 30,
      "atk": 105,
      "def": 90,
      "spa": 25,
      "spd": 25,
      "spe": 50
    },
    "abilities": [
      "hypercutter",
      "shellarmor",
      "sheerforce"
    ]
  },
  {
    "id": "kingler",
    "name": "\u30AD\u30F3\u30B0\u30E9\u30FC",
    "nameEn": "Kingler",
    "type": "water",
    "baseStats": {
      "hp": 55,
      "atk": 130,
      "def": 115,
      "spa": 50,
      "spd": 50,
      "spe": 75
    },
    "abilities": [
      "hypercutter",
      "shellarmor",
      "sheerforce"
    ]
  },
  {
    "id": "voltorb",
    "name": "\u30D3\u30EA\u30EA\u30C0\u30DE",
    "nameEn": "Voltorb",
    "type": "electric",
    "baseStats": {
      "hp": 40,
      "atk": 30,
      "def": 50,
      "spa": 55,
      "spd": 55,
      "spe": 100
    },
    "abilities": [
      "soundproof",
      "static",
      "aftermath"
    ]
  },
  {
    "id": "electrode",
    "name": "\u30DE\u30EB\u30DE\u30A4\u30F3",
    "nameEn": "Electrode",
    "type": "electric",
    "baseStats": {
      "hp": 60,
      "atk": 50,
      "def": 70,
      "spa": 80,
      "spd": 80,
      "spe": 150
    },
    "abilities": [
      "soundproof",
      "static",
      "aftermath"
    ]
  },
  {
    "id": "exeggcute",
    "name": "\u30BF\u30DE\u30BF\u30DE",
    "nameEn": "Exeggcute",
    "type": "grass",
    "type2": "psychic",
    "baseStats": {
      "hp": 60,
      "atk": 40,
      "def": 80,
      "spa": 60,
      "spd": 45,
      "spe": 40
    },
    "abilities": [
      "chlorophyll",
      "harvest"
    ]
  },
  {
    "id": "exeggutor",
    "name": "\u30CA\u30C3\u30B7\u30FC",
    "nameEn": "Exeggutor",
    "type": "grass",
    "type2": "psychic",
    "baseStats": {
      "hp": 95,
      "atk": 95,
      "def": 85,
      "spa": 125,
      "spd": 75,
      "spe": 55
    },
    "abilities": [
      "chlorophyll",
      "harvest"
    ]
  },
  {
    "id": "cubone",
    "name": "\u30AB\u30E9\u30AB\u30E9",
    "nameEn": "Cubone",
    "type": "ground",
    "baseStats": {
      "hp": 50,
      "atk": 50,
      "def": 95,
      "spa": 40,
      "spd": 50,
      "spe": 35
    },
    "abilities": [
      "rockhead",
      "lightningrod",
      "battlearmor"
    ]
  },
  {
    "id": "marowak",
    "name": "\u30AC\u30E9\u30AC\u30E9",
    "nameEn": "Marowak",
    "type": "ground",
    "baseStats": {
      "hp": 60,
      "atk": 80,
      "def": 110,
      "spa": 50,
      "spd": 80,
      "spe": 45
    },
    "abilities": [
      "rockhead",
      "lightningrod",
      "battlearmor"
    ]
  },
  {
    "id": "hitmonlee",
    "name": "\u30B5\u30EF\u30E0\u30E9\u30FC",
    "nameEn": "Hitmonlee",
    "type": "fighting",
    "baseStats": {
      "hp": 50,
      "atk": 120,
      "def": 53,
      "spa": 35,
      "spd": 110,
      "spe": 87
    },
    "abilities": [
      "limber",
      "reckless",
      "unburden"
    ]
  },
  {
    "id": "hitmonchan",
    "name": "\u30A8\u30D3\u30EF\u30E9\u30FC",
    "nameEn": "Hitmonchan",
    "type": "fighting",
    "baseStats": {
      "hp": 50,
      "atk": 105,
      "def": 79,
      "spa": 35,
      "spd": 110,
      "spe": 76
    },
    "abilities": [
      "keeneye",
      "ironfist",
      "innerfocus"
    ]
  },
  {
    "id": "lickitung",
    "name": "\u30D9\u30ED\u30EA\u30F3\u30AC",
    "nameEn": "Lickitung",
    "type": "normal",
    "baseStats": {
      "hp": 90,
      "atk": 55,
      "def": 75,
      "spa": 60,
      "spd": 75,
      "spe": 30
    },
    "abilities": [
      "owntempo",
      "oblivious",
      "cloudnine"
    ]
  },
  {
    "id": "koffing",
    "name": "\u30C9\u30AC\u30FC\u30B9",
    "nameEn": "Koffing",
    "type": "poison",
    "baseStats": {
      "hp": 40,
      "atk": 65,
      "def": 95,
      "spa": 60,
      "spd": 45,
      "spe": 35
    },
    "abilities": [
      "levitate",
      "neutralizinggas",
      "stench"
    ]
  },
  {
    "id": "weezing",
    "name": "\u30DE\u30BF\u30C9\u30AC\u30B9",
    "nameEn": "Weezing",
    "type": "poison",
    "baseStats": {
      "hp": 65,
      "atk": 90,
      "def": 120,
      "spa": 85,
      "spd": 70,
      "spe": 60
    },
    "abilities": [
      "levitate",
      "neutralizinggas",
      "stench"
    ]
  },
  {
    "id": "rhyhorn",
    "name": "\u30B5\u30A4\u30DB\u30FC\u30F3",
    "nameEn": "Rhyhorn",
    "type": "ground",
    "type2": "rock",
    "baseStats": {
      "hp": 80,
      "atk": 85,
      "def": 95,
      "spa": 30,
      "spd": 30,
      "spe": 25
    },
    "abilities": [
      "lightningrod",
      "rockhead",
      "reckless"
    ]
  },
  {
    "id": "rhydon",
    "name": "\u30B5\u30A4\u30C9\u30F3",
    "nameEn": "Rhydon",
    "type": "ground",
    "type2": "rock",
    "baseStats": {
      "hp": 105,
      "atk": 130,
      "def": 120,
      "spa": 45,
      "spd": 45,
      "spe": 40
    },
    "abilities": [
      "lightningrod",
      "rockhead",
      "reckless"
    ]
  },
  {
    "id": "chansey",
    "name": "\u30E9\u30C3\u30AD\u30FC",
    "nameEn": "Chansey",
    "type": "normal",
    "baseStats": {
      "hp": 250,
      "atk": 5,
      "def": 5,
      "spa": 35,
      "spd": 105,
      "spe": 50
    },
    "abilities": [
      "naturalcure",
      "serenegrace",
      "healer"
    ]
  },
  {
    "id": "tangela",
    "name": "\u30E2\u30F3\u30B8\u30E3\u30E9",
    "nameEn": "Tangela",
    "type": "grass",
    "baseStats": {
      "hp": 65,
      "atk": 55,
      "def": 115,
      "spa": 100,
      "spd": 40,
      "spe": 60
    },
    "abilities": [
      "chlorophyll",
      "leafguard",
      "regenerator"
    ]
  },
  {
    "id": "kangaskhan",
    "name": "\u30AC\u30EB\u30FC\u30E9",
    "nameEn": "Kangaskhan",
    "type": "normal",
    "baseStats": {
      "hp": 105,
      "atk": 95,
      "def": 80,
      "spa": 40,
      "spd": 80,
      "spe": 90
    },
    "abilities": [
      "earlybird",
      "scrappy",
      "innerfocus"
    ]
  },
  {
    "id": "horsea",
    "name": "\u30BF\u30C3\u30C4\u30FC",
    "nameEn": "Horsea",
    "type": "water",
    "baseStats": {
      "hp": 30,
      "atk": 40,
      "def": 70,
      "spa": 70,
      "spd": 25,
      "spe": 60
    },
    "abilities": [
      "swiftswim",
      "sniper",
      "damp"
    ]
  },
  {
    "id": "seadra",
    "name": "\u30B7\u30FC\u30C9\u30E9",
    "nameEn": "Seadra",
    "type": "water",
    "baseStats": {
      "hp": 55,
      "atk": 65,
      "def": 95,
      "spa": 95,
      "spd": 45,
      "spe": 85
    },
    "abilities": [
      "poisonpoint",
      "sniper",
      "damp"
    ]
  },
  {
    "id": "goldeen",
    "name": "\u30C8\u30B5\u30AD\u30F3\u30C8",
    "nameEn": "Goldeen",
    "type": "water",
    "baseStats": {
      "hp": 45,
      "atk": 67,
      "def": 60,
      "spa": 35,
      "spd": 50,
      "spe": 63
    },
    "abilities": [
      "swiftswim",
      "waterveil",
      "lightningrod"
    ]
  },
  {
    "id": "seaking",
    "name": "\u30A2\u30BA\u30DE\u30AA\u30A6",
    "nameEn": "Seaking",
    "type": "water",
    "baseStats": {
      "hp": 80,
      "atk": 92,
      "def": 65,
      "spa": 65,
      "spd": 80,
      "spe": 68
    },
    "abilities": [
      "swiftswim",
      "waterveil",
      "lightningrod"
    ]
  },
  {
    "id": "staryu",
    "name": "\u30D2\u30C8\u30C7\u30DE\u30F3",
    "nameEn": "Staryu",
    "type": "water",
    "baseStats": {
      "hp": 30,
      "atk": 45,
      "def": 55,
      "spa": 70,
      "spd": 55,
      "spe": 85
    },
    "abilities": [
      "illuminate",
      "naturalcure",
      "analytic"
    ]
  },
  {
    "id": "starmie",
    "name": "\u30B9\u30BF\u30FC\u30DF\u30FC",
    "nameEn": "Starmie",
    "type": "water",
    "type2": "psychic",
    "baseStats": {
      "hp": 60,
      "atk": 75,
      "def": 85,
      "spa": 100,
      "spd": 85,
      "spe": 115
    },
    "abilities": [
      "illuminate",
      "naturalcure",
      "analytic"
    ]
  },
  {
    "id": "mrmime",
    "name": "\u30D0\u30EA\u30E4\u30FC\u30C9",
    "nameEn": "Mr. Mime",
    "type": "psychic",
    "type2": "fairy",
    "baseStats": {
      "hp": 40,
      "atk": 45,
      "def": 65,
      "spa": 100,
      "spd": 120,
      "spe": 90
    },
    "abilities": [
      "soundproof",
      "filter",
      "technician"
    ]
  },
  {
    "id": "scyther",
    "name": "\u30B9\u30C8\u30E9\u30A4\u30AF",
    "nameEn": "Scyther",
    "type": "bug",
    "type2": "flying",
    "baseStats": {
      "hp": 70,
      "atk": 110,
      "def": 80,
      "spa": 55,
      "spd": 80,
      "spe": 105
    },
    "abilities": [
      "swarm",
      "technician",
      "steadfast"
    ]
  },
  {
    "id": "jynx",
    "name": "\u30EB\u30FC\u30B8\u30E5\u30E9",
    "nameEn": "Jynx",
    "type": "ice",
    "type2": "psychic",
    "baseStats": {
      "hp": 65,
      "atk": 50,
      "def": 35,
      "spa": 115,
      "spd": 95,
      "spe": 95
    },
    "abilities": [
      "oblivious",
      "forewarn",
      "dryskin"
    ]
  },
  {
    "id": "electabuzz",
    "name": "\u30A8\u30EC\u30D6\u30FC",
    "nameEn": "Electabuzz",
    "type": "electric",
    "baseStats": {
      "hp": 65,
      "atk": 83,
      "def": 57,
      "spa": 95,
      "spd": 85,
      "spe": 105
    },
    "abilities": [
      "static",
      "vitalspirit"
    ]
  },
  {
    "id": "magmar",
    "name": "\u30D6\u30FC\u30D0\u30FC",
    "nameEn": "Magmar",
    "type": "fire",
    "baseStats": {
      "hp": 65,
      "atk": 95,
      "def": 57,
      "spa": 100,
      "spd": 85,
      "spe": 93
    },
    "abilities": [
      "flamebody",
      "vitalspirit"
    ]
  },
  {
    "id": "pinsir",
    "name": "\u30AB\u30A4\u30ED\u30B9",
    "nameEn": "Pinsir",
    "type": "bug",
    "baseStats": {
      "hp": 65,
      "atk": 125,
      "def": 100,
      "spa": 55,
      "spd": 70,
      "spe": 85
    },
    "abilities": [
      "hypercutter",
      "moldbreaker",
      "moxie"
    ]
  },
  {
    "id": "tauros",
    "name": "\u30B1\u30F3\u30BF\u30ED\u30B9",
    "nameEn": "Tauros",
    "type": "normal",
    "baseStats": {
      "hp": 75,
      "atk": 100,
      "def": 95,
      "spa": 40,
      "spd": 70,
      "spe": 110
    },
    "abilities": [
      "intimidate",
      "angerpoint",
      "sheerforce"
    ]
  },
  {
    "id": "magikarp",
    "name": "\u30B3\u30A4\u30AD\u30F3\u30B0",
    "nameEn": "Magikarp",
    "type": "water",
    "baseStats": {
      "hp": 20,
      "atk": 10,
      "def": 55,
      "spa": 15,
      "spd": 20,
      "spe": 80
    },
    "abilities": [
      "swiftswim",
      "rattled"
    ]
  },
  {
    "id": "gyarados",
    "name": "\u30AE\u30E3\u30E9\u30C9\u30B9",
    "nameEn": "Gyarados",
    "type": "water",
    "type2": "flying",
    "baseStats": {
      "hp": 95,
      "atk": 125,
      "def": 79,
      "spa": 60,
      "spd": 100,
      "spe": 81
    },
    "abilities": [
      "intimidate",
      "moxie"
    ]
  },
  {
    "id": "lapras",
    "name": "\u30E9\u30D7\u30E9\u30B9",
    "nameEn": "Lapras",
    "type": "water",
    "type2": "ice",
    "baseStats": {
      "hp": 130,
      "atk": 85,
      "def": 80,
      "spa": 85,
      "spd": 95,
      "spe": 60
    },
    "abilities": [
      "waterabsorb",
      "shellarmor",
      "hydration"
    ]
  },
  {
    "id": "ditto",
    "name": "\u30E1\u30BF\u30E2\u30F3",
    "nameEn": "Ditto",
    "type": "normal",
    "baseStats": {
      "hp": 48,
      "atk": 48,
      "def": 48,
      "spa": 48,
      "spd": 48,
      "spe": 48
    },
    "abilities": [
      "limber",
      "imposter"
    ]
  },
  {
    "id": "eevee",
    "name": "\u30A4\u30FC\u30D6\u30A4",
    "nameEn": "Eevee",
    "type": "normal",
    "baseStats": {
      "hp": 55,
      "atk": 55,
      "def": 50,
      "spa": 45,
      "spd": 65,
      "spe": 55
    },
    "abilities": [
      "runaway",
      "adaptability",
      "anticipation"
    ]
  },
  {
    "id": "vaporeon",
    "name": "\u30B7\u30E3\u30EF\u30FC\u30BA",
    "nameEn": "Vaporeon",
    "type": "water",
    "baseStats": {
      "hp": 130,
      "atk": 65,
      "def": 60,
      "spa": 110,
      "spd": 95,
      "spe": 65
    },
    "abilities": [
      "waterabsorb",
      "hydration"
    ]
  },
  {
    "id": "jolteon",
    "name": "\u30B5\u30F3\u30C0\u30FC\u30B9",
    "nameEn": "Jolteon",
    "type": "electric",
    "baseStats": {
      "hp": 65,
      "atk": 65,
      "def": 60,
      "spa": 110,
      "spd": 95,
      "spe": 130
    },
    "abilities": [
      "voltabsorb",
      "quickfeet"
    ]
  },
  {
    "id": "flareon",
    "name": "\u30D6\u30FC\u30B9\u30BF\u30FC",
    "nameEn": "Flareon",
    "type": "fire",
    "baseStats": {
      "hp": 65,
      "atk": 130,
      "def": 60,
      "spa": 95,
      "spd": 110,
      "spe": 65
    },
    "abilities": [
      "flashfire",
      "guts"
    ]
  },
  {
    "id": "porygon",
    "name": "\u30DD\u30EA\u30B4\u30F3",
    "nameEn": "Porygon",
    "type": "normal",
    "baseStats": {
      "hp": 65,
      "atk": 60,
      "def": 70,
      "spa": 85,
      "spd": 75,
      "spe": 40
    },
    "abilities": [
      "trace",
      "download",
      "analytic"
    ]
  },
  {
    "id": "omanyte",
    "name": "\u30AA\u30E0\u30CA\u30A4\u30C8",
    "nameEn": "Omanyte",
    "type": "rock",
    "type2": "water",
    "baseStats": {
      "hp": 35,
      "atk": 40,
      "def": 100,
      "spa": 90,
      "spd": 55,
      "spe": 35
    },
    "abilities": [
      "swiftswim",
      "shellarmor",
      "weakarmor"
    ]
  },
  {
    "id": "omastar",
    "name": "\u30AA\u30E0\u30B9\u30BF\u30FC",
    "nameEn": "Omastar",
    "type": "rock",
    "type2": "water",
    "baseStats": {
      "hp": 70,
      "atk": 60,
      "def": 125,
      "spa": 115,
      "spd": 70,
      "spe": 55
    },
    "abilities": [
      "swiftswim",
      "shellarmor",
      "weakarmor"
    ]
  },
  {
    "id": "kabuto",
    "name": "\u30AB\u30D6\u30C8",
    "nameEn": "Kabuto",
    "type": "rock",
    "type2": "water",
    "baseStats": {
      "hp": 30,
      "atk": 80,
      "def": 90,
      "spa": 55,
      "spd": 45,
      "spe": 55
    },
    "abilities": [
      "swiftswim",
      "battlearmor",
      "weakarmor"
    ]
  },
  {
    "id": "kabutops",
    "name": "\u30AB\u30D6\u30C8\u30D7\u30B9",
    "nameEn": "Kabutops",
    "type": "rock",
    "type2": "water",
    "baseStats": {
      "hp": 60,
      "atk": 115,
      "def": 105,
      "spa": 65,
      "spd": 70,
      "spe": 80
    },
    "abilities": [
      "swiftswim",
      "battlearmor",
      "weakarmor"
    ]
  },
  {
    "id": "aerodactyl",
    "name": "\u30D7\u30C6\u30E9",
    "nameEn": "Aerodactyl",
    "type": "rock",
    "type2": "flying",
    "baseStats": {
      "hp": 80,
      "atk": 105,
      "def": 65,
      "spa": 60,
      "spd": 75,
      "spe": 130
    },
    "abilities": [
      "rockhead",
      "pressure",
      "unnerve"
    ]
  },
  {
    "id": "snorlax",
    "name": "\u30AB\u30D3\u30B4\u30F3",
    "nameEn": "Snorlax",
    "type": "normal",
    "baseStats": {
      "hp": 160,
      "atk": 110,
      "def": 65,
      "spa": 65,
      "spd": 110,
      "spe": 30
    },
    "abilities": [
      "immunity",
      "thickfat",
      "gluttony"
    ]
  },
  {
    "id": "articuno",
    "name": "\u30D5\u30EA\u30FC\u30B6\u30FC",
    "nameEn": "Articuno",
    "type": "ice",
    "type2": "flying",
    "baseStats": {
      "hp": 90,
      "atk": 85,
      "def": 100,
      "spa": 95,
      "spd": 125,
      "spe": 85
    },
    "abilities": [
      "pressure",
      "snowcloak"
    ]
  },
  {
    "id": "zapdos",
    "name": "\u30B5\u30F3\u30C0\u30FC",
    "nameEn": "Zapdos",
    "type": "electric",
    "type2": "flying",
    "baseStats": {
      "hp": 90,
      "atk": 90,
      "def": 85,
      "spa": 125,
      "spd": 90,
      "spe": 100
    },
    "abilities": [
      "pressure",
      "static"
    ]
  },
  {
    "id": "moltres",
    "name": "\u30D5\u30A1\u30A4\u30E4\u30FC",
    "nameEn": "Moltres",
    "type": "fire",
    "type2": "flying",
    "baseStats": {
      "hp": 90,
      "atk": 100,
      "def": 90,
      "spa": 125,
      "spd": 85,
      "spe": 90
    },
    "abilities": [
      "pressure",
      "flamebody"
    ]
  },
  {
    "id": "dratini",
    "name": "\u30DF\u30CB\u30EA\u30E5\u30A6",
    "nameEn": "Dratini",
    "type": "dragon",
    "baseStats": {
      "hp": 41,
      "atk": 64,
      "def": 45,
      "spa": 50,
      "spd": 50,
      "spe": 50
    },
    "abilities": [
      "shedskin",
      "marvelscale"
    ]
  },
  {
    "id": "dragonair",
    "name": "\u30CF\u30AF\u30EA\u30E5\u30FC",
    "nameEn": "Dragonair",
    "type": "dragon",
    "baseStats": {
      "hp": 61,
      "atk": 84,
      "def": 65,
      "spa": 70,
      "spd": 70,
      "spe": 70
    },
    "abilities": [
      "shedskin",
      "marvelscale"
    ]
  },
  {
    "id": "dragonite",
    "name": "\u30AB\u30A4\u30EA\u30E5\u30FC",
    "nameEn": "Dragonite",
    "type": "dragon",
    "type2": "flying",
    "baseStats": {
      "hp": 91,
      "atk": 134,
      "def": 95,
      "spa": 100,
      "spd": 100,
      "spe": 80
    },
    "abilities": [
      "innerfocus",
      "multiscale"
    ]
  },
  {
    "id": "mewtwo",
    "name": "\u30DF\u30E5\u30A6\u30C4\u30FC",
    "nameEn": "Mewtwo",
    "type": "psychic",
    "baseStats": {
      "hp": 106,
      "atk": 110,
      "def": 90,
      "spa": 154,
      "spd": 90,
      "spe": 130
    },
    "abilities": [
      "pressure",
      "unnerve"
    ]
  },
  {
    "id": "mew",
    "name": "\u30DF\u30E5\u30A6",
    "nameEn": "Mew",
    "type": "psychic",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 100,
      "spa": 100,
      "spd": 100,
      "spe": 100
    },
    "abilities": [
      "synchronize"
    ]
  },
  {
    "id": "chikorita",
    "name": "\u30C1\u30B3\u30EA\u30FC\u30BF",
    "nameEn": "Chikorita",
    "type": "grass",
    "baseStats": {
      "hp": 45,
      "atk": 49,
      "def": 65,
      "spa": 49,
      "spd": 65,
      "spe": 45
    },
    "abilities": [
      "overgrow",
      "leafguard"
    ]
  },
  {
    "id": "bayleef",
    "name": "\u30D9\u30A4\u30EA\u30FC\u30D5",
    "nameEn": "Bayleef",
    "type": "grass",
    "baseStats": {
      "hp": 60,
      "atk": 62,
      "def": 80,
      "spa": 63,
      "spd": 80,
      "spe": 60
    },
    "abilities": [
      "overgrow",
      "leafguard"
    ]
  },
  {
    "id": "meganium",
    "name": "\u30E1\u30AC\u30CB\u30A6\u30E0",
    "nameEn": "Meganium",
    "type": "grass",
    "baseStats": {
      "hp": 80,
      "atk": 82,
      "def": 100,
      "spa": 83,
      "spd": 100,
      "spe": 80
    },
    "abilities": [
      "overgrow",
      "leafguard"
    ]
  },
  {
    "id": "cyndaquil",
    "name": "\u30D2\u30CE\u30A2\u30E9\u30B7",
    "nameEn": "Cyndaquil",
    "type": "fire",
    "baseStats": {
      "hp": 39,
      "atk": 52,
      "def": 43,
      "spa": 60,
      "spd": 50,
      "spe": 65
    },
    "abilities": [
      "blaze",
      "flashfire"
    ]
  },
  {
    "id": "quilava",
    "name": "\u30DE\u30B0\u30DE\u30E9\u30B7",
    "nameEn": "Quilava",
    "type": "fire",
    "baseStats": {
      "hp": 58,
      "atk": 64,
      "def": 58,
      "spa": 80,
      "spd": 65,
      "spe": 80
    },
    "abilities": [
      "blaze",
      "flashfire"
    ]
  },
  {
    "id": "typhlosion",
    "name": "\u30D0\u30AF\u30D5\u30FC\u30F3",
    "nameEn": "Typhlosion",
    "type": "fire",
    "baseStats": {
      "hp": 78,
      "atk": 84,
      "def": 78,
      "spa": 109,
      "spd": 85,
      "spe": 100
    },
    "abilities": [
      "blaze",
      "flashfire"
    ]
  },
  {
    "id": "totodile",
    "name": "\u30EF\u30CB\u30CE\u30B3",
    "nameEn": "Totodile",
    "type": "water",
    "baseStats": {
      "hp": 50,
      "atk": 65,
      "def": 64,
      "spa": 44,
      "spd": 48,
      "spe": 43
    },
    "abilities": [
      "torrent",
      "sheerforce"
    ]
  },
  {
    "id": "croconaw",
    "name": "\u30A2\u30EA\u30B2\u30A4\u30C4",
    "nameEn": "Croconaw",
    "type": "water",
    "baseStats": {
      "hp": 65,
      "atk": 80,
      "def": 80,
      "spa": 59,
      "spd": 63,
      "spe": 58
    },
    "abilities": [
      "torrent",
      "sheerforce"
    ]
  },
  {
    "id": "feraligatr",
    "name": "\u30AA\u30FC\u30C0\u30A4\u30EB",
    "nameEn": "Feraligatr",
    "type": "water",
    "baseStats": {
      "hp": 85,
      "atk": 105,
      "def": 100,
      "spa": 79,
      "spd": 83,
      "spe": 78
    },
    "abilities": [
      "torrent",
      "sheerforce"
    ]
  },
  {
    "id": "sentret",
    "name": "\u30AA\u30BF\u30C1",
    "nameEn": "Sentret",
    "type": "normal",
    "baseStats": {
      "hp": 35,
      "atk": 46,
      "def": 34,
      "spa": 35,
      "spd": 45,
      "spe": 20
    },
    "abilities": [
      "runaway",
      "keeneye",
      "frisk"
    ]
  },
  {
    "id": "furret",
    "name": "\u30AA\u30AA\u30BF\u30C1",
    "nameEn": "Furret",
    "type": "normal",
    "baseStats": {
      "hp": 85,
      "atk": 76,
      "def": 64,
      "spa": 45,
      "spd": 55,
      "spe": 90
    },
    "abilities": [
      "runaway",
      "keeneye",
      "frisk"
    ]
  },
  {
    "id": "hoothoot",
    "name": "\u30DB\u30FC\u30DB\u30FC",
    "nameEn": "Hoothoot",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 60,
      "atk": 30,
      "def": 30,
      "spa": 36,
      "spd": 56,
      "spe": 50
    },
    "abilities": [
      "insomnia",
      "keeneye",
      "tintedlens"
    ]
  },
  {
    "id": "noctowl",
    "name": "\u30E8\u30EB\u30CE\u30BA\u30AF",
    "nameEn": "Noctowl",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 100,
      "atk": 50,
      "def": 50,
      "spa": 86,
      "spd": 96,
      "spe": 70
    },
    "abilities": [
      "insomnia",
      "keeneye",
      "tintedlens"
    ]
  },
  {
    "id": "ledyba",
    "name": "\u30EC\u30C7\u30A3\u30D0",
    "nameEn": "Ledyba",
    "type": "bug",
    "type2": "flying",
    "baseStats": {
      "hp": 40,
      "atk": 20,
      "def": 30,
      "spa": 40,
      "spd": 80,
      "spe": 55
    },
    "abilities": [
      "swarm",
      "earlybird",
      "rattled"
    ]
  },
  {
    "id": "ledian",
    "name": "\u30EC\u30C7\u30A3\u30A2\u30F3",
    "nameEn": "Ledian",
    "type": "bug",
    "type2": "flying",
    "baseStats": {
      "hp": 55,
      "atk": 35,
      "def": 50,
      "spa": 55,
      "spd": 110,
      "spe": 85
    },
    "abilities": [
      "swarm",
      "earlybird",
      "ironfist"
    ]
  },
  {
    "id": "spinarak",
    "name": "\u30A4\u30C8\u30DE\u30EB",
    "nameEn": "Spinarak",
    "type": "bug",
    "type2": "poison",
    "baseStats": {
      "hp": 40,
      "atk": 60,
      "def": 40,
      "spa": 40,
      "spd": 40,
      "spe": 30
    },
    "abilities": [
      "swarm",
      "insomnia",
      "sniper"
    ]
  },
  {
    "id": "ariados",
    "name": "\u30A2\u30EA\u30A2\u30C9\u30B9",
    "nameEn": "Ariados",
    "type": "bug",
    "type2": "poison",
    "baseStats": {
      "hp": 70,
      "atk": 90,
      "def": 70,
      "spa": 60,
      "spd": 70,
      "spe": 40
    },
    "abilities": [
      "swarm",
      "insomnia",
      "sniper"
    ]
  },
  {
    "id": "crobat",
    "name": "\u30AF\u30ED\u30D0\u30C3\u30C8",
    "nameEn": "Crobat",
    "type": "poison",
    "type2": "flying",
    "baseStats": {
      "hp": 85,
      "atk": 90,
      "def": 80,
      "spa": 70,
      "spd": 80,
      "spe": 130
    },
    "abilities": [
      "innerfocus",
      "infiltrator"
    ]
  },
  {
    "id": "chinchou",
    "name": "\u30C1\u30E7\u30F3\u30C1\u30FC",
    "nameEn": "Chinchou",
    "type": "water",
    "type2": "electric",
    "baseStats": {
      "hp": 75,
      "atk": 38,
      "def": 38,
      "spa": 56,
      "spd": 56,
      "spe": 67
    },
    "abilities": [
      "voltabsorb",
      "illuminate",
      "waterabsorb"
    ]
  },
  {
    "id": "lanturn",
    "name": "\u30E9\u30F3\u30BF\u30FC\u30F3",
    "nameEn": "Lanturn",
    "type": "water",
    "type2": "electric",
    "baseStats": {
      "hp": 125,
      "atk": 58,
      "def": 58,
      "spa": 76,
      "spd": 76,
      "spe": 67
    },
    "abilities": [
      "voltabsorb",
      "illuminate",
      "waterabsorb"
    ]
  },
  {
    "id": "pichu",
    "name": "\u30D4\u30C1\u30E5\u30FC",
    "nameEn": "Pichu",
    "type": "electric",
    "baseStats": {
      "hp": 20,
      "atk": 40,
      "def": 15,
      "spa": 35,
      "spd": 35,
      "spe": 60
    },
    "abilities": [
      "static",
      "lightningrod"
    ]
  },
  {
    "id": "cleffa",
    "name": "\u30D4\u30A3",
    "nameEn": "Cleffa",
    "type": "fairy",
    "baseStats": {
      "hp": 50,
      "atk": 25,
      "def": 28,
      "spa": 45,
      "spd": 55,
      "spe": 15
    },
    "abilities": [
      "cutecharm",
      "magicguard",
      "friendguard"
    ]
  },
  {
    "id": "igglybuff",
    "name": "\u30D7\u30D7\u30EA\u30F3",
    "nameEn": "Igglybuff",
    "type": "normal",
    "type2": "fairy",
    "baseStats": {
      "hp": 90,
      "atk": 30,
      "def": 15,
      "spa": 40,
      "spd": 20,
      "spe": 15
    },
    "abilities": [
      "cutecharm",
      "competitive",
      "friendguard"
    ]
  },
  {
    "id": "togepi",
    "name": "\u30C8\u30B2\u30D4\u30FC",
    "nameEn": "Togepi",
    "type": "fairy",
    "baseStats": {
      "hp": 35,
      "atk": 20,
      "def": 65,
      "spa": 40,
      "spd": 65,
      "spe": 20
    },
    "abilities": [
      "hustle",
      "serenegrace",
      "superluck"
    ]
  },
  {
    "id": "togetic",
    "name": "\u30C8\u30B2\u30C1\u30C3\u30AF",
    "nameEn": "Togetic",
    "type": "fairy",
    "type2": "flying",
    "baseStats": {
      "hp": 55,
      "atk": 40,
      "def": 85,
      "spa": 80,
      "spd": 105,
      "spe": 40
    },
    "abilities": [
      "hustle",
      "serenegrace",
      "superluck"
    ]
  },
  {
    "id": "natu",
    "name": "\u30CD\u30A4\u30C6\u30A3",
    "nameEn": "Natu",
    "type": "psychic",
    "type2": "flying",
    "baseStats": {
      "hp": 40,
      "atk": 50,
      "def": 45,
      "spa": 70,
      "spd": 45,
      "spe": 70
    },
    "abilities": [
      "synchronize",
      "earlybird",
      "magicbounce"
    ]
  },
  {
    "id": "xatu",
    "name": "\u30CD\u30A4\u30C6\u30A3\u30AA",
    "nameEn": "Xatu",
    "type": "psychic",
    "type2": "flying",
    "baseStats": {
      "hp": 65,
      "atk": 75,
      "def": 70,
      "spa": 95,
      "spd": 70,
      "spe": 95
    },
    "abilities": [
      "synchronize",
      "earlybird",
      "magicbounce"
    ]
  },
  {
    "id": "mareep",
    "name": "\u30E1\u30EA\u30FC\u30D7",
    "nameEn": "Mareep",
    "type": "electric",
    "baseStats": {
      "hp": 55,
      "atk": 40,
      "def": 40,
      "spa": 65,
      "spd": 45,
      "spe": 35
    },
    "abilities": [
      "static",
      "plus"
    ]
  },
  {
    "id": "flaaffy",
    "name": "\u30E2\u30B3\u30B3",
    "nameEn": "Flaaffy",
    "type": "electric",
    "baseStats": {
      "hp": 70,
      "atk": 55,
      "def": 55,
      "spa": 80,
      "spd": 60,
      "spe": 45
    },
    "abilities": [
      "static",
      "plus"
    ]
  },
  {
    "id": "ampharos",
    "name": "\u30C7\u30F3\u30EA\u30E5\u30A6",
    "nameEn": "Ampharos",
    "type": "electric",
    "baseStats": {
      "hp": 90,
      "atk": 75,
      "def": 85,
      "spa": 115,
      "spd": 90,
      "spe": 55
    },
    "abilities": [
      "static",
      "plus"
    ]
  },
  {
    "id": "bellossom",
    "name": "\u30AD\u30EC\u30A4\u30CF\u30CA",
    "nameEn": "Bellossom",
    "type": "grass",
    "baseStats": {
      "hp": 75,
      "atk": 80,
      "def": 95,
      "spa": 90,
      "spd": 100,
      "spe": 50
    },
    "abilities": [
      "chlorophyll",
      "healer"
    ]
  },
  {
    "id": "marill",
    "name": "\u30DE\u30EA\u30EB",
    "nameEn": "Marill",
    "type": "water",
    "type2": "fairy",
    "baseStats": {
      "hp": 70,
      "atk": 20,
      "def": 50,
      "spa": 20,
      "spd": 50,
      "spe": 40
    },
    "abilities": [
      "thickfat",
      "hugepower",
      "sapsipper"
    ]
  },
  {
    "id": "azumarill",
    "name": "\u30DE\u30EA\u30EB\u30EA",
    "nameEn": "Azumarill",
    "type": "water",
    "type2": "fairy",
    "baseStats": {
      "hp": 100,
      "atk": 50,
      "def": 80,
      "spa": 60,
      "spd": 80,
      "spe": 50
    },
    "abilities": [
      "thickfat",
      "hugepower",
      "sapsipper"
    ]
  },
  {
    "id": "sudowoodo",
    "name": "\u30A6\u30BD\u30C3\u30AD\u30FC",
    "nameEn": "Sudowoodo",
    "type": "rock",
    "baseStats": {
      "hp": 70,
      "atk": 100,
      "def": 115,
      "spa": 30,
      "spd": 65,
      "spe": 30
    },
    "abilities": [
      "sturdy",
      "rockhead",
      "rattled"
    ]
  },
  {
    "id": "politoed",
    "name": "\u30CB\u30E7\u30ED\u30C8\u30CE",
    "nameEn": "Politoed",
    "type": "water",
    "baseStats": {
      "hp": 90,
      "atk": 75,
      "def": 75,
      "spa": 90,
      "spd": 100,
      "spe": 70
    },
    "abilities": [
      "waterabsorb",
      "damp",
      "drizzle"
    ]
  },
  {
    "id": "hoppip",
    "name": "\u30CF\u30CD\u30C3\u30B3",
    "nameEn": "Hoppip",
    "type": "grass",
    "type2": "flying",
    "baseStats": {
      "hp": 35,
      "atk": 35,
      "def": 40,
      "spa": 35,
      "spd": 55,
      "spe": 50
    },
    "abilities": [
      "chlorophyll",
      "leafguard",
      "infiltrator"
    ]
  },
  {
    "id": "skiploom",
    "name": "\u30DD\u30DD\u30C3\u30B3",
    "nameEn": "Skiploom",
    "type": "grass",
    "type2": "flying",
    "baseStats": {
      "hp": 55,
      "atk": 45,
      "def": 50,
      "spa": 45,
      "spd": 65,
      "spe": 80
    },
    "abilities": [
      "chlorophyll",
      "leafguard",
      "infiltrator"
    ]
  },
  {
    "id": "jumpluff",
    "name": "\u30EF\u30BF\u30C3\u30B3",
    "nameEn": "Jumpluff",
    "type": "grass",
    "type2": "flying",
    "baseStats": {
      "hp": 75,
      "atk": 55,
      "def": 70,
      "spa": 55,
      "spd": 95,
      "spe": 110
    },
    "abilities": [
      "chlorophyll",
      "leafguard",
      "infiltrator"
    ]
  },
  {
    "id": "aipom",
    "name": "\u30A8\u30A4\u30D1\u30E0",
    "nameEn": "Aipom",
    "type": "normal",
    "baseStats": {
      "hp": 55,
      "atk": 70,
      "def": 55,
      "spa": 40,
      "spd": 55,
      "spe": 85
    },
    "abilities": [
      "runaway",
      "pickup",
      "skilllink"
    ]
  },
  {
    "id": "sunkern",
    "name": "\u30D2\u30DE\u30CA\u30C3\u30C4",
    "nameEn": "Sunkern",
    "type": "grass",
    "baseStats": {
      "hp": 30,
      "atk": 30,
      "def": 30,
      "spa": 30,
      "spd": 30,
      "spe": 30
    },
    "abilities": [
      "chlorophyll",
      "solarpower",
      "earlybird"
    ]
  },
  {
    "id": "sunflora",
    "name": "\u30AD\u30DE\u30EF\u30EA",
    "nameEn": "Sunflora",
    "type": "grass",
    "baseStats": {
      "hp": 75,
      "atk": 75,
      "def": 55,
      "spa": 105,
      "spd": 85,
      "spe": 30
    },
    "abilities": [
      "chlorophyll",
      "solarpower",
      "earlybird"
    ]
  },
  {
    "id": "yanma",
    "name": "\u30E4\u30F3\u30E4\u30F3\u30DE",
    "nameEn": "Yanma",
    "type": "bug",
    "type2": "flying",
    "baseStats": {
      "hp": 65,
      "atk": 65,
      "def": 45,
      "spa": 75,
      "spd": 45,
      "spe": 95
    },
    "abilities": [
      "speedboost",
      "compoundeyes",
      "frisk"
    ]
  },
  {
    "id": "wooper",
    "name": "\u30A6\u30D1\u30FC",
    "nameEn": "Wooper",
    "type": "water",
    "type2": "ground",
    "baseStats": {
      "hp": 55,
      "atk": 45,
      "def": 45,
      "spa": 25,
      "spd": 25,
      "spe": 15
    },
    "abilities": [
      "damp",
      "waterabsorb",
      "unaware"
    ]
  },
  {
    "id": "quagsire",
    "name": "\u30CC\u30AA\u30FC",
    "nameEn": "Quagsire",
    "type": "water",
    "type2": "ground",
    "baseStats": {
      "hp": 95,
      "atk": 85,
      "def": 85,
      "spa": 65,
      "spd": 65,
      "spe": 35
    },
    "abilities": [
      "damp",
      "waterabsorb",
      "unaware"
    ]
  },
  {
    "id": "espeon",
    "name": "\u30A8\u30FC\u30D5\u30A3",
    "nameEn": "Espeon",
    "type": "psychic",
    "baseStats": {
      "hp": 65,
      "atk": 65,
      "def": 60,
      "spa": 130,
      "spd": 95,
      "spe": 110
    },
    "abilities": [
      "synchronize",
      "magicbounce"
    ]
  },
  {
    "id": "umbreon",
    "name": "\u30D6\u30E9\u30C3\u30AD\u30FC",
    "nameEn": "Umbreon",
    "type": "dark",
    "baseStats": {
      "hp": 95,
      "atk": 65,
      "def": 110,
      "spa": 60,
      "spd": 130,
      "spe": 65
    },
    "abilities": [
      "synchronize",
      "innerfocus"
    ]
  },
  {
    "id": "murkrow",
    "name": "\u30E4\u30DF\u30AB\u30E9\u30B9",
    "nameEn": "Murkrow",
    "type": "dark",
    "type2": "flying",
    "baseStats": {
      "hp": 60,
      "atk": 85,
      "def": 42,
      "spa": 85,
      "spd": 42,
      "spe": 91
    },
    "abilities": [
      "insomnia",
      "superluck",
      "prankster"
    ]
  },
  {
    "id": "slowking",
    "name": "\u30E4\u30C9\u30AD\u30F3\u30B0",
    "nameEn": "Slowking",
    "type": "water",
    "type2": "psychic",
    "baseStats": {
      "hp": 95,
      "atk": 75,
      "def": 80,
      "spa": 100,
      "spd": 110,
      "spe": 30
    },
    "abilities": [
      "oblivious",
      "owntempo",
      "regenerator"
    ]
  },
  {
    "id": "misdreavus",
    "name": "\u30E0\u30A6\u30DE",
    "nameEn": "Misdreavus",
    "type": "ghost",
    "baseStats": {
      "hp": 60,
      "atk": 60,
      "def": 60,
      "spa": 85,
      "spd": 85,
      "spe": 85
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "unown",
    "name": "\u30A2\u30F3\u30CE\u30FC\u30F3",
    "nameEn": "Unown",
    "type": "psychic",
    "baseStats": {
      "hp": 48,
      "atk": 72,
      "def": 48,
      "spa": 72,
      "spd": 48,
      "spe": 48
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "wobbuffet",
    "name": "\u30BD\u30FC\u30CA\u30F3\u30B9",
    "nameEn": "Wobbuffet",
    "type": "psychic",
    "baseStats": {
      "hp": 190,
      "atk": 33,
      "def": 58,
      "spa": 33,
      "spd": 58,
      "spe": 33
    },
    "abilities": [
      "shadowtag",
      "telepathy"
    ]
  },
  {
    "id": "girafarig",
    "name": "\u30AD\u30EA\u30F3\u30EA\u30AD",
    "nameEn": "Girafarig",
    "type": "normal",
    "type2": "psychic",
    "baseStats": {
      "hp": 70,
      "atk": 80,
      "def": 65,
      "spa": 90,
      "spd": 65,
      "spe": 85
    },
    "abilities": [
      "innerfocus",
      "earlybird",
      "sapsipper"
    ]
  },
  {
    "id": "pineco",
    "name": "\u30AF\u30CC\u30AE\u30C0\u30DE",
    "nameEn": "Pineco",
    "type": "bug",
    "baseStats": {
      "hp": 50,
      "atk": 65,
      "def": 90,
      "spa": 35,
      "spd": 35,
      "spe": 15
    },
    "abilities": [
      "sturdy",
      "overcoat"
    ]
  },
  {
    "id": "forretress",
    "name": "\u30D5\u30A9\u30EC\u30C8\u30B9",
    "nameEn": "Forretress",
    "type": "bug",
    "type2": "steel",
    "baseStats": {
      "hp": 75,
      "atk": 90,
      "def": 140,
      "spa": 60,
      "spd": 60,
      "spe": 40
    },
    "abilities": [
      "sturdy",
      "overcoat"
    ]
  },
  {
    "id": "dunsparce",
    "name": "\u30CE\u30B3\u30C3\u30C1",
    "nameEn": "Dunsparce",
    "type": "normal",
    "baseStats": {
      "hp": 100,
      "atk": 70,
      "def": 70,
      "spa": 65,
      "spd": 65,
      "spe": 45
    },
    "abilities": [
      "serenegrace",
      "runaway",
      "rattled"
    ]
  },
  {
    "id": "gligar",
    "name": "\u30B0\u30E9\u30A4\u30AC\u30FC",
    "nameEn": "Gligar",
    "type": "ground",
    "type2": "flying",
    "baseStats": {
      "hp": 65,
      "atk": 75,
      "def": 105,
      "spa": 35,
      "spd": 65,
      "spe": 85
    },
    "abilities": [
      "hypercutter",
      "sandveil",
      "immunity"
    ]
  },
  {
    "id": "steelix",
    "name": "\u30CF\u30AC\u30CD\u30FC\u30EB",
    "nameEn": "Steelix",
    "type": "steel",
    "type2": "ground",
    "baseStats": {
      "hp": 75,
      "atk": 85,
      "def": 200,
      "spa": 55,
      "spd": 65,
      "spe": 30
    },
    "abilities": [
      "rockhead",
      "sturdy",
      "sheerforce"
    ]
  },
  {
    "id": "snubbull",
    "name": "\u30D6\u30EB\u30FC",
    "nameEn": "Snubbull",
    "type": "fairy",
    "baseStats": {
      "hp": 60,
      "atk": 80,
      "def": 50,
      "spa": 40,
      "spd": 40,
      "spe": 30
    },
    "abilities": [
      "intimidate",
      "runaway",
      "rattled"
    ]
  },
  {
    "id": "granbull",
    "name": "\u30B0\u30E9\u30F3\u30D6\u30EB",
    "nameEn": "Granbull",
    "type": "fairy",
    "baseStats": {
      "hp": 90,
      "atk": 120,
      "def": 75,
      "spa": 60,
      "spd": 60,
      "spe": 45
    },
    "abilities": [
      "intimidate",
      "quickfeet",
      "rattled"
    ]
  },
  {
    "id": "qwilfish",
    "name": "\u30CF\u30EA\u30FC\u30BB\u30F3",
    "nameEn": "Qwilfish",
    "type": "water",
    "type2": "poison",
    "baseStats": {
      "hp": 65,
      "atk": 95,
      "def": 85,
      "spa": 55,
      "spd": 55,
      "spe": 85
    },
    "abilities": [
      "poisonpoint",
      "swiftswim",
      "intimidate"
    ]
  },
  {
    "id": "scizor",
    "name": "\u30CF\u30C3\u30B5\u30E0",
    "nameEn": "Scizor",
    "type": "bug",
    "type2": "steel",
    "baseStats": {
      "hp": 70,
      "atk": 130,
      "def": 100,
      "spa": 55,
      "spd": 80,
      "spe": 65
    },
    "abilities": [
      "swarm",
      "technician",
      "lightmetal"
    ]
  },
  {
    "id": "shuckle",
    "name": "\u30C4\u30DC\u30C4\u30DC",
    "nameEn": "Shuckle",
    "type": "bug",
    "type2": "rock",
    "baseStats": {
      "hp": 20,
      "atk": 10,
      "def": 230,
      "spa": 10,
      "spd": 230,
      "spe": 5
    },
    "abilities": [
      "sturdy",
      "gluttony",
      "contrary"
    ]
  },
  {
    "id": "heracross",
    "name": "\u30D8\u30E9\u30AF\u30ED\u30B9",
    "nameEn": "Heracross",
    "type": "bug",
    "type2": "fighting",
    "baseStats": {
      "hp": 80,
      "atk": 125,
      "def": 75,
      "spa": 40,
      "spd": 95,
      "spe": 85
    },
    "abilities": [
      "swarm",
      "guts",
      "moxie"
    ]
  },
  {
    "id": "sneasel",
    "name": "\u30CB\u30E5\u30FC\u30E9",
    "nameEn": "Sneasel",
    "type": "dark",
    "type2": "ice",
    "baseStats": {
      "hp": 55,
      "atk": 95,
      "def": 55,
      "spa": 35,
      "spd": 75,
      "spe": 115
    },
    "abilities": [
      "innerfocus",
      "keeneye",
      "pickpocket"
    ]
  },
  {
    "id": "teddiursa",
    "name": "\u30D2\u30E1\u30B0\u30DE",
    "nameEn": "Teddiursa",
    "type": "normal",
    "baseStats": {
      "hp": 60,
      "atk": 80,
      "def": 50,
      "spa": 50,
      "spd": 50,
      "spe": 40
    },
    "abilities": [
      "pickup",
      "quickfeet",
      "honeygather"
    ]
  },
  {
    "id": "ursaring",
    "name": "\u30EA\u30F3\u30B0\u30DE",
    "nameEn": "Ursaring",
    "type": "normal",
    "baseStats": {
      "hp": 90,
      "atk": 130,
      "def": 75,
      "spa": 75,
      "spd": 75,
      "spe": 55
    },
    "abilities": [
      "guts",
      "quickfeet",
      "unnerve"
    ]
  },
  {
    "id": "slugma",
    "name": "\u30DE\u30B0\u30DE\u30C3\u30B0",
    "nameEn": "Slugma",
    "type": "fire",
    "baseStats": {
      "hp": 40,
      "atk": 40,
      "def": 40,
      "spa": 70,
      "spd": 40,
      "spe": 20
    },
    "abilities": [
      "magmaarmor",
      "flamebody",
      "weakarmor"
    ]
  },
  {
    "id": "magcargo",
    "name": "\u30DE\u30B0\u30AB\u30EB\u30B4",
    "nameEn": "Magcargo",
    "type": "fire",
    "type2": "rock",
    "baseStats": {
      "hp": 60,
      "atk": 50,
      "def": 120,
      "spa": 90,
      "spd": 80,
      "spe": 30
    },
    "abilities": [
      "magmaarmor",
      "flamebody",
      "weakarmor"
    ]
  },
  {
    "id": "swinub",
    "name": "\u30A6\u30EA\u30E0\u30FC",
    "nameEn": "Swinub",
    "type": "ice",
    "type2": "ground",
    "baseStats": {
      "hp": 50,
      "atk": 50,
      "def": 40,
      "spa": 30,
      "spd": 30,
      "spe": 50
    },
    "abilities": [
      "oblivious",
      "snowcloak",
      "thickfat"
    ]
  },
  {
    "id": "piloswine",
    "name": "\u30A4\u30CE\u30E0\u30FC",
    "nameEn": "Piloswine",
    "type": "ice",
    "type2": "ground",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 80,
      "spa": 60,
      "spd": 60,
      "spe": 50
    },
    "abilities": [
      "oblivious",
      "snowcloak",
      "thickfat"
    ]
  },
  {
    "id": "corsola",
    "name": "\u30B5\u30CB\u30FC\u30B4",
    "nameEn": "Corsola",
    "type": "water",
    "type2": "rock",
    "baseStats": {
      "hp": 65,
      "atk": 55,
      "def": 95,
      "spa": 65,
      "spd": 95,
      "spe": 35
    },
    "abilities": [
      "hustle",
      "naturalcure",
      "regenerator"
    ]
  },
  {
    "id": "remoraid",
    "name": "\u30C6\u30C3\u30DD\u30A6\u30AA",
    "nameEn": "Remoraid",
    "type": "water",
    "baseStats": {
      "hp": 35,
      "atk": 65,
      "def": 35,
      "spa": 65,
      "spd": 35,
      "spe": 65
    },
    "abilities": [
      "hustle",
      "sniper",
      "moody"
    ]
  },
  {
    "id": "octillery",
    "name": "\u30AA\u30AF\u30BF\u30F3",
    "nameEn": "Octillery",
    "type": "water",
    "baseStats": {
      "hp": 75,
      "atk": 105,
      "def": 75,
      "spa": 105,
      "spd": 75,
      "spe": 45
    },
    "abilities": [
      "suctioncups",
      "sniper",
      "moody"
    ]
  },
  {
    "id": "delibird",
    "name": "\u30C7\u30EA\u30D0\u30FC\u30C9",
    "nameEn": "Delibird",
    "type": "ice",
    "type2": "flying",
    "baseStats": {
      "hp": 45,
      "atk": 55,
      "def": 45,
      "spa": 65,
      "spd": 45,
      "spe": 75
    },
    "abilities": [
      "vitalspirit",
      "hustle",
      "insomnia"
    ]
  },
  {
    "id": "mantine",
    "name": "\u30DE\u30F3\u30BF\u30A4\u30F3",
    "nameEn": "Mantine",
    "type": "water",
    "type2": "flying",
    "baseStats": {
      "hp": 85,
      "atk": 40,
      "def": 70,
      "spa": 80,
      "spd": 140,
      "spe": 70
    },
    "abilities": [
      "swiftswim",
      "waterabsorb",
      "waterveil"
    ]
  },
  {
    "id": "skarmory",
    "name": "\u30A8\u30A2\u30FC\u30E0\u30C9",
    "nameEn": "Skarmory",
    "type": "steel",
    "type2": "flying",
    "baseStats": {
      "hp": 65,
      "atk": 80,
      "def": 140,
      "spa": 40,
      "spd": 70,
      "spe": 70
    },
    "abilities": [
      "keeneye",
      "sturdy",
      "weakarmor"
    ]
  },
  {
    "id": "houndour",
    "name": "\u30C7\u30EB\u30D3\u30EB",
    "nameEn": "Houndour",
    "type": "dark",
    "type2": "fire",
    "baseStats": {
      "hp": 45,
      "atk": 60,
      "def": 30,
      "spa": 80,
      "spd": 50,
      "spe": 65
    },
    "abilities": [
      "earlybird",
      "flashfire",
      "unnerve"
    ]
  },
  {
    "id": "houndoom",
    "name": "\u30D8\u30EB\u30AC\u30FC",
    "nameEn": "Houndoom",
    "type": "dark",
    "type2": "fire",
    "baseStats": {
      "hp": 75,
      "atk": 90,
      "def": 50,
      "spa": 110,
      "spd": 80,
      "spe": 95
    },
    "abilities": [
      "earlybird",
      "flashfire",
      "unnerve"
    ]
  },
  {
    "id": "kingdra",
    "name": "\u30AD\u30F3\u30B0\u30C9\u30E9",
    "nameEn": "Kingdra",
    "type": "water",
    "type2": "dragon",
    "baseStats": {
      "hp": 75,
      "atk": 95,
      "def": 95,
      "spa": 95,
      "spd": 95,
      "spe": 85
    },
    "abilities": [
      "swiftswim",
      "sniper",
      "damp"
    ]
  },
  {
    "id": "phanpy",
    "name": "\u30B4\u30DE\u30BE\u30A6",
    "nameEn": "Phanpy",
    "type": "ground",
    "baseStats": {
      "hp": 90,
      "atk": 60,
      "def": 60,
      "spa": 40,
      "spd": 40,
      "spe": 40
    },
    "abilities": [
      "pickup",
      "sandveil"
    ]
  },
  {
    "id": "donphan",
    "name": "\u30C9\u30F3\u30D5\u30A1\u30F3",
    "nameEn": "Donphan",
    "type": "ground",
    "baseStats": {
      "hp": 90,
      "atk": 120,
      "def": 120,
      "spa": 60,
      "spd": 60,
      "spe": 50
    },
    "abilities": [
      "sturdy",
      "sandveil"
    ]
  },
  {
    "id": "porygon2",
    "name": "\u30DD\u30EA\u30B4\u30F3\uFF12",
    "nameEn": "Porygon2",
    "type": "normal",
    "baseStats": {
      "hp": 85,
      "atk": 80,
      "def": 90,
      "spa": 105,
      "spd": 95,
      "spe": 60
    },
    "abilities": [
      "trace",
      "download",
      "analytic"
    ]
  },
  {
    "id": "stantler",
    "name": "\u30AA\u30C9\u30B7\u30B7",
    "nameEn": "Stantler",
    "type": "normal",
    "baseStats": {
      "hp": 73,
      "atk": 95,
      "def": 62,
      "spa": 85,
      "spd": 65,
      "spe": 85
    },
    "abilities": [
      "intimidate",
      "frisk",
      "sapsipper"
    ]
  },
  {
    "id": "smeargle",
    "name": "\u30C9\u30FC\u30D6\u30EB",
    "nameEn": "Smeargle",
    "type": "normal",
    "baseStats": {
      "hp": 55,
      "atk": 20,
      "def": 35,
      "spa": 20,
      "spd": 45,
      "spe": 75
    },
    "abilities": [
      "owntempo",
      "technician",
      "moody"
    ]
  },
  {
    "id": "tyrogue",
    "name": "Tyrogue",
    "nameEn": "Tyrogue",
    "type": "fighting",
    "baseStats": {
      "hp": 35,
      "atk": 35,
      "def": 35,
      "spa": 35,
      "spd": 35,
      "spe": 35
    },
    "abilities": [
      "guts",
      "steadfast",
      "vitalspirit"
    ]
  },
  {
    "id": "hitmontop",
    "name": "\u30AB\u30DD\u30A8\u30E9\u30FC",
    "nameEn": "Hitmontop",
    "type": "fighting",
    "baseStats": {
      "hp": 50,
      "atk": 95,
      "def": 95,
      "spa": 35,
      "spd": 110,
      "spe": 70
    },
    "abilities": [
      "intimidate",
      "technician",
      "steadfast"
    ]
  },
  {
    "id": "smoochum",
    "name": "\u30E0\u30C1\u30E5\u30FC\u30EB",
    "nameEn": "Smoochum",
    "type": "ice",
    "type2": "psychic",
    "baseStats": {
      "hp": 45,
      "atk": 30,
      "def": 15,
      "spa": 85,
      "spd": 65,
      "spe": 65
    },
    "abilities": [
      "oblivious",
      "forewarn",
      "hydration"
    ]
  },
  {
    "id": "elekid",
    "name": "\u30A8\u30EC\u30AD\u30C3\u30C9",
    "nameEn": "Elekid",
    "type": "electric",
    "baseStats": {
      "hp": 45,
      "atk": 63,
      "def": 37,
      "spa": 65,
      "spd": 55,
      "spe": 95
    },
    "abilities": [
      "static",
      "vitalspirit"
    ]
  },
  {
    "id": "magby",
    "name": "\u30D6\u30D3\u30A3",
    "nameEn": "Magby",
    "type": "fire",
    "baseStats": {
      "hp": 45,
      "atk": 75,
      "def": 37,
      "spa": 70,
      "spd": 55,
      "spe": 83
    },
    "abilities": [
      "flamebody",
      "vitalspirit"
    ]
  },
  {
    "id": "miltank",
    "name": "\u30DF\u30EB\u30BF\u30F3\u30AF",
    "nameEn": "Miltank",
    "type": "normal",
    "baseStats": {
      "hp": 95,
      "atk": 80,
      "def": 105,
      "spa": 40,
      "spd": 70,
      "spe": 100
    },
    "abilities": [
      "thickfat",
      "scrappy",
      "sapsipper"
    ]
  },
  {
    "id": "blissey",
    "name": "\u30CF\u30D4\u30CA\u30B9",
    "nameEn": "Blissey",
    "type": "normal",
    "baseStats": {
      "hp": 255,
      "atk": 10,
      "def": 10,
      "spa": 75,
      "spd": 135,
      "spe": 55
    },
    "abilities": [
      "naturalcure",
      "serenegrace",
      "healer"
    ]
  },
  {
    "id": "raikou",
    "name": "\u30E9\u30A4\u30B3\u30A6",
    "nameEn": "Raikou",
    "type": "electric",
    "baseStats": {
      "hp": 90,
      "atk": 85,
      "def": 75,
      "spa": 115,
      "spd": 100,
      "spe": 115
    },
    "abilities": [
      "pressure",
      "innerfocus"
    ]
  },
  {
    "id": "entei",
    "name": "\u30A8\u30F3\u30C6\u30A4",
    "nameEn": "Entei",
    "type": "fire",
    "baseStats": {
      "hp": 115,
      "atk": 115,
      "def": 85,
      "spa": 90,
      "spd": 75,
      "spe": 100
    },
    "abilities": [
      "pressure",
      "innerfocus"
    ]
  },
  {
    "id": "suicune",
    "name": "\u30B9\u30A4\u30AF\u30F3",
    "nameEn": "Suicune",
    "type": "water",
    "baseStats": {
      "hp": 100,
      "atk": 75,
      "def": 115,
      "spa": 90,
      "spd": 115,
      "spe": 85
    },
    "abilities": [
      "pressure",
      "innerfocus"
    ]
  },
  {
    "id": "larvitar",
    "name": "\u30E8\u30FC\u30AE\u30E9\u30B9",
    "nameEn": "Larvitar",
    "type": "rock",
    "type2": "ground",
    "baseStats": {
      "hp": 50,
      "atk": 64,
      "def": 50,
      "spa": 45,
      "spd": 50,
      "spe": 41
    },
    "abilities": [
      "guts",
      "sandveil"
    ]
  },
  {
    "id": "pupitar",
    "name": "\u30B5\u30CA\u30AE\u30E9\u30B9",
    "nameEn": "Pupitar",
    "type": "rock",
    "type2": "ground",
    "baseStats": {
      "hp": 70,
      "atk": 84,
      "def": 70,
      "spa": 65,
      "spd": 70,
      "spe": 51
    },
    "abilities": [
      "shedskin"
    ]
  },
  {
    "id": "tyranitar",
    "name": "\u30D0\u30F3\u30AE\u30E9\u30B9",
    "nameEn": "Tyranitar",
    "type": "rock",
    "type2": "dark",
    "baseStats": {
      "hp": 100,
      "atk": 134,
      "def": 110,
      "spa": 95,
      "spd": 100,
      "spe": 61
    },
    "abilities": [
      "sandstream",
      "unnerve"
    ]
  },
  {
    "id": "lugia",
    "name": "\u30EB\u30AE\u30A2",
    "nameEn": "Lugia",
    "type": "psychic",
    "type2": "flying",
    "baseStats": {
      "hp": 106,
      "atk": 90,
      "def": 130,
      "spa": 90,
      "spd": 154,
      "spe": 110
    },
    "abilities": [
      "pressure",
      "multiscale"
    ]
  },
  {
    "id": "hooh",
    "name": "\u30DB\u30A6\u30AA\u30A6",
    "nameEn": "Ho-Oh",
    "type": "fire",
    "type2": "flying",
    "baseStats": {
      "hp": 106,
      "atk": 130,
      "def": 90,
      "spa": 110,
      "spd": 154,
      "spe": 90
    },
    "abilities": [
      "pressure",
      "regenerator"
    ]
  },
  {
    "id": "celebi",
    "name": "\u30BB\u30EC\u30D3\u30A3",
    "nameEn": "Celebi",
    "type": "psychic",
    "type2": "grass",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 100,
      "spa": 100,
      "spd": 100,
      "spe": 100
    },
    "abilities": [
      "naturalcure"
    ]
  },
  {
    "id": "treecko",
    "name": "\u30AD\u30E2\u30EA",
    "nameEn": "Treecko",
    "type": "grass",
    "baseStats": {
      "hp": 40,
      "atk": 45,
      "def": 35,
      "spa": 65,
      "spd": 55,
      "spe": 70
    },
    "abilities": [
      "overgrow",
      "unburden"
    ]
  },
  {
    "id": "grovyle",
    "name": "\u30B8\u30E5\u30D7\u30C8\u30EB",
    "nameEn": "Grovyle",
    "type": "grass",
    "baseStats": {
      "hp": 50,
      "atk": 65,
      "def": 45,
      "spa": 85,
      "spd": 65,
      "spe": 95
    },
    "abilities": [
      "overgrow",
      "unburden"
    ]
  },
  {
    "id": "sceptile",
    "name": "\u30B8\u30E5\u30AB\u30A4\u30F3",
    "nameEn": "Sceptile",
    "type": "grass",
    "baseStats": {
      "hp": 70,
      "atk": 85,
      "def": 65,
      "spa": 105,
      "spd": 85,
      "spe": 120
    },
    "abilities": [
      "overgrow",
      "unburden"
    ]
  },
  {
    "id": "torchic",
    "name": "\u30A2\u30C1\u30E3\u30E2",
    "nameEn": "Torchic",
    "type": "fire",
    "baseStats": {
      "hp": 45,
      "atk": 60,
      "def": 40,
      "spa": 70,
      "spd": 50,
      "spe": 45
    },
    "abilities": [
      "blaze",
      "speedboost"
    ]
  },
  {
    "id": "combusken",
    "name": "\u30EF\u30AB\u30B7\u30E3\u30E2",
    "nameEn": "Combusken",
    "type": "fire",
    "type2": "fighting",
    "baseStats": {
      "hp": 60,
      "atk": 85,
      "def": 60,
      "spa": 85,
      "spd": 60,
      "spe": 55
    },
    "abilities": [
      "blaze",
      "speedboost"
    ]
  },
  {
    "id": "blaziken",
    "name": "\u30D0\u30B7\u30E3\u30FC\u30E2",
    "nameEn": "Blaziken",
    "type": "fire",
    "type2": "fighting",
    "baseStats": {
      "hp": 80,
      "atk": 120,
      "def": 70,
      "spa": 110,
      "spd": 70,
      "spe": 80
    },
    "abilities": [
      "blaze",
      "speedboost"
    ]
  },
  {
    "id": "mudkip",
    "name": "\u30DF\u30BA\u30B4\u30ED\u30A6",
    "nameEn": "Mudkip",
    "type": "water",
    "baseStats": {
      "hp": 50,
      "atk": 70,
      "def": 50,
      "spa": 50,
      "spd": 50,
      "spe": 40
    },
    "abilities": [
      "torrent",
      "damp"
    ]
  },
  {
    "id": "marshtomp",
    "name": "\u30CC\u30DE\u30AF\u30ED\u30FC",
    "nameEn": "Marshtomp",
    "type": "water",
    "type2": "ground",
    "baseStats": {
      "hp": 70,
      "atk": 85,
      "def": 70,
      "spa": 60,
      "spd": 70,
      "spe": 50
    },
    "abilities": [
      "torrent",
      "damp"
    ]
  },
  {
    "id": "swampert",
    "name": "\u30E9\u30B0\u30E9\u30FC\u30B8",
    "nameEn": "Swampert",
    "type": "water",
    "type2": "ground",
    "baseStats": {
      "hp": 100,
      "atk": 110,
      "def": 90,
      "spa": 85,
      "spd": 90,
      "spe": 60
    },
    "abilities": [
      "torrent",
      "damp"
    ]
  },
  {
    "id": "poochyena",
    "name": "\u30DD\u30C1\u30A8\u30CA",
    "nameEn": "Poochyena",
    "type": "dark",
    "baseStats": {
      "hp": 35,
      "atk": 55,
      "def": 35,
      "spa": 30,
      "spd": 30,
      "spe": 35
    },
    "abilities": [
      "runaway",
      "quickfeet",
      "rattled"
    ]
  },
  {
    "id": "mightyena",
    "name": "\u30B0\u30E9\u30A8\u30CA",
    "nameEn": "Mightyena",
    "type": "dark",
    "baseStats": {
      "hp": 70,
      "atk": 90,
      "def": 70,
      "spa": 60,
      "spd": 60,
      "spe": 70
    },
    "abilities": [
      "intimidate",
      "quickfeet",
      "moxie"
    ]
  },
  {
    "id": "zigzagoon",
    "name": "\u30B8\u30B0\u30B6\u30B0\u30DE",
    "nameEn": "Zigzagoon",
    "type": "normal",
    "baseStats": {
      "hp": 38,
      "atk": 30,
      "def": 41,
      "spa": 30,
      "spd": 41,
      "spe": 60
    },
    "abilities": [
      "pickup",
      "gluttony",
      "quickfeet"
    ]
  },
  {
    "id": "linoone",
    "name": "\u30DE\u30C3\u30B9\u30B0\u30DE",
    "nameEn": "Linoone",
    "type": "normal",
    "baseStats": {
      "hp": 78,
      "atk": 70,
      "def": 61,
      "spa": 50,
      "spd": 61,
      "spe": 100
    },
    "abilities": [
      "pickup",
      "gluttony",
      "quickfeet"
    ]
  },
  {
    "id": "wurmple",
    "name": "\u30B1\u30E0\u30C3\u30BD",
    "nameEn": "Wurmple",
    "type": "bug",
    "baseStats": {
      "hp": 45,
      "atk": 45,
      "def": 35,
      "spa": 20,
      "spd": 30,
      "spe": 20
    },
    "abilities": [
      "shielddust",
      "runaway"
    ]
  },
  {
    "id": "silcoon",
    "name": "\u30AB\u30E9\u30B5\u30EA\u30B9",
    "nameEn": "Silcoon",
    "type": "bug",
    "baseStats": {
      "hp": 50,
      "atk": 35,
      "def": 55,
      "spa": 25,
      "spd": 25,
      "spe": 15
    },
    "abilities": [
      "shedskin"
    ]
  },
  {
    "id": "beautifly",
    "name": "\u30A2\u30B2\u30CF\u30F3\u30C8",
    "nameEn": "Beautifly",
    "type": "bug",
    "type2": "flying",
    "baseStats": {
      "hp": 60,
      "atk": 70,
      "def": 50,
      "spa": 100,
      "spd": 50,
      "spe": 65
    },
    "abilities": [
      "swarm",
      "rivalry"
    ]
  },
  {
    "id": "cascoon",
    "name": "\u30DE\u30E6\u30EB\u30C9",
    "nameEn": "Cascoon",
    "type": "bug",
    "baseStats": {
      "hp": 50,
      "atk": 35,
      "def": 55,
      "spa": 25,
      "spd": 25,
      "spe": 15
    },
    "abilities": [
      "shedskin"
    ]
  },
  {
    "id": "dustox",
    "name": "\u30C9\u30AF\u30B1\u30A4\u30EB",
    "nameEn": "Dustox",
    "type": "bug",
    "type2": "poison",
    "baseStats": {
      "hp": 60,
      "atk": 50,
      "def": 70,
      "spa": 50,
      "spd": 90,
      "spe": 65
    },
    "abilities": [
      "shielddust",
      "compoundeyes"
    ]
  },
  {
    "id": "lotad",
    "name": "\u30CF\u30B9\u30DC\u30FC",
    "nameEn": "Lotad",
    "type": "water",
    "type2": "grass",
    "baseStats": {
      "hp": 40,
      "atk": 30,
      "def": 30,
      "spa": 40,
      "spd": 50,
      "spe": 30
    },
    "abilities": [
      "swiftswim",
      "raindish",
      "owntempo"
    ]
  },
  {
    "id": "lombre",
    "name": "\u30CF\u30B9\u30D6\u30EC\u30ED",
    "nameEn": "Lombre",
    "type": "water",
    "type2": "grass",
    "baseStats": {
      "hp": 60,
      "atk": 50,
      "def": 50,
      "spa": 60,
      "spd": 70,
      "spe": 50
    },
    "abilities": [
      "swiftswim",
      "raindish",
      "owntempo"
    ]
  },
  {
    "id": "ludicolo",
    "name": "\u30EB\u30F3\u30D1\u30C3\u30D1",
    "nameEn": "Ludicolo",
    "type": "water",
    "type2": "grass",
    "baseStats": {
      "hp": 80,
      "atk": 70,
      "def": 70,
      "spa": 90,
      "spd": 100,
      "spe": 70
    },
    "abilities": [
      "swiftswim",
      "raindish",
      "owntempo"
    ]
  },
  {
    "id": "seedot",
    "name": "\u30BF\u30CD\u30DC\u30FC",
    "nameEn": "Seedot",
    "type": "grass",
    "baseStats": {
      "hp": 40,
      "atk": 40,
      "def": 50,
      "spa": 30,
      "spd": 30,
      "spe": 30
    },
    "abilities": [
      "chlorophyll",
      "earlybird",
      "pickpocket"
    ]
  },
  {
    "id": "nuzleaf",
    "name": "\u30B3\u30CE\u30CF\u30CA",
    "nameEn": "Nuzleaf",
    "type": "grass",
    "type2": "dark",
    "baseStats": {
      "hp": 70,
      "atk": 70,
      "def": 40,
      "spa": 60,
      "spd": 40,
      "spe": 60
    },
    "abilities": [
      "chlorophyll",
      "earlybird",
      "pickpocket"
    ]
  },
  {
    "id": "shiftry",
    "name": "\u30C0\u30FC\u30C6\u30F3\u30B0",
    "nameEn": "Shiftry",
    "type": "grass",
    "type2": "dark",
    "baseStats": {
      "hp": 90,
      "atk": 100,
      "def": 60,
      "spa": 90,
      "spd": 60,
      "spe": 80
    },
    "abilities": [
      "chlorophyll",
      "windrider",
      "pickpocket"
    ]
  },
  {
    "id": "taillow",
    "name": "\u30B9\u30D0\u30E1",
    "nameEn": "Taillow",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 40,
      "atk": 55,
      "def": 30,
      "spa": 30,
      "spd": 30,
      "spe": 85
    },
    "abilities": [
      "guts",
      "scrappy"
    ]
  },
  {
    "id": "swellow",
    "name": "\u30AA\u30AA\u30B9\u30D0\u30E1",
    "nameEn": "Swellow",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 60,
      "atk": 85,
      "def": 60,
      "spa": 75,
      "spd": 50,
      "spe": 125
    },
    "abilities": [
      "guts",
      "scrappy"
    ]
  },
  {
    "id": "wingull",
    "name": "\u30AD\u30E3\u30E2\u30E1",
    "nameEn": "Wingull",
    "type": "water",
    "type2": "flying",
    "baseStats": {
      "hp": 40,
      "atk": 30,
      "def": 30,
      "spa": 55,
      "spd": 30,
      "spe": 85
    },
    "abilities": [
      "keeneye",
      "hydration",
      "raindish"
    ]
  },
  {
    "id": "pelipper",
    "name": "\u30DA\u30EA\u30C3\u30D1\u30FC",
    "nameEn": "Pelipper",
    "type": "water",
    "type2": "flying",
    "baseStats": {
      "hp": 60,
      "atk": 50,
      "def": 100,
      "spa": 95,
      "spd": 70,
      "spe": 65
    },
    "abilities": [
      "keeneye",
      "drizzle",
      "raindish"
    ]
  },
  {
    "id": "ralts",
    "name": "\u30E9\u30EB\u30C8\u30B9",
    "nameEn": "Ralts",
    "type": "psychic",
    "type2": "fairy",
    "baseStats": {
      "hp": 28,
      "atk": 25,
      "def": 25,
      "spa": 45,
      "spd": 35,
      "spe": 40
    },
    "abilities": [
      "synchronize",
      "trace",
      "telepathy"
    ]
  },
  {
    "id": "kirlia",
    "name": "\u30AD\u30EB\u30EA\u30A2",
    "nameEn": "Kirlia",
    "type": "psychic",
    "type2": "fairy",
    "baseStats": {
      "hp": 38,
      "atk": 35,
      "def": 35,
      "spa": 65,
      "spd": 55,
      "spe": 50
    },
    "abilities": [
      "synchronize",
      "trace",
      "telepathy"
    ]
  },
  {
    "id": "gardevoir",
    "name": "\u30B5\u30FC\u30CA\u30A4\u30C8",
    "nameEn": "Gardevoir",
    "type": "psychic",
    "type2": "fairy",
    "baseStats": {
      "hp": 68,
      "atk": 65,
      "def": 65,
      "spa": 125,
      "spd": 115,
      "spe": 80
    },
    "abilities": [
      "synchronize",
      "trace",
      "telepathy"
    ]
  },
  {
    "id": "surskit",
    "name": "\u30A2\u30E1\u30BF\u30DE",
    "nameEn": "Surskit",
    "type": "bug",
    "type2": "water",
    "baseStats": {
      "hp": 40,
      "atk": 30,
      "def": 32,
      "spa": 50,
      "spd": 52,
      "spe": 65
    },
    "abilities": [
      "swiftswim",
      "raindish"
    ]
  },
  {
    "id": "masquerain",
    "name": "\u30A2\u30E1\u30E2\u30FC\u30B9",
    "nameEn": "Masquerain",
    "type": "bug",
    "type2": "flying",
    "baseStats": {
      "hp": 70,
      "atk": 60,
      "def": 62,
      "spa": 100,
      "spd": 82,
      "spe": 80
    },
    "abilities": [
      "intimidate",
      "unnerve"
    ]
  },
  {
    "id": "shroomish",
    "name": "\u30AD\u30CE\u30B3\u30B3",
    "nameEn": "Shroomish",
    "type": "grass",
    "baseStats": {
      "hp": 60,
      "atk": 40,
      "def": 60,
      "spa": 40,
      "spd": 60,
      "spe": 35
    },
    "abilities": [
      "effectspore",
      "poisonheal",
      "quickfeet"
    ]
  },
  {
    "id": "breloom",
    "name": "\u30AD\u30CE\u30AC\u30C3\u30B5",
    "nameEn": "Breloom",
    "type": "grass",
    "type2": "fighting",
    "baseStats": {
      "hp": 60,
      "atk": 130,
      "def": 80,
      "spa": 60,
      "spd": 60,
      "spe": 70
    },
    "abilities": [
      "effectspore",
      "poisonheal",
      "technician"
    ]
  },
  {
    "id": "slakoth",
    "name": "\u30CA\u30DE\u30B1\u30ED",
    "nameEn": "Slakoth",
    "type": "normal",
    "baseStats": {
      "hp": 60,
      "atk": 60,
      "def": 60,
      "spa": 35,
      "spd": 35,
      "spe": 30
    },
    "abilities": [
      "truant"
    ]
  },
  {
    "id": "vigoroth",
    "name": "\u30E4\u30EB\u30AD\u30E2\u30CE",
    "nameEn": "Vigoroth",
    "type": "normal",
    "baseStats": {
      "hp": 80,
      "atk": 80,
      "def": 80,
      "spa": 55,
      "spd": 55,
      "spe": 90
    },
    "abilities": [
      "vitalspirit"
    ]
  },
  {
    "id": "slaking",
    "name": "\u30B1\u30C3\u30AD\u30F3\u30B0",
    "nameEn": "Slaking",
    "type": "normal",
    "baseStats": {
      "hp": 150,
      "atk": 160,
      "def": 100,
      "spa": 95,
      "spd": 65,
      "spe": 100
    },
    "abilities": [
      "truant"
    ]
  },
  {
    "id": "nincada",
    "name": "\u30C4\u30C1\u30CB\u30F3",
    "nameEn": "Nincada",
    "type": "bug",
    "type2": "ground",
    "baseStats": {
      "hp": 31,
      "atk": 45,
      "def": 90,
      "spa": 30,
      "spd": 30,
      "spe": 40
    },
    "abilities": [
      "compoundeyes",
      "runaway"
    ]
  },
  {
    "id": "ninjask",
    "name": "\u30C6\u30C3\u30AB\u30CB\u30F3",
    "nameEn": "Ninjask",
    "type": "bug",
    "type2": "flying",
    "baseStats": {
      "hp": 61,
      "atk": 90,
      "def": 45,
      "spa": 50,
      "spd": 50,
      "spe": 160
    },
    "abilities": [
      "speedboost",
      "infiltrator"
    ]
  },
  {
    "id": "shedinja",
    "name": "\u30CC\u30B1\u30CB\u30F3",
    "nameEn": "Shedinja",
    "type": "bug",
    "type2": "ghost",
    "baseStats": {
      "hp": 1,
      "atk": 90,
      "def": 45,
      "spa": 30,
      "spd": 30,
      "spe": 40
    },
    "abilities": [
      "wonderguard"
    ]
  },
  {
    "id": "whismur",
    "name": "\u30B4\u30CB\u30E7\u30CB\u30E7",
    "nameEn": "Whismur",
    "type": "normal",
    "baseStats": {
      "hp": 64,
      "atk": 51,
      "def": 23,
      "spa": 51,
      "spd": 23,
      "spe": 28
    },
    "abilities": [
      "soundproof",
      "rattled"
    ]
  },
  {
    "id": "loudred",
    "name": "\u30C9\u30B4\u30FC\u30E0",
    "nameEn": "Loudred",
    "type": "normal",
    "baseStats": {
      "hp": 84,
      "atk": 71,
      "def": 43,
      "spa": 71,
      "spd": 43,
      "spe": 48
    },
    "abilities": [
      "soundproof",
      "scrappy"
    ]
  },
  {
    "id": "exploud",
    "name": "\u30D0\u30AF\u30AA\u30F3\u30B0",
    "nameEn": "Exploud",
    "type": "normal",
    "baseStats": {
      "hp": 104,
      "atk": 91,
      "def": 63,
      "spa": 91,
      "spd": 73,
      "spe": 68
    },
    "abilities": [
      "soundproof",
      "scrappy"
    ]
  },
  {
    "id": "makuhita",
    "name": "\u30DE\u30AF\u30CE\u30B7\u30BF",
    "nameEn": "Makuhita",
    "type": "fighting",
    "baseStats": {
      "hp": 72,
      "atk": 60,
      "def": 30,
      "spa": 20,
      "spd": 30,
      "spe": 25
    },
    "abilities": [
      "thickfat",
      "guts",
      "sheerforce"
    ]
  },
  {
    "id": "hariyama",
    "name": "\u30CF\u30EA\u30C6\u30E4\u30DE",
    "nameEn": "Hariyama",
    "type": "fighting",
    "baseStats": {
      "hp": 144,
      "atk": 120,
      "def": 60,
      "spa": 40,
      "spd": 60,
      "spe": 50
    },
    "abilities": [
      "thickfat",
      "guts",
      "sheerforce"
    ]
  },
  {
    "id": "azurill",
    "name": "\u30EB\u30EA\u30EA",
    "nameEn": "Azurill",
    "type": "normal",
    "type2": "fairy",
    "baseStats": {
      "hp": 50,
      "atk": 20,
      "def": 40,
      "spa": 20,
      "spd": 40,
      "spe": 20
    },
    "abilities": [
      "thickfat",
      "hugepower",
      "sapsipper"
    ]
  },
  {
    "id": "nosepass",
    "name": "\u30CE\u30BA\u30D1\u30B9",
    "nameEn": "Nosepass",
    "type": "rock",
    "baseStats": {
      "hp": 30,
      "atk": 45,
      "def": 135,
      "spa": 45,
      "spd": 90,
      "spe": 30
    },
    "abilities": [
      "sturdy",
      "magnetpull",
      "sandforce"
    ]
  },
  {
    "id": "skitty",
    "name": "\u30A8\u30CD\u30B3",
    "nameEn": "Skitty",
    "type": "normal",
    "baseStats": {
      "hp": 50,
      "atk": 45,
      "def": 45,
      "spa": 35,
      "spd": 35,
      "spe": 50
    },
    "abilities": [
      "cutecharm",
      "normalize",
      "wonderskin"
    ]
  },
  {
    "id": "delcatty",
    "name": "\u30A8\u30CD\u30B3\u30ED\u30ED",
    "nameEn": "Delcatty",
    "type": "normal",
    "baseStats": {
      "hp": 70,
      "atk": 65,
      "def": 65,
      "spa": 55,
      "spd": 55,
      "spe": 90
    },
    "abilities": [
      "cutecharm",
      "normalize",
      "wonderskin"
    ]
  },
  {
    "id": "sableye",
    "name": "\u30E4\u30DF\u30E9\u30DF",
    "nameEn": "Sableye",
    "type": "dark",
    "type2": "ghost",
    "baseStats": {
      "hp": 50,
      "atk": 75,
      "def": 75,
      "spa": 65,
      "spd": 65,
      "spe": 50
    },
    "abilities": [
      "keeneye",
      "stall",
      "prankster"
    ]
  },
  {
    "id": "mawile",
    "name": "\u30AF\u30C1\u30FC\u30C8",
    "nameEn": "Mawile",
    "type": "steel",
    "type2": "fairy",
    "baseStats": {
      "hp": 50,
      "atk": 85,
      "def": 85,
      "spa": 55,
      "spd": 55,
      "spe": 50
    },
    "abilities": [
      "hypercutter",
      "intimidate",
      "sheerforce"
    ]
  },
  {
    "id": "aron",
    "name": "\u30B3\u30B3\u30C9\u30E9",
    "nameEn": "Aron",
    "type": "steel",
    "type2": "rock",
    "baseStats": {
      "hp": 50,
      "atk": 70,
      "def": 100,
      "spa": 40,
      "spd": 40,
      "spe": 30
    },
    "abilities": [
      "sturdy",
      "rockhead",
      "heavymetal"
    ]
  },
  {
    "id": "lairon",
    "name": "\u30B3\u30C9\u30E9",
    "nameEn": "Lairon",
    "type": "steel",
    "type2": "rock",
    "baseStats": {
      "hp": 60,
      "atk": 90,
      "def": 140,
      "spa": 50,
      "spd": 50,
      "spe": 40
    },
    "abilities": [
      "sturdy",
      "rockhead",
      "heavymetal"
    ]
  },
  {
    "id": "aggron",
    "name": "\u30DC\u30B9\u30B4\u30C9\u30E9",
    "nameEn": "Aggron",
    "type": "steel",
    "type2": "rock",
    "baseStats": {
      "hp": 70,
      "atk": 110,
      "def": 180,
      "spa": 60,
      "spd": 60,
      "spe": 50
    },
    "abilities": [
      "sturdy",
      "rockhead",
      "heavymetal"
    ]
  },
  {
    "id": "meditite",
    "name": "\u30A2\u30B5\u30CA\u30F3",
    "nameEn": "Meditite",
    "type": "fighting",
    "type2": "psychic",
    "baseStats": {
      "hp": 30,
      "atk": 40,
      "def": 55,
      "spa": 40,
      "spd": 55,
      "spe": 60
    },
    "abilities": [
      "purepower",
      "telepathy"
    ]
  },
  {
    "id": "medicham",
    "name": "\u30C1\u30E3\u30FC\u30EC\u30E0",
    "nameEn": "Medicham",
    "type": "fighting",
    "type2": "psychic",
    "baseStats": {
      "hp": 60,
      "atk": 60,
      "def": 75,
      "spa": 60,
      "spd": 75,
      "spe": 80
    },
    "abilities": [
      "purepower",
      "telepathy"
    ]
  },
  {
    "id": "electrike",
    "name": "\u30E9\u30AF\u30E9\u30A4",
    "nameEn": "Electrike",
    "type": "electric",
    "baseStats": {
      "hp": 40,
      "atk": 45,
      "def": 40,
      "spa": 65,
      "spd": 40,
      "spe": 65
    },
    "abilities": [
      "static",
      "lightningrod",
      "minus"
    ]
  },
  {
    "id": "manectric",
    "name": "\u30E9\u30A4\u30DC\u30EB\u30C8",
    "nameEn": "Manectric",
    "type": "electric",
    "baseStats": {
      "hp": 70,
      "atk": 75,
      "def": 60,
      "spa": 105,
      "spd": 60,
      "spe": 105
    },
    "abilities": [
      "static",
      "lightningrod",
      "minus"
    ]
  },
  {
    "id": "plusle",
    "name": "\u30D7\u30E9\u30B9\u30EB",
    "nameEn": "Plusle",
    "type": "electric",
    "baseStats": {
      "hp": 60,
      "atk": 50,
      "def": 40,
      "spa": 85,
      "spd": 75,
      "spe": 95
    },
    "abilities": [
      "plus",
      "lightningrod"
    ]
  },
  {
    "id": "minun",
    "name": "\u30DE\u30A4\u30CA\u30F3",
    "nameEn": "Minun",
    "type": "electric",
    "baseStats": {
      "hp": 60,
      "atk": 40,
      "def": 50,
      "spa": 75,
      "spd": 85,
      "spe": 95
    },
    "abilities": [
      "minus",
      "voltabsorb"
    ]
  },
  {
    "id": "volbeat",
    "name": "\u30D0\u30EB\u30D3\u30FC\u30C8",
    "nameEn": "Volbeat",
    "type": "bug",
    "baseStats": {
      "hp": 65,
      "atk": 73,
      "def": 75,
      "spa": 47,
      "spd": 85,
      "spe": 85
    },
    "abilities": [
      "illuminate",
      "swarm",
      "prankster"
    ]
  },
  {
    "id": "illumise",
    "name": "\u30A4\u30EB\u30DF\u30FC\u30BC",
    "nameEn": "Illumise",
    "type": "bug",
    "baseStats": {
      "hp": 65,
      "atk": 47,
      "def": 75,
      "spa": 73,
      "spd": 85,
      "spe": 85
    },
    "abilities": [
      "oblivious",
      "tintedlens",
      "prankster"
    ]
  },
  {
    "id": "roselia",
    "name": "\u30ED\u30BC\u30EA\u30A2",
    "nameEn": "Roselia",
    "type": "grass",
    "type2": "poison",
    "baseStats": {
      "hp": 50,
      "atk": 60,
      "def": 45,
      "spa": 100,
      "spd": 80,
      "spe": 65
    },
    "abilities": [
      "naturalcure",
      "poisonpoint",
      "leafguard"
    ]
  },
  {
    "id": "gulpin",
    "name": "\u30B4\u30AF\u30EA\u30F3",
    "nameEn": "Gulpin",
    "type": "poison",
    "baseStats": {
      "hp": 70,
      "atk": 43,
      "def": 53,
      "spa": 43,
      "spd": 53,
      "spe": 40
    },
    "abilities": [
      "liquidooze",
      "stickyhold",
      "gluttony"
    ]
  },
  {
    "id": "swalot",
    "name": "\u30DE\u30EB\u30CE\u30FC\u30E0",
    "nameEn": "Swalot",
    "type": "poison",
    "baseStats": {
      "hp": 100,
      "atk": 73,
      "def": 83,
      "spa": 73,
      "spd": 83,
      "spe": 55
    },
    "abilities": [
      "liquidooze",
      "stickyhold",
      "gluttony"
    ]
  },
  {
    "id": "carvanha",
    "name": "\u30AD\u30D0\u30CB\u30A2",
    "nameEn": "Carvanha",
    "type": "water",
    "type2": "dark",
    "baseStats": {
      "hp": 45,
      "atk": 90,
      "def": 20,
      "spa": 65,
      "spd": 20,
      "spe": 65
    },
    "abilities": [
      "roughskin",
      "speedboost"
    ]
  },
  {
    "id": "sharpedo",
    "name": "\u30B5\u30E1\u30CF\u30C0\u30FC",
    "nameEn": "Sharpedo",
    "type": "water",
    "type2": "dark",
    "baseStats": {
      "hp": 70,
      "atk": 120,
      "def": 40,
      "spa": 95,
      "spd": 40,
      "spe": 95
    },
    "abilities": [
      "roughskin",
      "speedboost"
    ]
  },
  {
    "id": "wailmer",
    "name": "\u30DB\u30A8\u30EB\u30B3",
    "nameEn": "Wailmer",
    "type": "water",
    "baseStats": {
      "hp": 130,
      "atk": 70,
      "def": 35,
      "spa": 70,
      "spd": 35,
      "spe": 60
    },
    "abilities": [
      "waterveil",
      "oblivious",
      "pressure"
    ]
  },
  {
    "id": "wailord",
    "name": "\u30DB\u30A8\u30EB\u30AA\u30FC",
    "nameEn": "Wailord",
    "type": "water",
    "baseStats": {
      "hp": 170,
      "atk": 90,
      "def": 45,
      "spa": 90,
      "spd": 45,
      "spe": 60
    },
    "abilities": [
      "waterveil",
      "oblivious",
      "pressure"
    ]
  },
  {
    "id": "numel",
    "name": "\u30C9\u30F3\u30E1\u30EB",
    "nameEn": "Numel",
    "type": "fire",
    "type2": "ground",
    "baseStats": {
      "hp": 60,
      "atk": 60,
      "def": 40,
      "spa": 65,
      "spd": 45,
      "spe": 35
    },
    "abilities": [
      "oblivious",
      "simple",
      "owntempo"
    ]
  },
  {
    "id": "camerupt",
    "name": "\u30D0\u30AF\u30FC\u30C0",
    "nameEn": "Camerupt",
    "type": "fire",
    "type2": "ground",
    "baseStats": {
      "hp": 70,
      "atk": 100,
      "def": 70,
      "spa": 105,
      "spd": 75,
      "spe": 40
    },
    "abilities": [
      "magmaarmor",
      "solidrock",
      "angerpoint"
    ]
  },
  {
    "id": "torkoal",
    "name": "\u30B3\u30FC\u30BF\u30B9",
    "nameEn": "Torkoal",
    "type": "fire",
    "baseStats": {
      "hp": 70,
      "atk": 85,
      "def": 140,
      "spa": 85,
      "spd": 70,
      "spe": 20
    },
    "abilities": [
      "whitesmoke",
      "drought",
      "shellarmor"
    ]
  },
  {
    "id": "spoink",
    "name": "\u30D0\u30CD\u30D6\u30FC",
    "nameEn": "Spoink",
    "type": "psychic",
    "baseStats": {
      "hp": 60,
      "atk": 25,
      "def": 35,
      "spa": 70,
      "spd": 80,
      "spe": 60
    },
    "abilities": [
      "thickfat",
      "owntempo",
      "gluttony"
    ]
  },
  {
    "id": "grumpig",
    "name": "\u30D6\u30FC\u30D4\u30C3\u30B0",
    "nameEn": "Grumpig",
    "type": "psychic",
    "baseStats": {
      "hp": 80,
      "atk": 45,
      "def": 65,
      "spa": 90,
      "spd": 110,
      "spe": 80
    },
    "abilities": [
      "thickfat",
      "owntempo",
      "gluttony"
    ]
  },
  {
    "id": "spinda",
    "name": "\u30D1\u30C3\u30C1\u30FC\u30EB",
    "nameEn": "Spinda",
    "type": "normal",
    "baseStats": {
      "hp": 60,
      "atk": 60,
      "def": 60,
      "spa": 60,
      "spd": 60,
      "spe": 60
    },
    "abilities": [
      "owntempo",
      "tangledfeet",
      "contrary"
    ]
  },
  {
    "id": "trapinch",
    "name": "\u30CA\u30C3\u30AF\u30E9\u30FC",
    "nameEn": "Trapinch",
    "type": "ground",
    "baseStats": {
      "hp": 45,
      "atk": 100,
      "def": 45,
      "spa": 45,
      "spd": 45,
      "spe": 10
    },
    "abilities": [
      "hypercutter",
      "arenatrap",
      "sheerforce"
    ]
  },
  {
    "id": "vibrava",
    "name": "\u30D3\u30D6\u30E9\u30FC\u30D0",
    "nameEn": "Vibrava",
    "type": "ground",
    "type2": "dragon",
    "baseStats": {
      "hp": 50,
      "atk": 70,
      "def": 50,
      "spa": 50,
      "spd": 50,
      "spe": 70
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "flygon",
    "name": "\u30D5\u30E9\u30A4\u30B4\u30F3",
    "nameEn": "Flygon",
    "type": "ground",
    "type2": "dragon",
    "baseStats": {
      "hp": 80,
      "atk": 100,
      "def": 80,
      "spa": 80,
      "spd": 80,
      "spe": 100
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "cacnea",
    "name": "\u30B5\u30DC\u30CD\u30A2",
    "nameEn": "Cacnea",
    "type": "grass",
    "baseStats": {
      "hp": 50,
      "atk": 85,
      "def": 40,
      "spa": 85,
      "spd": 40,
      "spe": 35
    },
    "abilities": [
      "sandveil",
      "waterabsorb"
    ]
  },
  {
    "id": "cacturne",
    "name": "\u30CE\u30AF\u30BF\u30B9",
    "nameEn": "Cacturne",
    "type": "grass",
    "type2": "dark",
    "baseStats": {
      "hp": 70,
      "atk": 115,
      "def": 60,
      "spa": 115,
      "spd": 60,
      "spe": 55
    },
    "abilities": [
      "sandveil",
      "waterabsorb"
    ]
  },
  {
    "id": "swablu",
    "name": "\u30C1\u30EB\u30C3\u30C8",
    "nameEn": "Swablu",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 45,
      "atk": 40,
      "def": 60,
      "spa": 40,
      "spd": 75,
      "spe": 50
    },
    "abilities": [
      "naturalcure",
      "cloudnine"
    ]
  },
  {
    "id": "altaria",
    "name": "\u30C1\u30EB\u30BF\u30EA\u30B9",
    "nameEn": "Altaria",
    "type": "dragon",
    "type2": "flying",
    "baseStats": {
      "hp": 75,
      "atk": 70,
      "def": 90,
      "spa": 70,
      "spd": 105,
      "spe": 80
    },
    "abilities": [
      "naturalcure",
      "cloudnine"
    ]
  },
  {
    "id": "zangoose",
    "name": "\u30B6\u30F3\u30B0\u30FC\u30B9",
    "nameEn": "Zangoose",
    "type": "normal",
    "baseStats": {
      "hp": 73,
      "atk": 115,
      "def": 60,
      "spa": 60,
      "spd": 60,
      "spe": 90
    },
    "abilities": [
      "immunity",
      "toxicboost"
    ]
  },
  {
    "id": "seviper",
    "name": "\u30CF\u30D6\u30CD\u30FC\u30AF",
    "nameEn": "Seviper",
    "type": "poison",
    "baseStats": {
      "hp": 73,
      "atk": 100,
      "def": 60,
      "spa": 100,
      "spd": 60,
      "spe": 65
    },
    "abilities": [
      "shedskin",
      "infiltrator"
    ]
  },
  {
    "id": "lunatone",
    "name": "\u30EB\u30CA\u30C8\u30FC\u30F3",
    "nameEn": "Lunatone",
    "type": "rock",
    "type2": "psychic",
    "baseStats": {
      "hp": 90,
      "atk": 55,
      "def": 65,
      "spa": 95,
      "spd": 85,
      "spe": 70
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "solrock",
    "name": "\u30BD\u30EB\u30ED\u30C3\u30AF",
    "nameEn": "Solrock",
    "type": "rock",
    "type2": "psychic",
    "baseStats": {
      "hp": 90,
      "atk": 95,
      "def": 85,
      "spa": 55,
      "spd": 65,
      "spe": 70
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "barboach",
    "name": "\u30C9\u30B8\u30E7\u30C3\u30C1",
    "nameEn": "Barboach",
    "type": "water",
    "type2": "ground",
    "baseStats": {
      "hp": 50,
      "atk": 48,
      "def": 43,
      "spa": 46,
      "spd": 41,
      "spe": 60
    },
    "abilities": [
      "oblivious",
      "anticipation",
      "hydration"
    ]
  },
  {
    "id": "whiscash",
    "name": "\u30CA\u30DE\u30BA\u30F3",
    "nameEn": "Whiscash",
    "type": "water",
    "type2": "ground",
    "baseStats": {
      "hp": 110,
      "atk": 78,
      "def": 73,
      "spa": 76,
      "spd": 71,
      "spe": 60
    },
    "abilities": [
      "oblivious",
      "anticipation",
      "hydration"
    ]
  },
  {
    "id": "corphish",
    "name": "\u30D8\u30A4\u30AC\u30CB",
    "nameEn": "Corphish",
    "type": "water",
    "baseStats": {
      "hp": 43,
      "atk": 80,
      "def": 65,
      "spa": 50,
      "spd": 35,
      "spe": 35
    },
    "abilities": [
      "hypercutter",
      "shellarmor",
      "adaptability"
    ]
  },
  {
    "id": "crawdaunt",
    "name": "\u30B7\u30B6\u30EA\u30AC\u30FC",
    "nameEn": "Crawdaunt",
    "type": "water",
    "type2": "dark",
    "baseStats": {
      "hp": 63,
      "atk": 120,
      "def": 85,
      "spa": 90,
      "spd": 55,
      "spe": 55
    },
    "abilities": [
      "hypercutter",
      "shellarmor",
      "adaptability"
    ]
  },
  {
    "id": "baltoy",
    "name": "\u30E4\u30B8\u30ED\u30F3",
    "nameEn": "Baltoy",
    "type": "ground",
    "type2": "psychic",
    "baseStats": {
      "hp": 40,
      "atk": 40,
      "def": 55,
      "spa": 40,
      "spd": 70,
      "spe": 55
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "claydol",
    "name": "\u30CD\u30F3\u30C9\u30FC\u30EB",
    "nameEn": "Claydol",
    "type": "ground",
    "type2": "psychic",
    "baseStats": {
      "hp": 60,
      "atk": 70,
      "def": 105,
      "spa": 70,
      "spd": 120,
      "spe": 75
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "lileep",
    "name": "\u30EA\u30EA\u30FC\u30E9",
    "nameEn": "Lileep",
    "type": "rock",
    "type2": "grass",
    "baseStats": {
      "hp": 66,
      "atk": 41,
      "def": 77,
      "spa": 61,
      "spd": 87,
      "spe": 23
    },
    "abilities": [
      "suctioncups",
      "stormdrain"
    ]
  },
  {
    "id": "cradily",
    "name": "\u30E6\u30EC\u30A4\u30C9\u30EB",
    "nameEn": "Cradily",
    "type": "rock",
    "type2": "grass",
    "baseStats": {
      "hp": 86,
      "atk": 81,
      "def": 97,
      "spa": 81,
      "spd": 107,
      "spe": 43
    },
    "abilities": [
      "suctioncups",
      "stormdrain"
    ]
  },
  {
    "id": "anorith",
    "name": "\u30A2\u30CE\u30D7\u30B9",
    "nameEn": "Anorith",
    "type": "rock",
    "type2": "bug",
    "baseStats": {
      "hp": 45,
      "atk": 95,
      "def": 50,
      "spa": 40,
      "spd": 50,
      "spe": 75
    },
    "abilities": [
      "battlearmor",
      "swiftswim"
    ]
  },
  {
    "id": "armaldo",
    "name": "\u30A2\u30FC\u30DE\u30EB\u30C9",
    "nameEn": "Armaldo",
    "type": "rock",
    "type2": "bug",
    "baseStats": {
      "hp": 75,
      "atk": 125,
      "def": 100,
      "spa": 70,
      "spd": 80,
      "spe": 45
    },
    "abilities": [
      "battlearmor",
      "swiftswim"
    ]
  },
  {
    "id": "feebas",
    "name": "\u30D2\u30F3\u30D0\u30B9",
    "nameEn": "Feebas",
    "type": "water",
    "baseStats": {
      "hp": 20,
      "atk": 15,
      "def": 20,
      "spa": 10,
      "spd": 55,
      "spe": 80
    },
    "abilities": [
      "swiftswim",
      "oblivious",
      "adaptability"
    ]
  },
  {
    "id": "milotic",
    "name": "\u30DF\u30ED\u30AB\u30ED\u30B9",
    "nameEn": "Milotic",
    "type": "water",
    "baseStats": {
      "hp": 95,
      "atk": 60,
      "def": 79,
      "spa": 100,
      "spd": 125,
      "spe": 81
    },
    "abilities": [
      "marvelscale",
      "competitive",
      "cutecharm"
    ]
  },
  {
    "id": "castform",
    "name": "\u30DD\u30EF\u30EB\u30F3",
    "nameEn": "Castform",
    "type": "normal",
    "baseStats": {
      "hp": 70,
      "atk": 70,
      "def": 70,
      "spa": 70,
      "spd": 70,
      "spe": 70
    },
    "abilities": [
      "forecast"
    ]
  },
  {
    "id": "kecleon",
    "name": "\u30AB\u30AF\u30EC\u30AA\u30F3",
    "nameEn": "Kecleon",
    "type": "normal",
    "baseStats": {
      "hp": 60,
      "atk": 90,
      "def": 70,
      "spa": 60,
      "spd": 120,
      "spe": 40
    },
    "abilities": [
      "colorchange",
      "protean"
    ]
  },
  {
    "id": "shuppet",
    "name": "\u30AB\u30B2\u30DC\u30A6\u30BA",
    "nameEn": "Shuppet",
    "type": "ghost",
    "baseStats": {
      "hp": 44,
      "atk": 75,
      "def": 35,
      "spa": 63,
      "spd": 33,
      "spe": 45
    },
    "abilities": [
      "insomnia",
      "frisk",
      "cursedbody"
    ]
  },
  {
    "id": "banette",
    "name": "\u30B8\u30E5\u30DA\u30C3\u30BF",
    "nameEn": "Banette",
    "type": "ghost",
    "baseStats": {
      "hp": 64,
      "atk": 115,
      "def": 65,
      "spa": 83,
      "spd": 63,
      "spe": 65
    },
    "abilities": [
      "insomnia",
      "frisk",
      "cursedbody"
    ]
  },
  {
    "id": "duskull",
    "name": "\u30E8\u30DE\u30EF\u30EB",
    "nameEn": "Duskull",
    "type": "ghost",
    "baseStats": {
      "hp": 20,
      "atk": 40,
      "def": 90,
      "spa": 30,
      "spd": 90,
      "spe": 25
    },
    "abilities": [
      "levitate",
      "frisk"
    ]
  },
  {
    "id": "dusclops",
    "name": "\u30B5\u30DE\u30E8\u30FC\u30EB",
    "nameEn": "Dusclops",
    "type": "ghost",
    "baseStats": {
      "hp": 40,
      "atk": 70,
      "def": 130,
      "spa": 60,
      "spd": 130,
      "spe": 25
    },
    "abilities": [
      "pressure",
      "frisk"
    ]
  },
  {
    "id": "tropius",
    "name": "\u30C8\u30ED\u30D4\u30A6\u30B9",
    "nameEn": "Tropius",
    "type": "grass",
    "type2": "flying",
    "baseStats": {
      "hp": 99,
      "atk": 68,
      "def": 83,
      "spa": 72,
      "spd": 87,
      "spe": 51
    },
    "abilities": [
      "chlorophyll",
      "solarpower",
      "harvest"
    ]
  },
  {
    "id": "chimecho",
    "name": "\u30C1\u30EA\u30FC\u30F3",
    "nameEn": "Chimecho",
    "type": "psychic",
    "baseStats": {
      "hp": 75,
      "atk": 50,
      "def": 80,
      "spa": 95,
      "spd": 90,
      "spe": 65
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "absol",
    "name": "\u30A2\u30D6\u30BD\u30EB",
    "nameEn": "Absol",
    "type": "dark",
    "baseStats": {
      "hp": 65,
      "atk": 130,
      "def": 60,
      "spa": 75,
      "spd": 60,
      "spe": 75
    },
    "abilities": [
      "pressure",
      "superluck",
      "justified"
    ]
  },
  {
    "id": "wynaut",
    "name": "\u30BD\u30FC\u30CA\u30CE",
    "nameEn": "Wynaut",
    "type": "psychic",
    "baseStats": {
      "hp": 95,
      "atk": 23,
      "def": 48,
      "spa": 23,
      "spd": 48,
      "spe": 23
    },
    "abilities": [
      "shadowtag",
      "telepathy"
    ]
  },
  {
    "id": "snorunt",
    "name": "\u30E6\u30AD\u30EF\u30E9\u30B7",
    "nameEn": "Snorunt",
    "type": "ice",
    "baseStats": {
      "hp": 50,
      "atk": 50,
      "def": 50,
      "spa": 50,
      "spd": 50,
      "spe": 50
    },
    "abilities": [
      "innerfocus",
      "icebody",
      "moody"
    ]
  },
  {
    "id": "glalie",
    "name": "\u30AA\u30CB\u30B4\u30FC\u30EA",
    "nameEn": "Glalie",
    "type": "ice",
    "baseStats": {
      "hp": 80,
      "atk": 80,
      "def": 80,
      "spa": 80,
      "spd": 80,
      "spe": 80
    },
    "abilities": [
      "innerfocus",
      "icebody",
      "moody"
    ]
  },
  {
    "id": "spheal",
    "name": "\u30BF\u30DE\u30B6\u30E9\u30B7",
    "nameEn": "Spheal",
    "type": "ice",
    "type2": "water",
    "baseStats": {
      "hp": 70,
      "atk": 40,
      "def": 50,
      "spa": 55,
      "spd": 50,
      "spe": 25
    },
    "abilities": [
      "thickfat",
      "icebody",
      "oblivious"
    ]
  },
  {
    "id": "sealeo",
    "name": "\u30C8\u30C9\u30B0\u30E9\u30FC",
    "nameEn": "Sealeo",
    "type": "ice",
    "type2": "water",
    "baseStats": {
      "hp": 90,
      "atk": 60,
      "def": 70,
      "spa": 75,
      "spd": 70,
      "spe": 45
    },
    "abilities": [
      "thickfat",
      "icebody",
      "oblivious"
    ]
  },
  {
    "id": "walrein",
    "name": "\u30C8\u30C9\u30BC\u30EB\u30AC",
    "nameEn": "Walrein",
    "type": "ice",
    "type2": "water",
    "baseStats": {
      "hp": 110,
      "atk": 80,
      "def": 90,
      "spa": 95,
      "spd": 90,
      "spe": 65
    },
    "abilities": [
      "thickfat",
      "icebody",
      "oblivious"
    ]
  },
  {
    "id": "clamperl",
    "name": "\u30D1\u30FC\u30EB\u30EB",
    "nameEn": "Clamperl",
    "type": "water",
    "baseStats": {
      "hp": 35,
      "atk": 64,
      "def": 85,
      "spa": 74,
      "spd": 55,
      "spe": 32
    },
    "abilities": [
      "shellarmor",
      "rattled"
    ]
  },
  {
    "id": "huntail",
    "name": "\u30CF\u30F3\u30C6\u30FC\u30EB",
    "nameEn": "Huntail",
    "type": "water",
    "baseStats": {
      "hp": 55,
      "atk": 104,
      "def": 105,
      "spa": 94,
      "spd": 75,
      "spe": 52
    },
    "abilities": [
      "swiftswim",
      "waterveil"
    ]
  },
  {
    "id": "gorebyss",
    "name": "\u30B5\u30AF\u30E9\u30D3\u30B9",
    "nameEn": "Gorebyss",
    "type": "water",
    "baseStats": {
      "hp": 55,
      "atk": 84,
      "def": 105,
      "spa": 114,
      "spd": 75,
      "spe": 52
    },
    "abilities": [
      "swiftswim",
      "hydration"
    ]
  },
  {
    "id": "relicanth",
    "name": "\u30B8\u30FC\u30E9\u30F3\u30B9",
    "nameEn": "Relicanth",
    "type": "water",
    "type2": "rock",
    "baseStats": {
      "hp": 100,
      "atk": 90,
      "def": 130,
      "spa": 45,
      "spd": 65,
      "spe": 55
    },
    "abilities": [
      "swiftswim",
      "rockhead",
      "sturdy"
    ]
  },
  {
    "id": "luvdisc",
    "name": "\u30E9\u30D6\u30AB\u30B9",
    "nameEn": "Luvdisc",
    "type": "water",
    "baseStats": {
      "hp": 43,
      "atk": 30,
      "def": 55,
      "spa": 40,
      "spd": 65,
      "spe": 97
    },
    "abilities": [
      "swiftswim",
      "hydration"
    ]
  },
  {
    "id": "bagon",
    "name": "\u30BF\u30C4\u30D9\u30A4",
    "nameEn": "Bagon",
    "type": "dragon",
    "baseStats": {
      "hp": 45,
      "atk": 75,
      "def": 60,
      "spa": 40,
      "spd": 30,
      "spe": 50
    },
    "abilities": [
      "rockhead",
      "sheerforce"
    ]
  },
  {
    "id": "shelgon",
    "name": "\u30B3\u30E2\u30EB\u30FC",
    "nameEn": "Shelgon",
    "type": "dragon",
    "baseStats": {
      "hp": 65,
      "atk": 95,
      "def": 100,
      "spa": 60,
      "spd": 50,
      "spe": 50
    },
    "abilities": [
      "rockhead",
      "overcoat"
    ]
  },
  {
    "id": "salamence",
    "name": "\u30DC\u30FC\u30DE\u30F3\u30C0",
    "nameEn": "Salamence",
    "type": "dragon",
    "type2": "flying",
    "baseStats": {
      "hp": 95,
      "atk": 135,
      "def": 80,
      "spa": 110,
      "spd": 80,
      "spe": 100
    },
    "abilities": [
      "intimidate",
      "moxie"
    ]
  },
  {
    "id": "beldum",
    "name": "\u30C0\u30F3\u30D0\u30EB",
    "nameEn": "Beldum",
    "type": "steel",
    "type2": "psychic",
    "baseStats": {
      "hp": 40,
      "atk": 55,
      "def": 80,
      "spa": 35,
      "spd": 60,
      "spe": 30
    },
    "abilities": [
      "clearbody",
      "lightmetal"
    ]
  },
  {
    "id": "metang",
    "name": "\u30E1\u30BF\u30F3\u30B0",
    "nameEn": "Metang",
    "type": "steel",
    "type2": "psychic",
    "baseStats": {
      "hp": 60,
      "atk": 75,
      "def": 100,
      "spa": 55,
      "spd": 80,
      "spe": 50
    },
    "abilities": [
      "clearbody",
      "lightmetal"
    ]
  },
  {
    "id": "metagross",
    "name": "\u30E1\u30BF\u30B0\u30ED\u30B9",
    "nameEn": "Metagross",
    "type": "steel",
    "type2": "psychic",
    "baseStats": {
      "hp": 80,
      "atk": 135,
      "def": 130,
      "spa": 95,
      "spd": 90,
      "spe": 70
    },
    "abilities": [
      "clearbody",
      "lightmetal"
    ]
  },
  {
    "id": "regirock",
    "name": "\u30EC\u30B8\u30ED\u30C3\u30AF",
    "nameEn": "Regirock",
    "type": "rock",
    "baseStats": {
      "hp": 80,
      "atk": 100,
      "def": 200,
      "spa": 50,
      "spd": 100,
      "spe": 50
    },
    "abilities": [
      "clearbody",
      "sturdy"
    ]
  },
  {
    "id": "regice",
    "name": "\u30EC\u30B8\u30A2\u30A4\u30B9",
    "nameEn": "Regice",
    "type": "ice",
    "baseStats": {
      "hp": 80,
      "atk": 50,
      "def": 100,
      "spa": 100,
      "spd": 200,
      "spe": 50
    },
    "abilities": [
      "clearbody",
      "icebody"
    ]
  },
  {
    "id": "registeel",
    "name": "\u30EC\u30B8\u30B9\u30C1\u30EB",
    "nameEn": "Registeel",
    "type": "steel",
    "baseStats": {
      "hp": 80,
      "atk": 75,
      "def": 150,
      "spa": 75,
      "spd": 150,
      "spe": 50
    },
    "abilities": [
      "clearbody",
      "lightmetal"
    ]
  },
  {
    "id": "latias",
    "name": "\u30E9\u30C6\u30A3\u30A2\u30B9",
    "nameEn": "Latias",
    "type": "dragon",
    "type2": "psychic",
    "baseStats": {
      "hp": 80,
      "atk": 80,
      "def": 90,
      "spa": 110,
      "spd": 130,
      "spe": 110
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "latios",
    "name": "\u30E9\u30C6\u30A3\u30AA\u30B9",
    "nameEn": "Latios",
    "type": "dragon",
    "type2": "psychic",
    "baseStats": {
      "hp": 80,
      "atk": 90,
      "def": 80,
      "spa": 130,
      "spd": 110,
      "spe": 110
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "kyogre",
    "name": "\u30AB\u30A4\u30AA\u30FC\u30AC",
    "nameEn": "Kyogre",
    "type": "water",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 90,
      "spa": 150,
      "spd": 140,
      "spe": 90
    },
    "abilities": [
      "drizzle"
    ]
  },
  {
    "id": "groudon",
    "name": "\u30B0\u30E9\u30FC\u30C9\u30F3",
    "nameEn": "Groudon",
    "type": "ground",
    "baseStats": {
      "hp": 100,
      "atk": 150,
      "def": 140,
      "spa": 100,
      "spd": 90,
      "spe": 90
    },
    "abilities": [
      "drought"
    ]
  },
  {
    "id": "rayquaza",
    "name": "\u30EC\u30C3\u30AF\u30A6\u30B6",
    "nameEn": "Rayquaza",
    "type": "dragon",
    "type2": "flying",
    "baseStats": {
      "hp": 105,
      "atk": 150,
      "def": 90,
      "spa": 150,
      "spd": 90,
      "spe": 95
    },
    "abilities": [
      "airlock"
    ]
  },
  {
    "id": "jirachi",
    "name": "\u30B8\u30E9\u30FC\u30C1",
    "nameEn": "Jirachi",
    "type": "steel",
    "type2": "psychic",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 100,
      "spa": 100,
      "spd": 100,
      "spe": 100
    },
    "abilities": [
      "serenegrace"
    ]
  },
  {
    "id": "deoxys",
    "name": "\u30C7\u30AA\u30AD\u30B7\u30B9",
    "nameEn": "Deoxys",
    "type": "psychic",
    "baseStats": {
      "hp": 50,
      "atk": 150,
      "def": 50,
      "spa": 150,
      "spd": 50,
      "spe": 150
    },
    "abilities": [
      "pressure"
    ]
  },
  {
    "id": "turtwig",
    "name": "\u30CA\u30A8\u30C8\u30EB",
    "nameEn": "Turtwig",
    "type": "grass",
    "baseStats": {
      "hp": 55,
      "atk": 68,
      "def": 64,
      "spa": 45,
      "spd": 55,
      "spe": 31
    },
    "abilities": [
      "overgrow",
      "shellarmor"
    ]
  },
  {
    "id": "grotle",
    "name": "\u30CF\u30E4\u30B7\u30AC\u30E1",
    "nameEn": "Grotle",
    "type": "grass",
    "baseStats": {
      "hp": 75,
      "atk": 89,
      "def": 85,
      "spa": 55,
      "spd": 65,
      "spe": 36
    },
    "abilities": [
      "overgrow",
      "shellarmor"
    ]
  },
  {
    "id": "torterra",
    "name": "\u30C9\u30C0\u30A4\u30C8\u30B9",
    "nameEn": "Torterra",
    "type": "grass",
    "type2": "ground",
    "baseStats": {
      "hp": 95,
      "atk": 109,
      "def": 105,
      "spa": 75,
      "spd": 85,
      "spe": 56
    },
    "abilities": [
      "overgrow",
      "shellarmor"
    ]
  },
  {
    "id": "chimchar",
    "name": "\u30D2\u30B3\u30B6\u30EB",
    "nameEn": "Chimchar",
    "type": "fire",
    "baseStats": {
      "hp": 44,
      "atk": 58,
      "def": 44,
      "spa": 58,
      "spd": 44,
      "spe": 61
    },
    "abilities": [
      "blaze",
      "ironfist"
    ]
  },
  {
    "id": "monferno",
    "name": "\u30E2\u30A6\u30AB\u30B6\u30EB",
    "nameEn": "Monferno",
    "type": "fire",
    "type2": "fighting",
    "baseStats": {
      "hp": 64,
      "atk": 78,
      "def": 52,
      "spa": 78,
      "spd": 52,
      "spe": 81
    },
    "abilities": [
      "blaze",
      "ironfist"
    ]
  },
  {
    "id": "infernape",
    "name": "\u30B4\u30A6\u30AB\u30B6\u30EB",
    "nameEn": "Infernape",
    "type": "fire",
    "type2": "fighting",
    "baseStats": {
      "hp": 76,
      "atk": 104,
      "def": 71,
      "spa": 104,
      "spd": 71,
      "spe": 108
    },
    "abilities": [
      "blaze",
      "ironfist"
    ]
  },
  {
    "id": "piplup",
    "name": "\u30DD\u30C3\u30C1\u30E3\u30DE",
    "nameEn": "Piplup",
    "type": "water",
    "baseStats": {
      "hp": 53,
      "atk": 51,
      "def": 53,
      "spa": 61,
      "spd": 56,
      "spe": 40
    },
    "abilities": [
      "torrent",
      "competitive"
    ]
  },
  {
    "id": "prinplup",
    "name": "\u30DD\u30C3\u30BF\u30A4\u30B7",
    "nameEn": "Prinplup",
    "type": "water",
    "baseStats": {
      "hp": 64,
      "atk": 66,
      "def": 68,
      "spa": 81,
      "spd": 76,
      "spe": 50
    },
    "abilities": [
      "torrent",
      "competitive"
    ]
  },
  {
    "id": "empoleon",
    "name": "\u30A8\u30F3\u30DA\u30EB\u30C8",
    "nameEn": "Empoleon",
    "type": "water",
    "type2": "steel",
    "baseStats": {
      "hp": 84,
      "atk": 86,
      "def": 88,
      "spa": 111,
      "spd": 101,
      "spe": 60
    },
    "abilities": [
      "torrent",
      "competitive"
    ]
  },
  {
    "id": "starly",
    "name": "\u30E0\u30C3\u30AF\u30EB",
    "nameEn": "Starly",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 40,
      "atk": 55,
      "def": 30,
      "spa": 30,
      "spd": 30,
      "spe": 60
    },
    "abilities": [
      "keeneye",
      "reckless"
    ]
  },
  {
    "id": "staravia",
    "name": "\u30E0\u30AF\u30D0\u30FC\u30C9",
    "nameEn": "Staravia",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 55,
      "atk": 75,
      "def": 50,
      "spa": 40,
      "spd": 40,
      "spe": 80
    },
    "abilities": [
      "intimidate",
      "reckless"
    ]
  },
  {
    "id": "staraptor",
    "name": "\u30E0\u30AF\u30DB\u30FC\u30AF",
    "nameEn": "Staraptor",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 85,
      "atk": 120,
      "def": 70,
      "spa": 50,
      "spd": 60,
      "spe": 100
    },
    "abilities": [
      "intimidate",
      "reckless"
    ]
  },
  {
    "id": "bidoof",
    "name": "\u30D3\u30C3\u30D1",
    "nameEn": "Bidoof",
    "type": "normal",
    "baseStats": {
      "hp": 59,
      "atk": 45,
      "def": 40,
      "spa": 35,
      "spd": 40,
      "spe": 31
    },
    "abilities": [
      "simple",
      "unaware",
      "moody"
    ]
  },
  {
    "id": "bibarel",
    "name": "\u30D3\u30FC\u30C0\u30EB",
    "nameEn": "Bibarel",
    "type": "normal",
    "type2": "water",
    "baseStats": {
      "hp": 79,
      "atk": 85,
      "def": 60,
      "spa": 55,
      "spd": 60,
      "spe": 71
    },
    "abilities": [
      "simple",
      "unaware",
      "moody"
    ]
  },
  {
    "id": "kricketot",
    "name": "\u30B3\u30ED\u30DC\u30FC\u30B7",
    "nameEn": "Kricketot",
    "type": "bug",
    "baseStats": {
      "hp": 37,
      "atk": 25,
      "def": 41,
      "spa": 25,
      "spd": 41,
      "spe": 25
    },
    "abilities": [
      "shedskin",
      "runaway"
    ]
  },
  {
    "id": "kricketune",
    "name": "\u30B3\u30ED\u30C8\u30C3\u30AF",
    "nameEn": "Kricketune",
    "type": "bug",
    "baseStats": {
      "hp": 77,
      "atk": 85,
      "def": 51,
      "spa": 55,
      "spd": 51,
      "spe": 65
    },
    "abilities": [
      "swarm",
      "technician"
    ]
  },
  {
    "id": "shinx",
    "name": "\u30B3\u30EA\u30F3\u30AF",
    "nameEn": "Shinx",
    "type": "electric",
    "baseStats": {
      "hp": 45,
      "atk": 65,
      "def": 34,
      "spa": 40,
      "spd": 34,
      "spe": 45
    },
    "abilities": [
      "rivalry",
      "intimidate",
      "guts"
    ]
  },
  {
    "id": "luxio",
    "name": "\u30EB\u30AF\u30B7\u30AA",
    "nameEn": "Luxio",
    "type": "electric",
    "baseStats": {
      "hp": 60,
      "atk": 85,
      "def": 49,
      "spa": 60,
      "spd": 49,
      "spe": 60
    },
    "abilities": [
      "rivalry",
      "intimidate",
      "guts"
    ]
  },
  {
    "id": "luxray",
    "name": "\u30EC\u30F3\u30C8\u30E9\u30FC",
    "nameEn": "Luxray",
    "type": "electric",
    "baseStats": {
      "hp": 80,
      "atk": 120,
      "def": 79,
      "spa": 95,
      "spd": 79,
      "spe": 70
    },
    "abilities": [
      "rivalry",
      "intimidate",
      "guts"
    ]
  },
  {
    "id": "budew",
    "name": "\u30B9\u30DC\u30DF\u30FC",
    "nameEn": "Budew",
    "type": "grass",
    "type2": "poison",
    "baseStats": {
      "hp": 40,
      "atk": 30,
      "def": 35,
      "spa": 50,
      "spd": 70,
      "spe": 55
    },
    "abilities": [
      "naturalcure",
      "poisonpoint",
      "leafguard"
    ]
  },
  {
    "id": "roserade",
    "name": "\u30ED\u30BA\u30EC\u30A4\u30C9",
    "nameEn": "Roserade",
    "type": "grass",
    "type2": "poison",
    "baseStats": {
      "hp": 60,
      "atk": 70,
      "def": 65,
      "spa": 125,
      "spd": 105,
      "spe": 90
    },
    "abilities": [
      "naturalcure",
      "poisonpoint",
      "technician"
    ]
  },
  {
    "id": "cranidos",
    "name": "\u30BA\u30AC\u30A4\u30C9\u30B9",
    "nameEn": "Cranidos",
    "type": "rock",
    "baseStats": {
      "hp": 67,
      "atk": 125,
      "def": 40,
      "spa": 30,
      "spd": 30,
      "spe": 58
    },
    "abilities": [
      "moldbreaker",
      "sheerforce"
    ]
  },
  {
    "id": "rampardos",
    "name": "\u30E9\u30E0\u30D1\u30EB\u30C9",
    "nameEn": "Rampardos",
    "type": "rock",
    "baseStats": {
      "hp": 97,
      "atk": 165,
      "def": 60,
      "spa": 65,
      "spd": 50,
      "spe": 58
    },
    "abilities": [
      "moldbreaker",
      "sheerforce"
    ]
  },
  {
    "id": "shieldon",
    "name": "\u30BF\u30C6\u30C8\u30D7\u30B9",
    "nameEn": "Shieldon",
    "type": "rock",
    "type2": "steel",
    "baseStats": {
      "hp": 30,
      "atk": 42,
      "def": 118,
      "spa": 42,
      "spd": 88,
      "spe": 30
    },
    "abilities": [
      "sturdy",
      "soundproof"
    ]
  },
  {
    "id": "bastiodon",
    "name": "\u30C8\u30EA\u30C7\u30D7\u30B9",
    "nameEn": "Bastiodon",
    "type": "rock",
    "type2": "steel",
    "baseStats": {
      "hp": 60,
      "atk": 52,
      "def": 168,
      "spa": 47,
      "spd": 138,
      "spe": 30
    },
    "abilities": [
      "sturdy",
      "soundproof"
    ]
  },
  {
    "id": "burmy",
    "name": "\u30DF\u30CE\u30E0\u30C3\u30C1",
    "nameEn": "Burmy",
    "type": "bug",
    "baseStats": {
      "hp": 40,
      "atk": 29,
      "def": 45,
      "spa": 29,
      "spd": 45,
      "spe": 36
    },
    "abilities": [
      "shedskin",
      "overcoat"
    ]
  },
  {
    "id": "wormadam",
    "name": "\u30DF\u30CE\u30DE\u30C0\u30E0",
    "nameEn": "Wormadam",
    "type": "bug",
    "type2": "grass",
    "baseStats": {
      "hp": 60,
      "atk": 59,
      "def": 85,
      "spa": 79,
      "spd": 105,
      "spe": 36
    },
    "abilities": [
      "anticipation",
      "overcoat"
    ]
  },
  {
    "id": "mothim",
    "name": "\u30AC\u30FC\u30E1\u30A4\u30EB",
    "nameEn": "Mothim",
    "type": "bug",
    "type2": "flying",
    "baseStats": {
      "hp": 70,
      "atk": 94,
      "def": 50,
      "spa": 94,
      "spd": 50,
      "spe": 66
    },
    "abilities": [
      "swarm",
      "tintedlens"
    ]
  },
  {
    "id": "combee",
    "name": "\u30DF\u30C4\u30CF\u30CB\u30FC",
    "nameEn": "Combee",
    "type": "bug",
    "type2": "flying",
    "baseStats": {
      "hp": 30,
      "atk": 30,
      "def": 42,
      "spa": 30,
      "spd": 42,
      "spe": 70
    },
    "abilities": [
      "honeygather",
      "hustle"
    ]
  },
  {
    "id": "vespiquen",
    "name": "\u30D3\u30FC\u30AF\u30A4\u30F3",
    "nameEn": "Vespiquen",
    "type": "bug",
    "type2": "flying",
    "baseStats": {
      "hp": 70,
      "atk": 80,
      "def": 102,
      "spa": 80,
      "spd": 102,
      "spe": 40
    },
    "abilities": [
      "pressure",
      "unnerve"
    ]
  },
  {
    "id": "pachirisu",
    "name": "\u30D1\u30C1\u30EA\u30B9",
    "nameEn": "Pachirisu",
    "type": "electric",
    "baseStats": {
      "hp": 60,
      "atk": 45,
      "def": 70,
      "spa": 45,
      "spd": 90,
      "spe": 95
    },
    "abilities": [
      "runaway",
      "pickup",
      "voltabsorb"
    ]
  },
  {
    "id": "buizel",
    "name": "\u30D6\u30A4\u30BC\u30EB",
    "nameEn": "Buizel",
    "type": "water",
    "baseStats": {
      "hp": 55,
      "atk": 65,
      "def": 35,
      "spa": 60,
      "spd": 30,
      "spe": 85
    },
    "abilities": [
      "swiftswim",
      "waterveil"
    ]
  },
  {
    "id": "floatzel",
    "name": "\u30D5\u30ED\u30FC\u30BC\u30EB",
    "nameEn": "Floatzel",
    "type": "water",
    "baseStats": {
      "hp": 85,
      "atk": 105,
      "def": 55,
      "spa": 85,
      "spd": 50,
      "spe": 115
    },
    "abilities": [
      "swiftswim",
      "waterveil"
    ]
  },
  {
    "id": "cherubi",
    "name": "\u30C1\u30A7\u30EA\u30F3\u30DC",
    "nameEn": "Cherubi",
    "type": "grass",
    "baseStats": {
      "hp": 45,
      "atk": 35,
      "def": 45,
      "spa": 62,
      "spd": 53,
      "spe": 35
    },
    "abilities": [
      "chlorophyll"
    ]
  },
  {
    "id": "cherrim",
    "name": "\u30C1\u30A7\u30EA\u30E0",
    "nameEn": "Cherrim",
    "type": "grass",
    "baseStats": {
      "hp": 70,
      "atk": 60,
      "def": 70,
      "spa": 87,
      "spd": 78,
      "spe": 85
    },
    "abilities": [
      "flowergift"
    ]
  },
  {
    "id": "shellos",
    "name": "\u30AB\u30E9\u30CA\u30AF\u30B7",
    "nameEn": "Shellos",
    "type": "water",
    "baseStats": {
      "hp": 76,
      "atk": 48,
      "def": 48,
      "spa": 57,
      "spd": 62,
      "spe": 34
    },
    "abilities": [
      "stickyhold",
      "stormdrain",
      "sandforce"
    ]
  },
  {
    "id": "gastrodon",
    "name": "\u30C8\u30EA\u30C8\u30C9\u30F3",
    "nameEn": "Gastrodon",
    "type": "water",
    "type2": "ground",
    "baseStats": {
      "hp": 111,
      "atk": 83,
      "def": 68,
      "spa": 92,
      "spd": 82,
      "spe": 39
    },
    "abilities": [
      "stickyhold",
      "stormdrain",
      "sandforce"
    ]
  },
  {
    "id": "ambipom",
    "name": "\u30A8\u30C6\u30DC\u30FC\u30B9",
    "nameEn": "Ambipom",
    "type": "normal",
    "baseStats": {
      "hp": 75,
      "atk": 100,
      "def": 66,
      "spa": 60,
      "spd": 66,
      "spe": 115
    },
    "abilities": [
      "technician",
      "pickup",
      "skilllink"
    ]
  },
  {
    "id": "drifloon",
    "name": "\u30D5\u30EF\u30F3\u30C6",
    "nameEn": "Drifloon",
    "type": "ghost",
    "type2": "flying",
    "baseStats": {
      "hp": 90,
      "atk": 50,
      "def": 34,
      "spa": 60,
      "spd": 44,
      "spe": 70
    },
    "abilities": [
      "aftermath",
      "unburden",
      "flareboost"
    ]
  },
  {
    "id": "drifblim",
    "name": "\u30D5\u30EF\u30E9\u30A4\u30C9",
    "nameEn": "Drifblim",
    "type": "ghost",
    "type2": "flying",
    "baseStats": {
      "hp": 150,
      "atk": 80,
      "def": 44,
      "spa": 90,
      "spd": 54,
      "spe": 80
    },
    "abilities": [
      "aftermath",
      "unburden",
      "flareboost"
    ]
  },
  {
    "id": "buneary",
    "name": "\u30DF\u30DF\u30ED\u30EB",
    "nameEn": "Buneary",
    "type": "normal",
    "baseStats": {
      "hp": 55,
      "atk": 66,
      "def": 44,
      "spa": 44,
      "spd": 56,
      "spe": 85
    },
    "abilities": [
      "runaway",
      "klutz",
      "limber"
    ]
  },
  {
    "id": "lopunny",
    "name": "\u30DF\u30DF\u30ED\u30C3\u30D7",
    "nameEn": "Lopunny",
    "type": "normal",
    "baseStats": {
      "hp": 65,
      "atk": 76,
      "def": 84,
      "spa": 54,
      "spd": 96,
      "spe": 105
    },
    "abilities": [
      "cutecharm",
      "klutz",
      "limber"
    ]
  },
  {
    "id": "mismagius",
    "name": "\u30E0\u30A6\u30DE\u30FC\u30B8",
    "nameEn": "Mismagius",
    "type": "ghost",
    "baseStats": {
      "hp": 60,
      "atk": 60,
      "def": 60,
      "spa": 105,
      "spd": 105,
      "spe": 105
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "honchkrow",
    "name": "\u30C9\u30F3\u30AB\u30E9\u30B9",
    "nameEn": "Honchkrow",
    "type": "dark",
    "type2": "flying",
    "baseStats": {
      "hp": 100,
      "atk": 125,
      "def": 52,
      "spa": 105,
      "spd": 52,
      "spe": 71
    },
    "abilities": [
      "insomnia",
      "superluck",
      "moxie"
    ]
  },
  {
    "id": "glameow",
    "name": "\u30CB\u30E3\u30EB\u30DE\u30FC",
    "nameEn": "Glameow",
    "type": "normal",
    "baseStats": {
      "hp": 49,
      "atk": 55,
      "def": 42,
      "spa": 42,
      "spd": 37,
      "spe": 85
    },
    "abilities": [
      "limber",
      "owntempo",
      "keeneye"
    ]
  },
  {
    "id": "purugly",
    "name": "\u30D6\u30CB\u30E3\u30C3\u30C8",
    "nameEn": "Purugly",
    "type": "normal",
    "baseStats": {
      "hp": 71,
      "atk": 82,
      "def": 64,
      "spa": 64,
      "spd": 59,
      "spe": 112
    },
    "abilities": [
      "thickfat",
      "owntempo",
      "defiant"
    ]
  },
  {
    "id": "chingling",
    "name": "\u30EA\u30FC\u30B7\u30E3\u30F3",
    "nameEn": "Chingling",
    "type": "psychic",
    "baseStats": {
      "hp": 45,
      "atk": 30,
      "def": 50,
      "spa": 65,
      "spd": 50,
      "spe": 45
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "stunky",
    "name": "\u30B9\u30AB\u30F3\u30D7\u30FC",
    "nameEn": "Stunky",
    "type": "poison",
    "type2": "dark",
    "baseStats": {
      "hp": 63,
      "atk": 63,
      "def": 47,
      "spa": 41,
      "spd": 41,
      "spe": 74
    },
    "abilities": [
      "stench",
      "aftermath",
      "keeneye"
    ]
  },
  {
    "id": "skuntank",
    "name": "\u30B9\u30AB\u30BF\u30F3\u30AF",
    "nameEn": "Skuntank",
    "type": "poison",
    "type2": "dark",
    "baseStats": {
      "hp": 103,
      "atk": 93,
      "def": 67,
      "spa": 71,
      "spd": 61,
      "spe": 84
    },
    "abilities": [
      "stench",
      "aftermath",
      "keeneye"
    ]
  },
  {
    "id": "bronzor",
    "name": "\u30C9\u30FC\u30DF\u30E9\u30FC",
    "nameEn": "Bronzor",
    "type": "steel",
    "type2": "psychic",
    "baseStats": {
      "hp": 57,
      "atk": 24,
      "def": 86,
      "spa": 24,
      "spd": 86,
      "spe": 23
    },
    "abilities": [
      "levitate",
      "heatproof",
      "heavymetal"
    ]
  },
  {
    "id": "bronzong",
    "name": "\u30C9\u30FC\u30BF\u30AF\u30F3",
    "nameEn": "Bronzong",
    "type": "steel",
    "type2": "psychic",
    "baseStats": {
      "hp": 67,
      "atk": 89,
      "def": 116,
      "spa": 79,
      "spd": 116,
      "spe": 33
    },
    "abilities": [
      "levitate",
      "heatproof",
      "heavymetal"
    ]
  },
  {
    "id": "bonsly",
    "name": "\u30A6\u30BD\u30CF\u30C1",
    "nameEn": "Bonsly",
    "type": "rock",
    "baseStats": {
      "hp": 50,
      "atk": 80,
      "def": 95,
      "spa": 10,
      "spd": 45,
      "spe": 10
    },
    "abilities": [
      "sturdy",
      "rockhead",
      "rattled"
    ]
  },
  {
    "id": "mimejr",
    "name": "\u30DE\u30CD\u30CD",
    "nameEn": "Mime Jr.",
    "type": "psychic",
    "type2": "fairy",
    "baseStats": {
      "hp": 20,
      "atk": 25,
      "def": 45,
      "spa": 70,
      "spd": 90,
      "spe": 60
    },
    "abilities": [
      "soundproof",
      "filter",
      "technician"
    ]
  },
  {
    "id": "happiny",
    "name": "\u30D4\u30F3\u30D7\u30AF",
    "nameEn": "Happiny",
    "type": "normal",
    "baseStats": {
      "hp": 100,
      "atk": 5,
      "def": 5,
      "spa": 15,
      "spd": 65,
      "spe": 30
    },
    "abilities": [
      "naturalcure",
      "serenegrace",
      "friendguard"
    ]
  },
  {
    "id": "chatot",
    "name": "\u30DA\u30E9\u30C3\u30D7",
    "nameEn": "Chatot",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 76,
      "atk": 65,
      "def": 45,
      "spa": 92,
      "spd": 42,
      "spe": 91
    },
    "abilities": [
      "keeneye",
      "tangledfeet",
      "bigpecks"
    ]
  },
  {
    "id": "spiritomb",
    "name": "\u30DF\u30AB\u30EB\u30B2",
    "nameEn": "Spiritomb",
    "type": "ghost",
    "type2": "dark",
    "baseStats": {
      "hp": 50,
      "atk": 92,
      "def": 108,
      "spa": 92,
      "spd": 108,
      "spe": 35
    },
    "abilities": [
      "pressure",
      "infiltrator"
    ]
  },
  {
    "id": "gible",
    "name": "\u30D5\u30AB\u30DE\u30EB",
    "nameEn": "Gible",
    "type": "dragon",
    "type2": "ground",
    "baseStats": {
      "hp": 58,
      "atk": 70,
      "def": 45,
      "spa": 40,
      "spd": 45,
      "spe": 42
    },
    "abilities": [
      "sandveil",
      "roughskin"
    ]
  },
  {
    "id": "gabite",
    "name": "\u30AC\u30D0\u30A4\u30C8",
    "nameEn": "Gabite",
    "type": "dragon",
    "type2": "ground",
    "baseStats": {
      "hp": 68,
      "atk": 90,
      "def": 65,
      "spa": 50,
      "spd": 55,
      "spe": 82
    },
    "abilities": [
      "sandveil",
      "roughskin"
    ]
  },
  {
    "id": "garchomp",
    "name": "\u30AC\u30D6\u30EA\u30A2\u30B9",
    "nameEn": "Garchomp",
    "type": "dragon",
    "type2": "ground",
    "baseStats": {
      "hp": 108,
      "atk": 130,
      "def": 95,
      "spa": 80,
      "spd": 85,
      "spe": 102
    },
    "abilities": [
      "sandveil",
      "roughskin"
    ]
  },
  {
    "id": "munchlax",
    "name": "\u30B4\u30F3\u30D9",
    "nameEn": "Munchlax",
    "type": "normal",
    "baseStats": {
      "hp": 135,
      "atk": 85,
      "def": 40,
      "spa": 40,
      "spd": 85,
      "spe": 5
    },
    "abilities": [
      "pickup",
      "thickfat",
      "gluttony"
    ]
  },
  {
    "id": "riolu",
    "name": "\u30EA\u30AA\u30EB",
    "nameEn": "Riolu",
    "type": "fighting",
    "baseStats": {
      "hp": 40,
      "atk": 70,
      "def": 40,
      "spa": 35,
      "spd": 40,
      "spe": 60
    },
    "abilities": [
      "steadfast",
      "innerfocus",
      "prankster"
    ]
  },
  {
    "id": "lucario",
    "name": "\u30EB\u30AB\u30EA\u30AA",
    "nameEn": "Lucario",
    "type": "fighting",
    "type2": "steel",
    "baseStats": {
      "hp": 70,
      "atk": 110,
      "def": 70,
      "spa": 115,
      "spd": 70,
      "spe": 90
    },
    "abilities": [
      "steadfast",
      "innerfocus",
      "justified"
    ]
  },
  {
    "id": "hippopotas",
    "name": "\u30D2\u30DD\u30DD\u30BF\u30B9",
    "nameEn": "Hippopotas",
    "type": "ground",
    "baseStats": {
      "hp": 68,
      "atk": 72,
      "def": 78,
      "spa": 38,
      "spd": 42,
      "spe": 32
    },
    "abilities": [
      "sandstream",
      "sandforce"
    ]
  },
  {
    "id": "hippowdon",
    "name": "\u30AB\u30D0\u30EB\u30C9\u30F3",
    "nameEn": "Hippowdon",
    "type": "ground",
    "baseStats": {
      "hp": 108,
      "atk": 112,
      "def": 118,
      "spa": 68,
      "spd": 72,
      "spe": 47
    },
    "abilities": [
      "sandstream",
      "sandforce"
    ]
  },
  {
    "id": "skorupi",
    "name": "\u30B9\u30B3\u30EB\u30D4",
    "nameEn": "Skorupi",
    "type": "poison",
    "type2": "bug",
    "baseStats": {
      "hp": 40,
      "atk": 50,
      "def": 90,
      "spa": 30,
      "spd": 55,
      "spe": 65
    },
    "abilities": [
      "battlearmor",
      "sniper",
      "keeneye"
    ]
  },
  {
    "id": "drapion",
    "name": "\u30C9\u30E9\u30D4\u30AA\u30F3",
    "nameEn": "Drapion",
    "type": "poison",
    "type2": "dark",
    "baseStats": {
      "hp": 70,
      "atk": 90,
      "def": 110,
      "spa": 60,
      "spd": 75,
      "spe": 95
    },
    "abilities": [
      "battlearmor",
      "sniper",
      "keeneye"
    ]
  },
  {
    "id": "croagunk",
    "name": "\u30B0\u30EC\u30C3\u30B0\u30EB",
    "nameEn": "Croagunk",
    "type": "poison",
    "type2": "fighting",
    "baseStats": {
      "hp": 48,
      "atk": 61,
      "def": 40,
      "spa": 61,
      "spd": 40,
      "spe": 50
    },
    "abilities": [
      "anticipation",
      "dryskin",
      "poisontouch"
    ]
  },
  {
    "id": "toxicroak",
    "name": "\u30C9\u30AF\u30ED\u30C3\u30B0",
    "nameEn": "Toxicroak",
    "type": "poison",
    "type2": "fighting",
    "baseStats": {
      "hp": 83,
      "atk": 106,
      "def": 65,
      "spa": 86,
      "spd": 65,
      "spe": 85
    },
    "abilities": [
      "anticipation",
      "dryskin",
      "poisontouch"
    ]
  },
  {
    "id": "carnivine",
    "name": "\u30DE\u30B9\u30AD\u30C3\u30D1",
    "nameEn": "Carnivine",
    "type": "grass",
    "baseStats": {
      "hp": 74,
      "atk": 100,
      "def": 72,
      "spa": 90,
      "spd": 72,
      "spe": 46
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "finneon",
    "name": "\u30B1\u30A4\u30B3\u30A6\u30AA",
    "nameEn": "Finneon",
    "type": "water",
    "baseStats": {
      "hp": 49,
      "atk": 49,
      "def": 56,
      "spa": 49,
      "spd": 61,
      "spe": 66
    },
    "abilities": [
      "swiftswim",
      "stormdrain",
      "waterveil"
    ]
  },
  {
    "id": "lumineon",
    "name": "\u30CD\u30AA\u30E9\u30F3\u30C8",
    "nameEn": "Lumineon",
    "type": "water",
    "baseStats": {
      "hp": 69,
      "atk": 69,
      "def": 76,
      "spa": 69,
      "spd": 86,
      "spe": 91
    },
    "abilities": [
      "swiftswim",
      "stormdrain",
      "waterveil"
    ]
  },
  {
    "id": "mantyke",
    "name": "\u30BF\u30DE\u30F3\u30BF",
    "nameEn": "Mantyke",
    "type": "water",
    "type2": "flying",
    "baseStats": {
      "hp": 45,
      "atk": 20,
      "def": 50,
      "spa": 60,
      "spd": 120,
      "spe": 50
    },
    "abilities": [
      "swiftswim",
      "waterabsorb",
      "waterveil"
    ]
  },
  {
    "id": "snover",
    "name": "\u30E6\u30AD\u30AB\u30D6\u30EA",
    "nameEn": "Snover",
    "type": "grass",
    "type2": "ice",
    "baseStats": {
      "hp": 60,
      "atk": 62,
      "def": 50,
      "spa": 62,
      "spd": 60,
      "spe": 40
    },
    "abilities": [
      "snowwarning",
      "soundproof"
    ]
  },
  {
    "id": "abomasnow",
    "name": "\u30E6\u30AD\u30CE\u30AA\u30FC",
    "nameEn": "Abomasnow",
    "type": "grass",
    "type2": "ice",
    "baseStats": {
      "hp": 90,
      "atk": 92,
      "def": 75,
      "spa": 92,
      "spd": 85,
      "spe": 60
    },
    "abilities": [
      "snowwarning",
      "soundproof"
    ]
  },
  {
    "id": "weavile",
    "name": "\u30DE\u30CB\u30E5\u30FC\u30E9",
    "nameEn": "Weavile",
    "type": "dark",
    "type2": "ice",
    "baseStats": {
      "hp": 70,
      "atk": 120,
      "def": 65,
      "spa": 45,
      "spd": 85,
      "spe": 125
    },
    "abilities": [
      "pressure",
      "pickpocket"
    ]
  },
  {
    "id": "magnezone",
    "name": "\u30B8\u30D0\u30B3\u30A4\u30EB",
    "nameEn": "Magnezone",
    "type": "electric",
    "type2": "steel",
    "baseStats": {
      "hp": 70,
      "atk": 70,
      "def": 115,
      "spa": 130,
      "spd": 90,
      "spe": 60
    },
    "abilities": [
      "magnetpull",
      "sturdy",
      "analytic"
    ]
  },
  {
    "id": "lickilicky",
    "name": "\u30D9\u30ED\u30D9\u30EB\u30C8",
    "nameEn": "Lickilicky",
    "type": "normal",
    "baseStats": {
      "hp": 110,
      "atk": 85,
      "def": 95,
      "spa": 80,
      "spd": 95,
      "spe": 50
    },
    "abilities": [
      "owntempo",
      "oblivious",
      "cloudnine"
    ]
  },
  {
    "id": "rhyperior",
    "name": "\u30C9\u30B5\u30A4\u30C9\u30F3",
    "nameEn": "Rhyperior",
    "type": "ground",
    "type2": "rock",
    "baseStats": {
      "hp": 115,
      "atk": 140,
      "def": 130,
      "spa": 55,
      "spd": 55,
      "spe": 40
    },
    "abilities": [
      "lightningrod",
      "solidrock",
      "reckless"
    ]
  },
  {
    "id": "tangrowth",
    "name": "\u30E2\u30B8\u30E3\u30F3\u30DC",
    "nameEn": "Tangrowth",
    "type": "grass",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 125,
      "spa": 110,
      "spd": 50,
      "spe": 50
    },
    "abilities": [
      "chlorophyll",
      "leafguard",
      "regenerator"
    ]
  },
  {
    "id": "electivire",
    "name": "\u30A8\u30EC\u30AD\u30D6\u30EB",
    "nameEn": "Electivire",
    "type": "electric",
    "baseStats": {
      "hp": 75,
      "atk": 123,
      "def": 67,
      "spa": 95,
      "spd": 85,
      "spe": 95
    },
    "abilities": [
      "motordrive",
      "vitalspirit"
    ]
  },
  {
    "id": "magmortar",
    "name": "\u30D6\u30FC\u30D0\u30FC\u30F3",
    "nameEn": "Magmortar",
    "type": "fire",
    "baseStats": {
      "hp": 75,
      "atk": 95,
      "def": 67,
      "spa": 125,
      "spd": 95,
      "spe": 83
    },
    "abilities": [
      "flamebody",
      "vitalspirit"
    ]
  },
  {
    "id": "togekiss",
    "name": "\u30C8\u30B2\u30AD\u30C3\u30B9",
    "nameEn": "Togekiss",
    "type": "fairy",
    "type2": "flying",
    "baseStats": {
      "hp": 85,
      "atk": 50,
      "def": 95,
      "spa": 120,
      "spd": 115,
      "spe": 80
    },
    "abilities": [
      "hustle",
      "serenegrace",
      "superluck"
    ]
  },
  {
    "id": "yanmega",
    "name": "\u30E1\u30AC\u30E4\u30F3\u30DE",
    "nameEn": "Yanmega",
    "type": "bug",
    "type2": "flying",
    "baseStats": {
      "hp": 86,
      "atk": 76,
      "def": 86,
      "spa": 116,
      "spd": 56,
      "spe": 95
    },
    "abilities": [
      "speedboost",
      "tintedlens",
      "frisk"
    ]
  },
  {
    "id": "leafeon",
    "name": "\u30EA\u30FC\u30D5\u30A3\u30A2",
    "nameEn": "Leafeon",
    "type": "grass",
    "baseStats": {
      "hp": 65,
      "atk": 110,
      "def": 130,
      "spa": 60,
      "spd": 65,
      "spe": 95
    },
    "abilities": [
      "leafguard",
      "chlorophyll"
    ]
  },
  {
    "id": "glaceon",
    "name": "\u30B0\u30EC\u30A4\u30B7\u30A2",
    "nameEn": "Glaceon",
    "type": "ice",
    "baseStats": {
      "hp": 65,
      "atk": 60,
      "def": 110,
      "spa": 130,
      "spd": 95,
      "spe": 65
    },
    "abilities": [
      "snowcloak",
      "icebody"
    ]
  },
  {
    "id": "gliscor",
    "name": "\u30B0\u30E9\u30A4\u30AA\u30F3",
    "nameEn": "Gliscor",
    "type": "ground",
    "type2": "flying",
    "baseStats": {
      "hp": 75,
      "atk": 95,
      "def": 125,
      "spa": 45,
      "spd": 75,
      "spe": 95
    },
    "abilities": [
      "hypercutter",
      "sandveil",
      "poisonheal"
    ]
  },
  {
    "id": "mamoswine",
    "name": "\u30DE\u30F3\u30E0\u30FC",
    "nameEn": "Mamoswine",
    "type": "ice",
    "type2": "ground",
    "baseStats": {
      "hp": 110,
      "atk": 130,
      "def": 80,
      "spa": 70,
      "spd": 60,
      "spe": 80
    },
    "abilities": [
      "oblivious",
      "snowcloak",
      "thickfat"
    ]
  },
  {
    "id": "porygonz",
    "name": "\u30DD\u30EA\u30B4\u30F3\uFF3A",
    "nameEn": "Porygon-Z",
    "type": "normal",
    "baseStats": {
      "hp": 85,
      "atk": 80,
      "def": 70,
      "spa": 135,
      "spd": 75,
      "spe": 90
    },
    "abilities": [
      "adaptability",
      "download",
      "analytic"
    ]
  },
  {
    "id": "gallade",
    "name": "\u30A8\u30EB\u30EC\u30A4\u30C9",
    "nameEn": "Gallade",
    "type": "psychic",
    "type2": "fighting",
    "baseStats": {
      "hp": 68,
      "atk": 125,
      "def": 65,
      "spa": 65,
      "spd": 115,
      "spe": 80
    },
    "abilities": [
      "steadfast",
      "sharpness",
      "justified"
    ]
  },
  {
    "id": "probopass",
    "name": "\u30C0\u30A4\u30CE\u30FC\u30BA",
    "nameEn": "Probopass",
    "type": "rock",
    "type2": "steel",
    "baseStats": {
      "hp": 60,
      "atk": 55,
      "def": 145,
      "spa": 75,
      "spd": 150,
      "spe": 40
    },
    "abilities": [
      "sturdy",
      "magnetpull",
      "sandforce"
    ]
  },
  {
    "id": "dusknoir",
    "name": "\u30E8\u30CE\u30EF\u30FC\u30EB",
    "nameEn": "Dusknoir",
    "type": "ghost",
    "baseStats": {
      "hp": 45,
      "atk": 100,
      "def": 135,
      "spa": 65,
      "spd": 135,
      "spe": 45
    },
    "abilities": [
      "pressure",
      "frisk"
    ]
  },
  {
    "id": "froslass",
    "name": "\u30E6\u30AD\u30E1\u30CE\u30B3",
    "nameEn": "Froslass",
    "type": "ice",
    "type2": "ghost",
    "baseStats": {
      "hp": 70,
      "atk": 80,
      "def": 70,
      "spa": 80,
      "spd": 70,
      "spe": 110
    },
    "abilities": [
      "snowcloak",
      "cursedbody"
    ]
  },
  {
    "id": "rotom",
    "name": "\u30ED\u30C8\u30E0",
    "nameEn": "Rotom",
    "type": "electric",
    "type2": "ghost",
    "baseStats": {
      "hp": 50,
      "atk": 50,
      "def": 77,
      "spa": 95,
      "spd": 77,
      "spe": 91
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "uxie",
    "name": "\u30E6\u30AF\u30B7\u30FC",
    "nameEn": "Uxie",
    "type": "psychic",
    "baseStats": {
      "hp": 75,
      "atk": 75,
      "def": 130,
      "spa": 75,
      "spd": 130,
      "spe": 95
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "mesprit",
    "name": "\u30A8\u30E0\u30EA\u30C3\u30C8",
    "nameEn": "Mesprit",
    "type": "psychic",
    "baseStats": {
      "hp": 80,
      "atk": 105,
      "def": 105,
      "spa": 105,
      "spd": 105,
      "spe": 80
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "azelf",
    "name": "\u30A2\u30B0\u30CE\u30E0",
    "nameEn": "Azelf",
    "type": "psychic",
    "baseStats": {
      "hp": 75,
      "atk": 125,
      "def": 70,
      "spa": 125,
      "spd": 70,
      "spe": 115
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "dialga",
    "name": "\u30C7\u30A3\u30A2\u30EB\u30AC",
    "nameEn": "Dialga",
    "type": "steel",
    "type2": "dragon",
    "baseStats": {
      "hp": 100,
      "atk": 120,
      "def": 120,
      "spa": 150,
      "spd": 100,
      "spe": 90
    },
    "abilities": [
      "pressure",
      "telepathy"
    ]
  },
  {
    "id": "palkia",
    "name": "\u30D1\u30EB\u30AD\u30A2",
    "nameEn": "Palkia",
    "type": "water",
    "type2": "dragon",
    "baseStats": {
      "hp": 90,
      "atk": 120,
      "def": 100,
      "spa": 150,
      "spd": 120,
      "spe": 100
    },
    "abilities": [
      "pressure",
      "telepathy"
    ]
  },
  {
    "id": "heatran",
    "name": "\u30D2\u30FC\u30C9\u30E9\u30F3",
    "nameEn": "Heatran",
    "type": "fire",
    "type2": "steel",
    "baseStats": {
      "hp": 91,
      "atk": 90,
      "def": 106,
      "spa": 130,
      "spd": 106,
      "spe": 77
    },
    "abilities": [
      "flashfire",
      "flamebody"
    ]
  },
  {
    "id": "regigigas",
    "name": "\u30EC\u30B8\u30AE\u30AC\u30B9",
    "nameEn": "Regigigas",
    "type": "normal",
    "baseStats": {
      "hp": 110,
      "atk": 160,
      "def": 110,
      "spa": 80,
      "spd": 110,
      "spe": 100
    },
    "abilities": [
      "slowstart"
    ]
  },
  {
    "id": "giratina",
    "name": "\u30AE\u30E9\u30C6\u30A3\u30CA",
    "nameEn": "Giratina",
    "type": "ghost",
    "type2": "dragon",
    "baseStats": {
      "hp": 150,
      "atk": 100,
      "def": 120,
      "spa": 100,
      "spd": 120,
      "spe": 90
    },
    "abilities": [
      "pressure",
      "telepathy"
    ]
  },
  {
    "id": "cresselia",
    "name": "\u30AF\u30EC\u30BB\u30EA\u30A2",
    "nameEn": "Cresselia",
    "type": "psychic",
    "baseStats": {
      "hp": 120,
      "atk": 70,
      "def": 110,
      "spa": 75,
      "spd": 120,
      "spe": 85
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "phione",
    "name": "\u30D5\u30A3\u30AA\u30CD",
    "nameEn": "Phione",
    "type": "water",
    "baseStats": {
      "hp": 80,
      "atk": 80,
      "def": 80,
      "spa": 80,
      "spd": 80,
      "spe": 80
    },
    "abilities": [
      "hydration"
    ]
  },
  {
    "id": "manaphy",
    "name": "\u30DE\u30CA\u30D5\u30A3",
    "nameEn": "Manaphy",
    "type": "water",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 100,
      "spa": 100,
      "spd": 100,
      "spe": 100
    },
    "abilities": [
      "hydration"
    ]
  },
  {
    "id": "darkrai",
    "name": "\u30C0\u30FC\u30AF\u30E9\u30A4",
    "nameEn": "Darkrai",
    "type": "dark",
    "baseStats": {
      "hp": 70,
      "atk": 90,
      "def": 90,
      "spa": 135,
      "spd": 90,
      "spe": 125
    },
    "abilities": [
      "baddreams"
    ]
  },
  {
    "id": "shaymin",
    "name": "\u30B7\u30A7\u30A4\u30DF",
    "nameEn": "Shaymin",
    "type": "grass",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 100,
      "spa": 100,
      "spd": 100,
      "spe": 100
    },
    "abilities": [
      "naturalcure"
    ]
  },
  {
    "id": "arceus",
    "name": "\u30A2\u30EB\u30BB\u30A6\u30B9",
    "nameEn": "Arceus",
    "type": "normal",
    "baseStats": {
      "hp": 120,
      "atk": 120,
      "def": 120,
      "spa": 120,
      "spd": 120,
      "spe": 120
    },
    "abilities": [
      "multitype"
    ]
  },
  {
    "id": "victini",
    "name": "\u30D3\u30AF\u30C6\u30A3\u30CB",
    "nameEn": "Victini",
    "type": "psychic",
    "type2": "fire",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 100,
      "spa": 100,
      "spd": 100,
      "spe": 100
    },
    "abilities": [
      "victorystar"
    ]
  },
  {
    "id": "snivy",
    "name": "\u30C4\u30BF\u30FC\u30B8\u30E3",
    "nameEn": "Snivy",
    "type": "grass",
    "baseStats": {
      "hp": 45,
      "atk": 45,
      "def": 55,
      "spa": 45,
      "spd": 55,
      "spe": 63
    },
    "abilities": [
      "overgrow",
      "contrary"
    ]
  },
  {
    "id": "servine",
    "name": "\u30B8\u30E3\u30CE\u30D3\u30FC",
    "nameEn": "Servine",
    "type": "grass",
    "baseStats": {
      "hp": 60,
      "atk": 60,
      "def": 75,
      "spa": 60,
      "spd": 75,
      "spe": 83
    },
    "abilities": [
      "overgrow",
      "contrary"
    ]
  },
  {
    "id": "serperior",
    "name": "\u30B8\u30E3\u30ED\u30FC\u30C0",
    "nameEn": "Serperior",
    "type": "grass",
    "baseStats": {
      "hp": 75,
      "atk": 75,
      "def": 95,
      "spa": 75,
      "spd": 95,
      "spe": 113
    },
    "abilities": [
      "overgrow",
      "contrary"
    ]
  },
  {
    "id": "tepig",
    "name": "\u30DD\u30AB\u30D6",
    "nameEn": "Tepig",
    "type": "fire",
    "baseStats": {
      "hp": 65,
      "atk": 63,
      "def": 45,
      "spa": 45,
      "spd": 45,
      "spe": 45
    },
    "abilities": [
      "blaze",
      "thickfat"
    ]
  },
  {
    "id": "pignite",
    "name": "\u30C1\u30E3\u30AA\u30D6\u30FC",
    "nameEn": "Pignite",
    "type": "fire",
    "type2": "fighting",
    "baseStats": {
      "hp": 90,
      "atk": 93,
      "def": 55,
      "spa": 70,
      "spd": 55,
      "spe": 55
    },
    "abilities": [
      "blaze",
      "thickfat"
    ]
  },
  {
    "id": "emboar",
    "name": "\u30A8\u30F3\u30D6\u30AA\u30FC",
    "nameEn": "Emboar",
    "type": "fire",
    "type2": "fighting",
    "baseStats": {
      "hp": 110,
      "atk": 123,
      "def": 65,
      "spa": 100,
      "spd": 65,
      "spe": 65
    },
    "abilities": [
      "blaze",
      "reckless"
    ]
  },
  {
    "id": "oshawott",
    "name": "\u30DF\u30B8\u30E5\u30DE\u30EB",
    "nameEn": "Oshawott",
    "type": "water",
    "baseStats": {
      "hp": 55,
      "atk": 55,
      "def": 45,
      "spa": 63,
      "spd": 45,
      "spe": 45
    },
    "abilities": [
      "torrent",
      "shellarmor"
    ]
  },
  {
    "id": "dewott",
    "name": "\u30D5\u30BF\u30C1\u30DE\u30EB",
    "nameEn": "Dewott",
    "type": "water",
    "baseStats": {
      "hp": 75,
      "atk": 75,
      "def": 60,
      "spa": 83,
      "spd": 60,
      "spe": 60
    },
    "abilities": [
      "torrent",
      "shellarmor"
    ]
  },
  {
    "id": "samurott",
    "name": "\u30C0\u30A4\u30B1\u30F3\u30AD",
    "nameEn": "Samurott",
    "type": "water",
    "baseStats": {
      "hp": 95,
      "atk": 100,
      "def": 85,
      "spa": 108,
      "spd": 70,
      "spe": 70
    },
    "abilities": [
      "torrent",
      "shellarmor"
    ]
  },
  {
    "id": "patrat",
    "name": "Patrat",
    "nameEn": "Patrat",
    "type": "normal",
    "baseStats": {
      "hp": 45,
      "atk": 55,
      "def": 39,
      "spa": 35,
      "spd": 39,
      "spe": 42
    },
    "abilities": [
      "runaway",
      "keeneye",
      "analytic"
    ]
  },
  {
    "id": "watchog",
    "name": "Watchog",
    "nameEn": "Watchog",
    "type": "normal",
    "baseStats": {
      "hp": 60,
      "atk": 85,
      "def": 69,
      "spa": 60,
      "spd": 69,
      "spe": 77
    },
    "abilities": [
      "illuminate",
      "keeneye",
      "analytic"
    ]
  },
  {
    "id": "lillipup",
    "name": "\u30E8\u30FC\u30C6\u30EA\u30FC",
    "nameEn": "Lillipup",
    "type": "normal",
    "baseStats": {
      "hp": 45,
      "atk": 60,
      "def": 45,
      "spa": 25,
      "spd": 45,
      "spe": 55
    },
    "abilities": [
      "vitalspirit",
      "pickup",
      "runaway"
    ]
  },
  {
    "id": "herdier",
    "name": "\u30CF\u30FC\u30C7\u30EA\u30A2",
    "nameEn": "Herdier",
    "type": "normal",
    "baseStats": {
      "hp": 65,
      "atk": 80,
      "def": 65,
      "spa": 35,
      "spd": 65,
      "spe": 60
    },
    "abilities": [
      "intimidate",
      "sandrush",
      "scrappy"
    ]
  },
  {
    "id": "stoutland",
    "name": "\u30E0\u30FC\u30E9\u30F3\u30C9",
    "nameEn": "Stoutland",
    "type": "normal",
    "baseStats": {
      "hp": 85,
      "atk": 110,
      "def": 90,
      "spa": 45,
      "spd": 90,
      "spe": 80
    },
    "abilities": [
      "intimidate",
      "sandrush",
      "scrappy"
    ]
  },
  {
    "id": "purrloin",
    "name": "\u30C1\u30E7\u30ED\u30CD\u30B3",
    "nameEn": "Purrloin",
    "type": "dark",
    "baseStats": {
      "hp": 41,
      "atk": 50,
      "def": 37,
      "spa": 50,
      "spd": 37,
      "spe": 66
    },
    "abilities": [
      "limber",
      "unburden",
      "prankster"
    ]
  },
  {
    "id": "liepard",
    "name": "\u30EC\u30D1\u30EB\u30C0\u30B9",
    "nameEn": "Liepard",
    "type": "dark",
    "baseStats": {
      "hp": 64,
      "atk": 88,
      "def": 50,
      "spa": 88,
      "spd": 50,
      "spe": 106
    },
    "abilities": [
      "limber",
      "unburden",
      "prankster"
    ]
  },
  {
    "id": "pansage",
    "name": "\u30E4\u30CA\u30C3\u30D7",
    "nameEn": "Pansage",
    "type": "grass",
    "baseStats": {
      "hp": 50,
      "atk": 53,
      "def": 48,
      "spa": 53,
      "spd": 48,
      "spe": 64
    },
    "abilities": [
      "gluttony",
      "overgrow"
    ]
  },
  {
    "id": "simisage",
    "name": "\u30E4\u30CA\u30C3\u30AD\u30FC",
    "nameEn": "Simisage",
    "type": "grass",
    "baseStats": {
      "hp": 75,
      "atk": 98,
      "def": 63,
      "spa": 98,
      "spd": 63,
      "spe": 101
    },
    "abilities": [
      "gluttony",
      "overgrow"
    ]
  },
  {
    "id": "pansear",
    "name": "\u30D0\u30AA\u30C3\u30D7",
    "nameEn": "Pansear",
    "type": "fire",
    "baseStats": {
      "hp": 50,
      "atk": 53,
      "def": 48,
      "spa": 53,
      "spd": 48,
      "spe": 64
    },
    "abilities": [
      "gluttony",
      "blaze"
    ]
  },
  {
    "id": "simisear",
    "name": "\u30D0\u30AA\u30C3\u30AD\u30FC",
    "nameEn": "Simisear",
    "type": "fire",
    "baseStats": {
      "hp": 75,
      "atk": 98,
      "def": 63,
      "spa": 98,
      "spd": 63,
      "spe": 101
    },
    "abilities": [
      "gluttony",
      "blaze"
    ]
  },
  {
    "id": "panpour",
    "name": "\u30D2\u30E4\u30C3\u30D7",
    "nameEn": "Panpour",
    "type": "water",
    "baseStats": {
      "hp": 50,
      "atk": 53,
      "def": 48,
      "spa": 53,
      "spd": 48,
      "spe": 64
    },
    "abilities": [
      "gluttony",
      "torrent"
    ]
  },
  {
    "id": "simipour",
    "name": "\u30D2\u30E4\u30C3\u30AD\u30FC",
    "nameEn": "Simipour",
    "type": "water",
    "baseStats": {
      "hp": 75,
      "atk": 98,
      "def": 63,
      "spa": 98,
      "spd": 63,
      "spe": 101
    },
    "abilities": [
      "gluttony",
      "torrent"
    ]
  },
  {
    "id": "munna",
    "name": "\u30E0\u30F3\u30CA",
    "nameEn": "Munna",
    "type": "psychic",
    "baseStats": {
      "hp": 76,
      "atk": 25,
      "def": 45,
      "spa": 67,
      "spd": 55,
      "spe": 24
    },
    "abilities": [
      "forewarn",
      "synchronize",
      "telepathy"
    ]
  },
  {
    "id": "musharna",
    "name": "\u30E0\u30B7\u30E3\u30FC\u30CA",
    "nameEn": "Musharna",
    "type": "psychic",
    "baseStats": {
      "hp": 116,
      "atk": 55,
      "def": 85,
      "spa": 107,
      "spd": 95,
      "spe": 29
    },
    "abilities": [
      "forewarn",
      "synchronize",
      "telepathy"
    ]
  },
  {
    "id": "pidove",
    "name": "\u30DE\u30E1\u30D1\u30C8",
    "nameEn": "Pidove",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 50,
      "atk": 55,
      "def": 50,
      "spa": 36,
      "spd": 30,
      "spe": 43
    },
    "abilities": [
      "bigpecks",
      "superluck",
      "rivalry"
    ]
  },
  {
    "id": "tranquill",
    "name": "\u30CF\u30C8\u30FC\u30DC\u30FC",
    "nameEn": "Tranquill",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 62,
      "atk": 77,
      "def": 62,
      "spa": 50,
      "spd": 42,
      "spe": 65
    },
    "abilities": [
      "bigpecks",
      "superluck",
      "rivalry"
    ]
  },
  {
    "id": "unfezant",
    "name": "\u30B1\u30F3\u30DB\u30ED\u30A6",
    "nameEn": "Unfezant",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 80,
      "atk": 115,
      "def": 80,
      "spa": 65,
      "spd": 55,
      "spe": 93
    },
    "abilities": [
      "bigpecks",
      "superluck",
      "rivalry"
    ]
  },
  {
    "id": "blitzle",
    "name": "\u30B7\u30DE\u30DE",
    "nameEn": "Blitzle",
    "type": "electric",
    "baseStats": {
      "hp": 45,
      "atk": 60,
      "def": 32,
      "spa": 50,
      "spd": 32,
      "spe": 76
    },
    "abilities": [
      "lightningrod",
      "motordrive",
      "sapsipper"
    ]
  },
  {
    "id": "zebstrika",
    "name": "\u30BC\u30D6\u30E9\u30A4\u30AB",
    "nameEn": "Zebstrika",
    "type": "electric",
    "baseStats": {
      "hp": 75,
      "atk": 100,
      "def": 63,
      "spa": 80,
      "spd": 63,
      "spe": 116
    },
    "abilities": [
      "lightningrod",
      "motordrive",
      "sapsipper"
    ]
  },
  {
    "id": "roggenrola",
    "name": "\u30C0\u30F3\u30B4\u30ED",
    "nameEn": "Roggenrola",
    "type": "rock",
    "baseStats": {
      "hp": 55,
      "atk": 75,
      "def": 85,
      "spa": 25,
      "spd": 25,
      "spe": 15
    },
    "abilities": [
      "sturdy",
      "weakarmor",
      "sandforce"
    ]
  },
  {
    "id": "boldore",
    "name": "\u30AC\u30F3\u30C8\u30EB",
    "nameEn": "Boldore",
    "type": "rock",
    "baseStats": {
      "hp": 70,
      "atk": 105,
      "def": 105,
      "spa": 50,
      "spd": 40,
      "spe": 20
    },
    "abilities": [
      "sturdy",
      "weakarmor",
      "sandforce"
    ]
  },
  {
    "id": "gigalith",
    "name": "\u30AE\u30AC\u30A4\u30A2\u30B9",
    "nameEn": "Gigalith",
    "type": "rock",
    "baseStats": {
      "hp": 85,
      "atk": 135,
      "def": 130,
      "spa": 60,
      "spd": 80,
      "spe": 25
    },
    "abilities": [
      "sturdy",
      "sandstream",
      "sandforce"
    ]
  },
  {
    "id": "woobat",
    "name": "\u30B3\u30ED\u30E2\u30EA",
    "nameEn": "Woobat",
    "type": "psychic",
    "type2": "flying",
    "baseStats": {
      "hp": 65,
      "atk": 45,
      "def": 43,
      "spa": 55,
      "spd": 43,
      "spe": 72
    },
    "abilities": [
      "unaware",
      "klutz",
      "simple"
    ]
  },
  {
    "id": "swoobat",
    "name": "\u30B3\u30B3\u30ED\u30E2\u30EA",
    "nameEn": "Swoobat",
    "type": "psychic",
    "type2": "flying",
    "baseStats": {
      "hp": 67,
      "atk": 57,
      "def": 55,
      "spa": 77,
      "spd": 55,
      "spe": 114
    },
    "abilities": [
      "unaware",
      "klutz",
      "simple"
    ]
  },
  {
    "id": "drilbur",
    "name": "\u30E2\u30B0\u30EA\u30E5\u30FC",
    "nameEn": "Drilbur",
    "type": "ground",
    "baseStats": {
      "hp": 60,
      "atk": 85,
      "def": 40,
      "spa": 30,
      "spd": 45,
      "spe": 68
    },
    "abilities": [
      "sandrush",
      "sandforce",
      "moldbreaker"
    ]
  },
  {
    "id": "excadrill",
    "name": "\u30C9\u30EA\u30E5\u30A6\u30BA",
    "nameEn": "Excadrill",
    "type": "ground",
    "type2": "steel",
    "baseStats": {
      "hp": 110,
      "atk": 135,
      "def": 60,
      "spa": 50,
      "spd": 65,
      "spe": 88
    },
    "abilities": [
      "sandrush",
      "sandforce",
      "moldbreaker"
    ]
  },
  {
    "id": "audino",
    "name": "\u30BF\u30D6\u30F3\u30CD",
    "nameEn": "Audino",
    "type": "normal",
    "baseStats": {
      "hp": 103,
      "atk": 60,
      "def": 86,
      "spa": 60,
      "spd": 86,
      "spe": 50
    },
    "abilities": [
      "healer",
      "regenerator",
      "klutz"
    ]
  },
  {
    "id": "timburr",
    "name": "\u30C9\u30C3\u30B3\u30E9\u30FC",
    "nameEn": "Timburr",
    "type": "fighting",
    "baseStats": {
      "hp": 75,
      "atk": 80,
      "def": 55,
      "spa": 25,
      "spd": 35,
      "spe": 35
    },
    "abilities": [
      "guts",
      "sheerforce",
      "ironfist"
    ]
  },
  {
    "id": "gurdurr",
    "name": "\u30C9\u30C6\u30C3\u30B3\u30C4",
    "nameEn": "Gurdurr",
    "type": "fighting",
    "baseStats": {
      "hp": 85,
      "atk": 105,
      "def": 85,
      "spa": 40,
      "spd": 50,
      "spe": 40
    },
    "abilities": [
      "guts",
      "sheerforce",
      "ironfist"
    ]
  },
  {
    "id": "conkeldurr",
    "name": "\u30ED\u30FC\u30D6\u30B7\u30F3",
    "nameEn": "Conkeldurr",
    "type": "fighting",
    "baseStats": {
      "hp": 105,
      "atk": 140,
      "def": 95,
      "spa": 55,
      "spd": 65,
      "spe": 45
    },
    "abilities": [
      "guts",
      "sheerforce",
      "ironfist"
    ]
  },
  {
    "id": "tympole",
    "name": "\u30AA\u30BF\u30DE\u30ED",
    "nameEn": "Tympole",
    "type": "water",
    "baseStats": {
      "hp": 50,
      "atk": 50,
      "def": 40,
      "spa": 50,
      "spd": 40,
      "spe": 64
    },
    "abilities": [
      "swiftswim",
      "hydration",
      "waterabsorb"
    ]
  },
  {
    "id": "palpitoad",
    "name": "\u30AC\u30DE\u30AC\u30EB",
    "nameEn": "Palpitoad",
    "type": "water",
    "type2": "ground",
    "baseStats": {
      "hp": 75,
      "atk": 65,
      "def": 55,
      "spa": 65,
      "spd": 55,
      "spe": 69
    },
    "abilities": [
      "swiftswim",
      "hydration",
      "waterabsorb"
    ]
  },
  {
    "id": "seismitoad",
    "name": "\u30AC\u30DE\u30B2\u30ED\u30B2",
    "nameEn": "Seismitoad",
    "type": "water",
    "type2": "ground",
    "baseStats": {
      "hp": 105,
      "atk": 95,
      "def": 75,
      "spa": 85,
      "spd": 75,
      "spe": 74
    },
    "abilities": [
      "swiftswim",
      "poisontouch",
      "waterabsorb"
    ]
  },
  {
    "id": "throh",
    "name": "\u30CA\u30B2\u30AD",
    "nameEn": "Throh",
    "type": "fighting",
    "baseStats": {
      "hp": 120,
      "atk": 100,
      "def": 85,
      "spa": 30,
      "spd": 85,
      "spe": 45
    },
    "abilities": [
      "guts",
      "innerfocus",
      "moldbreaker"
    ]
  },
  {
    "id": "sawk",
    "name": "\u30C0\u30B2\u30AD",
    "nameEn": "Sawk",
    "type": "fighting",
    "baseStats": {
      "hp": 75,
      "atk": 125,
      "def": 75,
      "spa": 30,
      "spd": 75,
      "spe": 85
    },
    "abilities": [
      "sturdy",
      "innerfocus",
      "moldbreaker"
    ]
  },
  {
    "id": "sewaddle",
    "name": "\u30AF\u30EB\u30DF\u30EB",
    "nameEn": "Sewaddle",
    "type": "bug",
    "type2": "grass",
    "baseStats": {
      "hp": 45,
      "atk": 53,
      "def": 70,
      "spa": 40,
      "spd": 60,
      "spe": 42
    },
    "abilities": [
      "swarm",
      "chlorophyll",
      "overcoat"
    ]
  },
  {
    "id": "swadloon",
    "name": "\u30AF\u30EB\u30DE\u30E6",
    "nameEn": "Swadloon",
    "type": "bug",
    "type2": "grass",
    "baseStats": {
      "hp": 55,
      "atk": 63,
      "def": 90,
      "spa": 50,
      "spd": 80,
      "spe": 42
    },
    "abilities": [
      "leafguard",
      "chlorophyll",
      "overcoat"
    ]
  },
  {
    "id": "leavanny",
    "name": "\u30CF\u30CF\u30B3\u30E2\u30EA",
    "nameEn": "Leavanny",
    "type": "bug",
    "type2": "grass",
    "baseStats": {
      "hp": 75,
      "atk": 103,
      "def": 80,
      "spa": 70,
      "spd": 80,
      "spe": 92
    },
    "abilities": [
      "swarm",
      "chlorophyll",
      "overcoat"
    ]
  },
  {
    "id": "venipede",
    "name": "\u30D5\u30B7\u30C7",
    "nameEn": "Venipede",
    "type": "bug",
    "type2": "poison",
    "baseStats": {
      "hp": 30,
      "atk": 45,
      "def": 59,
      "spa": 30,
      "spd": 39,
      "spe": 57
    },
    "abilities": [
      "poisonpoint",
      "swarm",
      "speedboost"
    ]
  },
  {
    "id": "whirlipede",
    "name": "\u30DB\u30A4\u30FC\u30AC",
    "nameEn": "Whirlipede",
    "type": "bug",
    "type2": "poison",
    "baseStats": {
      "hp": 40,
      "atk": 55,
      "def": 99,
      "spa": 40,
      "spd": 79,
      "spe": 47
    },
    "abilities": [
      "poisonpoint",
      "swarm",
      "speedboost"
    ]
  },
  {
    "id": "scolipede",
    "name": "\u30DA\u30F3\u30C9\u30E9\u30FC",
    "nameEn": "Scolipede",
    "type": "bug",
    "type2": "poison",
    "baseStats": {
      "hp": 60,
      "atk": 100,
      "def": 89,
      "spa": 55,
      "spd": 69,
      "spe": 112
    },
    "abilities": [
      "poisonpoint",
      "swarm",
      "speedboost"
    ]
  },
  {
    "id": "cottonee",
    "name": "\u30E2\u30F3\u30E1\u30F3",
    "nameEn": "Cottonee",
    "type": "grass",
    "type2": "fairy",
    "baseStats": {
      "hp": 40,
      "atk": 27,
      "def": 60,
      "spa": 37,
      "spd": 50,
      "spe": 66
    },
    "abilities": [
      "prankster",
      "infiltrator",
      "chlorophyll"
    ]
  },
  {
    "id": "whimsicott",
    "name": "\u30A8\u30EB\u30D5\u30FC\u30F3",
    "nameEn": "Whimsicott",
    "type": "grass",
    "type2": "fairy",
    "baseStats": {
      "hp": 60,
      "atk": 67,
      "def": 85,
      "spa": 77,
      "spd": 75,
      "spe": 116
    },
    "abilities": [
      "prankster",
      "infiltrator",
      "chlorophyll"
    ]
  },
  {
    "id": "petilil",
    "name": "\u30C1\u30E5\u30EA\u30CD",
    "nameEn": "Petilil",
    "type": "grass",
    "baseStats": {
      "hp": 45,
      "atk": 35,
      "def": 50,
      "spa": 70,
      "spd": 50,
      "spe": 30
    },
    "abilities": [
      "chlorophyll",
      "owntempo",
      "leafguard"
    ]
  },
  {
    "id": "lilligant",
    "name": "\u30C9\u30EC\u30C7\u30A3\u30A2",
    "nameEn": "Lilligant",
    "type": "grass",
    "baseStats": {
      "hp": 70,
      "atk": 60,
      "def": 75,
      "spa": 110,
      "spd": 75,
      "spe": 90
    },
    "abilities": [
      "chlorophyll",
      "owntempo",
      "leafguard"
    ]
  },
  {
    "id": "basculin",
    "name": "\u30D0\u30B9\u30E9\u30AA",
    "nameEn": "Basculin",
    "type": "water",
    "baseStats": {
      "hp": 70,
      "atk": 92,
      "def": 65,
      "spa": 80,
      "spd": 55,
      "spe": 98
    },
    "abilities": [
      "reckless",
      "adaptability",
      "moldbreaker"
    ]
  },
  {
    "id": "sandile",
    "name": "\u30E1\u30B0\u30ED\u30B3",
    "nameEn": "Sandile",
    "type": "ground",
    "type2": "dark",
    "baseStats": {
      "hp": 50,
      "atk": 72,
      "def": 35,
      "spa": 35,
      "spd": 35,
      "spe": 65
    },
    "abilities": [
      "intimidate",
      "moxie",
      "angerpoint"
    ]
  },
  {
    "id": "krokorok",
    "name": "\u30EF\u30EB\u30D3\u30EB",
    "nameEn": "Krokorok",
    "type": "ground",
    "type2": "dark",
    "baseStats": {
      "hp": 60,
      "atk": 82,
      "def": 45,
      "spa": 45,
      "spd": 45,
      "spe": 74
    },
    "abilities": [
      "intimidate",
      "moxie",
      "angerpoint"
    ]
  },
  {
    "id": "krookodile",
    "name": "\u30EF\u30EB\u30D3\u30A2\u30EB",
    "nameEn": "Krookodile",
    "type": "ground",
    "type2": "dark",
    "baseStats": {
      "hp": 95,
      "atk": 117,
      "def": 80,
      "spa": 65,
      "spd": 70,
      "spe": 92
    },
    "abilities": [
      "intimidate",
      "moxie",
      "angerpoint"
    ]
  },
  {
    "id": "darumaka",
    "name": "\u30C0\u30EB\u30DE\u30C3\u30AB",
    "nameEn": "Darumaka",
    "type": "fire",
    "baseStats": {
      "hp": 70,
      "atk": 90,
      "def": 45,
      "spa": 15,
      "spd": 45,
      "spe": 50
    },
    "abilities": [
      "hustle",
      "innerfocus"
    ]
  },
  {
    "id": "darmanitan",
    "name": "\u30D2\u30D2\u30C0\u30EB\u30DE",
    "nameEn": "Darmanitan",
    "type": "fire",
    "baseStats": {
      "hp": 105,
      "atk": 140,
      "def": 55,
      "spa": 30,
      "spd": 55,
      "spe": 95
    },
    "abilities": [
      "sheerforce",
      "zenmode"
    ]
  },
  {
    "id": "maractus",
    "name": "\u30DE\u30E9\u30AB\u30C3\u30C1",
    "nameEn": "Maractus",
    "type": "grass",
    "baseStats": {
      "hp": 75,
      "atk": 86,
      "def": 67,
      "spa": 106,
      "spd": 67,
      "spe": 60
    },
    "abilities": [
      "waterabsorb",
      "chlorophyll",
      "stormdrain"
    ]
  },
  {
    "id": "dwebble",
    "name": "\u30A4\u30B7\u30BA\u30DE\u30A4",
    "nameEn": "Dwebble",
    "type": "bug",
    "type2": "rock",
    "baseStats": {
      "hp": 50,
      "atk": 65,
      "def": 85,
      "spa": 35,
      "spd": 35,
      "spe": 55
    },
    "abilities": [
      "sturdy",
      "shellarmor",
      "weakarmor"
    ]
  },
  {
    "id": "crustle",
    "name": "\u30A4\u30EF\u30D1\u30EC\u30B9",
    "nameEn": "Crustle",
    "type": "bug",
    "type2": "rock",
    "baseStats": {
      "hp": 70,
      "atk": 105,
      "def": 125,
      "spa": 65,
      "spd": 75,
      "spe": 45
    },
    "abilities": [
      "sturdy",
      "shellarmor",
      "weakarmor"
    ]
  },
  {
    "id": "scraggy",
    "name": "\u30BA\u30EB\u30C3\u30B0",
    "nameEn": "Scraggy",
    "type": "dark",
    "type2": "fighting",
    "baseStats": {
      "hp": 50,
      "atk": 75,
      "def": 70,
      "spa": 35,
      "spd": 70,
      "spe": 48
    },
    "abilities": [
      "shedskin",
      "moxie",
      "intimidate"
    ]
  },
  {
    "id": "scrafty",
    "name": "\u30BA\u30EB\u30BA\u30AD\u30F3",
    "nameEn": "Scrafty",
    "type": "dark",
    "type2": "fighting",
    "baseStats": {
      "hp": 65,
      "atk": 90,
      "def": 115,
      "spa": 45,
      "spd": 115,
      "spe": 58
    },
    "abilities": [
      "shedskin",
      "moxie",
      "intimidate"
    ]
  },
  {
    "id": "sigilyph",
    "name": "\u30B7\u30F3\u30DC\u30E9\u30FC",
    "nameEn": "Sigilyph",
    "type": "psychic",
    "type2": "flying",
    "baseStats": {
      "hp": 72,
      "atk": 58,
      "def": 80,
      "spa": 103,
      "spd": 80,
      "spe": 97
    },
    "abilities": [
      "wonderskin",
      "magicguard",
      "tintedlens"
    ]
  },
  {
    "id": "yamask",
    "name": "\u30C7\u30B9\u30DE\u30B9",
    "nameEn": "Yamask",
    "type": "ghost",
    "baseStats": {
      "hp": 38,
      "atk": 30,
      "def": 85,
      "spa": 55,
      "spd": 65,
      "spe": 30
    },
    "abilities": [
      "mummy"
    ]
  },
  {
    "id": "cofagrigus",
    "name": "\u30C7\u30B9\u30AB\u30FC\u30F3",
    "nameEn": "Cofagrigus",
    "type": "ghost",
    "baseStats": {
      "hp": 58,
      "atk": 50,
      "def": 145,
      "spa": 95,
      "spd": 105,
      "spe": 30
    },
    "abilities": [
      "mummy"
    ]
  },
  {
    "id": "tirtouga",
    "name": "\u30D7\u30ED\u30C8\u30FC\u30AC",
    "nameEn": "Tirtouga",
    "type": "water",
    "type2": "rock",
    "baseStats": {
      "hp": 54,
      "atk": 78,
      "def": 103,
      "spa": 53,
      "spd": 45,
      "spe": 22
    },
    "abilities": [
      "solidrock",
      "sturdy",
      "swiftswim"
    ]
  },
  {
    "id": "carracosta",
    "name": "\u30A2\u30D0\u30B4\u30FC\u30E9",
    "nameEn": "Carracosta",
    "type": "water",
    "type2": "rock",
    "baseStats": {
      "hp": 74,
      "atk": 108,
      "def": 133,
      "spa": 83,
      "spd": 65,
      "spe": 32
    },
    "abilities": [
      "solidrock",
      "sturdy",
      "swiftswim"
    ]
  },
  {
    "id": "archen",
    "name": "\u30A2\u30FC\u30B1\u30F3",
    "nameEn": "Archen",
    "type": "rock",
    "type2": "flying",
    "baseStats": {
      "hp": 55,
      "atk": 112,
      "def": 45,
      "spa": 74,
      "spd": 45,
      "spe": 70
    },
    "abilities": [
      "defeatist"
    ]
  },
  {
    "id": "archeops",
    "name": "\u30A2\u30FC\u30B1\u30AA\u30B9",
    "nameEn": "Archeops",
    "type": "rock",
    "type2": "flying",
    "baseStats": {
      "hp": 75,
      "atk": 140,
      "def": 65,
      "spa": 112,
      "spd": 65,
      "spe": 110
    },
    "abilities": [
      "defeatist"
    ]
  },
  {
    "id": "trubbish",
    "name": "\u30E4\u30D6\u30AF\u30ED\u30F3",
    "nameEn": "Trubbish",
    "type": "poison",
    "baseStats": {
      "hp": 50,
      "atk": 50,
      "def": 62,
      "spa": 40,
      "spd": 62,
      "spe": 65
    },
    "abilities": [
      "stench",
      "stickyhold",
      "aftermath"
    ]
  },
  {
    "id": "garbodor",
    "name": "\u30C0\u30B9\u30C8\u30C0\u30B9",
    "nameEn": "Garbodor",
    "type": "poison",
    "baseStats": {
      "hp": 80,
      "atk": 95,
      "def": 82,
      "spa": 60,
      "spd": 82,
      "spe": 75
    },
    "abilities": [
      "stench",
      "weakarmor",
      "aftermath"
    ]
  },
  {
    "id": "zorua",
    "name": "\u30BE\u30ED\u30A2",
    "nameEn": "Zorua",
    "type": "dark",
    "baseStats": {
      "hp": 40,
      "atk": 65,
      "def": 40,
      "spa": 80,
      "spd": 40,
      "spe": 65
    },
    "abilities": [
      "illusion"
    ]
  },
  {
    "id": "zoroark",
    "name": "\u30BE\u30ED\u30A2\u30FC\u30AF",
    "nameEn": "Zoroark",
    "type": "dark",
    "baseStats": {
      "hp": 60,
      "atk": 105,
      "def": 60,
      "spa": 120,
      "spd": 60,
      "spe": 105
    },
    "abilities": [
      "illusion"
    ]
  },
  {
    "id": "minccino",
    "name": "\u30C1\u30E9\u30FC\u30DF\u30A3",
    "nameEn": "Minccino",
    "type": "normal",
    "baseStats": {
      "hp": 55,
      "atk": 50,
      "def": 40,
      "spa": 40,
      "spd": 40,
      "spe": 75
    },
    "abilities": [
      "cutecharm",
      "technician",
      "skilllink"
    ]
  },
  {
    "id": "cinccino",
    "name": "\u30C1\u30E9\u30C1\u30FC\u30CE",
    "nameEn": "Cinccino",
    "type": "normal",
    "baseStats": {
      "hp": 75,
      "atk": 95,
      "def": 60,
      "spa": 65,
      "spd": 60,
      "spe": 115
    },
    "abilities": [
      "cutecharm",
      "technician",
      "skilllink"
    ]
  },
  {
    "id": "gothita",
    "name": "\u30B4\u30C1\u30E0",
    "nameEn": "Gothita",
    "type": "psychic",
    "baseStats": {
      "hp": 45,
      "atk": 30,
      "def": 50,
      "spa": 55,
      "spd": 65,
      "spe": 45
    },
    "abilities": [
      "frisk",
      "competitive",
      "shadowtag"
    ]
  },
  {
    "id": "gothorita",
    "name": "\u30B4\u30C1\u30DF\u30EB",
    "nameEn": "Gothorita",
    "type": "psychic",
    "baseStats": {
      "hp": 60,
      "atk": 45,
      "def": 70,
      "spa": 75,
      "spd": 85,
      "spe": 55
    },
    "abilities": [
      "frisk",
      "competitive",
      "shadowtag"
    ]
  },
  {
    "id": "gothitelle",
    "name": "\u30B4\u30C1\u30EB\u30BC\u30EB",
    "nameEn": "Gothitelle",
    "type": "psychic",
    "baseStats": {
      "hp": 70,
      "atk": 55,
      "def": 95,
      "spa": 95,
      "spd": 110,
      "spe": 65
    },
    "abilities": [
      "frisk",
      "competitive",
      "shadowtag"
    ]
  },
  {
    "id": "solosis",
    "name": "\u30E6\u30CB\u30E9\u30F3",
    "nameEn": "Solosis",
    "type": "psychic",
    "baseStats": {
      "hp": 45,
      "atk": 30,
      "def": 40,
      "spa": 105,
      "spd": 50,
      "spe": 20
    },
    "abilities": [
      "overcoat",
      "magicguard",
      "regenerator"
    ]
  },
  {
    "id": "duosion",
    "name": "\u30C0\u30D6\u30E9\u30F3",
    "nameEn": "Duosion",
    "type": "psychic",
    "baseStats": {
      "hp": 65,
      "atk": 40,
      "def": 50,
      "spa": 125,
      "spd": 60,
      "spe": 30
    },
    "abilities": [
      "overcoat",
      "magicguard",
      "regenerator"
    ]
  },
  {
    "id": "reuniclus",
    "name": "\u30E9\u30F3\u30AF\u30EB\u30B9",
    "nameEn": "Reuniclus",
    "type": "psychic",
    "baseStats": {
      "hp": 110,
      "atk": 65,
      "def": 75,
      "spa": 125,
      "spd": 85,
      "spe": 30
    },
    "abilities": [
      "overcoat",
      "magicguard",
      "regenerator"
    ]
  },
  {
    "id": "ducklett",
    "name": "\u30B3\u30A2\u30EB\u30D2\u30FC",
    "nameEn": "Ducklett",
    "type": "water",
    "type2": "flying",
    "baseStats": {
      "hp": 62,
      "atk": 44,
      "def": 50,
      "spa": 44,
      "spd": 50,
      "spe": 55
    },
    "abilities": [
      "keeneye",
      "bigpecks",
      "hydration"
    ]
  },
  {
    "id": "swanna",
    "name": "\u30B9\u30EF\u30F3\u30CA",
    "nameEn": "Swanna",
    "type": "water",
    "type2": "flying",
    "baseStats": {
      "hp": 75,
      "atk": 87,
      "def": 63,
      "spa": 87,
      "spd": 63,
      "spe": 98
    },
    "abilities": [
      "keeneye",
      "bigpecks",
      "hydration"
    ]
  },
  {
    "id": "vanillite",
    "name": "\u30D0\u30CB\u30D7\u30C3\u30C1",
    "nameEn": "Vanillite",
    "type": "ice",
    "baseStats": {
      "hp": 36,
      "atk": 50,
      "def": 50,
      "spa": 65,
      "spd": 60,
      "spe": 44
    },
    "abilities": [
      "icebody",
      "snowcloak",
      "weakarmor"
    ]
  },
  {
    "id": "vanillish",
    "name": "\u30D0\u30CB\u30EA\u30C3\u30C1",
    "nameEn": "Vanillish",
    "type": "ice",
    "baseStats": {
      "hp": 51,
      "atk": 65,
      "def": 65,
      "spa": 80,
      "spd": 75,
      "spe": 59
    },
    "abilities": [
      "icebody",
      "snowcloak",
      "weakarmor"
    ]
  },
  {
    "id": "vanilluxe",
    "name": "\u30D0\u30A4\u30D0\u30CB\u30E9",
    "nameEn": "Vanilluxe",
    "type": "ice",
    "baseStats": {
      "hp": 71,
      "atk": 95,
      "def": 85,
      "spa": 110,
      "spd": 95,
      "spe": 79
    },
    "abilities": [
      "icebody",
      "snowwarning",
      "weakarmor"
    ]
  },
  {
    "id": "deerling",
    "name": "\u30B7\u30AD\u30B8\u30AB",
    "nameEn": "Deerling",
    "type": "normal",
    "type2": "grass",
    "baseStats": {
      "hp": 60,
      "atk": 60,
      "def": 50,
      "spa": 40,
      "spd": 50,
      "spe": 75
    },
    "abilities": [
      "chlorophyll",
      "sapsipper",
      "serenegrace"
    ]
  },
  {
    "id": "sawsbuck",
    "name": "\u30E1\u30D6\u30AD\u30B8\u30AB",
    "nameEn": "Sawsbuck",
    "type": "normal",
    "type2": "grass",
    "baseStats": {
      "hp": 80,
      "atk": 100,
      "def": 70,
      "spa": 60,
      "spd": 70,
      "spe": 95
    },
    "abilities": [
      "chlorophyll",
      "sapsipper",
      "serenegrace"
    ]
  },
  {
    "id": "emolga",
    "name": "\u30A8\u30E2\u30F3\u30AC",
    "nameEn": "Emolga",
    "type": "electric",
    "type2": "flying",
    "baseStats": {
      "hp": 55,
      "atk": 75,
      "def": 60,
      "spa": 75,
      "spd": 60,
      "spe": 103
    },
    "abilities": [
      "static",
      "motordrive"
    ]
  },
  {
    "id": "karrablast",
    "name": "\u30AB\u30D6\u30EB\u30E2",
    "nameEn": "Karrablast",
    "type": "bug",
    "baseStats": {
      "hp": 50,
      "atk": 75,
      "def": 45,
      "spa": 40,
      "spd": 45,
      "spe": 60
    },
    "abilities": [
      "swarm",
      "shedskin",
      "noguard"
    ]
  },
  {
    "id": "escavalier",
    "name": "\u30B7\u30E5\u30D0\u30EB\u30B4",
    "nameEn": "Escavalier",
    "type": "bug",
    "type2": "steel",
    "baseStats": {
      "hp": 70,
      "atk": 135,
      "def": 105,
      "spa": 60,
      "spd": 105,
      "spe": 20
    },
    "abilities": [
      "swarm",
      "shellarmor",
      "overcoat"
    ]
  },
  {
    "id": "foongus",
    "name": "\u30BF\u30DE\u30B2\u30BF\u30B1",
    "nameEn": "Foongus",
    "type": "grass",
    "type2": "poison",
    "baseStats": {
      "hp": 69,
      "atk": 55,
      "def": 45,
      "spa": 55,
      "spd": 55,
      "spe": 15
    },
    "abilities": [
      "effectspore",
      "regenerator"
    ]
  },
  {
    "id": "amoonguss",
    "name": "\u30E2\u30ED\u30D0\u30EC\u30EB",
    "nameEn": "Amoonguss",
    "type": "grass",
    "type2": "poison",
    "baseStats": {
      "hp": 114,
      "atk": 85,
      "def": 70,
      "spa": 85,
      "spd": 80,
      "spe": 30
    },
    "abilities": [
      "effectspore",
      "regenerator"
    ]
  },
  {
    "id": "frillish",
    "name": "\u30D7\u30EB\u30EA\u30EB",
    "nameEn": "Frillish",
    "type": "water",
    "type2": "ghost",
    "baseStats": {
      "hp": 55,
      "atk": 40,
      "def": 50,
      "spa": 65,
      "spd": 85,
      "spe": 40
    },
    "abilities": [
      "waterabsorb",
      "cursedbody",
      "damp"
    ]
  },
  {
    "id": "jellicent",
    "name": "\u30D6\u30EB\u30F3\u30B2\u30EB",
    "nameEn": "Jellicent",
    "type": "water",
    "type2": "ghost",
    "baseStats": {
      "hp": 100,
      "atk": 60,
      "def": 70,
      "spa": 85,
      "spd": 105,
      "spe": 60
    },
    "abilities": [
      "waterabsorb",
      "cursedbody",
      "damp"
    ]
  },
  {
    "id": "alomomola",
    "name": "\u30DE\u30DE\u30F3\u30DC\u30A6",
    "nameEn": "Alomomola",
    "type": "water",
    "baseStats": {
      "hp": 165,
      "atk": 75,
      "def": 80,
      "spa": 40,
      "spd": 45,
      "spe": 65
    },
    "abilities": [
      "healer",
      "hydration",
      "regenerator"
    ]
  },
  {
    "id": "joltik",
    "name": "\u30D0\u30C1\u30E5\u30EB",
    "nameEn": "Joltik",
    "type": "bug",
    "type2": "electric",
    "baseStats": {
      "hp": 50,
      "atk": 47,
      "def": 50,
      "spa": 57,
      "spd": 50,
      "spe": 65
    },
    "abilities": [
      "compoundeyes",
      "unnerve",
      "swarm"
    ]
  },
  {
    "id": "galvantula",
    "name": "\u30C7\u30F3\u30C1\u30E5\u30E9",
    "nameEn": "Galvantula",
    "type": "bug",
    "type2": "electric",
    "baseStats": {
      "hp": 70,
      "atk": 77,
      "def": 60,
      "spa": 97,
      "spd": 60,
      "spe": 108
    },
    "abilities": [
      "compoundeyes",
      "unnerve",
      "swarm"
    ]
  },
  {
    "id": "ferroseed",
    "name": "\u30C6\u30C3\u30B7\u30FC\u30C9",
    "nameEn": "Ferroseed",
    "type": "grass",
    "type2": "steel",
    "baseStats": {
      "hp": 44,
      "atk": 50,
      "def": 91,
      "spa": 24,
      "spd": 86,
      "spe": 10
    },
    "abilities": [
      "ironbarbs"
    ]
  },
  {
    "id": "ferrothorn",
    "name": "\u30CA\u30C3\u30C8\u30EC\u30A4",
    "nameEn": "Ferrothorn",
    "type": "grass",
    "type2": "steel",
    "baseStats": {
      "hp": 74,
      "atk": 94,
      "def": 131,
      "spa": 54,
      "spd": 116,
      "spe": 20
    },
    "abilities": [
      "ironbarbs",
      "anticipation"
    ]
  },
  {
    "id": "klink",
    "name": "\u30AE\u30A2\u30EB",
    "nameEn": "Klink",
    "type": "steel",
    "baseStats": {
      "hp": 40,
      "atk": 55,
      "def": 70,
      "spa": 45,
      "spd": 60,
      "spe": 30
    },
    "abilities": [
      "plus",
      "minus",
      "clearbody"
    ]
  },
  {
    "id": "klang",
    "name": "\u30AE\u30AE\u30A2\u30EB",
    "nameEn": "Klang",
    "type": "steel",
    "baseStats": {
      "hp": 60,
      "atk": 80,
      "def": 95,
      "spa": 70,
      "spd": 85,
      "spe": 50
    },
    "abilities": [
      "plus",
      "minus",
      "clearbody"
    ]
  },
  {
    "id": "klinklang",
    "name": "\u30AE\u30AE\u30AE\u30A2\u30EB",
    "nameEn": "Klinklang",
    "type": "steel",
    "baseStats": {
      "hp": 60,
      "atk": 100,
      "def": 115,
      "spa": 70,
      "spd": 85,
      "spe": 90
    },
    "abilities": [
      "plus",
      "minus",
      "clearbody"
    ]
  },
  {
    "id": "tynamo",
    "name": "\u30B7\u30D3\u30B7\u30E9\u30B9",
    "nameEn": "Tynamo",
    "type": "electric",
    "baseStats": {
      "hp": 35,
      "atk": 55,
      "def": 40,
      "spa": 45,
      "spd": 40,
      "spe": 60
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "eelektrik",
    "name": "\u30B7\u30D3\u30D3\u30FC\u30EB",
    "nameEn": "Eelektrik",
    "type": "electric",
    "baseStats": {
      "hp": 65,
      "atk": 85,
      "def": 70,
      "spa": 75,
      "spd": 70,
      "spe": 40
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "eelektross",
    "name": "\u30B7\u30D3\u30EB\u30C9\u30F3",
    "nameEn": "Eelektross",
    "type": "electric",
    "baseStats": {
      "hp": 85,
      "atk": 115,
      "def": 80,
      "spa": 105,
      "spd": 80,
      "spe": 50
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "elgyem",
    "name": "\u30EA\u30B0\u30EC\u30FC",
    "nameEn": "Elgyem",
    "type": "psychic",
    "baseStats": {
      "hp": 55,
      "atk": 55,
      "def": 55,
      "spa": 85,
      "spd": 55,
      "spe": 30
    },
    "abilities": [
      "telepathy",
      "synchronize",
      "analytic"
    ]
  },
  {
    "id": "beheeyem",
    "name": "\u30AA\u30FC\u30D9\u30E0",
    "nameEn": "Beheeyem",
    "type": "psychic",
    "baseStats": {
      "hp": 75,
      "atk": 75,
      "def": 75,
      "spa": 125,
      "spd": 95,
      "spe": 40
    },
    "abilities": [
      "telepathy",
      "synchronize",
      "analytic"
    ]
  },
  {
    "id": "litwick",
    "name": "\u30D2\u30C8\u30E2\u30B7",
    "nameEn": "Litwick",
    "type": "ghost",
    "type2": "fire",
    "baseStats": {
      "hp": 50,
      "atk": 30,
      "def": 55,
      "spa": 65,
      "spd": 55,
      "spe": 20
    },
    "abilities": [
      "flashfire",
      "flamebody",
      "infiltrator"
    ]
  },
  {
    "id": "lampent",
    "name": "\u30E9\u30F3\u30D7\u30E9\u30FC",
    "nameEn": "Lampent",
    "type": "ghost",
    "type2": "fire",
    "baseStats": {
      "hp": 60,
      "atk": 40,
      "def": 60,
      "spa": 95,
      "spd": 60,
      "spe": 55
    },
    "abilities": [
      "flashfire",
      "flamebody",
      "infiltrator"
    ]
  },
  {
    "id": "chandelure",
    "name": "\u30B7\u30E3\u30F3\u30C7\u30E9",
    "nameEn": "Chandelure",
    "type": "ghost",
    "type2": "fire",
    "baseStats": {
      "hp": 60,
      "atk": 55,
      "def": 90,
      "spa": 145,
      "spd": 90,
      "spe": 80
    },
    "abilities": [
      "flashfire",
      "flamebody",
      "infiltrator"
    ]
  },
  {
    "id": "axew",
    "name": "\u30AD\u30D0\u30B4",
    "nameEn": "Axew",
    "type": "dragon",
    "baseStats": {
      "hp": 46,
      "atk": 87,
      "def": 60,
      "spa": 30,
      "spd": 40,
      "spe": 57
    },
    "abilities": [
      "rivalry",
      "moldbreaker",
      "unnerve"
    ]
  },
  {
    "id": "fraxure",
    "name": "\u30AA\u30CE\u30F3\u30C9",
    "nameEn": "Fraxure",
    "type": "dragon",
    "baseStats": {
      "hp": 66,
      "atk": 117,
      "def": 70,
      "spa": 40,
      "spd": 50,
      "spe": 67
    },
    "abilities": [
      "rivalry",
      "moldbreaker",
      "unnerve"
    ]
  },
  {
    "id": "haxorus",
    "name": "\u30AA\u30CE\u30CE\u30AF\u30B9",
    "nameEn": "Haxorus",
    "type": "dragon",
    "baseStats": {
      "hp": 76,
      "atk": 147,
      "def": 90,
      "spa": 60,
      "spd": 70,
      "spe": 97
    },
    "abilities": [
      "rivalry",
      "moldbreaker",
      "unnerve"
    ]
  },
  {
    "id": "cubchoo",
    "name": "\u30AF\u30DE\u30B7\u30E5\u30F3",
    "nameEn": "Cubchoo",
    "type": "ice",
    "baseStats": {
      "hp": 55,
      "atk": 70,
      "def": 40,
      "spa": 60,
      "spd": 40,
      "spe": 40
    },
    "abilities": [
      "snowcloak",
      "slushrush",
      "rattled"
    ]
  },
  {
    "id": "beartic",
    "name": "\u30C4\u30F3\u30D9\u30A2\u30FC",
    "nameEn": "Beartic",
    "type": "ice",
    "baseStats": {
      "hp": 95,
      "atk": 130,
      "def": 80,
      "spa": 70,
      "spd": 80,
      "spe": 50
    },
    "abilities": [
      "snowcloak",
      "slushrush",
      "swiftswim"
    ]
  },
  {
    "id": "cryogonal",
    "name": "\u30D5\u30EA\u30FC\u30B8\u30AA",
    "nameEn": "Cryogonal",
    "type": "ice",
    "baseStats": {
      "hp": 80,
      "atk": 50,
      "def": 50,
      "spa": 95,
      "spd": 135,
      "spe": 105
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "shelmet",
    "name": "\u30C1\u30E7\u30DC\u30DE\u30AD",
    "nameEn": "Shelmet",
    "type": "bug",
    "baseStats": {
      "hp": 50,
      "atk": 40,
      "def": 85,
      "spa": 40,
      "spd": 65,
      "spe": 25
    },
    "abilities": [
      "hydration",
      "shellarmor",
      "overcoat"
    ]
  },
  {
    "id": "accelgor",
    "name": "\u30A2\u30AE\u30EB\u30C0\u30FC",
    "nameEn": "Accelgor",
    "type": "bug",
    "baseStats": {
      "hp": 80,
      "atk": 70,
      "def": 40,
      "spa": 100,
      "spd": 60,
      "spe": 145
    },
    "abilities": [
      "hydration",
      "stickyhold",
      "unburden"
    ]
  },
  {
    "id": "stunfisk",
    "name": "\u30DE\u30C3\u30AE\u30E7",
    "nameEn": "Stunfisk",
    "type": "ground",
    "type2": "electric",
    "baseStats": {
      "hp": 109,
      "atk": 66,
      "def": 84,
      "spa": 81,
      "spd": 99,
      "spe": 32
    },
    "abilities": [
      "static",
      "limber",
      "sandveil"
    ]
  },
  {
    "id": "mienfoo",
    "name": "\u30B3\u30B8\u30E7\u30D5\u30FC",
    "nameEn": "Mienfoo",
    "type": "fighting",
    "baseStats": {
      "hp": 45,
      "atk": 85,
      "def": 50,
      "spa": 55,
      "spd": 50,
      "spe": 65
    },
    "abilities": [
      "innerfocus",
      "regenerator",
      "reckless"
    ]
  },
  {
    "id": "mienshao",
    "name": "\u30B3\u30B8\u30E7\u30F3\u30C9",
    "nameEn": "Mienshao",
    "type": "fighting",
    "baseStats": {
      "hp": 65,
      "atk": 125,
      "def": 60,
      "spa": 95,
      "spd": 60,
      "spe": 105
    },
    "abilities": [
      "innerfocus",
      "regenerator",
      "reckless"
    ]
  },
  {
    "id": "druddigon",
    "name": "\u30AF\u30EA\u30E0\u30AC\u30F3",
    "nameEn": "Druddigon",
    "type": "dragon",
    "baseStats": {
      "hp": 77,
      "atk": 120,
      "def": 90,
      "spa": 60,
      "spd": 90,
      "spe": 48
    },
    "abilities": [
      "roughskin",
      "sheerforce",
      "moldbreaker"
    ]
  },
  {
    "id": "golett",
    "name": "\u30B4\u30D3\u30C3\u30C8",
    "nameEn": "Golett",
    "type": "ground",
    "type2": "ghost",
    "baseStats": {
      "hp": 59,
      "atk": 74,
      "def": 50,
      "spa": 35,
      "spd": 50,
      "spe": 35
    },
    "abilities": [
      "ironfist",
      "klutz",
      "noguard"
    ]
  },
  {
    "id": "golurk",
    "name": "\u30B4\u30EB\u30FC\u30B0",
    "nameEn": "Golurk",
    "type": "ground",
    "type2": "ghost",
    "baseStats": {
      "hp": 89,
      "atk": 124,
      "def": 80,
      "spa": 55,
      "spd": 80,
      "spe": 55
    },
    "abilities": [
      "ironfist",
      "klutz",
      "noguard"
    ]
  },
  {
    "id": "pawniard",
    "name": "\u30B3\u30DE\u30BF\u30CA",
    "nameEn": "Pawniard",
    "type": "dark",
    "type2": "steel",
    "baseStats": {
      "hp": 45,
      "atk": 85,
      "def": 70,
      "spa": 40,
      "spd": 40,
      "spe": 60
    },
    "abilities": [
      "defiant",
      "innerfocus",
      "pressure"
    ]
  },
  {
    "id": "bisharp",
    "name": "\u30AD\u30EA\u30AD\u30B6\u30F3",
    "nameEn": "Bisharp",
    "type": "dark",
    "type2": "steel",
    "baseStats": {
      "hp": 65,
      "atk": 125,
      "def": 100,
      "spa": 60,
      "spd": 70,
      "spe": 70
    },
    "abilities": [
      "defiant",
      "innerfocus",
      "pressure"
    ]
  },
  {
    "id": "bouffalant",
    "name": "\u30D0\u30C3\u30D5\u30ED\u30F3",
    "nameEn": "Bouffalant",
    "type": "normal",
    "baseStats": {
      "hp": 95,
      "atk": 110,
      "def": 95,
      "spa": 40,
      "spd": 95,
      "spe": 55
    },
    "abilities": [
      "reckless",
      "sapsipper",
      "soundproof"
    ]
  },
  {
    "id": "rufflet",
    "name": "\u30EF\u30B7\u30DC\u30F3",
    "nameEn": "Rufflet",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 70,
      "atk": 83,
      "def": 50,
      "spa": 37,
      "spd": 50,
      "spe": 60
    },
    "abilities": [
      "keeneye",
      "sheerforce",
      "hustle"
    ]
  },
  {
    "id": "braviary",
    "name": "\u30A6\u30A9\u30FC\u30B0\u30EB",
    "nameEn": "Braviary",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 100,
      "atk": 123,
      "def": 75,
      "spa": 57,
      "spd": 75,
      "spe": 80
    },
    "abilities": [
      "keeneye",
      "sheerforce",
      "defiant"
    ]
  },
  {
    "id": "vullaby",
    "name": "\u30D0\u30EB\u30C1\u30E3\u30A4",
    "nameEn": "Vullaby",
    "type": "dark",
    "type2": "flying",
    "baseStats": {
      "hp": 70,
      "atk": 55,
      "def": 75,
      "spa": 45,
      "spd": 65,
      "spe": 60
    },
    "abilities": [
      "bigpecks",
      "overcoat",
      "weakarmor"
    ]
  },
  {
    "id": "mandibuzz",
    "name": "\u30D0\u30EB\u30B8\u30FC\u30CA",
    "nameEn": "Mandibuzz",
    "type": "dark",
    "type2": "flying",
    "baseStats": {
      "hp": 110,
      "atk": 65,
      "def": 105,
      "spa": 55,
      "spd": 95,
      "spe": 80
    },
    "abilities": [
      "bigpecks",
      "overcoat",
      "weakarmor"
    ]
  },
  {
    "id": "heatmor",
    "name": "\u30AF\u30A4\u30BF\u30E9\u30F3",
    "nameEn": "Heatmor",
    "type": "fire",
    "baseStats": {
      "hp": 85,
      "atk": 97,
      "def": 66,
      "spa": 105,
      "spd": 66,
      "spe": 65
    },
    "abilities": [
      "gluttony",
      "flashfire",
      "whitesmoke"
    ]
  },
  {
    "id": "durant",
    "name": "\u30A2\u30A4\u30A2\u30F3\u30C8",
    "nameEn": "Durant",
    "type": "bug",
    "type2": "steel",
    "baseStats": {
      "hp": 58,
      "atk": 109,
      "def": 112,
      "spa": 48,
      "spd": 48,
      "spe": 109
    },
    "abilities": [
      "swarm",
      "hustle",
      "truant"
    ]
  },
  {
    "id": "deino",
    "name": "\u30E2\u30CE\u30BA",
    "nameEn": "Deino",
    "type": "dark",
    "type2": "dragon",
    "baseStats": {
      "hp": 52,
      "atk": 65,
      "def": 50,
      "spa": 45,
      "spd": 50,
      "spe": 38
    },
    "abilities": [
      "hustle"
    ]
  },
  {
    "id": "zweilous",
    "name": "\u30B8\u30D8\u30C3\u30C9",
    "nameEn": "Zweilous",
    "type": "dark",
    "type2": "dragon",
    "baseStats": {
      "hp": 72,
      "atk": 85,
      "def": 70,
      "spa": 65,
      "spd": 70,
      "spe": 58
    },
    "abilities": [
      "hustle"
    ]
  },
  {
    "id": "hydreigon",
    "name": "\u30B5\u30B6\u30F3\u30C9\u30E9",
    "nameEn": "Hydreigon",
    "type": "dark",
    "type2": "dragon",
    "baseStats": {
      "hp": 92,
      "atk": 105,
      "def": 90,
      "spa": 125,
      "spd": 90,
      "spe": 98
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "larvesta",
    "name": "\u30E1\u30E9\u30EB\u30D0",
    "nameEn": "Larvesta",
    "type": "bug",
    "type2": "fire",
    "baseStats": {
      "hp": 55,
      "atk": 85,
      "def": 55,
      "spa": 50,
      "spd": 55,
      "spe": 60
    },
    "abilities": [
      "flamebody",
      "swarm"
    ]
  },
  {
    "id": "volcarona",
    "name": "\u30A6\u30EB\u30AC\u30E2\u30B9",
    "nameEn": "Volcarona",
    "type": "bug",
    "type2": "fire",
    "baseStats": {
      "hp": 85,
      "atk": 60,
      "def": 65,
      "spa": 135,
      "spd": 105,
      "spe": 100
    },
    "abilities": [
      "flamebody",
      "swarm"
    ]
  },
  {
    "id": "cobalion",
    "name": "\u30B3\u30D0\u30EB\u30AA\u30F3",
    "nameEn": "Cobalion",
    "type": "steel",
    "type2": "fighting",
    "baseStats": {
      "hp": 91,
      "atk": 90,
      "def": 129,
      "spa": 90,
      "spd": 72,
      "spe": 108
    },
    "abilities": [
      "justified"
    ]
  },
  {
    "id": "terrakion",
    "name": "\u30C6\u30E9\u30AD\u30AA\u30F3",
    "nameEn": "Terrakion",
    "type": "rock",
    "type2": "fighting",
    "baseStats": {
      "hp": 91,
      "atk": 129,
      "def": 90,
      "spa": 72,
      "spd": 90,
      "spe": 108
    },
    "abilities": [
      "justified"
    ]
  },
  {
    "id": "virizion",
    "name": "\u30D3\u30EA\u30B8\u30AA\u30F3",
    "nameEn": "Virizion",
    "type": "grass",
    "type2": "fighting",
    "baseStats": {
      "hp": 91,
      "atk": 90,
      "def": 72,
      "spa": 90,
      "spd": 129,
      "spe": 108
    },
    "abilities": [
      "justified"
    ]
  },
  {
    "id": "tornadus",
    "name": "\u30C8\u30EB\u30CD\u30ED\u30B9",
    "nameEn": "Tornadus",
    "type": "flying",
    "baseStats": {
      "hp": 79,
      "atk": 115,
      "def": 70,
      "spa": 125,
      "spd": 80,
      "spe": 111
    },
    "abilities": [
      "prankster",
      "defiant"
    ]
  },
  {
    "id": "thundurus",
    "name": "\u30DC\u30EB\u30C8\u30ED\u30B9",
    "nameEn": "Thundurus",
    "type": "electric",
    "type2": "flying",
    "baseStats": {
      "hp": 79,
      "atk": 115,
      "def": 70,
      "spa": 125,
      "spd": 80,
      "spe": 111
    },
    "abilities": [
      "prankster",
      "defiant"
    ]
  },
  {
    "id": "reshiram",
    "name": "\u30EC\u30B7\u30E9\u30E0",
    "nameEn": "Reshiram",
    "type": "dragon",
    "type2": "fire",
    "baseStats": {
      "hp": 100,
      "atk": 120,
      "def": 100,
      "spa": 150,
      "spd": 120,
      "spe": 90
    },
    "abilities": [
      "turboblaze"
    ]
  },
  {
    "id": "zekrom",
    "name": "\u30BC\u30AF\u30ED\u30E0",
    "nameEn": "Zekrom",
    "type": "dragon",
    "type2": "electric",
    "baseStats": {
      "hp": 100,
      "atk": 150,
      "def": 120,
      "spa": 120,
      "spd": 100,
      "spe": 90
    },
    "abilities": [
      "teravolt"
    ]
  },
  {
    "id": "landorus",
    "name": "\u30E9\u30F3\u30C9\u30ED\u30B9",
    "nameEn": "Landorus",
    "type": "ground",
    "type2": "flying",
    "baseStats": {
      "hp": 89,
      "atk": 125,
      "def": 90,
      "spa": 115,
      "spd": 80,
      "spe": 101
    },
    "abilities": [
      "sandforce",
      "sheerforce"
    ]
  },
  {
    "id": "kyurem",
    "name": "\u30AD\u30E5\u30EC\u30E0",
    "nameEn": "Kyurem",
    "type": "dragon",
    "type2": "ice",
    "baseStats": {
      "hp": 125,
      "atk": 130,
      "def": 90,
      "spa": 130,
      "spd": 90,
      "spe": 95
    },
    "abilities": [
      "pressure"
    ]
  },
  {
    "id": "keldeo",
    "name": "\u30B1\u30EB\u30C7\u30A3\u30AA",
    "nameEn": "Keldeo",
    "type": "water",
    "type2": "fighting",
    "baseStats": {
      "hp": 91,
      "atk": 72,
      "def": 90,
      "spa": 129,
      "spd": 90,
      "spe": 108
    },
    "abilities": [
      "justified"
    ]
  },
  {
    "id": "meloetta",
    "name": "\u30E1\u30ED\u30A8\u30C3\u30BF",
    "nameEn": "Meloetta",
    "type": "normal",
    "type2": "psychic",
    "baseStats": {
      "hp": 100,
      "atk": 77,
      "def": 77,
      "spa": 128,
      "spd": 128,
      "spe": 90
    },
    "abilities": [
      "serenegrace"
    ]
  },
  {
    "id": "genesect",
    "name": "\u30B2\u30CE\u30BB\u30AF\u30C8",
    "nameEn": "Genesect",
    "type": "bug",
    "type2": "steel",
    "baseStats": {
      "hp": 71,
      "atk": 120,
      "def": 95,
      "spa": 120,
      "spd": 95,
      "spe": 99
    },
    "abilities": [
      "download"
    ]
  },
  {
    "id": "chespin",
    "name": "\u30CF\u30EA\u30DE\u30ED\u30F3",
    "nameEn": "Chespin",
    "type": "grass",
    "baseStats": {
      "hp": 56,
      "atk": 61,
      "def": 65,
      "spa": 48,
      "spd": 45,
      "spe": 38
    },
    "abilities": [
      "overgrow",
      "bulletproof"
    ]
  },
  {
    "id": "quilladin",
    "name": "\u30CF\u30EA\u30DC\u30FC\u30B0",
    "nameEn": "Quilladin",
    "type": "grass",
    "baseStats": {
      "hp": 61,
      "atk": 78,
      "def": 95,
      "spa": 56,
      "spd": 58,
      "spe": 57
    },
    "abilities": [
      "overgrow",
      "bulletproof"
    ]
  },
  {
    "id": "chesnaught",
    "name": "\u30D6\u30EA\u30AC\u30ED\u30F3",
    "nameEn": "Chesnaught",
    "type": "grass",
    "type2": "fighting",
    "baseStats": {
      "hp": 88,
      "atk": 107,
      "def": 122,
      "spa": 74,
      "spd": 75,
      "spe": 64
    },
    "abilities": [
      "overgrow",
      "bulletproof"
    ]
  },
  {
    "id": "fennekin",
    "name": "\u30D5\u30A9\u30C3\u30B3",
    "nameEn": "Fennekin",
    "type": "fire",
    "baseStats": {
      "hp": 40,
      "atk": 45,
      "def": 40,
      "spa": 62,
      "spd": 60,
      "spe": 60
    },
    "abilities": [
      "blaze",
      "magician"
    ]
  },
  {
    "id": "braixen",
    "name": "\u30C6\u30FC\u30EB\u30CA\u30FC",
    "nameEn": "Braixen",
    "type": "fire",
    "baseStats": {
      "hp": 59,
      "atk": 59,
      "def": 58,
      "spa": 90,
      "spd": 70,
      "spe": 73
    },
    "abilities": [
      "blaze",
      "magician"
    ]
  },
  {
    "id": "delphox",
    "name": "\u30DE\u30D5\u30A9\u30AF\u30B7\u30FC",
    "nameEn": "Delphox",
    "type": "fire",
    "type2": "psychic",
    "baseStats": {
      "hp": 75,
      "atk": 69,
      "def": 72,
      "spa": 114,
      "spd": 100,
      "spe": 104
    },
    "abilities": [
      "blaze",
      "magician"
    ]
  },
  {
    "id": "froakie",
    "name": "\u30B1\u30ED\u30DE\u30C4",
    "nameEn": "Froakie",
    "type": "water",
    "baseStats": {
      "hp": 41,
      "atk": 56,
      "def": 40,
      "spa": 62,
      "spd": 44,
      "spe": 71
    },
    "abilities": [
      "torrent",
      "protean"
    ]
  },
  {
    "id": "frogadier",
    "name": "\u30B2\u30B3\u30AC\u30B7\u30E9",
    "nameEn": "Frogadier",
    "type": "water",
    "baseStats": {
      "hp": 54,
      "atk": 63,
      "def": 52,
      "spa": 83,
      "spd": 56,
      "spe": 97
    },
    "abilities": [
      "torrent",
      "protean"
    ]
  },
  {
    "id": "greninja",
    "name": "\u30B2\u30C3\u30B3\u30A6\u30AC",
    "nameEn": "Greninja",
    "type": "water",
    "type2": "dark",
    "baseStats": {
      "hp": 72,
      "atk": 95,
      "def": 67,
      "spa": 103,
      "spd": 71,
      "spe": 122
    },
    "abilities": [
      "torrent",
      "protean"
    ]
  },
  {
    "id": "bunnelby",
    "name": "\u30DB\u30EB\u30D3\u30FC",
    "nameEn": "Bunnelby",
    "type": "normal",
    "baseStats": {
      "hp": 38,
      "atk": 36,
      "def": 38,
      "spa": 32,
      "spd": 36,
      "spe": 57
    },
    "abilities": [
      "pickup",
      "cheekpouch",
      "hugepower"
    ]
  },
  {
    "id": "diggersby",
    "name": "\u30DB\u30EB\u30FC\u30C9",
    "nameEn": "Diggersby",
    "type": "normal",
    "type2": "ground",
    "baseStats": {
      "hp": 85,
      "atk": 56,
      "def": 77,
      "spa": 50,
      "spd": 77,
      "spe": 78
    },
    "abilities": [
      "pickup",
      "cheekpouch",
      "hugepower"
    ]
  },
  {
    "id": "fletchling",
    "name": "\u30E4\u30E4\u30B3\u30DE",
    "nameEn": "Fletchling",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 45,
      "atk": 50,
      "def": 43,
      "spa": 40,
      "spd": 38,
      "spe": 62
    },
    "abilities": [
      "bigpecks",
      "galewings"
    ]
  },
  {
    "id": "fletchinder",
    "name": "\u30D2\u30CE\u30E4\u30B3\u30DE",
    "nameEn": "Fletchinder",
    "type": "fire",
    "type2": "flying",
    "baseStats": {
      "hp": 62,
      "atk": 73,
      "def": 55,
      "spa": 56,
      "spd": 52,
      "spe": 84
    },
    "abilities": [
      "flamebody",
      "galewings"
    ]
  },
  {
    "id": "talonflame",
    "name": "\u30D5\u30A1\u30A4\u30A2\u30ED\u30FC",
    "nameEn": "Talonflame",
    "type": "fire",
    "type2": "flying",
    "baseStats": {
      "hp": 78,
      "atk": 81,
      "def": 71,
      "spa": 74,
      "spd": 69,
      "spe": 126
    },
    "abilities": [
      "flamebody",
      "galewings"
    ]
  },
  {
    "id": "scatterbug",
    "name": "\u30B3\u30D5\u30AD\u30E0\u30B7",
    "nameEn": "Scatterbug",
    "type": "bug",
    "baseStats": {
      "hp": 38,
      "atk": 35,
      "def": 40,
      "spa": 27,
      "spd": 25,
      "spe": 35
    },
    "abilities": [
      "shielddust",
      "compoundeyes",
      "friendguard"
    ]
  },
  {
    "id": "spewpa",
    "name": "\u30B3\u30D5\u30FC\u30E9\u30A4",
    "nameEn": "Spewpa",
    "type": "bug",
    "baseStats": {
      "hp": 45,
      "atk": 22,
      "def": 60,
      "spa": 27,
      "spd": 30,
      "spe": 29
    },
    "abilities": [
      "shedskin",
      "friendguard"
    ]
  },
  {
    "id": "vivillon",
    "name": "\u30D3\u30D3\u30E8\u30F3",
    "nameEn": "Vivillon",
    "type": "bug",
    "type2": "flying",
    "baseStats": {
      "hp": 80,
      "atk": 52,
      "def": 50,
      "spa": 90,
      "spd": 50,
      "spe": 89
    },
    "abilities": [
      "shielddust",
      "compoundeyes",
      "friendguard"
    ]
  },
  {
    "id": "litleo",
    "name": "\u30B7\u30B7\u30B3",
    "nameEn": "Litleo",
    "type": "fire",
    "type2": "normal",
    "baseStats": {
      "hp": 62,
      "atk": 50,
      "def": 58,
      "spa": 73,
      "spd": 54,
      "spe": 72
    },
    "abilities": [
      "rivalry",
      "unnerve",
      "moxie"
    ]
  },
  {
    "id": "pyroar",
    "name": "\u30AB\u30A8\u30F3\u30B8\u30B7",
    "nameEn": "Pyroar",
    "type": "fire",
    "type2": "normal",
    "baseStats": {
      "hp": 86,
      "atk": 68,
      "def": 72,
      "spa": 109,
      "spd": 66,
      "spe": 106
    },
    "abilities": [
      "rivalry",
      "unnerve",
      "moxie"
    ]
  },
  {
    "id": "flabebe",
    "name": "\u30D5\u30E9\u30D9\u30D9",
    "nameEn": "Flabe\u0301be\u0301",
    "type": "fairy",
    "baseStats": {
      "hp": 44,
      "atk": 38,
      "def": 39,
      "spa": 61,
      "spd": 79,
      "spe": 42
    },
    "abilities": [
      "flowerveil",
      "symbiosis"
    ]
  },
  {
    "id": "floette",
    "name": "\u30D5\u30E9\u30A8\u30C3\u30C6",
    "nameEn": "Floette",
    "type": "fairy",
    "baseStats": {
      "hp": 54,
      "atk": 45,
      "def": 47,
      "spa": 75,
      "spd": 98,
      "spe": 52
    },
    "abilities": [
      "flowerveil",
      "symbiosis"
    ]
  },
  {
    "id": "florges",
    "name": "\u30D5\u30E9\u30FC\u30B8\u30A7\u30B9",
    "nameEn": "Florges",
    "type": "fairy",
    "baseStats": {
      "hp": 78,
      "atk": 65,
      "def": 68,
      "spa": 112,
      "spd": 154,
      "spe": 75
    },
    "abilities": [
      "flowerveil",
      "symbiosis"
    ]
  },
  {
    "id": "skiddo",
    "name": "\u30E1\u30A7\u30FC\u30AF\u30EB",
    "nameEn": "Skiddo",
    "type": "grass",
    "baseStats": {
      "hp": 66,
      "atk": 65,
      "def": 48,
      "spa": 62,
      "spd": 57,
      "spe": 52
    },
    "abilities": [
      "sapsipper",
      "grasspelt"
    ]
  },
  {
    "id": "gogoat",
    "name": "\u30B4\u30FC\u30B4\u30FC\u30C8",
    "nameEn": "Gogoat",
    "type": "grass",
    "baseStats": {
      "hp": 123,
      "atk": 100,
      "def": 62,
      "spa": 97,
      "spd": 81,
      "spe": 68
    },
    "abilities": [
      "sapsipper",
      "grasspelt"
    ]
  },
  {
    "id": "pancham",
    "name": "\u30E4\u30F3\u30C1\u30E3\u30E0",
    "nameEn": "Pancham",
    "type": "fighting",
    "baseStats": {
      "hp": 67,
      "atk": 82,
      "def": 62,
      "spa": 46,
      "spd": 48,
      "spe": 43
    },
    "abilities": [
      "ironfist",
      "moldbreaker",
      "scrappy"
    ]
  },
  {
    "id": "pangoro",
    "name": "\u30B4\u30ED\u30F3\u30C0",
    "nameEn": "Pangoro",
    "type": "fighting",
    "type2": "dark",
    "baseStats": {
      "hp": 95,
      "atk": 124,
      "def": 78,
      "spa": 69,
      "spd": 71,
      "spe": 58
    },
    "abilities": [
      "ironfist",
      "moldbreaker",
      "scrappy"
    ]
  },
  {
    "id": "furfrou",
    "name": "Furfrou",
    "nameEn": "Furfrou",
    "type": "normal",
    "baseStats": {
      "hp": 75,
      "atk": 80,
      "def": 60,
      "spa": 65,
      "spd": 90,
      "spe": 102
    },
    "abilities": [
      "furcoat"
    ]
  },
  {
    "id": "espurr",
    "name": "\u30CB\u30E3\u30B9\u30D1\u30FC",
    "nameEn": "Espurr",
    "type": "psychic",
    "baseStats": {
      "hp": 62,
      "atk": 48,
      "def": 54,
      "spa": 63,
      "spd": 60,
      "spe": 68
    },
    "abilities": [
      "keeneye",
      "infiltrator",
      "owntempo"
    ]
  },
  {
    "id": "meowstic",
    "name": "\u30CB\u30E3\u30AA\u30CB\u30AF\u30B9",
    "nameEn": "Meowstic",
    "type": "psychic",
    "baseStats": {
      "hp": 74,
      "atk": 48,
      "def": 76,
      "spa": 83,
      "spd": 81,
      "spe": 104
    },
    "abilities": [
      "keeneye",
      "infiltrator",
      "prankster"
    ]
  },
  {
    "id": "honedge",
    "name": "\u30D2\u30C8\u30C4\u30AD",
    "nameEn": "Honedge",
    "type": "steel",
    "type2": "ghost",
    "baseStats": {
      "hp": 45,
      "atk": 80,
      "def": 100,
      "spa": 35,
      "spd": 37,
      "spe": 28
    },
    "abilities": [
      "noguard"
    ]
  },
  {
    "id": "doublade",
    "name": "\u30CB\u30C0\u30F3\u30AE\u30EB",
    "nameEn": "Doublade",
    "type": "steel",
    "type2": "ghost",
    "baseStats": {
      "hp": 59,
      "atk": 110,
      "def": 150,
      "spa": 45,
      "spd": 49,
      "spe": 35
    },
    "abilities": [
      "noguard"
    ]
  },
  {
    "id": "aegislash",
    "name": "\u30AE\u30EB\u30AC\u30EB\u30C9",
    "nameEn": "Aegislash",
    "type": "steel",
    "type2": "ghost",
    "baseStats": {
      "hp": 60,
      "atk": 50,
      "def": 140,
      "spa": 50,
      "spd": 140,
      "spe": 60
    },
    "abilities": [
      "stancechange"
    ]
  },
  {
    "id": "spritzee",
    "name": "\u30B7\u30E5\u30B7\u30E5\u30D7",
    "nameEn": "Spritzee",
    "type": "fairy",
    "baseStats": {
      "hp": 78,
      "atk": 52,
      "def": 60,
      "spa": 63,
      "spd": 65,
      "spe": 23
    },
    "abilities": [
      "healer",
      "aromaveil"
    ]
  },
  {
    "id": "aromatisse",
    "name": "\u30D5\u30EC\u30D5\u30EF\u30F3",
    "nameEn": "Aromatisse",
    "type": "fairy",
    "baseStats": {
      "hp": 101,
      "atk": 72,
      "def": 72,
      "spa": 99,
      "spd": 89,
      "spe": 29
    },
    "abilities": [
      "healer",
      "aromaveil"
    ]
  },
  {
    "id": "swirlix",
    "name": "\u30DA\u30ED\u30C3\u30D1\u30D5",
    "nameEn": "Swirlix",
    "type": "fairy",
    "baseStats": {
      "hp": 62,
      "atk": 48,
      "def": 66,
      "spa": 59,
      "spd": 57,
      "spe": 49
    },
    "abilities": [
      "sweetveil",
      "unburden"
    ]
  },
  {
    "id": "slurpuff",
    "name": "\u30DA\u30ED\u30EA\u30FC\u30E0",
    "nameEn": "Slurpuff",
    "type": "fairy",
    "baseStats": {
      "hp": 82,
      "atk": 80,
      "def": 86,
      "spa": 85,
      "spd": 75,
      "spe": 72
    },
    "abilities": [
      "sweetveil",
      "unburden"
    ]
  },
  {
    "id": "inkay",
    "name": "\u30DE\u30FC\u30A4\u30FC\u30AB",
    "nameEn": "Inkay",
    "type": "dark",
    "type2": "psychic",
    "baseStats": {
      "hp": 53,
      "atk": 54,
      "def": 53,
      "spa": 37,
      "spd": 46,
      "spe": 45
    },
    "abilities": [
      "contrary",
      "suctioncups",
      "infiltrator"
    ]
  },
  {
    "id": "malamar",
    "name": "\u30AB\u30E9\u30DE\u30CD\u30ED",
    "nameEn": "Malamar",
    "type": "dark",
    "type2": "psychic",
    "baseStats": {
      "hp": 86,
      "atk": 92,
      "def": 88,
      "spa": 68,
      "spd": 75,
      "spe": 73
    },
    "abilities": [
      "contrary",
      "suctioncups",
      "infiltrator"
    ]
  },
  {
    "id": "binacle",
    "name": "\u30AB\u30E1\u30C6\u30C6",
    "nameEn": "Binacle",
    "type": "rock",
    "type2": "water",
    "baseStats": {
      "hp": 42,
      "atk": 52,
      "def": 67,
      "spa": 39,
      "spd": 56,
      "spe": 50
    },
    "abilities": [
      "toughclaws",
      "sniper",
      "pickpocket"
    ]
  },
  {
    "id": "barbaracle",
    "name": "\u30AC\u30E1\u30CE\u30C7\u30B9",
    "nameEn": "Barbaracle",
    "type": "rock",
    "type2": "water",
    "baseStats": {
      "hp": 72,
      "atk": 105,
      "def": 115,
      "spa": 54,
      "spd": 86,
      "spe": 68
    },
    "abilities": [
      "toughclaws",
      "sniper",
      "pickpocket"
    ]
  },
  {
    "id": "skrelp",
    "name": "\u30AF\u30BA\u30E2\u30FC",
    "nameEn": "Skrelp",
    "type": "poison",
    "type2": "water",
    "baseStats": {
      "hp": 50,
      "atk": 60,
      "def": 60,
      "spa": 60,
      "spd": 60,
      "spe": 30
    },
    "abilities": [
      "poisonpoint",
      "poisontouch",
      "adaptability"
    ]
  },
  {
    "id": "dragalge",
    "name": "\u30C9\u30E9\u30DF\u30C9\u30ED",
    "nameEn": "Dragalge",
    "type": "poison",
    "type2": "dragon",
    "baseStats": {
      "hp": 65,
      "atk": 75,
      "def": 90,
      "spa": 97,
      "spd": 123,
      "spe": 44
    },
    "abilities": [
      "poisonpoint",
      "poisontouch",
      "adaptability"
    ]
  },
  {
    "id": "clauncher",
    "name": "\u30A6\u30C7\u30C3\u30DD\u30A6",
    "nameEn": "Clauncher",
    "type": "water",
    "baseStats": {
      "hp": 50,
      "atk": 53,
      "def": 62,
      "spa": 58,
      "spd": 63,
      "spe": 44
    },
    "abilities": [
      "megalauncher"
    ]
  },
  {
    "id": "clawitzer",
    "name": "\u30D6\u30ED\u30B9\u30BF\u30FC",
    "nameEn": "Clawitzer",
    "type": "water",
    "baseStats": {
      "hp": 71,
      "atk": 73,
      "def": 88,
      "spa": 120,
      "spd": 89,
      "spe": 59
    },
    "abilities": [
      "megalauncher"
    ]
  },
  {
    "id": "helioptile",
    "name": "\u30A8\u30EA\u30AD\u30C6\u30EB",
    "nameEn": "Helioptile",
    "type": "electric",
    "type2": "normal",
    "baseStats": {
      "hp": 44,
      "atk": 38,
      "def": 33,
      "spa": 61,
      "spd": 43,
      "spe": 70
    },
    "abilities": [
      "dryskin",
      "sandveil",
      "solarpower"
    ]
  },
  {
    "id": "heliolisk",
    "name": "\u30A8\u30EC\u30B6\u30FC\u30C9",
    "nameEn": "Heliolisk",
    "type": "electric",
    "type2": "normal",
    "baseStats": {
      "hp": 62,
      "atk": 55,
      "def": 52,
      "spa": 109,
      "spd": 94,
      "spe": 109
    },
    "abilities": [
      "dryskin",
      "sandveil",
      "solarpower"
    ]
  },
  {
    "id": "tyrunt",
    "name": "\u30C1\u30B4\u30E9\u30B9",
    "nameEn": "Tyrunt",
    "type": "rock",
    "type2": "dragon",
    "baseStats": {
      "hp": 58,
      "atk": 89,
      "def": 77,
      "spa": 45,
      "spd": 45,
      "spe": 48
    },
    "abilities": [
      "strongjaw",
      "sturdy"
    ]
  },
  {
    "id": "tyrantrum",
    "name": "\u30AC\u30C1\u30B4\u30E9\u30B9",
    "nameEn": "Tyrantrum",
    "type": "rock",
    "type2": "dragon",
    "baseStats": {
      "hp": 82,
      "atk": 121,
      "def": 119,
      "spa": 69,
      "spd": 59,
      "spe": 71
    },
    "abilities": [
      "strongjaw",
      "rockhead"
    ]
  },
  {
    "id": "amaura",
    "name": "\u30A2\u30DE\u30EB\u30B9",
    "nameEn": "Amaura",
    "type": "rock",
    "type2": "ice",
    "baseStats": {
      "hp": 77,
      "atk": 59,
      "def": 50,
      "spa": 67,
      "spd": 63,
      "spe": 46
    },
    "abilities": [
      "refrigerate",
      "snowwarning"
    ]
  },
  {
    "id": "aurorus",
    "name": "\u30A2\u30DE\u30EB\u30EB\u30AC",
    "nameEn": "Aurorus",
    "type": "rock",
    "type2": "ice",
    "baseStats": {
      "hp": 123,
      "atk": 77,
      "def": 72,
      "spa": 99,
      "spd": 92,
      "spe": 58
    },
    "abilities": [
      "refrigerate",
      "snowwarning"
    ]
  },
  {
    "id": "sylveon",
    "name": "\u30CB\u30F3\u30D5\u30A3\u30A2",
    "nameEn": "Sylveon",
    "type": "fairy",
    "baseStats": {
      "hp": 95,
      "atk": 65,
      "def": 65,
      "spa": 110,
      "spd": 130,
      "spe": 60
    },
    "abilities": [
      "cutecharm",
      "pixilate"
    ]
  },
  {
    "id": "hawlucha",
    "name": "\u30EB\u30C1\u30E3\u30D6\u30EB",
    "nameEn": "Hawlucha",
    "type": "fighting",
    "type2": "flying",
    "baseStats": {
      "hp": 78,
      "atk": 92,
      "def": 75,
      "spa": 74,
      "spd": 63,
      "spe": 118
    },
    "abilities": [
      "limber",
      "unburden",
      "moldbreaker"
    ]
  },
  {
    "id": "dedenne",
    "name": "\u30C7\u30C7\u30F3\u30CD",
    "nameEn": "Dedenne",
    "type": "electric",
    "type2": "fairy",
    "baseStats": {
      "hp": 67,
      "atk": 58,
      "def": 57,
      "spa": 81,
      "spd": 67,
      "spe": 101
    },
    "abilities": [
      "cheekpouch",
      "pickup",
      "plus"
    ]
  },
  {
    "id": "carbink",
    "name": "\u30E1\u30EC\u30B7\u30FC",
    "nameEn": "Carbink",
    "type": "rock",
    "type2": "fairy",
    "baseStats": {
      "hp": 50,
      "atk": 50,
      "def": 150,
      "spa": 50,
      "spd": 150,
      "spe": 50
    },
    "abilities": [
      "clearbody",
      "sturdy"
    ]
  },
  {
    "id": "goomy",
    "name": "\u30CC\u30E1\u30E9",
    "nameEn": "Goomy",
    "type": "dragon",
    "baseStats": {
      "hp": 45,
      "atk": 50,
      "def": 35,
      "spa": 55,
      "spd": 75,
      "spe": 40
    },
    "abilities": [
      "sapsipper",
      "hydration",
      "gooey"
    ]
  },
  {
    "id": "sliggoo",
    "name": "\u30CC\u30E1\u30A4\u30EB",
    "nameEn": "Sliggoo",
    "type": "dragon",
    "baseStats": {
      "hp": 68,
      "atk": 75,
      "def": 53,
      "spa": 83,
      "spd": 113,
      "spe": 60
    },
    "abilities": [
      "sapsipper",
      "hydration",
      "gooey"
    ]
  },
  {
    "id": "goodra",
    "name": "\u30CC\u30E1\u30EB\u30B4\u30F3",
    "nameEn": "Goodra",
    "type": "dragon",
    "baseStats": {
      "hp": 90,
      "atk": 100,
      "def": 70,
      "spa": 110,
      "spd": 150,
      "spe": 80
    },
    "abilities": [
      "sapsipper",
      "hydration",
      "gooey"
    ]
  },
  {
    "id": "klefki",
    "name": "\u30AF\u30EC\u30C3\u30D5\u30A3",
    "nameEn": "Klefki",
    "type": "steel",
    "type2": "fairy",
    "baseStats": {
      "hp": 57,
      "atk": 80,
      "def": 91,
      "spa": 80,
      "spd": 87,
      "spe": 75
    },
    "abilities": [
      "prankster",
      "magician"
    ]
  },
  {
    "id": "phantump",
    "name": "\u30DC\u30AF\u30EC\u30FC",
    "nameEn": "Phantump",
    "type": "ghost",
    "type2": "grass",
    "baseStats": {
      "hp": 43,
      "atk": 70,
      "def": 48,
      "spa": 50,
      "spd": 60,
      "spe": 38
    },
    "abilities": [
      "naturalcure",
      "frisk",
      "harvest"
    ]
  },
  {
    "id": "trevenant",
    "name": "\u30AA\u30FC\u30ED\u30C3\u30C8",
    "nameEn": "Trevenant",
    "type": "ghost",
    "type2": "grass",
    "baseStats": {
      "hp": 85,
      "atk": 110,
      "def": 76,
      "spa": 65,
      "spd": 82,
      "spe": 56
    },
    "abilities": [
      "naturalcure",
      "frisk",
      "harvest"
    ]
  },
  {
    "id": "pumpkaboo",
    "name": "\u30D0\u30B1\u30C3\u30C1\u30E3",
    "nameEn": "Pumpkaboo",
    "type": "ghost",
    "type2": "grass",
    "baseStats": {
      "hp": 49,
      "atk": 66,
      "def": 70,
      "spa": 44,
      "spd": 55,
      "spe": 51
    },
    "abilities": [
      "pickup",
      "frisk",
      "insomnia"
    ]
  },
  {
    "id": "gourgeist",
    "name": "\u30D1\u30F3\u30D7\u30B8\u30F3",
    "nameEn": "Gourgeist",
    "type": "ghost",
    "type2": "grass",
    "baseStats": {
      "hp": 65,
      "atk": 90,
      "def": 122,
      "spa": 58,
      "spd": 75,
      "spe": 84
    },
    "abilities": [
      "pickup",
      "frisk",
      "insomnia"
    ]
  },
  {
    "id": "bergmite",
    "name": "\u30AB\u30C1\u30B3\u30FC\u30EB",
    "nameEn": "Bergmite",
    "type": "ice",
    "baseStats": {
      "hp": 55,
      "atk": 69,
      "def": 85,
      "spa": 32,
      "spd": 35,
      "spe": 28
    },
    "abilities": [
      "owntempo",
      "icebody",
      "sturdy"
    ]
  },
  {
    "id": "avalugg",
    "name": "\u30AF\u30EC\u30D9\u30FC\u30B9",
    "nameEn": "Avalugg",
    "type": "ice",
    "baseStats": {
      "hp": 95,
      "atk": 117,
      "def": 184,
      "spa": 44,
      "spd": 46,
      "spe": 28
    },
    "abilities": [
      "owntempo",
      "icebody",
      "sturdy"
    ]
  },
  {
    "id": "noibat",
    "name": "\u30AA\u30F3\u30D0\u30C3\u30C8",
    "nameEn": "Noibat",
    "type": "flying",
    "type2": "dragon",
    "baseStats": {
      "hp": 40,
      "atk": 30,
      "def": 35,
      "spa": 45,
      "spd": 40,
      "spe": 55
    },
    "abilities": [
      "frisk",
      "infiltrator",
      "telepathy"
    ]
  },
  {
    "id": "noivern",
    "name": "\u30AA\u30F3\u30D0\u30FC\u30F3",
    "nameEn": "Noivern",
    "type": "flying",
    "type2": "dragon",
    "baseStats": {
      "hp": 85,
      "atk": 70,
      "def": 80,
      "spa": 97,
      "spd": 80,
      "spe": 123
    },
    "abilities": [
      "frisk",
      "infiltrator",
      "telepathy"
    ]
  },
  {
    "id": "xerneas",
    "name": "\u30BC\u30EB\u30CD\u30A2\u30B9",
    "nameEn": "Xerneas",
    "type": "fairy",
    "baseStats": {
      "hp": 126,
      "atk": 131,
      "def": 95,
      "spa": 131,
      "spd": 98,
      "spe": 99
    },
    "abilities": [
      "fairyaura"
    ]
  },
  {
    "id": "yveltal",
    "name": "\u30A4\u30D9\u30EB\u30BF\u30EB",
    "nameEn": "Yveltal",
    "type": "dark",
    "type2": "flying",
    "baseStats": {
      "hp": 126,
      "atk": 131,
      "def": 95,
      "spa": 131,
      "spd": 98,
      "spe": 99
    },
    "abilities": [
      "darkaura"
    ]
  },
  {
    "id": "zygarde",
    "name": "\u30B8\u30AC\u30EB\u30C7",
    "nameEn": "Zygarde",
    "type": "dragon",
    "type2": "ground",
    "baseStats": {
      "hp": 108,
      "atk": 100,
      "def": 121,
      "spa": 81,
      "spd": 95,
      "spe": 95
    },
    "abilities": [
      "aurabreak"
    ]
  },
  {
    "id": "diancie",
    "name": "\u30C7\u30A3\u30A2\u30F3\u30B7\u30FC",
    "nameEn": "Diancie",
    "type": "rock",
    "type2": "fairy",
    "baseStats": {
      "hp": 50,
      "atk": 100,
      "def": 150,
      "spa": 100,
      "spd": 150,
      "spe": 50
    },
    "abilities": [
      "clearbody"
    ]
  },
  {
    "id": "hoopa",
    "name": "\u30D5\u30FC\u30D1",
    "nameEn": "Hoopa",
    "type": "psychic",
    "type2": "ghost",
    "baseStats": {
      "hp": 80,
      "atk": 110,
      "def": 60,
      "spa": 150,
      "spd": 130,
      "spe": 70
    },
    "abilities": [
      "magician"
    ]
  },
  {
    "id": "volcanion",
    "name": "\u30DC\u30EB\u30B1\u30CB\u30AA\u30F3",
    "nameEn": "Volcanion",
    "type": "fire",
    "type2": "water",
    "baseStats": {
      "hp": 80,
      "atk": 110,
      "def": 120,
      "spa": 130,
      "spd": 90,
      "spe": 70
    },
    "abilities": [
      "waterabsorb"
    ]
  },
  {
    "id": "rowlet",
    "name": "Rowlet",
    "nameEn": "Rowlet",
    "type": "grass",
    "type2": "flying",
    "baseStats": {
      "hp": 68,
      "atk": 55,
      "def": 55,
      "spa": 50,
      "spd": 50,
      "spe": 42
    },
    "abilities": [
      "overgrow",
      "longreach"
    ]
  },
  {
    "id": "dartrix",
    "name": "Dartrix",
    "nameEn": "Dartrix",
    "type": "grass",
    "type2": "flying",
    "baseStats": {
      "hp": 78,
      "atk": 75,
      "def": 75,
      "spa": 70,
      "spd": 70,
      "spe": 52
    },
    "abilities": [
      "overgrow",
      "longreach"
    ]
  },
  {
    "id": "decidueye",
    "name": "Decidueye",
    "nameEn": "Decidueye",
    "type": "grass",
    "type2": "ghost",
    "baseStats": {
      "hp": 78,
      "atk": 107,
      "def": 75,
      "spa": 100,
      "spd": 100,
      "spe": 70
    },
    "abilities": [
      "overgrow",
      "longreach"
    ]
  },
  {
    "id": "litten",
    "name": "Litten",
    "nameEn": "Litten",
    "type": "fire",
    "baseStats": {
      "hp": 45,
      "atk": 65,
      "def": 40,
      "spa": 60,
      "spd": 40,
      "spe": 70
    },
    "abilities": [
      "blaze",
      "intimidate"
    ]
  },
  {
    "id": "torracat",
    "name": "Torracat",
    "nameEn": "Torracat",
    "type": "fire",
    "baseStats": {
      "hp": 65,
      "atk": 85,
      "def": 50,
      "spa": 80,
      "spd": 50,
      "spe": 90
    },
    "abilities": [
      "blaze",
      "intimidate"
    ]
  },
  {
    "id": "incineroar",
    "name": "Incineroar",
    "nameEn": "Incineroar",
    "type": "fire",
    "type2": "dark",
    "baseStats": {
      "hp": 95,
      "atk": 115,
      "def": 90,
      "spa": 80,
      "spd": 90,
      "spe": 60
    },
    "abilities": [
      "blaze",
      "intimidate"
    ]
  },
  {
    "id": "popplio",
    "name": "Popplio",
    "nameEn": "Popplio",
    "type": "water",
    "baseStats": {
      "hp": 50,
      "atk": 54,
      "def": 54,
      "spa": 66,
      "spd": 56,
      "spe": 40
    },
    "abilities": [
      "torrent",
      "liquidvoice"
    ]
  },
  {
    "id": "brionne",
    "name": "Brionne",
    "nameEn": "Brionne",
    "type": "water",
    "baseStats": {
      "hp": 60,
      "atk": 69,
      "def": 69,
      "spa": 91,
      "spd": 81,
      "spe": 50
    },
    "abilities": [
      "torrent",
      "liquidvoice"
    ]
  },
  {
    "id": "primarina",
    "name": "Primarina",
    "nameEn": "Primarina",
    "type": "water",
    "type2": "fairy",
    "baseStats": {
      "hp": 80,
      "atk": 74,
      "def": 74,
      "spa": 126,
      "spd": 116,
      "spe": 60
    },
    "abilities": [
      "torrent",
      "liquidvoice"
    ]
  },
  {
    "id": "pikipek",
    "name": "Pikipek",
    "nameEn": "Pikipek",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 35,
      "atk": 75,
      "def": 30,
      "spa": 30,
      "spd": 30,
      "spe": 65
    },
    "abilities": [
      "keeneye",
      "skilllink",
      "pickup"
    ]
  },
  {
    "id": "trumbeak",
    "name": "Trumbeak",
    "nameEn": "Trumbeak",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 55,
      "atk": 85,
      "def": 50,
      "spa": 40,
      "spd": 50,
      "spe": 75
    },
    "abilities": [
      "keeneye",
      "skilllink",
      "pickup"
    ]
  },
  {
    "id": "toucannon",
    "name": "Toucannon",
    "nameEn": "Toucannon",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 80,
      "atk": 120,
      "def": 75,
      "spa": 75,
      "spd": 75,
      "spe": 60
    },
    "abilities": [
      "keeneye",
      "skilllink",
      "sheerforce"
    ]
  },
  {
    "id": "yungoos",
    "name": "Yungoos",
    "nameEn": "Yungoos",
    "type": "normal",
    "baseStats": {
      "hp": 48,
      "atk": 70,
      "def": 30,
      "spa": 30,
      "spd": 30,
      "spe": 45
    },
    "abilities": [
      "stakeout",
      "strongjaw",
      "adaptability"
    ]
  },
  {
    "id": "gumshoos",
    "name": "Gumshoos",
    "nameEn": "Gumshoos",
    "type": "normal",
    "baseStats": {
      "hp": 88,
      "atk": 110,
      "def": 60,
      "spa": 55,
      "spd": 60,
      "spe": 45
    },
    "abilities": [
      "stakeout",
      "strongjaw",
      "adaptability"
    ]
  },
  {
    "id": "grubbin",
    "name": "Grubbin",
    "nameEn": "Grubbin",
    "type": "bug",
    "baseStats": {
      "hp": 47,
      "atk": 62,
      "def": 45,
      "spa": 55,
      "spd": 45,
      "spe": 46
    },
    "abilities": [
      "swarm"
    ]
  },
  {
    "id": "charjabug",
    "name": "Charjabug",
    "nameEn": "Charjabug",
    "type": "bug",
    "type2": "electric",
    "baseStats": {
      "hp": 57,
      "atk": 82,
      "def": 95,
      "spa": 55,
      "spd": 75,
      "spe": 36
    },
    "abilities": [
      "battery"
    ]
  },
  {
    "id": "vikavolt",
    "name": "Vikavolt",
    "nameEn": "Vikavolt",
    "type": "bug",
    "type2": "electric",
    "baseStats": {
      "hp": 77,
      "atk": 70,
      "def": 90,
      "spa": 145,
      "spd": 75,
      "spe": 43
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "crabrawler",
    "name": "Crabrawler",
    "nameEn": "Crabrawler",
    "type": "fighting",
    "baseStats": {
      "hp": 47,
      "atk": 82,
      "def": 57,
      "spa": 42,
      "spd": 47,
      "spe": 63
    },
    "abilities": [
      "hypercutter",
      "ironfist",
      "angerpoint"
    ]
  },
  {
    "id": "crabominable",
    "name": "Crabominable",
    "nameEn": "Crabominable",
    "type": "fighting",
    "type2": "ice",
    "baseStats": {
      "hp": 97,
      "atk": 132,
      "def": 77,
      "spa": 62,
      "spd": 67,
      "spe": 43
    },
    "abilities": [
      "hypercutter",
      "ironfist",
      "angerpoint"
    ]
  },
  {
    "id": "oricorio",
    "name": "Oricorio",
    "nameEn": "Oricorio",
    "type": "fire",
    "type2": "flying",
    "baseStats": {
      "hp": 75,
      "atk": 70,
      "def": 70,
      "spa": 98,
      "spd": 70,
      "spe": 93
    },
    "abilities": [
      "dancer"
    ]
  },
  {
    "id": "cutiefly",
    "name": "Cutiefly",
    "nameEn": "Cutiefly",
    "type": "bug",
    "type2": "fairy",
    "baseStats": {
      "hp": 40,
      "atk": 45,
      "def": 40,
      "spa": 55,
      "spd": 40,
      "spe": 84
    },
    "abilities": [
      "honeygather",
      "shielddust",
      "sweetveil"
    ]
  },
  {
    "id": "ribombee",
    "name": "Ribombee",
    "nameEn": "Ribombee",
    "type": "bug",
    "type2": "fairy",
    "baseStats": {
      "hp": 60,
      "atk": 55,
      "def": 60,
      "spa": 95,
      "spd": 70,
      "spe": 124
    },
    "abilities": [
      "honeygather",
      "shielddust",
      "sweetveil"
    ]
  },
  {
    "id": "rockruff",
    "name": "Rockruff",
    "nameEn": "Rockruff",
    "type": "rock",
    "baseStats": {
      "hp": 45,
      "atk": 65,
      "def": 40,
      "spa": 30,
      "spd": 40,
      "spe": 60
    },
    "abilities": [
      "keeneye",
      "vitalspirit",
      "steadfast"
    ]
  },
  {
    "id": "lycanroc",
    "name": "Lycanroc",
    "nameEn": "Lycanroc",
    "type": "rock",
    "baseStats": {
      "hp": 75,
      "atk": 115,
      "def": 65,
      "spa": 55,
      "spd": 65,
      "spe": 112
    },
    "abilities": [
      "keeneye",
      "sandrush",
      "steadfast"
    ]
  },
  {
    "id": "wishiwashi",
    "name": "Wishiwashi",
    "nameEn": "Wishiwashi",
    "type": "water",
    "baseStats": {
      "hp": 45,
      "atk": 20,
      "def": 20,
      "spa": 25,
      "spd": 25,
      "spe": 40
    },
    "abilities": [
      "schooling"
    ]
  },
  {
    "id": "mareanie",
    "name": "Mareanie",
    "nameEn": "Mareanie",
    "type": "poison",
    "type2": "water",
    "baseStats": {
      "hp": 50,
      "atk": 53,
      "def": 62,
      "spa": 43,
      "spd": 52,
      "spe": 45
    },
    "abilities": [
      "merciless",
      "limber",
      "regenerator"
    ]
  },
  {
    "id": "toxapex",
    "name": "Toxapex",
    "nameEn": "Toxapex",
    "type": "poison",
    "type2": "water",
    "baseStats": {
      "hp": 50,
      "atk": 63,
      "def": 152,
      "spa": 53,
      "spd": 142,
      "spe": 35
    },
    "abilities": [
      "merciless",
      "limber",
      "regenerator"
    ]
  },
  {
    "id": "mudbray",
    "name": "Mudbray",
    "nameEn": "Mudbray",
    "type": "ground",
    "baseStats": {
      "hp": 70,
      "atk": 100,
      "def": 70,
      "spa": 45,
      "spd": 55,
      "spe": 45
    },
    "abilities": [
      "owntempo",
      "stamina",
      "innerfocus"
    ]
  },
  {
    "id": "mudsdale",
    "name": "Mudsdale",
    "nameEn": "Mudsdale",
    "type": "ground",
    "baseStats": {
      "hp": 100,
      "atk": 125,
      "def": 100,
      "spa": 55,
      "spd": 85,
      "spe": 35
    },
    "abilities": [
      "owntempo",
      "stamina",
      "innerfocus"
    ]
  },
  {
    "id": "dewpider",
    "name": "Dewpider",
    "nameEn": "Dewpider",
    "type": "water",
    "type2": "bug",
    "baseStats": {
      "hp": 38,
      "atk": 40,
      "def": 52,
      "spa": 40,
      "spd": 72,
      "spe": 27
    },
    "abilities": [
      "waterbubble",
      "waterabsorb"
    ]
  },
  {
    "id": "araquanid",
    "name": "Araquanid",
    "nameEn": "Araquanid",
    "type": "water",
    "type2": "bug",
    "baseStats": {
      "hp": 68,
      "atk": 70,
      "def": 92,
      "spa": 50,
      "spd": 132,
      "spe": 42
    },
    "abilities": [
      "waterbubble",
      "waterabsorb"
    ]
  },
  {
    "id": "fomantis",
    "name": "Fomantis",
    "nameEn": "Fomantis",
    "type": "grass",
    "baseStats": {
      "hp": 40,
      "atk": 55,
      "def": 35,
      "spa": 50,
      "spd": 35,
      "spe": 35
    },
    "abilities": [
      "leafguard",
      "contrary"
    ]
  },
  {
    "id": "lurantis",
    "name": "Lurantis",
    "nameEn": "Lurantis",
    "type": "grass",
    "baseStats": {
      "hp": 70,
      "atk": 105,
      "def": 90,
      "spa": 80,
      "spd": 90,
      "spe": 45
    },
    "abilities": [
      "leafguard",
      "contrary"
    ]
  },
  {
    "id": "morelull",
    "name": "Morelull",
    "nameEn": "Morelull",
    "type": "grass",
    "type2": "fairy",
    "baseStats": {
      "hp": 40,
      "atk": 35,
      "def": 55,
      "spa": 65,
      "spd": 75,
      "spe": 15
    },
    "abilities": [
      "illuminate",
      "effectspore",
      "raindish"
    ]
  },
  {
    "id": "shiinotic",
    "name": "Shiinotic",
    "nameEn": "Shiinotic",
    "type": "grass",
    "type2": "fairy",
    "baseStats": {
      "hp": 60,
      "atk": 45,
      "def": 80,
      "spa": 90,
      "spd": 100,
      "spe": 30
    },
    "abilities": [
      "illuminate",
      "effectspore",
      "raindish"
    ]
  },
  {
    "id": "salandit",
    "name": "Salandit",
    "nameEn": "Salandit",
    "type": "poison",
    "type2": "fire",
    "baseStats": {
      "hp": 48,
      "atk": 44,
      "def": 40,
      "spa": 71,
      "spd": 40,
      "spe": 77
    },
    "abilities": [
      "corrosion",
      "oblivious"
    ]
  },
  {
    "id": "salazzle",
    "name": "Salazzle",
    "nameEn": "Salazzle",
    "type": "poison",
    "type2": "fire",
    "baseStats": {
      "hp": 68,
      "atk": 64,
      "def": 60,
      "spa": 111,
      "spd": 60,
      "spe": 117
    },
    "abilities": [
      "corrosion",
      "oblivious"
    ]
  },
  {
    "id": "stufful",
    "name": "Stufful",
    "nameEn": "Stufful",
    "type": "normal",
    "type2": "fighting",
    "baseStats": {
      "hp": 70,
      "atk": 75,
      "def": 50,
      "spa": 45,
      "spd": 50,
      "spe": 50
    },
    "abilities": [
      "fluffy",
      "klutz",
      "cutecharm"
    ]
  },
  {
    "id": "bewear",
    "name": "Bewear",
    "nameEn": "Bewear",
    "type": "normal",
    "type2": "fighting",
    "baseStats": {
      "hp": 120,
      "atk": 125,
      "def": 80,
      "spa": 55,
      "spd": 60,
      "spe": 60
    },
    "abilities": [
      "fluffy",
      "klutz",
      "unnerve"
    ]
  },
  {
    "id": "bounsweet",
    "name": "Bounsweet",
    "nameEn": "Bounsweet",
    "type": "grass",
    "baseStats": {
      "hp": 42,
      "atk": 30,
      "def": 38,
      "spa": 30,
      "spd": 38,
      "spe": 32
    },
    "abilities": [
      "leafguard",
      "oblivious",
      "sweetveil"
    ]
  },
  {
    "id": "steenee",
    "name": "Steenee",
    "nameEn": "Steenee",
    "type": "grass",
    "baseStats": {
      "hp": 52,
      "atk": 40,
      "def": 48,
      "spa": 40,
      "spd": 48,
      "spe": 62
    },
    "abilities": [
      "leafguard",
      "oblivious",
      "sweetveil"
    ]
  },
  {
    "id": "tsareena",
    "name": "Tsareena",
    "nameEn": "Tsareena",
    "type": "grass",
    "baseStats": {
      "hp": 72,
      "atk": 120,
      "def": 98,
      "spa": 50,
      "spd": 98,
      "spe": 72
    },
    "abilities": [
      "leafguard",
      "queenlymajesty",
      "sweetveil"
    ]
  },
  {
    "id": "comfey",
    "name": "Comfey",
    "nameEn": "Comfey",
    "type": "fairy",
    "baseStats": {
      "hp": 51,
      "atk": 52,
      "def": 90,
      "spa": 82,
      "spd": 110,
      "spe": 100
    },
    "abilities": [
      "flowerveil",
      "triage",
      "naturalcure"
    ]
  },
  {
    "id": "oranguru",
    "name": "Oranguru",
    "nameEn": "Oranguru",
    "type": "normal",
    "type2": "psychic",
    "baseStats": {
      "hp": 90,
      "atk": 60,
      "def": 80,
      "spa": 90,
      "spd": 110,
      "spe": 60
    },
    "abilities": [
      "innerfocus",
      "telepathy",
      "symbiosis"
    ]
  },
  {
    "id": "passimian",
    "name": "Passimian",
    "nameEn": "Passimian",
    "type": "fighting",
    "baseStats": {
      "hp": 100,
      "atk": 120,
      "def": 90,
      "spa": 40,
      "spd": 60,
      "spe": 80
    },
    "abilities": [
      "receiver",
      "defiant"
    ]
  },
  {
    "id": "wimpod",
    "name": "Wimpod",
    "nameEn": "Wimpod",
    "type": "bug",
    "type2": "water",
    "baseStats": {
      "hp": 25,
      "atk": 35,
      "def": 40,
      "spa": 20,
      "spd": 30,
      "spe": 80
    },
    "abilities": [
      "wimpout"
    ]
  },
  {
    "id": "golisopod",
    "name": "Golisopod",
    "nameEn": "Golisopod",
    "type": "bug",
    "type2": "water",
    "baseStats": {
      "hp": 75,
      "atk": 125,
      "def": 140,
      "spa": 60,
      "spd": 90,
      "spe": 40
    },
    "abilities": [
      "emergencyexit"
    ]
  },
  {
    "id": "sandygast",
    "name": "Sandygast",
    "nameEn": "Sandygast",
    "type": "ghost",
    "type2": "ground",
    "baseStats": {
      "hp": 55,
      "atk": 55,
      "def": 80,
      "spa": 70,
      "spd": 45,
      "spe": 15
    },
    "abilities": [
      "watercompaction",
      "sandveil"
    ]
  },
  {
    "id": "palossand",
    "name": "Palossand",
    "nameEn": "Palossand",
    "type": "ghost",
    "type2": "ground",
    "baseStats": {
      "hp": 85,
      "atk": 75,
      "def": 110,
      "spa": 100,
      "spd": 75,
      "spe": 35
    },
    "abilities": [
      "watercompaction",
      "sandveil"
    ]
  },
  {
    "id": "pyukumuku",
    "name": "Pyukumuku",
    "nameEn": "Pyukumuku",
    "type": "water",
    "baseStats": {
      "hp": 55,
      "atk": 60,
      "def": 130,
      "spa": 30,
      "spd": 130,
      "spe": 5
    },
    "abilities": [
      "innardsout",
      "unaware"
    ]
  },
  {
    "id": "typenull",
    "name": "Type: Null",
    "nameEn": "Type: Null",
    "type": "normal",
    "baseStats": {
      "hp": 95,
      "atk": 95,
      "def": 95,
      "spa": 95,
      "spd": 95,
      "spe": 59
    },
    "abilities": [
      "battlearmor"
    ]
  },
  {
    "id": "silvally",
    "name": "Silvally",
    "nameEn": "Silvally",
    "type": "normal",
    "baseStats": {
      "hp": 95,
      "atk": 95,
      "def": 95,
      "spa": 95,
      "spd": 95,
      "spe": 95
    },
    "abilities": [
      "rkssystem"
    ]
  },
  {
    "id": "minior",
    "name": "Minior",
    "nameEn": "Minior",
    "type": "rock",
    "type2": "flying",
    "baseStats": {
      "hp": 60,
      "atk": 100,
      "def": 60,
      "spa": 100,
      "spd": 60,
      "spe": 120
    },
    "abilities": [
      "shieldsdown"
    ]
  },
  {
    "id": "komala",
    "name": "Komala",
    "nameEn": "Komala",
    "type": "normal",
    "baseStats": {
      "hp": 65,
      "atk": 115,
      "def": 65,
      "spa": 75,
      "spd": 95,
      "spe": 65
    },
    "abilities": [
      "comatose"
    ]
  },
  {
    "id": "turtonator",
    "name": "Turtonator",
    "nameEn": "Turtonator",
    "type": "fire",
    "type2": "dragon",
    "baseStats": {
      "hp": 60,
      "atk": 78,
      "def": 135,
      "spa": 91,
      "spd": 85,
      "spe": 36
    },
    "abilities": [
      "shellarmor"
    ]
  },
  {
    "id": "togedemaru",
    "name": "Togedemaru",
    "nameEn": "Togedemaru",
    "type": "electric",
    "type2": "steel",
    "baseStats": {
      "hp": 65,
      "atk": 98,
      "def": 63,
      "spa": 40,
      "spd": 73,
      "spe": 96
    },
    "abilities": [
      "ironbarbs",
      "lightningrod",
      "sturdy"
    ]
  },
  {
    "id": "mimikyu",
    "name": "Mimikyu",
    "nameEn": "Mimikyu",
    "type": "ghost",
    "type2": "fairy",
    "baseStats": {
      "hp": 55,
      "atk": 90,
      "def": 80,
      "spa": 50,
      "spd": 105,
      "spe": 96
    },
    "abilities": [
      "disguise"
    ]
  },
  {
    "id": "bruxish",
    "name": "Bruxish",
    "nameEn": "Bruxish",
    "type": "water",
    "type2": "psychic",
    "baseStats": {
      "hp": 68,
      "atk": 105,
      "def": 70,
      "spa": 70,
      "spd": 70,
      "spe": 92
    },
    "abilities": [
      "dazzling",
      "strongjaw",
      "wonderskin"
    ]
  },
  {
    "id": "drampa",
    "name": "Drampa",
    "nameEn": "Drampa",
    "type": "normal",
    "type2": "dragon",
    "baseStats": {
      "hp": 78,
      "atk": 60,
      "def": 85,
      "spa": 135,
      "spd": 91,
      "spe": 36
    },
    "abilities": [
      "berserk",
      "sapsipper",
      "cloudnine"
    ]
  },
  {
    "id": "dhelmise",
    "name": "Dhelmise",
    "nameEn": "Dhelmise",
    "type": "ghost",
    "type2": "grass",
    "baseStats": {
      "hp": 70,
      "atk": 131,
      "def": 100,
      "spa": 86,
      "spd": 90,
      "spe": 40
    },
    "abilities": [
      "steelworker"
    ]
  },
  {
    "id": "jangmoo",
    "name": "Jangmo-o",
    "nameEn": "Jangmo-o",
    "type": "dragon",
    "baseStats": {
      "hp": 45,
      "atk": 55,
      "def": 65,
      "spa": 45,
      "spd": 45,
      "spe": 45
    },
    "abilities": [
      "bulletproof",
      "soundproof",
      "overcoat"
    ]
  },
  {
    "id": "hakamoo",
    "name": "Hakamo-o",
    "nameEn": "Hakamo-o",
    "type": "dragon",
    "type2": "fighting",
    "baseStats": {
      "hp": 55,
      "atk": 75,
      "def": 90,
      "spa": 65,
      "spd": 70,
      "spe": 65
    },
    "abilities": [
      "bulletproof",
      "soundproof",
      "overcoat"
    ]
  },
  {
    "id": "kommoo",
    "name": "Kommo-o",
    "nameEn": "Kommo-o",
    "type": "dragon",
    "type2": "fighting",
    "baseStats": {
      "hp": 75,
      "atk": 110,
      "def": 125,
      "spa": 100,
      "spd": 105,
      "spe": 85
    },
    "abilities": [
      "bulletproof",
      "soundproof",
      "overcoat"
    ]
  },
  {
    "id": "tapukoko",
    "name": "Tapu Koko",
    "nameEn": "Tapu Koko",
    "type": "electric",
    "type2": "fairy",
    "baseStats": {
      "hp": 70,
      "atk": 115,
      "def": 85,
      "spa": 95,
      "spd": 75,
      "spe": 130
    },
    "abilities": [
      "electricsurge",
      "telepathy"
    ]
  },
  {
    "id": "tapulele",
    "name": "Tapu Lele",
    "nameEn": "Tapu Lele",
    "type": "psychic",
    "type2": "fairy",
    "baseStats": {
      "hp": 70,
      "atk": 85,
      "def": 75,
      "spa": 130,
      "spd": 115,
      "spe": 95
    },
    "abilities": [
      "psychicsurge",
      "telepathy"
    ]
  },
  {
    "id": "tapubulu",
    "name": "Tapu Bulu",
    "nameEn": "Tapu Bulu",
    "type": "grass",
    "type2": "fairy",
    "baseStats": {
      "hp": 70,
      "atk": 130,
      "def": 115,
      "spa": 85,
      "spd": 95,
      "spe": 75
    },
    "abilities": [
      "grassysurge",
      "telepathy"
    ]
  },
  {
    "id": "tapufini",
    "name": "Tapu Fini",
    "nameEn": "Tapu Fini",
    "type": "water",
    "type2": "fairy",
    "baseStats": {
      "hp": 70,
      "atk": 75,
      "def": 115,
      "spa": 95,
      "spd": 130,
      "spe": 85
    },
    "abilities": [
      "mistysurge",
      "telepathy"
    ]
  },
  {
    "id": "cosmog",
    "name": "Cosmog",
    "nameEn": "Cosmog",
    "type": "psychic",
    "baseStats": {
      "hp": 43,
      "atk": 29,
      "def": 31,
      "spa": 29,
      "spd": 31,
      "spe": 37
    },
    "abilities": [
      "unaware"
    ]
  },
  {
    "id": "cosmoem",
    "name": "Cosmoem",
    "nameEn": "Cosmoem",
    "type": "psychic",
    "baseStats": {
      "hp": 43,
      "atk": 29,
      "def": 131,
      "spa": 29,
      "spd": 131,
      "spe": 37
    },
    "abilities": [
      "sturdy"
    ]
  },
  {
    "id": "solgaleo",
    "name": "Solgaleo",
    "nameEn": "Solgaleo",
    "type": "psychic",
    "type2": "steel",
    "baseStats": {
      "hp": 137,
      "atk": 137,
      "def": 107,
      "spa": 113,
      "spd": 89,
      "spe": 97
    },
    "abilities": [
      "fullmetalbody"
    ]
  },
  {
    "id": "lunala",
    "name": "Lunala",
    "nameEn": "Lunala",
    "type": "psychic",
    "type2": "ghost",
    "baseStats": {
      "hp": 137,
      "atk": 113,
      "def": 89,
      "spa": 137,
      "spd": 107,
      "spe": 97
    },
    "abilities": [
      "shadowshield"
    ]
  },
  {
    "id": "nihilego",
    "name": "Nihilego",
    "nameEn": "Nihilego",
    "type": "rock",
    "type2": "poison",
    "baseStats": {
      "hp": 109,
      "atk": 53,
      "def": 47,
      "spa": 127,
      "spd": 131,
      "spe": 103
    },
    "abilities": [
      "beastboost"
    ]
  },
  {
    "id": "buzzwole",
    "name": "Buzzwole",
    "nameEn": "Buzzwole",
    "type": "bug",
    "type2": "fighting",
    "baseStats": {
      "hp": 107,
      "atk": 139,
      "def": 139,
      "spa": 53,
      "spd": 53,
      "spe": 79
    },
    "abilities": [
      "beastboost"
    ]
  },
  {
    "id": "pheromosa",
    "name": "Pheromosa",
    "nameEn": "Pheromosa",
    "type": "bug",
    "type2": "fighting",
    "baseStats": {
      "hp": 71,
      "atk": 137,
      "def": 37,
      "spa": 137,
      "spd": 37,
      "spe": 151
    },
    "abilities": [
      "beastboost"
    ]
  },
  {
    "id": "xurkitree",
    "name": "Xurkitree",
    "nameEn": "Xurkitree",
    "type": "electric",
    "baseStats": {
      "hp": 83,
      "atk": 89,
      "def": 71,
      "spa": 173,
      "spd": 71,
      "spe": 83
    },
    "abilities": [
      "beastboost"
    ]
  },
  {
    "id": "celesteela",
    "name": "Celesteela",
    "nameEn": "Celesteela",
    "type": "steel",
    "type2": "flying",
    "baseStats": {
      "hp": 97,
      "atk": 101,
      "def": 103,
      "spa": 107,
      "spd": 101,
      "spe": 61
    },
    "abilities": [
      "beastboost"
    ]
  },
  {
    "id": "kartana",
    "name": "Kartana",
    "nameEn": "Kartana",
    "type": "grass",
    "type2": "steel",
    "baseStats": {
      "hp": 59,
      "atk": 181,
      "def": 131,
      "spa": 59,
      "spd": 31,
      "spe": 109
    },
    "abilities": [
      "beastboost"
    ]
  },
  {
    "id": "guzzlord",
    "name": "Guzzlord",
    "nameEn": "Guzzlord",
    "type": "dark",
    "type2": "dragon",
    "baseStats": {
      "hp": 223,
      "atk": 101,
      "def": 53,
      "spa": 97,
      "spd": 53,
      "spe": 43
    },
    "abilities": [
      "beastboost"
    ]
  },
  {
    "id": "necrozma",
    "name": "Necrozma",
    "nameEn": "Necrozma",
    "type": "psychic",
    "baseStats": {
      "hp": 97,
      "atk": 107,
      "def": 101,
      "spa": 127,
      "spd": 89,
      "spe": 79
    },
    "abilities": [
      "prismarmor"
    ]
  },
  {
    "id": "magearna",
    "name": "Magearna",
    "nameEn": "Magearna",
    "type": "steel",
    "type2": "fairy",
    "baseStats": {
      "hp": 80,
      "atk": 95,
      "def": 115,
      "spa": 130,
      "spd": 115,
      "spe": 65
    },
    "abilities": [
      "soul-heart"
    ]
  },
  {
    "id": "marshadow",
    "name": "Marshadow",
    "nameEn": "Marshadow",
    "type": "fighting",
    "type2": "ghost",
    "baseStats": {
      "hp": 90,
      "atk": 125,
      "def": 80,
      "spa": 90,
      "spd": 90,
      "spe": 125
    },
    "abilities": [
      "technician"
    ]
  },
  {
    "id": "poipole",
    "name": "Poipole",
    "nameEn": "Poipole",
    "type": "poison",
    "baseStats": {
      "hp": 67,
      "atk": 73,
      "def": 67,
      "spa": 73,
      "spd": 67,
      "spe": 73
    },
    "abilities": [
      "beastboost"
    ]
  },
  {
    "id": "naganadel",
    "name": "Naganadel",
    "nameEn": "Naganadel",
    "type": "poison",
    "type2": "dragon",
    "baseStats": {
      "hp": 73,
      "atk": 73,
      "def": 73,
      "spa": 127,
      "spd": 73,
      "spe": 121
    },
    "abilities": [
      "beastboost"
    ]
  },
  {
    "id": "stakataka",
    "name": "Stakataka",
    "nameEn": "Stakataka",
    "type": "rock",
    "type2": "steel",
    "baseStats": {
      "hp": 61,
      "atk": 131,
      "def": 211,
      "spa": 53,
      "spd": 101,
      "spe": 13
    },
    "abilities": [
      "beastboost"
    ]
  },
  {
    "id": "blacephalon",
    "name": "Blacephalon",
    "nameEn": "Blacephalon",
    "type": "fire",
    "type2": "ghost",
    "baseStats": {
      "hp": 53,
      "atk": 127,
      "def": 53,
      "spa": 151,
      "spd": 79,
      "spe": 107
    },
    "abilities": [
      "beastboost"
    ]
  },
  {
    "id": "zeraora",
    "name": "Zeraora",
    "nameEn": "Zeraora",
    "type": "electric",
    "baseStats": {
      "hp": 88,
      "atk": 112,
      "def": 75,
      "spa": 102,
      "spd": 80,
      "spe": 143
    },
    "abilities": [
      "voltabsorb"
    ]
  },
  {
    "id": "meltan",
    "name": "Meltan",
    "nameEn": "Meltan",
    "type": "steel",
    "baseStats": {
      "hp": 46,
      "atk": 65,
      "def": 65,
      "spa": 55,
      "spd": 35,
      "spe": 34
    },
    "abilities": [
      "magnetpull"
    ]
  },
  {
    "id": "melmetal",
    "name": "Melmetal",
    "nameEn": "Melmetal",
    "type": "steel",
    "baseStats": {
      "hp": 135,
      "atk": 143,
      "def": 143,
      "spa": 80,
      "spd": 65,
      "spe": 34
    },
    "abilities": [
      "ironfist"
    ]
  },
  {
    "id": "grookey",
    "name": "Grookey",
    "nameEn": "Grookey",
    "type": "grass",
    "baseStats": {
      "hp": 50,
      "atk": 65,
      "def": 50,
      "spa": 40,
      "spd": 40,
      "spe": 65
    },
    "abilities": [
      "overgrow",
      "grassysurge"
    ]
  },
  {
    "id": "thwackey",
    "name": "Thwackey",
    "nameEn": "Thwackey",
    "type": "grass",
    "baseStats": {
      "hp": 70,
      "atk": 85,
      "def": 70,
      "spa": 55,
      "spd": 60,
      "spe": 80
    },
    "abilities": [
      "overgrow",
      "grassysurge"
    ]
  },
  {
    "id": "rillaboom",
    "name": "Rillaboom",
    "nameEn": "Rillaboom",
    "type": "grass",
    "baseStats": {
      "hp": 100,
      "atk": 125,
      "def": 90,
      "spa": 60,
      "spd": 70,
      "spe": 85
    },
    "abilities": [
      "overgrow",
      "grassysurge"
    ]
  },
  {
    "id": "scorbunny",
    "name": "Scorbunny",
    "nameEn": "Scorbunny",
    "type": "fire",
    "baseStats": {
      "hp": 50,
      "atk": 71,
      "def": 40,
      "spa": 40,
      "spd": 40,
      "spe": 69
    },
    "abilities": [
      "blaze",
      "libero"
    ]
  },
  {
    "id": "raboot",
    "name": "Raboot",
    "nameEn": "Raboot",
    "type": "fire",
    "baseStats": {
      "hp": 65,
      "atk": 86,
      "def": 60,
      "spa": 55,
      "spd": 60,
      "spe": 94
    },
    "abilities": [
      "blaze",
      "libero"
    ]
  },
  {
    "id": "cinderace",
    "name": "Cinderace",
    "nameEn": "Cinderace",
    "type": "fire",
    "baseStats": {
      "hp": 80,
      "atk": 116,
      "def": 75,
      "spa": 65,
      "spd": 75,
      "spe": 119
    },
    "abilities": [
      "blaze",
      "libero"
    ]
  },
  {
    "id": "sobble",
    "name": "Sobble",
    "nameEn": "Sobble",
    "type": "water",
    "baseStats": {
      "hp": 50,
      "atk": 40,
      "def": 40,
      "spa": 70,
      "spd": 40,
      "spe": 70
    },
    "abilities": [
      "torrent",
      "sniper"
    ]
  },
  {
    "id": "drizzile",
    "name": "Drizzile",
    "nameEn": "Drizzile",
    "type": "water",
    "baseStats": {
      "hp": 65,
      "atk": 60,
      "def": 55,
      "spa": 95,
      "spd": 55,
      "spe": 90
    },
    "abilities": [
      "torrent",
      "sniper"
    ]
  },
  {
    "id": "inteleon",
    "name": "Inteleon",
    "nameEn": "Inteleon",
    "type": "water",
    "baseStats": {
      "hp": 70,
      "atk": 85,
      "def": 65,
      "spa": 125,
      "spd": 65,
      "spe": 120
    },
    "abilities": [
      "torrent",
      "sniper"
    ]
  },
  {
    "id": "skwovet",
    "name": "Skwovet",
    "nameEn": "Skwovet",
    "type": "normal",
    "baseStats": {
      "hp": 70,
      "atk": 55,
      "def": 55,
      "spa": 35,
      "spd": 35,
      "spe": 25
    },
    "abilities": [
      "cheekpouch",
      "gluttony"
    ]
  },
  {
    "id": "greedent",
    "name": "Greedent",
    "nameEn": "Greedent",
    "type": "normal",
    "baseStats": {
      "hp": 120,
      "atk": 95,
      "def": 95,
      "spa": 55,
      "spd": 75,
      "spe": 20
    },
    "abilities": [
      "cheekpouch",
      "gluttony"
    ]
  },
  {
    "id": "rookidee",
    "name": "Rookidee",
    "nameEn": "Rookidee",
    "type": "flying",
    "baseStats": {
      "hp": 38,
      "atk": 47,
      "def": 35,
      "spa": 33,
      "spd": 35,
      "spe": 57
    },
    "abilities": [
      "keeneye",
      "unnerve",
      "bigpecks"
    ]
  },
  {
    "id": "corvisquire",
    "name": "Corvisquire",
    "nameEn": "Corvisquire",
    "type": "flying",
    "baseStats": {
      "hp": 68,
      "atk": 67,
      "def": 55,
      "spa": 43,
      "spd": 55,
      "spe": 77
    },
    "abilities": [
      "keeneye",
      "unnerve",
      "bigpecks"
    ]
  },
  {
    "id": "corviknight",
    "name": "Corviknight",
    "nameEn": "Corviknight",
    "type": "flying",
    "type2": "steel",
    "baseStats": {
      "hp": 98,
      "atk": 87,
      "def": 105,
      "spa": 53,
      "spd": 85,
      "spe": 67
    },
    "abilities": [
      "pressure",
      "unnerve",
      "mirrorarmor"
    ]
  },
  {
    "id": "blipbug",
    "name": "Blipbug",
    "nameEn": "Blipbug",
    "type": "bug",
    "baseStats": {
      "hp": 25,
      "atk": 20,
      "def": 20,
      "spa": 25,
      "spd": 45,
      "spe": 45
    },
    "abilities": [
      "swarm",
      "compoundeyes",
      "telepathy"
    ]
  },
  {
    "id": "dottler",
    "name": "Dottler",
    "nameEn": "Dottler",
    "type": "bug",
    "type2": "psychic",
    "baseStats": {
      "hp": 50,
      "atk": 35,
      "def": 80,
      "spa": 50,
      "spd": 90,
      "spe": 30
    },
    "abilities": [
      "swarm",
      "compoundeyes",
      "telepathy"
    ]
  },
  {
    "id": "orbeetle",
    "name": "Orbeetle",
    "nameEn": "Orbeetle",
    "type": "bug",
    "type2": "psychic",
    "baseStats": {
      "hp": 60,
      "atk": 45,
      "def": 110,
      "spa": 80,
      "spd": 120,
      "spe": 90
    },
    "abilities": [
      "swarm",
      "frisk",
      "telepathy"
    ]
  },
  {
    "id": "nickit",
    "name": "Nickit",
    "nameEn": "Nickit",
    "type": "dark",
    "baseStats": {
      "hp": 40,
      "atk": 28,
      "def": 28,
      "spa": 47,
      "spd": 52,
      "spe": 50
    },
    "abilities": [
      "runaway",
      "unburden",
      "stakeout"
    ]
  },
  {
    "id": "thievul",
    "name": "Thievul",
    "nameEn": "Thievul",
    "type": "dark",
    "baseStats": {
      "hp": 70,
      "atk": 58,
      "def": 58,
      "spa": 87,
      "spd": 92,
      "spe": 90
    },
    "abilities": [
      "runaway",
      "unburden",
      "stakeout"
    ]
  },
  {
    "id": "gossifleur",
    "name": "Gossifleur",
    "nameEn": "Gossifleur",
    "type": "grass",
    "baseStats": {
      "hp": 40,
      "atk": 40,
      "def": 60,
      "spa": 40,
      "spd": 60,
      "spe": 10
    },
    "abilities": [
      "cottondown",
      "regenerator",
      "effectspore"
    ]
  },
  {
    "id": "eldegoss",
    "name": "Eldegoss",
    "nameEn": "Eldegoss",
    "type": "grass",
    "baseStats": {
      "hp": 60,
      "atk": 50,
      "def": 90,
      "spa": 80,
      "spd": 120,
      "spe": 60
    },
    "abilities": [
      "cottondown",
      "regenerator",
      "effectspore"
    ]
  },
  {
    "id": "wooloo",
    "name": "Wooloo",
    "nameEn": "Wooloo",
    "type": "normal",
    "baseStats": {
      "hp": 42,
      "atk": 40,
      "def": 55,
      "spa": 40,
      "spd": 45,
      "spe": 48
    },
    "abilities": [
      "fluffy",
      "runaway",
      "bulletproof"
    ]
  },
  {
    "id": "dubwool",
    "name": "Dubwool",
    "nameEn": "Dubwool",
    "type": "normal",
    "baseStats": {
      "hp": 72,
      "atk": 80,
      "def": 100,
      "spa": 60,
      "spd": 90,
      "spe": 88
    },
    "abilities": [
      "fluffy",
      "steadfast",
      "bulletproof"
    ]
  },
  {
    "id": "chewtle",
    "name": "Chewtle",
    "nameEn": "Chewtle",
    "type": "water",
    "baseStats": {
      "hp": 50,
      "atk": 64,
      "def": 50,
      "spa": 38,
      "spd": 38,
      "spe": 44
    },
    "abilities": [
      "strongjaw",
      "shellarmor",
      "swiftswim"
    ]
  },
  {
    "id": "drednaw",
    "name": "Drednaw",
    "nameEn": "Drednaw",
    "type": "water",
    "type2": "rock",
    "baseStats": {
      "hp": 90,
      "atk": 115,
      "def": 90,
      "spa": 48,
      "spd": 68,
      "spe": 74
    },
    "abilities": [
      "strongjaw",
      "shellarmor",
      "swiftswim"
    ]
  },
  {
    "id": "yamper",
    "name": "Yamper",
    "nameEn": "Yamper",
    "type": "electric",
    "baseStats": {
      "hp": 59,
      "atk": 45,
      "def": 50,
      "spa": 40,
      "spd": 50,
      "spe": 26
    },
    "abilities": [
      "ballfetch",
      "rattled"
    ]
  },
  {
    "id": "boltund",
    "name": "Boltund",
    "nameEn": "Boltund",
    "type": "electric",
    "baseStats": {
      "hp": 69,
      "atk": 90,
      "def": 60,
      "spa": 90,
      "spd": 60,
      "spe": 121
    },
    "abilities": [
      "strongjaw",
      "competitive"
    ]
  },
  {
    "id": "rolycoly",
    "name": "Rolycoly",
    "nameEn": "Rolycoly",
    "type": "rock",
    "baseStats": {
      "hp": 30,
      "atk": 40,
      "def": 50,
      "spa": 40,
      "spd": 50,
      "spe": 30
    },
    "abilities": [
      "steamengine",
      "heatproof",
      "flashfire"
    ]
  },
  {
    "id": "carkol",
    "name": "Carkol",
    "nameEn": "Carkol",
    "type": "rock",
    "type2": "fire",
    "baseStats": {
      "hp": 80,
      "atk": 60,
      "def": 90,
      "spa": 60,
      "spd": 70,
      "spe": 50
    },
    "abilities": [
      "steamengine",
      "flamebody",
      "flashfire"
    ]
  },
  {
    "id": "coalossal",
    "name": "Coalossal",
    "nameEn": "Coalossal",
    "type": "rock",
    "type2": "fire",
    "baseStats": {
      "hp": 110,
      "atk": 80,
      "def": 120,
      "spa": 80,
      "spd": 90,
      "spe": 30
    },
    "abilities": [
      "steamengine",
      "flamebody",
      "flashfire"
    ]
  },
  {
    "id": "applin",
    "name": "Applin",
    "nameEn": "Applin",
    "type": "grass",
    "type2": "dragon",
    "baseStats": {
      "hp": 40,
      "atk": 40,
      "def": 80,
      "spa": 40,
      "spd": 40,
      "spe": 20
    },
    "abilities": [
      "ripen",
      "gluttony",
      "bulletproof"
    ]
  },
  {
    "id": "flapple",
    "name": "Flapple",
    "nameEn": "Flapple",
    "type": "grass",
    "type2": "dragon",
    "baseStats": {
      "hp": 70,
      "atk": 110,
      "def": 80,
      "spa": 95,
      "spd": 60,
      "spe": 70
    },
    "abilities": [
      "ripen",
      "gluttony",
      "hustle"
    ]
  },
  {
    "id": "appletun",
    "name": "Appletun",
    "nameEn": "Appletun",
    "type": "grass",
    "type2": "dragon",
    "baseStats": {
      "hp": 110,
      "atk": 85,
      "def": 80,
      "spa": 100,
      "spd": 80,
      "spe": 30
    },
    "abilities": [
      "ripen",
      "gluttony",
      "thickfat"
    ]
  },
  {
    "id": "silicobra",
    "name": "Silicobra",
    "nameEn": "Silicobra",
    "type": "ground",
    "baseStats": {
      "hp": 52,
      "atk": 57,
      "def": 75,
      "spa": 35,
      "spd": 50,
      "spe": 46
    },
    "abilities": [
      "sandspit",
      "shedskin",
      "sandveil"
    ]
  },
  {
    "id": "sandaconda",
    "name": "Sandaconda",
    "nameEn": "Sandaconda",
    "type": "ground",
    "baseStats": {
      "hp": 72,
      "atk": 107,
      "def": 125,
      "spa": 65,
      "spd": 70,
      "spe": 71
    },
    "abilities": [
      "sandspit",
      "shedskin",
      "sandveil"
    ]
  },
  {
    "id": "cramorant",
    "name": "Cramorant",
    "nameEn": "Cramorant",
    "type": "flying",
    "type2": "water",
    "baseStats": {
      "hp": 70,
      "atk": 85,
      "def": 55,
      "spa": 85,
      "spd": 95,
      "spe": 85
    },
    "abilities": [
      "gulpmissile"
    ]
  },
  {
    "id": "arrokuda",
    "name": "Arrokuda",
    "nameEn": "Arrokuda",
    "type": "water",
    "baseStats": {
      "hp": 41,
      "atk": 63,
      "def": 40,
      "spa": 40,
      "spd": 30,
      "spe": 66
    },
    "abilities": [
      "swiftswim",
      "propellertail"
    ]
  },
  {
    "id": "barraskewda",
    "name": "Barraskewda",
    "nameEn": "Barraskewda",
    "type": "water",
    "baseStats": {
      "hp": 61,
      "atk": 123,
      "def": 60,
      "spa": 60,
      "spd": 50,
      "spe": 136
    },
    "abilities": [
      "swiftswim",
      "propellertail"
    ]
  },
  {
    "id": "toxel",
    "name": "Toxel",
    "nameEn": "Toxel",
    "type": "electric",
    "type2": "poison",
    "baseStats": {
      "hp": 40,
      "atk": 38,
      "def": 35,
      "spa": 54,
      "spd": 35,
      "spe": 40
    },
    "abilities": [
      "rattled",
      "static",
      "klutz"
    ]
  },
  {
    "id": "toxtricity",
    "name": "Toxtricity",
    "nameEn": "Toxtricity",
    "type": "electric",
    "type2": "poison",
    "baseStats": {
      "hp": 75,
      "atk": 98,
      "def": 70,
      "spa": 114,
      "spd": 70,
      "spe": 75
    },
    "abilities": [
      "punkrock",
      "plus",
      "technician"
    ]
  },
  {
    "id": "sizzlipede",
    "name": "Sizzlipede",
    "nameEn": "Sizzlipede",
    "type": "fire",
    "type2": "bug",
    "baseStats": {
      "hp": 50,
      "atk": 65,
      "def": 45,
      "spa": 50,
      "spd": 50,
      "spe": 45
    },
    "abilities": [
      "flashfire",
      "whitesmoke",
      "flamebody"
    ]
  },
  {
    "id": "centiskorch",
    "name": "Centiskorch",
    "nameEn": "Centiskorch",
    "type": "fire",
    "type2": "bug",
    "baseStats": {
      "hp": 100,
      "atk": 115,
      "def": 65,
      "spa": 90,
      "spd": 90,
      "spe": 65
    },
    "abilities": [
      "flashfire",
      "whitesmoke",
      "flamebody"
    ]
  },
  {
    "id": "clobbopus",
    "name": "Clobbopus",
    "nameEn": "Clobbopus",
    "type": "fighting",
    "baseStats": {
      "hp": 50,
      "atk": 68,
      "def": 60,
      "spa": 50,
      "spd": 50,
      "spe": 32
    },
    "abilities": [
      "limber",
      "technician"
    ]
  },
  {
    "id": "grapploct",
    "name": "Grapploct",
    "nameEn": "Grapploct",
    "type": "fighting",
    "baseStats": {
      "hp": 80,
      "atk": 118,
      "def": 90,
      "spa": 70,
      "spd": 80,
      "spe": 42
    },
    "abilities": [
      "limber",
      "technician"
    ]
  },
  {
    "id": "sinistea",
    "name": "Sinistea",
    "nameEn": "Sinistea",
    "type": "ghost",
    "baseStats": {
      "hp": 40,
      "atk": 45,
      "def": 45,
      "spa": 74,
      "spd": 54,
      "spe": 50
    },
    "abilities": [
      "weakarmor",
      "cursedbody"
    ]
  },
  {
    "id": "polteageist",
    "name": "Polteageist",
    "nameEn": "Polteageist",
    "type": "ghost",
    "baseStats": {
      "hp": 60,
      "atk": 65,
      "def": 65,
      "spa": 134,
      "spd": 114,
      "spe": 70
    },
    "abilities": [
      "weakarmor",
      "cursedbody"
    ]
  },
  {
    "id": "hatenna",
    "name": "Hatenna",
    "nameEn": "Hatenna",
    "type": "psychic",
    "baseStats": {
      "hp": 42,
      "atk": 30,
      "def": 45,
      "spa": 56,
      "spd": 53,
      "spe": 39
    },
    "abilities": [
      "healer",
      "anticipation",
      "magicbounce"
    ]
  },
  {
    "id": "hattrem",
    "name": "Hattrem",
    "nameEn": "Hattrem",
    "type": "psychic",
    "baseStats": {
      "hp": 57,
      "atk": 40,
      "def": 65,
      "spa": 86,
      "spd": 73,
      "spe": 49
    },
    "abilities": [
      "healer",
      "anticipation",
      "magicbounce"
    ]
  },
  {
    "id": "hatterene",
    "name": "Hatterene",
    "nameEn": "Hatterene",
    "type": "psychic",
    "type2": "fairy",
    "baseStats": {
      "hp": 57,
      "atk": 90,
      "def": 95,
      "spa": 136,
      "spd": 103,
      "spe": 29
    },
    "abilities": [
      "healer",
      "anticipation",
      "magicbounce"
    ]
  },
  {
    "id": "impidimp",
    "name": "Impidimp",
    "nameEn": "Impidimp",
    "type": "dark",
    "type2": "fairy",
    "baseStats": {
      "hp": 45,
      "atk": 45,
      "def": 30,
      "spa": 55,
      "spd": 40,
      "spe": 50
    },
    "abilities": [
      "prankster",
      "frisk",
      "pickpocket"
    ]
  },
  {
    "id": "morgrem",
    "name": "Morgrem",
    "nameEn": "Morgrem",
    "type": "dark",
    "type2": "fairy",
    "baseStats": {
      "hp": 65,
      "atk": 60,
      "def": 45,
      "spa": 75,
      "spd": 55,
      "spe": 70
    },
    "abilities": [
      "prankster",
      "frisk",
      "pickpocket"
    ]
  },
  {
    "id": "grimmsnarl",
    "name": "Grimmsnarl",
    "nameEn": "Grimmsnarl",
    "type": "dark",
    "type2": "fairy",
    "baseStats": {
      "hp": 95,
      "atk": 120,
      "def": 65,
      "spa": 95,
      "spd": 75,
      "spe": 60
    },
    "abilities": [
      "prankster",
      "frisk",
      "pickpocket"
    ]
  },
  {
    "id": "obstagoon",
    "name": "Obstagoon",
    "nameEn": "Obstagoon",
    "type": "dark",
    "type2": "normal",
    "baseStats": {
      "hp": 93,
      "atk": 90,
      "def": 101,
      "spa": 60,
      "spd": 81,
      "spe": 95
    },
    "abilities": [
      "reckless",
      "guts",
      "defiant"
    ]
  },
  {
    "id": "perrserker",
    "name": "Perrserker",
    "nameEn": "Perrserker",
    "type": "steel",
    "baseStats": {
      "hp": 70,
      "atk": 110,
      "def": 100,
      "spa": 50,
      "spd": 60,
      "spe": 50
    },
    "abilities": [
      "battlearmor",
      "toughclaws",
      "steelyspirit"
    ]
  },
  {
    "id": "cursola",
    "name": "Cursola",
    "nameEn": "Cursola",
    "type": "ghost",
    "baseStats": {
      "hp": 60,
      "atk": 95,
      "def": 50,
      "spa": 145,
      "spd": 130,
      "spe": 30
    },
    "abilities": [
      "weakarmor",
      "perishbody"
    ]
  },
  {
    "id": "sirfetchd",
    "name": "Sirfetch\u2019d",
    "nameEn": "Sirfetch\u2019d",
    "type": "fighting",
    "baseStats": {
      "hp": 62,
      "atk": 135,
      "def": 95,
      "spa": 68,
      "spd": 82,
      "spe": 65
    },
    "abilities": [
      "steadfast",
      "scrappy"
    ]
  },
  {
    "id": "mrrime",
    "name": "Mr. Rime",
    "nameEn": "Mr. Rime",
    "type": "ice",
    "type2": "psychic",
    "baseStats": {
      "hp": 80,
      "atk": 85,
      "def": 75,
      "spa": 110,
      "spd": 100,
      "spe": 70
    },
    "abilities": [
      "tangledfeet",
      "screencleaner",
      "icebody"
    ]
  },
  {
    "id": "runerigus",
    "name": "Runerigus",
    "nameEn": "Runerigus",
    "type": "ground",
    "type2": "ghost",
    "baseStats": {
      "hp": 58,
      "atk": 95,
      "def": 145,
      "spa": 50,
      "spd": 105,
      "spe": 30
    },
    "abilities": [
      "wanderingspirit"
    ]
  },
  {
    "id": "milcery",
    "name": "Milcery",
    "nameEn": "Milcery",
    "type": "fairy",
    "baseStats": {
      "hp": 45,
      "atk": 40,
      "def": 40,
      "spa": 50,
      "spd": 61,
      "spe": 34
    },
    "abilities": [
      "sweetveil",
      "aromaveil"
    ]
  },
  {
    "id": "alcremie",
    "name": "Alcremie",
    "nameEn": "Alcremie",
    "type": "fairy",
    "baseStats": {
      "hp": 65,
      "atk": 60,
      "def": 75,
      "spa": 110,
      "spd": 121,
      "spe": 64
    },
    "abilities": [
      "sweetveil",
      "aromaveil"
    ]
  },
  {
    "id": "falinks",
    "name": "Falinks",
    "nameEn": "Falinks",
    "type": "fighting",
    "baseStats": {
      "hp": 65,
      "atk": 100,
      "def": 100,
      "spa": 70,
      "spd": 60,
      "spe": 75
    },
    "abilities": [
      "battlearmor",
      "defiant"
    ]
  },
  {
    "id": "pincurchin",
    "name": "Pincurchin",
    "nameEn": "Pincurchin",
    "type": "electric",
    "baseStats": {
      "hp": 48,
      "atk": 101,
      "def": 95,
      "spa": 91,
      "spd": 85,
      "spe": 15
    },
    "abilities": [
      "lightningrod",
      "electricsurge"
    ]
  },
  {
    "id": "snom",
    "name": "Snom",
    "nameEn": "Snom",
    "type": "ice",
    "type2": "bug",
    "baseStats": {
      "hp": 30,
      "atk": 25,
      "def": 35,
      "spa": 45,
      "spd": 30,
      "spe": 20
    },
    "abilities": [
      "shielddust",
      "icescales"
    ]
  },
  {
    "id": "frosmoth",
    "name": "Frosmoth",
    "nameEn": "Frosmoth",
    "type": "ice",
    "type2": "bug",
    "baseStats": {
      "hp": 70,
      "atk": 65,
      "def": 60,
      "spa": 125,
      "spd": 90,
      "spe": 65
    },
    "abilities": [
      "shielddust",
      "icescales"
    ]
  },
  {
    "id": "stonjourner",
    "name": "Stonjourner",
    "nameEn": "Stonjourner",
    "type": "rock",
    "baseStats": {
      "hp": 100,
      "atk": 125,
      "def": 135,
      "spa": 20,
      "spd": 20,
      "spe": 70
    },
    "abilities": [
      "powerspot"
    ]
  },
  {
    "id": "eiscue",
    "name": "Eiscue",
    "nameEn": "Eiscue",
    "type": "ice",
    "baseStats": {
      "hp": 75,
      "atk": 80,
      "def": 110,
      "spa": 65,
      "spd": 90,
      "spe": 50
    },
    "abilities": [
      "iceface"
    ]
  },
  {
    "id": "indeedee",
    "name": "Indeedee",
    "nameEn": "Indeedee",
    "type": "psychic",
    "type2": "normal",
    "baseStats": {
      "hp": 60,
      "atk": 65,
      "def": 55,
      "spa": 105,
      "spd": 95,
      "spe": 95
    },
    "abilities": [
      "innerfocus",
      "synchronize",
      "psychicsurge"
    ]
  },
  {
    "id": "morpeko",
    "name": "Morpeko",
    "nameEn": "Morpeko",
    "type": "electric",
    "type2": "dark",
    "baseStats": {
      "hp": 58,
      "atk": 95,
      "def": 58,
      "spa": 70,
      "spd": 58,
      "spe": 97
    },
    "abilities": [
      "hungerswitch"
    ]
  },
  {
    "id": "cufant",
    "name": "Cufant",
    "nameEn": "Cufant",
    "type": "steel",
    "baseStats": {
      "hp": 72,
      "atk": 80,
      "def": 49,
      "spa": 40,
      "spd": 49,
      "spe": 40
    },
    "abilities": [
      "sheerforce",
      "heavymetal"
    ]
  },
  {
    "id": "copperajah",
    "name": "Copperajah",
    "nameEn": "Copperajah",
    "type": "steel",
    "baseStats": {
      "hp": 122,
      "atk": 130,
      "def": 69,
      "spa": 80,
      "spd": 69,
      "spe": 30
    },
    "abilities": [
      "sheerforce",
      "heavymetal"
    ]
  },
  {
    "id": "dracozolt",
    "name": "Dracozolt",
    "nameEn": "Dracozolt",
    "type": "electric",
    "type2": "dragon",
    "baseStats": {
      "hp": 90,
      "atk": 100,
      "def": 90,
      "spa": 80,
      "spd": 70,
      "spe": 75
    },
    "abilities": [
      "voltabsorb",
      "hustle",
      "sandrush"
    ]
  },
  {
    "id": "arctozolt",
    "name": "Arctozolt",
    "nameEn": "Arctozolt",
    "type": "electric",
    "type2": "ice",
    "baseStats": {
      "hp": 90,
      "atk": 100,
      "def": 90,
      "spa": 90,
      "spd": 80,
      "spe": 55
    },
    "abilities": [
      "voltabsorb",
      "static",
      "slushrush"
    ]
  },
  {
    "id": "dracovish",
    "name": "Dracovish",
    "nameEn": "Dracovish",
    "type": "water",
    "type2": "dragon",
    "baseStats": {
      "hp": 90,
      "atk": 90,
      "def": 100,
      "spa": 70,
      "spd": 80,
      "spe": 75
    },
    "abilities": [
      "waterabsorb",
      "strongjaw",
      "sandrush"
    ]
  },
  {
    "id": "arctovish",
    "name": "Arctovish",
    "nameEn": "Arctovish",
    "type": "water",
    "type2": "ice",
    "baseStats": {
      "hp": 90,
      "atk": 90,
      "def": 100,
      "spa": 80,
      "spd": 90,
      "spe": 55
    },
    "abilities": [
      "waterabsorb",
      "icebody",
      "slushrush"
    ]
  },
  {
    "id": "duraludon",
    "name": "Duraludon",
    "nameEn": "Duraludon",
    "type": "steel",
    "type2": "dragon",
    "baseStats": {
      "hp": 70,
      "atk": 95,
      "def": 115,
      "spa": 120,
      "spd": 50,
      "spe": 85
    },
    "abilities": [
      "lightmetal",
      "heavymetal",
      "stalwart"
    ]
  },
  {
    "id": "dreepy",
    "name": "Dreepy",
    "nameEn": "Dreepy",
    "type": "dragon",
    "type2": "ghost",
    "baseStats": {
      "hp": 28,
      "atk": 60,
      "def": 30,
      "spa": 40,
      "spd": 30,
      "spe": 82
    },
    "abilities": [
      "clearbody",
      "infiltrator",
      "cursedbody"
    ]
  },
  {
    "id": "drakloak",
    "name": "Drakloak",
    "nameEn": "Drakloak",
    "type": "dragon",
    "type2": "ghost",
    "baseStats": {
      "hp": 68,
      "atk": 80,
      "def": 50,
      "spa": 60,
      "spd": 50,
      "spe": 102
    },
    "abilities": [
      "clearbody",
      "infiltrator",
      "cursedbody"
    ]
  },
  {
    "id": "dragapult",
    "name": "Dragapult",
    "nameEn": "Dragapult",
    "type": "dragon",
    "type2": "ghost",
    "baseStats": {
      "hp": 88,
      "atk": 120,
      "def": 75,
      "spa": 100,
      "spd": 75,
      "spe": 142
    },
    "abilities": [
      "clearbody",
      "infiltrator",
      "cursedbody"
    ]
  },
  {
    "id": "zacian",
    "name": "Zacian",
    "nameEn": "Zacian",
    "type": "fairy",
    "baseStats": {
      "hp": 92,
      "atk": 120,
      "def": 115,
      "spa": 80,
      "spd": 115,
      "spe": 138
    },
    "abilities": [
      "intrepidsword"
    ]
  },
  {
    "id": "zamazenta",
    "name": "Zamazenta",
    "nameEn": "Zamazenta",
    "type": "fighting",
    "baseStats": {
      "hp": 92,
      "atk": 120,
      "def": 115,
      "spa": 80,
      "spd": 115,
      "spe": 138
    },
    "abilities": [
      "dauntlessshield"
    ]
  },
  {
    "id": "eternatus",
    "name": "Eternatus",
    "nameEn": "Eternatus",
    "type": "poison",
    "type2": "dragon",
    "baseStats": {
      "hp": 140,
      "atk": 85,
      "def": 95,
      "spa": 145,
      "spd": 95,
      "spe": 130
    },
    "abilities": [
      "pressure"
    ]
  },
  {
    "id": "kubfu",
    "name": "Kubfu",
    "nameEn": "Kubfu",
    "type": "fighting",
    "baseStats": {
      "hp": 60,
      "atk": 90,
      "def": 60,
      "spa": 53,
      "spd": 50,
      "spe": 72
    },
    "abilities": [
      "innerfocus"
    ]
  },
  {
    "id": "urshifu",
    "name": "Urshifu",
    "nameEn": "Urshifu",
    "type": "fighting",
    "type2": "dark",
    "baseStats": {
      "hp": 100,
      "atk": 130,
      "def": 100,
      "spa": 63,
      "spd": 60,
      "spe": 97
    },
    "abilities": [
      "unseenfist"
    ]
  },
  {
    "id": "zarude",
    "name": "Zarude",
    "nameEn": "Zarude",
    "type": "dark",
    "type2": "grass",
    "baseStats": {
      "hp": 105,
      "atk": 120,
      "def": 105,
      "spa": 70,
      "spd": 95,
      "spe": 105
    },
    "abilities": [
      "leafguard"
    ]
  },
  {
    "id": "regieleki",
    "name": "Regieleki",
    "nameEn": "Regieleki",
    "type": "electric",
    "baseStats": {
      "hp": 80,
      "atk": 100,
      "def": 50,
      "spa": 100,
      "spd": 50,
      "spe": 200
    },
    "abilities": [
      "transistor"
    ]
  },
  {
    "id": "regidrago",
    "name": "Regidrago",
    "nameEn": "Regidrago",
    "type": "dragon",
    "baseStats": {
      "hp": 200,
      "atk": 100,
      "def": 50,
      "spa": 100,
      "spd": 50,
      "spe": 80
    },
    "abilities": [
      "dragon'smaw"
    ]
  },
  {
    "id": "glastrier",
    "name": "Glastrier",
    "nameEn": "Glastrier",
    "type": "ice",
    "baseStats": {
      "hp": 100,
      "atk": 145,
      "def": 130,
      "spa": 65,
      "spd": 110,
      "spe": 30
    },
    "abilities": [
      "chillingneigh"
    ]
  },
  {
    "id": "spectrier",
    "name": "Spectrier",
    "nameEn": "Spectrier",
    "type": "ghost",
    "baseStats": {
      "hp": 100,
      "atk": 65,
      "def": 60,
      "spa": 145,
      "spd": 80,
      "spe": 130
    },
    "abilities": [
      "grimneigh"
    ]
  },
  {
    "id": "calyrex",
    "name": "Calyrex",
    "nameEn": "Calyrex",
    "type": "psychic",
    "type2": "grass",
    "baseStats": {
      "hp": 100,
      "atk": 80,
      "def": 80,
      "spa": 80,
      "spd": 80,
      "spe": 80
    },
    "abilities": [
      "unnerve"
    ]
  },
  {
    "id": "wyrdeer",
    "name": "Wyrdeer",
    "nameEn": "Wyrdeer",
    "type": "normal",
    "type2": "psychic",
    "baseStats": {
      "hp": 103,
      "atk": 105,
      "def": 72,
      "spa": 105,
      "spd": 75,
      "spe": 65
    },
    "abilities": [
      "intimidate",
      "frisk",
      "sapsipper"
    ]
  },
  {
    "id": "kleavor",
    "name": "Kleavor",
    "nameEn": "Kleavor",
    "type": "bug",
    "type2": "rock",
    "baseStats": {
      "hp": 70,
      "atk": 135,
      "def": 95,
      "spa": 45,
      "spd": 70,
      "spe": 85
    },
    "abilities": [
      "swarm",
      "sheerforce",
      "sharpness"
    ]
  },
  {
    "id": "ursaluna",
    "name": "Ursaluna",
    "nameEn": "Ursaluna",
    "type": "ground",
    "type2": "normal",
    "baseStats": {
      "hp": 130,
      "atk": 140,
      "def": 105,
      "spa": 45,
      "spd": 80,
      "spe": 50
    },
    "abilities": [
      "guts",
      "bulletproof",
      "unnerve"
    ]
  },
  {
    "id": "basculegion",
    "name": "Basculegion",
    "nameEn": "Basculegion",
    "type": "water",
    "type2": "ghost",
    "baseStats": {
      "hp": 120,
      "atk": 112,
      "def": 65,
      "spa": 80,
      "spd": 75,
      "spe": 78
    },
    "abilities": [
      "swiftswim",
      "adaptability",
      "moldbreaker"
    ]
  },
  {
    "id": "sneasler",
    "name": "Sneasler",
    "nameEn": "Sneasler",
    "type": "fighting",
    "type2": "poison",
    "baseStats": {
      "hp": 80,
      "atk": 130,
      "def": 60,
      "spa": 40,
      "spd": 80,
      "spe": 120
    },
    "abilities": [
      "pressure",
      "unburden",
      "poisontouch"
    ]
  },
  {
    "id": "overqwil",
    "name": "Overqwil",
    "nameEn": "Overqwil",
    "type": "dark",
    "type2": "poison",
    "baseStats": {
      "hp": 85,
      "atk": 115,
      "def": 95,
      "spa": 65,
      "spd": 65,
      "spe": 85
    },
    "abilities": [
      "poisonpoint",
      "swiftswim",
      "intimidate"
    ]
  },
  {
    "id": "enamorus",
    "name": "Enamorus",
    "nameEn": "Enamorus",
    "type": "fairy",
    "type2": "flying",
    "baseStats": {
      "hp": 74,
      "atk": 115,
      "def": 70,
      "spa": 135,
      "spd": 80,
      "spe": 106
    },
    "abilities": [
      "cutecharm",
      "contrary"
    ]
  },
  {
    "id": "sprigatito",
    "name": "Sprigatito",
    "nameEn": "Sprigatito",
    "type": "grass",
    "baseStats": {
      "hp": 40,
      "atk": 61,
      "def": 54,
      "spa": 45,
      "spd": 45,
      "spe": 65
    },
    "abilities": [
      "overgrow",
      "protean"
    ]
  },
  {
    "id": "floragato",
    "name": "Floragato",
    "nameEn": "Floragato",
    "type": "grass",
    "baseStats": {
      "hp": 61,
      "atk": 80,
      "def": 63,
      "spa": 60,
      "spd": 63,
      "spe": 83
    },
    "abilities": [
      "overgrow",
      "protean"
    ]
  },
  {
    "id": "meowscarada",
    "name": "Meowscarada",
    "nameEn": "Meowscarada",
    "type": "grass",
    "type2": "dark",
    "baseStats": {
      "hp": 76,
      "atk": 110,
      "def": 70,
      "spa": 81,
      "spd": 70,
      "spe": 123
    },
    "abilities": [
      "overgrow",
      "protean"
    ]
  },
  {
    "id": "fuecoco",
    "name": "Fuecoco",
    "nameEn": "Fuecoco",
    "type": "fire",
    "baseStats": {
      "hp": 67,
      "atk": 45,
      "def": 59,
      "spa": 63,
      "spd": 40,
      "spe": 36
    },
    "abilities": [
      "blaze",
      "unaware"
    ]
  },
  {
    "id": "crocalor",
    "name": "Crocalor",
    "nameEn": "Crocalor",
    "type": "fire",
    "baseStats": {
      "hp": 81,
      "atk": 55,
      "def": 78,
      "spa": 90,
      "spd": 58,
      "spe": 49
    },
    "abilities": [
      "blaze",
      "unaware"
    ]
  },
  {
    "id": "skeledirge",
    "name": "Skeledirge",
    "nameEn": "Skeledirge",
    "type": "fire",
    "type2": "ghost",
    "baseStats": {
      "hp": 104,
      "atk": 75,
      "def": 100,
      "spa": 110,
      "spd": 75,
      "spe": 66
    },
    "abilities": [
      "blaze",
      "unaware"
    ]
  },
  {
    "id": "quaxly",
    "name": "Quaxly",
    "nameEn": "Quaxly",
    "type": "water",
    "baseStats": {
      "hp": 55,
      "atk": 65,
      "def": 45,
      "spa": 50,
      "spd": 45,
      "spe": 50
    },
    "abilities": [
      "torrent",
      "moxie"
    ]
  },
  {
    "id": "quaxwell",
    "name": "Quaxwell",
    "nameEn": "Quaxwell",
    "type": "water",
    "baseStats": {
      "hp": 70,
      "atk": 85,
      "def": 65,
      "spa": 65,
      "spd": 60,
      "spe": 65
    },
    "abilities": [
      "torrent",
      "moxie"
    ]
  },
  {
    "id": "quaquaval",
    "name": "Quaquaval",
    "nameEn": "Quaquaval",
    "type": "water",
    "type2": "fighting",
    "baseStats": {
      "hp": 85,
      "atk": 120,
      "def": 80,
      "spa": 85,
      "spd": 75,
      "spe": 85
    },
    "abilities": [
      "torrent",
      "moxie"
    ]
  },
  {
    "id": "lechonk",
    "name": "Lechonk",
    "nameEn": "Lechonk",
    "type": "normal",
    "baseStats": {
      "hp": 54,
      "atk": 45,
      "def": 40,
      "spa": 35,
      "spd": 45,
      "spe": 35
    },
    "abilities": [
      "aromaveil",
      "gluttony",
      "thickfat"
    ]
  },
  {
    "id": "oinkologne",
    "name": "Oinkologne",
    "nameEn": "Oinkologne",
    "type": "normal",
    "baseStats": {
      "hp": 110,
      "atk": 100,
      "def": 75,
      "spa": 59,
      "spd": 80,
      "spe": 65
    },
    "abilities": [
      "lingeringaroma",
      "gluttony",
      "thickfat"
    ]
  },
  {
    "id": "tarountula",
    "name": "Tarountula",
    "nameEn": "Tarountula",
    "type": "bug",
    "baseStats": {
      "hp": 35,
      "atk": 41,
      "def": 45,
      "spa": 29,
      "spd": 40,
      "spe": 20
    },
    "abilities": [
      "insomnia",
      "stakeout"
    ]
  },
  {
    "id": "spidops",
    "name": "Spidops",
    "nameEn": "Spidops",
    "type": "bug",
    "baseStats": {
      "hp": 60,
      "atk": 79,
      "def": 92,
      "spa": 52,
      "spd": 86,
      "spe": 35
    },
    "abilities": [
      "insomnia",
      "stakeout"
    ]
  },
  {
    "id": "nymble",
    "name": "Nymble",
    "nameEn": "Nymble",
    "type": "bug",
    "baseStats": {
      "hp": 33,
      "atk": 46,
      "def": 40,
      "spa": 21,
      "spd": 25,
      "spe": 45
    },
    "abilities": [
      "swarm",
      "tintedlens"
    ]
  },
  {
    "id": "lokix",
    "name": "Lokix",
    "nameEn": "Lokix",
    "type": "bug",
    "type2": "dark",
    "baseStats": {
      "hp": 71,
      "atk": 102,
      "def": 78,
      "spa": 52,
      "spd": 55,
      "spe": 92
    },
    "abilities": [
      "swarm",
      "tintedlens"
    ]
  },
  {
    "id": "pawmi",
    "name": "Pawmi",
    "nameEn": "Pawmi",
    "type": "electric",
    "baseStats": {
      "hp": 45,
      "atk": 50,
      "def": 20,
      "spa": 40,
      "spd": 25,
      "spe": 60
    },
    "abilities": [
      "static",
      "naturalcure",
      "ironfist"
    ]
  },
  {
    "id": "pawmo",
    "name": "Pawmo",
    "nameEn": "Pawmo",
    "type": "electric",
    "type2": "fighting",
    "baseStats": {
      "hp": 60,
      "atk": 75,
      "def": 40,
      "spa": 50,
      "spd": 40,
      "spe": 85
    },
    "abilities": [
      "voltabsorb",
      "naturalcure",
      "ironfist"
    ]
  },
  {
    "id": "pawmot",
    "name": "Pawmot",
    "nameEn": "Pawmot",
    "type": "electric",
    "type2": "fighting",
    "baseStats": {
      "hp": 70,
      "atk": 115,
      "def": 70,
      "spa": 70,
      "spd": 60,
      "spe": 105
    },
    "abilities": [
      "voltabsorb",
      "naturalcure",
      "ironfist"
    ]
  },
  {
    "id": "tandemaus",
    "name": "Tandemaus",
    "nameEn": "Tandemaus",
    "type": "normal",
    "baseStats": {
      "hp": 50,
      "atk": 50,
      "def": 45,
      "spa": 40,
      "spd": 45,
      "spe": 75
    },
    "abilities": [
      "runaway",
      "pickup",
      "owntempo"
    ]
  },
  {
    "id": "maushold",
    "name": "Maushold",
    "nameEn": "Maushold",
    "type": "normal",
    "baseStats": {
      "hp": 74,
      "atk": 75,
      "def": 70,
      "spa": 65,
      "spd": 75,
      "spe": 111
    },
    "abilities": [
      "friendguard",
      "cheekpouch",
      "technician"
    ]
  },
  {
    "id": "fidough",
    "name": "Fidough",
    "nameEn": "Fidough",
    "type": "fairy",
    "baseStats": {
      "hp": 37,
      "atk": 55,
      "def": 70,
      "spa": 30,
      "spd": 55,
      "spe": 65
    },
    "abilities": [
      "owntempo",
      "klutz"
    ]
  },
  {
    "id": "dachsbun",
    "name": "Dachsbun",
    "nameEn": "Dachsbun",
    "type": "fairy",
    "baseStats": {
      "hp": 57,
      "atk": 80,
      "def": 115,
      "spa": 50,
      "spd": 80,
      "spe": 95
    },
    "abilities": [
      "well-bakedbody",
      "aromaveil"
    ]
  },
  {
    "id": "smoliv",
    "name": "Smoliv",
    "nameEn": "Smoliv",
    "type": "grass",
    "type2": "normal",
    "baseStats": {
      "hp": 41,
      "atk": 35,
      "def": 45,
      "spa": 58,
      "spd": 51,
      "spe": 30
    },
    "abilities": [
      "earlybird",
      "harvest"
    ]
  },
  {
    "id": "dolliv",
    "name": "Dolliv",
    "nameEn": "Dolliv",
    "type": "grass",
    "type2": "normal",
    "baseStats": {
      "hp": 52,
      "atk": 53,
      "def": 60,
      "spa": 78,
      "spd": 78,
      "spe": 33
    },
    "abilities": [
      "earlybird",
      "harvest"
    ]
  },
  {
    "id": "arboliva",
    "name": "Arboliva",
    "nameEn": "Arboliva",
    "type": "grass",
    "type2": "normal",
    "baseStats": {
      "hp": 78,
      "atk": 69,
      "def": 90,
      "spa": 125,
      "spd": 109,
      "spe": 39
    },
    "abilities": [
      "seedsower",
      "harvest"
    ]
  },
  {
    "id": "squawkabilly",
    "name": "Squawkabilly",
    "nameEn": "Squawkabilly",
    "type": "normal",
    "type2": "flying",
    "baseStats": {
      "hp": 82,
      "atk": 96,
      "def": 51,
      "spa": 45,
      "spd": 51,
      "spe": 92
    },
    "abilities": [
      "intimidate",
      "hustle",
      "guts"
    ]
  },
  {
    "id": "nacli",
    "name": "Nacli",
    "nameEn": "Nacli",
    "type": "rock",
    "baseStats": {
      "hp": 55,
      "atk": 55,
      "def": 75,
      "spa": 35,
      "spd": 35,
      "spe": 25
    },
    "abilities": [
      "purifyingsalt",
      "sturdy",
      "clearbody"
    ]
  },
  {
    "id": "naclstack",
    "name": "Naclstack",
    "nameEn": "Naclstack",
    "type": "rock",
    "baseStats": {
      "hp": 60,
      "atk": 60,
      "def": 100,
      "spa": 35,
      "spd": 65,
      "spe": 35
    },
    "abilities": [
      "purifyingsalt",
      "sturdy",
      "clearbody"
    ]
  },
  {
    "id": "garganacl",
    "name": "Garganacl",
    "nameEn": "Garganacl",
    "type": "rock",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 130,
      "spa": 45,
      "spd": 90,
      "spe": 35
    },
    "abilities": [
      "purifyingsalt",
      "sturdy",
      "clearbody"
    ]
  },
  {
    "id": "charcadet",
    "name": "Charcadet",
    "nameEn": "Charcadet",
    "type": "fire",
    "baseStats": {
      "hp": 40,
      "atk": 50,
      "def": 40,
      "spa": 50,
      "spd": 40,
      "spe": 35
    },
    "abilities": [
      "flashfire",
      "flamebody"
    ]
  },
  {
    "id": "armarouge",
    "name": "Armarouge",
    "nameEn": "Armarouge",
    "type": "fire",
    "type2": "psychic",
    "baseStats": {
      "hp": 85,
      "atk": 60,
      "def": 100,
      "spa": 125,
      "spd": 80,
      "spe": 75
    },
    "abilities": [
      "flashfire",
      "weakarmor"
    ]
  },
  {
    "id": "ceruledge",
    "name": "Ceruledge",
    "nameEn": "Ceruledge",
    "type": "fire",
    "type2": "ghost",
    "baseStats": {
      "hp": 75,
      "atk": 125,
      "def": 80,
      "spa": 60,
      "spd": 100,
      "spe": 85
    },
    "abilities": [
      "flashfire",
      "weakarmor"
    ]
  },
  {
    "id": "tadbulb",
    "name": "Tadbulb",
    "nameEn": "Tadbulb",
    "type": "electric",
    "baseStats": {
      "hp": 61,
      "atk": 31,
      "def": 41,
      "spa": 59,
      "spd": 35,
      "spe": 45
    },
    "abilities": [
      "owntempo",
      "static",
      "damp"
    ]
  },
  {
    "id": "bellibolt",
    "name": "Bellibolt",
    "nameEn": "Bellibolt",
    "type": "electric",
    "baseStats": {
      "hp": 109,
      "atk": 64,
      "def": 91,
      "spa": 103,
      "spd": 83,
      "spe": 45
    },
    "abilities": [
      "electromorphosis",
      "static",
      "damp"
    ]
  },
  {
    "id": "wattrel",
    "name": "Wattrel",
    "nameEn": "Wattrel",
    "type": "electric",
    "type2": "flying",
    "baseStats": {
      "hp": 40,
      "atk": 40,
      "def": 35,
      "spa": 55,
      "spd": 40,
      "spe": 70
    },
    "abilities": [
      "windpower",
      "voltabsorb",
      "competitive"
    ]
  },
  {
    "id": "kilowattrel",
    "name": "Kilowattrel",
    "nameEn": "Kilowattrel",
    "type": "electric",
    "type2": "flying",
    "baseStats": {
      "hp": 70,
      "atk": 70,
      "def": 60,
      "spa": 105,
      "spd": 60,
      "spe": 125
    },
    "abilities": [
      "windpower",
      "voltabsorb",
      "competitive"
    ]
  },
  {
    "id": "maschiff",
    "name": "Maschiff",
    "nameEn": "Maschiff",
    "type": "dark",
    "baseStats": {
      "hp": 60,
      "atk": 78,
      "def": 60,
      "spa": 40,
      "spd": 51,
      "spe": 51
    },
    "abilities": [
      "intimidate",
      "runaway",
      "stakeout"
    ]
  },
  {
    "id": "mabosstiff",
    "name": "Mabosstiff",
    "nameEn": "Mabosstiff",
    "type": "dark",
    "baseStats": {
      "hp": 80,
      "atk": 120,
      "def": 90,
      "spa": 60,
      "spd": 70,
      "spe": 85
    },
    "abilities": [
      "intimidate",
      "guarddog",
      "stakeout"
    ]
  },
  {
    "id": "shroodle",
    "name": "Shroodle",
    "nameEn": "Shroodle",
    "type": "poison",
    "type2": "normal",
    "baseStats": {
      "hp": 40,
      "atk": 65,
      "def": 35,
      "spa": 40,
      "spd": 35,
      "spe": 75
    },
    "abilities": [
      "unburden",
      "pickpocket",
      "prankster"
    ]
  },
  {
    "id": "grafaiai",
    "name": "Grafaiai",
    "nameEn": "Grafaiai",
    "type": "poison",
    "type2": "normal",
    "baseStats": {
      "hp": 63,
      "atk": 95,
      "def": 65,
      "spa": 80,
      "spd": 72,
      "spe": 110
    },
    "abilities": [
      "unburden",
      "poisontouch",
      "prankster"
    ]
  },
  {
    "id": "bramblin",
    "name": "Bramblin",
    "nameEn": "Bramblin",
    "type": "grass",
    "type2": "ghost",
    "baseStats": {
      "hp": 40,
      "atk": 65,
      "def": 30,
      "spa": 45,
      "spd": 35,
      "spe": 60
    },
    "abilities": [
      "windrider",
      "infiltrator"
    ]
  },
  {
    "id": "brambleghast",
    "name": "Brambleghast",
    "nameEn": "Brambleghast",
    "type": "grass",
    "type2": "ghost",
    "baseStats": {
      "hp": 55,
      "atk": 115,
      "def": 70,
      "spa": 80,
      "spd": 70,
      "spe": 90
    },
    "abilities": [
      "windrider",
      "infiltrator"
    ]
  },
  {
    "id": "toedscool",
    "name": "Toedscool",
    "nameEn": "Toedscool",
    "type": "ground",
    "type2": "grass",
    "baseStats": {
      "hp": 40,
      "atk": 40,
      "def": 35,
      "spa": 50,
      "spd": 100,
      "spe": 70
    },
    "abilities": [
      "myceliummight"
    ]
  },
  {
    "id": "toedscruel",
    "name": "Toedscruel",
    "nameEn": "Toedscruel",
    "type": "ground",
    "type2": "grass",
    "baseStats": {
      "hp": 80,
      "atk": 70,
      "def": 65,
      "spa": 80,
      "spd": 120,
      "spe": 100
    },
    "abilities": [
      "myceliummight"
    ]
  },
  {
    "id": "klawf",
    "name": "Klawf",
    "nameEn": "Klawf",
    "type": "rock",
    "baseStats": {
      "hp": 70,
      "atk": 100,
      "def": 115,
      "spa": 35,
      "spd": 55,
      "spe": 75
    },
    "abilities": [
      "angershell",
      "shellarmor",
      "regenerator"
    ]
  },
  {
    "id": "capsakid",
    "name": "Capsakid",
    "nameEn": "Capsakid",
    "type": "grass",
    "baseStats": {
      "hp": 50,
      "atk": 62,
      "def": 40,
      "spa": 62,
      "spd": 40,
      "spe": 50
    },
    "abilities": [
      "chlorophyll",
      "insomnia",
      "klutz"
    ]
  },
  {
    "id": "scovillain",
    "name": "Scovillain",
    "nameEn": "Scovillain",
    "type": "grass",
    "type2": "fire",
    "baseStats": {
      "hp": 65,
      "atk": 108,
      "def": 65,
      "spa": 108,
      "spd": 65,
      "spe": 75
    },
    "abilities": [
      "chlorophyll",
      "insomnia",
      "moody"
    ]
  },
  {
    "id": "rellor",
    "name": "Rellor",
    "nameEn": "Rellor",
    "type": "bug",
    "baseStats": {
      "hp": 41,
      "atk": 50,
      "def": 60,
      "spa": 31,
      "spd": 58,
      "spe": 30
    },
    "abilities": [
      "compoundeyes",
      "shedskin"
    ]
  },
  {
    "id": "rabsca",
    "name": "Rabsca",
    "nameEn": "Rabsca",
    "type": "bug",
    "type2": "psychic",
    "baseStats": {
      "hp": 75,
      "atk": 50,
      "def": 85,
      "spa": 115,
      "spd": 100,
      "spe": 45
    },
    "abilities": [
      "synchronize",
      "telepathy"
    ]
  },
  {
    "id": "flittle",
    "name": "Flittle",
    "nameEn": "Flittle",
    "type": "psychic",
    "baseStats": {
      "hp": 30,
      "atk": 35,
      "def": 30,
      "spa": 55,
      "spd": 30,
      "spe": 75
    },
    "abilities": [
      "anticipation",
      "frisk",
      "speedboost"
    ]
  },
  {
    "id": "espathra",
    "name": "Espathra",
    "nameEn": "Espathra",
    "type": "psychic",
    "baseStats": {
      "hp": 95,
      "atk": 60,
      "def": 60,
      "spa": 101,
      "spd": 60,
      "spe": 105
    },
    "abilities": [
      "opportunist",
      "frisk",
      "speedboost"
    ]
  },
  {
    "id": "tinkatink",
    "name": "Tinkatink",
    "nameEn": "Tinkatink",
    "type": "fairy",
    "type2": "steel",
    "baseStats": {
      "hp": 50,
      "atk": 45,
      "def": 45,
      "spa": 35,
      "spd": 64,
      "spe": 58
    },
    "abilities": [
      "moldbreaker",
      "owntempo",
      "pickpocket"
    ]
  },
  {
    "id": "tinkatuff",
    "name": "Tinkatuff",
    "nameEn": "Tinkatuff",
    "type": "fairy",
    "type2": "steel",
    "baseStats": {
      "hp": 65,
      "atk": 55,
      "def": 55,
      "spa": 45,
      "spd": 82,
      "spe": 78
    },
    "abilities": [
      "moldbreaker",
      "owntempo",
      "pickpocket"
    ]
  },
  {
    "id": "tinkaton",
    "name": "Tinkaton",
    "nameEn": "Tinkaton",
    "type": "fairy",
    "type2": "steel",
    "baseStats": {
      "hp": 85,
      "atk": 75,
      "def": 77,
      "spa": 70,
      "spd": 105,
      "spe": 94
    },
    "abilities": [
      "moldbreaker",
      "owntempo",
      "pickpocket"
    ]
  },
  {
    "id": "wiglett",
    "name": "Wiglett",
    "nameEn": "Wiglett",
    "type": "water",
    "baseStats": {
      "hp": 10,
      "atk": 55,
      "def": 25,
      "spa": 35,
      "spd": 25,
      "spe": 95
    },
    "abilities": [
      "gooey",
      "rattled",
      "sandveil"
    ]
  },
  {
    "id": "wugtrio",
    "name": "Wugtrio",
    "nameEn": "Wugtrio",
    "type": "water",
    "baseStats": {
      "hp": 35,
      "atk": 100,
      "def": 50,
      "spa": 50,
      "spd": 70,
      "spe": 120
    },
    "abilities": [
      "gooey",
      "rattled",
      "sandveil"
    ]
  },
  {
    "id": "bombirdier",
    "name": "Bombirdier",
    "nameEn": "Bombirdier",
    "type": "flying",
    "type2": "dark",
    "baseStats": {
      "hp": 70,
      "atk": 103,
      "def": 85,
      "spa": 60,
      "spd": 85,
      "spe": 82
    },
    "abilities": [
      "bigpecks",
      "keeneye",
      "rockypayload"
    ]
  },
  {
    "id": "finizen",
    "name": "Finizen",
    "nameEn": "Finizen",
    "type": "water",
    "baseStats": {
      "hp": 70,
      "atk": 45,
      "def": 40,
      "spa": 45,
      "spd": 40,
      "spe": 75
    },
    "abilities": [
      "waterveil"
    ]
  },
  {
    "id": "palafin",
    "name": "Palafin",
    "nameEn": "Palafin",
    "type": "water",
    "baseStats": {
      "hp": 100,
      "atk": 70,
      "def": 72,
      "spa": 53,
      "spd": 62,
      "spe": 100
    },
    "abilities": [
      "zerotohero"
    ]
  },
  {
    "id": "varoom",
    "name": "Varoom",
    "nameEn": "Varoom",
    "type": "steel",
    "type2": "poison",
    "baseStats": {
      "hp": 45,
      "atk": 70,
      "def": 63,
      "spa": 30,
      "spd": 45,
      "spe": 47
    },
    "abilities": [
      "overcoat",
      "slowstart"
    ]
  },
  {
    "id": "revavroom",
    "name": "Revavroom",
    "nameEn": "Revavroom",
    "type": "steel",
    "type2": "poison",
    "baseStats": {
      "hp": 80,
      "atk": 119,
      "def": 90,
      "spa": 54,
      "spd": 67,
      "spe": 90
    },
    "abilities": [
      "overcoat",
      "filter"
    ]
  },
  {
    "id": "cyclizar",
    "name": "Cyclizar",
    "nameEn": "Cyclizar",
    "type": "dragon",
    "type2": "normal",
    "baseStats": {
      "hp": 70,
      "atk": 95,
      "def": 65,
      "spa": 85,
      "spd": 65,
      "spe": 121
    },
    "abilities": [
      "shedskin",
      "regenerator"
    ]
  },
  {
    "id": "orthworm",
    "name": "Orthworm",
    "nameEn": "Orthworm",
    "type": "steel",
    "baseStats": {
      "hp": 70,
      "atk": 85,
      "def": 145,
      "spa": 60,
      "spd": 55,
      "spe": 65
    },
    "abilities": [
      "eartheater",
      "sandveil"
    ]
  },
  {
    "id": "glimmet",
    "name": "Glimmet",
    "nameEn": "Glimmet",
    "type": "rock",
    "type2": "poison",
    "baseStats": {
      "hp": 48,
      "atk": 35,
      "def": 42,
      "spa": 105,
      "spd": 60,
      "spe": 60
    },
    "abilities": [
      "toxicdebris",
      "corrosion"
    ]
  },
  {
    "id": "glimmora",
    "name": "Glimmora",
    "nameEn": "Glimmora",
    "type": "rock",
    "type2": "poison",
    "baseStats": {
      "hp": 83,
      "atk": 55,
      "def": 90,
      "spa": 130,
      "spd": 81,
      "spe": 86
    },
    "abilities": [
      "toxicdebris",
      "corrosion"
    ]
  },
  {
    "id": "greavard",
    "name": "Greavard",
    "nameEn": "Greavard",
    "type": "ghost",
    "baseStats": {
      "hp": 50,
      "atk": 61,
      "def": 60,
      "spa": 30,
      "spd": 55,
      "spe": 34
    },
    "abilities": [
      "pickup",
      "fluffy"
    ]
  },
  {
    "id": "houndstone",
    "name": "Houndstone",
    "nameEn": "Houndstone",
    "type": "ghost",
    "baseStats": {
      "hp": 72,
      "atk": 101,
      "def": 100,
      "spa": 50,
      "spd": 97,
      "spe": 68
    },
    "abilities": [
      "sandrush",
      "fluffy"
    ]
  },
  {
    "id": "flamigo",
    "name": "Flamigo",
    "nameEn": "Flamigo",
    "type": "flying",
    "type2": "fighting",
    "baseStats": {
      "hp": 82,
      "atk": 115,
      "def": 74,
      "spa": 75,
      "spd": 64,
      "spe": 90
    },
    "abilities": [
      "scrappy",
      "tangledfeet",
      "costar"
    ]
  },
  {
    "id": "cetoddle",
    "name": "Cetoddle",
    "nameEn": "Cetoddle",
    "type": "ice",
    "baseStats": {
      "hp": 108,
      "atk": 68,
      "def": 45,
      "spa": 30,
      "spd": 40,
      "spe": 43
    },
    "abilities": [
      "thickfat",
      "snowcloak",
      "sheerforce"
    ]
  },
  {
    "id": "cetitan",
    "name": "Cetitan",
    "nameEn": "Cetitan",
    "type": "ice",
    "baseStats": {
      "hp": 170,
      "atk": 113,
      "def": 65,
      "spa": 45,
      "spd": 55,
      "spe": 73
    },
    "abilities": [
      "thickfat",
      "slushrush",
      "sheerforce"
    ]
  },
  {
    "id": "veluza",
    "name": "Veluza",
    "nameEn": "Veluza",
    "type": "water",
    "type2": "psychic",
    "baseStats": {
      "hp": 90,
      "atk": 102,
      "def": 73,
      "spa": 78,
      "spd": 65,
      "spe": 70
    },
    "abilities": [
      "moldbreaker",
      "sharpness"
    ]
  },
  {
    "id": "dondozo",
    "name": "Dondozo",
    "nameEn": "Dondozo",
    "type": "water",
    "baseStats": {
      "hp": 150,
      "atk": 100,
      "def": 115,
      "spa": 65,
      "spd": 65,
      "spe": 35
    },
    "abilities": [
      "unaware",
      "oblivious",
      "waterveil"
    ]
  },
  {
    "id": "tatsugiri",
    "name": "Tatsugiri",
    "nameEn": "Tatsugiri",
    "type": "dragon",
    "type2": "water",
    "baseStats": {
      "hp": 68,
      "atk": 50,
      "def": 60,
      "spa": 120,
      "spd": 95,
      "spe": 82
    },
    "abilities": [
      "commander",
      "stormdrain"
    ]
  },
  {
    "id": "annihilape",
    "name": "Annihilape",
    "nameEn": "Annihilape",
    "type": "fighting",
    "type2": "ghost",
    "baseStats": {
      "hp": 110,
      "atk": 115,
      "def": 80,
      "spa": 50,
      "spd": 90,
      "spe": 90
    },
    "abilities": [
      "vitalspirit",
      "innerfocus",
      "defiant"
    ]
  },
  {
    "id": "clodsire",
    "name": "Clodsire",
    "nameEn": "Clodsire",
    "type": "poison",
    "type2": "ground",
    "baseStats": {
      "hp": 130,
      "atk": 75,
      "def": 60,
      "spa": 45,
      "spd": 100,
      "spe": 20
    },
    "abilities": [
      "poisonpoint",
      "waterabsorb",
      "unaware"
    ]
  },
  {
    "id": "farigiraf",
    "name": "Farigiraf",
    "nameEn": "Farigiraf",
    "type": "normal",
    "type2": "psychic",
    "baseStats": {
      "hp": 120,
      "atk": 90,
      "def": 70,
      "spa": 110,
      "spd": 70,
      "spe": 60
    },
    "abilities": [
      "cudchew",
      "armortail",
      "sapsipper"
    ]
  },
  {
    "id": "dudunsparce",
    "name": "Dudunsparce",
    "nameEn": "Dudunsparce",
    "type": "normal",
    "baseStats": {
      "hp": 125,
      "atk": 100,
      "def": 80,
      "spa": 85,
      "spd": 75,
      "spe": 55
    },
    "abilities": [
      "serenegrace",
      "runaway",
      "rattled"
    ]
  },
  {
    "id": "kingambit",
    "name": "Kingambit",
    "nameEn": "Kingambit",
    "type": "dark",
    "type2": "steel",
    "baseStats": {
      "hp": 100,
      "atk": 135,
      "def": 120,
      "spa": 60,
      "spd": 85,
      "spe": 50
    },
    "abilities": [
      "defiant",
      "supremeoverlord",
      "pressure"
    ]
  },
  {
    "id": "greattusk",
    "name": "Great Tusk",
    "nameEn": "Great Tusk",
    "type": "ground",
    "type2": "fighting",
    "baseStats": {
      "hp": 115,
      "atk": 131,
      "def": 131,
      "spa": 53,
      "spd": 53,
      "spe": 87
    },
    "abilities": [
      "protosynthesis"
    ]
  },
  {
    "id": "screamtail",
    "name": "Scream Tail",
    "nameEn": "Scream Tail",
    "type": "fairy",
    "type2": "psychic",
    "baseStats": {
      "hp": 115,
      "atk": 65,
      "def": 99,
      "spa": 65,
      "spd": 115,
      "spe": 111
    },
    "abilities": [
      "protosynthesis"
    ]
  },
  {
    "id": "brutebonnet",
    "name": "Brute Bonnet",
    "nameEn": "Brute Bonnet",
    "type": "grass",
    "type2": "dark",
    "baseStats": {
      "hp": 111,
      "atk": 127,
      "def": 99,
      "spa": 79,
      "spd": 99,
      "spe": 55
    },
    "abilities": [
      "protosynthesis"
    ]
  },
  {
    "id": "fluttermane",
    "name": "Flutter Mane",
    "nameEn": "Flutter Mane",
    "type": "ghost",
    "type2": "fairy",
    "baseStats": {
      "hp": 55,
      "atk": 55,
      "def": 55,
      "spa": 135,
      "spd": 135,
      "spe": 135
    },
    "abilities": [
      "protosynthesis"
    ]
  },
  {
    "id": "slitherwing",
    "name": "Slither Wing",
    "nameEn": "Slither Wing",
    "type": "bug",
    "type2": "fighting",
    "baseStats": {
      "hp": 85,
      "atk": 135,
      "def": 79,
      "spa": 85,
      "spd": 105,
      "spe": 81
    },
    "abilities": [
      "protosynthesis"
    ]
  },
  {
    "id": "sandyshocks",
    "name": "Sandy Shocks",
    "nameEn": "Sandy Shocks",
    "type": "electric",
    "type2": "ground",
    "baseStats": {
      "hp": 85,
      "atk": 81,
      "def": 97,
      "spa": 121,
      "spd": 85,
      "spe": 101
    },
    "abilities": [
      "protosynthesis"
    ]
  },
  {
    "id": "irontreads",
    "name": "Iron Treads",
    "nameEn": "Iron Treads",
    "type": "ground",
    "type2": "steel",
    "baseStats": {
      "hp": 90,
      "atk": 112,
      "def": 120,
      "spa": 72,
      "spd": 70,
      "spe": 106
    },
    "abilities": [
      "quarkdrive"
    ]
  },
  {
    "id": "ironbundle",
    "name": "Iron Bundle",
    "nameEn": "Iron Bundle",
    "type": "ice",
    "type2": "water",
    "baseStats": {
      "hp": 56,
      "atk": 80,
      "def": 114,
      "spa": 124,
      "spd": 60,
      "spe": 136
    },
    "abilities": [
      "quarkdrive"
    ]
  },
  {
    "id": "ironhands",
    "name": "Iron Hands",
    "nameEn": "Iron Hands",
    "type": "fighting",
    "type2": "electric",
    "baseStats": {
      "hp": 154,
      "atk": 140,
      "def": 108,
      "spa": 50,
      "spd": 68,
      "spe": 50
    },
    "abilities": [
      "quarkdrive"
    ]
  },
  {
    "id": "ironjugulis",
    "name": "Iron Jugulis",
    "nameEn": "Iron Jugulis",
    "type": "dark",
    "type2": "flying",
    "baseStats": {
      "hp": 94,
      "atk": 80,
      "def": 86,
      "spa": 122,
      "spd": 80,
      "spe": 108
    },
    "abilities": [
      "quarkdrive"
    ]
  },
  {
    "id": "ironmoth",
    "name": "Iron Moth",
    "nameEn": "Iron Moth",
    "type": "fire",
    "type2": "poison",
    "baseStats": {
      "hp": 80,
      "atk": 70,
      "def": 60,
      "spa": 140,
      "spd": 110,
      "spe": 110
    },
    "abilities": [
      "quarkdrive"
    ]
  },
  {
    "id": "ironthorns",
    "name": "Iron Thorns",
    "nameEn": "Iron Thorns",
    "type": "rock",
    "type2": "electric",
    "baseStats": {
      "hp": 100,
      "atk": 134,
      "def": 110,
      "spa": 70,
      "spd": 84,
      "spe": 72
    },
    "abilities": [
      "quarkdrive"
    ]
  },
  {
    "id": "frigibax",
    "name": "Frigibax",
    "nameEn": "Frigibax",
    "type": "dragon",
    "type2": "ice",
    "baseStats": {
      "hp": 65,
      "atk": 75,
      "def": 45,
      "spa": 35,
      "spd": 45,
      "spe": 55
    },
    "abilities": [
      "thermalexchange",
      "icebody"
    ]
  },
  {
    "id": "arctibax",
    "name": "Arctibax",
    "nameEn": "Arctibax",
    "type": "dragon",
    "type2": "ice",
    "baseStats": {
      "hp": 90,
      "atk": 95,
      "def": 66,
      "spa": 45,
      "spd": 65,
      "spe": 62
    },
    "abilities": [
      "thermalexchange",
      "icebody"
    ]
  },
  {
    "id": "baxcalibur",
    "name": "Baxcalibur",
    "nameEn": "Baxcalibur",
    "type": "dragon",
    "type2": "ice",
    "baseStats": {
      "hp": 115,
      "atk": 145,
      "def": 92,
      "spa": 75,
      "spd": 86,
      "spe": 87
    },
    "abilities": [
      "thermalexchange",
      "icebody"
    ]
  },
  {
    "id": "gimmighoul",
    "name": "Gimmighoul",
    "nameEn": "Gimmighoul",
    "type": "ghost",
    "baseStats": {
      "hp": 45,
      "atk": 30,
      "def": 70,
      "spa": 75,
      "spd": 70,
      "spe": 10
    },
    "abilities": [
      "rattled"
    ]
  },
  {
    "id": "gholdengo",
    "name": "Gholdengo",
    "nameEn": "Gholdengo",
    "type": "steel",
    "type2": "ghost",
    "baseStats": {
      "hp": 87,
      "atk": 60,
      "def": 95,
      "spa": 133,
      "spd": 91,
      "spe": 84
    },
    "abilities": [
      "goodasgold"
    ]
  },
  {
    "id": "wochien",
    "name": "Wo-Chien",
    "nameEn": "Wo-Chien",
    "type": "dark",
    "type2": "grass",
    "baseStats": {
      "hp": 85,
      "atk": 85,
      "def": 100,
      "spa": 95,
      "spd": 135,
      "spe": 70
    },
    "abilities": [
      "tabletsofruin"
    ]
  },
  {
    "id": "chienpao",
    "name": "Chien-Pao",
    "nameEn": "Chien-Pao",
    "type": "dark",
    "type2": "ice",
    "baseStats": {
      "hp": 80,
      "atk": 120,
      "def": 80,
      "spa": 90,
      "spd": 65,
      "spe": 135
    },
    "abilities": [
      "swordofruin"
    ]
  },
  {
    "id": "tinglu",
    "name": "Ting-Lu",
    "nameEn": "Ting-Lu",
    "type": "dark",
    "type2": "ground",
    "baseStats": {
      "hp": 155,
      "atk": 110,
      "def": 125,
      "spa": 55,
      "spd": 80,
      "spe": 45
    },
    "abilities": [
      "vesselofruin"
    ]
  },
  {
    "id": "chiyu",
    "name": "Chi-Yu",
    "nameEn": "Chi-Yu",
    "type": "dark",
    "type2": "fire",
    "baseStats": {
      "hp": 55,
      "atk": 80,
      "def": 80,
      "spa": 135,
      "spd": 120,
      "spe": 100
    },
    "abilities": [
      "beadsofruin"
    ]
  },
  {
    "id": "roaringmoon",
    "name": "Roaring Moon",
    "nameEn": "Roaring Moon",
    "type": "dragon",
    "type2": "dark",
    "baseStats": {
      "hp": 105,
      "atk": 139,
      "def": 71,
      "spa": 55,
      "spd": 101,
      "spe": 119
    },
    "abilities": [
      "protosynthesis"
    ]
  },
  {
    "id": "ironvaliant",
    "name": "Iron Valiant",
    "nameEn": "Iron Valiant",
    "type": "fairy",
    "type2": "fighting",
    "baseStats": {
      "hp": 74,
      "atk": 130,
      "def": 90,
      "spa": 120,
      "spd": 60,
      "spe": 116
    },
    "abilities": [
      "quarkdrive"
    ]
  },
  {
    "id": "koraidon",
    "name": "Koraidon",
    "nameEn": "Koraidon",
    "type": "fighting",
    "type2": "dragon",
    "baseStats": {
      "hp": 100,
      "atk": 135,
      "def": 115,
      "spa": 85,
      "spd": 100,
      "spe": 135
    },
    "abilities": [
      "orichalcumpulse"
    ]
  },
  {
    "id": "miraidon",
    "name": "Miraidon",
    "nameEn": "Miraidon",
    "type": "electric",
    "type2": "dragon",
    "baseStats": {
      "hp": 100,
      "atk": 85,
      "def": 100,
      "spa": 135,
      "spd": 115,
      "spe": 135
    },
    "abilities": [
      "hadronengine"
    ]
  },
  {
    "id": "walkingwake",
    "name": "Walking Wake",
    "nameEn": "Walking Wake",
    "type": "water",
    "type2": "dragon",
    "baseStats": {
      "hp": 99,
      "atk": 83,
      "def": 91,
      "spa": 125,
      "spd": 83,
      "spe": 109
    },
    "abilities": [
      "protosynthesis"
    ]
  },
  {
    "id": "ironleaves",
    "name": "Iron Leaves",
    "nameEn": "Iron Leaves",
    "type": "grass",
    "type2": "psychic",
    "baseStats": {
      "hp": 90,
      "atk": 130,
      "def": 88,
      "spa": 70,
      "spd": 108,
      "spe": 104
    },
    "abilities": [
      "quarkdrive"
    ]
  },
  {
    "id": "dipplin",
    "name": "Dipplin",
    "nameEn": "Dipplin",
    "type": "grass",
    "type2": "dragon",
    "baseStats": {
      "hp": 80,
      "atk": 80,
      "def": 110,
      "spa": 95,
      "spd": 80,
      "spe": 40
    },
    "abilities": [
      "supersweetsyrup",
      "gluttony",
      "stickyhold"
    ]
  },
  {
    "id": "poltchageist",
    "name": "Poltchageist",
    "nameEn": "Poltchageist",
    "type": "grass",
    "type2": "ghost",
    "baseStats": {
      "hp": 40,
      "atk": 45,
      "def": 45,
      "spa": 74,
      "spd": 54,
      "spe": 50
    },
    "abilities": [
      "hospitality",
      "heatproof"
    ]
  },
  {
    "id": "sinistcha",
    "name": "Sinistcha",
    "nameEn": "Sinistcha",
    "type": "grass",
    "type2": "ghost",
    "baseStats": {
      "hp": 71,
      "atk": 60,
      "def": 106,
      "spa": 121,
      "spd": 80,
      "spe": 70
    },
    "abilities": [
      "hospitality",
      "heatproof"
    ]
  },
  {
    "id": "okidogi",
    "name": "Okidogi",
    "nameEn": "Okidogi",
    "type": "poison",
    "type2": "fighting",
    "baseStats": {
      "hp": 88,
      "atk": 128,
      "def": 115,
      "spa": 58,
      "spd": 86,
      "spe": 80
    },
    "abilities": [
      "toxicchain",
      "guarddog"
    ]
  },
  {
    "id": "munkidori",
    "name": "Munkidori",
    "nameEn": "Munkidori",
    "type": "poison",
    "type2": "psychic",
    "baseStats": {
      "hp": 88,
      "atk": 75,
      "def": 66,
      "spa": 130,
      "spd": 90,
      "spe": 106
    },
    "abilities": [
      "toxicchain",
      "frisk"
    ]
  },
  {
    "id": "fezandipiti",
    "name": "Fezandipiti",
    "nameEn": "Fezandipiti",
    "type": "poison",
    "type2": "fairy",
    "baseStats": {
      "hp": 88,
      "atk": 91,
      "def": 82,
      "spa": 70,
      "spd": 125,
      "spe": 99
    },
    "abilities": [
      "toxicchain",
      "technician"
    ]
  },
  {
    "id": "ogerpon",
    "name": "Ogerpon",
    "nameEn": "Ogerpon",
    "type": "grass",
    "baseStats": {
      "hp": 80,
      "atk": 120,
      "def": 84,
      "spa": 60,
      "spd": 96,
      "spe": 110
    },
    "abilities": [
      "defiant"
    ]
  },
  {
    "id": "archaludon",
    "name": "Archaludon",
    "nameEn": "Archaludon",
    "type": "steel",
    "type2": "dragon",
    "baseStats": {
      "hp": 90,
      "atk": 105,
      "def": 130,
      "spa": 125,
      "spd": 65,
      "spe": 85
    },
    "abilities": [
      "stamina",
      "sturdy",
      "stalwart"
    ]
  },
  {
    "id": "hydrapple",
    "name": "Hydrapple",
    "nameEn": "Hydrapple",
    "type": "grass",
    "type2": "dragon",
    "baseStats": {
      "hp": 106,
      "atk": 80,
      "def": 110,
      "spa": 120,
      "spd": 80,
      "spe": 44
    },
    "abilities": [
      "supersweetsyrup",
      "regenerator",
      "stickyhold"
    ]
  },
  {
    "id": "gougingfire",
    "name": "Gouging Fire",
    "nameEn": "Gouging Fire",
    "type": "fire",
    "type2": "dragon",
    "baseStats": {
      "hp": 105,
      "atk": 115,
      "def": 121,
      "spa": 65,
      "spd": 93,
      "spe": 91
    },
    "abilities": [
      "protosynthesis"
    ]
  },
  {
    "id": "ragingbolt",
    "name": "Raging Bolt",
    "nameEn": "Raging Bolt",
    "type": "electric",
    "type2": "dragon",
    "baseStats": {
      "hp": 125,
      "atk": 73,
      "def": 91,
      "spa": 137,
      "spd": 89,
      "spe": 75
    },
    "abilities": [
      "protosynthesis"
    ]
  },
  {
    "id": "ironboulder",
    "name": "Iron Boulder",
    "nameEn": "Iron Boulder",
    "type": "rock",
    "type2": "psychic",
    "baseStats": {
      "hp": 90,
      "atk": 120,
      "def": 80,
      "spa": 68,
      "spd": 108,
      "spe": 124
    },
    "abilities": [
      "quarkdrive"
    ]
  },
  {
    "id": "ironcrown",
    "name": "Iron Crown",
    "nameEn": "Iron Crown",
    "type": "steel",
    "type2": "psychic",
    "baseStats": {
      "hp": 90,
      "atk": 72,
      "def": 100,
      "spa": 122,
      "spd": 108,
      "spe": 98
    },
    "abilities": [
      "quarkdrive"
    ]
  },
  {
    "id": "terapagos",
    "name": "Terapagos",
    "nameEn": "Terapagos",
    "type": "normal",
    "baseStats": {
      "hp": 90,
      "atk": 65,
      "def": 85,
      "spa": 65,
      "spd": 85,
      "spe": 60
    },
    "abilities": [
      "terashift"
    ]
  },
  {
    "id": "pecharunt",
    "name": "Pecharunt",
    "nameEn": "Pecharunt",
    "type": "poison",
    "type2": "ghost",
    "baseStats": {
      "hp": 88,
      "atk": 88,
      "def": 160,
      "spa": 88,
      "spd": 88,
      "spe": 88
    },
    "abilities": [
      "poisonpuppeteer"
    ]
  },
  {
    "id": "missingno",
    "name": "MissingNo.",
    "nameEn": "MissingNo.",
    "type": "bird",
    "type2": "normal",
    "baseStats": {
      "hp": 33,
      "atk": 136,
      "def": 50,
      "spa": 6,
      "spd": 6,
      "spe": 29
    },
    "abilities": []
  },
  {
    "id": "syclar",
    "name": "Syclar",
    "nameEn": "Syclar",
    "type": "ice",
    "type2": "bug",
    "baseStats": {
      "hp": 40,
      "atk": 76,
      "def": 45,
      "spa": 74,
      "spd": 39,
      "spe": 91
    },
    "abilities": [
      "compoundeyes",
      "snowcloak",
      "icebody"
    ]
  },
  {
    "id": "syclant",
    "name": "Syclant",
    "nameEn": "Syclant",
    "type": "ice",
    "type2": "bug",
    "baseStats": {
      "hp": 70,
      "atk": 116,
      "def": 70,
      "spa": 114,
      "spd": 64,
      "spe": 121
    },
    "abilities": [
      "compoundeyes",
      "mountaineer",
      "icebody"
    ]
  },
  {
    "id": "revenankh",
    "name": "Revenankh",
    "nameEn": "Revenankh",
    "type": "ghost",
    "type2": "fighting",
    "baseStats": {
      "hp": 90,
      "atk": 105,
      "def": 90,
      "spa": 65,
      "spd": 110,
      "spe": 65
    },
    "abilities": [
      "airlock",
      "triage",
      "shedskin"
    ]
  },
  {
    "id": "embirch",
    "name": "Embirch",
    "nameEn": "Embirch",
    "type": "fire",
    "type2": "grass",
    "baseStats": {
      "hp": 60,
      "atk": 40,
      "def": 55,
      "spa": 65,
      "spd": 40,
      "spe": 60
    },
    "abilities": [
      "reckless",
      "leafguard",
      "chlorophyll"
    ]
  },
  {
    "id": "flarelm",
    "name": "Flarelm",
    "nameEn": "Flarelm",
    "type": "fire",
    "type2": "grass",
    "baseStats": {
      "hp": 90,
      "atk": 50,
      "def": 95,
      "spa": 75,
      "spd": 70,
      "spe": 40
    },
    "abilities": [
      "rockhead",
      "battlearmor",
      "whitesmoke"
    ]
  },
  {
    "id": "pyroak",
    "name": "Pyroak",
    "nameEn": "Pyroak",
    "type": "fire",
    "type2": "grass",
    "baseStats": {
      "hp": 120,
      "atk": 70,
      "def": 105,
      "spa": 70,
      "spd": 65,
      "spe": 60
    },
    "abilities": [
      "rockhead",
      "battlearmor",
      "contrary"
    ]
  },
  {
    "id": "breezi",
    "name": "Breezi",
    "nameEn": "Breezi",
    "type": "poison",
    "type2": "flying",
    "baseStats": {
      "hp": 50,
      "atk": 46,
      "def": 69,
      "spa": 60,
      "spd": 50,
      "spe": 75
    },
    "abilities": [
      "unburden",
      "owntempo",
      "frisk"
    ]
  },
  {
    "id": "fidgit",
    "name": "Fidgit",
    "nameEn": "Fidgit",
    "type": "poison",
    "type2": "ground",
    "baseStats": {
      "hp": 95,
      "atk": 76,
      "def": 109,
      "spa": 90,
      "spd": 80,
      "spe": 105
    },
    "abilities": [
      "persistent",
      "vitalspirit",
      "frisk"
    ]
  },
  {
    "id": "rebble",
    "name": "Rebble",
    "nameEn": "Rebble",
    "type": "rock",
    "baseStats": {
      "hp": 45,
      "atk": 25,
      "def": 65,
      "spa": 75,
      "spd": 55,
      "spe": 80
    },
    "abilities": [
      "levitate",
      "solidrock",
      "sniper"
    ]
  },
  {
    "id": "tactite",
    "name": "Tactite",
    "nameEn": "Tactite",
    "type": "rock",
    "baseStats": {
      "hp": 70,
      "atk": 40,
      "def": 65,
      "spa": 100,
      "spd": 65,
      "spe": 95
    },
    "abilities": [
      "levitate",
      "technician",
      "sniper"
    ]
  },
  {
    "id": "stratagem",
    "name": "Stratagem",
    "nameEn": "Stratagem",
    "type": "rock",
    "baseStats": {
      "hp": 90,
      "atk": 60,
      "def": 65,
      "spa": 120,
      "spd": 70,
      "spe": 130
    },
    "abilities": [
      "levitate",
      "technician",
      "sniper"
    ]
  },
  {
    "id": "privatyke",
    "name": "Privatyke",
    "nameEn": "Privatyke",
    "type": "water",
    "type2": "fighting",
    "baseStats": {
      "hp": 65,
      "atk": 75,
      "def": 65,
      "spa": 40,
      "spd": 60,
      "spe": 45
    },
    "abilities": [
      "unaware",
      "technician"
    ]
  },
  {
    "id": "arghonaut",
    "name": "Arghonaut",
    "nameEn": "Arghonaut",
    "type": "water",
    "type2": "fighting",
    "baseStats": {
      "hp": 105,
      "atk": 110,
      "def": 95,
      "spa": 70,
      "spd": 100,
      "spe": 75
    },
    "abilities": [
      "unaware",
      "technician"
    ]
  },
  {
    "id": "kitsunoh",
    "name": "Kitsunoh",
    "nameEn": "Kitsunoh",
    "type": "ghost",
    "type2": "steel",
    "baseStats": {
      "hp": 80,
      "atk": 103,
      "def": 85,
      "spa": 55,
      "spd": 80,
      "spe": 120
    },
    "abilities": [
      "frisk",
      "limber",
      "trace"
    ]
  },
  {
    "id": "cyclohm",
    "name": "Cyclohm",
    "nameEn": "Cyclohm",
    "type": "electric",
    "type2": "dragon",
    "baseStats": {
      "hp": 108,
      "atk": 60,
      "def": 118,
      "spa": 112,
      "spd": 70,
      "spe": 80
    },
    "abilities": [
      "shielddust",
      "static",
      "damp"
    ]
  },
  {
    "id": "colossoil",
    "name": "Colossoil",
    "nameEn": "Colossoil",
    "type": "ground",
    "type2": "dark",
    "baseStats": {
      "hp": 133,
      "atk": 122,
      "def": 72,
      "spa": 71,
      "spd": 72,
      "spe": 95
    },
    "abilities": [
      "rebound",
      "guts",
      "unnerve"
    ]
  },
  {
    "id": "krilowatt",
    "name": "Krilowatt",
    "nameEn": "Krilowatt",
    "type": "electric",
    "type2": "water",
    "baseStats": {
      "hp": 151,
      "atk": 84,
      "def": 73,
      "spa": 83,
      "spd": 74,
      "spe": 105
    },
    "abilities": [
      "trace",
      "magicguard",
      "minus"
    ]
  },
  {
    "id": "voodoll",
    "name": "Voodoll",
    "nameEn": "Voodoll",
    "type": "normal",
    "type2": "dark",
    "baseStats": {
      "hp": 55,
      "atk": 40,
      "def": 55,
      "spa": 75,
      "spd": 50,
      "spe": 70
    },
    "abilities": [
      "voltabsorb",
      "lightningrod",
      "cursedbody"
    ]
  },
  {
    "id": "voodoom",
    "name": "Voodoom",
    "nameEn": "Voodoom",
    "type": "fighting",
    "type2": "dark",
    "baseStats": {
      "hp": 90,
      "atk": 85,
      "def": 80,
      "spa": 130,
      "spd": 80,
      "spe": 110
    },
    "abilities": [
      "voltabsorb",
      "lightningrod",
      "cursedbody"
    ]
  },
  {
    "id": "scratchet",
    "name": "Scratchet",
    "nameEn": "Scratchet",
    "type": "normal",
    "type2": "fighting",
    "baseStats": {
      "hp": 55,
      "atk": 85,
      "def": 80,
      "spa": 20,
      "spd": 70,
      "spe": 40
    },
    "abilities": [
      "scrappy",
      "prankster",
      "vitalspirit"
    ]
  },
  {
    "id": "tomohawk",
    "name": "Tomohawk",
    "nameEn": "Tomohawk",
    "type": "flying",
    "type2": "fighting",
    "baseStats": {
      "hp": 105,
      "atk": 60,
      "def": 90,
      "spa": 115,
      "spd": 80,
      "spe": 85
    },
    "abilities": [
      "intimidate",
      "prankster",
      "justified"
    ]
  },
  {
    "id": "necturine",
    "name": "Necturine",
    "nameEn": "Necturine",
    "type": "grass",
    "type2": "ghost",
    "baseStats": {
      "hp": 49,
      "atk": 55,
      "def": 60,
      "spa": 50,
      "spd": 75,
      "spe": 51
    },
    "abilities": [
      "anticipation",
      "telepathy"
    ]
  },
  {
    "id": "necturna",
    "name": "Necturna",
    "nameEn": "Necturna",
    "type": "grass",
    "type2": "ghost",
    "baseStats": {
      "hp": 64,
      "atk": 120,
      "def": 100,
      "spa": 85,
      "spd": 120,
      "spe": 58
    },
    "abilities": [
      "forewarn",
      "telepathy"
    ]
  },
  {
    "id": "mollux",
    "name": "Mollux",
    "nameEn": "Mollux",
    "type": "fire",
    "type2": "poison",
    "baseStats": {
      "hp": 95,
      "atk": 45,
      "def": 83,
      "spa": 131,
      "spd": 105,
      "spe": 76
    },
    "abilities": [
      "dryskin",
      "illuminate"
    ]
  },
  {
    "id": "cupra",
    "name": "Cupra",
    "nameEn": "Cupra",
    "type": "bug",
    "type2": "psychic",
    "baseStats": {
      "hp": 50,
      "atk": 60,
      "def": 49,
      "spa": 67,
      "spd": 30,
      "spe": 44
    },
    "abilities": [
      "shielddust",
      "keeneye",
      "magicguard"
    ]
  },
  {
    "id": "argalis",
    "name": "Argalis",
    "nameEn": "Argalis",
    "type": "bug",
    "type2": "psychic",
    "baseStats": {
      "hp": 60,
      "atk": 90,
      "def": 89,
      "spa": 87,
      "spd": 40,
      "spe": 54
    },
    "abilities": [
      "shedskin",
      "compoundeyes",
      "overcoat"
    ]
  },
  {
    "id": "aurumoth",
    "name": "Aurumoth",
    "nameEn": "Aurumoth",
    "type": "bug",
    "type2": "psychic",
    "baseStats": {
      "hp": 110,
      "atk": 120,
      "def": 99,
      "spa": 117,
      "spd": 60,
      "spe": 94
    },
    "abilities": [
      "weakarmor",
      "noguard",
      "lightmetal"
    ]
  },
  {
    "id": "brattler",
    "name": "Brattler",
    "nameEn": "Brattler",
    "type": "dark",
    "type2": "grass",
    "baseStats": {
      "hp": 80,
      "atk": 70,
      "def": 40,
      "spa": 20,
      "spd": 90,
      "spe": 30
    },
    "abilities": [
      "harvest",
      "infiltrator",
      "rattled"
    ]
  },
  {
    "id": "malaconda",
    "name": "Malaconda",
    "nameEn": "Malaconda",
    "type": "dark",
    "type2": "grass",
    "baseStats": {
      "hp": 115,
      "atk": 100,
      "def": 60,
      "spa": 40,
      "spd": 130,
      "spe": 55
    },
    "abilities": [
      "harvest",
      "infiltrator",
      "drought"
    ]
  },
  {
    "id": "cawdet",
    "name": "Cawdet",
    "nameEn": "Cawdet",
    "type": "steel",
    "type2": "flying",
    "baseStats": {
      "hp": 35,
      "atk": 72,
      "def": 85,
      "spa": 40,
      "spd": 55,
      "spe": 88
    },
    "abilities": [
      "keeneye",
      "voltabsorb",
      "bigpecks"
    ]
  },
  {
    "id": "cawmodore",
    "name": "Cawmodore",
    "nameEn": "Cawmodore",
    "type": "steel",
    "type2": "flying",
    "baseStats": {
      "hp": 50,
      "atk": 92,
      "def": 130,
      "spa": 65,
      "spd": 75,
      "spe": 118
    },
    "abilities": [
      "intimidate",
      "voltabsorb",
      "bigpecks"
    ]
  },
  {
    "id": "volkritter",
    "name": "Volkritter",
    "nameEn": "Volkritter",
    "type": "water",
    "type2": "fire",
    "baseStats": {
      "hp": 60,
      "atk": 30,
      "def": 50,
      "spa": 80,
      "spd": 60,
      "spe": 70
    },
    "abilities": [
      "anticipation",
      "infiltrator",
      "unnerve"
    ]
  },
  {
    "id": "volkraken",
    "name": "Volkraken",
    "nameEn": "Volkraken",
    "type": "water",
    "type2": "fire",
    "baseStats": {
      "hp": 100,
      "atk": 45,
      "def": 80,
      "spa": 135,
      "spd": 100,
      "spe": 95
    },
    "abilities": [
      "analytic",
      "infiltrator",
      "pressure"
    ]
  },
  {
    "id": "snugglow",
    "name": "Snugglow",
    "nameEn": "Snugglow",
    "type": "electric",
    "type2": "poison",
    "baseStats": {
      "hp": 40,
      "atk": 37,
      "def": 79,
      "spa": 91,
      "spd": 68,
      "spe": 70
    },
    "abilities": [
      "stormdrain",
      "vitalspirit",
      "telepathy"
    ]
  },
  {
    "id": "plasmanta",
    "name": "Plasmanta",
    "nameEn": "Plasmanta",
    "type": "electric",
    "type2": "poison",
    "baseStats": {
      "hp": 60,
      "atk": 57,
      "def": 119,
      "spa": 131,
      "spd": 98,
      "spe": 100
    },
    "abilities": [
      "stormdrain",
      "vitalspirit",
      "telepathy"
    ]
  },
  {
    "id": "floatoy",
    "name": "Floatoy",
    "nameEn": "Floatoy",
    "type": "water",
    "baseStats": {
      "hp": 48,
      "atk": 70,
      "def": 40,
      "spa": 70,
      "spd": 30,
      "spe": 77
    },
    "abilities": [
      "waterveil",
      "heatproof",
      "swiftswim"
    ]
  },
  {
    "id": "caimanoe",
    "name": "Caimanoe",
    "nameEn": "Caimanoe",
    "type": "water",
    "type2": "steel",
    "baseStats": {
      "hp": 73,
      "atk": 85,
      "def": 65,
      "spa": 80,
      "spd": 40,
      "spe": 87
    },
    "abilities": [
      "waterveil",
      "heatproof",
      "lightmetal"
    ]
  },
  {
    "id": "naviathan",
    "name": "Naviathan",
    "nameEn": "Naviathan",
    "type": "water",
    "type2": "steel",
    "baseStats": {
      "hp": 103,
      "atk": 110,
      "def": 90,
      "spa": 95,
      "spd": 65,
      "spe": 97
    },
    "abilities": [
      "guts",
      "heatproof",
      "lightmetal"
    ]
  },
  {
    "id": "crucibelle",
    "name": "Crucibelle",
    "nameEn": "Crucibelle",
    "type": "rock",
    "type2": "poison",
    "baseStats": {
      "hp": 106,
      "atk": 105,
      "def": 65,
      "spa": 75,
      "spd": 85,
      "spe": 104
    },
    "abilities": [
      "regenerator",
      "moldbreaker",
      "liquidooze"
    ]
  },
  {
    "id": "pluffle",
    "name": "Pluffle",
    "nameEn": "Pluffle",
    "type": "fairy",
    "baseStats": {
      "hp": 74,
      "atk": 38,
      "def": 51,
      "spa": 65,
      "spd": 78,
      "spe": 49
    },
    "abilities": [
      "naturalcure",
      "aromaveil",
      "friendguard"
    ]
  },
  {
    "id": "kerfluffle",
    "name": "Kerfluffle",
    "nameEn": "Kerfluffle",
    "type": "fairy",
    "type2": "fighting",
    "baseStats": {
      "hp": 84,
      "atk": 78,
      "def": 86,
      "spa": 115,
      "spd": 88,
      "spe": 119
    },
    "abilities": [
      "naturalcure",
      "aromaveil",
      "friendguard"
    ]
  },
  {
    "id": "pajantom",
    "name": "Pajantom",
    "nameEn": "Pajantom",
    "type": "dragon",
    "type2": "ghost",
    "baseStats": {
      "hp": 84,
      "atk": 133,
      "def": 71,
      "spa": 51,
      "spd": 111,
      "spe": 101
    },
    "abilities": [
      "comatose"
    ]
  },
  {
    "id": "mumbao",
    "name": "Mumbao",
    "nameEn": "Mumbao",
    "type": "grass",
    "type2": "fairy",
    "baseStats": {
      "hp": 55,
      "atk": 30,
      "def": 64,
      "spa": 87,
      "spd": 73,
      "spe": 66
    },
    "abilities": [
      "trace",
      "overcoat",
      "solarpower"
    ]
  },
  {
    "id": "jumbao",
    "name": "Jumbao",
    "nameEn": "Jumbao",
    "type": "grass",
    "type2": "fairy",
    "baseStats": {
      "hp": 92,
      "atk": 63,
      "def": 97,
      "spa": 124,
      "spd": 104,
      "spe": 96
    },
    "abilities": [
      "trace",
      "overcoat",
      "drought"
    ]
  },
  {
    "id": "fawnifer",
    "name": "Fawnifer",
    "nameEn": "Fawnifer",
    "type": "grass",
    "baseStats": {
      "hp": 49,
      "atk": 61,
      "def": 42,
      "spa": 52,
      "spd": 40,
      "spe": 76
    },
    "abilities": [
      "overgrow",
      "lightningrod"
    ]
  },
  {
    "id": "electrelk",
    "name": "Electrelk",
    "nameEn": "Electrelk",
    "type": "grass",
    "type2": "electric",
    "baseStats": {
      "hp": 59,
      "atk": 81,
      "def": 67,
      "spa": 57,
      "spd": 55,
      "spe": 101
    },
    "abilities": [
      "overgrow",
      "galvanize"
    ]
  },
  {
    "id": "caribolt",
    "name": "Caribolt",
    "nameEn": "Caribolt",
    "type": "grass",
    "type2": "electric",
    "baseStats": {
      "hp": 84,
      "atk": 106,
      "def": 82,
      "spa": 77,
      "spd": 80,
      "spe": 106
    },
    "abilities": [
      "overgrow",
      "galvanize"
    ]
  },
  {
    "id": "smogecko",
    "name": "Smogecko",
    "nameEn": "Smogecko",
    "type": "fire",
    "baseStats": {
      "hp": 48,
      "atk": 66,
      "def": 43,
      "spa": 58,
      "spd": 48,
      "spe": 56
    },
    "abilities": [
      "blaze",
      "technician"
    ]
  },
  {
    "id": "smoguana",
    "name": "Smoguana",
    "nameEn": "Smoguana",
    "type": "fire",
    "type2": "ground",
    "baseStats": {
      "hp": 68,
      "atk": 86,
      "def": 53,
      "spa": 68,
      "spd": 68,
      "spe": 76
    },
    "abilities": [
      "blaze",
      "technician"
    ]
  },
  {
    "id": "smokomodo",
    "name": "Smokomodo",
    "nameEn": "Smokomodo",
    "type": "fire",
    "type2": "ground",
    "baseStats": {
      "hp": 88,
      "atk": 116,
      "def": 67,
      "spa": 88,
      "spd": 78,
      "spe": 97
    },
    "abilities": [
      "blaze",
      "technician"
    ]
  },
  {
    "id": "swirlpool",
    "name": "Swirlpool",
    "nameEn": "Swirlpool",
    "type": "water",
    "baseStats": {
      "hp": 61,
      "atk": 49,
      "def": 70,
      "spa": 50,
      "spd": 62,
      "spe": 28
    },
    "abilities": [
      "torrent",
      "poisonheal"
    ]
  },
  {
    "id": "coribalis",
    "name": "Coribalis",
    "nameEn": "Coribalis",
    "type": "water",
    "type2": "bug",
    "baseStats": {
      "hp": 76,
      "atk": 69,
      "def": 90,
      "spa": 65,
      "spd": 77,
      "spe": 43
    },
    "abilities": [
      "torrent",
      "poisonheal"
    ]
  },
  {
    "id": "snaelstrom",
    "name": "Snaelstrom",
    "nameEn": "Snaelstrom",
    "type": "water",
    "type2": "bug",
    "baseStats": {
      "hp": 91,
      "atk": 94,
      "def": 110,
      "spa": 80,
      "spd": 97,
      "spe": 63
    },
    "abilities": [
      "torrent",
      "poisonheal"
    ]
  },
  {
    "id": "justyke",
    "name": "Justyke",
    "nameEn": "Justyke",
    "type": "steel",
    "type2": "ground",
    "baseStats": {
      "hp": 72,
      "atk": 70,
      "def": 56,
      "spa": 83,
      "spd": 68,
      "spe": 30
    },
    "abilities": [
      "levitate",
      "bulletproof",
      "justified"
    ]
  },
  {
    "id": "equilibra",
    "name": "Equilibra",
    "nameEn": "Equilibra",
    "type": "steel",
    "type2": "ground",
    "baseStats": {
      "hp": 102,
      "atk": 50,
      "def": 96,
      "spa": 133,
      "spd": 118,
      "spe": 60
    },
    "abilities": [
      "levitate",
      "bulletproof",
      "justified"
    ]
  },
  {
    "id": "solotl",
    "name": "Solotl",
    "nameEn": "Solotl",
    "type": "fire",
    "type2": "dragon",
    "baseStats": {
      "hp": 68,
      "atk": 48,
      "def": 34,
      "spa": 72,
      "spd": 24,
      "spe": 84
    },
    "abilities": [
      "regenerator",
      "vitalspirit",
      "magician"
    ]
  },
  {
    "id": "astrolotl",
    "name": "Astrolotl",
    "nameEn": "Astrolotl",
    "type": "fire",
    "type2": "dragon",
    "baseStats": {
      "hp": 108,
      "atk": 108,
      "def": 74,
      "spa": 92,
      "spd": 64,
      "spe": 114
    },
    "abilities": [
      "regenerator",
      "vitalspirit",
      "magician"
    ]
  },
  {
    "id": "miasmite",
    "name": "Miasmite",
    "nameEn": "Miasmite",
    "type": "bug",
    "type2": "dragon",
    "baseStats": {
      "hp": 40,
      "atk": 85,
      "def": 60,
      "spa": 52,
      "spd": 52,
      "spe": 44
    },
    "abilities": [
      "neutralizinggas",
      "hypercutter",
      "compoundeyes"
    ]
  },
  {
    "id": "miasmaw",
    "name": "Miasmaw",
    "nameEn": "Miasmaw",
    "type": "bug",
    "type2": "dragon",
    "baseStats": {
      "hp": 85,
      "atk": 135,
      "def": 60,
      "spa": 88,
      "spd": 105,
      "spe": 99
    },
    "abilities": [
      "neutralizinggas",
      "hypercutter",
      "compoundeyes"
    ]
  },
  {
    "id": "chromera",
    "name": "Chromera",
    "nameEn": "Chromera",
    "type": "dark",
    "type2": "normal",
    "baseStats": {
      "hp": 85,
      "atk": 85,
      "def": 115,
      "spa": 115,
      "spd": 100,
      "spe": 100
    },
    "abilities": [
      "colorchange"
    ]
  },
  {
    "id": "nohface",
    "name": "Nohface",
    "nameEn": "Nohface",
    "type": "ghost",
    "baseStats": {
      "hp": 50,
      "atk": 73,
      "def": 50,
      "spa": 30,
      "spd": 50,
      "spe": 80
    },
    "abilities": [
      "frisk",
      "limber",
      "unnerve"
    ]
  },
  {
    "id": "monohm",
    "name": "Monohm",
    "nameEn": "Monohm",
    "type": "electric",
    "baseStats": {
      "hp": 53,
      "atk": 40,
      "def": 58,
      "spa": 67,
      "spd": 55,
      "spe": 55
    },
    "abilities": [
      "shielddust",
      "static",
      "damp"
    ]
  },
  {
    "id": "duohm",
    "name": "Duohm",
    "nameEn": "Duohm",
    "type": "electric",
    "type2": "dragon",
    "baseStats": {
      "hp": 88,
      "atk": 40,
      "def": 103,
      "spa": 77,
      "spd": 60,
      "spe": 60
    },
    "abilities": [
      "shielddust",
      "static",
      "damp"
    ]
  },
  {
    "id": "dorsoil",
    "name": "Dorsoil",
    "nameEn": "Dorsoil",
    "type": "ground",
    "baseStats": {
      "hp": 103,
      "atk": 72,
      "def": 52,
      "spa": 61,
      "spd": 52,
      "spe": 65
    },
    "abilities": [
      "oblivious",
      "guts",
      "unnerve"
    ]
  },
  {
    "id": "protowatt",
    "name": "Protowatt",
    "nameEn": "Protowatt",
    "type": "electric",
    "type2": "water",
    "baseStats": {
      "hp": 51,
      "atk": 44,
      "def": 33,
      "spa": 43,
      "spd": 34,
      "spe": 65
    },
    "abilities": [
      "trace",
      "magicguard",
      "minus"
    ]
  },
  {
    "id": "venomicon",
    "name": "Venomicon",
    "nameEn": "Venomicon",
    "type": "poison",
    "type2": "flying",
    "baseStats": {
      "hp": 85,
      "atk": 50,
      "def": 113,
      "spa": 118,
      "spd": 90,
      "spe": 64
    },
    "abilities": [
      "stamina",
      "powerofalchemy"
    ]
  },
  {
    "id": "saharascal",
    "name": "Saharascal",
    "nameEn": "Saharascal",
    "type": "ground",
    "baseStats": {
      "hp": 50,
      "atk": 80,
      "def": 65,
      "spa": 45,
      "spd": 90,
      "spe": 70
    },
    "abilities": [
      "waterabsorb",
      "pickpocket",
      "sandspit"
    ]
  },
  {
    "id": "saharaja",
    "name": "Saharaja",
    "nameEn": "Saharaja",
    "type": "ground",
    "baseStats": {
      "hp": 70,
      "atk": 112,
      "def": 105,
      "spa": 65,
      "spd": 123,
      "spe": 78
    },
    "abilities": [
      "waterabsorb",
      "serenegrace",
      "sandspit"
    ]
  },
  {
    "id": "ababo",
    "name": "Ababo",
    "nameEn": "Ababo",
    "type": "fairy",
    "baseStats": {
      "hp": 42,
      "atk": 35,
      "def": 27,
      "spa": 35,
      "spd": 35,
      "spe": 38
    },
    "abilities": [
      "pixilate",
      "rattled",
      "owntempo"
    ]
  },
  {
    "id": "scattervein",
    "name": "Scattervein",
    "nameEn": "Scattervein",
    "type": "fairy",
    "baseStats": {
      "hp": 75,
      "atk": 74,
      "def": 87,
      "spa": 62,
      "spd": 89,
      "spe": 63
    },
    "abilities": [
      "pixilate",
      "intimidate",
      "owntempo"
    ]
  },
  {
    "id": "hemogoblin",
    "name": "Hemogoblin",
    "nameEn": "Hemogoblin",
    "type": "fairy",
    "type2": "fire",
    "baseStats": {
      "hp": 90,
      "atk": 96,
      "def": 87,
      "spa": 96,
      "spd": 89,
      "spe": 55
    },
    "abilities": [
      "pixilate",
      "intimidate",
      "owntempo"
    ]
  },
  {
    "id": "cresceidon",
    "name": "Cresceidon",
    "nameEn": "Cresceidon",
    "type": "water",
    "type2": "fairy",
    "baseStats": {
      "hp": 80,
      "atk": 32,
      "def": 111,
      "spa": 88,
      "spd": 99,
      "spe": 124
    },
    "abilities": [
      "multiscale",
      "roughskin",
      "waterveil"
    ]
  },
  {
    "id": "chuggon",
    "name": "Chuggon",
    "nameEn": "Chuggon",
    "type": "dragon",
    "type2": "poison",
    "baseStats": {
      "hp": 30,
      "atk": 23,
      "def": 77,
      "spa": 55,
      "spd": 65,
      "spe": 30
    },
    "abilities": [
      "shellarmor",
      "whitesmoke",
      "slowstart"
    ]
  },
  {
    "id": "draggalong",
    "name": "Draggalong",
    "nameEn": "Draggalong",
    "type": "dragon",
    "type2": "poison",
    "baseStats": {
      "hp": 40,
      "atk": 33,
      "def": 92,
      "spa": 95,
      "spd": 80,
      "spe": 85
    },
    "abilities": [
      "armortail",
      "whitesmoke",
      "slowstart"
    ]
  },
  {
    "id": "chuggalong",
    "name": "Chuggalong",
    "nameEn": "Chuggalong",
    "type": "dragon",
    "type2": "poison",
    "baseStats": {
      "hp": 45,
      "atk": 43,
      "def": 117,
      "spa": 120,
      "spd": 110,
      "spe": 108
    },
    "abilities": [
      "armortail",
      "whitesmoke",
      "slowstart"
    ]
  },
  {
    "id": "shox",
    "name": "Shox",
    "nameEn": "Shox",
    "type": "electric",
    "type2": "normal",
    "baseStats": {
      "hp": 136,
      "atk": 55,
      "def": 87,
      "spa": 108,
      "spd": 108,
      "spe": 56
    },
    "abilities": [
      "electromorphosis",
      "stickyhold",
      "cudchew"
    ]
  },
  {
    "id": "ramnarok",
    "name": "Ramnarok",
    "nameEn": "Ramnarok",
    "type": "fire",
    "type2": "steel",
    "baseStats": {
      "hp": 110,
      "atk": 56,
      "def": 104,
      "spa": 111,
      "spd": 134,
      "spe": 85
    },
    "abilities": [
      "noguard"
    ]
  },
  {
    "id": "pokestarsmeargle",
    "name": "Pokestar Smeargle",
    "nameEn": "Pokestar Smeargle",
    "type": "normal",
    "baseStats": {
      "hp": 55,
      "atk": 20,
      "def": 35,
      "spa": 20,
      "spd": 45,
      "spe": 75
    },
    "abilities": [
      "owntempo",
      "technician",
      "moody"
    ]
  },
  {
    "id": "pokestarufo",
    "name": "Pokestar UFO",
    "nameEn": "Pokestar UFO",
    "type": "flying",
    "type2": "electric",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 100,
      "spa": 100,
      "spd": 100,
      "spe": 100
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "pokestarbrycenman",
    "name": "Pokestar Brycen-Man",
    "nameEn": "Pokestar Brycen-Man",
    "type": "dark",
    "type2": "psychic",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 100,
      "spa": 100,
      "spd": 100,
      "spe": 100
    },
    "abilities": [
      "levitate"
    ]
  },
  {
    "id": "pokestarmt",
    "name": "Pokestar MT",
    "nameEn": "Pokestar MT",
    "type": "steel",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 100,
      "spa": 100,
      "spd": 100,
      "spe": 100
    },
    "abilities": [
      "analytic"
    ]
  },
  {
    "id": "pokestarmt2",
    "name": "Pokestar MT2",
    "nameEn": "Pokestar MT2",
    "type": "steel",
    "type2": "electric",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 100,
      "spa": 100,
      "spd": 100,
      "spe": 100
    },
    "abilities": [
      "flashfire"
    ]
  },
  {
    "id": "pokestartransport",
    "name": "Pokestar Transport",
    "nameEn": "Pokestar Transport",
    "type": "steel",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 100,
      "spa": 100,
      "spd": 100,
      "spe": 100
    },
    "abilities": [
      "motordrive"
    ]
  },
  {
    "id": "pokestargiant",
    "name": "Pokestar Giant",
    "nameEn": "Pokestar Giant",
    "type": "normal",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 100,
      "spa": 100,
      "spd": 100,
      "spe": 100
    },
    "abilities": [
      "hugepower"
    ]
  },
  {
    "id": "pokestarhumanoid",
    "name": "Pokestar Humanoid",
    "nameEn": "Pokestar Humanoid",
    "type": "normal",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 100,
      "spa": 100,
      "spd": 100,
      "spe": 100
    },
    "abilities": [
      "insomnia"
    ]
  },
  {
    "id": "pokestarmonster",
    "name": "Pokestar Monster",
    "nameEn": "Pokestar Monster",
    "type": "dark",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 100,
      "spa": 100,
      "spd": 100,
      "spe": 100
    },
    "abilities": [
      "pressure"
    ]
  },
  {
    "id": "pokestarf00",
    "name": "Pokestar F-00",
    "nameEn": "Pokestar F-00",
    "type": "steel",
    "type2": "normal",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 100,
      "spa": 100,
      "spd": 100,
      "spe": 100
    },
    "abilities": [
      "voltabsorb"
    ]
  },
  {
    "id": "pokestarf002",
    "name": "Pokestar F-002",
    "nameEn": "Pokestar F-002",
    "type": "steel",
    "type2": "normal",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 100,
      "spa": 100,
      "spd": 100,
      "spe": 100
    },
    "abilities": [
      "reckless"
    ]
  },
  {
    "id": "pokestarspirit",
    "name": "Pokestar Spirit",
    "nameEn": "Pokestar Spirit",
    "type": "dark",
    "type2": "ghost",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 100,
      "spa": 100,
      "spd": 100,
      "spe": 100
    },
    "abilities": [
      "wonderguard"
    ]
  },
  {
    "id": "pokestarblackdoor",
    "name": "Pokestar Black Door",
    "nameEn": "Pokestar Black Door",
    "type": "grass",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 100,
      "spa": 100,
      "spd": 100,
      "spe": 100
    },
    "abilities": [
      "earlybird"
    ]
  },
  {
    "id": "pokestarwhitedoor",
    "name": "Pokestar White Door",
    "nameEn": "Pokestar White Door",
    "type": "fire",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 100,
      "spa": 100,
      "spd": 100,
      "spe": 100
    },
    "abilities": [
      "blaze"
    ]
  },
  {
    "id": "pokestarblackbelt",
    "name": "Pokestar Black Belt",
    "nameEn": "Pokestar Black Belt",
    "type": "fighting",
    "baseStats": {
      "hp": 100,
      "atk": 100,
      "def": 100,
      "spa": 100,
      "spd": 100,
      "spe": 100
    },
    "abilities": [
      "hugepower"
    ]
  }
];
var EXTRACTED_MOVES = [
  {
    "id": "absorb",
    "name": "\u3059\u3044\u3068\u308B",
    "nameEn": "Absorb",
    "type": "grass",
    "category": "special",
    "power": 20,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u4E0E\u30C0\u30E1\u306E50%\u56DE\u5FA9",
    "drain": 50
  },
  {
    "id": "accelerock",
    "name": "\u30A2\u30AF\u30BB\u30EB\u30ED\u30C3\u30AF",
    "nameEn": "Accelerock",
    "type": "rock",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 1,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+1"
  },
  {
    "id": "acid",
    "name": "\u3088\u3046\u304B\u3044\u3048\u304D",
    "nameEn": "Acid",
    "type": "poison",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u3068\u304F\u307C\u3046\u21931",
    "secondary": {
      "chance": 10,
      "boosts": {
        "spd": -1
      }
    }
  },
  {
    "id": "acidarmor",
    "name": "\u3068\u3051\u308B",
    "nameEn": "Acid Armor",
    "type": "poison",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u307C\u3046\u304E\u3087\u21912"
  },
  {
    "id": "acidspray",
    "name": "\u30A2\u30B7\u30C3\u30C9\u30DC\u30E0",
    "nameEn": "Acid Spray",
    "type": "poison",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u3068\u304F\u307C\u3046\u21932",
    "secondary": {
      "chance": 100,
      "boosts": {
        "spd": -2
      }
    }
  },
  {
    "id": "acrobatics",
    "name": "\u30A2\u30AF\u30ED\u30D0\u30C3\u30C8",
    "nameEn": "Acrobatics",
    "type": "flying",
    "category": "physical",
    "power": 55,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "acupressure",
    "name": "\u3064\u307C\u3092\u3064\u304F",
    "nameEn": "Acupressure",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "aerialace",
    "name": "\u3064\u3070\u3081\u304C\u3048\u3057",
    "nameEn": "Aerial Ace",
    "type": "flying",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "aeroblast",
    "name": "\u30A8\u30A2\u30ED\u30D6\u30E9\u30B9\u30C8",
    "nameEn": "Aeroblast",
    "type": "flying",
    "category": "special",
    "power": 100,
    "accuracy": 95,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "afteryou",
    "name": "\u304A\u3055\u304D\u306B\u3069\u3046\u305E",
    "nameEn": "After You",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "agility",
    "name": "\u3053\u3046\u305D\u304F\u3044\u3069\u3046",
    "nameEn": "Agility",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3059\u3070\u3084\u3055\u21912"
  },
  {
    "id": "aircutter",
    "name": "\u30A8\u30A2\u30AB\u30C3\u30BF\u30FC",
    "nameEn": "Air Cutter",
    "type": "flying",
    "category": "special",
    "power": 60,
    "accuracy": 95,
    "pp": 25,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "airslash",
    "name": "\u30A8\u30A2\u30B9\u30E9\u30C3\u30B7\u30E5",
    "nameEn": "Air Slash",
    "type": "flying",
    "category": "special",
    "power": 75,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "alluringvoice",
    "name": "Alluring Voice",
    "nameEn": "Alluring Voice",
    "type": "fairy",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "allyswitch",
    "name": "Ally Switch",
    "nameEn": "Ally Switch",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 2,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+2"
  },
  {
    "id": "amnesia",
    "name": "\u30C9\u308F\u3059\u308C",
    "nameEn": "Amnesia",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3068\u304F\u307C\u3046\u21912"
  },
  {
    "id": "ancientpower",
    "name": "\u3052\u3093\u3057\u306E\u3061\u304B\u3089",
    "nameEn": "Ancient Power",
    "type": "rock",
    "category": "special",
    "power": 60,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "appleacid",
    "name": "Apple Acid",
    "nameEn": "Apple Acid",
    "type": "grass",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u3068\u304F\u307C\u3046\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "spd": -1
      }
    }
  },
  {
    "id": "aquacutter",
    "name": "Aqua Cutter",
    "nameEn": "Aqua Cutter",
    "type": "water",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "aquajet",
    "name": "\u30A2\u30AF\u30A2\u30B8\u30A7\u30C3\u30C8",
    "nameEn": "Aqua Jet",
    "type": "water",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 1,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+1"
  },
  {
    "id": "aquaring",
    "name": "\u30A2\u30AF\u30A2\u30EA\u30F3\u30B0",
    "nameEn": "Aqua Ring",
    "type": "water",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "aquastep",
    "name": "Aqua Step",
    "nameEn": "Aqua Step",
    "type": "water",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "aquatail",
    "name": "\u30A2\u30AF\u30A2\u30C6\u30FC\u30EB",
    "nameEn": "Aqua Tail",
    "type": "water",
    "category": "physical",
    "power": 90,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "armorcannon",
    "name": "Armor Cannon",
    "nameEn": "Armor Cannon",
    "type": "fire",
    "category": "special",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "armthrust",
    "name": "\u3064\u3063\u3071\u308A",
    "nameEn": "Arm Thrust",
    "type": "fighting",
    "category": "physical",
    "power": 15,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "aromaticmist",
    "name": "Aromatic Mist",
    "nameEn": "Aromatic Mist",
    "type": "fairy",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3068\u304F\u307C\u3046\u21911"
  },
  {
    "id": "assurance",
    "name": "\u30C0\u30E1\u304A\u3057",
    "nameEn": "Assurance",
    "type": "dark",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "astonish",
    "name": "\u304A\u3069\u308D\u304B\u3059",
    "nameEn": "Astonish",
    "type": "ghost",
    "category": "physical",
    "power": 30,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "astralbarrage",
    "name": "Astral Barrage",
    "nameEn": "Astral Barrage",
    "type": "ghost",
    "category": "special",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "attackorder",
    "name": "\u3053\u3046\u3052\u304D\u3057\u308C\u3044",
    "nameEn": "Attack Order",
    "type": "bug",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "attract",
    "name": "\u30E1\u30ED\u30E1\u30ED",
    "nameEn": "Attract",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "aurasphere",
    "name": "\u306F\u3069\u3046\u3060\u3093",
    "nameEn": "Aura Sphere",
    "type": "fighting",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "aurawheel",
    "name": "Aura Wheel",
    "nameEn": "Aura Wheel",
    "type": "electric",
    "category": "physical",
    "power": 110,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "aurorabeam",
    "name": "Aurora Beam",
    "nameEn": "Aurora Beam",
    "type": "ice",
    "category": "special",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u3053\u3046\u3052\u304D\u21931",
    "secondary": {
      "chance": 10,
      "boosts": {
        "atk": -1
      }
    }
  },
  {
    "id": "auroraveil",
    "name": "Aurora Veil",
    "nameEn": "Aurora Veil",
    "type": "ice",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "avalanche",
    "name": "\u3086\u304D\u306A\u3060\u308C",
    "nameEn": "Avalanche",
    "type": "ice",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "pp": 10,
    "priority": -4,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+-4"
  },
  {
    "id": "axekick",
    "name": "Axe Kick",
    "nameEn": "Axe Kick",
    "type": "fighting",
    "category": "physical",
    "power": 120,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "babydolleyes",
    "name": "Baby-Doll Eyes",
    "nameEn": "Baby-Doll Eyes",
    "type": "fairy",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21931\u30FB\u5148\u5236+1"
  },
  {
    "id": "baddybad",
    "name": "Baddy Bad",
    "nameEn": "Baddy Bad",
    "type": "dark",
    "category": "special",
    "power": 80,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "banefulbunker",
    "name": "\u30C8\u30FC\u30C1\u30AB",
    "nameEn": "Baneful Bunker",
    "type": "poison",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 4,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+4"
  },
  {
    "id": "barbbarrage",
    "name": "Barb Barrage",
    "nameEn": "Barb Barrage",
    "type": "poison",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB50%\u3067\u3069\u304F",
    "secondary": {
      "chance": 50,
      "status": "psn"
    }
  },
  {
    "id": "batonpass",
    "name": "\u30D0\u30C8\u30F3\u30BF\u30C3\u30C1",
    "nameEn": "Baton Pass",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "beakblast",
    "name": "Beak Blast",
    "nameEn": "Beak Blast",
    "type": "flying",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "pp": 15,
    "priority": -3,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+-3"
  },
  {
    "id": "beatup",
    "name": "\u3075\u304F\u308D\u3060\u305F\u304D",
    "nameEn": "Beat Up",
    "type": "dark",
    "category": "physical",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "behemothbash",
    "name": "Behemoth Bash",
    "nameEn": "Behemoth Bash",
    "type": "steel",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "behemothblade",
    "name": "Behemoth Blade",
    "nameEn": "Behemoth Blade",
    "type": "steel",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "belch",
    "name": "\u30B2\u30C3\u30D7",
    "nameEn": "Belch",
    "type": "poison",
    "category": "special",
    "power": 120,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "bellydrum",
    "name": "\u306F\u3089\u3060\u3044\u3053",
    "nameEn": "Belly Drum",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "bind",
    "name": "\u3057\u3081\u3064\u3051\u308B",
    "nameEn": "Bind",
    "type": "normal",
    "category": "physical",
    "power": 15,
    "accuracy": 85,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85"
  },
  {
    "id": "bite",
    "name": "\u304B\u307F\u3064\u304F",
    "nameEn": "Bite",
    "type": "dark",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "bitterblade",
    "name": "Bitter Blade",
    "nameEn": "Bitter Blade",
    "type": "fire",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u4E0E\u30C0\u30E1\u306E50%\u56DE\u5FA9",
    "drain": 50
  },
  {
    "id": "bittermalice",
    "name": "Bitter Malice",
    "nameEn": "Bitter Malice",
    "type": "ghost",
    "category": "special",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u3053\u3046\u3052\u304D\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "atk": -1
      }
    }
  },
  {
    "id": "blastburn",
    "name": "\u30D6\u30E9\u30B9\u30C8\u30D0\u30FC\u30F3",
    "nameEn": "Blast Burn",
    "type": "fire",
    "category": "special",
    "power": 150,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "blazekick",
    "name": "\u30D6\u30EC\u30A4\u30BA\u30AD\u30C3\u30AF",
    "nameEn": "Blaze Kick",
    "type": "fire",
    "category": "physical",
    "power": 85,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90\u30FB10%\u3067\u3084\u3051\u3069",
    "secondary": {
      "chance": 10,
      "status": "brn"
    }
  },
  {
    "id": "blazingtorque",
    "name": "Blazing Torque",
    "nameEn": "Blazing Torque",
    "type": "fire",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB30%\u3067\u3084\u3051\u3069",
    "secondary": {
      "chance": 30,
      "status": "brn"
    }
  },
  {
    "id": "bleakwindstorm",
    "name": "Bleakwind Storm",
    "nameEn": "Bleakwind Storm",
    "type": "flying",
    "category": "special",
    "power": 100,
    "accuracy": 80,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D80\u30FB30%\u3067\u3059\u3070\u3084\u3055\u21931",
    "secondary": {
      "chance": 30,
      "boosts": {
        "spe": -1
      }
    }
  },
  {
    "id": "blizzard",
    "name": "\u3075\u3076\u304D",
    "nameEn": "Blizzard",
    "type": "ice",
    "category": "special",
    "power": 110,
    "accuracy": 70,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D70\u30FB10%\u3067\u3053\u304A\u308A",
    "secondary": {
      "chance": 10,
      "status": "frz"
    }
  },
  {
    "id": "block",
    "name": "\u3068\u304A\u305B\u3093\u307C\u3046",
    "nameEn": "Block",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "bloodmoon",
    "name": "Blood Moon",
    "nameEn": "Blood Moon",
    "type": "normal",
    "category": "special",
    "power": 140,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "blueflare",
    "name": "\u3042\u304A\u3044\u307B\u306E\u304A",
    "nameEn": "Blue Flare",
    "type": "fire",
    "category": "special",
    "power": 130,
    "accuracy": 85,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85\u30FB20%\u3067\u3084\u3051\u3069",
    "secondary": {
      "chance": 20,
      "status": "brn"
    }
  },
  {
    "id": "bodypress",
    "name": "Body Press",
    "nameEn": "Body Press",
    "type": "fighting",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "bodyslam",
    "name": "\u306E\u3057\u304B\u304B\u308A",
    "nameEn": "Body Slam",
    "type": "normal",
    "category": "physical",
    "power": 85,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB30%\u3067\u307E\u3072",
    "secondary": {
      "chance": 30,
      "status": "par"
    }
  },
  {
    "id": "boltstrike",
    "name": "\u3089\u3044\u3052\u304D",
    "nameEn": "Bolt Strike",
    "type": "electric",
    "category": "physical",
    "power": 130,
    "accuracy": 85,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85\u30FB20%\u3067\u307E\u3072",
    "secondary": {
      "chance": 20,
      "status": "par"
    }
  },
  {
    "id": "bonerush",
    "name": "\u30DC\u30FC\u30F3\u30E9\u30C3\u30B7\u30E5",
    "nameEn": "Bone Rush",
    "type": "ground",
    "category": "physical",
    "power": 25,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "boomburst",
    "name": "Boomburst",
    "nameEn": "Boomburst",
    "type": "normal",
    "category": "special",
    "power": 140,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "bounce",
    "name": "\u3068\u3073\u306F\u306D\u308B",
    "nameEn": "Bounce",
    "type": "flying",
    "category": "physical",
    "power": 85,
    "accuracy": 85,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85\u30FB30%\u3067\u307E\u3072",
    "secondary": {
      "chance": 30,
      "status": "par"
    }
  },
  {
    "id": "bouncybubble",
    "name": "Bouncy Bubble",
    "nameEn": "Bouncy Bubble",
    "type": "water",
    "category": "special",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u4E0E\u30C0\u30E1\u306E50%\u56DE\u5FA9",
    "drain": 50
  },
  {
    "id": "branchpoke",
    "name": "Branch Poke",
    "nameEn": "Branch Poke",
    "type": "grass",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "bravebird",
    "name": "\u30D6\u30EC\u30A4\u30D6\u30D0\u30FC\u30C9",
    "nameEn": "Brave Bird",
    "type": "flying",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB33%\u53CD\u52D5",
    "recoil": 33
  },
  {
    "id": "breakingswipe",
    "name": "Breaking Swipe",
    "nameEn": "Breaking Swipe",
    "type": "dragon",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u3053\u3046\u3052\u304D\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "atk": -1
      }
    }
  },
  {
    "id": "brickbreak",
    "name": "\u304B\u308F\u3089\u308F\u308A",
    "nameEn": "Brick Break",
    "type": "fighting",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "brine",
    "name": "\u3057\u304A\u307F\u305A",
    "nameEn": "Brine",
    "type": "water",
    "category": "special",
    "power": 65,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "brutalswing",
    "name": "Brutal Swing",
    "nameEn": "Brutal Swing",
    "type": "dark",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "bubblebeam",
    "name": "\u30D0\u30D6\u30EB\u3053\u3046\u305B\u3093",
    "nameEn": "Bubble Beam",
    "type": "water",
    "category": "special",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u3059\u3070\u3084\u3055\u21931",
    "secondary": {
      "chance": 10,
      "boosts": {
        "spe": -1
      }
    }
  },
  {
    "id": "bugbite",
    "name": "\u3080\u3057\u304F\u3044",
    "nameEn": "Bug Bite",
    "type": "bug",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "bugbuzz",
    "name": "\u3080\u3057\u306E\u3055\u3056\u3081\u304D",
    "nameEn": "Bug Buzz",
    "type": "bug",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u3068\u304F\u307C\u3046\u21931",
    "secondary": {
      "chance": 10,
      "boosts": {
        "spd": -1
      }
    }
  },
  {
    "id": "bulkup",
    "name": "\u30D3\u30EB\u30C9\u30A2\u30C3\u30D7",
    "nameEn": "Bulk Up",
    "type": "fighting",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21911/\u307C\u3046\u304E\u3087\u21911"
  },
  {
    "id": "bulldoze",
    "name": "\u3058\u306A\u3089\u3057",
    "nameEn": "Bulldoze",
    "type": "ground",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u3059\u3070\u3084\u3055\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "spe": -1
      }
    }
  },
  {
    "id": "bulletpunch",
    "name": "\u30D0\u30EC\u30C3\u30C8\u30D1\u30F3\u30C1",
    "nameEn": "Bullet Punch",
    "type": "steel",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+1"
  },
  {
    "id": "bulletseed",
    "name": "\u30BF\u30CD\u30DE\u30B7\u30F3\u30AC\u30F3",
    "nameEn": "Bullet Seed",
    "type": "grass",
    "category": "physical",
    "power": 25,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "burningbulwark",
    "name": "Burning Bulwark",
    "nameEn": "Burning Bulwark",
    "type": "fire",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 4,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+4"
  },
  {
    "id": "burningjealousy",
    "name": "Burning Jealousy",
    "nameEn": "Burning Jealousy",
    "type": "fire",
    "category": "special",
    "power": 70,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "burnup",
    "name": "Burn Up",
    "nameEn": "Burn Up",
    "type": "fire",
    "category": "special",
    "power": 130,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "buzzybuzz",
    "name": "Buzzy Buzz",
    "nameEn": "Buzzy Buzz",
    "type": "electric",
    "category": "special",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u307E\u3072",
    "secondary": {
      "chance": 100,
      "status": "par"
    }
  },
  {
    "id": "calmmind",
    "name": "\u3081\u3044\u305D\u3046",
    "nameEn": "Calm Mind",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3068\u304F\u3053\u3046\u21911/\u3068\u304F\u307C\u3046\u21911"
  },
  {
    "id": "ceaselessedge",
    "name": "Ceaseless Edge",
    "nameEn": "Ceaseless Edge",
    "type": "dark",
    "category": "physical",
    "power": 65,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "celebrate",
    "name": "Celebrate",
    "nameEn": "Celebrate",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "charge",
    "name": "\u3058\u3085\u3046\u3067\u3093",
    "nameEn": "Charge",
    "type": "electric",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3068\u304F\u307C\u3046\u21911"
  },
  {
    "id": "chargebeam",
    "name": "\u30C1\u30E3\u30FC\u30B8\u30D3\u30FC\u30E0",
    "nameEn": "Charge Beam",
    "type": "electric",
    "category": "special",
    "power": 50,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "charm",
    "name": "\u3042\u307E\u3048\u308B",
    "nameEn": "Charm",
    "type": "fairy",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21932"
  },
  {
    "id": "chillingwater",
    "name": "Chilling Water",
    "nameEn": "Chilling Water",
    "type": "water",
    "category": "special",
    "power": 50,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u3053\u3046\u3052\u304D\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "atk": -1
      }
    }
  },
  {
    "id": "chillyreception",
    "name": "Chilly Reception",
    "nameEn": "Chilly Reception",
    "type": "ice",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "chloroblast",
    "name": "Chloroblast",
    "nameEn": "Chloroblast",
    "type": "grass",
    "category": "special",
    "power": 150,
    "accuracy": 95,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "circlethrow",
    "name": "\u3068\u3082\u3048\u306A\u3052",
    "nameEn": "Circle Throw",
    "type": "fighting",
    "category": "physical",
    "power": 60,
    "accuracy": 90,
    "pp": 10,
    "priority": -6,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90\u30FB\u5148\u5236+-6"
  },
  {
    "id": "clangingscales",
    "name": "Clanging Scales",
    "nameEn": "Clanging Scales",
    "type": "dragon",
    "category": "special",
    "power": 110,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "clangoroussoul",
    "name": "Clangorous Soul",
    "nameEn": "Clangorous Soul",
    "type": "dragon",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21911/\u307C\u3046\u304E\u3087\u21911/\u3068\u304F\u3053\u3046\u21911/\u3068\u304F\u307C\u3046\u21911/\u3059\u3070\u3084\u3055\u21911"
  },
  {
    "id": "clearsmog",
    "name": "\u30AF\u30EA\u30A2\u30B9\u30E2\u30C3\u30B0",
    "nameEn": "Clear Smog",
    "type": "poison",
    "category": "special",
    "power": 50,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "closecombat",
    "name": "\u30A4\u30F3\u30D5\u30A1\u30A4\u30C8",
    "nameEn": "Close Combat",
    "type": "fighting",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "coaching",
    "name": "Coaching",
    "nameEn": "Coaching",
    "type": "fighting",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21911/\u307C\u3046\u304E\u3087\u21911"
  },
  {
    "id": "coil",
    "name": "\u3068\u3050\u308D\u3092\u307E\u304F",
    "nameEn": "Coil",
    "type": "poison",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21911/\u307C\u3046\u304E\u3087\u21911/accuracy\u21911"
  },
  {
    "id": "collisioncourse",
    "name": "Collision Course",
    "nameEn": "Collision Course",
    "type": "fighting",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "combattorque",
    "name": "Combat Torque",
    "nameEn": "Combat Torque",
    "type": "fighting",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB30%\u3067\u307E\u3072",
    "secondary": {
      "chance": 30,
      "status": "par"
    }
  },
  {
    "id": "comeuppance",
    "name": "Comeuppance",
    "nameEn": "Comeuppance",
    "type": "dark",
    "category": "physical",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "confide",
    "name": "Confide",
    "nameEn": "Confide",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3068\u304F\u3053\u3046\u21931"
  },
  {
    "id": "confuseray",
    "name": "\u3042\u3084\u3057\u3044\u3072\u304B\u308A",
    "nameEn": "Confuse Ray",
    "type": "ghost",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "confusion",
    "name": "\u306D\u3093\u308A\u304D",
    "nameEn": "Confusion",
    "type": "psychic",
    "category": "special",
    "power": 50,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "conversion",
    "name": "\u30C6\u30AF\u30B9\u30C1\u30E3\u30FC",
    "nameEn": "Conversion",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "conversion2",
    "name": "\u30C6\u30AF\u30B9\u30C1\u30E3\u30FC\uFF12",
    "nameEn": "Conversion 2",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "copycat",
    "name": "\u307E\u306D\u3063\u3053",
    "nameEn": "Copycat",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "corrosivegas",
    "name": "Corrosive Gas",
    "nameEn": "Corrosive Gas",
    "type": "poison",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "cosmicpower",
    "name": "\u30B3\u30B9\u30E2\u30D1\u30EF\u30FC",
    "nameEn": "Cosmic Power",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u307C\u3046\u304E\u3087\u21911/\u3068\u304F\u307C\u3046\u21911"
  },
  {
    "id": "cottonguard",
    "name": "Cotton Guard",
    "nameEn": "Cotton Guard",
    "type": "grass",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u307C\u3046\u304E\u3087\u21913"
  },
  {
    "id": "cottonspore",
    "name": "\u308F\u305F\u307B\u3046\u3057",
    "nameEn": "Cotton Spore",
    "type": "grass",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3059\u3070\u3084\u3055\u21932"
  },
  {
    "id": "counter",
    "name": "\u30AB\u30A6\u30F3\u30BF\u30FC",
    "nameEn": "Counter",
    "type": "fighting",
    "category": "physical",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": -5,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+-5"
  },
  {
    "id": "courtchange",
    "name": "Court Change",
    "nameEn": "Court Change",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "covet",
    "name": "\u307B\u3057\u304C\u308B",
    "nameEn": "Covet",
    "type": "normal",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "crabhammer",
    "name": "\u30AF\u30E9\u30D6\u30CF\u30F3\u30DE\u30FC",
    "nameEn": "Crabhammer",
    "type": "water",
    "category": "physical",
    "power": 100,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "crosschop",
    "name": "\u30AF\u30ED\u30B9\u30C1\u30E7\u30C3\u30D7",
    "nameEn": "Cross Chop",
    "type": "fighting",
    "category": "physical",
    "power": 100,
    "accuracy": 80,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D80"
  },
  {
    "id": "crosspoison",
    "name": "\u30AF\u30ED\u30B9\u30DD\u30A4\u30BA\u30F3",
    "nameEn": "Cross Poison",
    "type": "poison",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u3069\u304F",
    "secondary": {
      "chance": 10,
      "status": "psn"
    }
  },
  {
    "id": "crunch",
    "name": "\u304B\u307F\u304F\u3060\u304F",
    "nameEn": "Crunch",
    "type": "dark",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB20%\u3067\u307C\u3046\u304E\u3087\u21931",
    "secondary": {
      "chance": 20,
      "boosts": {
        "def": -1
      }
    }
  },
  {
    "id": "crushclaw",
    "name": "\u30D6\u30EC\u30A4\u30AF\u30AF\u30ED\u30FC",
    "nameEn": "Crush Claw",
    "type": "normal",
    "category": "physical",
    "power": 75,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95\u30FB50%\u3067\u307C\u3046\u304E\u3087\u21931",
    "secondary": {
      "chance": 50,
      "boosts": {
        "def": -1
      }
    }
  },
  {
    "id": "crushgrip",
    "name": "\u306B\u304E\u308A\u3064\u3076\u3059",
    "nameEn": "Crush Grip",
    "type": "normal",
    "category": "physical",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "curse",
    "name": "\u306E\u308D\u3044",
    "nameEn": "Curse",
    "type": "ghost",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "cut",
    "name": "Cut",
    "nameEn": "Cut",
    "type": "normal",
    "category": "physical",
    "power": 50,
    "accuracy": 95,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "darkestlariat",
    "name": "DD\u30E9\u30EA\u30A2\u30C3\u30C8",
    "nameEn": "Darkest Lariat",
    "type": "dark",
    "category": "physical",
    "power": 85,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "darkpulse",
    "name": "\u3042\u304F\u306E\u306F\u3069\u3046",
    "nameEn": "Dark Pulse",
    "type": "dark",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "darkvoid",
    "name": "\u30C0\u30FC\u30AF\u30DB\u30FC\u30EB",
    "nameEn": "Dark Void",
    "type": "dark",
    "category": "status",
    "power": 0,
    "accuracy": 50,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D50"
  },
  {
    "id": "dazzlinggleam",
    "name": "\u30DE\u30B8\u30AB\u30EB\u30B7\u30E3\u30A4\u30F3",
    "nameEn": "Dazzling Gleam",
    "type": "fairy",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "decorate",
    "name": "Decorate",
    "nameEn": "Decorate",
    "type": "fairy",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21912/\u3068\u304F\u3053\u3046\u21912"
  },
  {
    "id": "defendorder",
    "name": "\u307C\u3046\u304E\u3087\u3057\u308C\u3044",
    "nameEn": "Defend Order",
    "type": "bug",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u307C\u3046\u304E\u3087\u21911/\u3068\u304F\u307C\u3046\u21911"
  },
  {
    "id": "defensecurl",
    "name": "\u307E\u308B\u304F\u306A\u308B",
    "nameEn": "Defense Curl",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u307C\u3046\u304E\u3087\u21911"
  },
  {
    "id": "defog",
    "name": "\u304D\u308A\u3070\u3089\u3044",
    "nameEn": "Defog",
    "type": "flying",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "destinybond",
    "name": "\u307F\u3061\u3065\u308C",
    "nameEn": "Destiny Bond",
    "type": "ghost",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "detect",
    "name": "\u307F\u304D\u308A",
    "nameEn": "Detect",
    "type": "fighting",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 4,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+4"
  },
  {
    "id": "diamondstorm",
    "name": "\u30C0\u30A4\u30E4\u30B9\u30C8\u30FC\u30E0",
    "nameEn": "Diamond Storm",
    "type": "rock",
    "category": "physical",
    "power": 100,
    "accuracy": 95,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "dig",
    "name": "\u3042\u306A\u3092\u307B\u308B",
    "nameEn": "Dig",
    "type": "ground",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "direclaw",
    "name": "Dire Claw",
    "nameEn": "Dire Claw",
    "type": "poison",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "disable",
    "name": "\u304B\u306A\u3057\u3070\u308A",
    "nameEn": "Disable",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "disarmingvoice",
    "name": "Disarming Voice",
    "nameEn": "Disarming Voice",
    "type": "fairy",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "discharge",
    "name": "\u307B\u3046\u3067\u3093",
    "nameEn": "Discharge",
    "type": "electric",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB30%\u3067\u307E\u3072",
    "secondary": {
      "chance": 30,
      "status": "par"
    }
  },
  {
    "id": "dive",
    "name": "\u30C0\u30A4\u30D3\u30F3\u30B0",
    "nameEn": "Dive",
    "type": "water",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "doodle",
    "name": "Doodle",
    "nameEn": "Doodle",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "doomdesire",
    "name": "\u306F\u3081\u3064\u306E\u306D\u304C\u3044",
    "nameEn": "Doom Desire",
    "type": "steel",
    "category": "special",
    "power": 140,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "doubleedge",
    "name": "\u3059\u3066\u307F\u30BF\u30C3\u30AF\u30EB",
    "nameEn": "Double-Edge",
    "type": "normal",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB33%\u53CD\u52D5",
    "recoil": 33
  },
  {
    "id": "doublehit",
    "name": "\u30C0\u30D6\u30EB\u30A2\u30BF\u30C3\u30AF",
    "nameEn": "Double Hit",
    "type": "normal",
    "category": "physical",
    "power": 35,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "doublekick",
    "name": "\u306B\u3069\u3052\u308A",
    "nameEn": "Double Kick",
    "type": "fighting",
    "category": "physical",
    "power": 30,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "doubleshock",
    "name": "Double Shock",
    "nameEn": "Double Shock",
    "type": "electric",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "doubleteam",
    "name": "\u304B\u3052\u3076\u3093\u3057\u3093",
    "nameEn": "Double Team",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306Eevasion\u21911"
  },
  {
    "id": "dracometeor",
    "name": "\u308A\u3085\u3046\u305B\u3044\u3050\u3093",
    "nameEn": "Draco Meteor",
    "type": "dragon",
    "category": "special",
    "power": 130,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "dragonascent",
    "name": "\u30AC\u30EA\u30E7\u30A6\u30C6\u30F3\u30BB\u30A4",
    "nameEn": "Dragon Ascent",
    "type": "flying",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "dragonbreath",
    "name": "\u308A\u3085\u3046\u306E\u3044\u3076\u304D",
    "nameEn": "Dragon Breath",
    "type": "dragon",
    "category": "special",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB30%\u3067\u307E\u3072",
    "secondary": {
      "chance": 30,
      "status": "par"
    }
  },
  {
    "id": "dragoncheer",
    "name": "Dragon Cheer",
    "nameEn": "Dragon Cheer",
    "type": "dragon",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "dragonclaw",
    "name": "\u30C9\u30E9\u30B4\u30F3\u30AF\u30ED\u30FC",
    "nameEn": "Dragon Claw",
    "type": "dragon",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "dragondance",
    "name": "\u308A\u3085\u3046\u306E\u307E\u3044",
    "nameEn": "Dragon Dance",
    "type": "dragon",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21911/\u3059\u3070\u3084\u3055\u21911"
  },
  {
    "id": "dragondarts",
    "name": "Dragon Darts",
    "nameEn": "Dragon Darts",
    "type": "dragon",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "dragonenergy",
    "name": "Dragon Energy",
    "nameEn": "Dragon Energy",
    "type": "dragon",
    "category": "special",
    "power": 150,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "dragonhammer",
    "name": "Dragon Hammer",
    "nameEn": "Dragon Hammer",
    "type": "dragon",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "dragonpulse",
    "name": "\u308A\u3085\u3046\u306E\u306F\u3069\u3046",
    "nameEn": "Dragon Pulse",
    "type": "dragon",
    "category": "special",
    "power": 85,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "dragonrush",
    "name": "\u30C9\u30E9\u30B4\u30F3\u30C0\u30A4\u30D6",
    "nameEn": "Dragon Rush",
    "type": "dragon",
    "category": "physical",
    "power": 100,
    "accuracy": 75,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D75"
  },
  {
    "id": "dragontail",
    "name": "Dragon Tail",
    "nameEn": "Dragon Tail",
    "type": "dragon",
    "category": "physical",
    "power": 60,
    "accuracy": 90,
    "pp": 10,
    "priority": -6,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90\u30FB\u5148\u5236+-6"
  },
  {
    "id": "drainingkiss",
    "name": "\u30C9\u30EC\u30A4\u30F3\u30AD\u30C3\u30B9",
    "nameEn": "Draining Kiss",
    "type": "fairy",
    "category": "special",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u4E0E\u30C0\u30E1\u306E75%\u56DE\u5FA9",
    "drain": 75
  },
  {
    "id": "drainpunch",
    "name": "\u30C9\u30EC\u30A4\u30F3\u30D1\u30F3\u30C1",
    "nameEn": "Drain Punch",
    "type": "fighting",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u4E0E\u30C0\u30E1\u306E50%\u56DE\u5FA9",
    "drain": 50
  },
  {
    "id": "dreameater",
    "name": "\u3086\u3081\u304F\u3044",
    "nameEn": "Dream Eater",
    "type": "psychic",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u4E0E\u30C0\u30E1\u306E50%\u56DE\u5FA9",
    "drain": 50
  },
  {
    "id": "drillpeck",
    "name": "\u30C9\u30EA\u30EB\u304F\u3061\u3070\u3057",
    "nameEn": "Drill Peck",
    "type": "flying",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "drillrun",
    "name": "Drill Run",
    "nameEn": "Drill Run",
    "type": "ground",
    "category": "physical",
    "power": 80,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "drumbeating",
    "name": "Drum Beating",
    "nameEn": "Drum Beating",
    "type": "grass",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u3059\u3070\u3084\u3055\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "spe": -1
      }
    }
  },
  {
    "id": "dualwingbeat",
    "name": "\u30C0\u30D6\u30EB\u30A6\u30A4\u30F3\u30B0",
    "nameEn": "Dual Wingbeat",
    "type": "flying",
    "category": "physical",
    "power": 40,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "dynamaxcannon",
    "name": "Dynamax Cannon",
    "nameEn": "Dynamax Cannon",
    "type": "dragon",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "dynamicpunch",
    "name": "\u3070\u304F\u308C\u3064\u30D1\u30F3\u30C1",
    "nameEn": "Dynamic Punch",
    "type": "fighting",
    "category": "physical",
    "power": 100,
    "accuracy": 50,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D50"
  },
  {
    "id": "earthpower",
    "name": "\u3060\u3044\u3061\u306E\u3061\u304B\u3089",
    "nameEn": "Earth Power",
    "type": "ground",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u3068\u304F\u307C\u3046\u21931",
    "secondary": {
      "chance": 10,
      "boosts": {
        "spd": -1
      }
    }
  },
  {
    "id": "earthquake",
    "name": "\u3058\u3057\u3093",
    "nameEn": "Earthquake",
    "type": "ground",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "echoedvoice",
    "name": "\u30A8\u30B3\u30FC\u30DC\u30A4\u30B9",
    "nameEn": "Echoed Voice",
    "type": "normal",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "eerieimpulse",
    "name": "Eerie Impulse",
    "nameEn": "Eerie Impulse",
    "type": "electric",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3068\u304F\u3053\u3046\u21932"
  },
  {
    "id": "eeriespell",
    "name": "Eerie Spell",
    "nameEn": "Eerie Spell",
    "type": "psychic",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "electricterrain",
    "name": "Electric Terrain",
    "nameEn": "Electric Terrain",
    "type": "electric",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "electroball",
    "name": "Electro Ball",
    "nameEn": "Electro Ball",
    "type": "electric",
    "category": "special",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "electrodrift",
    "name": "Electro Drift",
    "nameEn": "Electro Drift",
    "type": "electric",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "electroshot",
    "name": "Electro Shot",
    "nameEn": "Electro Shot",
    "type": "electric",
    "category": "special",
    "power": 130,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "electroweb",
    "name": "\u30A8\u30EC\u30AD\u30CD\u30C3\u30C8",
    "nameEn": "Electroweb",
    "type": "electric",
    "category": "special",
    "power": 55,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95\u30FB100%\u3067\u3059\u3070\u3084\u3055\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "spe": -1
      }
    }
  },
  {
    "id": "ember",
    "name": "\u3072\u306E\u3053",
    "nameEn": "Ember",
    "type": "fire",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u3084\u3051\u3069",
    "secondary": {
      "chance": 10,
      "status": "brn"
    }
  },
  {
    "id": "encore",
    "name": "\u30A2\u30F3\u30B3\u30FC\u30EB",
    "nameEn": "Encore",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "endeavor",
    "name": "\u304C\u3080\u3057\u3083\u3089",
    "nameEn": "Endeavor",
    "type": "normal",
    "category": "physical",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "endure",
    "name": "\u3053\u3089\u3048\u308B",
    "nameEn": "Endure",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 4,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+4"
  },
  {
    "id": "energyball",
    "name": "\u30A8\u30CA\u30B8\u30FC\u30DC\u30FC\u30EB",
    "nameEn": "Energy Ball",
    "type": "grass",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u3068\u304F\u307C\u3046\u21931",
    "secondary": {
      "chance": 10,
      "boosts": {
        "spd": -1
      }
    }
  },
  {
    "id": "entrainment",
    "name": "Entrainment",
    "nameEn": "Entrainment",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "eruption",
    "name": "\u3075\u3093\u304B",
    "nameEn": "Eruption",
    "type": "fire",
    "category": "special",
    "power": 150,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "esperwing",
    "name": "Esper Wing",
    "nameEn": "Esper Wing",
    "type": "psychic",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "expandingforce",
    "name": "\u30EF\u30A4\u30C9\u30D5\u30A9\u30FC\u30B9",
    "nameEn": "Expanding Force",
    "type": "psychic",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "explosion",
    "name": "\u3060\u3044\u3070\u304F\u306F\u3064",
    "nameEn": "Explosion",
    "type": "normal",
    "category": "physical",
    "power": 250,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "extrasensory",
    "name": "\u3058\u3093\u3064\u3046\u308A\u304D",
    "nameEn": "Extrasensory",
    "type": "psychic",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "extremespeed",
    "name": "\u3057\u3093\u305D\u304F",
    "nameEn": "Extreme Speed",
    "type": "normal",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 5,
    "priority": 2,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+2"
  },
  {
    "id": "facade",
    "name": "\u304B\u3089\u3052\u3093\u304D",
    "nameEn": "Facade",
    "type": "normal",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "fairylock",
    "name": "Fairy Lock",
    "nameEn": "Fairy Lock",
    "type": "fairy",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "fairywind",
    "name": "\u3088\u3046\u305B\u3044\u306E\u304B\u305C",
    "nameEn": "Fairy Wind",
    "type": "fairy",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "fakeout",
    "name": "\u306D\u3053\u3060\u307E\u3057",
    "nameEn": "Fake Out",
    "type": "normal",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "pp": 10,
    "priority": 3,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+3"
  },
  {
    "id": "faketears",
    "name": "\u3046\u305D\u306A\u304D",
    "nameEn": "Fake Tears",
    "type": "dark",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3068\u304F\u307C\u3046\u21932"
  },
  {
    "id": "falsesurrender",
    "name": "False Surrender",
    "nameEn": "False Surrender",
    "type": "dark",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "falseswipe",
    "name": "\u307F\u306D\u3046\u3061",
    "nameEn": "False Swipe",
    "type": "normal",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "featherdance",
    "name": "\u30D5\u30A7\u30B6\u30FC\u30C0\u30F3\u30B9",
    "nameEn": "Feather Dance",
    "type": "flying",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21932"
  },
  {
    "id": "feint",
    "name": "\u30D5\u30A7\u30A4\u30F3\u30C8",
    "nameEn": "Feint",
    "type": "normal",
    "category": "physical",
    "power": 30,
    "accuracy": 100,
    "pp": 10,
    "priority": 2,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+2"
  },
  {
    "id": "fellstinger",
    "name": "\u3068\u3069\u3081\u3070\u308A",
    "nameEn": "Fell Stinger",
    "type": "bug",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "ficklebeam",
    "name": "Fickle Beam",
    "nameEn": "Fickle Beam",
    "type": "dragon",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "fierydance",
    "name": "\u307B\u306E\u304A\u306E\u307E\u3044",
    "nameEn": "Fiery Dance",
    "type": "fire",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "fierywrath",
    "name": "Fiery Wrath",
    "nameEn": "Fiery Wrath",
    "type": "dark",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "filletaway",
    "name": "Fillet Away",
    "nameEn": "Fillet Away",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21912/\u3068\u304F\u3053\u3046\u21912/\u3059\u3070\u3084\u3055\u21912"
  },
  {
    "id": "finalgambit",
    "name": "\u3044\u306E\u3061\u304C\u3051",
    "nameEn": "Final Gambit",
    "type": "fighting",
    "category": "special",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "fireblast",
    "name": "\u3060\u3044\u3082\u3093\u3058",
    "nameEn": "Fire Blast",
    "type": "fire",
    "category": "special",
    "power": 110,
    "accuracy": 85,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85\u30FB10%\u3067\u3084\u3051\u3069",
    "secondary": {
      "chance": 10,
      "status": "brn"
    }
  },
  {
    "id": "firefang",
    "name": "\u307B\u306E\u304A\u306E\u30AD\u30D0",
    "nameEn": "Fire Fang",
    "type": "fire",
    "category": "physical",
    "power": 65,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "firelash",
    "name": "Fire Lash",
    "nameEn": "Fire Lash",
    "type": "fire",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u307C\u3046\u304E\u3087\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "def": -1
      }
    }
  },
  {
    "id": "firepledge",
    "name": "\u307B\u306E\u304A\u306E\u3061\u304B\u3044",
    "nameEn": "Fire Pledge",
    "type": "fire",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "firepunch",
    "name": "Fire Punch",
    "nameEn": "Fire Punch",
    "type": "fire",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u3084\u3051\u3069",
    "secondary": {
      "chance": 10,
      "status": "brn"
    }
  },
  {
    "id": "firespin",
    "name": "\u307B\u306E\u304A\u306E\u3046\u305A",
    "nameEn": "Fire Spin",
    "type": "fire",
    "category": "special",
    "power": 35,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85"
  },
  {
    "id": "firstimpression",
    "name": "\u3067\u3042\u3044\u304C\u3057\u3089",
    "nameEn": "First Impression",
    "type": "bug",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 2,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+2"
  },
  {
    "id": "fissure",
    "name": "\u3058\u308F\u308C",
    "nameEn": "Fissure",
    "type": "ground",
    "category": "physical",
    "power": 0,
    "accuracy": 30,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D30"
  },
  {
    "id": "flail",
    "name": "\u3058\u305F\u3070\u305F",
    "nameEn": "Flail",
    "type": "normal",
    "category": "physical",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "flamecharge",
    "name": "Flame Charge",
    "nameEn": "Flame Charge",
    "type": "fire",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "flamethrower",
    "name": "\u304B\u3048\u3093\u307B\u3046\u3057\u3083",
    "nameEn": "Flamethrower",
    "type": "fire",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u3084\u3051\u3069",
    "secondary": {
      "chance": 10,
      "status": "brn"
    }
  },
  {
    "id": "flamewheel",
    "name": "\u304B\u3048\u3093\u3050\u308B\u307E",
    "nameEn": "Flame Wheel",
    "type": "fire",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u3084\u3051\u3069",
    "secondary": {
      "chance": 10,
      "status": "brn"
    }
  },
  {
    "id": "flareblitz",
    "name": "\u30D5\u30EC\u30A2\u30C9\u30E9\u30A4\u30D6",
    "nameEn": "Flare Blitz",
    "type": "fire",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u3084\u3051\u3069\u30FB33%\u53CD\u52D5",
    "recoil": 33,
    "secondary": {
      "chance": 10,
      "status": "brn"
    }
  },
  {
    "id": "flashcannon",
    "name": "\u30E9\u30B9\u30BF\u30FC\u30AB\u30CE\u30F3",
    "nameEn": "Flash Cannon",
    "type": "steel",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u3068\u304F\u307C\u3046\u21931",
    "secondary": {
      "chance": 10,
      "boosts": {
        "spd": -1
      }
    }
  },
  {
    "id": "flatter",
    "name": "\u304A\u3060\u3066\u308B",
    "nameEn": "Flatter",
    "type": "dark",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3068\u304F\u3053\u3046\u21911"
  },
  {
    "id": "fleurcannon",
    "name": "\u30D5\u30EB\u30FC\u30EB\u30AB\u30CE\u30F3",
    "nameEn": "Fleur Cannon",
    "type": "fairy",
    "category": "special",
    "power": 130,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "fling",
    "name": "\u306A\u3052\u3064\u3051\u308B",
    "nameEn": "Fling",
    "type": "dark",
    "category": "physical",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "flipturn",
    "name": "\u30AF\u30A4\u30C3\u30AF\u30BF\u30FC\u30F3",
    "nameEn": "Flip Turn",
    "type": "water",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "floatyfall",
    "name": "Floaty Fall",
    "nameEn": "Floaty Fall",
    "type": "flying",
    "category": "physical",
    "power": 90,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "floralhealing",
    "name": "Floral Healing",
    "nameEn": "Floral Healing",
    "type": "fairy",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "flowertrick",
    "name": "Flower Trick",
    "nameEn": "Flower Trick",
    "type": "grass",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "fly",
    "name": "\u305D\u3089\u3092\u3068\u3076",
    "nameEn": "Fly",
    "type": "flying",
    "category": "physical",
    "power": 90,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "flyingpress",
    "name": "Flying Press",
    "nameEn": "Flying Press",
    "type": "fighting",
    "category": "physical",
    "power": 100,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "focusblast",
    "name": "\u304D\u3042\u3044\u3060\u307E",
    "nameEn": "Focus Blast",
    "type": "fighting",
    "category": "special",
    "power": 120,
    "accuracy": 70,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D70\u30FB10%\u3067\u3068\u304F\u307C\u3046\u21931",
    "secondary": {
      "chance": 10,
      "boosts": {
        "spd": -1
      }
    }
  },
  {
    "id": "focusenergy",
    "name": "\u304D\u3042\u3044\u3060\u3081",
    "nameEn": "Focus Energy",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "focuspunch",
    "name": "\u304D\u3042\u3044\u30D1\u30F3\u30C1",
    "nameEn": "Focus Punch",
    "type": "fighting",
    "category": "physical",
    "power": 150,
    "accuracy": 100,
    "pp": 20,
    "priority": -3,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+-3"
  },
  {
    "id": "followme",
    "name": "\u3053\u306E\u3086\u3073\u3068\u307E\u308C",
    "nameEn": "Follow Me",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 2,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+2"
  },
  {
    "id": "forcepalm",
    "name": "\u306F\u3063\u3051\u3044",
    "nameEn": "Force Palm",
    "type": "fighting",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB30%\u3067\u307E\u3072",
    "secondary": {
      "chance": 30,
      "status": "par"
    }
  },
  {
    "id": "forestscurse",
    "name": "Forest's Curse",
    "nameEn": "Forest's Curse",
    "type": "grass",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "foulplay",
    "name": "\u30A4\u30AB\u30B5\u30DE",
    "nameEn": "Foul Play",
    "type": "dark",
    "category": "physical",
    "power": 95,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "freezedry",
    "name": "Freeze-Dry",
    "nameEn": "Freeze-Dry",
    "type": "ice",
    "category": "special",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u3053\u304A\u308A",
    "secondary": {
      "chance": 10,
      "status": "frz"
    }
  },
  {
    "id": "freezeshock",
    "name": "Freeze Shock",
    "nameEn": "Freeze Shock",
    "type": "ice",
    "category": "physical",
    "power": 140,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90\u30FB30%\u3067\u307E\u3072",
    "secondary": {
      "chance": 30,
      "status": "par"
    }
  },
  {
    "id": "freezingglare",
    "name": "Freezing Glare",
    "nameEn": "Freezing Glare",
    "type": "psychic",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u3053\u304A\u308A",
    "secondary": {
      "chance": 10,
      "status": "frz"
    }
  },
  {
    "id": "freezyfrost",
    "name": "Freezy Frost",
    "nameEn": "Freezy Frost",
    "type": "ice",
    "category": "special",
    "power": 100,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "frenzyplant",
    "name": "\u30CF\u30FC\u30C9\u30D7\u30E9\u30F3\u30C8",
    "nameEn": "Frenzy Plant",
    "type": "grass",
    "category": "special",
    "power": 150,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "frostbreath",
    "name": "Frost Breath",
    "nameEn": "Frost Breath",
    "type": "ice",
    "category": "special",
    "power": 60,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "furyattack",
    "name": "\u307F\u3060\u308C\u3065\u304D",
    "nameEn": "Fury Attack",
    "type": "normal",
    "category": "physical",
    "power": 15,
    "accuracy": 85,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85"
  },
  {
    "id": "furycutter",
    "name": "\u308C\u3093\u305E\u304F\u304E\u308A",
    "nameEn": "Fury Cutter",
    "type": "bug",
    "category": "physical",
    "power": 40,
    "accuracy": 95,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "furyswipes",
    "name": "\u307F\u3060\u308C\u3072\u3063\u304B\u304D",
    "nameEn": "Fury Swipes",
    "type": "normal",
    "category": "physical",
    "power": 18,
    "accuracy": 80,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D80"
  },
  {
    "id": "fusionbolt",
    "name": "\u30AF\u30ED\u30B9\u30B5\u30F3\u30C0\u30FC",
    "nameEn": "Fusion Bolt",
    "type": "electric",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "fusionflare",
    "name": "\u30AF\u30ED\u30B9\u30D5\u30EC\u30A4\u30E0",
    "nameEn": "Fusion Flare",
    "type": "fire",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "futuresight",
    "name": "\u307F\u3089\u3044\u3088\u3061",
    "nameEn": "Future Sight",
    "type": "psychic",
    "category": "special",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "gastroacid",
    "name": "\u3044\u3048\u304D",
    "nameEn": "Gastro Acid",
    "type": "poison",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "gigadrain",
    "name": "\u30AE\u30AC\u30C9\u30EC\u30A4\u30F3",
    "nameEn": "Giga Drain",
    "type": "grass",
    "category": "special",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u4E0E\u30C0\u30E1\u306E50%\u56DE\u5FA9",
    "drain": 50
  },
  {
    "id": "gigaimpact",
    "name": "\u30AE\u30AC\u30A4\u30F3\u30D1\u30AF\u30C8",
    "nameEn": "Giga Impact",
    "type": "normal",
    "category": "physical",
    "power": 150,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "gigatonhammer",
    "name": "Gigaton Hammer",
    "nameEn": "Gigaton Hammer",
    "type": "steel",
    "category": "physical",
    "power": 160,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "glaciallance",
    "name": "Glacial Lance",
    "nameEn": "Glacial Lance",
    "type": "ice",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "glaciate",
    "name": "\u3053\u3054\u3048\u308B\u305B\u304B\u3044",
    "nameEn": "Glaciate",
    "type": "ice",
    "category": "special",
    "power": 65,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95\u30FB100%\u3067\u3059\u3070\u3084\u3055\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "spe": -1
      }
    }
  },
  {
    "id": "glaiverush",
    "name": "Glaive Rush",
    "nameEn": "Glaive Rush",
    "type": "dragon",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "glare",
    "name": "\u3078\u3073\u306B\u3089\u307F",
    "nameEn": "Glare",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "glitzyglow",
    "name": "Glitzy Glow",
    "nameEn": "Glitzy Glow",
    "type": "psychic",
    "category": "special",
    "power": 80,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "grassknot",
    "name": "\u304F\u3055\u3080\u3059\u3073",
    "nameEn": "Grass Knot",
    "type": "grass",
    "category": "special",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "grasspledge",
    "name": "\u304F\u3055\u306E\u3061\u304B\u3044",
    "nameEn": "Grass Pledge",
    "type": "grass",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "grassyglide",
    "name": "\u30B0\u30E9\u30B9\u30B9\u30E9\u30A4\u30C0\u30FC",
    "nameEn": "Grassy Glide",
    "type": "grass",
    "category": "physical",
    "power": 55,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "grassyterrain",
    "name": "Grassy Terrain",
    "nameEn": "Grassy Terrain",
    "type": "grass",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "gravapple",
    "name": "Grav Apple",
    "nameEn": "Grav Apple",
    "type": "grass",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u307C\u3046\u304E\u3087\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "def": -1
      }
    }
  },
  {
    "id": "gravity",
    "name": "\u3058\u3085\u3046\u308A\u3087\u304F",
    "nameEn": "Gravity",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "growl",
    "name": "\u306A\u304D\u3054\u3048",
    "nameEn": "Growl",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21931"
  },
  {
    "id": "growth",
    "name": "\u305B\u3044\u3061\u3087\u3046",
    "nameEn": "Growth",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21911/\u3068\u304F\u3053\u3046\u21911"
  },
  {
    "id": "guardsplit",
    "name": "Guard Split",
    "nameEn": "Guard Split",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "guardswap",
    "name": "\u30AC\u30FC\u30C9\u30B9\u30EF\u30C3\u30D7",
    "nameEn": "Guard Swap",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "guillotine",
    "name": "Guillotine",
    "nameEn": "Guillotine",
    "type": "normal",
    "category": "physical",
    "power": 0,
    "accuracy": 30,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D30"
  },
  {
    "id": "gunkshot",
    "name": "\u30C0\u30B9\u30C8\u30B7\u30E5\u30FC\u30C8",
    "nameEn": "Gunk Shot",
    "type": "poison",
    "category": "physical",
    "power": 120,
    "accuracy": 80,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D80\u30FB30%\u3067\u3069\u304F",
    "secondary": {
      "chance": 30,
      "status": "psn"
    }
  },
  {
    "id": "gust",
    "name": "\u304B\u305C\u304A\u3053\u3057",
    "nameEn": "Gust",
    "type": "flying",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "gyroball",
    "name": "\u30B8\u30E3\u30A4\u30ED\u30DC\u30FC\u30EB",
    "nameEn": "Gyro Ball",
    "type": "steel",
    "category": "physical",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "hammerarm",
    "name": "\u30A2\u30FC\u30E0\u30CF\u30F3\u30DE\u30FC",
    "nameEn": "Hammer Arm",
    "type": "fighting",
    "category": "physical",
    "power": 100,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "happyhour",
    "name": "Happy Hour",
    "nameEn": "Happy Hour",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "harden",
    "name": "\u304B\u305F\u304F\u306A\u308B",
    "nameEn": "Harden",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u307C\u3046\u304E\u3087\u21911"
  },
  {
    "id": "hardpress",
    "name": "Hard Press",
    "nameEn": "Hard Press",
    "type": "steel",
    "category": "physical",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "haze",
    "name": "\u304F\u308D\u3044\u304D\u308A",
    "nameEn": "Haze",
    "type": "ice",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "headbutt",
    "name": "\u305A\u3064\u304D",
    "nameEn": "Headbutt",
    "type": "normal",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "headlongrush",
    "name": "Headlong Rush",
    "nameEn": "Headlong Rush",
    "type": "ground",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "headsmash",
    "name": "\u3082\u308D\u306F\u306E\u305A\u3064\u304D",
    "nameEn": "Head Smash",
    "type": "rock",
    "category": "physical",
    "power": 150,
    "accuracy": 80,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D80\u30FB50%\u53CD\u52D5",
    "recoil": 50
  },
  {
    "id": "healbell",
    "name": "\u3044\u3084\u3057\u306E\u3059\u305A",
    "nameEn": "Heal Bell",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "healingwish",
    "name": "\u3044\u3084\u3057\u306E\u306D\u304C\u3044",
    "nameEn": "Healing Wish",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "healpulse",
    "name": "Heal Pulse",
    "nameEn": "Heal Pulse",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "heartswap",
    "name": "\u30CF\u30FC\u30C8\u30B9\u30EF\u30C3\u30D7",
    "nameEn": "Heart Swap",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "heatcrash",
    "name": "Heat Crash",
    "nameEn": "Heat Crash",
    "type": "fire",
    "category": "physical",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "heatwave",
    "name": "\u306D\u3063\u3077\u3046",
    "nameEn": "Heat Wave",
    "type": "fire",
    "category": "special",
    "power": 95,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90\u30FB10%\u3067\u3084\u3051\u3069",
    "secondary": {
      "chance": 10,
      "status": "brn"
    }
  },
  {
    "id": "heavyslam",
    "name": "Heavy Slam",
    "nameEn": "Heavy Slam",
    "type": "steel",
    "category": "physical",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "helpinghand",
    "name": "\u3066\u3060\u3059\u3051",
    "nameEn": "Helping Hand",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 5,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+5"
  },
  {
    "id": "hex",
    "name": "\u305F\u305F\u308A\u3081",
    "nameEn": "Hex",
    "type": "ghost",
    "category": "special",
    "power": 65,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "highhorsepower",
    "name": "High Horsepower",
    "nameEn": "High Horsepower",
    "type": "ground",
    "category": "physical",
    "power": 95,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "highjumpkick",
    "name": "High Jump Kick",
    "nameEn": "High Jump Kick",
    "type": "fighting",
    "category": "physical",
    "power": 130,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "holdback",
    "name": "Hold Back",
    "nameEn": "Hold Back",
    "type": "normal",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "holdhands",
    "name": "Hold Hands",
    "nameEn": "Hold Hands",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "honeclaws",
    "name": "\u3064\u3081\u3068\u304E",
    "nameEn": "Hone Claws",
    "type": "dark",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21911/accuracy\u21911"
  },
  {
    "id": "hornattack",
    "name": "\u3064\u306E\u3067\u3064\u304F",
    "nameEn": "Horn Attack",
    "type": "normal",
    "category": "physical",
    "power": 65,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "horndrill",
    "name": "\u3064\u306E\u30C9\u30EA\u30EB",
    "nameEn": "Horn Drill",
    "type": "normal",
    "category": "physical",
    "power": 0,
    "accuracy": 30,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D30"
  },
  {
    "id": "hornleech",
    "name": "Horn Leech",
    "nameEn": "Horn Leech",
    "type": "grass",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u4E0E\u30C0\u30E1\u306E50%\u56DE\u5FA9",
    "drain": 50
  },
  {
    "id": "howl",
    "name": "\u3068\u304A\u307C\u3048",
    "nameEn": "Howl",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21911"
  },
  {
    "id": "hurricane",
    "name": "\u307C\u3046\u3075\u3046",
    "nameEn": "Hurricane",
    "type": "flying",
    "category": "special",
    "power": 110,
    "accuracy": 70,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D70"
  },
  {
    "id": "hydrocannon",
    "name": "\u30CF\u30A4\u30C9\u30ED\u30AB\u30CE\u30F3",
    "nameEn": "Hydro Cannon",
    "type": "water",
    "category": "special",
    "power": 150,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "hydropump",
    "name": "\u30CF\u30A4\u30C9\u30ED\u30DD\u30F3\u30D7",
    "nameEn": "Hydro Pump",
    "type": "water",
    "category": "special",
    "power": 110,
    "accuracy": 80,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D80"
  },
  {
    "id": "hydrosteam",
    "name": "Hydro Steam",
    "nameEn": "Hydro Steam",
    "type": "water",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "hyperbeam",
    "name": "\u306F\u304B\u3044\u3053\u3046\u305B\u3093",
    "nameEn": "Hyper Beam",
    "type": "normal",
    "category": "special",
    "power": 150,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "hyperdrill",
    "name": "Hyper Drill",
    "nameEn": "Hyper Drill",
    "type": "normal",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "hyperspacefury",
    "name": "\u3044\u3058\u3052\u3093\u30E9\u30C3\u30B7\u30E5",
    "nameEn": "Hyperspace Fury",
    "type": "dark",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "hyperspacehole",
    "name": "Hyperspace Hole",
    "nameEn": "Hyperspace Hole",
    "type": "psychic",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "hypervoice",
    "name": "\u30CF\u30A4\u30D1\u30FC\u30DC\u30A4\u30B9",
    "nameEn": "Hyper Voice",
    "type": "normal",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "hypnosis",
    "name": "\u3055\u3044\u307F\u3093\u3058\u3085\u3064",
    "nameEn": "Hypnosis",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 60,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D60"
  },
  {
    "id": "icebeam",
    "name": "\u308C\u3044\u3068\u3046\u30D3\u30FC\u30E0",
    "nameEn": "Ice Beam",
    "type": "ice",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u3053\u304A\u308A",
    "secondary": {
      "chance": 10,
      "status": "frz"
    }
  },
  {
    "id": "iceburn",
    "name": "Ice Burn",
    "nameEn": "Ice Burn",
    "type": "ice",
    "category": "special",
    "power": 140,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90\u30FB30%\u3067\u3084\u3051\u3069",
    "secondary": {
      "chance": 30,
      "status": "brn"
    }
  },
  {
    "id": "icefang",
    "name": "\u3053\u304A\u308A\u306E\u30AD\u30D0",
    "nameEn": "Ice Fang",
    "type": "ice",
    "category": "physical",
    "power": 65,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "icehammer",
    "name": "Ice Hammer",
    "nameEn": "Ice Hammer",
    "type": "ice",
    "category": "physical",
    "power": 100,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "icepunch",
    "name": "Ice Punch",
    "nameEn": "Ice Punch",
    "type": "ice",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u3053\u304A\u308A",
    "secondary": {
      "chance": 10,
      "status": "frz"
    }
  },
  {
    "id": "iceshard",
    "name": "\u3053\u304A\u308A\u306E\u3064\u3076\u3066",
    "nameEn": "Ice Shard",
    "type": "ice",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+1"
  },
  {
    "id": "icespinner",
    "name": "Ice Spinner",
    "nameEn": "Ice Spinner",
    "type": "ice",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "iciclecrash",
    "name": "Icicle Crash",
    "nameEn": "Icicle Crash",
    "type": "ice",
    "category": "physical",
    "power": 85,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "iciclespear",
    "name": "\u3064\u3089\u3089\u3070\u308A",
    "nameEn": "Icicle Spear",
    "type": "ice",
    "category": "physical",
    "power": 25,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "icywind",
    "name": "\u3053\u3054\u3048\u308B\u304B\u305C",
    "nameEn": "Icy Wind",
    "type": "ice",
    "category": "special",
    "power": 55,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95\u30FB100%\u3067\u3059\u3070\u3084\u3055\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "spe": -1
      }
    }
  },
  {
    "id": "imprison",
    "name": "\u3075\u3046\u3044\u3093",
    "nameEn": "Imprison",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "incinerate",
    "name": "\u3084\u304D\u3064\u304F\u3059",
    "nameEn": "Incinerate",
    "type": "fire",
    "category": "special",
    "power": 60,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "infernalparade",
    "name": "Infernal Parade",
    "nameEn": "Infernal Parade",
    "type": "ghost",
    "category": "special",
    "power": 60,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB30%\u3067\u3084\u3051\u3069",
    "secondary": {
      "chance": 30,
      "status": "brn"
    }
  },
  {
    "id": "inferno",
    "name": "\u308C\u3093\u3054\u304F",
    "nameEn": "Inferno",
    "type": "fire",
    "category": "special",
    "power": 100,
    "accuracy": 50,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D50\u30FB100%\u3067\u3084\u3051\u3069",
    "secondary": {
      "chance": 100,
      "status": "brn"
    }
  },
  {
    "id": "infestation",
    "name": "Infestation",
    "nameEn": "Infestation",
    "type": "bug",
    "category": "special",
    "power": 20,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "ingrain",
    "name": "\u306D\u3092\u306F\u308B",
    "nameEn": "Ingrain",
    "type": "grass",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "instruct",
    "name": "Instruct",
    "nameEn": "Instruct",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "irondefense",
    "name": "\u3066\u3063\u307A\u304D",
    "nameEn": "Iron Defense",
    "type": "steel",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u307C\u3046\u304E\u3087\u21912"
  },
  {
    "id": "ironhead",
    "name": "\u30A2\u30A4\u30A2\u30F3\u30D8\u30C3\u30C9",
    "nameEn": "Iron Head",
    "type": "steel",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "irontail",
    "name": "\u30A2\u30A4\u30A2\u30F3\u30C6\u30FC\u30EB",
    "nameEn": "Iron Tail",
    "type": "steel",
    "category": "physical",
    "power": 100,
    "accuracy": 75,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D75\u30FB30%\u3067\u307C\u3046\u304E\u3087\u21931",
    "secondary": {
      "chance": 30,
      "boosts": {
        "def": -1
      }
    }
  },
  {
    "id": "ivycudgel",
    "name": "Ivy Cudgel",
    "nameEn": "Ivy Cudgel",
    "type": "grass",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "jawlock",
    "name": "Jaw Lock",
    "nameEn": "Jaw Lock",
    "type": "dark",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "jetpunch",
    "name": "Jet Punch",
    "nameEn": "Jet Punch",
    "type": "water",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "pp": 15,
    "priority": 1,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+1"
  },
  {
    "id": "judgment",
    "name": "\u3055\u3070\u304D\u306E\u3064\u3076\u3066",
    "nameEn": "Judgment",
    "type": "normal",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "junglehealing",
    "name": "\u30B8\u30E3\u30F3\u30B0\u30EB\u30D2\u30FC\u30EB",
    "nameEn": "Jungle Healing",
    "type": "grass",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "knockoff",
    "name": "\u306F\u305F\u304D\u304A\u3068\u3059",
    "nameEn": "Knock Off",
    "type": "dark",
    "category": "physical",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "kowtowcleave",
    "name": "Kowtow Cleave",
    "nameEn": "Kowtow Cleave",
    "type": "dark",
    "category": "physical",
    "power": 85,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "lashout",
    "name": "Lash Out",
    "nameEn": "Lash Out",
    "type": "dark",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "lastresort",
    "name": "\u3068\u3063\u3066\u304A\u304D",
    "nameEn": "Last Resort",
    "type": "normal",
    "category": "physical",
    "power": 140,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "lastrespects",
    "name": "Last Respects",
    "nameEn": "Last Respects",
    "type": "ghost",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "lavaplume",
    "name": "\u3075\u3093\u3048\u3093",
    "nameEn": "Lava Plume",
    "type": "fire",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB30%\u3067\u3084\u3051\u3069",
    "secondary": {
      "chance": 30,
      "status": "brn"
    }
  },
  {
    "id": "leafage",
    "name": "Leafage",
    "nameEn": "Leafage",
    "type": "grass",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "leafblade",
    "name": "\u30EA\u30FC\u30D5\u30D6\u30EC\u30FC\u30C9",
    "nameEn": "Leaf Blade",
    "type": "grass",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "leafstorm",
    "name": "\u30EA\u30FC\u30D5\u30B9\u30C8\u30FC\u30E0",
    "nameEn": "Leaf Storm",
    "type": "grass",
    "category": "special",
    "power": 130,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "leechlife",
    "name": "\u304D\u3085\u3046\u3051\u3064",
    "nameEn": "Leech Life",
    "type": "bug",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u4E0E\u30C0\u30E1\u306E50%\u56DE\u5FA9",
    "drain": 50
  },
  {
    "id": "leechseed",
    "name": "\u3084\u3069\u308A\u304E\u306E\u30BF\u30CD",
    "nameEn": "Leech Seed",
    "type": "grass",
    "category": "status",
    "power": 0,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "leer",
    "name": "\u306B\u3089\u307F\u3064\u3051\u308B",
    "nameEn": "Leer",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u307C\u3046\u304E\u3087\u21931"
  },
  {
    "id": "lick",
    "name": "\u3057\u305F\u3067\u306A\u3081\u308B",
    "nameEn": "Lick",
    "type": "ghost",
    "category": "physical",
    "power": 30,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB30%\u3067\u307E\u3072",
    "secondary": {
      "chance": 30,
      "status": "par"
    }
  },
  {
    "id": "lifedew",
    "name": "Life Dew",
    "nameEn": "Life Dew",
    "type": "water",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "lightscreen",
    "name": "\u3072\u304B\u308A\u306E\u304B\u3079",
    "nameEn": "Light Screen",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "liquidation",
    "name": "\u30A2\u30AF\u30A2\u30D6\u30EC\u30A4\u30AF",
    "nameEn": "Liquidation",
    "type": "water",
    "category": "physical",
    "power": 85,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB20%\u3067\u307C\u3046\u304E\u3087\u21931",
    "secondary": {
      "chance": 20,
      "boosts": {
        "def": -1
      }
    }
  },
  {
    "id": "lockon",
    "name": "\u30ED\u30C3\u30AF\u30AA\u30F3",
    "nameEn": "Lock-On",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "lowkick",
    "name": "\u3051\u305F\u3050\u308A",
    "nameEn": "Low Kick",
    "type": "fighting",
    "category": "physical",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "lowsweep",
    "name": "\u30ED\u30FC\u30AD\u30C3\u30AF",
    "nameEn": "Low Sweep",
    "type": "fighting",
    "category": "physical",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u3059\u3070\u3084\u3055\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "spe": -1
      }
    }
  },
  {
    "id": "luminacrash",
    "name": "Lumina Crash",
    "nameEn": "Lumina Crash",
    "type": "psychic",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u3068\u304F\u307C\u3046\u21932",
    "secondary": {
      "chance": 100,
      "boosts": {
        "spd": -2
      }
    }
  },
  {
    "id": "lunarblessing",
    "name": "Lunar Blessing",
    "nameEn": "Lunar Blessing",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "lunardance",
    "name": "\u307F\u304B\u3065\u304D\u306E\u307E\u3044",
    "nameEn": "Lunar Dance",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "lunge",
    "name": "Lunge",
    "nameEn": "Lunge",
    "type": "bug",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u3053\u3046\u3052\u304D\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "atk": -1
      }
    }
  },
  {
    "id": "lusterpurge",
    "name": "\u30E9\u30B9\u30BF\u30FC\u30D1\u30FC\u30B8",
    "nameEn": "Luster Purge",
    "type": "psychic",
    "category": "special",
    "power": 95,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB50%\u3067\u3068\u304F\u307C\u3046\u21931",
    "secondary": {
      "chance": 50,
      "boosts": {
        "spd": -1
      }
    }
  },
  {
    "id": "machpunch",
    "name": "\u30DE\u30C3\u30CF\u30D1\u30F3\u30C1",
    "nameEn": "Mach Punch",
    "type": "fighting",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+1"
  },
  {
    "id": "magicalleaf",
    "name": "\u30DE\u30B8\u30AB\u30EB\u30EA\u30FC\u30D5",
    "nameEn": "Magical Leaf",
    "type": "grass",
    "category": "special",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "magicaltorque",
    "name": "Magical Torque",
    "nameEn": "Magical Torque",
    "type": "fairy",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "magicpowder",
    "name": "Magic Powder",
    "nameEn": "Magic Powder",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "magicroom",
    "name": "Magic Room",
    "nameEn": "Magic Room",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "magmastorm",
    "name": "\u30DE\u30B0\u30DE\u30B9\u30C8\u30FC\u30E0",
    "nameEn": "Magma Storm",
    "type": "fire",
    "category": "special",
    "power": 100,
    "accuracy": 75,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D75"
  },
  {
    "id": "magneticflux",
    "name": "Magnetic Flux",
    "nameEn": "Magnetic Flux",
    "type": "electric",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "magnetrise",
    "name": "\u3067\u3093\u3058\u3075\u3086\u3046",
    "nameEn": "Magnet Rise",
    "type": "electric",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "makeitrain",
    "name": "Make It Rain",
    "nameEn": "Make It Rain",
    "type": "steel",
    "category": "special",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "malignantchain",
    "name": "Malignant Chain",
    "nameEn": "Malignant Chain",
    "type": "poison",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB50%\u3067\u3082\u3046\u3069\u304F",
    "secondary": {
      "chance": 50,
      "status": "tox"
    }
  },
  {
    "id": "matchagotcha",
    "name": "Matcha Gotcha",
    "nameEn": "Matcha Gotcha",
    "type": "grass",
    "category": "special",
    "power": 80,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90\u30FB20%\u3067\u3084\u3051\u3069\u30FB\u4E0E\u30C0\u30E1\u306E50%\u56DE\u5FA9",
    "drain": 50,
    "secondary": {
      "chance": 20,
      "status": "brn"
    }
  },
  {
    "id": "meanlook",
    "name": "\u304F\u308D\u3044\u307E\u306A\u3056\u3057",
    "nameEn": "Mean Look",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "megadrain",
    "name": "\u30E1\u30AC\u30C9\u30EC\u30A4\u30F3",
    "nameEn": "Mega Drain",
    "type": "grass",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u4E0E\u30C0\u30E1\u306E50%\u56DE\u5FA9",
    "drain": 50
  },
  {
    "id": "megahorn",
    "name": "\u30E1\u30AC\u30DB\u30FC\u30F3",
    "nameEn": "Megahorn",
    "type": "bug",
    "category": "physical",
    "power": 120,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85"
  },
  {
    "id": "megakick",
    "name": "\u30E1\u30AC\u30C8\u30F3\u30AD\u30C3\u30AF",
    "nameEn": "Mega Kick",
    "type": "normal",
    "category": "physical",
    "power": 120,
    "accuracy": 75,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D75"
  },
  {
    "id": "megapunch",
    "name": "Mega Punch",
    "nameEn": "Mega Punch",
    "type": "normal",
    "category": "physical",
    "power": 80,
    "accuracy": 85,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85"
  },
  {
    "id": "memento",
    "name": "\u304A\u304D\u307F\u3084\u3052",
    "nameEn": "Memento",
    "type": "dark",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21932/\u3068\u304F\u3053\u3046\u21932"
  },
  {
    "id": "metalburst",
    "name": "\u30E1\u30BF\u30EB\u30D0\u30FC\u30B9\u30C8",
    "nameEn": "Metal Burst",
    "type": "steel",
    "category": "physical",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "metalclaw",
    "name": "\u30E1\u30BF\u30EB\u30AF\u30ED\u30FC",
    "nameEn": "Metal Claw",
    "type": "steel",
    "category": "physical",
    "power": 50,
    "accuracy": 95,
    "pp": 35,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "metalsound",
    "name": "\u304D\u3093\u305E\u304F\u304A\u3093",
    "nameEn": "Metal Sound",
    "type": "steel",
    "category": "status",
    "power": 0,
    "accuracy": 85,
    "pp": 40,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85\u30FB\u81EA\u5206\u306E\u3068\u304F\u307C\u3046\u21932"
  },
  {
    "id": "meteorbeam",
    "name": "\u30E1\u30C6\u30AA\u30D3\u30FC\u30E0",
    "nameEn": "Meteor Beam",
    "type": "rock",
    "category": "special",
    "power": 120,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "meteormash",
    "name": "\u30B3\u30E1\u30C3\u30C8\u30D1\u30F3\u30C1",
    "nameEn": "Meteor Mash",
    "type": "steel",
    "category": "physical",
    "power": 90,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "metronome",
    "name": "\u3086\u3073\u3092\u3075\u308B",
    "nameEn": "Metronome",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "mightycleave",
    "name": "Mighty Cleave",
    "nameEn": "Mighty Cleave",
    "type": "rock",
    "category": "physical",
    "power": 95,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "milkdrink",
    "name": "\u30DF\u30EB\u30AF\u306E\u307F",
    "nameEn": "Milk Drink",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "mimic",
    "name": "\u3082\u306E\u307E\u306D",
    "nameEn": "Mimic",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "minimize",
    "name": "\u3061\u3044\u3055\u304F\u306A\u308B",
    "nameEn": "Minimize",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306Eevasion\u21912"
  },
  {
    "id": "mirrorcoat",
    "name": "\u30DF\u30E9\u30FC\u30B3\u30FC\u30C8",
    "nameEn": "Mirror Coat",
    "type": "psychic",
    "category": "special",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": -5,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+-5"
  },
  {
    "id": "mist",
    "name": "\u3057\u308D\u3044\u304D\u308A",
    "nameEn": "Mist",
    "type": "ice",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "mistball",
    "name": "\u30DF\u30B9\u30C8\u30DC\u30FC\u30EB",
    "nameEn": "Mist Ball",
    "type": "psychic",
    "category": "special",
    "power": 95,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB50%\u3067\u3068\u304F\u3053\u3046\u21931",
    "secondary": {
      "chance": 50,
      "boosts": {
        "spa": -1
      }
    }
  },
  {
    "id": "mistyexplosion",
    "name": "\u30DF\u30B9\u30C8\u30D0\u30FC\u30B9\u30C8",
    "nameEn": "Misty Explosion",
    "type": "fairy",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "mistyterrain",
    "name": "Misty Terrain",
    "nameEn": "Misty Terrain",
    "type": "fairy",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "moonblast",
    "name": "\u30E0\u30FC\u30F3\u30D5\u30A9\u30FC\u30B9",
    "nameEn": "Moonblast",
    "type": "fairy",
    "category": "special",
    "power": 95,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB30%\u3067\u3068\u304F\u3053\u3046\u21931",
    "secondary": {
      "chance": 30,
      "boosts": {
        "spa": -1
      }
    }
  },
  {
    "id": "moongeistbeam",
    "name": "\u30B7\u30E3\u30C9\u30FC\u30EC\u30A4",
    "nameEn": "Moongeist Beam",
    "type": "ghost",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "moonlight",
    "name": "\u3064\u304D\u306E\u3072\u304B\u308A",
    "nameEn": "Moonlight",
    "type": "fairy",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "morningsun",
    "name": "\u3042\u3055\u306E\u3072\u3056\u3057",
    "nameEn": "Morning Sun",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "mortalspin",
    "name": "Mortal Spin",
    "nameEn": "Mortal Spin",
    "type": "poison",
    "category": "physical",
    "power": 30,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u3069\u304F",
    "secondary": {
      "chance": 100,
      "status": "psn"
    }
  },
  {
    "id": "mountaingale",
    "name": "Mountain Gale",
    "nameEn": "Mountain Gale",
    "type": "ice",
    "category": "physical",
    "power": 100,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85"
  },
  {
    "id": "muddywater",
    "name": "\u3060\u304F\u308A\u3085\u3046",
    "nameEn": "Muddy Water",
    "type": "water",
    "category": "special",
    "power": 90,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85\u30FB30%\u3067\u547D\u4E2D\u21931",
    "secondary": {
      "chance": 30,
      "boosts": {
        "accuracy": -1
      }
    }
  },
  {
    "id": "mudshot",
    "name": "\u30DE\u30C3\u30C9\u30B7\u30E7\u30C3\u30C8",
    "nameEn": "Mud Shot",
    "type": "ground",
    "category": "special",
    "power": 55,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95\u30FB100%\u3067\u3059\u3070\u3084\u3055\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "spe": -1
      }
    }
  },
  {
    "id": "mudslap",
    "name": "\u3069\u308D\u304B\u3051",
    "nameEn": "Mud-Slap",
    "type": "ground",
    "category": "special",
    "power": 20,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u547D\u4E2D\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "accuracy": -1
      }
    }
  },
  {
    "id": "mysticalfire",
    "name": "Mystical Fire",
    "nameEn": "Mystical Fire",
    "type": "fire",
    "category": "special",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u3068\u304F\u3053\u3046\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "spa": -1
      }
    }
  },
  {
    "id": "mysticalpower",
    "name": "Mystical Power",
    "nameEn": "Mystical Power",
    "type": "psychic",
    "category": "special",
    "power": 70,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "nastyplot",
    "name": "\u308F\u308B\u3060\u304F\u307F",
    "nameEn": "Nasty Plot",
    "type": "dark",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3068\u304F\u3053\u3046\u21912"
  },
  {
    "id": "nightdaze",
    "name": "\u30CA\u30A4\u30C8\u30D0\u30FC\u30B9\u30C8",
    "nameEn": "Night Daze",
    "type": "dark",
    "category": "special",
    "power": 85,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95\u30FB40%\u3067\u547D\u4E2D\u21931",
    "secondary": {
      "chance": 40,
      "boosts": {
        "accuracy": -1
      }
    }
  },
  {
    "id": "nightshade",
    "name": "\u30CA\u30A4\u30C8\u30D8\u30C3\u30C9",
    "nameEn": "Night Shade",
    "type": "ghost",
    "category": "special",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "nightslash",
    "name": "\u3064\u3058\u304E\u308A",
    "nameEn": "Night Slash",
    "type": "dark",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "nihillight",
    "name": "Nihil Light",
    "nameEn": "Nihil Light",
    "type": "dragon",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "nobleroar",
    "name": "Noble Roar",
    "nameEn": "Noble Roar",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21931/\u3068\u304F\u3053\u3046\u21931"
  },
  {
    "id": "noretreat",
    "name": "No Retreat",
    "nameEn": "No Retreat",
    "type": "fighting",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21911/\u307C\u3046\u304E\u3087\u21911/\u3068\u304F\u3053\u3046\u21911/\u3068\u304F\u307C\u3046\u21911/\u3059\u3070\u3084\u3055\u21911"
  },
  {
    "id": "noxioustorque",
    "name": "Noxious Torque",
    "nameEn": "Noxious Torque",
    "type": "poison",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB30%\u3067\u3069\u304F",
    "secondary": {
      "chance": 30,
      "status": "psn"
    }
  },
  {
    "id": "nuzzle",
    "name": "\u307B\u3063\u307A\u3059\u308A\u3059\u308A",
    "nameEn": "Nuzzle",
    "type": "electric",
    "category": "physical",
    "power": 20,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u307E\u3072",
    "secondary": {
      "chance": 100,
      "status": "par"
    }
  },
  {
    "id": "orderup",
    "name": "Order Up",
    "nameEn": "Order Up",
    "type": "dragon",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "originpulse",
    "name": "\u3053\u3093\u3052\u3093\u306E\u306F\u3069\u3046",
    "nameEn": "Origin Pulse",
    "type": "water",
    "category": "special",
    "power": 110,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85"
  },
  {
    "id": "outrage",
    "name": "\u3052\u304D\u308A\u3093",
    "nameEn": "Outrage",
    "type": "dragon",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "overdrive",
    "name": "Overdrive",
    "nameEn": "Overdrive",
    "type": "electric",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "overheat",
    "name": "\u30AA\u30FC\u30D0\u30FC\u30D2\u30FC\u30C8",
    "nameEn": "Overheat",
    "type": "fire",
    "category": "special",
    "power": 130,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "painsplit",
    "name": "\u3044\u305F\u307F\u308F\u3051",
    "nameEn": "Pain Split",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "paraboliccharge",
    "name": "\u30D1\u30E9\u30DC\u30E9\u30C1\u30E3\u30FC\u30B8",
    "nameEn": "Parabolic Charge",
    "type": "electric",
    "category": "special",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u4E0E\u30C0\u30E1\u306E50%\u56DE\u5FA9",
    "drain": 50
  },
  {
    "id": "partingshot",
    "name": "\u3059\u3066\u30BC\u30EA\u30D5",
    "nameEn": "Parting Shot",
    "type": "dark",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "payback",
    "name": "\u3057\u3063\u307A\u304C\u3048\u3057",
    "nameEn": "Payback",
    "type": "dark",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "payday",
    "name": "Pay Day",
    "nameEn": "Pay Day",
    "type": "normal",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "peck",
    "name": "\u3064\u3064\u304F",
    "nameEn": "Peck",
    "type": "flying",
    "category": "physical",
    "power": 35,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "perishsong",
    "name": "\u307B\u308D\u3073\u306E\u3046\u305F",
    "nameEn": "Perish Song",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "petalblizzard",
    "name": "Petal Blizzard",
    "nameEn": "Petal Blizzard",
    "type": "grass",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "petaldance",
    "name": "\u306F\u306A\u3073\u3089\u306E\u307E\u3044",
    "nameEn": "Petal Dance",
    "type": "grass",
    "category": "special",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "phantomforce",
    "name": "\u30B4\u30FC\u30B9\u30C8\u30C0\u30A4\u30D6",
    "nameEn": "Phantom Force",
    "type": "ghost",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "photongeyser",
    "name": "Photon Geyser",
    "nameEn": "Photon Geyser",
    "type": "psychic",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "pikapapow",
    "name": "Pika Papow",
    "nameEn": "Pika Papow",
    "type": "electric",
    "category": "special",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "pinmissile",
    "name": "\u30DF\u30B5\u30A4\u30EB\u3070\u308A",
    "nameEn": "Pin Missile",
    "type": "bug",
    "category": "physical",
    "power": 25,
    "accuracy": 95,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "playnice",
    "name": "Play Nice",
    "nameEn": "Play Nice",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21931"
  },
  {
    "id": "playrough",
    "name": "\u3058\u3083\u308C\u3064\u304F",
    "nameEn": "Play Rough",
    "type": "fairy",
    "category": "physical",
    "power": 90,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90\u30FB10%\u3067\u3053\u3046\u3052\u304D\u21931",
    "secondary": {
      "chance": 10,
      "boosts": {
        "atk": -1
      }
    }
  },
  {
    "id": "pluck",
    "name": "\u3064\u3044\u3070\u3080",
    "nameEn": "Pluck",
    "type": "flying",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "poisonfang",
    "name": "\u3069\u304F\u3069\u304F\u306E\u30AD\u30D0",
    "nameEn": "Poison Fang",
    "type": "poison",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB50%\u3067\u3082\u3046\u3069\u304F",
    "secondary": {
      "chance": 50,
      "status": "tox"
    }
  },
  {
    "id": "poisongas",
    "name": "\u3069\u304F\u30AC\u30B9",
    "nameEn": "Poison Gas",
    "type": "poison",
    "category": "status",
    "power": 0,
    "accuracy": 90,
    "pp": 40,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "poisonjab",
    "name": "\u3069\u304F\u3065\u304D",
    "nameEn": "Poison Jab",
    "type": "poison",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB30%\u3067\u3069\u304F",
    "secondary": {
      "chance": 30,
      "status": "psn"
    }
  },
  {
    "id": "poisonpowder",
    "name": "\u3069\u304F\u306E\u3053\u306A",
    "nameEn": "Poison Powder",
    "type": "poison",
    "category": "status",
    "power": 0,
    "accuracy": 75,
    "pp": 35,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D75"
  },
  {
    "id": "poisonsting",
    "name": "\u3069\u304F\u3070\u308A",
    "nameEn": "Poison Sting",
    "type": "poison",
    "category": "physical",
    "power": 15,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB30%\u3067\u3069\u304F",
    "secondary": {
      "chance": 30,
      "status": "psn"
    }
  },
  {
    "id": "poisontail",
    "name": "\u30DD\u30A4\u30BA\u30F3\u30C6\u30FC\u30EB",
    "nameEn": "Poison Tail",
    "type": "poison",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u3069\u304F",
    "secondary": {
      "chance": 10,
      "status": "psn"
    }
  },
  {
    "id": "pollenpuff",
    "name": "Pollen Puff",
    "nameEn": "Pollen Puff",
    "type": "bug",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "poltergeist",
    "name": "\u30DD\u30EB\u30BF\u30FC\u30AC\u30A4\u30B9\u30C8",
    "nameEn": "Poltergeist",
    "type": "ghost",
    "category": "physical",
    "power": 110,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "populationbomb",
    "name": "Population Bomb",
    "nameEn": "Population Bomb",
    "type": "normal",
    "category": "physical",
    "power": 20,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "pounce",
    "name": "Pounce",
    "nameEn": "Pounce",
    "type": "bug",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u3059\u3070\u3084\u3055\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "spe": -1
      }
    }
  },
  {
    "id": "pound",
    "name": "\u306F\u305F\u304F",
    "nameEn": "Pound",
    "type": "normal",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "powdersnow",
    "name": "\u3053\u306A\u3086\u304D",
    "nameEn": "Powder Snow",
    "type": "ice",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u3053\u304A\u308A",
    "secondary": {
      "chance": 10,
      "status": "frz"
    }
  },
  {
    "id": "powergem",
    "name": "\u30D1\u30EF\u30FC\u30B8\u30A7\u30E0",
    "nameEn": "Power Gem",
    "type": "rock",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "powershift",
    "name": "Power Shift",
    "nameEn": "Power Shift",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "powersplit",
    "name": "Power Split",
    "nameEn": "Power Split",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "powerswap",
    "name": "\u30D1\u30EF\u30FC\u30B9\u30EF\u30C3\u30D7",
    "nameEn": "Power Swap",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "powertrick",
    "name": "\u30D1\u30EF\u30FC\u30C8\u30EA\u30C3\u30AF",
    "nameEn": "Power Trick",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "powertrip",
    "name": "Power Trip",
    "nameEn": "Power Trip",
    "type": "dark",
    "category": "physical",
    "power": 20,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "powerwhip",
    "name": "\u30D1\u30EF\u30FC\u30A6\u30A3\u30C3\u30D7",
    "nameEn": "Power Whip",
    "type": "grass",
    "category": "physical",
    "power": 120,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85"
  },
  {
    "id": "precipiceblades",
    "name": "\u3060\u3093\u304C\u3044\u306E\u3064\u308B\u304E",
    "nameEn": "Precipice Blades",
    "type": "ground",
    "category": "physical",
    "power": 120,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85"
  },
  {
    "id": "present",
    "name": "\u30D7\u30EC\u30BC\u30F3\u30C8",
    "nameEn": "Present",
    "type": "normal",
    "category": "physical",
    "power": 0,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "prismaticlaser",
    "name": "Prismatic Laser",
    "nameEn": "Prismatic Laser",
    "type": "psychic",
    "category": "special",
    "power": 160,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "protect",
    "name": "\u307E\u3082\u308B",
    "nameEn": "Protect",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 4,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+4"
  },
  {
    "id": "psybeam",
    "name": "\u30B5\u30A4\u30B1\u3053\u3046\u305B\u3093",
    "nameEn": "Psybeam",
    "type": "psychic",
    "category": "special",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "psyblade",
    "name": "Psyblade",
    "nameEn": "Psyblade",
    "type": "psychic",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "psychic",
    "name": "\u30B5\u30A4\u30B3\u30AD\u30CD\u30B7\u30B9",
    "nameEn": "Psychic",
    "type": "psychic",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u3068\u304F\u307C\u3046\u21931",
    "secondary": {
      "chance": 10,
      "boosts": {
        "spd": -1
      }
    }
  },
  {
    "id": "psychicfangs",
    "name": "Psychic Fangs",
    "nameEn": "Psychic Fangs",
    "type": "psychic",
    "category": "physical",
    "power": 85,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "psychicnoise",
    "name": "Psychic Noise",
    "nameEn": "Psychic Noise",
    "type": "psychic",
    "category": "special",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "psychicterrain",
    "name": "Psychic Terrain",
    "nameEn": "Psychic Terrain",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "psychoboost",
    "name": "\u30B5\u30A4\u30B3\u30D6\u30FC\u30B9\u30C8",
    "nameEn": "Psycho Boost",
    "type": "psychic",
    "category": "special",
    "power": 140,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "psychocut",
    "name": "\u30B5\u30A4\u30B3\u30AB\u30C3\u30BF\u30FC",
    "nameEn": "Psycho Cut",
    "type": "psychic",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "psychup",
    "name": "\u3058\u3053\u3042\u3093\u3058",
    "nameEn": "Psych Up",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "psyshieldbash",
    "name": "Psyshield Bash",
    "nameEn": "Psyshield Bash",
    "type": "psychic",
    "category": "physical",
    "power": 70,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "psyshock",
    "name": "Psyshock",
    "nameEn": "Psyshock",
    "type": "psychic",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "psystrike",
    "name": "\u30B5\u30A4\u30B3\u30D6\u30EC\u30A4\u30AF",
    "nameEn": "Psystrike",
    "type": "psychic",
    "category": "special",
    "power": 100,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "pyroball",
    "name": "Pyro Ball",
    "nameEn": "Pyro Ball",
    "type": "fire",
    "category": "physical",
    "power": 120,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90\u30FB10%\u3067\u3084\u3051\u3069",
    "secondary": {
      "chance": 10,
      "status": "brn"
    }
  },
  {
    "id": "quash",
    "name": "Quash",
    "nameEn": "Quash",
    "type": "dark",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "quickattack",
    "name": "\u3067\u3093\u3053\u3046\u305B\u3063\u304B",
    "nameEn": "Quick Attack",
    "type": "normal",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+1"
  },
  {
    "id": "quickguard",
    "name": "Quick Guard",
    "nameEn": "Quick Guard",
    "type": "fighting",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 3,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+3"
  },
  {
    "id": "quiverdance",
    "name": "\u3061\u3087\u3046\u306E\u307E\u3044",
    "nameEn": "Quiver Dance",
    "type": "bug",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3068\u304F\u3053\u3046\u21911/\u3068\u304F\u307C\u3046\u21911/\u3059\u3070\u3084\u3055\u21911"
  },
  {
    "id": "ragefist",
    "name": "Rage Fist",
    "nameEn": "Rage Fist",
    "type": "ghost",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "ragepowder",
    "name": "\u3044\u304B\u308A\u306E\u3053\u306A",
    "nameEn": "Rage Powder",
    "type": "bug",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 2,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+2"
  },
  {
    "id": "ragingbull",
    "name": "Raging Bull",
    "nameEn": "Raging Bull",
    "type": "normal",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "ragingfury",
    "name": "Raging Fury",
    "nameEn": "Raging Fury",
    "type": "fire",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "raindance",
    "name": "\u3042\u307E\u3054\u3044",
    "nameEn": "Rain Dance",
    "type": "water",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "rapidspin",
    "name": "\u3053\u3046\u305D\u304F\u30B9\u30D4\u30F3",
    "nameEn": "Rapid Spin",
    "type": "normal",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "razorleaf",
    "name": "\u306F\u3063\u3071\u30AB\u30C3\u30BF\u30FC",
    "nameEn": "Razor Leaf",
    "type": "grass",
    "category": "physical",
    "power": 55,
    "accuracy": 95,
    "pp": 25,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "razorshell",
    "name": "Razor Shell",
    "nameEn": "Razor Shell",
    "type": "water",
    "category": "physical",
    "power": 75,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95\u30FB50%\u3067\u307C\u3046\u304E\u3087\u21931",
    "secondary": {
      "chance": 50,
      "boosts": {
        "def": -1
      }
    }
  },
  {
    "id": "recover",
    "name": "\u3058\u3053\u3055\u3044\u305B\u3044",
    "nameEn": "Recover",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "recycle",
    "name": "\u30EA\u30B5\u30A4\u30AF\u30EB",
    "nameEn": "Recycle",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "reflect",
    "name": "\u30EA\u30D5\u30EC\u30AF\u30BF\u30FC",
    "nameEn": "Reflect",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "reflecttype",
    "name": "Reflect Type",
    "nameEn": "Reflect Type",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "relicsong",
    "name": "\u3044\u306B\u3057\u3048\u306E\u3046\u305F",
    "nameEn": "Relic Song",
    "type": "normal",
    "category": "special",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u306D\u3080\u308A",
    "secondary": {
      "chance": 10,
      "status": "slp"
    }
  },
  {
    "id": "rest",
    "name": "\u306D\u3080\u308B",
    "nameEn": "Rest",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "retaliate",
    "name": "Retaliate",
    "nameEn": "Retaliate",
    "type": "normal",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "revelationdance",
    "name": "Revelation Dance",
    "nameEn": "Revelation Dance",
    "type": "normal",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "reversal",
    "name": "\u304D\u3057\u304B\u3044\u305B\u3044",
    "nameEn": "Reversal",
    "type": "fighting",
    "category": "physical",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "revivalblessing",
    "name": "Revival Blessing",
    "nameEn": "Revival Blessing",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "risingvoltage",
    "name": "\u30E9\u30A4\u30B8\u30F3\u30B0\u30DC\u30EB\u30C8",
    "nameEn": "Rising Voltage",
    "type": "electric",
    "category": "special",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "roar",
    "name": "\u307B\u3048\u308B",
    "nameEn": "Roar",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": -6,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+-6"
  },
  {
    "id": "roaroftime",
    "name": "\u3068\u304D\u306E\u307B\u3046\u3053\u3046",
    "nameEn": "Roar of Time",
    "type": "dragon",
    "category": "special",
    "power": 150,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "rockblast",
    "name": "\u30ED\u30C3\u30AF\u30D6\u30E9\u30B9\u30C8",
    "nameEn": "Rock Blast",
    "type": "rock",
    "category": "physical",
    "power": 25,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "rockpolish",
    "name": "\u30ED\u30C3\u30AF\u30AB\u30C3\u30C8",
    "nameEn": "Rock Polish",
    "type": "rock",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3059\u3070\u3084\u3055\u21912"
  },
  {
    "id": "rockslide",
    "name": "\u3044\u308F\u306A\u3060\u308C",
    "nameEn": "Rock Slide",
    "type": "rock",
    "category": "physical",
    "power": 75,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "rocksmash",
    "name": "\u3044\u308F\u304F\u3060\u304D",
    "nameEn": "Rock Smash",
    "type": "fighting",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB50%\u3067\u307C\u3046\u304E\u3087\u21931",
    "secondary": {
      "chance": 50,
      "boosts": {
        "def": -1
      }
    }
  },
  {
    "id": "rockthrow",
    "name": "\u3044\u308F\u304A\u3068\u3057",
    "nameEn": "Rock Throw",
    "type": "rock",
    "category": "physical",
    "power": 50,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "rocktomb",
    "name": "\u304C\u3093\u305B\u304D\u3075\u3046\u3058",
    "nameEn": "Rock Tomb",
    "type": "rock",
    "category": "physical",
    "power": 60,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95\u30FB100%\u3067\u3059\u3070\u3084\u3055\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "spe": -1
      }
    }
  },
  {
    "id": "rockwrecker",
    "name": "\u304C\u3093\u305B\u304D\u307B\u3046",
    "nameEn": "Rock Wrecker",
    "type": "rock",
    "category": "physical",
    "power": 150,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "roleplay",
    "name": "\u306A\u308A\u304D\u308A",
    "nameEn": "Role Play",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "rollout",
    "name": "\u3053\u308D\u304C\u308B",
    "nameEn": "Rollout",
    "type": "rock",
    "category": "physical",
    "power": 30,
    "accuracy": 90,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "roost",
    "name": "\u306F\u306D\u3084\u3059\u3081",
    "nameEn": "Roost",
    "type": "flying",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "round",
    "name": "\u308A\u3093\u3057\u3087\u3046",
    "nameEn": "Round",
    "type": "normal",
    "category": "special",
    "power": 60,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "ruination",
    "name": "Ruination",
    "nameEn": "Ruination",
    "type": "dark",
    "category": "special",
    "power": 0,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "sacredfire",
    "name": "\u305B\u3044\u306A\u308B\u307B\u306E\u304A",
    "nameEn": "Sacred Fire",
    "type": "fire",
    "category": "physical",
    "power": 100,
    "accuracy": 95,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95\u30FB50%\u3067\u3084\u3051\u3069",
    "secondary": {
      "chance": 50,
      "status": "brn"
    }
  },
  {
    "id": "sacredsword",
    "name": "\u305B\u3044\u306A\u308B\u3064\u308B\u304E",
    "nameEn": "Sacred Sword",
    "type": "fighting",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "safeguard",
    "name": "\u3057\u3093\u3074\u306E\u307E\u3082\u308A",
    "nameEn": "Safeguard",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "saltcure",
    "name": "Salt Cure",
    "nameEn": "Salt Cure",
    "type": "rock",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "sandattack",
    "name": "\u3059\u306A\u304B\u3051",
    "nameEn": "Sand Attack",
    "type": "ground",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306Eaccuracy\u21931"
  },
  {
    "id": "sandsearstorm",
    "name": "Sandsear Storm",
    "nameEn": "Sandsear Storm",
    "type": "ground",
    "category": "special",
    "power": 100,
    "accuracy": 80,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D80\u30FB20%\u3067\u3084\u3051\u3069",
    "secondary": {
      "chance": 20,
      "status": "brn"
    }
  },
  {
    "id": "sandstorm",
    "name": "\u3059\u306A\u3042\u3089\u3057",
    "nameEn": "Sandstorm",
    "type": "rock",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "sandtomb",
    "name": "\u3059\u306A\u3058\u3054\u304F",
    "nameEn": "Sand Tomb",
    "type": "ground",
    "category": "physical",
    "power": 35,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85"
  },
  {
    "id": "sappyseed",
    "name": "Sappy Seed",
    "nameEn": "Sappy Seed",
    "type": "grass",
    "category": "physical",
    "power": 100,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "scald",
    "name": "\u306D\u3063\u3068\u3046",
    "nameEn": "Scald",
    "type": "water",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB30%\u3067\u3084\u3051\u3069",
    "secondary": {
      "chance": 30,
      "status": "brn"
    }
  },
  {
    "id": "scaleshot",
    "name": "Scale Shot",
    "nameEn": "Scale Shot",
    "type": "dragon",
    "category": "physical",
    "power": 25,
    "accuracy": 90,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "scaryface",
    "name": "\u3053\u308F\u3044\u304B\u304A",
    "nameEn": "Scary Face",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3059\u3070\u3084\u3055\u21932"
  },
  {
    "id": "scorchingsands",
    "name": "\u306D\u3063\u3055\u306E\u3060\u3044\u3061",
    "nameEn": "Scorching Sands",
    "type": "ground",
    "category": "special",
    "power": 70,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB30%\u3067\u3084\u3051\u3069",
    "secondary": {
      "chance": 30,
      "status": "brn"
    }
  },
  {
    "id": "scratch",
    "name": "\u3072\u3063\u304B\u304F",
    "nameEn": "Scratch",
    "type": "normal",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "screech",
    "name": "\u3044\u3084\u306A\u304A\u3068",
    "nameEn": "Screech",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 85,
    "pp": 40,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85\u30FB\u81EA\u5206\u306E\u307C\u3046\u304E\u3087\u21932"
  },
  {
    "id": "secretsword",
    "name": "\u3057\u3093\u3074\u306E\u3064\u308B\u304E",
    "nameEn": "Secret Sword",
    "type": "fighting",
    "category": "special",
    "power": 85,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "seedbomb",
    "name": "\u30BF\u30CD\u3070\u304F\u3060\u3093",
    "nameEn": "Seed Bomb",
    "type": "grass",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "seedflare",
    "name": "\u30B7\u30FC\u30C9\u30D5\u30EC\u30A2",
    "nameEn": "Seed Flare",
    "type": "grass",
    "category": "special",
    "power": 120,
    "accuracy": 85,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85\u30FB40%\u3067\u3068\u304F\u307C\u3046\u21932",
    "secondary": {
      "chance": 40,
      "boosts": {
        "spd": -2
      }
    }
  },
  {
    "id": "seismictoss",
    "name": "Seismic Toss",
    "nameEn": "Seismic Toss",
    "type": "fighting",
    "category": "physical",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "selfdestruct",
    "name": "\u3058\u3070\u304F",
    "nameEn": "Self-Destruct",
    "type": "normal",
    "category": "physical",
    "power": 200,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "shadowball",
    "name": "\u30B7\u30E3\u30C9\u30FC\u30DC\u30FC\u30EB",
    "nameEn": "Shadow Ball",
    "type": "ghost",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB20%\u3067\u3068\u304F\u307C\u3046\u21931",
    "secondary": {
      "chance": 20,
      "boosts": {
        "spd": -1
      }
    }
  },
  {
    "id": "shadowclaw",
    "name": "\u30B7\u30E3\u30C9\u30FC\u30AF\u30ED\u30FC",
    "nameEn": "Shadow Claw",
    "type": "ghost",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "shadowforce",
    "name": "\u30B7\u30E3\u30C9\u30FC\u30C0\u30A4\u30D6",
    "nameEn": "Shadow Force",
    "type": "ghost",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "shadowpunch",
    "name": "\u30B7\u30E3\u30C9\u30FC\u30D1\u30F3\u30C1",
    "nameEn": "Shadow Punch",
    "type": "ghost",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "shadowsneak",
    "name": "\u304B\u3052\u3046\u3061",
    "nameEn": "Shadow Sneak",
    "type": "ghost",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+1"
  },
  {
    "id": "shedtail",
    "name": "Shed Tail",
    "nameEn": "Shed Tail",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "sheercold",
    "name": "\u305C\u3063\u305F\u3044\u308C\u3044\u3069",
    "nameEn": "Sheer Cold",
    "type": "ice",
    "category": "special",
    "power": 0,
    "accuracy": 30,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D30"
  },
  {
    "id": "shellsidearm",
    "name": "\u30B7\u30A7\u30EB\u30A2\u30FC\u30E0\u30BA",
    "nameEn": "Shell Side Arm",
    "type": "poison",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB20%\u3067\u3069\u304F",
    "secondary": {
      "chance": 20,
      "status": "psn"
    }
  },
  {
    "id": "shellsmash",
    "name": "\u304B\u3089\u3092\u3084\u3076\u308B",
    "nameEn": "Shell Smash",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u307C\u3046\u304E\u3087\u21931/\u3068\u304F\u307C\u3046\u21931/\u3053\u3046\u3052\u304D\u21912/\u3068\u304F\u3053\u3046\u21912/\u3059\u3070\u3084\u3055\u21912"
  },
  {
    "id": "shelter",
    "name": "Shelter",
    "nameEn": "Shelter",
    "type": "steel",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u307C\u3046\u304E\u3087\u21912"
  },
  {
    "id": "shiftgear",
    "name": "\u30AE\u30A2\u30C1\u30A7\u30F3\u30B8",
    "nameEn": "Shift Gear",
    "type": "steel",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3059\u3070\u3084\u3055\u21912/\u3053\u3046\u3052\u304D\u21911"
  },
  {
    "id": "shockwave",
    "name": "\u3067\u3093\u3052\u304D\u306F",
    "nameEn": "Shock Wave",
    "type": "electric",
    "category": "special",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "shoreup",
    "name": "Shore Up",
    "nameEn": "Shore Up",
    "type": "ground",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "silktrap",
    "name": "Silk Trap",
    "nameEn": "Silk Trap",
    "type": "bug",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 4,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+4"
  },
  {
    "id": "simplebeam",
    "name": "Simple Beam",
    "nameEn": "Simple Beam",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "sing",
    "name": "\u3046\u305F\u3046",
    "nameEn": "Sing",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 55,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D55"
  },
  {
    "id": "sizzlyslide",
    "name": "Sizzly Slide",
    "nameEn": "Sizzly Slide",
    "type": "fire",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u3084\u3051\u3069",
    "secondary": {
      "chance": 100,
      "status": "brn"
    }
  },
  {
    "id": "sketch",
    "name": "\u30B9\u30B1\u30C3\u30C1",
    "nameEn": "Sketch",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "skillswap",
    "name": "\u30B9\u30AD\u30EB\u30B9\u30EF\u30C3\u30D7",
    "nameEn": "Skill Swap",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "skittersmack",
    "name": "Skitter Smack",
    "nameEn": "Skitter Smack",
    "type": "bug",
    "category": "physical",
    "power": 70,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90\u30FB100%\u3067\u3068\u304F\u3053\u3046\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "spa": -1
      }
    }
  },
  {
    "id": "skyattack",
    "name": "\u30B4\u30C3\u30C9\u30D0\u30FC\u30C9",
    "nameEn": "Sky Attack",
    "type": "flying",
    "category": "physical",
    "power": 140,
    "accuracy": 90,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "slackoff",
    "name": "\u306A\u307E\u3051\u308B",
    "nameEn": "Slack Off",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "slam",
    "name": "\u305F\u305F\u304D\u3064\u3051\u308B",
    "nameEn": "Slam",
    "type": "normal",
    "category": "physical",
    "power": 80,
    "accuracy": 75,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D75"
  },
  {
    "id": "slash",
    "name": "\u304D\u308A\u3055\u304F",
    "nameEn": "Slash",
    "type": "normal",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "sleeppowder",
    "name": "\u306D\u3080\u308A\u3054\u306A",
    "nameEn": "Sleep Powder",
    "type": "grass",
    "category": "status",
    "power": 0,
    "accuracy": 75,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D75"
  },
  {
    "id": "sleeptalk",
    "name": "\u306D\u3054\u3068",
    "nameEn": "Sleep Talk",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "sludge",
    "name": "\u30D8\u30C9\u30ED\u3053\u3046\u3052\u304D",
    "nameEn": "Sludge",
    "type": "poison",
    "category": "special",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB30%\u3067\u3069\u304F",
    "secondary": {
      "chance": 30,
      "status": "psn"
    }
  },
  {
    "id": "sludgebomb",
    "name": "\u30D8\u30C9\u30ED\u3070\u304F\u3060\u3093",
    "nameEn": "Sludge Bomb",
    "type": "poison",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB30%\u3067\u3069\u304F",
    "secondary": {
      "chance": 30,
      "status": "psn"
    }
  },
  {
    "id": "sludgewave",
    "name": "\u30D8\u30C9\u30ED\u30A6\u30A7\u30FC\u30D6",
    "nameEn": "Sludge Wave",
    "type": "poison",
    "category": "special",
    "power": 95,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u3069\u304F",
    "secondary": {
      "chance": 10,
      "status": "psn"
    }
  },
  {
    "id": "smackdown",
    "name": "\u3046\u3061\u304A\u3068\u3059",
    "nameEn": "Smack Down",
    "type": "rock",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "smartstrike",
    "name": "Smart Strike",
    "nameEn": "Smart Strike",
    "type": "steel",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "smog",
    "name": "\u30B9\u30E2\u30C3\u30B0",
    "nameEn": "Smog",
    "type": "poison",
    "category": "special",
    "power": 30,
    "accuracy": 70,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D70\u30FB40%\u3067\u3069\u304F",
    "secondary": {
      "chance": 40,
      "status": "psn"
    }
  },
  {
    "id": "smokescreen",
    "name": "\u3048\u3093\u307E\u304F",
    "nameEn": "Smokescreen",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306Eaccuracy\u21931"
  },
  {
    "id": "snarl",
    "name": "Snarl",
    "nameEn": "Snarl",
    "type": "dark",
    "category": "special",
    "power": 55,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95\u30FB100%\u3067\u3068\u304F\u3053\u3046\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "spa": -1
      }
    }
  },
  {
    "id": "snipeshot",
    "name": "Snipe Shot",
    "nameEn": "Snipe Shot",
    "type": "water",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "snore",
    "name": "\u3044\u3073\u304D",
    "nameEn": "Snore",
    "type": "normal",
    "category": "special",
    "power": 50,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "snowscape",
    "name": "Snowscape",
    "nameEn": "Snowscape",
    "type": "ice",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "soak",
    "name": "\u307F\u305A\u3073\u305F\u3057",
    "nameEn": "Soak",
    "type": "water",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "softboiled",
    "name": "\u30BF\u30DE\u30B4\u3046\u307F",
    "nameEn": "Soft-Boiled",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "solarbeam",
    "name": "\u30BD\u30FC\u30E9\u30FC\u30D3\u30FC\u30E0",
    "nameEn": "Solar Beam",
    "type": "grass",
    "category": "special",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "solarblade",
    "name": "Solar Blade",
    "nameEn": "Solar Blade",
    "type": "grass",
    "category": "physical",
    "power": 125,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "spacialrend",
    "name": "\u3042\u304F\u3046\u305B\u3064\u3060\u3093",
    "nameEn": "Spacial Rend",
    "type": "dragon",
    "category": "special",
    "power": 100,
    "accuracy": 95,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "spark",
    "name": "\u30B9\u30D1\u30FC\u30AF",
    "nameEn": "Spark",
    "type": "electric",
    "category": "physical",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB30%\u3067\u307E\u3072",
    "secondary": {
      "chance": 30,
      "status": "par"
    }
  },
  {
    "id": "sparklingaria",
    "name": "\u3046\u305F\u304B\u305F\u306E\u30A2\u30EA\u30A2",
    "nameEn": "Sparkling Aria",
    "type": "water",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "sparklyswirl",
    "name": "Sparkly Swirl",
    "nameEn": "Sparkly Swirl",
    "type": "fairy",
    "category": "special",
    "power": 120,
    "accuracy": 85,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85"
  },
  {
    "id": "speedswap",
    "name": "Speed Swap",
    "nameEn": "Speed Swap",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "spicyextract",
    "name": "Spicy Extract",
    "nameEn": "Spicy Extract",
    "type": "grass",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21912/\u307C\u3046\u304E\u3087\u21932"
  },
  {
    "id": "spikes",
    "name": "\u307E\u304D\u3073\u3057",
    "nameEn": "Spikes",
    "type": "ground",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "spikyshield",
    "name": "Spiky Shield",
    "nameEn": "Spiky Shield",
    "type": "grass",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 4,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+4"
  },
  {
    "id": "spinout",
    "name": "Spin Out",
    "nameEn": "Spin Out",
    "type": "steel",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "spiritbreak",
    "name": "Spirit Break",
    "nameEn": "Spirit Break",
    "type": "fairy",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u3068\u304F\u3053\u3046\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "spa": -1
      }
    }
  },
  {
    "id": "spiritshackle",
    "name": "\u304B\u3052\u306C\u3044",
    "nameEn": "Spirit Shackle",
    "type": "ghost",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "spite",
    "name": "\u3046\u3089\u307F",
    "nameEn": "Spite",
    "type": "ghost",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "spitup",
    "name": "\u306F\u304D\u3060\u3059",
    "nameEn": "Spit Up",
    "type": "normal",
    "category": "special",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "splash",
    "name": "\u306F\u306D\u308B",
    "nameEn": "Splash",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "splishysplash",
    "name": "Splishy Splash",
    "nameEn": "Splishy Splash",
    "type": "water",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB30%\u3067\u307E\u3072",
    "secondary": {
      "chance": 30,
      "status": "par"
    }
  },
  {
    "id": "spore",
    "name": "\u30AD\u30CE\u30B3\u306E\u307B\u3046\u3057",
    "nameEn": "Spore",
    "type": "grass",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "springtidestorm",
    "name": "Springtide Storm",
    "nameEn": "Springtide Storm",
    "type": "fairy",
    "category": "special",
    "power": 100,
    "accuracy": 80,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D80\u30FB30%\u3067\u3053\u3046\u3052\u304D\u21931",
    "secondary": {
      "chance": 30,
      "boosts": {
        "atk": -1
      }
    }
  },
  {
    "id": "stealthrock",
    "name": "\u30B9\u30C6\u30EB\u30B9\u30ED\u30C3\u30AF",
    "nameEn": "Stealth Rock",
    "type": "rock",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "steameruption",
    "name": "\u30B9\u30C1\u30FC\u30E0\u30D0\u30FC\u30B9\u30C8",
    "nameEn": "Steam Eruption",
    "type": "water",
    "category": "special",
    "power": 110,
    "accuracy": 95,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95\u30FB30%\u3067\u3084\u3051\u3069",
    "secondary": {
      "chance": 30,
      "status": "brn"
    }
  },
  {
    "id": "steelbeam",
    "name": "Steel Beam",
    "nameEn": "Steel Beam",
    "type": "steel",
    "category": "special",
    "power": 140,
    "accuracy": 95,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "steelroller",
    "name": "\u30A2\u30A4\u30A2\u30F3\u30ED\u30FC\u30E9\u30FC",
    "nameEn": "Steel Roller",
    "type": "steel",
    "category": "physical",
    "power": 130,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "steelwing",
    "name": "\u306F\u304C\u306D\u306E\u3064\u3070",
    "nameEn": "Steel Wing",
    "type": "steel",
    "category": "physical",
    "power": 70,
    "accuracy": 90,
    "pp": 25,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "stickyweb",
    "name": "\u306D\u3070\u306D\u3070\u30CD\u30C3\u30C8",
    "nameEn": "Sticky Web",
    "type": "bug",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "stockpile",
    "name": "\u305F\u304F\u308F\u3048\u308B",
    "nameEn": "Stockpile",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "stomp",
    "name": "\u3075\u307F\u3064\u3051",
    "nameEn": "Stomp",
    "type": "normal",
    "category": "physical",
    "power": 65,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "stompingtantrum",
    "name": "Stomping Tantrum",
    "nameEn": "Stomping Tantrum",
    "type": "ground",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "stoneaxe",
    "name": "Stone Axe",
    "nameEn": "Stone Axe",
    "type": "rock",
    "category": "physical",
    "power": 65,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "stoneedge",
    "name": "\u30B9\u30C8\u30FC\u30F3\u30A8\u30C3\u30B8",
    "nameEn": "Stone Edge",
    "type": "rock",
    "category": "physical",
    "power": 100,
    "accuracy": 80,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D80"
  },
  {
    "id": "storedpower",
    "name": "Stored Power",
    "nameEn": "Stored Power",
    "type": "psychic",
    "category": "special",
    "power": 20,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "strangesteam",
    "name": "Strange Steam",
    "nameEn": "Strange Steam",
    "type": "fairy",
    "category": "special",
    "power": 90,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "strength",
    "name": "\u304B\u3044\u308A\u304D",
    "nameEn": "Strength",
    "type": "normal",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "strengthsap",
    "name": "Strength Sap",
    "nameEn": "Strength Sap",
    "type": "grass",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "stringshot",
    "name": "\u3044\u3068\u3092\u306F\u304F",
    "nameEn": "String Shot",
    "type": "bug",
    "category": "status",
    "power": 0,
    "accuracy": 95,
    "pp": 40,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95\u30FB\u81EA\u5206\u306E\u3059\u3070\u3084\u3055\u21932"
  },
  {
    "id": "struggle",
    "name": "\u308F\u308B\u3042\u304C\u304D",
    "nameEn": "Struggle",
    "type": "normal",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "pp": 1,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "strugglebug",
    "name": "\u3080\u3057\u306E\u3066\u3044\u3053\u3046",
    "nameEn": "Struggle Bug",
    "type": "bug",
    "category": "special",
    "power": 50,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u3068\u304F\u3053\u3046\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "spa": -1
      }
    }
  },
  {
    "id": "stuffcheeks",
    "name": "Stuff Cheeks",
    "nameEn": "Stuff Cheeks",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "stunspore",
    "name": "\u3057\u3073\u308C\u3054\u306A",
    "nameEn": "Stun Spore",
    "type": "grass",
    "category": "status",
    "power": 0,
    "accuracy": 75,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D75"
  },
  {
    "id": "substitute",
    "name": "\u307F\u304C\u308F\u308A",
    "nameEn": "Substitute",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "suckerpunch",
    "name": "\u3075\u3044\u3046\u3061",
    "nameEn": "Sucker Punch",
    "type": "dark",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "pp": 5,
    "priority": 1,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+1"
  },
  {
    "id": "sunnyday",
    "name": "\u306B\u307B\u3093\u3070\u308C",
    "nameEn": "Sunny Day",
    "type": "fire",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "sunsteelstrike",
    "name": "\u30E1\u30C6\u30AA\u30C9\u30E9\u30A4\u30D6",
    "nameEn": "Sunsteel Strike",
    "type": "steel",
    "category": "physical",
    "power": 100,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "supercellslam",
    "name": "Supercell Slam",
    "nameEn": "Supercell Slam",
    "type": "electric",
    "category": "physical",
    "power": 100,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "superfang",
    "name": "\u3044\u304B\u308A\u306E\u307E\u3048\u3070",
    "nameEn": "Super Fang",
    "type": "normal",
    "category": "physical",
    "power": 0,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "superpower",
    "name": "\u3070\u304B\u3062\u304B\u3089",
    "nameEn": "Superpower",
    "type": "fighting",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "supersonic",
    "name": "\u3061\u3087\u3046\u304A\u3093\u3071",
    "nameEn": "Supersonic",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 55,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D55"
  },
  {
    "id": "surf",
    "name": "\u306A\u307F\u306E\u308A",
    "nameEn": "Surf",
    "type": "water",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "surgingstrikes",
    "name": "\u3059\u3044\u308A\u3085\u3046\u308C\u3093\u3060",
    "nameEn": "Surging Strikes",
    "type": "water",
    "category": "physical",
    "power": 25,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "swagger",
    "name": "\u3044\u3070\u308B",
    "nameEn": "Swagger",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21912"
  },
  {
    "id": "swallow",
    "name": "\u306E\u307F\u3053\u3080",
    "nameEn": "Swallow",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "sweetkiss",
    "name": "\u3066\u3093\u3057\u306E\u30AD\u30C3\u30B9",
    "nameEn": "Sweet Kiss",
    "type": "fairy",
    "category": "status",
    "power": 0,
    "accuracy": 75,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D75"
  },
  {
    "id": "sweetscent",
    "name": "\u3042\u307E\u3044\u304B\u304A\u308A",
    "nameEn": "Sweet Scent",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306Eevasion\u21932"
  },
  {
    "id": "swift",
    "name": "\u30B9\u30D4\u30FC\u30C9\u30B9\u30BF\u30FC",
    "nameEn": "Swift",
    "type": "normal",
    "category": "special",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "switcheroo",
    "name": "\u3059\u308A\u304B\u3048",
    "nameEn": "Switcheroo",
    "type": "dark",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "swordsdance",
    "name": "Swords Dance",
    "nameEn": "Swords Dance",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21912"
  },
  {
    "id": "synthesis",
    "name": "\u3053\u3046\u3054\u3046\u305B\u3044",
    "nameEn": "Synthesis",
    "type": "grass",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "syrupbomb",
    "name": "Syrup Bomb",
    "nameEn": "Syrup Bomb",
    "type": "grass",
    "category": "special",
    "power": 60,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85"
  },
  {
    "id": "tachyoncutter",
    "name": "Tachyon Cutter",
    "nameEn": "Tachyon Cutter",
    "type": "steel",
    "category": "special",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "tackle",
    "name": "\u305F\u3044\u3042\u305F\u308A",
    "nameEn": "Tackle",
    "type": "normal",
    "category": "physical",
    "power": 40,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "tailglow",
    "name": "\u307B\u305F\u308B\u3073",
    "nameEn": "Tail Glow",
    "type": "bug",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3068\u304F\u3053\u3046\u21913"
  },
  {
    "id": "tailslap",
    "name": "Tail Slap",
    "nameEn": "Tail Slap",
    "type": "normal",
    "category": "physical",
    "power": 25,
    "accuracy": 85,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85"
  },
  {
    "id": "tailwhip",
    "name": "\u3057\u3063\u307D\u3092\u3075\u308B",
    "nameEn": "Tail Whip",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u307C\u3046\u304E\u3087\u21931"
  },
  {
    "id": "tailwind",
    "name": "\u304A\u3044\u304B\u305C",
    "nameEn": "Tailwind",
    "type": "flying",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "takedown",
    "name": "\u3068\u3063\u3057\u3093",
    "nameEn": "Take Down",
    "type": "normal",
    "category": "physical",
    "power": 90,
    "accuracy": 85,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85\u30FB25%\u53CD\u52D5",
    "recoil": 25
  },
  {
    "id": "takeheart",
    "name": "Take Heart",
    "nameEn": "Take Heart",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "tarshot",
    "name": "Tar Shot",
    "nameEn": "Tar Shot",
    "type": "rock",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3059\u3070\u3084\u3055\u21931"
  },
  {
    "id": "taunt",
    "name": "\u3061\u3087\u3046\u306F\u3064",
    "nameEn": "Taunt",
    "type": "dark",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "tearfullook",
    "name": "Tearful Look",
    "nameEn": "Tearful Look",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21931/\u3068\u304F\u3053\u3046\u21931"
  },
  {
    "id": "teatime",
    "name": "Teatime",
    "nameEn": "Teatime",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "teeterdance",
    "name": "\u30D5\u30E9\u30D5\u30E9\u30C0\u30F3\u30B9",
    "nameEn": "Teeter Dance",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "teleport",
    "name": "\u30C6\u30EC\u30DD\u30FC\u30C8",
    "nameEn": "Teleport",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": -6,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+-6"
  },
  {
    "id": "temperflare",
    "name": "Temper Flare",
    "nameEn": "Temper Flare",
    "type": "fire",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "terablast",
    "name": "Tera Blast",
    "nameEn": "Tera Blast",
    "type": "normal",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "terastarstorm",
    "name": "Tera Starstorm",
    "nameEn": "Tera Starstorm",
    "type": "normal",
    "category": "special",
    "power": 120,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "terrainpulse",
    "name": "\u3060\u3044\u3061\u306E\u306F\u3069\u3046",
    "nameEn": "Terrain Pulse",
    "type": "normal",
    "category": "special",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "thief",
    "name": "\u3069\u308D\u307C\u3046",
    "nameEn": "Thief",
    "type": "dark",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "thrash",
    "name": "\u3042\u3070\u308C\u308B",
    "nameEn": "Thrash",
    "type": "normal",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "throatchop",
    "name": "Throat Chop",
    "nameEn": "Throat Chop",
    "type": "dark",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "thunder",
    "name": "\u304B\u307F\u306A\u308A",
    "nameEn": "Thunder",
    "type": "electric",
    "category": "special",
    "power": 110,
    "accuracy": 70,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D70\u30FB30%\u3067\u307E\u3072",
    "secondary": {
      "chance": 30,
      "status": "par"
    }
  },
  {
    "id": "thunderbolt",
    "name": "10\u307E\u3093\u30DC\u30EB\u30C8",
    "nameEn": "Thunderbolt",
    "type": "electric",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u307E\u3072",
    "secondary": {
      "chance": 10,
      "status": "par"
    }
  },
  {
    "id": "thundercage",
    "name": "\u30B5\u30F3\u30C0\u30FC\u30D7\u30EA\u30BA\u30F3",
    "nameEn": "Thunder Cage",
    "type": "electric",
    "category": "special",
    "power": 80,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "thunderclap",
    "name": "Thunderclap",
    "nameEn": "Thunderclap",
    "type": "electric",
    "category": "special",
    "power": 70,
    "accuracy": 100,
    "pp": 5,
    "priority": 1,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+1"
  },
  {
    "id": "thunderfang",
    "name": "\u304B\u307F\u306A\u308A\u306E\u30AD\u30D0",
    "nameEn": "Thunder Fang",
    "type": "electric",
    "category": "physical",
    "power": 65,
    "accuracy": 95,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "thunderouskick",
    "name": "Thunderous Kick",
    "nameEn": "Thunderous Kick",
    "type": "fighting",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u307C\u3046\u304E\u3087\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "def": -1
      }
    }
  },
  {
    "id": "thunderpunch",
    "name": "Thunder Punch",
    "nameEn": "Thunder Punch",
    "type": "electric",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u307E\u3072",
    "secondary": {
      "chance": 10,
      "status": "par"
    }
  },
  {
    "id": "thundershock",
    "name": "\u3067\u3093\u304D\u30B7\u30E7\u30C3\u30AF",
    "nameEn": "Thunder Shock",
    "type": "electric",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u307E\u3072",
    "secondary": {
      "chance": 10,
      "status": "par"
    }
  },
  {
    "id": "thunderwave",
    "name": "\u3067\u3093\u3058\u306F",
    "nameEn": "Thunder Wave",
    "type": "electric",
    "category": "status",
    "power": 0,
    "accuracy": 90,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "tickle",
    "name": "\u304F\u3059\u3050\u308B",
    "nameEn": "Tickle",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21931/\u307C\u3046\u304E\u3087\u21931"
  },
  {
    "id": "tidyup",
    "name": "Tidy Up",
    "nameEn": "Tidy Up",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "topsyturvy",
    "name": "\u3072\u3063\u304F\u308A\u304B\u3048\u3059",
    "nameEn": "Topsy-Turvy",
    "type": "dark",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "torchsong",
    "name": "Torch Song",
    "nameEn": "Torch Song",
    "type": "fire",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "torment",
    "name": "\u3044\u3061\u3083\u3082\u3093",
    "nameEn": "Torment",
    "type": "dark",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "toxic",
    "name": "\u3069\u304F\u3069\u304F",
    "nameEn": "Toxic",
    "type": "poison",
    "category": "status",
    "power": 0,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "toxicspikes",
    "name": "\u3069\u304F\u3073\u3057",
    "nameEn": "Toxic Spikes",
    "type": "poison",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "toxicthread",
    "name": "Toxic Thread",
    "nameEn": "Toxic Thread",
    "type": "poison",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3059\u3070\u3084\u3055\u21931"
  },
  {
    "id": "trailblaze",
    "name": "Trailblaze",
    "nameEn": "Trailblaze",
    "type": "grass",
    "category": "physical",
    "power": 50,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "transform",
    "name": "\u3078\u3093\u3057\u3093",
    "nameEn": "Transform",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "triattack",
    "name": "\u30C8\u30E9\u30A4\u30A2\u30BF\u30C3\u30AF",
    "nameEn": "Tri Attack",
    "type": "normal",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "trick",
    "name": "\u30C8\u30EA\u30C3\u30AF",
    "nameEn": "Trick",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "trickroom",
    "name": "\u30C8\u30EA\u30C3\u30AF\u30EB\u30FC\u30E0",
    "nameEn": "Trick Room",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 5,
    "priority": -7,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+-7"
  },
  {
    "id": "triplearrows",
    "name": "Triple Arrows",
    "nameEn": "Triple Arrows",
    "type": "fighting",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "tripleaxel",
    "name": "\u30C8\u30EA\u30D7\u30EB\u30A2\u30AF\u30BB\u30EB",
    "nameEn": "Triple Axel",
    "type": "ice",
    "category": "physical",
    "power": 20,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "tripledive",
    "name": "Triple Dive",
    "nameEn": "Triple Dive",
    "type": "water",
    "category": "physical",
    "power": 30,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "triplekick",
    "name": "\u30C8\u30EA\u30D7\u30EB\u30AD\u30C3\u30AF",
    "nameEn": "Triple Kick",
    "type": "fighting",
    "category": "physical",
    "power": 10,
    "accuracy": 90,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "tropkick",
    "name": "Trop Kick",
    "nameEn": "Trop Kick",
    "type": "grass",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB100%\u3067\u3053\u3046\u3052\u304D\u21931",
    "secondary": {
      "chance": 100,
      "boosts": {
        "atk": -1
      }
    }
  },
  {
    "id": "twinbeam",
    "name": "Twin Beam",
    "nameEn": "Twin Beam",
    "type": "psychic",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "twister",
    "name": "\u305F\u3064\u307E\u304D",
    "nameEn": "Twister",
    "type": "dragon",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "upperhand",
    "name": "Upper Hand",
    "nameEn": "Upper Hand",
    "type": "fighting",
    "category": "physical",
    "power": 65,
    "accuracy": 100,
    "pp": 15,
    "priority": 3,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+3"
  },
  {
    "id": "uproar",
    "name": "\u3055\u308F\u3050",
    "nameEn": "Uproar",
    "type": "normal",
    "category": "special",
    "power": 90,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "uturn",
    "name": "\u3068\u3093\u307C\u304C\u3048\u308A",
    "nameEn": "U-turn",
    "type": "bug",
    "category": "physical",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "vacuumwave",
    "name": "\u3057\u3093\u304F\u3046\u306F",
    "nameEn": "Vacuum Wave",
    "type": "fighting",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "pp": 30,
    "priority": 1,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+1"
  },
  {
    "id": "vcreate",
    "name": "V\u30B8\u30A7\u30CD\u30EC\u30FC\u30C8",
    "nameEn": "V-create",
    "type": "fire",
    "category": "physical",
    "power": 180,
    "accuracy": 95,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95"
  },
  {
    "id": "veeveevolley",
    "name": "Veevee Volley",
    "nameEn": "Veevee Volley",
    "type": "normal",
    "category": "physical",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "venoshock",
    "name": "\u30D9\u30CE\u30E0\u30B7\u30E7\u30C3\u30AF",
    "nameEn": "Venoshock",
    "type": "poison",
    "category": "special",
    "power": 65,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "victorydance",
    "name": "Victory Dance",
    "nameEn": "Victory Dance",
    "type": "fighting",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21911/\u307C\u3046\u304E\u3087\u21911/\u3059\u3070\u3084\u3055\u21911"
  },
  {
    "id": "vinewhip",
    "name": "\u3064\u308B\u306E\u30E0\u30C1",
    "nameEn": "Vine Whip",
    "type": "grass",
    "category": "physical",
    "power": 45,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "visegrip",
    "name": "Vise Grip",
    "nameEn": "Vise Grip",
    "type": "normal",
    "category": "physical",
    "power": 55,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "voltswitch",
    "name": "\u30DC\u30EB\u30C8\u30C1\u30A7\u30F3\u30B8",
    "nameEn": "Volt Switch",
    "type": "electric",
    "category": "special",
    "power": 70,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "volttackle",
    "name": "Volt Tackle",
    "nameEn": "Volt Tackle",
    "type": "electric",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u307E\u3072\u30FB33%\u53CD\u52D5",
    "recoil": 33,
    "secondary": {
      "chance": 10,
      "status": "par"
    }
  },
  {
    "id": "waterfall",
    "name": "\u305F\u304D\u306E\u307C\u308A",
    "nameEn": "Waterfall",
    "type": "water",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "watergun",
    "name": "\u307F\u305A\u3067\u3063\u307D\u3046",
    "nameEn": "Water Gun",
    "type": "water",
    "category": "special",
    "power": 40,
    "accuracy": 100,
    "pp": 25,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "waterpledge",
    "name": "\u307F\u305A\u306E\u3061\u304B\u3044",
    "nameEn": "Water Pledge",
    "type": "water",
    "category": "special",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "waterpulse",
    "name": "\u307F\u305A\u306E\u306F\u3069\u3046",
    "nameEn": "Water Pulse",
    "type": "water",
    "category": "special",
    "power": 60,
    "accuracy": 100,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "watershuriken",
    "name": "Water Shuriken",
    "nameEn": "Water Shuriken",
    "type": "water",
    "category": "special",
    "power": 15,
    "accuracy": 100,
    "pp": 20,
    "priority": 1,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+1"
  },
  {
    "id": "waterspout",
    "name": "\u3057\u304A\u3075\u304D",
    "nameEn": "Water Spout",
    "type": "water",
    "category": "special",
    "power": 150,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "wavecrash",
    "name": "Wave Crash",
    "nameEn": "Wave Crash",
    "type": "water",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB33%\u53CD\u52D5",
    "recoil": 33
  },
  {
    "id": "weatherball",
    "name": "\u30A6\u30A7\u30B6\u30FC\u30DC\u30FC\u30EB",
    "nameEn": "Weather Ball",
    "type": "normal",
    "category": "special",
    "power": 50,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "whirlpool",
    "name": "\u3046\u305A\u3057\u304A",
    "nameEn": "Whirlpool",
    "type": "water",
    "category": "special",
    "power": 35,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85"
  },
  {
    "id": "whirlwind",
    "name": "\u3075\u304D\u3068\u3070\u3057",
    "nameEn": "Whirlwind",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 20,
    "priority": -6,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+-6"
  },
  {
    "id": "wickedblow",
    "name": "\u3042\u3093\u3053\u304F\u304D\u3087\u3046\u3060",
    "nameEn": "Wicked Blow",
    "type": "dark",
    "category": "physical",
    "power": 75,
    "accuracy": 100,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "wickedtorque",
    "name": "Wicked Torque",
    "nameEn": "Wicked Torque",
    "type": "dark",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u306D\u3080\u308A",
    "secondary": {
      "chance": 10,
      "status": "slp"
    }
  },
  {
    "id": "wideguard",
    "name": "Wide Guard",
    "nameEn": "Wide Guard",
    "type": "rock",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 3,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+3"
  },
  {
    "id": "wildboltstorm",
    "name": "Wildbolt Storm",
    "nameEn": "Wildbolt Storm",
    "type": "electric",
    "category": "special",
    "power": 100,
    "accuracy": 80,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D80\u30FB20%\u3067\u307E\u3072",
    "secondary": {
      "chance": 20,
      "status": "par"
    }
  },
  {
    "id": "wildcharge",
    "name": "\u30EF\u30A4\u30EB\u30C9\u30DC\u30EB\u30C8",
    "nameEn": "Wild Charge",
    "type": "electric",
    "category": "physical",
    "power": 90,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB25%\u53CD\u52D5",
    "recoil": 25
  },
  {
    "id": "willowisp",
    "name": "\u304A\u306B\u3073",
    "nameEn": "Will-O-Wisp",
    "type": "fire",
    "category": "status",
    "power": 0,
    "accuracy": 85,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D85"
  },
  {
    "id": "wingattack",
    "name": "\u3064\u3070\u3055\u3067\u3046\u3064",
    "nameEn": "Wing Attack",
    "type": "flying",
    "category": "physical",
    "power": 60,
    "accuracy": 100,
    "pp": 35,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "wish",
    "name": "\u306D\u304C\u3044\u3054\u3068",
    "nameEn": "Wish",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "withdraw",
    "name": "\u304B\u3089\u306B\u3053\u3082\u308B",
    "nameEn": "Withdraw",
    "type": "water",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 40,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u307C\u3046\u304E\u3087\u21911"
  },
  {
    "id": "wonderroom",
    "name": "Wonder Room",
    "nameEn": "Wonder Room",
    "type": "psychic",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "woodhammer",
    "name": "\u30A6\u30C3\u30C9\u30CF\u30F3\u30DE\u30FC",
    "nameEn": "Wood Hammer",
    "type": "grass",
    "category": "physical",
    "power": 120,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB33%\u53CD\u52D5",
    "recoil": 33
  },
  {
    "id": "workup",
    "name": "\u3075\u308B\u3044\u305F\u3066\u308B",
    "nameEn": "Work Up",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 30,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u81EA\u5206\u306E\u3053\u3046\u3052\u304D\u21911/\u3068\u304F\u3053\u3046\u21911"
  },
  {
    "id": "worryseed",
    "name": "\u306A\u3084\u307F\u306E\u30BF\u30CD",
    "nameEn": "Worry Seed",
    "type": "grass",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "wrap",
    "name": "\u307E\u304D\u3064\u304F",
    "nameEn": "Wrap",
    "type": "normal",
    "category": "physical",
    "power": 15,
    "accuracy": 90,
    "pp": 20,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "xscissor",
    "name": "\u30B7\u30B6\u30FC\u30AF\u30ED\u30B9",
    "nameEn": "X-Scissor",
    "type": "bug",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "yawn",
    "name": "\u3042\u304F\u3073",
    "nameEn": "Yawn",
    "type": "normal",
    "category": "status",
    "power": 0,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "zapcannon",
    "name": "\u3067\u3093\u3058\u307B\u3046",
    "nameEn": "Zap Cannon",
    "type": "electric",
    "category": "special",
    "power": 120,
    "accuracy": 50,
    "pp": 5,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D50\u30FB100%\u3067\u307E\u3072",
    "secondary": {
      "chance": 100,
      "status": "par"
    }
  },
  {
    "id": "zenheadbutt",
    "name": "\u3057\u306D\u3093\u306E\u305A\u3064\u304D",
    "nameEn": "Zen Headbutt",
    "type": "psychic",
    "category": "physical",
    "power": 80,
    "accuracy": 90,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D90"
  },
  {
    "id": "zingzap",
    "name": "Zing Zap",
    "nameEn": "Zing Zap",
    "type": "electric",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined"
  },
  {
    "id": "zippyzap",
    "name": "Zippy Zap",
    "nameEn": "Zippy Zap",
    "type": "electric",
    "category": "physical",
    "power": 80,
    "accuracy": 100,
    "pp": 10,
    "priority": 2,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u5148\u5236+2"
  },
  {
    "id": "paleowave",
    "name": "Paleo Wave",
    "nameEn": "Paleo Wave",
    "type": "rock",
    "category": "special",
    "power": 85,
    "accuracy": 100,
    "pp": 15,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB20%\u3067\u3053\u3046\u3052\u304D\u21931",
    "secondary": {
      "chance": 20,
      "boosts": {
        "atk": -1
      }
    }
  },
  {
    "id": "shadowstrike",
    "name": "Shadow Strike",
    "nameEn": "Shadow Strike",
    "type": "ghost",
    "category": "physical",
    "power": 80,
    "accuracy": 95,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB\u547D\u4E2D95\u30FB50%\u3067\u307C\u3046\u304E\u3087\u21931",
    "secondary": {
      "chance": 50,
      "boosts": {
        "def": -1
      }
    }
  },
  {
    "id": "polarflare",
    "name": "Polar Flare",
    "nameEn": "Polar Flare",
    "type": "fire",
    "category": "special",
    "power": 75,
    "accuracy": 100,
    "pp": 10,
    "priority": 0,
    "description": "\u7279\u6B8A\u30FB\u5A01\u529Bundefined\u30FB10%\u3067\u3053\u304A\u308A",
    "secondary": {
      "chance": 10,
      "status": "frz"
    }
  }
];

// worker.ts
var TYPE_CHART = EXTRACTED_TYPE_CHART;
var MOVE_TEMPLATES = EXTRACTED_MOVES.map((m) => ({
  id: m.id,
  name: m.name,
  type: m.type,
  power: m.power,
  accuracy: m.accuracy,
  pp: m.pp,
  priority: m.priority,
  category: m.category,
  drain: m.drain,
  recoil: m.recoil,
  secondary: m.secondary
}));
var MONSTER_TEMPLATES = EXTRACTED_POKEDEX.map((p) => ({
  id: p.id,
  name: p.name,
  type: p.type,
  type2: p.type2,
  baseStats: {
    hp: p.baseStats.hp,
    atk: p.baseStats.atk,
    def: p.baseStats.def,
    spa: p.baseStats.spa,
    spd: p.baseStats.spd,
    spe: p.baseStats.spe
  },
  abilities: p.abilities
}));
var BattleEngine = class {
  static {
    __name(this, "BattleEngine");
  }
  constructor(seed) {
    this.seed = seed ?? Math.floor(Math.random() * 2147483647);
  }
  random() {
    this.seed = this.seed * 1103515245 + 12345 & 2147483647;
    return this.seed / 2147483647;
  }
  createMonster(template, level = 50) {
    const calcHP = /* @__PURE__ */ __name((base) => Math.floor((2 * base + 31) * level / 100 + level + 10), "calcHP");
    const calcStat = /* @__PURE__ */ __name((base) => Math.floor((2 * base + 31) * level / 100 + 5), "calcStat");
    const hp = calcHP(template.baseStats.hp);
    const atk = calcStat(template.baseStats.atk);
    const def = calcStat(template.baseStats.def);
    const spa = calcStat(template.baseStats.spa ?? template.baseStats.atk);
    const spd = calcStat(template.baseStats.spd ?? template.baseStats.def);
    const spe = calcStat(template.baseStats.spe ?? template.baseStats.spd ?? 50);
    const availableMoves = template.movePool.map((id) => MOVE_TEMPLATES.find((m) => m.id === id)).filter((m) => m !== void 0);
    const shuffled = [...availableMoves].sort(() => this.random() - 0.5);
    const selectedMoves = shuffled.slice(0, Math.min(4, shuffled.length));
    const ability = template.abilities && template.abilities.length > 0 ? template.abilities[Math.floor(this.random() * template.abilities.length)] : "unknown";
    return {
      unique_id: `${template.id}_${Math.floor(this.random() * 1e4)}`,
      template_id: template.id,
      nickname: template.name,
      type: template.type,
      type2: template.type2,
      hp_current: hp,
      hp_max: hp,
      current_atk: atk,
      current_def: def,
      current_spa: spa,
      current_spd: spd,
      current_spe: spe,
      moves: selectedMoves,
      movePP: selectedMoves.map((m) => m.pp),
      buffs: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, crit: 0, evade: 0 },
      spriteUrl: template.spriteUrl,
      ability,
      item: ""
    };
  }
  generateTeam(size = 3) {
    const shuffled = [...MONSTER_TEMPLATES].sort(() => this.random() - 0.5);
    const selected = shuffled.slice(0, size);
    return selected.map((t) => this.createMonster(t, 50));
  }
  getStat(mon, stat) {
    let base;
    switch (stat) {
      case "atk":
        base = mon.current_atk;
        break;
      case "def":
        base = mon.current_def;
        break;
      case "spa":
        base = mon.current_spa;
        break;
      case "spd":
        base = mon.current_spd;
        break;
      case "spe":
        base = mon.current_spe;
        break;
    }
    const buff = mon.buffs[stat];
    const clampedBuff = Math.max(-6, Math.min(6, buff));
    const multiplier = clampedBuff >= 0 ? (2 + clampedBuff) / 2 : 2 / (2 - clampedBuff);
    let val = Math.floor(base * multiplier);
    if (mon.item === "choicescarf" && stat === "spe") {
      val = Math.floor(val * 1.5);
    } else if (mon.item === "choiceband" && stat === "atk") {
      val = Math.floor(val * 1.5);
    } else if (mon.item === "choicespecs" && stat === "spa") {
      val = Math.floor(val * 1.5);
    }
    return val;
  }
  triggerAbility(mon, trigger, context2) {
    const events = [];
    if (trigger === "onSwitchIn") {
      if (mon.ability === "intimidate") {
        const opponent = context2.opponent;
        if (opponent && opponent.hp_current > 0) {
          opponent.buffs.atk = Math.max(-6, opponent.buffs.atk - 1);
          events.push({
            type: "text",
            message: `${mon.nickname}\u306E \u3044\u304B\u304F\uFF01 ${opponent.nickname}\u306E \u3053\u3046\u3052\u304D\u304C \u3055\u304C\u3063\u305F\uFF01`
          });
          events.push({
            type: "stat_change",
            targetId: opponent.unique_id,
            targetName: opponent.nickname,
            stat: "atk",
            stages: -1
          });
        }
      }
    }
    return events;
  }
  triggerItem(mon, trigger, context2) {
    const events = [];
    if (trigger === "onTurnEnd") {
      if (mon.item === "leftovers" && mon.hp_current < mon.hp_max && mon.hp_current > 0) {
        const heal = Math.floor(mon.hp_max / 16) || 1;
        mon.hp_current = Math.min(mon.hp_max, mon.hp_current + heal);
        events.push({
          type: "text",
          message: `${mon.nickname}\u306F \u305F\u3079\u306E\u3053\u3057\u3067 \u304B\u3044\u3075\u304F\u3057\u305F\uFF01`
        });
      }
    }
    return events;
  }
  calculateDamage(attacker, defender, move) {
    if (move.power === 0 || move.category === "status") {
      return { damage: 0, isCrit: false, effectiveness: 1, isStab: false };
    }
    const category = move.category || "physical";
    const isPhysical = category === "physical";
    const atkStat = isPhysical ? this.getStat(attacker, "atk") : this.getStat(attacker, "spa");
    const defStat = isPhysical ? this.getStat(defender, "def") : this.getStat(defender, "spd");
    const burnPenalty = attacker.status === "brn" && isPhysical ? 0.5 : 1;
    const power = move.power;
    let effectiveness = TYPE_CHART[move.type]?.[defender.type] ?? 1;
    if (defender.type2) {
      effectiveness *= TYPE_CHART[move.type]?.[defender.type2] ?? 1;
    }
    const isStab = move.type === attacker.type || move.type === attacker.type2;
    const stabMultiplier = isStab ? 1.5 : 1;
    const critChance = 0.0625 + attacker.buffs.crit * 0.05;
    const isCrit = this.random() < critChance;
    const critMultiplier = isCrit ? 1.5 : 1;
    const randomFactor = 0.85 + this.random() * 0.15;
    let abilityMultiplier = 1;
    if (attacker.hp_current <= attacker.hp_max / 3) {
      if (attacker.ability === "blaze" && move.type === "fire" || attacker.ability === "torrent" && move.type === "water" || attacker.ability === "overgrow" && move.type === "grass" || attacker.ability === "swarm" && move.type === "bug") {
        abilityMultiplier = 1.5;
      }
    }
    let itemMultiplier = 1;
    if (attacker.item === "lifeorb") {
      itemMultiplier = 1.3;
    } else if (attacker.item === "expertbelt" && effectiveness > 1) {
      itemMultiplier = 1.2;
    } else if (attacker.item === "choiceband" && isPhysical) {
      itemMultiplier = 1.5;
    } else if (attacker.item === "choicespecs" && !isPhysical) {
      itemMultiplier = 1.5;
    }
    const level = 50;
    const baseDamage = Math.floor((2 * level / 5 + 2) * power * atkStat / defStat / 50 + 2);
    let damage = Math.floor(baseDamage * effectiveness * stabMultiplier * critMultiplier * randomFactor * burnPenalty * abilityMultiplier * itemMultiplier);
    if (damage < 1) damage = 1;
    return { damage, isCrit, effectiveness, isStab };
  }
  checkAccuracy(move) {
    const accuracy = move.accuracy ?? 100;
    return this.random() * 100 <= accuracy;
  }
  checkEvasion(defender) {
    const baseDodge = 0.05;
    const evadeBuffBonus = defender.buffs.evade * 0.05;
    const dodgeSynergy = baseDodge * evadeBuffBonus * 0.5;
    const totalDodge = Math.min(baseDodge + evadeBuffBonus + dodgeSynergy, 0.5);
    return this.random() < totalDodge;
  }
  executeTurn(state) {
    const events = [];
    const playerIds = Object.keys(state.players);
    events.push({ type: "turn_start", turn: state.turn });
    const actions = [];
    for (const playerId of playerIds) {
      const player = state.players[playerId];
      const mon = player.team[player.activeSlot];
      if (player.action && mon.hp_current > 0) {
        actions.push({ playerId, player, mon, action: player.action });
      }
    }
    actions.sort((a, b) => {
      if (a.action.type === "switch" && b.action.type !== "switch") return -1;
      if (b.action.type === "switch" && a.action.type !== "switch") return 1;
      if (a.action.type === "move" && b.action.type === "move") {
        const moveA = MOVE_TEMPLATES.find((m) => m.id === a.action.moveId);
        const moveB = MOVE_TEMPLATES.find((m) => m.id === b.action.moveId);
        const priorityA = moveA?.priority ?? 0;
        const priorityB = moveB?.priority ?? 0;
        if (priorityA !== priorityB) return priorityB - priorityA;
        const spdA = this.getStat(a.mon, "spd");
        const spdB = this.getStat(b.mon, "spd");
        if (spdA !== spdB) return spdB - spdA;
        return this.random() - 0.5;
      }
      return 0;
    });
    for (const { playerId, player, mon, action } of actions) {
      if (mon.hp_current <= 0) continue;
      const opponentId = playerIds.find((id) => id !== playerId);
      const opponent = state.players[opponentId];
      const opponentMon = opponent.team[opponent.activeSlot];
      if (action.type === "switch") {
        const newSlot = action.target;
        const newMon = player.team[newSlot];
        if (newMon && newMon.hp_current > 0) {
          player.activeSlot = newSlot;
          events.push({
            type: "switch",
            playerId,
            playerName: player.name,
            monsterName: newMon.nickname,
            monsterId: newMon.unique_id,
            newSlot
          });
          const switchEvents = this.triggerAbility(newMon, "onSwitchIn", { opponent: opponentMon });
          events.push(...switchEvents);
        }
      } else if (action.type === "move") {
        const move = MOVE_TEMPLATES.find((m) => m.id === action.moveId);
        if (!move) continue;
        if (mon.status === "par" && this.random() < 0.25) {
          events.push({
            type: "text",
            message: `${mon.nickname}\u306F \u3057\u3073\u308C\u3066 \u3046\u3054\u3051\u306A\u3044\uFF01`
          });
          continue;
        }
        if (mon.status === "frz") {
          if (this.random() < 0.2 || move.type === "fire") {
            mon.status = void 0;
            events.push({
              type: "text",
              message: `${mon.nickname}\u306E \u3053\u304A\u308A\u304C \u3068\u3051\u305F\uFF01`
            });
          } else {
            events.push({
              type: "text",
              message: `${mon.nickname}\u306F \u3053\u304A\u3063\u3066 \u3046\u3054\u3051\u306A\u3044\uFF01`
            });
            continue;
          }
        }
        if (mon.status === "slp") {
          if (this.random() < 0.5) {
            mon.status = void 0;
            events.push({
              type: "text",
              message: `${mon.nickname}\u306F \u3081\u3092 \u3055\u307E\u3057\u305F\uFF01`
            });
          } else {
            events.push({
              type: "text",
              message: `${mon.nickname}\u306F \u3050\u3046\u3050\u3046 \u306D\u3080\u3063\u3066\u3044\u308B...`
            });
            continue;
          }
        }
        events.push({
          type: "move_announce",
          actorId: mon.unique_id,
          actorName: mon.nickname,
          moveName: move.name,
          moveType: move.type
        });
        if (opponentMon.hp_current <= 0) continue;
        if (!this.checkAccuracy(move)) {
          events.push({ type: "miss", attackerName: mon.nickname });
          continue;
        }
        if (move.power > 0 && this.checkEvasion(opponentMon)) {
          events.push({ type: "evade", targetName: opponentMon.nickname });
          continue;
        }
        if (move.power === 0 && move.effect) {
          const target = move.effect.target === "self" ? mon : opponentMon;
          const targetId = move.effect.target === "self" ? playerId : opponentId;
          const stat = move.effect.stat;
          const stages = move.effect.stages;
          target.buffs[stat] = Math.max(-6, Math.min(6, target.buffs[stat] + stages));
          events.push({
            type: "stat_change",
            targetId: target.unique_id,
            targetName: target.nickname,
            stat,
            stages
          });
          events.push({
            type: "move_effect",
            actorId: mon.unique_id,
            actorName: mon.nickname,
            stat,
            stages
          });
        }
        if (move.power > 0) {
          const { damage, isCrit, effectiveness, isStab } = this.calculateDamage(mon, opponentMon, move);
          opponentMon.hp_current = Math.max(0, opponentMon.hp_current - damage);
          events.push({
            type: "damage",
            targetId: opponentMon.unique_id,
            targetName: opponentMon.nickname,
            amount: damage,
            newHp: opponentMon.hp_current,
            maxHp: opponentMon.hp_max,
            isCrit,
            effectiveness
          });
          const recoil = move.recoil;
          if (recoil && damage > 0) {
            const recoilDamage = Math.floor(damage * recoil / 100);
            if (recoilDamage > 0) {
              mon.hp_current = Math.max(0, mon.hp_current - recoilDamage);
              events.push({
                type: "text",
                message: `${mon.nickname}\u306F \u53CD\u52D5\u3067 \u30C0\u30E1\u30FC\u30B8\u3092 \u53D7\u3051\u305F\uFF01`
              });
              events.push({
                type: "damage",
                targetId: mon.unique_id,
                targetName: mon.nickname,
                amount: recoilDamage,
                newHp: mon.hp_current,
                maxHp: mon.hp_max,
                isCrit: false,
                effectiveness: 1
              });
            }
          }
          const drain = move.drain;
          if (drain && damage > 0) {
            const drainAmount = Math.floor(damage * drain / 100);
            if (drainAmount > 0) {
              const prevHp = mon.hp_current;
              mon.hp_current = Math.min(mon.hp_max, mon.hp_current + drainAmount);
              const healed = mon.hp_current - prevHp;
              if (healed > 0) {
                events.push({
                  type: "heal",
                  targetId: mon.unique_id,
                  targetName: mon.nickname,
                  amount: healed,
                  newHp: mon.hp_current,
                  maxHp: mon.hp_max
                });
              }
            }
          }
          if (mon.item === "lifeorb" && damage > 0) {
            const lifeOrbDamage = Math.floor(mon.hp_max / 10);
            mon.hp_current = Math.max(0, mon.hp_current - lifeOrbDamage);
            events.push({
              type: "text",
              message: `${mon.nickname}\u306F \u3044\u306E\u3061\u306E\u305F\u307E\u3067 \u4F53\u529B\u3092 \u524A\u3089\u308C\u305F\uFF01`
            });
          }
          const secondary = move.secondary;
          if (secondary && opponentMon.hp_current > 0) {
            if (this.random() * 100 < secondary.chance) {
              if (secondary.status && !opponentMon.status) {
                const types = [opponentMon.type];
                if (opponentMon.type2) types.push(opponentMon.type2);
                let canInflict = true;
                if (secondary.status === "brn" && types.includes("fire")) canInflict = false;
                if (secondary.status === "par" && types.includes("electric")) canInflict = false;
                if ((secondary.status === "psn" || secondary.status === "tox") && (types.includes("poison") || types.includes("steel"))) canInflict = false;
                if (secondary.status === "frz" && types.includes("ice")) canInflict = false;
                if (canInflict) {
                  opponentMon.status = secondary.status;
                  const statusNames = { brn: "\u3084\u3051\u3069", par: "\u307E\u3072", psn: "\u3069\u304F", frz: "\u3053\u304A\u308A", slp: "\u306D\u3080\u308A" };
                  events.push({
                    type: "status",
                    targetId: opponentMon.unique_id,
                    targetName: opponentMon.nickname,
                    status: secondary.status,
                    message: `${opponentMon.nickname}\u306F ${statusNames[secondary.status] || secondary.status}\u72B6\u614B\u306B \u306A\u3063\u305F\uFF01`
                  });
                }
              }
            }
          }
          if (opponentMon.hp_current <= 0) {
            events.push({
              type: "faint",
              targetId: opponentMon.unique_id,
              targetName: opponentMon.nickname
            });
            const remaining = opponent.team.filter((m) => m.hp_current > 0);
            if (remaining.length === 0) {
              state.phase = "end";
              state.winner = playerId;
              events.push({
                type: "battle_end",
                winnerId: playerId,
                winnerName: player.name
              });
              state.events = events;
              return state;
            } else {
              state.phase = "forced_switch";
              state.forcedSwitchPlayer = opponentId;
              events.push({
                type: "forced_switch_request",
                playerId: opponentId
              });
              state.events = events;
              return state;
            }
          }
        }
      }
    }
    for (const playerId of playerIds) {
      state.players[playerId].ready = false;
      state.players[playerId].action = void 0;
      const player = state.players[playerId];
      const mon = player.team[player.activeSlot];
      if (mon && mon.hp_current > 0) {
        if (mon.status === "brn") {
          const burnDamage = Math.floor(mon.hp_max / 16);
          mon.hp_current = Math.max(0, mon.hp_current - burnDamage);
          events.push({
            type: "text",
            message: `${mon.nickname}\u306F \u3084\u3051\u3069\u306E \u30C0\u30E1\u30FC\u30B8\u3092 \u3046\u3051\u305F\uFF01`
          });
          events.push({
            type: "damage",
            targetId: mon.unique_id,
            targetName: mon.nickname,
            amount: burnDamage,
            newHp: mon.hp_current,
            maxHp: mon.hp_max,
            isCrit: false,
            effectiveness: 1
          });
        } else if (mon.status === "psn") {
          const poisonDamage = Math.floor(mon.hp_max / 8);
          mon.hp_current = Math.max(0, mon.hp_current - poisonDamage);
          events.push({
            type: "text",
            message: `${mon.nickname}\u306F \u3069\u304F\u306E \u30C0\u30E1\u30FC\u30B8\u3092 \u3046\u3051\u305F\uFF01`
          });
          events.push({
            type: "damage",
            targetId: mon.unique_id,
            targetName: mon.nickname,
            amount: poisonDamage,
            newHp: mon.hp_current,
            maxHp: mon.hp_max,
            isCrit: false,
            effectiveness: 1
          });
        }
        if (mon.item === "leftovers" && mon.hp_current < mon.hp_max) {
          const healAmount = Math.floor(mon.hp_max / 16);
          const prevHp = mon.hp_current;
          mon.hp_current = Math.min(mon.hp_max, mon.hp_current + healAmount);
          const healed = mon.hp_current - prevHp;
          if (healed > 0) {
            events.push({
              type: "text",
              message: `${mon.nickname}\u306F \u305F\u3079\u306E\u3053\u3057\u3067 \u5C11\u3057\u56DE\u5FA9\u3057\u305F\uFF01`
            });
            events.push({
              type: "heal",
              targetId: mon.unique_id,
              targetName: mon.nickname,
              amount: healed,
              newHp: mon.hp_current,
              maxHp: mon.hp_max
            });
          }
        }
        const turnEndEvents = this.triggerItem(mon, "onTurnEnd");
        events.push(...turnEndEvents);
        if (mon.hp_current <= 0) {
          events.push({
            type: "faint",
            targetId: mon.unique_id,
            targetName: mon.nickname
          });
        }
      }
    }
    state.turn++;
    state.phase = "selection";
    state.events = events;
    return state;
  }
  getAIChoice(player) {
    const activeMon = player.team[player.activeSlot];
    if (activeMon.hp_current <= 0) {
      const aliveIndex = player.team.findIndex((m) => m.hp_current > 0);
      if (aliveIndex >= 0) {
        return { type: "switch", target: aliveIndex };
      }
    }
    const availableMoves = activeMon.moves.filter((m) => true);
    if (availableMoves.length > 0) {
      const move = availableMoves[Math.floor(this.random() * availableMoves.length)];
      return { type: "move", moveId: move.id };
    }
    return { type: "move", moveId: activeMon.moves[0]?.id ?? "tackle" };
  }
  serializeState(state) {
    const serialized = {
      seed: this.seed,
      turn: state.turn,
      phase: state.phase,
      players: {},
      choices: [],
      forcedSwitchPlayer: state.forcedSwitchPlayer
    };
    for (const [id, player] of Object.entries(state.players)) {
      serialized.players[id] = {
        name: player.name,
        team: player.team.map((mon) => ({
          template_id: mon.template_id,
          nickname: mon.nickname,
          hp_current: mon.hp_current,
          hp_max: mon.hp_max,
          type: mon.type,
          current_atk: mon.current_atk,
          current_def: mon.current_def,
          current_spd: mon.current_spd,
          spriteUrl: mon.spriteUrl,
          moves: mon.moves.map((m) => m.id),
          buffs: { ...mon.buffs }
        })),
        activeSlot: player.activeSlot
      };
    }
    return serialized;
  }
  restoreState(serialized) {
    this.seed = serialized.seed;
    const state = {
      phase: serialized.phase,
      turn: serialized.turn,
      players: {},
      events: [],
      forcedSwitchPlayer: serialized.forcedSwitchPlayer
    };
    for (const [id, playerData] of Object.entries(serialized.players)) {
      state.players[id] = {
        id,
        name: playerData.name,
        team: playerData.team.map((monData) => {
          const moves = monData.moves.map((moveId) => MOVE_TEMPLATES.find((m) => m.id === moveId)).filter((m) => m !== void 0);
          return {
            unique_id: monData.template_id + "_" + Math.floor(Math.random() * 1e4),
            template_id: monData.template_id,
            nickname: monData.nickname,
            type: monData.type,
            hp_current: monData.hp_current,
            hp_max: monData.hp_max,
            current_atk: monData.current_atk,
            current_def: monData.current_def,
            current_spd: monData.current_spd,
            moves,
            buffs: { ...monData.buffs },
            spriteUrl: monData.spriteUrl || "https://play.pokemonshowdown.com/sprites/gen5ani/substitute.gif",
            ability: "unknown",
            item: ""
          };
        }),
        activeSlot: playerData.activeSlot,
        ready: false
      };
    }
    return state;
  }
};
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "pokemon-battle-salt");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hashPassword, "hashPassword");
async function verifyPassword(password, hash) {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}
__name(verifyPassword, "verifyPassword");
function generateId() {
  return crypto.randomUUID();
}
__name(generateId, "generateId");
function generateSessionToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(generateSessionToken, "generateSessionToken");
function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
__name(generateRoomCode, "generateRoomCode");
async function getUserFromRequest(request, db) {
  const cookie = request.headers.get("Cookie");
  if (!cookie) return null;
  const match = cookie.match(/session=([^;]+)/);
  if (!match) return null;
  const token = match[1];
  const now = Math.floor(Date.now() / 1e3);
  const result = await db.prepare(`
    SELECT u.* FROM users u
    JOIN sessions s ON s.user_id = u.id
    WHERE s.token = ? AND s.expires_at > ?
  `).bind(token, now).first();
  return result || null;
}
__name(getUserFromRequest, "getUserFromRequest");
async function createStarterMonsters(db, userId) {
  const shuffled = [...MONSTER_TEMPLATES].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);
  for (let i = 0; i < selected.length; i++) {
    const t = selected[i];
    const monsterId = generateId();
    const moves = [...t.movePool].sort(() => Math.random() - 0.5).slice(0, 4);
    const move1 = moves[0] || null;
    const move2 = moves[1] || null;
    const move3 = moves[2] || null;
    const move4 = moves[3] || null;
    await db.prepare(`
      INSERT INTO monsters (id, owner_id, name, type, hp, atk, def, spd, sprite_url, move1, move2, move3, move4)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      monsterId,
      userId,
      t.name,
      t.type,
      t.baseStats.hp,
      t.baseStats.atk,
      t.baseStats.def,
      t.baseStats.spd,
      t.spriteUrl,
      move1,
      move2,
      move3,
      move4
    ).run();
    await db.prepare(`
      INSERT INTO team_slots (user_id, slot, monster_id) VALUES (?, ?, ?)
    `).bind(userId, i, monsterId).run();
  }
}
__name(createStarterMonsters, "createStarterMonsters");
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true"
};
var worker_default = {
  async fetch(request, env2, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    if (path === "/api/data/search") {
      const q = url.searchParams.get("q")?.toLowerCase() || "";
      const type = url.searchParams.get("type") || "pokemon";
      if (!q || q.length < 2) {
        return new Response(JSON.stringify({ results: [] }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
      }
      let results = [];
      if (type === "pokemon") {
        results = MONSTER_TEMPLATES.filter((m) => m.name.toLowerCase().includes(q) || m.id.includes(q)).slice(0, 20).map((m) => ({ id: m.id, name: m.name, spriteUrl: m.spriteUrl, type: m.type, baseStats: m.baseStats, movePool: m.movePool }));
      } else if (type === "move") {
        results = MOVE_TEMPLATES.filter((m) => m.name.toLowerCase().includes(q) || m.id.includes(q)).slice(0, 20).map((m) => ({ id: m.id, name: m.name, type: m.type, power: m.power, accuracy: m.accuracy }));
      }
      return new Response(JSON.stringify({ results }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
    }
    if (path === "/api/auth/register" && request.method === "POST") {
      try {
        const body = await request.json();
        const { username, password } = body;
        if (!username || !password || username.length < 3 || password.length < 4) {
          return new Response(JSON.stringify({ error: "Invalid username or password" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        const existing = await env2.DB.prepare("SELECT id FROM users WHERE username = ?").bind(username).first();
        if (existing) {
          return new Response(JSON.stringify({ error: "Username already exists" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        const userId = generateId();
        const passwordHash = await hashPassword(password);
        await env2.DB.prepare(`
          INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)
        `).bind(userId, username, passwordHash).run();
        await createStarterMonsters(env2.DB, userId);
        const token = generateSessionToken();
        const expiresAt = Math.floor(Date.now() / 1e3) + 60 * 60 * 24 * 7;
        await env2.DB.prepare(`
          INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)
        `).bind(token, userId, expiresAt).run();
        return new Response(JSON.stringify({ success: true, user: { id: userId, username } }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`,
            ...corsHeaders
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
    }
    if (path === "/api/auth/login" && request.method === "POST") {
      try {
        const body = await request.json();
        const { username, password } = body;
        const user = await env2.DB.prepare("SELECT * FROM users WHERE username = ?").bind(username).first();
        if (!user) {
          return new Response(JSON.stringify({ error: "Invalid credentials" }), {
            status: 401,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        const valid = await verifyPassword(password, user.password_hash);
        if (!valid) {
          return new Response(JSON.stringify({ error: "Invalid credentials" }), {
            status: 401,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        const token = generateSessionToken();
        const expiresAt = Math.floor(Date.now() / 1e3) + 60 * 60 * 24 * 7;
        await env2.DB.prepare(`
          INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)
        `).bind(token, user.id, expiresAt).run();
        return new Response(JSON.stringify({ success: true, user: { id: user.id, username: user.username } }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`,
            ...corsHeaders
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
    }
    if (path === "/api/auth/logout" && request.method === "POST") {
      const cookie = request.headers.get("Cookie");
      const match = cookie?.match(/session=([^;]+)/);
      if (match) {
        await env2.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(match[1]).run();
      }
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": "session=; Path=/; HttpOnly; Max-Age=0",
          ...corsHeaders
        }
      });
    }
    if (path === "/api/auth/me" && request.method === "GET") {
      const user = await getUserFromRequest(request, env2.DB);
      if (!user) {
        return new Response(JSON.stringify({ user: null }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      return new Response(JSON.stringify({ user: { id: user.id, username: user.username } }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    if (path === "/api/monsters" && request.method === "GET") {
      const user = await getUserFromRequest(request, env2.DB);
      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const monsters = await env2.DB.prepare(`
        SELECT * FROM monsters WHERE owner_id = ? ORDER BY created_at DESC
      `).bind(user.id).all();
      return new Response(JSON.stringify({ monsters: monsters.results }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    if (path === "/api/monsters" && request.method === "POST") {
      const user = await getUserFromRequest(request, env2.DB);
      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      try {
        const body = await request.json();
        const monsterId = generateId();
        await env2.DB.prepare(`
          INSERT INTO monsters (id, owner_id, name, type, hp, atk, def, spd, sprite_url, move1, move2, move3, move4)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          monsterId,
          user.id,
          body.name || "New Monster",
          body.type || "normal",
          body.hp || 100,
          body.atk || 50,
          body.def || 50,
          body.spd || 50,
          body.sprite_url || null,
          body.move1 || "tackle",
          body.move2 || null,
          body.move3 || null,
          body.move4 || null
        ).run();
        return new Response(JSON.stringify({ success: true, id: monsterId }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
    }
    if (path.startsWith("/api/monsters/") && request.method === "DELETE") {
      const user = await getUserFromRequest(request, env2.DB);
      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const monsterId = path.split("/")[3];
      await env2.DB.prepare(`
        DELETE FROM monsters WHERE id = ? AND owner_id = ?
      `).bind(monsterId, user.id).run();
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    if (path === "/api/team" && request.method === "GET") {
      const user = await getUserFromRequest(request, env2.DB);
      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const teamSlots = await env2.DB.prepare(`
        SELECT ts.slot, m.* FROM team_slots ts
        LEFT JOIN monsters m ON ts.monster_id = m.id
        WHERE ts.user_id = ?
        ORDER BY ts.slot
      `).bind(user.id).all();
      return new Response(JSON.stringify({ team: teamSlots.results }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    if (path === "/api/team" && request.method === "PUT") {
      const user = await getUserFromRequest(request, env2.DB);
      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      try {
        const body = await request.json();
        const { slots } = body;
        await env2.DB.prepare("DELETE FROM team_slots WHERE user_id = ?").bind(user.id).run();
        for (let i = 0; i < Math.min(slots.length, 6); i++) {
          await env2.DB.prepare(`
            INSERT INTO team_slots (user_id, slot, monster_id) VALUES (?, ?, ?)
          `).bind(user.id, i, slots[i]).run();
        }
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
    }
    if (path === "/api/rooms" && request.method === "POST") {
      const user = await getUserFromRequest(request, env2.DB);
      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const roomCode = generateRoomCode();
      const roomId = env2.BATTLE_ROOM.idFromName(roomCode);
      const room = env2.BATTLE_ROOM.get(roomId);
      await room.fetch(new Request("http://internal/init", {
        method: "POST",
        body: JSON.stringify({ hostId: user.id, hostName: user.username })
      }));
      return new Response(JSON.stringify({ roomCode }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    if (path.match(/^\/api\/rooms\/[A-Z0-9]+\/ws$/)) {
      const roomCode = path.split("/")[3];
      const user = await getUserFromRequest(request, env2.DB);
      if (!user) {
        return new Response("Unauthorized", { status: 401 });
      }
      const teamResult = await env2.DB.prepare(`
        SELECT m.* FROM team_slots ts
        JOIN monsters m ON ts.monster_id = m.id
        WHERE ts.user_id = ?
        ORDER BY ts.slot
      `).bind(user.id).all();
      const roomId = env2.BATTLE_ROOM.idFromName(roomCode);
      const room = env2.BATTLE_ROOM.get(roomId);
      const upgradeHeader = request.headers.get("Upgrade");
      if (upgradeHeader !== "websocket") {
        return new Response("Expected WebSocket", { status: 426 });
      }
      const newUrl = new URL(request.url);
      newUrl.pathname = "/connect";
      newUrl.searchParams.set("userId", user.id);
      newUrl.searchParams.set("username", user.username);
      newUrl.searchParams.set("team", JSON.stringify(teamResult.results));
      return room.fetch(new Request(newUrl.toString(), request));
    }
    if (path === "/api/battle/start" && request.method === "POST") {
      try {
        const engine = new BattleEngine();
        const playerTeam = engine.generateTeam(3);
        const cpuTeam = engine.generateTeam(3);
        const state = {
          phase: "selection",
          turn: 1,
          players: {
            player: { id: "player", name: "\u30D7\u30EC\u30A4\u30E4\u30FC", team: playerTeam, activeSlot: 0, ready: false },
            cpu: { id: "cpu", name: "CPU", team: cpuTeam, activeSlot: 0, ready: false }
          },
          events: [
            { type: "text", message: "\u30D0\u30C8\u30EB\u30B9\u30BF\u30FC\u30C8\uFF01" },
            { type: "switch", playerId: "player", playerName: "\u30D7\u30EC\u30A4\u30E4\u30FC", monsterName: playerTeam[0].nickname, monsterId: playerTeam[0].unique_id, newSlot: 0 },
            { type: "switch", playerId: "cpu", playerName: "CPU", monsterName: cpuTeam[0].nickname, monsterId: cpuTeam[0].unique_id, newSlot: 0 }
          ]
        };
        return new Response(JSON.stringify(createAPIResponse(state, "player", engine)), {
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
    }
    if (path === "/api/battle/choice" && request.method === "POST") {
      try {
        const body = await request.json();
        const { state: serialized, action } = body;
        const engine = new BattleEngine(serialized.seed);
        let state = engine.restoreState(serialized);
        state.players.player.action = action;
        state.players.player.ready = true;
        if (state.phase === "forced_switch" && state.forcedSwitchPlayer === "player") {
          if (action.type === "switch" && action.target !== void 0) {
            const newMon = state.players.player.team[action.target];
            if (newMon && newMon.hp_current > 0) {
              state.players.player.activeSlot = action.target;
              state.events = [{
                type: "switch",
                playerId: "player",
                playerName: "\u30D7\u30EC\u30A4\u30E4\u30FC",
                monsterName: newMon.nickname,
                monsterId: newMon.unique_id,
                newSlot: action.target
              }];
              state.phase = "selection";
              state.forcedSwitchPlayer = void 0;
              state.players.player.ready = false;
              state.players.cpu.ready = false;
              state.players.player.action = void 0;
              state.players.cpu.action = void 0;
            }
          }
          return new Response(JSON.stringify(createAPIResponse(state, "player", engine)), {
            headers: { "Content-Type": "application/json", ...corsHeaders }
          });
        }
        const cpuAction = engine.getAIChoice(state.players.cpu);
        state.players.cpu.action = cpuAction;
        state.players.cpu.ready = true;
        state = engine.executeTurn(state);
        if (state.phase === "forced_switch" && state.forcedSwitchPlayer === "cpu") {
          const cpuSwitchAction = engine.getAIChoice(state.players.cpu);
          if (cpuSwitchAction.type === "switch" && cpuSwitchAction.target !== void 0) {
            const newMon = state.players.cpu.team[cpuSwitchAction.target];
            if (newMon && newMon.hp_current > 0) {
              state.players.cpu.activeSlot = cpuSwitchAction.target;
              state.events.push({
                type: "switch",
                playerId: "cpu",
                playerName: "CPU",
                monsterName: newMon.nickname,
                monsterId: newMon.unique_id,
                newSlot: cpuSwitchAction.target
              });
              state.phase = "selection";
              state.forcedSwitchPlayer = void 0;
            }
          }
        }
        return new Response(JSON.stringify(createAPIResponse(state, "player", engine)), {
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
    }
    if (path === "/api/moves" && request.method === "GET") {
      const movesObj = {};
      for (const move of MOVE_TEMPLATES) {
        movesObj[move.id] = move;
      }
      return new Response(JSON.stringify({ moves: movesObj }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    if (path === "/health") {
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    return new Response("Not Found", { status: 404, headers: corsHeaders });
  }
};
function createAPIResponse(state, playerId, engine) {
  const player = state.players[playerId];
  const opponentId = Object.keys(state.players).find((id) => id !== playerId);
  const opponent = state.players[opponentId];
  return {
    serialized: engine.serializeState(state),
    events: state.events,
    playerTeam: player.team.map((mon, i) => ({
      unique_id: mon.unique_id,
      nickname: mon.nickname,
      type: mon.type,
      hp_current: mon.hp_current,
      hp_max: mon.hp_max,
      spriteUrl: mon.spriteUrl,
      moves: mon.moves.map((m, j) => ({
        id: m.id,
        name: m.name,
        type: m.type,
        power: m.power,
        pp: mon.movePP[j],
        maxPP: m.pp
      }))
    })),
    opponentTeam: opponent.team.map((mon) => ({
      unique_id: mon.unique_id,
      nickname: mon.nickname,
      type: mon.type,
      hp_current: mon.hp_current,
      hp_max: mon.hp_max,
      spriteUrl: mon.spriteUrl
    })),
    playerActive: player.activeSlot,
    opponentActive: opponent.activeSlot,
    phase: state.phase,
    turn: state.turn,
    winner: state.winner,
    forcedSwitch: state.forcedSwitchPlayer === playerId
  };
}
__name(createAPIResponse, "createAPIResponse");
var BattleRoom = class {
  static {
    __name(this, "BattleRoom");
  }
  constructor(state) {
    this.state = state;
    this.players = /* @__PURE__ */ new Map();
    this.hostId = null;
    this.battleEngine = null;
    this.battleState = null;
  }
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/init") {
      const body = await request.json();
      this.hostId = body.hostId;
      return new Response("OK");
    }
    if (url.pathname === "/connect") {
      const userId = url.searchParams.get("userId");
      const username = url.searchParams.get("username");
      const team = JSON.parse(url.searchParams.get("team") || "[]");
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      this.handleWebSocket(server, userId, username, team);
      return new Response(null, { status: 101, webSocket: client });
    }
    return new Response("Not Found", { status: 404 });
  }
  handleWebSocket(ws, userId, name, team) {
    ws.accept();
    this.players.set(userId, { ws, userId, name, team, ready: false });
    this.broadcastPlayerList();
    ws.addEventListener("message", async (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case "ready":
            const player = this.players.get(userId);
            if (player) player.ready = true;
            this.broadcastPlayerList();
            if (this.players.size === 2 && !this.battleState) {
              const allReady = Array.from(this.players.values()).every((p) => p.ready);
              if (allReady) {
                this.startBattle();
              }
            }
            break;
          case "action":
            this.handleBattleAction(userId, data.action);
            break;
        }
      } catch (err) {
        console.error("WebSocket error:", err);
      }
    });
    ws.addEventListener("close", () => {
      this.players.delete(userId);
      this.broadcastPlayerList();
      if (this.battleState) {
        this.battleState = null;
        this.battleEngine = null;
        this.broadcast({ type: "battle_end", winnerName: "Opponent Disconnected" });
      }
    });
  }
  broadcastPlayerList() {
    const playerList = Array.from(this.players.values()).map((p) => ({
      id: p.userId,
      name: p.name,
      ready: p.ready,
      isHost: p.userId === this.hostId
    }));
    this.broadcast({ type: "players", players: playerList });
  }
  broadcast(message) {
    const str = JSON.stringify(message);
    for (const player of this.players.values()) {
      try {
        player.ws.send(str);
      } catch {
      }
    }
  }
  sendToPlayer(userId, message) {
    const player = this.players.get(userId);
    if (player) {
      try {
        player.ws.send(JSON.stringify(message));
      } catch {
      }
    }
  }
  startBattle() {
    const players = Array.from(this.players.values());
    if (players.length !== 2) return;
    this.battleEngine = new BattleEngine();
    const p1Team = this.convertToBattleTeam(players[0].team);
    const p2Team = this.convertToBattleTeam(players[1].team);
    this.battleState = {
      phase: "selection",
      turn: 1,
      players: {
        [players[0].userId]: { id: players[0].userId, name: players[0].name, team: p1Team, activeSlot: 0, ready: false },
        [players[1].userId]: { id: players[1].userId, name: players[1].name, team: p2Team, activeSlot: 0, ready: false }
      },
      events: [
        { type: "text", message: "\u30D0\u30C8\u30EB\u30B9\u30BF\u30FC\u30C8\uFF01" },
        { type: "switch", playerId: players[0].userId, playerName: players[0].name, monsterName: p1Team[0].nickname, monsterId: p1Team[0].unique_id, newSlot: 0 },
        { type: "switch", playerId: players[1].userId, playerName: players[1].name, monsterName: p2Team[0].nickname, monsterId: p2Team[0].unique_id, newSlot: 0 }
      ]
    };
    this.sendBattleState();
  }
  convertToBattleTeam(monsters) {
    return monsters.map((m) => {
      const moves = [m.move1, m.move2, m.move3, m.move4].filter((id) => id).map((id) => MOVE_TEMPLATES.find((mt) => mt.id === id)).filter((mt) => mt !== void 0);
      return {
        unique_id: m.id,
        template_id: "custom",
        nickname: m.name,
        type: m.type,
        hp_current: m.hp,
        hp_max: m.hp,
        current_atk: m.atk,
        current_def: m.def,
        current_spa: m.spa ?? m.atk,
        // fallback to atk
        current_spd: m.spd ?? m.def,
        // fallback to def
        current_spe: m.spe ?? m.spd ?? 50,
        // fallback
        moves,
        movePP: moves.map((mv) => mv.pp),
        buffs: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, crit: 0, evade: 0 },
        spriteUrl: m.sprite_url || "https://play.pokemonshowdown.com/sprites/gen5ani/substitute.gif",
        ability: "unknown",
        item: ""
      };
    });
  }
  handleBattleAction(userId, action) {
    console.log(`handleBattleAction called: userId=${userId}, action=${JSON.stringify(action)}`);
    console.log(`battleState phase=${this.battleState?.phase}, forcedSwitchPlayer=${this.battleState?.forcedSwitchPlayer}`);
    if (!this.battleState || !this.battleEngine) return;
    const playerState = this.battleState.players[userId];
    console.log(`playerState found: ${playerState ? "yes" : "no"}, players keys: ${Object.keys(this.battleState.players).join(", ")}`);
    if (!playerState) return;
    if (this.battleState.forcedSwitchPlayer) {
      if (this.battleState.forcedSwitchPlayer !== userId) {
        console.log(`Ignoring action from ${userId} - waiting for ${this.battleState.forcedSwitchPlayer} to switch`);
        return;
      }
      console.log(`Processing forced switch for ${userId}`);
      if (action.type === "switch" && action.target !== void 0) {
        const newMon = playerState.team[action.target];
        console.log(`Switching to slot ${action.target}, newMon=${newMon?.nickname}, hp=${newMon?.hp_current}`);
        if (newMon && newMon.hp_current > 0) {
          playerState.activeSlot = action.target;
          this.battleState.events = [{
            type: "switch",
            playerId: userId,
            playerName: playerState.name,
            monsterName: newMon.nickname,
            monsterId: newMon.unique_id,
            newSlot: action.target
          }];
          this.battleState.phase = "selection";
          this.battleState.forcedSwitchPlayer = void 0;
          Object.values(this.battleState.players).forEach((p) => {
            p.ready = false;
            p.action = void 0;
          });
          console.log("Forced switch completed, sending battle state");
          this.sendBattleState();
        }
      }
      return;
    }
    playerState.action = action;
    playerState.ready = true;
    const allReady = Object.values(this.battleState.players).every((p) => p.ready);
    if (allReady) {
      this.battleState = this.battleEngine.executeTurn(this.battleState);
      this.sendBattleState();
    }
  }
  sendBattleState() {
    if (!this.battleState || !this.battleEngine) return;
    for (const userId of this.players.keys()) {
      const response = createAPIResponse(this.battleState, userId, this.battleEngine);
      this.sendToPlayer(userId, { type: "battle_update", data: response });
    }
  }
};

// ../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-nq13km/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// ../../.npm/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-nq13km/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  BattleRoom,
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker.js.map
