var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

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

var Dep = function Dep() {
    var _this = this;

    classCallCheck(this, Dep);

    this.subs = [];
    this.addSub = function (fn) {
        _this.subs.push(fn);
    };
    this.removeSub = function (fn) {
        var index = _this.subs.indexOf(fn);
        _this.subs.splice(index, 1);
    };
    this.notify = function (params) {
        _this.subs.forEach(function (fn) {
            return fn(params);
        });
    };
    this.destroy = function () {
        _this.subs.splice(0, _this.subs.length);
    };
};

var getPrototypes = function getPrototypes(obj, target) {
    var prototypes = [];
    var current = obj;
    while (current !== target) {
        current = Object.getPrototypeOf(current);
        prototypes.push(current);
    }
    return prototypes;
};
var getOwnPropertyDescriptors = function getOwnPropertyDescriptors(obj) {
    var descriptors = {};
    var names = Object.getOwnPropertyNames(obj);
    names.forEach(function (k) {
        descriptors[k] = Object.getOwnPropertyDescriptor(obj, k);
    });
    return descriptors;
};
var getDescriptors = function getDescriptors(prototypes) {
    var descriptors = {};
    var i = prototypes.length;
    while (i--) {
        var prototype = prototypes[i];
        _extends(descriptors, getOwnPropertyDescriptors(prototype));
    }
    return descriptors;
};
var observe = function observe(target, targetPrototype, dispatch) {
    var descriptors = getDescriptors(getPrototypes(target, targetPrototype));
    Object.keys(descriptors).forEach(function (type) {
        var descriptor = descriptors[type];
        if (typeof descriptor !== 'undefined' && /^\$/.test(type) && typeof descriptor.value === 'function') {
            Object.defineProperty(target, type, _extends({}, descriptor, {
                value: function value() {
                    for (var _len = arguments.length, payloads = Array(_len), _key = 0; _key < _len; _key++) {
                        payloads[_key] = arguments[_key];
                    }

                    var value = descriptor.value.apply(target, payloads);
                    dispatch.apply(undefined, [type].concat(payloads));
                    return value;
                }
            }));
            return;
        }
    });
};

var dep = new Dep();

var Tms = function Tms() {
    var _this = this;

    classCallCheck(this, Tms);

    this.dep = new Dep();
    observe(this, Tms.prototype, function (type) {
        for (var _len = arguments.length, payloads = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            payloads[_key - 1] = arguments[_key];
        }

        _this.dep.notify({
            type: type,
            payload: payloads[0],
            payloads: payloads,
            target: _this
        });
        Tms.dep.notify({
            type: type,
            payload: payloads[0],
            payloads: payloads,
            target: _this
        });
    });
    Object.defineProperty(this, 'dep', {
        enumerable: false
    });
};

Tms.dep = dep;
Tms.subscribe = dep.addSub;
Tms.unsubscribe = dep.removeSub;

export default Tms;
