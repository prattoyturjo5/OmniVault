// file: js/auth.js
$(document).ready(async function() {
    // Determine current page
    const path = window.location.pathname;
    const isLoginPage = path.includes('login.html');
    const isAdminPage = path.includes('admin.html');


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
        const password = $('#studentPassword').val().trim();

        $('#loginBtn').prop('disabled', true).text('Signing in...');

        try {
            // Check students table for a match
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('email', email)
                .eq('password', password)
                .maybeSingle();

            if (error) {
                throw error;
            }

            if (!data) {
                throw new Error('Wrong Email or Password.');
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
            if (window.Utils) {
                window.Utils.showAlert('', err.message || 'Invalid login details.', 'danger');
            } else {
                alert(err.message || 'Invalid login details.');
            }
            $('#loginBtn').prop('disabled', false).text('Sign In');
        }
    });

});
