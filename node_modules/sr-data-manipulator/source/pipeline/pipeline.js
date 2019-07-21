const Pipeline = (adaptors) => {
    const pipeline = function (data) {
        this.__data = data;
        Object.freeze(this.__data);
    }
    pipeline.prototype.result = function () { return this.__data; };
    for(const adaptorName in adaptors) {
        pipeline.prototype[adaptorName] = function (proc) {
            const adaptor = adaptors[adaptorName];
            const result = Promise.resolve(this.__data).then($=>adaptor(proc, $));
            return new (Pipeline(adaptors))(result);
        };
    }
    return pipeline;
}

const Adaptor = require("./adaptor");
const Pipe = Pipeline(Adaptor);

module.exports = {
    Pipeline,
    Adaptor,
    Pipe,
};