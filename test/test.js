const assert = require("assert");
const { lazy, $lazy, bind, $bind } = require("../src/lazy");

describe("#lazy", () => {
  it("should be 2", () => {
    const lzFunc = lazy((a, b) => a + b);
    assert.equal(lzFunc(1, 1)(), 2);
  });

  it("should be 3", () => {
    const lzFunc = lazy((a, b, c) => a + b + c);
    assert.equal(lzFunc(1)(1)(1)(), 3);
  });

  it("should be 6", () => {
    let counter = 0;
    const fib = lazy(n => {
      counter++;
      if (n == 0) {
        return 1;
      }
      if (n == 1) {
        return 1;
      }
      return fib(n - 1)() + fib(n - 2)();
    });
    fib(5)();
    assert.equal(counter, 1 + 1 + 1 + 1 + 1 + 1);
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

  it("should be 6", () => {
    let counter = 0;
    const fib = $lazy(n => {
      counter++;
      if (n == 0) {
        return 1;
      }
      if (n == 1) {
        return 1;
      }
      return fib(n - 1) + fib(n - 2);
    });
    fib(5);
    assert.equal(counter, 1 + 1 + 1 + 1 + 1 + 1);
  });
});

describe("#bind", () => {
  it("should be 2", () => {
    const lzFunc = bind((a, b) => a + b);
    assert.equal(lzFunc(1, 1)(), 2);
  });

  it("should be 3", () => {
    const lzFunc = bind((a, b, c) => a + b + c);
    assert.equal(lzFunc(1)(1)(1)(), 3);
  });

  it("should be 15", () => {
    let counter = 0;
    const fib = bind(n => {
      counter++;
      if (n == 0) {
        return 1;
      }
      if (n == 1) {
        return 1;
      }
      return fib(n - 1)() + fib(n - 2)();
    });
    fib(5)();
    assert.equal(counter, 1 + 1 + 2 + 3 + 5 + 3);
  });
});

describe("#$bind", () => {
  it("should be 2", () => {
    const lzFunc = $bind((a, b) => a + b);
    assert.equal(lzFunc(1, 1), 2);
  });

  it("should be 3", () => {
    const lzFunc = $bind((a, b, c) => a + b + c);
    assert.equal(lzFunc(1)(1)(1), 3);
  });

  it("should be 15", () => {
    let counter = 0;
    const fib = $bind(n => {
      counter++;
      if (n == 0) {
        return 1;
      }
      if (n == 1) {
        return 1;
      }
      return fib(n - 1) + fib(n - 2);
    });
    fib(5);
    assert.equal(counter, 1 + 1 + 2 + 3 + 5 + 3);
  });
});
