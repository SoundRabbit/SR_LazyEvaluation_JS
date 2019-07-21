const {maybeFunction} = require("./utility");

/**
 * create the structure when tag have been matched
 * @param {Symbol} tag 
 * @param {any} val 
 * @param {any} res 
 * @param {expectMethodGen} mthodGen 
 */
const expectThenMatch = (tag, val, res, mthodGen) => ({
    expect: mthodGen(tag, val, res, true),
    catch: _ => res.value
});

/**
 * create the structure when tag have been unmatched
 * @param {Symbol} tag 
 * @param {any} val 
 * @param {any} res 
 * @param {expectMethodGen} mthodGen expect-method generator
 */
const expectThenUnmatch = (tag, val, res, mthodGen) => ({
    expect: mthodGen(tag, val, res, false),
    catch: proc => maybeFunction(proc)(val)
});

/**
 * create expect method
 * @param {Symbol} tag symbol of tag
 * @param {any} val the value associate to each enumerator
 * @param {any} res the result of then or catch function
 * @param {bool} processed wheather then callback had already callded or not
 * @returns {function(Symbol) -> {then:function(function(any) -> any) -> {expect:expectMethodGen(Symbol, any, Option), ctach: function(function(any)->any)->any}}}
 */
const expectMethodGen = (tag, val, res, processed) =>
    tagId => ({
        then: proc =>
            tagId === tag && !processed ?
                expectThenMatch(tag, val, $Some(maybeFunction(proc)(val)), expectMethodGen) :
            
            processed ?
                expectThenMatch(tag, val, res, expectMethodGen) :
                
                expectThenUnmatch(tag, val, res, expectMethodGen)
    });

/**
 * create enumeration
 * @param  {...any} tags tag name
 */
const Enum = function (...tags) {

    const enumerationSymbol = Symbol(this);
    let tagNumCounter = 0;

    for(const tag of tags) {
        const stringifyTag = String(tag);
        if(stringifyTag[0] == '$') {
            throw $Err(`Tag name : "${stringifyTag}" has unpermitted token. Tag name should begin with a character EXCEPT '$'.`);
        }
        const symbol = Symbol(stringifyTag);
        this[stringifyTag] = function(val){
            this.value = val;
            this.expect = expectMethodGen(symbol, val, null, false);
            Object.freeze(this);
        };
        this[stringifyTag].prototype.name = stringifyTag;
        this[stringifyTag].prototype.tag = symbol;
        this[stringifyTag].prototype.is = $ => $ == symbol;
        this[stringifyTag].prototype.isEnumeratorOf = $ => $ == enumerationSymbol;
        this[stringifyTag].prototype.index = tagNumCounter;
        this['$'+stringifyTag] = symbol;

        tagNumCounter++;
    }

    this["$$"] = enumerationSymbol;

    Object.freeze(this);
}

/**
 * match
 * @param {{tag: Symbol, value:any}} enumeratable 
 */
const match = enumeratable => ({
    with: candidate => {
        const tag = enumeratable.tag;
        if(tag in candidate) {return candidate[tag](enumeratable.value)}
        if('_' in candidate) {return candidate['_'](enumeratable.value)}
        throw "no candidate was matched.";
    }
})


const Option = new Enum("Some", "None");
const Result = new Enum("Ok", "Err");


/**
 * Wrap Promise result to Result
 * @param {Promise} promise promise function
 * @returns {Result}
 */
const resultOf = async promise => {
    try {
        const result = await promise;
        return new Result.Ok(result);
    } catch(err) {
        return new Result.Err(err);
    }
};

const $Some = val => new Option.Some(val);
const $None = val => new Option.None(val);
const $Ok = val => new Result.Ok(val);
const $Err = val => new Result.Err(val);

module.exports = {Enum, match, Option, Result, resultOf, $Some, $None, $Ok, $Err};