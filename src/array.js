const { lazy, $lazy } = require("./function");

const Lazy = (_, array) => {
    const ary = Array.isArray(array) ? array.concat() : array;
    const lazyArray = {
        length: () => ary.length,
        map: callback => Lazy(null, lazyMap(callback, ary)),
        filter: callback => Lazy(null, lazyFilter(callback, ary)),
        flatten: () => Lazy(null, lazyFlatten(ary)),
        $take: (index) => $lazyTake(index, ary),
        $toArray: lazyToArray(ary)
    };
    return lazyArray;
};

const lazyMap = lazy((cb, ary) =>
    Array.isArray(ary) ? ary.map(cb) : ary().map(cb)
);
const lazyFilter = lazy((cb, ary) =>
    Array.isArray(ary) ? ary.filter(cb) : ary().filter(cb)
);
const lazyFlatten = lazy(ary =>
    Array.isArray(ary) ? flatten(ary) : ary().flat()
);
const $lazyTake = $lazy((index, ary) =>
    Array.isArray(ary) ? ary[index] : ary()[index]
);
const lazyToArray = lazy(ary =>
    Array.isArray(ary) ? ary.concat() : ary().concat()
);

const flatten = ary => {
    if (typeof ary.flat == "function") {
        return ary.flat();
    } else {
        const res = [];
        for (const val of ary) {
            if (Array.isArray(val)) {
                const flattenVal = flatten(val);
                for (const fvval of flattenVal) {
                    res.push(fvval);
                }
            } else {
                res.push(val);
            }
        }
        return res;
    }
}

module.exports = {
    Lazy
};
