function SetTooltips() {
    ItemTooltipster();
    SpellTooltipster();
}

function ItemTooltipster() {
    var itemUri = RIOTCDNURI+VERSION.latest+'/img/item/';
    fetch(RIOTCDNURI+VERSION.latest+'/data/'+LANG.lang+'/item.json')
        .then(response => response.json(), err => {console.log(err);})
        .then(data => {
            var $target = $('.item').not('tooltipstered');
            $target.each((i, elem) => {
                var itemId = $(elem).attr('item-id');
                if($('#item-tooltips').find(`#item-${itemId}`).length === 0) {
                    var itemHtml = '';
                    var itemData = data.data[itemId];
                    itemHtml += `<div id="item-${itemId}" class="item-tooltip">`;
                    if(itemData) {
                        itemHtml += `
                            <div class="item-header">
                                <img class="item-icon" src="${itemUri+itemId}.png" />
                                <span class="item-name">${itemData.name}</span>
                                <div>
                                    <img class="icon-inline item-gold-icon" src="/images/icon/mask-icon-gold.png" />
                                    <span class="item-gold">${itemData.gold.total}</span>
                                </div>
                            </div>
                            <div class="item-description">${itemData.description}</div>
                        `;
                    }
                    itemHtml += '</div>';
                    $('#item-tooltips').append(itemHtml);
                }
                $(elem).tooltipster({
                    theme: 'tooltipster-borderless',
                    distance: 1,
                    delay: 100,
                    content: $(`#item-${itemId}`),
                    maxWidth: 300,
                    animationDuration: 0,
                    side: 'top'
                });
            });

            
        });
}

function SpellTooltipster() {
    var spellUri = RIOTCDNURI+VERSION.latest+'/img/spell/';
    fetch(RIOTCDNURI+VERSION.latest+'/data/'+LANG.lang+'/summoner.json')
        .then(response => response.json(), err => {console.log(err);})
        .then(data => {
            var $target = $('.spell').not('tooltipstered');
            $target.each((i, elem) => {
                console.log(2)
                var spellName = $(elem).attr('spell-name');
                if($('#spell-tooltips').find(`#spell-${spellName}`).length === 0) {
                    var spellHtml = '';
                    var spellData = data.data[spellName];
                    spellHtml += `<div id="spell-${spellName}" class="spell-tooltip">`;
                    console.log(data.data, spellName)
                    if(spellData) {
                        spellHtml += `
                            <img class="spell-icon" src="${spellUri+spellName}.png" />
                            <span class="spell-name">${spellData.name}</span>
                            <div class="spell-description">${spellData.description}</div>
                        `;
                    }
                    spellHtml += '</div>';
                    $('#spell-tooltips').append(spellHtml);
                    console.log(1)
                }

                $(elem).tooltipster({
                    theme: 'tooltipster-borderless',
                    distance: 1,
                    delay: 100,
                    content: $(`#spell-${spellName}`),
                    maxWidth: 300,
                    animationDuration: 0,
                    side: 'top'
                });
            });

            
        });
}