"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IdlePromise = {
  install: function install(Vue) {
    window.requestIdleCallback = window.requestIdleCallback || function (handler) {
      var startTime = Date.now();
      return setTimeout(function () {
        handler({
          didTimeout: false,
          timeRemaining: function timeRemaining() {
            return Math.max(0, 50.0 - (Date.now() - startTime));
          }
        });
      }, 1);
    };

    window.cancelIdleCallback = window.cancelIdleCallback || function (id) {
      clearTimeout(id);
    };

    Vue.prototype.$onIdle = function (payload) {
      return new _promise2.default(function (resolve) {
        window.requestIdleCallback(function () {
          return resolve(payload());
        });
      });
    };

    Vue.prototype.$onIdleQueue = function (payloadQueue) {
      return new _promise2.default(function (resolve) {
        var results = [];
        var queueIterator = payloadQueue.flat().values();
        var currentPayload = queueIterator.next().value;
        var queueProccessor = function queueProccessor(deadline) {
          while (deadline.timeRemaining() > 0 && currentPayload) {
            results.push(currentPayload());
            currentPayload = queueIterator.next().value;
          }
          if (currentPayload) {
            window.requestIdleCallback(function (recursiveDeadline) {
              queueProccessor(recursiveDeadline);
            });
          } else {
            resolve(results);
          }
        };
        window.requestIdleCallback(function (deadline) {
          queueProccessor(deadline);
        });
      });
    };
  }
};

exports.default = IdlePromise;