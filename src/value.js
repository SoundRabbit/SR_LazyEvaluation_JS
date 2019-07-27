const { match } = require("sr-data-manipulator");
const { Mode } = require("./mode");

const Lazy = (mode, val) =>
    match(mode).with({
        [Mode.$FinalArgument]: val,
        [Mode.$FirstNeed]: () => val
    });

module.exports = {
    Lazy
};
