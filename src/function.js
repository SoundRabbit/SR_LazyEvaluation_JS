const { match } = require("sr-data-manipulator");
const { Mode } = require("./mode");

const cahceOnFinalArgument = (mode, func, arg, ...args) => {
    if (func.length == 1) {
        return func(arg);
    } else if (args.length == 0) {
        return Lazy(mode, func.bind(null, arg));
    } else {
        return Lazy(mode, func.bind(null, arg))(...args);
    }
};

const cahceOnFirstNeed = (mode, func, arg, ...args) => {
    if (func.length == 0) {
        return func();
    } else if (args.length == 0) {
        return Lazy(mode, func.bind(null, arg));
    } else {
        return Lazy(mode, func.bind(null, arg))(...args);
    }
};

const Lazy = (mode, func) => {
    const pf = (arg, ...args) => {
        if (!pf.cache.has(arg)) {
            const cache = match(mode).with({
                [Mode.$FinalArgument]: () =>
                    cahceOnFinalArgument(mode, func, arg, ...args),
                [Mode.$FirstNeed]: () =>
                    cahceOnFirstNeed(mode, func, arg, ...args)
            });
            pf.cache.set(arg, cache);
        }
        return pf.cache.get(arg);
    };
    pf.cache = new Map();
    return pf;
};

const lazy = Lazy.bind(null, new Mode.FirstNeed());
const $lazy = Lazy.bind(null, new Mode.FinalArgument());

module.exports = {
    Lazy,
    lazy,
    $lazy
};
