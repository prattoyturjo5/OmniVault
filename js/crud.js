// file: js/crud.js

$(document).ready(function () {
    let currentModule = 'courses';
    let moduleData = {
        courses: [],
        faculty: [],
        students: [],
        specializations: []
    };

    // ----------------------------------------------------
    // INITIALIZATION & DATA FETCHING
    // ----------------------------------------------------
    async function initModuleData(module) {
        try {
            const { data, error } = await supabase
                .from(module)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            moduleData[module] = data;
            renderTable(module);
            updateModuleCount(module);
        } catch (err) {
            console.error(`Error fetching ${module}:`, err);
        }
    }

    function updateModuleCount(module) {
        $(`#${module}-count`).text(`${moduleData[module].length} items total`);
    }

    // Load initial data
    initModuleData('courses');
    initModuleData('faculty');
    initModuleData('students');
    initModuleData('specializations');

    // ----------------------------------------------------
    // NAVIGATION
    // ----------------------------------------------------
    $('.sidebar-link').on('click', function () {
        const section = $(this).attr('data-section');
        if (!section) return;

        $('.sidebar-link').removeClass('active');
        $(this).addClass('active');

        $('.content-section').addClass('d-none');
        $(`#section-${section}`).removeClass('d-none');
        currentModule = section;
    });

    // ----------------------------------------------------
    // TABLE RENDERING
    // ----------------------------------------------------
    function renderTable(module) {
        const $tbody = $(`#${module}-tbody`);
        $tbody.empty();

        if (moduleData[module].length === 0) {
            $tbody.append(`<tr><td colspan="5" class="text-center py-4">No ${module} records found.</td></tr>`);
            return;
        }

        moduleData[module].forEach((item, index) => {
            let rowHtml = '';
            if (module === 'courses') {
                rowHtml = `
                    <tr>
                        <td>${index + 1}</td>
                        <td class="fw-bold">${item.title}</td>
                        <td><span class="badge bg-light text-dark border">${item.department}</span></td>
                        <td>${item.instructor}</td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-ghost btn-edit" data-id="${item.id}" data-module="courses">Edit</button>
                            <button class="btn btn-sm btn-ghost text-danger btn-delete" data-id="${item.id}" data-module="courses">Delete</button>
                        </td>
                    </tr>`;
            } else if (module === 'faculty') {
                rowHtml = `
                    <tr>
                        <td>${index + 1}</td>
                        <td class="fw-bold">${item.name}</td>
                        <td>${item.designation}</td>
                        <td>${item.department}</td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-ghost btn-edit" data-id="${item.id}" data-module="faculty">Edit</button>
                            <button class="btn btn-sm btn-ghost text-danger btn-delete" data-id="${item.id}" data-module="faculty">Delete</button>
                        </td>
                    </tr>`;
            } else if (module === 'students') {
                rowHtml = `
                    <tr>
                        <td>${index + 1}</td>
                        <td class="fw-bold">${item.name}</td>
                        <td>${new Date(item.enrollment_date).toLocaleDateString()}</td>
                        <td>${item.department}</td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-ghost btn-edit" data-id="${item.id}" data-module="students">Edit</button>
                            <button class="btn btn-sm btn-ghost text-danger btn-delete" data-id="${item.id}" data-module="students">Delete</button>
                        </td>
                    </tr>`;
            } else if (module === 'specializations') {
                rowHtml = `
                    <tr>
                        <td>${index + 1}</td>
                        <td class="fw-bold">${item.title}</td>
                        <td><span class="badge bg-primary-custom text-white border-0">${item.tag}</span></td>
                        <td class="small text-secondary">${item.course_count} Courses · ${item.faculty_count} Faculty</td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-ghost btn-edit" data-id="${item.id}" data-module="specializations">Edit</button>
                            <button class="btn btn-sm btn-ghost text-danger btn-delete" data-id="${item.id}" data-module="specializations">Delete</button>
                        </td>
                    </tr>`;
            }
            $tbody.append(rowHtml);
        });
    }

    // ----------------------------------------------------
    // MODAL OPENING
    // ----------------------------------------------------
    $('#btnAddCourse').on('click', () => { $('#courseForm')[0].reset(); $('#courseModal').removeAttr('data-edit-id'); $('#courseModal').modal('show'); });
    $('#btnAddFaculty').on('click', () => { $('#facultyForm')[0].reset(); $('#facultyModal').removeAttr('data-edit-id'); $('#facultyModal').modal('show'); });
    $('#btnAddStudent').on('click', () => { $('#studentForm')[0].reset(); $('#studentModal').removeAttr('data-edit-id'); $('#studentModal').modal('show'); });
    $('#btnAddSpecialization').on('click', () => { $('#specializationForm')[0].reset(); $('#specializationModal').removeAttr('data-edit-id'); $('#specializationModal').modal('show'); });

    // ----------------------------------------------------
    // EDIT HANDLER
    // ----------------------------------------------------
    $(document).on('click', '.btn-edit', function () {
        const id = $(this).attr('data-id');
        const module = $(this).attr('data-module');
        const item = moduleData[module].find(i => String(i.id) === String(id));
        if (!item) return;

        if (module === 'courses') {
            $('#formTitle').val(item.title);
            $('#formInstructor').val(item.instructor);
            $('#formDesc').val(item.description);
            $('#courseModal').attr('data-edit-id', id).modal('show');
        } else if (module === 'faculty') {
            $('#facultyName').val(item.name);
            $('#facultyDesignation').val(item.designation);
            $('#facultyEmail').val(item.email);
            $('#facultyModal').attr('data-edit-id', id).modal('show');
        } else if (module === 'students') {
            $('#studentName').val(item.name);
            $('#studentModal').attr('data-edit-id', id).modal('show');
        } else if (module === 'specializations') {
            $('#specTitle').val(item.title);
            $('#specTag').val(item.tag);
            $('#specCourses').val(item.course_count);
            $('#specFaculty').val(item.faculty_count);
            $('#specDesc').val(item.description);
            $('#specializationModal').attr('data-edit-id', id).modal('show');
        }
    });

    // ----------------------------------------------------
    // SAVE HANDLERS
    // ----------------------------------------------------
    $('#btnSaveSpecialization').on('click', async function () {
        const title = $('#specTitle').val().trim();
        const tag = $('#specTag').val().trim();
        if (!title || !tag) return alert('Title and Tag are required');

        const payload = {
            title,
            tag,
            course_count: parseInt($('#specCourses').val()) || 0,
            faculty_count: parseInt($('#specFaculty').val()) || 0,
            description: $('#specDesc').val().trim()
        };

        const editId = $('#specializationModal').attr('data-edit-id');
        try {
            if (editId) {
                const { error } = await supabase.from('specializations').update(payload).eq('id', editId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('specializations').insert([payload]);
                if (error) throw error;
            }
            $('#specializationModal').modal('hide');
            initModuleData('specializations');
            if (window.Utils) window.Utils.showAlert('#admin-alert', 'Specialization saved!', 'success');
        } catch (err) {
            console.error('Save Spec Error:', err);
        }
    });

    // (Original save handlers for courses, faculty, students remain but condensed in logic)
    $('#btnSaveCourse').on('click', async function () {
        const title = $('#formTitle').val().trim();
        const instructor = $('#formInstructor').val().trim();
        if (!title || !instructor) return alert('Title and Instructor required');
        const payload = { title, instructor, department: 'CSE', description: $('#formDesc').val().trim() };
        const editId = $('#courseModal').attr('data-edit-id');
        try {
            if (editId) await supabase.from('courses').update(payload).eq('id', editId);
            else { payload.id = 'C-' + Date.now(); await supabase.from('courses').insert([payload]); }
            $('#courseModal').modal('hide'); initModuleData('courses');
        } catch (e) { console.error(e); }
    });

    $('#btnSaveFaculty').on('click', async function () {
        const name = $('#facultyName').val().trim();
        if (!name) return alert('Name required');
        const payload = { name, designation: $('#facultyDesignation').val(), email: $('#facultyEmail').val(), department: $('#facultyDept').val() };
        const editId = $('#facultyModal').attr('data-edit-id');
        try {
            if (editId) await supabase.from('faculty').update(payload).eq('id', editId);
            else await supabase.from('faculty').insert([payload]);
            $('#facultyModal').modal('hide'); initModuleData('faculty');
        } catch (e) { console.error(e); }
    });

    $('#btnSaveStudent').on('click', async function () {
        const name = $('#studentName').val().trim();
        if (!name) return alert('Name required');
        const payload = { name, department: $('#studentDept').val() };
        const editId = $('#studentModal').attr('data-edit-id');
        try {
            if (editId) await supabase.from('students').update(payload).eq('id', editId);
            else await supabase.from('students').insert([payload]);
            $('#studentModal').modal('hide'); initModuleData('students');
        } catch (e) { console.error(e); }
    });

    // ----------------------------------------------------
    // DELETE HANDLER
    // ----------------------------------------------------
    $(document).on('click', '.btn-delete', function () {
        $('#deleteModal').attr('data-id', $(this).attr('data-id')).attr('data-module', $(this).attr('data-module')).modal('show');
    });

    $('#btnConfirmDelete').on('click', async function () {
        const id = $('#deleteModal').attr('data-id');
        const module = $('#deleteModal').attr('data-module');
        try {
            await supabase.from(module).delete().eq('id', id);
            $('#deleteModal').modal('hide');
            initModuleData(module);
        } catch (e) { console.error(e); }
    });
});
