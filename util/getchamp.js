const champ = require('./champion.json').data;

var codes = {};
for(elem in champ) {
    codes[Number(champ[elem].key)] = elem;
}
//console.log(codes);

var names = {};
for(elem in champ) {
    names[champ[elem].id] = champ[elem].name;
}
console.log(JSON.stringify(names));
