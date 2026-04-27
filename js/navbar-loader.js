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

    const studentUser = JSON.parse(sessionStorage.getItem('omnivault_user') || 'null');
    const isStudentLoggedIn = studentUser && studentUser.loggedIn;
    const isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';

    let authButtons = '';
    
    if (isAdminLoggedIn) {
        authButtons = `
          <a class="btn btn-ghost ms-2" href="${isRoot ? 'pages/admin.html' : './admin.html'}">Admin Panel</a>
          <button class="btn btn-primary-custom ms-2" id="btnAdminLogout">Admin Logout</button>`;
    } else if (isStudentLoggedIn) {
        authButtons = `
          <a class="btn btn-ghost ms-2" href="${isRoot ? 'pages/dashboard.html' : './dashboard.html'}">Dashboard</a>
          <button class="btn btn-primary-custom ms-2" id="btnStudentLogout">Logout</button>`;
    } else {
        authButtons = `
          <a class="btn btn-ghost ms-2" href="${links.login}">Login</a>
          <a class="btn btn-primary-custom ms-2" href="${links.register}">Get Started</a>`;
    }

    const navbarHtml = `
    <!-- ========== NAVBAR ========== -->
    <nav class="navbar navbar-omnivault navbar-expand-lg fixed-top">
      <div class="container">
        <a class="navbar-brand logo" href="${links.home}">
            <span class="logo-dot" style="width: 10px; height: 10px; background: #fff; border-radius: 50%; display: inline-block; box-shadow: 0 0 10px rgba(255,255,255,0.5);"></span> OmniVault
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
          ${authButtons}
        </div>
      </div>
    </nav>

    <!-- Mobile Overlay Menu -->
    <div class="mobile-menu-overlay d-flex flex-column">
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
        <div class="mt-4 d-flex flex-column gap-3 w-75 mx-auto">
          ${authButtons}
        </div>
      </div>
    </div>
    <style>
      .mobile-menu-overlay {
        position: fixed;
        inset: 0;
        background: rgba(53, 88, 114, 0.98);
        z-index: 1050;
        opacity: 0;
        visibility: hidden;
        transform: translateX(100%);
        transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
      }
      body.menu-open .mobile-menu-overlay { 
        opacity: 1; 
        visibility: visible; 
        transform: translateX(0); 
      }
      body.menu-open { overflow: hidden; }
      
      /* Ensure the hamburger icon is highly visible */
      .navbar-toggler-icon {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 1%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e") !important;
      }
      .navbar-toggler {
        border-color: rgba(255,255,255,0.3) !important;
        padding: 4px 8px;
      }
      .navbar-toggler:focus {
        box-shadow: 0 0 0 0.15rem rgba(255, 255, 255, 0.25) !important;
      }
    </style>
    `;

    $('#navbar-placeholder').html(navbarHtml);

    // Logout Handler for Students
    $('#btnStudentLogout, .btnStudentLogout').on('click', function() {
        sessionStorage.removeItem('omnivault_user');
        window.location.href = links.home;
    });

    // Logout Handler for Admins
    $(document).on('click', '#btnAdminLogout, .btnAdminLogout', function() {
        sessionStorage.removeItem('adminLoggedIn');
        window.location.href = links.home;
    });

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
