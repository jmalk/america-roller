import {Dice, DiceColor} from "./dice.js"

const states = [
    "ak", "hi", "wa", "id", "or",
    "ca", "nv", "ut", "az", "mt",
    "nd", "sd", "mn", "ia", "wi",
    "il", "mi", "in", "wy", "ne",
    "co", "ks", "nm", "ok", "tx",
    "mo", "ky", "tn", "ar", "la",
    "ms", "al", "fl", "me", "nh",
    "vt", "ny", "ma", "ct", "ri",
    "nj", "oh", "pa", "de", "wv",
    "md", "va", "nc", "sc", "ga"
];

const stateColors = {
    "orange": ["ak", "wa", "or", "id", "ca", "hi", "nv", "ut", "az"],
    "blue": ["mt", "nd", "sd", "mn", "ia", "wi", "il", "mi", "in"],
    "green": ["wy", "ne", "co", "ks", "nm", "ok", "tx"],
    "yellow": ["mo", "ky", "tn", "ar", "la", "ms", "al", "fl"],
    "purple": ["me", "vt", "nh", "ny", "ma", "ct", "ri", "nj"],
    "red": ["oh", "pa", "de", "wv", "va", "md", "nc", "ga", "sc"]
}

const borders = {
    "ak": [],
    "hi": [],
    "wa": ["or", "id"],
    "id": ["wa", "or", "nv", "ut", "mt", "wy"],
    "or": ["wa", "id", "ca", "nv"],
    "ca": ["or", "nv", "az"],
    "nv": ["or", "id", "ca", "az", "ut"],
    "ut": ["id", "nv", "az", "wy", "co", "nm"],
    "az": ["ca", "nv", "ut", "nm"],
    "mt": ["id", "wy", "nd", "sd"],
    "nd": ["mt", "sd", "mn"],
    "sd": ["mt", "nd", "mn", "ia", "ne", "wy"],
    "mn": ["nd", "sd", "ia", "wi"],
    "ia": ["sd", "mn", "wi", "il", "mo", "ne"],
    "wi": ["mn", "ia", "il", "mi"],
    "il": ["ia", "wi", "in", "ky", "mo"],
    "mi": ["wi", "in", "oh"],
    "in": ["mi", "il", "oh", "ky"],
    "wy": ["id", "mt", "sd", "ne", "co", "ut"],
    "ne": ["wy", "sd", "ia", "mo", "ks", "co"],
    "co": ["ut", "wy", "ne", "ks", "ok", "nm"],
    "ks": ["co", "ne", "mo", "ok"],
    "nm": ["az", "co", "ok", "tx"],
    "ok": ["co", "ks", "mo", "ar", "tx", "nm"],
    "tx": ["nm", "ok", "ar", "la"],
    "mo": ["ia", "il", "ne", "ks", "ok", "ky", "tn", "ar"],
    "ky": ["il", "in", "oh", "wv", "va", "tn", "mo"],
    "tn": ["va", "nc", "ga", "ky", "mo", "ar", "ms", "al"],
    "ar": ["ok", "tx", "mo", "tn", "ms", "la"],
    "la": ["tx", "ar", "ms"],
    "ms": ["la", "ar", "tn", "al"],
    "al": ["ms", "tn", "ga", "fl"],
    "fl": ["al", "ga"],
    "me": ["nh"],
    "nh": ["me", "vt", "ma"],
    "vt": ["nh", "ny", "ma"],
    "ny": ["vt", "ma", "ct", "nj", "pa"],
    "ma": ["vt", "nh", "ny", "ct", "ri"],
    "ct": ["ny", "ma", "ri", "nj"],
    "ri": ["ma", "ct"],
    "nj": ["ny", "ct", "ri", "pa", "de"],
    "oh": ["mi", "in", "ky", "pa", "wv"],
    "pa": ["ny", "nj", "oh", "wv", "va", "md"],
    "de": ["nj", "pa", "md"],
    "wv": ["oh", "pa", "va", "ky"],
    "md": ["de", "pa", "va"],
    "va": ["ky", "tn", "nc", "wv", "md", "pa"],
    "nc": ["va", "tn", "ga", "sc"],
    "sc": ["nc", "ga"],
    "ga": ["fl", "al", "tn", "nc", "sc"]
}

let values = {};
for (var i = 0; i < states.length; i++) {
    values[states[i]] = 0;
};

let guarded = [];

export function validateNewValue(state: string, activeDie: Dice, colorChangeActive) {
    // check there's not already a number in this state
    if (values[state] !== 0) {
        return false;
    }

    // check the colors are compatible
    if (!colorChangeActive && (activeDie.color != "colorless" && stateColors[activeDie.color].indexOf(state) == -1)) {
        return false;
    }

    // get bordering states of selected states
    let stateBorders = borders[state];
    
    // ignore any that are guarded
    let unguarded = stateBorders.filter(state => guarded.indexOf(state) == -1);
    
    // check what existing values they have
    // this also filters out states with -1 meaning an X is there
    let nonZeroBorderValues = unguarded.map(state => values[state]).filter(value => value > 0);

    // and that they're all max 1 away from newValue
    let isValid = true;
    if (nonZeroBorderValues.length > 0) {
        isValid = nonZeroBorderValues.every(val => Math.abs(activeDie.number - val) <= 1);
    }
    return isValid;
}

export function submitStateValue(state: string, activeDie: Dice, placeX: boolean = false, colorChangeActive: boolean = false) {
    if (placeX) {
        values[state] = -1;
        return true;
    } else if (validateNewValue(state, activeDie, colorChangeActive)) {
        values[state] = activeDie.number;
        return true;
    } else {
        return false;
    }
}

export function canPlaceDie(activeDie: Dice) {
    for (var i = 0; i < states.length; i++) {
        if (validateNewValue(states[i], activeDie)) {
            return true;
        }
    };
    return false;
}