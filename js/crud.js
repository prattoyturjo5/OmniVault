/*
  File: crud.js
  Made by: [Member Name] | ID: [Student ID]
*/

$(document).ready(function () {

    // ----------------------------------------------------
    // INITIALIZATION & STORE
    // ----------------------------------------------------

    let adminCourses = [];

    async function initData() {
        try {
            const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            adminCourses = data || [];
            renderTable();
        } catch (err) {
            console.error("Failed to fetch courses from Supabase: ", err);
            adminCourses = [];
            renderTable();
        }
    }

    // ----------------------------------------------------
    // RENDER LOGIC
    // ----------------------------------------------------
    function renderTable(filterText = '') {
        let courses = adminCourses;

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

        let courses = adminCourses;
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
    $('#courseForm').on('keypress', function(e) {
        if (e.which === 13 && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            $('#btnSaveCourse').click();
        }
    });

    $('#btnSaveCourse').on('click', async function () {
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
                try {
                    const { error } = await supabase.from('courses').update(payload).eq('id', editId);
                    if (error) throw error;
                    if (window.Utils) window.Utils.showAlert('#admin-alert', 'Course updated!', 'success');
                } catch(err) {
                    console.error('Update error:', err);
                    if (window.Utils) window.Utils.showAlert('#admin-alert', 'Update failed.', 'danger');
                }
            } else {
                // Append logic uniquely
                payload.id = window.Utils && window.Utils.generateId ? window.Utils.generateId() : 'C-' + Date.now();
                try {
                    const { error } = await supabase.from('courses').insert([payload]);
                    if (error) throw error;
                    if (window.Utils) window.Utils.showAlert('#admin-alert', 'Course added successfully!', 'success');
                } catch(err) {
                    console.error('Insert error:', err);
                    if (window.Utils) window.Utils.showAlert('#admin-alert', 'Insert failed.', 'danger');
                }
            }

            $('#courseModal').modal('hide');
            await initData();
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

    $('#btnConfirmDelete').on('click', async function () {
        const targetId = String($('#deleteModal').data('id'));
        
        try {
            const { error } = await supabase.from('courses').delete().eq('id', targetId);
            if (error) throw error;
            
            $('#deleteModal').modal('hide');

            // Animate out natively
            $(`#row-${targetId}`).fadeOut(300, async function () {
                $(this).remove();
                await initData();
            });

            if (window.Utils) window.Utils.showAlert('#admin-alert', 'Course deleted.', 'success');
        } catch(err) {
            console.error('Delete error:', err);
            if (window.Utils) window.Utils.showAlert('#admin-alert', 'Delete failed.', 'danger');
        }
    });

});
