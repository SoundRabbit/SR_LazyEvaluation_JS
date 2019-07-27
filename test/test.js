const assert = require("assert");
const now = require("performance-now");
const { lazy, $lazy } = require("../src/lazy");

describe("#lazy", () => {
    describe("function", () => {
        it("should be 2", () => {
            const lzFunc = lazy((a, b) => a + b);
            assert.equal(lzFunc(1, 1)(), 2);
        });

        it("should be 3", () => {
            const lzFunc = lazy((a, b, c) => a + b + c);
            assert.equal(lzFunc(1)(1)(1)(), 3);
        });

        it("should be end a few seconds", () => {
            const fib = lazy(n => {
                if (n == 0) {
                    return 1;
                }
                if (n == 1) {
                    return 1;
                }
                return fib(n - 1)() + fib(n - 2)();
            });
            const start = now();
            for (let i = 0; i < 1000; i++) {
                fib(i)();
            }
            const performance = now() - start;
            assert(performance < 1000);
        });
    });
    describe("array", () => {
        it("should be [1, 2, 3]", () => {
            const ary = lazy([1, 2, 3]);
            assert.deepEqual(ary.$toArray(), [1, 2, 3]);
        });
        it("should be [2, 3, 4]", () => {
            const ary = lazy([1, 2, 3]).map($lazy(x => x + 1));
            assert.deepEqual(ary.$toArray(), [2, 3, 4]);
        });
        it("should be [3, 4, 5]", () => {
            const ary = lazy([1, 2, 3])
                .map($lazy(x => x + 1))
                .map($lazy(x => x + 1));
            assert.deepEqual(ary.$toArray(), [3, 4, 5]);
        });
        it("should be success", () => {
            const ary = lazy([1, 2, 3]);
            ary.map(() => { assert.fail() });
            assert.ok("lazy map does not call callback function.");
        });
        it("should be [1, 2, 3]", () => {
            const ary = lazy([1, 2, 3, 4, 5, 6])
                .filter($lazy(x => x < 4));
            assert.deepEqual(ary.$toArray(), [1, 2, 3]);
        });
        it("should be [1, 2, 3, 4, 5, 6]", () => {
            const ary = lazy([1, 2, [3, 4, [5]], 6])
                .flatten();
            assert.deepEqual(ary.$toArray(), [1, 2, 3, 4, 5, 6]);
        });
        it("should be faster", () => {
            const ary = Array(100)
                .fill(0)
                .map((_, i) => i);
            const lazyAry = lazy(ary);
            const cb = x => x + 1;

            const lazyMap_start = now();
            for (let i = 0; i < 1000000; i++) {
                lazyAry.map(cb).$toArray();
            }
            const lazyMap_performance = now() - lazyMap_start;

            const map_start = now();
            for (let i = 0; i < 1000000; i++) {
                ary.map(cb);
            }
            const map_performance = now() - map_start;

            assert(lazyMap_performance * 5 < map_performance);
        });
    });
});

describe("#$lazy", () => {
    it("should be 2", () => {
        const lzFunc = $lazy((a, b) => a + b);
        assert.equal(lzFunc(1, 1), 2);
    });

    it("should be 3", () => {
        const lzFunc = $lazy((a, b, c) => a + b + c);
        assert.equal(lzFunc(1)(1)(1), 3);
    });

    it("should be end a few seconds", () => {
        const fib = $lazy(n => {
            if (n == 0) {
                return 1;
            }
            if (n == 1) {
                return 1;
            }
            return fib(n - 1) + fib(n - 2);
        });
        const start = now();
        for (let i = 0; i < 1000; i++) {
            fib(i);
        }
        const performance = now() - start;
        assert(performance < 1000);
    });
});
