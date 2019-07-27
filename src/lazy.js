const fnc = require("./function");
const ary = require("./array");
const val = require("./value");

const { Mode } = require("./mode");

const Lazy = (mode, value) => {
    if (typeof value == "function") {
        return fnc.Lazy(mode, value);
    } else if (Array.isArray(value)) {
        return ary.Lazy(mode, value);
    } else {
        null;
    }
};

const lazy = Lazy.bind(null, new Mode.FirstNeed());
const $lazy = Lazy.bind(null, new Mode.FinalArgument());

module.exports = {
    Lazy,
    lazy,
    $lazy,
    Mode
};
