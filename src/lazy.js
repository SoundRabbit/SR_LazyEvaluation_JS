const { Enum } = require("sr-data-manipulator");

const Mode = new Enum("FinalArgment", "FirstNeed");

const Lazy = (mode, func) => {
  const pf = (arg, ...args) => {
    if (!pf.chache.has(arg)) {
      let chache;
      if (func.length == 0 && mode.is(Mode.$FirstNeed)) {
        chache = func();
      } else if (func.length == 1 && mode.is(Mode.$FinalArgment)) {
        chache = func(arg);
      } else if (args.length == 0) {
        chache = Lazy(mode, func.bind(null, arg));
      } else {
        chache = Lazy(mode, func.bind(null, arg))(...args);
      }
      pf.chache.set(arg, chache);
    }
    return pf.chache.get(arg);
  };
  pf.chache = new Map();
  return pf;
};

const lazy = Lazy.bind(null, new Mode.FirstNeed());
const $lazy = Lazy.bind(null, new Mode.FinalArgment());

const Bind = (mode, func) => (arg, ...args) => {
  if (func.length == 0 && mode.is(Mode.$FirstNeed)) {
    return func();
  } else if (func.length == 1 && mode.is(Mode.$FinalArgment)) {
    return func(arg);
  } else if (args.length == 0) {
    return Bind(mode, func.bind(null, arg));
  } else {
    return Bind(mode, func.bind(null, arg))(...args);
  }
};

const bind = Bind.bind(null, new Mode.FirstNeed());
const $bind = Bind.bind(null, new Mode.FinalArgment());

module.exports = {
  lazy,
  $lazy,
  bind,
  $bind,
  Lazy,
  Bind,
  Mode,
  finalArgment: new Mode.FinalArgment(),
  firstNeed: new Mode.FirstNeed()
};
