function ItemTooltipster() {

    var itemUri = RIOTCDNURI+VERSION.latest+'/img/item/';
    fetch(RIOTCDNURI+VERSION.latest+'/data/'+LANG.lang+'/item.json')
        .then(response => response.json(), err => {_container.html('<span class="match-fail">Try Again</span>');})
        .then(data => {
            var $target = $('.item').not('tooltipstered');
            $target.each((i, elem) => {
                var itemId = $(elem).attr('item-id');
                var itemHtml = '';
                if($('#item-tooltips').find(`#item-${itemId}`).length === 0) {
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