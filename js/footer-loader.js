/**
 * footer-loader.js
 * Dynamically injects the unified Omnivault/OmniVault footer across pages.
 */

$(document).ready(function () {
  const isRoot = !window.location.pathname.includes('/pages/');

  const links = {
    home: isRoot ? 'index.html' : '../index.html',
    about: isRoot ? 'pages/about.html' : './about.html',
    courses: isRoot ? 'pages/courses.html' : './courses.html',
    faculty: isRoot ? 'pages/faculty.html' : './faculty.html',
    blog: isRoot ? 'pages/blog.html' : './blog.html',
    noticeboard: isRoot ? 'pages/noticeboard.html' : './noticeboard.html',
    events: isRoot ? 'pages/events.html' : './events.html',
    faq: isRoot ? 'pages/faq.html' : './faq.html',
    contact: isRoot ? 'pages/contact.html' : './contact.html',
    login: isRoot ? 'pages/login.html' : './login.html',
    register: isRoot ? 'pages/register.html' : './register.html',
    dashboard: isRoot ? 'pages/dashboard.html' : './dashboard.html',
    admin: isRoot ? 'pages/admin.html' : './admin.html',
  };

  const footerHtml = `
    <!-- ========== FOOTER (DYNAMIC) ========== -->
    <footer class="footer-omnivault mt-auto pt-5">
      <div class="container">
        <div class="footer-grid row">
          <!-- Col 1: Brand & Socials -->
          <div class="mb-4">
            <h4 class="logo mb-3 d-flex align-items-center gap-2">
                <span class="logo-dot" style="width: 10px; height: 10px; background: var(--color-accent); border-radius: 50%; display: inline-block;"></span> OmniVault
            </h4>
            <p class="text-secondary mb-4 pe-lg-4">Exclusively for Computer Science excellence since inception.</p>
            <div class="social-links d-flex gap-3">
              <a href="#" class="text-secondary hover-primary"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
              <a href="#" class="text-secondary hover-primary"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg></a>
              <a href="#" class="text-secondary hover-primary"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>
              <a href="#" class="text-secondary hover-primary"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
            </div>
          </div>
          
          <!-- Col 2: Nested Links -->
          <div class="mb-4">
            <div class="row">
              <div class="col-6">
                <h6 class="mb-3 text-dark">Quick Links</h6>
                <ul class="list-unstyled text-secondary">
                  <li class="mb-2"><a href="${links.home}" class="text-secondary text-decoration-none hover-primary">Home</a></li>
                  <li class="mb-2"><a href="${links.courses}" class="text-secondary text-decoration-none hover-primary">Courses</a></li>
                  <li class="mb-2"><a href="${links.faculty}" class="text-secondary text-decoration-none hover-primary">Faculty</a></li>
                  <li class="mb-2"><a href="${links.blog}" class="text-secondary text-decoration-none hover-primary">Blog</a></li>
                  <li class="mb-2"><a href="${links.noticeboard}" class="text-secondary text-decoration-none hover-primary">Notice Board</a></li>
                  <li class="mb-2"><a href="${links.events}" class="text-secondary text-decoration-none hover-primary">Events</a></li>
                  <li class="mb-2"><a href="${links.faq}" class="text-secondary text-decoration-none hover-primary">FAQ</a></li>
                  <li class="mb-2"><a href="${links.contact}" class="text-secondary text-decoration-none hover-primary">Contact</a></li>
                </ul>
              </div>
              <div class="col-6">
                <h6 class="mb-3 text-dark">Account</h6>
                <ul class="list-unstyled text-secondary">
                  <li class="mb-2"><a href="${links.login}" class="text-secondary text-decoration-none hover-primary">Student Login</a></li>
                  <li class="mb-2"><a href="${links.register}" class="text-secondary text-decoration-none hover-primary">Create Account</a></li>
                  <li class="mb-2"><a href="${links.dashboard}" class="text-secondary text-decoration-none hover-primary">Student Dashboard</a></li>
                  <li class="mb-2"><a href="#" id="admin-panel-link" data-admin-url="${links.admin}" class="text-secondary text-decoration-none hover-primary d-flex align-items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    Administrative Access
                  </a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <!-- Col 3: Contact Info -->
          <div class="mb-4">
            <h6 class="mb-3 text-dark">Contact</h6>
            <ul class="list-unstyled text-secondary d-flex flex-column gap-3">
              <li class="d-flex align-items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                Premier University, Chattagram, Bangladesh
              </li>
              <li class="d-flex align-items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                support@omnivault.edu
              </li>
              <li class="d-flex align-items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                +880 1234 567890
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom mt-3">
        <div class="container py-3 d-flex justify-content-between align-items-center flex-wrap">
          <div class="fs-6 opacity-75">© OmniVault. All rights reserved.</div>
          <div class="fs-6 mt-2 mt-sm-0 d-flex gap-3">
            <a href="#" class="text-white text-decoration-none hover-primary">Privacy Policy</a>
            <span>·</span>
            <a href="#" class="text-white text-decoration-none hover-primary">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
    
    <!-- Admin Login Modal (Professional Refresh) -->
    <div class="modal fade" id="adminLoginModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg" style="border-radius: 16px; overflow: hidden;">
          <div class="modal-header bg-dark text-white p-4 border-0">
            <div class="d-flex align-items-center gap-3">
              <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 12px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div>
                <h5 class="modal-title fw-bold mb-0">Authority Portal</h5>
                <p class="small opacity-75 mb-0">Administrative Access Only</p>
              </div>
            </div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4 bg-light">
            <div id="admin-login-error" class="alert alert-danger d-none border-0 shadow-sm small mb-4 py-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
               Unauthorized access attempt recorded. Please check credentials.
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold text-uppercase text-secondary" style="letter-spacing: 0.5px;">Authority ID</label>
              <input type="text" id="admin-username" class="form-control form-control-lg border-0 shadow-sm" placeholder="Enter username" style="border-radius: 10px; font-size: 15px;">
            </div>
            <div class="mb-4">
              <label class="form-label small fw-bold text-uppercase text-secondary" style="letter-spacing: 0.5px;">Security Key</label>
              <input type="password" id="admin-password" class="form-control form-control-lg border-0 shadow-sm" placeholder="••••••••" style="border-radius: 10px; font-size: 15px;">
            </div>
            <button type="button" class="btn btn-dark w-100 py-3 fw-bold shadow-sm" id="admin-login-btn" style="border-radius: 10px; transition: all 0.3s ease;">
              Verify and Access
            </button>
          </div>
          <div class="modal-footer justify-content-center bg-white border-0 pb-4 pt-0">
             <p class="xsmall text-muted mb-0">Confidentiality: Unauthorized access is prohibited by OmniVault Security Protocol.</p>
          </div>
        </div>
      </div>
    </div>
    `;


  $('#footer-placeholder').html(footerHtml);

  // Admin Panel Login Logic
  if (!localStorage.getItem('adminCreds')) {
      localStorage.setItem('adminCreds', JSON.stringify({ username: 'Omnivaltauthority', password: 'courseauthority' }));
  }

  $('#admin-panel-link').on('click', function(e) {
      e.preventDefault();
      const adminUrl = $(this).attr('data-admin-url');
      if (sessionStorage.getItem('adminLoggedIn') === 'true') {
          window.location.href = adminUrl;
      } else {
          $('#admin-login-error').addClass('d-none');
          $('#admin-username').val('');
          $('#admin-password').val('');
          $('#adminLoginModal').modal('show');
          
          $('#admin-login-btn').off('click').on('click', function() {
              const creds = JSON.parse(localStorage.getItem('adminCreds'));
              if ($('#admin-username').val() === creds.username && $('#admin-password').val() === creds.password) {
                  sessionStorage.setItem('adminLoggedIn', 'true');
                  $('#adminLoginModal').modal('hide');
                  window.location.href = adminUrl;
              } else {
                  $('#admin-login-error').removeClass('d-none');
              }
          });

          $('#admin-username, #admin-password').off('keypress').on('keypress', function(e) {
              if (e.which === 13) {
                  $('#admin-login-btn').click();
              }
          });
      }
  });
});
