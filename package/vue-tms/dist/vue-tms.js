(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VueTms = factory());
}(this, (function () { 'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  var getType = function getType(payload) {
      return Object.prototype.toString.call(payload).replace(/^(.*?) |]$/g, '').toLowerCase();
  };

  var VueTms = function () {
      function VueTms() {
          var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          classCallCheck(this, VueTms);

          this.onList = [];
          this.subs = [];
          this.options = { isDebugLog: false };
          if (typeof options.isDebugLog === 'boolean') {
              this.options.isDebugLog = options.isDebugLog;
          }
          if (!VueTms._Vue || !VueTms._Tms) {
              throw new Error('Please install with Vue.use(VueTms, Tms).');
          }
          this.app = null;
      }

      createClass(VueTms, [{
          key: 'run',
          value: function run() {
              var _this = this;

              Object.defineProperty(this, 'app', {
                  enumerable: false
              });
              Object.defineProperty(this, 'subs', {
                  enumerable: false
              });
              Object.defineProperty(this, 'onList', {
                  enumerable: false
              });
              if (!VueTms._Vue) return this;
              this.app = new VueTms._Vue({
                  data: this
              });
              var observeTms = function observeTms(opts, paths) {
                  Object.keys(opts).forEach(function (k) {
                      var item = opts[k];
                      if (VueTms._Tms && item instanceof VueTms._Tms) {
                          var onChage = function onChage(event) {
                              var position = '' + paths.concat([k, event.type]).join('.');
                              if (_this.options.isDebugLog && console) {
                                  console.log('position   ' + position + '(payload: ' + getType(event.payload) + ');', '\n\rpayload   ', JSON.parse(JSON.stringify(event.payload)), '\n\rpayloads  ', JSON.parse(JSON.stringify(event.payloads)), '\n\rtarget    ', event.target, '\n\r---');
                              }
                              _this.subs.forEach(function (fn) {
                                  return fn(_extends({}, event, { position: position, time: Date.now() }));
                              });
                          };
                          item.dep.addSub(onChage);
                          _this.onList.push({
                              target: item,
                              onChage: onChage
                          });
                          observeTms(item, [].concat(toConsumableArray(paths), [k]));
                      }
                  });
              };
              observeTms(this, []);
              return this;
          }
      }, {
          key: 'subscribe',
          value: function subscribe(fn) {
              this.subs.push(fn);
              return this;
          }
      }, {
          key: 'unsubscribe',
          value: function unsubscribe(fn) {
              var index = this.subs.indexOf(fn);
              this.subs.splice(index, 1);
              return this;
          }
      }, {
          key: 'destroy',
          value: function destroy() {
              if (this.app) {
                  this.app.$destroy();
                  this.onList.forEach(function (item) {
                      item.target.dep.removeSub(item.onChage);
                  });
              }
              this.onList.splice(0, this.onList.length);
              this.subs.splice(0, this.subs.length);
              return this;
          }
      }], [{
          key: 'install',
          value: function install(_Vue, _Tms) {
              VueTms._Vue = _Vue;
              VueTms._Tms = _Tms;
              Object.defineProperty(VueTms._Vue.prototype, '$store', {
                  get: function get$$1() {
                      return this.$root._store;
                  }
              });
              Object.defineProperty(VueTms._Vue.prototype, '_store', {
                  get: function get$$1() {
                      return this.$options.store;
                  }
              });
              VueTms._Vue.mixin({
                  destroyed: function destroyed() {
                      if (this.$options.store) {
                          this.$options.store.destroy();
                      }
                  }
              });
          }
      }]);
      return VueTms;
  }();

  return VueTms;

})));
