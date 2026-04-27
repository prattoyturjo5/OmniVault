/*
  File: utils.js
  Made by: [Member Name] | ID: [Student ID]
*/

window.Utils = {
  // Returns "June 10" from "2025-06-10"
  formatDate: function (dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });
  },

  // Truncates string and adds "..." if over maxLength
  truncate: function (text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  },

  // Returns CSS class string: "cs" -> "dept-cs" etc.
  getDeptClass: function (deptCode) {
    if (!deptCode) return '';
    return 'dept-' + deptCode.toLowerCase();
  },

  // Returns "AR" from "Anika Rahman"
  getInitials: function (fullName) {
    if (!fullName) return '';
    const names = fullName.trim().split(' ');
    // Handle titles gracefully (Dr., Prof., etc.)
    const cleanNames = names.filter(n => !n.includes('.') && n.length > 0);
    const targetNames = cleanNames.length > 0 ? cleanNames : names;

    if (targetNames.length === 1) return targetNames[0].charAt(0).toUpperCase();
    return (targetNames[0].charAt(0) + targetNames[targetNames.length - 1].charAt(0)).toUpperCase();
  },

  // Global Toast Notification System (replaces inline alerts)
  showAlert: function (containerSelector, message, type) {
    let $toastContainer = $('#custom-toast-container');
    if ($toastContainer.length === 0) {
      $('body').append('<div id="custom-toast-container" class="toast-container position-fixed top-0 start-50 translate-middle-x p-4 mt-2" style="z-index: 9999;"></div>');
      $toastContainer = $('#custom-toast-container');
    }

    let bsType = 'dark';
    let iconSvg = '';
    
    if (type === 'error' || type === 'danger') {
        bsType = 'danger';
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else if (type === 'success') {
        bsType = 'success';
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else {
        bsType = 'primary';
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    const toastId = 'toast-' + Date.now();
    
    // Injecting customized Toast (modern styling)
    const toastHtml = `
      <div id="${toastId}" class="toast align-items-center text-white bg-${bsType} border-0 shadow-lg mb-3" role="alert" aria-live="assertive" aria-atomic="true" style="border-radius: 10px; font-family: 'Inter', sans-serif;">
        <div class="d-flex">
          <div class="toast-body fw-medium fs-6 d-flex align-items-center py-3 px-4">
            ${iconSvg}
            ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-3 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;

    $toastContainer.append(toastHtml);
    const $toastEl = $('#' + toastId);
    
    // Initialize bootstrap toast
    if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
        const newToast = new bootstrap.Toast($toastEl[0], { delay: 3500 });
        newToast.show();
        
        $toastEl.on('hidden.bs.toast', function () {
            $(this).remove();
        });
    } else {
        // Fallback if bootstrap JS is missing
        $toastEl.show();
        setTimeout(() => $toastEl.fadeOut(400, function() { $(this).remove(); }), 3500);
    }
  },

  // Returns Date.now().toString()
  generateId: function () {
    return Date.now().toString();
  },

  // Returns boolean using regex
  isValidEmail: function (email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Returns URL query param value
  getUrlParam: function (paramName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
  },

  // Checks if a student is logged in (via sessionStorage or Supabase)
  isLoggedIn: async function () {
    // 1. Check legacy/custom session
    const studentUser = JSON.parse(sessionStorage.getItem('omnivault_user') || 'null');
    if (studentUser && studentUser.loggedIn) return true;

    // 2. Check Supabase Auth session if available
    if (window.supabase && window.supabase.auth) {
      try {
        const { data } = await window.supabase.auth.getSession();
        if (data && data.session) return true;
      } catch (e) { console.error("Auth check failed:", e); }
    }

    return false;
  },

  // Redirect to login if not authenticated
  requireAuth: async function (redirectUrl) {
    const defaultLogin = window.location.pathname.includes('/pages/') ? './login.html' : './pages/login.html';
    const finalRedirect = redirectUrl || defaultLogin;
    
    const loggedIn = await this.isLoggedIn();
    if (!loggedIn) {
      window.location.href = finalRedirect;
      return false;
    }
    return true;
  }
};
