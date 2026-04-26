// file: js/validation.js

$(document).ready(function () {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // ----------------------------------------------------
    // ENROLLMENT FORM (Supabase Sync)
    // ----------------------------------------------------
    $('#enrollForm').on('submit', async function (e) {
        e.preventDefault();
        let isValid = true;

        const name = $('#enrollName').val().trim();
        const studentId = $('#enrollStudentId').val().trim();
        const email = $('#enrollEmail').val().trim();

        $('.invalid-feedback').hide();
        $('.form-control').removeClass('is-invalid');

        if (!name) { $('#enrollName').addClass('is-invalid'); $('#enrollNameErr').show(); isValid = false; }
        if (!studentId) { $('#enrollStudentId').addClass('is-invalid'); $('#enrollStudentIdErr').show(); isValid = false; }
        if (!email || !emailRegex.test(email)) { $('#enrollEmail').addClass('is-invalid'); $('#enrollEmailErr').show(); isValid = false; }

        if (isValid && window.enrollmentContext) {
            const { courseId, courseTitle } = window.enrollmentContext;

            try {
                // Check if already enrolled in this specific course
                const { data: existing } = await supabase
                    .from('course_enrollments')
                    .select('id')
                    .eq('course_id', courseId)
                    .eq('student_id', studentId)
                    .maybeSingle();

                if (existing) {
                    $('#enrollStudentId').addClass('is-invalid');
                    $('#enrollStudentIdErr').text('Already enrolled in this course.').show();
                    return;
                }

                // Insert into Supabase
                const { error } = await supabase.from('course_enrollments').insert([{
                    course_id: courseId,
                    course_title: courseTitle,
                    student_id: studentId,
                    student_name: name,
                    student_email: email
                }]);

                if (error) throw error;

                // Success UI
                $('#enrollFormContainer').hide();
                $('#enrollSuccessMessage').show().html(`
                    <div class="text-center py-4">
                        <div class="display-3 mb-3">✅</div>
                        <h4 class="fw-bold mb-3">You're enrolled!</h4>
                        <p class="text-secondary mb-4">You have successfully joined ${courseTitle}.</p>
                        <button type="button" class="btn btn-primary-custom w-100" data-bs-dismiss="modal">Close</button>
                    </div>
                `);

            } catch (err) {
                console.error('Enrollment error:', err);
                alert('Failed to process enrollment. Please try again.');
            }
        }
    });

    // ----------------------------------------------------
    // REGISTRATION FORM (Supabase Sync)
    // ----------------------------------------------------
    $('#register-form').on('submit', async function (e) {
        e.preventDefault();
        let isValid = true;

        const name = $('#regName').val().trim();
        const sId = $('#regStudentId').val().trim();
        const email = $('#regEmail').val().trim();
        const pass = $('#regPassword').val().trim();
        const conf = $('#regConfirm').val().trim();
        const dept = $('#regDept').val();

        $('.invalid-feedback').hide();
        $(this).find('.form-control, .form-select').removeClass('is-invalid');

        if (!name) { $('#regName').addClass('is-invalid'); isValid = false; }
        if (!sId) { $('#regStudentId').addClass('is-invalid'); isValid = false; }
        if (!email || !emailRegex.test(email)) { $('#regEmail').addClass('is-invalid'); isValid = false; }
        if (pass.length < 6) { $('#regPassword').addClass('is-invalid'); isValid = false; }
        if (conf !== pass) { $('#regConfirm').addClass('is-invalid'); isValid = false; }

        if (isValid) {
            try {
                // In a real app, you'd use supabase.auth.signUp
                // For this project, we'll also record them in our 'students' table for the counter
                const { error: studentErr } = await supabase.from('students').insert([{
                    name: name,
                    department: dept || 'CSE'
                }]);

                if (studentErr) throw studentErr;

                // Also store locally for mock login session if needed
                localStorage.setItem('last_registered_email', email);

                if (window.Utils) window.Utils.showAlert('#reg-alert', 'Account created! Redirecting...', 'success');
                setTimeout(() => window.location.href = './login.html', 1500);

            } catch (err) {
                console.error('Registration error:', err);
                alert('Registration failed.');
            }
        }
    });

    // ----------------------------------------------------
    // CONTACT FORM
    // ----------------------------------------------------
    $('#contact-form').on('submit', function (e) {
        e.preventDefault();
        if (window.Utils) window.Utils.showAlert('#form-alert', 'Message sent! We will contact you soon.', 'success');
        $(this)[0].reset();
    });

    // Password strength & matching (simplified)
    $('#regPassword, #regConfirm').on('keyup', function() {
        const pass = $('#regPassword').val();
        const conf = $('#regConfirm').val();
        const $bar = $('#strength-bar');
        
        if (pass.length >= 6) $bar.css('width', '100%').css('background', '#198754');
        else $bar.css('width', '30%').css('background', '#dc3545');

        if (conf && pass === conf) $('#match-icon').removeClass('d-none').text('✓').addClass('text-success');
        else $('#match-icon').addClass('d-none');
    });
});
