/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-var */
var textWrapper = document.querySelector('.ml1 .letters');
textWrapper.innerHTML = textWrapper.textContent.replace(
  /\S/g,
  "<span class='letter'>$&</span>"
);

anime
  .timeline({ loop: false })
  .add({
    targets: '.ml1 .letter',
    scale: [0.3, 1],
    opacity: [0, 1],
    translateZ: 0,
    easing: 'easeOutExpo',
    duration: 600,
    delay: (el, i) => 70 * (i + 1),
  })
  .add({
    targets: '.ml1 .line',
    scaleX: [0, 1],
    opacity: [0.5, 1],
    easing: 'easeOutExpo',
    duration: 700,
    offset: '-=875',
    delay: (el, i, l) => 80 * (l - i),
  });
$('.btn_nav').click(function() {
  // animate content
  $('.page__style').addClass('animate_content');
  $('.page__description')
    .fadeOut(100)
    .delay(1400)
    .fadeIn();

  setTimeout(function() {
    $('.page__style').removeClass('animate_content');
  }, 1500);

  // remove fadeIn class after 1500ms

  setTimeout(function() {
    $('.page__style').removeClass('fadeIn');
  }, 500);
});

// on click show page after 1500ms
$('.home_link').click(function() {
  setTimeout(function() {
    $('.home').addClass('fadeIn');
  }, 500);
});

$('.html_link').click(function() {
  setTimeout(function() {
    $('.html').addClass('fadeIn');
  }, 500);
});

$('.css_link').click(function() {
  setTimeout(function() {
    $('.css').addClass('fadeIn');
  }, 500);
});

$('.javascript_link').click(function() {
  setTimeout(function() {
    $('.javascript').addClass('fadeIn');
  }, 500);
});

$('.jquery_link').click(function() {
  setTimeout(function() {
    $('.jquery').addClass('fadeIn');
  }, 500);
});

$('.node_link').click(function() {
  setTimeout(function() {
    $('.node').addClass('fadeIn');
  }, 500);
});

// circle loader
var myVar;

function myFunction() {
  myVar = setTimeout(showPage, 5000);
}
function showPage() {
  document.getElementById('loader').style.display = 'none';
  document.getElementById('myDiv').style.display = 'block';
}
