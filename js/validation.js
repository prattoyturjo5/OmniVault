/*
  File: validation.js
  Made by: [Member Name] | ID: [Student ID]
*/
$(document).ready(function () {
    // Reusable regex validate
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Core enrollment modal form handling
    $('#enrollForm').on('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        const $form = $(this);
        const name = $('#enrollName').val().trim();
        const studentId = $('#enrollStudentId').val().trim();
        const email = $('#enrollEmail').val().trim();

        // Reset errors
        $('.invalid-feedback').hide();
        $form.find('.form-control').removeClass('is-invalid');

        if (!name) {
            $('#enrollName').addClass('is-invalid');
            $('#enrollNameErr').text('Full name is required').show();
            isValid = false;
        }

        if (!studentId) {
            $('#enrollStudentId').addClass('is-invalid');
            $('#enrollStudentIdErr').text('Student ID is required').show();
            isValid = false;
        }

        if (!email) {
            $('#enrollEmail').addClass('is-invalid');
            $('#enrollEmailErr').text('Email is required').show();
            isValid = false;
        } else if (!emailRegex.test(email)) {
            $('#enrollEmail').addClass('is-invalid');
            $('#enrollEmailErr').text('Please enter a valid email address').show();
            isValid = false;
        }

        if (isValid) {
            // Context provided by course-detail script
            if (window.enrollmentContext) {
                const { courseId, courseTitle, department, instructor } = window.enrollmentContext;

                // Fetch storage
                let enrollments = [];
                try {
                    const stored = localStorage.getItem('enrollments');
                    if (stored) enrollments = JSON.parse(stored);
                } catch (err) { console.error('LocalStorage error'); }

                // Check if already enrolled
                const alreadyEnrolled = enrollments.find(env => env.courseId === courseId && env.studentId === studentId);

                // Resolve logic
                if (alreadyEnrolled) {
                    $('#enrollStudentId').addClass('is-invalid');
                    $('#enrollStudentIdErr').text('You are already enrolled with this Student ID.').show();
                } else {
                    // Success
                    enrollments.push({
                        courseId: courseId,
                        courseTitle: courseTitle,
                        department: department,
                        instructor: instructor,
                        studentName: name,
                        studentId: studentId,
                        email: email,
                        enrolledAt: new Date().toISOString()
                    });

                    localStorage.setItem('enrollments', JSON.stringify(enrollments));

                    // Show success
                    $('#enrollFormContainer').hide();
                    $('#enrollSuccessMessage').show().html(`
                        <div class="text-center py-4">
                            <div class="display-3 mb-3">✅</div>
                            <h4 class="fw-bold mb-3">You're enrolled in ${courseTitle}!</h4>
                            <p class="text-secondary mb-4">A confirmation email has been sent to ${email}.</p>
                            <a href="./dashboard.html" class="btn btn-primary-custom w-100 border-0 mb-2">Go to Dashboard</a>
                            <button type="button" class="btn btn-ghost w-100" data-bs-dismiss="modal">Close</button>
                        </div>
                    `);
                }
            }
        }
    });

    // Reset modal on close
    $('#enrollModal').on('hidden.bs.modal', function () {
        if ($('#enrollForm').length > 0) {
            $('#enrollFormContainer').show();
            $('#enrollSuccessMessage').hide();
            $('#enrollForm')[0].reset();
            $('.invalid-feedback').hide();
            $('.form-control').removeClass('is-invalid');
        }
    });

    // Handle Contact Form Validation
    $('#contact-form').on('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        const $form = $(this);
        const name = $('#contactName').val().trim();
        const email = $('#contactEmail').val().trim();
        const message = $('#contactMessage').val().trim();

        // Reset errors
        $('.invalid-feedback').hide();
        $form.find('.form-control').removeClass('is-invalid');
        $('#form-alert').empty();

        if (!name) {
            $('#contactName').addClass('is-invalid');
            $('#contactNameErr').text('Full name is required').show();
            isValid = false;
        }

        if (!email) {
            $('#contactEmail').addClass('is-invalid');
            $('#contactEmailErr').text('Email is required').show();
            isValid = false;
        } else if (!emailRegex.test(email)) {
            $('#contactEmail').addClass('is-invalid');
            $('#contactEmailErr').text('Please enter a valid email address').show();
            isValid = false;
        }

        if (!message || message.length < 20) {
            $('#contactMessage').addClass('is-invalid');
            $('#contactMessageErr').text('Message must be at least 20 characters').show();
            isValid = false;
        }

        if (isValid) {
            if (window.Utils && window.Utils.showAlert) {
                window.Utils.showAlert('#form-alert', 'Your message was sent successfully! Our team will get back to you soon.', 'success');
            }
            $form[0].reset();
        }
    });
    // -----------------------------------------------------------------
    // AUTH: Login Form Validation & Toggle
    // -----------------------------------------------------------------

    // Toggle Password Visibility
    $('#toggleLoginPassword').on('click', function (e) {
        e.preventDefault();
        const $input = $('#loginPassword');
        const type = $input.attr('type') === 'password' ? 'text' : 'password';
        $input.attr('type', type);

        // Swap svg representation mildly
        if (type === 'text') {
            $(this).html('<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-off-icon"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>');
        } else {
            $(this).html('<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-icon"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>');
        }
    });

    $('#login-form').on('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        const email = $('#loginEmail').val().trim();
        const pass = $('#loginPassword').val().trim();

        $('.invalid-feedback').hide();
        $(this).find('.form-control').removeClass('is-invalid');

        if (!email || !emailRegex.test(email)) {
            $('#loginEmail').addClass('is-invalid');
            $('#loginEmailErr').text('Please enter a valid email.').show();
            isValid = false;
        }

        if (!pass || pass.length < 6) {
            $('#loginPassword').addClass('is-invalid');
            $('#loginPasswordErr').text('Password must be at least 6 characters.').show();
            isValid = false;
        }

        if (isValid) {
            sessionStorage.setItem('omnivault_user', JSON.stringify({
                email: email,
                loggedIn: true,
                name: "John Student",
                department: "CS"
            }));
            window.location.href = './dashboard.html';
        }
    });

    // -----------------------------------------------------------------
    // AUTH: Register Live Validation & Submission Constraints
    // -----------------------------------------------------------------

    // Live Field Checking mechanism (Alphanumeric constraint on ID)
    $('#regName, #regEmail, #regDept, #regStudentId').on('keyup change', function () {
        const id = $(this).attr('id');
        const val = $(this).val().trim();

        if (id === 'regName' && val.length > 0) { $(this).removeClass('is-invalid'); }
        if (id === 'regDept' && val !== "") { $(this).removeClass('is-invalid'); }
        if (id === 'regEmail' && emailRegex.test(val)) { $(this).removeClass('is-invalid'); }
        if (id === 'regStudentId') {
            const alphaNumRegex = /^[a-zA-Z0-9]+$/;
            if (val.length > 0 && alphaNumRegex.test(val)) {
                $(this).removeClass('is-invalid');
            } else {
                $(this).addClass('is-invalid');
                $('#regStudentIdErr').text('Alphanumeric characters only.').show();
            }
        }
    });

    // Password Strength Meter Loop
    $('#regPassword').on('keyup', function () {
        const val = $(this).val().trim();
        const $bar = $('#strength-bar');
        const $lbl = $('#strength-label');
        const $err = $('#regPasswordErr');

        $(this).removeClass('is-invalid');
        $err.addClass('d-none');
        $('#regConfirm').trigger('keyup'); // refresh match validator

        if (val.length === 0) {
            $bar.css({ 'width': '0%', 'background': '#dc3545' });
            $lbl.text('Enter password');
            return;
        }

        if (val.length < 6) {
            $bar.css({ 'width': '33%', 'background': '#dc3545' });
            $lbl.text('Weak: Too short');
        } else {
            const hasLetters = /[a-zA-Z]/.test(val);
            const hasNumbers = /[0-9]/.test(val);
            const hasSymbols = /[^a-zA-Z0-9]/.test(val);

            if (val.length >= 8 && hasLetters && hasNumbers && hasSymbols) {
                // Strong Check
                $bar.css({ 'width': '100%', 'background': '#198754' });
                $lbl.text('Strong');
            } else {
                // Medium Check (Letters + Numbers, or just 6-7 raw characters)
                $bar.css({ 'width': '66%', 'background': '#ffc107' });
                $lbl.text('Medium');
            }
        }
    });

    // Password Integrity Matching loop
    $('#regConfirm').on('keyup', function () {
        const pass = $('#regPassword').val().trim();
        const conf = $(this).val().trim();
        const $icon = $('#match-icon');

        if (conf.length === 0) {
            $icon.addClass('d-none');
            $(this).removeClass('is-invalid is-valid');
            return;
        }

        $icon.removeClass('d-none');
        if (pass === conf && pass.length >= 6) {
            $icon.html('✓').removeClass('text-danger').addClass('text-success');
            $(this).removeClass('is-invalid').addClass('is-valid');
            $('#regConfirmErr').hide();
        } else {
            $icon.html('✗').removeClass('text-success').addClass('text-danger');
            $(this).removeClass('is-valid').addClass('is-invalid');
        }
    });

    // Final Block Submission
    $('#register-form').on('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        const name = $('#regName').val().trim();
        const sId = $('#regStudentId').val().trim();
        const dept = $('#regDept').val();
        const email = $('#regEmail').val().trim();
        const pass = $('#regPassword').val().trim();
        const conf = $('#regConfirm').val().trim();

        $('.invalid-feedback').hide();
        $(this).find('.form-control, .form-select').removeClass('is-invalid');

        if (!name) { $('#regName').addClass('is-invalid'); $('#regNameErr').text('Required').show(); isValid = false; }

        const alphaNumRegex = /^[a-zA-Z0-9]+$/;
        if (!sId || !alphaNumRegex.test(sId)) { $('#regStudentId').addClass('is-invalid'); $('#regStudentIdErr').text('Required alphanumeric').show(); isValid = false; }

        if (!dept) { $('#regDept').addClass('is-invalid'); $('#regDeptErr').text('Department required').show(); isValid = false; }

        if (!email || !emailRegex.test(email)) { $('#regEmail').addClass('is-invalid'); $('#regEmailErr').text('Valid email required').show(); isValid = false; }

        if (pass.length < 6) {
            $('#regPassword').addClass('is-invalid');
            $('#regPasswordErr').text('Minimum 6 characters').removeClass('d-none');
            isValid = false;
        }

        if (conf !== pass || conf.length === 0) {
            $('#regConfirm').addClass('is-invalid');
            $('#regConfirmErr').text('Passwords must match').show();
            isValid = false;
        }

        if (isValid) {
            let users = [];
            try {
                const stored = localStorage.getItem('users');
                if (stored) users = JSON.parse(stored);
            } catch (e) { }

            const exists = users.find(u => u.email === email);
            if (exists) {
                $('#regEmail').addClass('is-invalid');
                $('#regEmailErr').text('This email is already registered.').show();
            } else {
                users.push({
                    id: window.Utils ? window.Utils.generateId() : Date.now().toString(),
                    name: name,
                    studentId: sId,
                    email: email,
                    department: dept,
                    password: pass, // Naturally unsafe, fulfilling prompt purely for concept UI mapping
                    createdAt: new Date().toISOString()
                });

                localStorage.setItem('users', JSON.stringify(users));

                if (window.Utils && window.Utils.showAlert) {
                    window.Utils.showAlert('#reg-alert', 'Account created! Redirecting to login...', 'success');
                }

                setTimeout(() => {
                    window.location.href = './login.html';
                }, 1500);
            }
        }
    });

});
