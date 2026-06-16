(function () {
  // DOMException
  if (typeof global.DOMException === 'undefined') {
    var DOMException = function DOMException(message, name) {
      this.message = message || '';
      this.name = name || 'DOMException';
    };
    DOMException.prototype = Object.create(Error.prototype);
    DOMException.prototype.constructor = DOMException;
    DOMException.default = DOMException;
    global.DOMException = DOMException;
  }

  // AbortController / AbortSignal
  if (typeof global.AbortController === 'undefined') {
    var AbortController = function AbortController() {
      var listeners = [];
      var signal = {
        aborted: false,
        reason: undefined,
        addEventListener: function (_, fn) { listeners.push(fn); },
        removeEventListener: function (_, fn) {
          listeners = listeners.filter(function (l) { return l !== fn; });
        },
        dispatchEvent: function () { return true; },
      };
      this.signal = signal;
      // Dùng biến closure `signal` thay vì `this.signal` để abort() vẫn đúng khi
      // bị gọi tách rời (vd: const a = c.abort; a()). Truyền event object có
      // `type: 'abort'` vì fetch/supabase đọc event.type trong listener.
      this.abort = function (reason) {
        if (signal.aborted) return;
        signal.aborted = true;
        signal.reason = reason !== undefined ? reason : new Error('Aborted');
        var event = { type: 'abort', target: signal };
        listeners.forEach(function (fn) {
          try { fn.call(signal, event); } catch (e) {}
        });
      };
    };
    global.AbortController = AbortController;
  }

  // Performance API stubs — RN 0.81.5 private/webapis/performance needs these globals
  if (typeof global.PerformanceEntry === 'undefined') {
    var PerformanceEntry = function PerformanceEntry(name, entryType, startTime, duration) {
      this.name = name || '';
      this.entryType = entryType || '';
      this.startTime = startTime || 0;
      this.duration = duration || 0;
    };
    PerformanceEntry.prototype.toJSON = function () {
      return {
        name: this.name,
        entryType: this.entryType,
        startTime: this.startTime,
        duration: this.duration,
      };
    };
    PerformanceEntry.default = PerformanceEntry;
    global.PerformanceEntry = PerformanceEntry;
  }

  if (typeof global.PerformanceMark === 'undefined') {
    var PerformanceMark = function PerformanceMark(name, options) {
      this.name = name || '';
      this.entryType = 'mark';
      this.startTime = (options && options.startTime) || 0;
      this.duration = 0;
      this.detail = (options && options.detail) || null;
    };
    PerformanceMark.prototype = Object.create(global.PerformanceEntry.prototype);
    PerformanceMark.prototype.constructor = PerformanceMark;
    PerformanceMark.default = PerformanceMark;
    global.PerformanceMark = PerformanceMark;
  }

  if (typeof global.PerformanceMeasure === 'undefined') {
    var PerformanceMeasure = function PerformanceMeasure(name, startTime, duration) {
      this.name = name || '';
      this.entryType = 'measure';
      this.startTime = startTime || 0;
      this.duration = duration || 0;
      this.detail = null;
    };
    PerformanceMeasure.prototype = Object.create(global.PerformanceEntry.prototype);
    PerformanceMeasure.prototype.constructor = PerformanceMeasure;
    PerformanceMeasure.default = PerformanceMeasure;
    global.PerformanceMeasure = PerformanceMeasure;
  }

  if (typeof global.PerformanceObserver === 'undefined') {
    var PerformanceObserver = function PerformanceObserver(callback) {
      this._callback = callback;
    };
    PerformanceObserver.prototype.observe = function () {};
    PerformanceObserver.prototype.disconnect = function () {};
    PerformanceObserver.prototype.takeRecords = function () { return []; };
    PerformanceObserver.supportedEntryTypes = [];
    PerformanceObserver.default = PerformanceObserver;
    global.PerformanceObserver = PerformanceObserver;
  }

  if (typeof global.PerformanceObserverEntryList === 'undefined') {
    var PerformanceObserverEntryList = function PerformanceObserverEntryList() {
      this._entries = [];
    };
    PerformanceObserverEntryList.prototype.getEntries = function () { return this._entries; };
    PerformanceObserverEntryList.prototype.getEntriesByType = function () { return []; };
    PerformanceObserverEntryList.prototype.getEntriesByName = function () { return []; };
    global.PerformanceObserverEntryList = PerformanceObserverEntryList;
  }

  // Performance instance
  if (typeof global.performance === 'undefined') {
    var _performanceStart = Date.now();
    global.performance = {
      now: function () { return Date.now() - _performanceStart; },
      mark: function () {},
      measure: function () {},
      clearMarks: function () {},
      clearMeasures: function () {},
      getEntries: function () { return []; },
      getEntriesByName: function () { return []; },
      getEntriesByType: function () { return []; },
      eventCounts: { size: 0 },
      timeOrigin: _performanceStart,
    };
  }
})();
