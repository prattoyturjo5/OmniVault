/*
  File: crud.js
  Made by: [Member Name] | ID: [Student ID]
*/

$(document).ready(function () {

    // ----------------------------------------------------
    // INITIALIZATION & STORE
    // ----------------------------------------------------

    function initData() {
        const stored = localStorage.getItem('adminCourses');
        if (!stored) {
            // First time initialization
            $.getJSON('../data/courses.json', function (data) {
                localStorage.setItem('adminCourses', JSON.stringify(data));
                renderTable();
            }).fail(function () {
                console.error("Failed to load root courses.json for initialization.");
                localStorage.setItem('adminCourses', JSON.stringify([]));
                renderTable();
            });
        } else {
            renderTable();
        }
    }

    // ----------------------------------------------------
    // RENDER LOGIC
    // ----------------------------------------------------
    function renderTable(filterText = '') {
        const stored = localStorage.getItem('adminCourses');
        let courses = stored ? JSON.parse(stored) : [];

        // Filter logic
        if (filterText) {
            const query = filterText.toLowerCase();
            courses = courses.filter(c =>
                (c.title && c.title.toLowerCase().includes(query)) ||
                (c.department && c.department.toLowerCase().includes(query))
            );
        }

        const $tbody = $('#courses-tbody');
        $tbody.empty();

        if (courses.length === 0) {
            $tbody.html(`<tr><td colspan="7" class="text-center py-4 text-secondary">No courses found matching criteria.</td></tr>`);
            $('#table-count').text(`Showing 0 courses`);
            return;
        }

        $('#table-count').text(`Showing ${courses.length} courses`);

        courses.forEach((c, index) => {
            const deptClass = window.Utils && window.Utils.getDeptClass ? window.Utils.getDeptClass(c.departmentLabel || c.department) : "dept-cs";
            const rowHtml = `
                <tr id="row-${c.id}">
                    <td class="fw-medium text-secondary">${index + 1}</td>
                    <td class="fw-bold text-dark">${c.title}</td>
                    <td><span class="badge border bg-white shadow-sm ${deptClass} text-dark fw-medium px-2 py-1">${c.departmentLabel || c.department}</span></td>
                    <td class="text-secondary">${c.instructor}</td>
                    <td class="text-secondary">${c.duration || 'N/A'}</td>
                    <td class="text-secondary fw-semibold">${c.credits || 0}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-secondary btn-edit me-1" data-id="${c.id}">Edit</button>
                        <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${c.id}">Delete</button>
                    </td>
                </tr>
            `;
            $tbody.append(rowHtml);
        });
    }

    // Initialize the engine automatically
    initData();

    // ----------------------------------------------------
    // LIVE SEARCH
    // ----------------------------------------------------
    $('#search-admin').on('keyup', function () {
        const val = $(this).val().trim();
        renderTable(val);
    });

    // ----------------------------------------------------
    // CREATE / ADD NEW FLOW
    // ----------------------------------------------------
    $('#btnAddCourse').on('click', function () {
        // Reset form completely
        $('#courseForm')[0].reset();
        $('.form-control, .form-select').removeClass('is-invalid');
        $('.invalid-feedback').hide();

        // Reset modal headers and attributes
        $('#courseModalLabel').text('Add New Course');
        $('#courseModal').removeAttr('data-edit-id');

        $('#courseModal').modal('show');
    });

    // ----------------------------------------------------
    // UPDATE FLOW
    // ----------------------------------------------------
    $(document).on('click', '.btn-edit', function () {
        const idToEdit = String($(this).attr('data-id'));

        let courses = [];
        try { courses = JSON.parse(localStorage.getItem('adminCourses')); } catch (e) { }
        const course = courses.find(c => String(c.id) === idToEdit);

        if (course) {
            // Reset state
            $('#courseForm')[0].reset();
            $('.form-control, .form-select').removeClass('is-invalid');
            $('.invalid-feedback').hide();

            // Populate mapping
            $('#formTitle').val(course.title);

            // Re-align dept codes intelligently
            const dpt = course.departmentLabel || course.department;
            let code = "dept-cse";
            $('#formDept').val(code);

            $('#formInstructor').val(course.instructor);
            $('#formDuration').val(course.duration);
            $('#formCredits').val(course.credits);
            $('#formLevel').val(course.level || 'Undergraduate');
            $('#formDesc').val(course.description || '');

            $('#courseModalLabel').text('Edit Course');
            $('#courseModal').attr('data-edit-id', idToEdit);

            $('#courseModal').modal('show');
        }
    });

    // ----------------------------------------------------
    // SUBMISSION HANDLER (Supports both Add & Edit natively)
    // ----------------------------------------------------
    $('#btnSaveCourse').on('click', function () {
        let isValid = true;

        // Form properties
        const fTitle = $('#formTitle').val().trim();
        const fDept = $('#formDept').val(); // dept code mapping
        const fInstructor = $('#formInstructor').val().trim();
        const fDuration = $('#formDuration').val().trim();
        const fCredits = parseInt($('#formCredits').val().trim(), 10) || 0;
        const fLevel = $('#formLevel').val();
        const fDesc = $('#formDesc').val().trim();

        // Standard Resets
        $('.form-control, .form-select').removeClass('is-invalid');

        // Validation Rules
        if (!fTitle) { $('#formTitle').addClass('is-invalid'); isValid = false; }
        if (!fInstructor) { $('#formInstructor').addClass('is-invalid'); isValid = false; }
        if (fCredits < 1 || fCredits > 6) { $('#formCredits').addClass('is-invalid'); isValid = false; }

        // Label mapped mechanically from coded `<select>` values
        const deptLabelMap = {
            'dept-cse': 'Computer Science'
        };

        if (isValid) {
            let courses = [];
            try {
                const stored = localStorage.getItem('adminCourses');
                if (stored) courses = JSON.parse(stored);
            } catch (e) { }

            const editId = $('#courseModal').attr('data-edit-id');
            const deptLabel = deptLabelMap[fDept] || 'Computer Science';

            // Constructed course object logic
            const payload = {
                title: fTitle,
                department: 'CSE',
                departmentLabel: deptLabel,
                instructor: fInstructor,
                duration: fDuration || 'N/A',
                credits: fCredits,
                level: fLevel,
                description: fDesc
            };

            if (editId) {
                // Update specific iteration
                const index = courses.findIndex(c => String(c.id) === String(editId));
                if (index !== -1) {
                    // Update object by extending it rather than wiping unseen fields perfectly
                    courses[index] = { ...courses[index], ...payload };
                    localStorage.setItem('adminCourses', JSON.stringify(courses));
                    if (window.Utils) window.Utils.showAlert('#admin-alert', 'Course updated!', 'success');
                }
            } else {
                // Append logic uniquely
                payload.id = window.Utils && window.Utils.generateId ? window.Utils.generateId() : 'C-' + Date.now();
                courses.push(payload);
                localStorage.setItem('adminCourses', JSON.stringify(courses));
                if (window.Utils) window.Utils.showAlert('#admin-alert', 'Course added successfully!', 'success');
            }

            $('#courseModal').modal('hide');
            renderTable($('#search-admin').val().trim());
        }
    });

    // ----------------------------------------------------
    // DELETE FLOW
    // ----------------------------------------------------
    $(document).on('click', '.btn-delete', function () {
        const idToDelete = String($(this).attr('data-id'));
        $('#deleteModal').data('id', idToDelete);
        $('#deleteModal').modal('show');
    });

    $('#btnConfirmDelete').on('click', function () {
        const targetId = String($('#deleteModal').data('id'));
        let courses = [];
        try { courses = JSON.parse(localStorage.getItem('adminCourses')); } catch (e) { }

        const newArr = courses.filter(c => String(c.id) !== targetId);
        localStorage.setItem('adminCourses', JSON.stringify(newArr));

        $('#deleteModal').modal('hide');

        // Animate out natively
        $(`#row-${targetId}`).fadeOut(300, function () {
            $(this).remove();

            // Adjust label locally rather than whole render loop to persist search states dynamically unless zero
            if (newArr.length === 0) {
                renderTable($('#search-admin').val().trim());
            } else {
                $('#table-count').text(`Showing ${newArr.length} courses`);
            }
        });

        if (window.Utils) window.Utils.showAlert('#admin-alert', 'Course deleted.', 'success');
    });

});
