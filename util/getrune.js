const rune = require('./runesReforged.json');

var codes = {};
for(elem of rune) {
    codes[elem.id] = elem.icon;

    for(eelem of elem.slots[0].runes) {
        codes[eelem.id] = eelem.icon;
    }
}
console.log(codes);

