$('.menu-icon').click(function() {
  $(this).toggleClass('active');
  $('.menu-list').toggleClass('open');
  $('.menu-signup').toggleClass('open');
  $('.menu-logo').removeClass('up');
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
    $('.menu-logo').addClass('up');
    $('.menu-list').removeClass('open');
    $('.menu-icon').removeClass('active');
    $('.menu-signup').removeClass('open');
  } else {
    if(st + $(window).height() < $(document).height()){
      $('.menu-logo').removeClass('up');
    }
  }
  lastScrollTop = st;
}