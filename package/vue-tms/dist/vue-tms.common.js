'use strict';

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
        classCallCheck(this, VueTms);

        this.onList = [];
        if (!VueTms._Vue || !VueTms._Tms) {
            throw new Error('Please install with Vue.use(VueTms, Tms).');
        }
        this.app = null;
    }

    createClass(VueTms, [{
        key: 'observe',
        value: function observe() {
            var _this = this;

            Object.defineProperty(this, 'app', {
                enumerable: false
            });
            Object.defineProperty(this, 'onList', {
                enumerable: false
            });
            if (!VueTms._Vue) return;
            this.app = new VueTms._Vue({
                data: this
            });
            var observeTms = function observeTms(opts, paths) {
                Object.keys(opts).forEach(function (k) {
                    var item = opts[k];
                    if (VueTms._Tms && item instanceof VueTms._Tms && process.env.NODE_ENV !== 'production') {
                        var onChage = function onChage(event) {
                            console.log('type       ' + paths.concat([k]).join('/') + '.' + event.type + '(payload: ' + getType(event.payload) + ');', '\n\rpayload   ', event.payload, '\n\rpayloads   ', event.payloads, '\n\rtarget    ', event.target, '\n\r---');
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
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            if (this.app) {
                this.app.$destroy();
                this.onList.forEach(function (item) {
                    item.target.dep.removeSub(item.onChage);
                });
                this.onList.splice(0, this.onList.length);
            }
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
        }
    }]);
    return VueTms;
}();

module.exports = VueTms;
