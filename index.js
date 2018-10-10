var list = [];

function popTask(gen) {
    var index = list.indexOf(gen);
    if (!~index) {
        return;
    }
    list.splice(index, 1);
}

function realCallback(fn, obj) {
    var obj = obj || global;
    return function() {
        var arg = [...arguments];
        fn.work = function(fn) {
            if (!fn.gen) {
                fn.gen = fn.apply(obj, arg);
            } else {
                popTask(fn.gen);
            }

            ret = fn.gen.next();
            if (ret.done) {
                return;
            } else {
                list.push(fn);
                if (ret.value && ret.value.Coroutine) {
                    if (ret.value.work) {
                        setImmediate(ret.value.work, ret.value);
                    } else {
                        ret.value();
                    }
                } else {
                    var newFn = list.shift();
                    setImmediate(newFn.work, newFn);
                }
            }
        };
        setImmediate(fn.work, fn);
    };
}

function create(fn, obj) {
    if (fn.constructor.name != "GeneratorFunction") {
        fn = function*(params) {
            fn.apply(global, params);
            yield;
        };
    }
    fn = realCallback(fn, obj);
    Object.defineProperty(fn, "Coroutine", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: true
    });
    return fn;
}

// function destroy(fn) {
//     Co.destroy(fn.yield);
// }

module.exports = create;
