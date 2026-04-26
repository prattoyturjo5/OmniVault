// file: js/auth.js
$(document).ready(async function() {
    // Determine current page
    const path = window.location.pathname;
    const isLoginPage = path.includes('login.html');
    const isAdminPage = path.includes('admin.html');

    // Admin Auth Check
    if (isAdminPage) {
        document.body.style.display = 'none';
        if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
            window.location.href = '../index.html';
        } else {
            document.body.style.display = 'flex';
        }
    }

    // Student Auth Check
    if (isLoginPage) {
        const studentUser = JSON.parse(sessionStorage.getItem('omnivault_user') || 'null');
        if (studentUser && studentUser.loggedIn) {
            window.location.href = 'dashboard.html';
        }
    }

    // Student Login Form Submission
    $('#studentLoginForm').on('submit', async function(e) {
        e.preventDefault();
        const email = $('#studentEmail').val().trim();
        const studentId = $('#studentId').val().trim();

        $('#loginError').addClass('d-none');
        $('#loginBtn').prop('disabled', true).text('Signing in...');

        try {
            // Check students table for a match
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('email', email)
                .eq('student_id', studentId)
                .maybeSingle();

            if (error) {
                throw error;
            }

            if (!data) {
                throw new Error('No student account matches that Email and Student ID.');
            }

            // Success, create session and redirect to dashboard
            const userData = {
                name: data.name,
                email: data.email,
                studentId: data.student_id,
                department: data.department || 'CSE',
                loggedIn: true
            };
            sessionStorage.setItem('omnivault_user', JSON.stringify(userData));
            
            window.location.href = 'dashboard.html';
        } catch(err) {
            $('#loginError').removeClass('d-none').text(err.message || 'Invalid login details.');
            $('#loginBtn').prop('disabled', false).text('Sign In');
        }
    });

    // Admin Logout Handling (from Admin Panel)
    $('#btnLogout').on('click', function(e) {
        e.preventDefault();
        sessionStorage.removeItem('adminLoggedIn');
        window.location.href = '../index.html';
    });
});
