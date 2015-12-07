$('.menu-icon').click(function() {
  $(this).toggleClass('active');
  $('.menu-list').toggleClass('open');
});

// hide on scroll down
var scrolled;
var lastScrollTop = 100;
var delta = 100;
var navbarHeight = $('header').outerHeight();

$(window).scroll(function(event){
  scrolled = true;
});

setInterval(function(){
  if (scrolled) {
    hasScrolled();
    scrolled = false;
  }
}, 250);

function hasScrolled(){
  var st = $(this).scrollTop();

  // scroll more than delta
  if(Math.abs(lastScrollTop - st) <= delta)
  return;
  // if they scrolled down and are past the navbar, add class .up.
  if (st > lastScrollTop && st > navbarHeight){
    $('.menu-list').removeClass('open');
    $('.menu-icon').removeClass('active');
  } else {}
  lastScrollTop = st;
}




// // hide on scroll down
// var scrolled;
// var lastScrollTop = 0;
// var delta = 5;
// var navbarHeight = $('header').outerHeight();

// $(window).scroll(function(event){
//   scrolled = true;
// });

// setInterval(function(){
//   if (scrolled) {
//     hasScrolled();
//     scrolled = false;
//   }
// }, 250);

// function hasScrolled(){
//   var st = $(this).scrollTop();

//   // scroll more than delta
//   if(Math.abs(lastScrollTop - st) <= delta)
//   return;
//   // if they scrolled down and are past the navbar, add class .up.
//   if (st > lastScrollTop && st > navbarHeight){
//     $('header').addClass('up');
//     $('.menu-list').removeClass('open');
//     $('.menu-icon').removeClass('active');
//   } else {
//     if(st + $(window).height() < $(document).height()){
//       $('header').removeClass('up');
//     }
//   }
//   lastScrollTop = st;
// }