// file: js/auth.js
$(document).ready(async function() {
    // Determine current page
    const path = window.location.pathname;
    const isLoginPage = path.includes('login.html');
    const isAdminPage = path.includes('admin.html');

    // Hide admin body until auth is verified to prevent flickering
    if (isAdminPage) {
        document.body.style.display = 'none';
    }

    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (isAdminPage) {
            if (!session) {
                // Not authenticated, redirect to login
                window.location.href = 'login.html';
            } else {
                // Authenticated, show page
                document.body.style.display = 'flex'; // It's a flex-column min-vh-100 body
            }
        }

        if (isLoginPage) {
            if (session) {
                // Already logged in, go to admin
                window.location.href = 'admin.html';
            }
        }
    } catch(err) {
        console.error("Auth check failed: ", err);
    }

    // Auth Form Submission
    $('#loginForm').on('submit', async function(e) {
        e.preventDefault();
        const email = $('#email').val().trim();
        const password = $('#password').val().trim();

        $('#loginError').addClass('d-none');
        $('#loginBtn').prop('disabled', true).text('Signing in...');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                throw error;
            }

            // Success, redirect to admin
            window.location.href = 'admin.html';
        } catch(err) {
            $('#loginError').removeClass('d-none').text(err.message || 'Invalid login credentials.');
            $('#loginBtn').prop('disabled', false).text('Sign In');
        }
    });

    // Logout Handling
    $('#btnLogout').on('click', async function(e) {
        e.preventDefault();
        try {
            await supabase.auth.signOut();
            window.location.href = '../index.html';
        } catch(err) {
            console.error("Logout failed: ", err);
        }
    });
});
