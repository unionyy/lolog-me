const spell = require('./spell.json').data;

var codes = {};
for(elem in spell) {
    codes[Number(spell[elem].key)] = elem;
}
console.log(codes);

var names = {};
for(elem in spell) {
    names[spell[elem].id] = spell[elem].name;
}
console.log(JSON.stringify(names));
