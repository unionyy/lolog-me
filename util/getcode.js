const champ = require('./champion.json').data;

var codes = {};
for(elem in champ) {
    codes[Number(champ[elem].key)] = elem;
}
console.log(codes);