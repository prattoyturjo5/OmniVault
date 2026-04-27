// file: js/validation.js

$(document).ready(function () {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // ----------------------------------------------------
    // ENROLLMENT FORM (Supabase Sync)
    // ----------------------------------------------------
    $('#enrollForm').on('submit', async function (e) {
        e.preventDefault();
        
        // Final security check for a professional implementation
        const role = window.Utils ? await window.Utils.getUserRole() : 'guest';
        if (role !== 'student') {
            if (role === 'guest') {
                alert('Your session has expired or you are not logged in. Please login to enroll.');
                if (window.Utils) window.Utils.requireAuth();
            } else {
                alert('Only students can enroll in courses.');
            }
            return;
        }

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
                // 1. ID Verification & Data Type Logging
                console.log(`[Enrollment Debug] Submitting enrollment for course: ${courseId}`);
                console.log(`[Enrollment Debug] student_id being sent: '${studentId}'`);
                console.log(`[Enrollment Debug] student_id data type: ${typeof studentId}`);
                // Note: Not using parseInt() because IDs like '21-XXXXX-1' are strings.
                // If your Supabase table requires an integer, you must change your ID format.

                // Check if already enrolled in this specific course (using student_id now)
                const { data: existing } = await supabase
                    .from('enrollments')
                    .select('id')
                    .eq('course_id', courseId)
                    .eq('student_id', studentId)
                    .maybeSingle();

                if (existing) {
                    $('#enrollStudentId').addClass('is-invalid');
                    $('#enrollStudentIdErr').text('You are already enrolled in this course.').show();
                    return;
                }

                // Verify seat availability first
                const { data: courseData, error: fetchErr } = await supabase
                    .from('courses')
                    .select('enrolled') // Removed 'seats' because it does not exist in the database
                    .eq('id', courseId)
                    .single();
                
                if (fetchErr) throw fetchErr;

                const currentEnrolled = courseData.enrolled || 0;
                const totalSeats = window.enrollmentContext?.seats || 50; // Fallback to 50

                if (currentEnrolled >= totalSeats) {
                    alert('Sorry, this course is currently full.');
                    return;
                }

                // Insert into Supabase 'enrollments' table
                const { error: insErr } = await supabase.from('enrollments').insert([{
                    course_id: courseId,
                    course_title: courseTitle,
                    student_id: studentId,
                    status: 'active',
                    certificate_count: 0
                }]);

                if (insErr) throw insErr;

                // Increment enrollment count in courses table
                const newCount = currentEnrolled + 1;
                await supabase.from('courses').update({ enrolled: newCount }).eq('id', courseId);

                // Success UI
                $('#enrollFormContainer').hide();
                $('#enrollSuccessMessage').show().html(`
                    <div class="text-center py-4">
                        <div class="display-3 mb-3">✅</div>
                        <h4 class="fw-bold mb-3">You're enrolled!</h4>
                        <p class="text-secondary mb-4">You have successfully joined ${courseTitle}.</p>
                        <button type="button" class="btn btn-primary-custom w-100" data-bs-dismiss="modal" onclick="window.location.reload()">Close & Refresh</button>
                    </div>
                `);

            } catch (err) {
                // 3. Detailed Error Logging
                console.error('[Enrollment Debug] Complete Error Object:', err);
                if (err.message) console.error('[Enrollment Debug] Exact Message:', err.message);
                if (err.details) console.error('[Enrollment Debug] Exact Details:', err.details);
                if (err.hint) console.error('[Enrollment Debug] Error Hint:', err.hint);
                
                // Show exact error in the alert so user can screenshot it
                const errorMsg = err.message || JSON.stringify(err) || 'Unknown error';
                const errorDetails = err.details || 'No details provided';
                alert(`Enrollment Failed!\n\nError: ${errorMsg}\n\nDetails: ${errorDetails}\n\nPlease share this message.`);
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
                // Insert into Supabase 'students' table with password
                const { error: studentErr } = await supabase.from('students').insert([{
                    name: name,
                    student_id: sId,
                    email: email,
                    password: pass, // Added password to schema
                    department: dept || 'CSE'
                }]);

                if (studentErr) throw studentErr;

                // Create student session for dashboard.html
                const userData = {
                    name: name,
                    email: email,
                    studentId: sId,
                    department: dept || 'CSE',
                    loggedIn: true
                };
                sessionStorage.setItem('omnivault_user', JSON.stringify(userData));

                if (window.Utils) window.Utils.showAlert('#reg-alert', 'Account created! Welcome to OmniVault.', 'success');
                
                // Redirect to Dashboard instead of Login/Admin
                setTimeout(() => window.location.href = './dashboard.html', 1500);

            } catch (err) {
                console.error('Registration error:', err);
                alert('Registration failed: ' + (err.message || 'Check database connection. Note: Please ensure a password column exists in the students table.'));
            }
        }
    });

    // ----------------------------------------------------
    // CONTACT FORM
    // ----------------------------------------------------
    $('#contact-form').on('submit', async function (e) {
        e.preventDefault();
        const btn = $(this).find('button[type="submit"]');
        const originalText = btn.text();
        btn.text('Sending...').prop('disabled', true);

        const name = $('#contactName').val().trim();
        const email = $('#contactEmail').val().trim();
        const subject = $('#contactSubject').val() || 'General Inquiry';
        const message = $('#contactMessage').val().trim();

        // Basic validation
        let isValid = true;
        if (!name) { $('#contactName').addClass('is-invalid'); isValid = false; }
        else { $('#contactName').removeClass('is-invalid'); }
        
        if (!email || !emailRegex.test(email)) { $('#contactEmail').addClass('is-invalid'); isValid = false; }
        else { $('#contactEmail').removeClass('is-invalid'); }
        
        if (!message || message.length < 20) { $('#contactMessage').addClass('is-invalid'); isValid = false; }
        else { $('#contactMessage').removeClass('is-invalid'); }

        if (isValid) {
            try {
                const { error } = await supabase.from('contact_messages').insert([{
                    name: name,
                    email: email,
                    subject: subject,
                    message: message
                }]);

                if (error) throw error;

                if (window.Utils) window.Utils.showAlert('#form-alert', 'Message sent successfully! We will contact you soon.', 'success');
                $(this)[0].reset();
            } catch (err) {
                console.error('Contact form error:', err);
                if (window.Utils) window.Utils.showAlert('#form-alert', 'Failed to send message. Please try again later.', 'danger');
            }
        }
        btn.text(originalText).prop('disabled', false);
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
