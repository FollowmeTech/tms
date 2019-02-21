'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Tms = _interopDefault(require('@fmfe/tms.js'));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

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

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
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

var VueTms = function (_Tms2) {
    inherits(VueTms, _Tms2);

    function VueTms() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        classCallCheck(this, VueTms);

        var _this = possibleConstructorReturn(this, (VueTms.__proto__ || Object.getPrototypeOf(VueTms)).call(this));

        _this.onList = [];
        _this.subs = [];
        _this._run = false;
        _this.options = { isDebugLog: false };
        if (typeof options.isDebugLog === 'boolean') {
            _this.options.isDebugLog = options.isDebugLog;
        }
        if (!VueTms._Vue) {
            throw new Error('Please install with Vue.use(VueTms).');
        }
        return _this;
    }

    createClass(VueTms, [{
        key: 'run',
        value: function run() {
            if (this._run) return this;
            this._run = true;
            Object.defineProperty(this, 'subs', {
                enumerable: false
            });
            Object.defineProperty(this, 'onList', {
                enumerable: false
            });
            if (!VueTms._Vue) return this;
            VueTms._Vue.observable(this);
            this.observeTms(this, []);
            return this;
        }
    }, {
        key: 'observeTms',
        value: function observeTms(target, paths) {
            var _this2 = this;

            var observeTms = function observeTms(opts, paths) {
                Object.keys(opts).forEach(function (k) {
                    var item = opts[k];
                    if (item instanceof Tms) {
                        var onChage = function onChage(event) {
                            var position = '' + paths.concat([k, event.type]).join('.');
                            if (_this2.options.isDebugLog && console) {
                                console.log('position   ' + position + '(payload: ' + getType(event.payload) + ');', '\n\rpayload   ', _typeof(event.payload) === 'object' ? JSON.parse(JSON.stringify(event.payload)) : event.payload, '\n\rpayloads  ', JSON.parse(JSON.stringify(event.payloads)), '\n\rtarget    ', event.target, '\n\r---');
                            }
                            _this2.subs.forEach(function (fn) {
                                return fn(_extends({}, event, {
                                    position: position,
                                    time: Date.now()
                                }));
                            });
                        };
                        item.dep.addSub(onChage);
                        _this2.onList.push({
                            target: item,
                            onChage: onChage
                        });
                        observeTms(item, [].concat(toConsumableArray(paths), [k]));
                    }
                });
            };
            observeTms(target, paths);
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
            this.onList.forEach(function (item) {
                item.target.dep.removeSub(item.onChage);
            });
            this.onList.splice(0, this.onList.length);
            this.subs.splice(0, this.subs.length);
            return this;
        }
    }], [{
        key: 'install',
        value: function install(_Vue, _Tms) {
            VueTms._Vue = _Vue;
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
}(Tms);

module.exports = VueTms;
