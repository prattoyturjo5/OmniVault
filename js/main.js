/*
  File: main.js
  Made by: [Member Name] | ID: [Student ID]
*/

$(document).ready(function () {
  // 1. NAVBAR SCROLL EFFECT
  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 50) {
      $('.navbar-omnivault').addClass('scrolled');
    } else {
      $('.navbar-omnivault').removeClass('scrolled');
    }
  });

  // 2. MOBILE MENU
  // Use delegation because navbar is loaded dynamically
  $(document).on('click', '.navbar-toggler', function () {
    $('body').toggleClass('menu-open');
  });

  // Close button (×) inside overlay → closes menu
  $(document).on('click', '.mobile-menu-close', function () {
    $('body').removeClass('menu-open');
  });

  // Nav link click inside overlay → closes menu
  $(document).on('click', '.navbar-omnivault .nav-link', function () {
    $('body').removeClass('menu-open');
  });

  // 3. ACTIVE NAV LINK
  // (Now handled inside js/navbar-loader.js to ensure it runs after injection)

  // 4. FOOTER YEAR
  $(".footer-year").text(new Date().getFullYear());

  // 5. SMOOTH SCROLL
  $('a[href^="#"]').on('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId !== '#') {
      const target = $(targetId);
      if (target.length) {
        e.preventDefault();
        $('html, body').stop().animate({
          scrollTop: target.offset().top - 80 // offset for fixed header
        }, 500);
      }
    }
  });
});
