const rune = require('./runesReforgedKR.json');

var codes = {};
for(elem of rune) {
    codes[elem.id] = {'name': elem.name};

    for(eelem of elem.slots[0].runes) {
        codes[eelem.id] = {'name': eelem.name, 'description': eelem.longDesc};
    }
}
console.log(JSON.stringify(codes));
