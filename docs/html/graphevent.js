
var tableElements = document.querySelectorAll(".day");

tableElements.forEach(function(element) {
    element.addEventListener("mouseover", function() {
        element.setAttribute('style', "stroke:#006600; fill: #00cc00");
        console.log('1');
    });
});

// This handler will be executed only once when the cursor
// moves over the unordered list
// test.addEventListener("mouseenter", function( event ) {
//   // highlight the mouseenter target
//   event.target.style.color = "purple";

//   // reset the color after a short delay
//   setTimeout(function() {
//     event.target.style.color = "";
//   }, 500);
// }, false);

// // This handler will be executed every time the cursor
// // is moved over a different list item
// test.addEventListener("mouseover", function( event ) {
//   // highlight the mouseover target
//   event.target.style.color = "orange";

//   // reset the color after a short delay
//   setTimeout(function() {
//     event.target.style.color = "";
//   }, 500);
// }, false);