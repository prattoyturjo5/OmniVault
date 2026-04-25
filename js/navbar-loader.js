/**
 * navbar-loader.js
 * Dynamically injects the unified Omnivault/OmniVault navbar across pages.
 */

$(document).ready(function() {
    const isRoot = !window.location.pathname.includes('/pages/');

    const links = {
        home: isRoot ? 'index.html' : '../index.html',
        about: isRoot ? 'pages/about.html' : './about.html',
        courses: isRoot ? 'pages/courses.html' : './courses.html',
        faculty: isRoot ? 'pages/faculty.html' : './faculty.html',
        blog: isRoot ? 'pages/blog.html' : './blog.html',
        noticeboard: isRoot ? 'pages/noticeboard.html' : './noticeboard.html',
        events: isRoot ? 'pages/events.html' : './events.html',
        contact: isRoot ? 'pages/contact.html' : './contact.html',
        login: isRoot ? 'pages/login.html' : './login.html',
        register: isRoot ? 'pages/register.html' : './register.html',
    };

    const navbarHtml = `
    <!-- ========== NAVBAR ========== -->
    <nav class="navbar navbar-omnivault navbar-expand-lg fixed-top">
      <div class="container">
        <a class="navbar-brand logo" href="${links.home}">
            <span class="logo-dot" style="width: 10px; height: 10px; background: var(--color-accent); border-radius: 50%; display: inline-block;"></span> OmniVault
        </a>
        
        <button class="navbar-toggler border-0" type="button" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item"><a class="nav-link" href="${links.home}">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="${links.about}">About</a></li>
            <li class="nav-item"><a class="nav-link" href="${links.courses}">Courses</a></li>
            <li class="nav-item"><a class="nav-link" href="${links.faculty}">Faculty</a></li>
            <li class="nav-item"><a class="nav-link" href="${links.blog}">Blog</a></li>
            <li class="nav-item"><a class="nav-link" href="${links.noticeboard}">Notice Board</a></li>
            <li class="nav-item"><a class="nav-link" href="${links.events}">Events</a></li>
            <li class="nav-item"><a class="nav-link" href="${links.contact}">Contact</a></li>
          </ul>
        </div>
        
        <div class="d-none d-lg-flex">
          <a class="btn btn-ghost ms-2" href="${links.login}">Login</a>
          <a class="btn btn-primary-custom ms-2" href="${links.register}">Get Started</a>
        </div>
      </div>
    </nav>

    <!-- Mobile Overlay Menu -->
    <div class="mobile-menu-overlay" style="display: none; position: fixed; inset: 0; background: rgba(53, 88, 114, 0.98); z-index: 1050;">
      <button class="mobile-menu-close btn text-white fs-1 position-absolute top-0 end-0 m-3" style="background: none; border: none; line-height: 1;">&times;</button>
      <div class="mobile-menu-content d-flex flex-column align-items-center justify-content-center h-100 text-center">
        <a class="nav-link text-white fs-4 my-2" href="${links.home}">Home</a>
        <a class="nav-link text-white fs-4 my-2" href="${links.about}">About</a>
        <a class="nav-link text-white fs-4 my-2" href="${links.courses}">Courses</a>
        <a class="nav-link text-white fs-4 my-2" href="${links.faculty}">Faculty</a>
        <a class="nav-link text-white fs-4 my-2" href="${links.blog}">Blog</a>
        <a class="nav-link text-white fs-4 my-2" href="${links.noticeboard}">Notice Board</a>
        <a class="nav-link text-white fs-4 my-2" href="${links.events}">Events</a>
        <a class="nav-link text-white fs-4 my-2" href="${links.contact}">Contact</a>
        <div class="mt-4 d-flex flex-column gap-3 w-50 mx-auto">
          <a class="btn btn-ghost text-white border-white" href="${links.login}">Login</a>
          <a class="btn btn-primary-custom" href="${links.register}">Get Started</a>
        </div>
      </div>
    </div>
    <style>
      body.menu-open .mobile-menu-overlay { display: block !important; }
      body.menu-open { overflow: hidden; }
    </style>
    `;

    $('#navbar-placeholder').html(navbarHtml);

    // Re-run active link logic from main.js if needed or handle it here
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    $('.navbar-omnivault .nav-link').removeClass('active');
    $('.navbar-omnivault .nav-link').each(function() {
        const linkHref = $(this).attr('href');
        if (!linkHref) return;
        const linkFile = linkHref.split('/').pop() || 'index.html';
        if (currentPath === linkFile) {
            $(this).addClass('active');
        }
    });
});
