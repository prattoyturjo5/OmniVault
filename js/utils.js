/*
  File: utils.js
  Made by: [Member Name] | ID: [Student ID]
*/

window.Utils = {
  // Returns "June 10, 2025" from "2025-06-10"
  formatDate: function(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  },

  // Truncates string and adds "..." if over maxLength
  truncate: function(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  },

  // Returns CSS class string: "cs" -> "dept-cs" etc.
  getDeptClass: function(deptCode) {
    if (!deptCode) return '';
    return 'dept-' + deptCode.toLowerCase();
  },

  // Returns "AR" from "Anika Rahman"
  getInitials: function(fullName) {
    if (!fullName) return '';
    const names = fullName.trim().split(' ');
    // Handle titles gracefully (Dr., Prof., etc.)
    const cleanNames = names.filter(n => !n.includes('.') && n.length > 0);
    const targetNames = cleanNames.length > 0 ? cleanNames : names;
    
    if (targetNames.length === 1) return targetNames[0].charAt(0).toUpperCase();
    return (targetNames[0].charAt(0) + targetNames[targetNames.length - 1].charAt(0)).toUpperCase();
  },

  // Injects Bootstrap alert HTML into container, auto-dismisses after 3s
  // type: 'success' | 'error'
  showAlert: function(containerSelector, message, type) {
    const bsType = type === 'error' ? 'danger' : 'success';
    const alertHtml = `
      <div class="alert alert-${bsType} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    const $container = $(containerSelector);
    $container.html(alertHtml);
    
    // Auto dismiss after 3s
    setTimeout(() => {
      // Find the specific alert within this container
      const $alert = $container.find('.alert');
      if ($alert.length && typeof $alert.alert === 'function') {
        $alert.alert('close'); // Bootstrap native close function
      } else {
        $alert.remove(); // Fallback if Bootstrap JS is not active
      }
    }, 3000);
  },

  // Returns Date.now().toString()
  generateId: function() {
    return Date.now().toString();
  },

  // Returns boolean using regex
  isValidEmail: function(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Returns URL query param value
  getUrlParam: function(paramName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
  }
};
