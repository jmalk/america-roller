const states = ["al", "hi", "ca"];

const borders = {
    "al": [],
    "hi": [],
    "wa": ["or", "mt"],
    "or": ["wa", "ca"],
    "ca": [],
    "nv": [],
    "ut": [],
    "co": [],
    "nm": [],
    "tx": [],
    "az": [],
    "wy": [],
    "mt": [],
    "nd": [],
    "sd": [],
    "mn": [],
    "wi": [],
    "mi": [],
    "oh": [],
    "in": [],
    "wa": [],
    "wa": [],
    "wa": [],
    "wa": [],
    "wa": [],
    "wa": [],
    "wa": [],
    "wa": [],
    "wa": [],
    "wa": [],
    "wa": [],
    "wa": [],
    "wa": [],
    "wa": [],
    "wa": [],
    "wa": [],
    "wa": [],
    "ky": [],
    "tn": [],
    "wv": [],
    "va": [],
    "pa": [],
    "ny": [],
    "vt": [],
    "nh": [],
    "me": [],
    "ma": [],
    "ct": [],
    "ri": [],
    "de": [],
    "md": [],
    "nj": []
}

let values = {};
for (var i = 0; i < states.length, i++) {
    values[states[i]] = 0;
}

let guarded = [];

function validateNewValue(state, newValue) {
    // get borders
    // ignore any that are guarded
    // check what existing values they have
    // and that they're all max 1 away from newValue
    return true;
}