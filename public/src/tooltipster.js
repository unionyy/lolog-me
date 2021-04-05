$(document).ready(function() {
    $('.day').tooltipster({
        theme: 'tooltipster-borderless',
        plugins: ['follower'],
        anchor: 'bottom-center',
        offset: [0, 10],
        arrow: true,
        animationDuration: 0,
        delay: 100
    });
});