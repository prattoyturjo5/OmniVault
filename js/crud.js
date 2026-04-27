// file: js/crud.js

function showAdminAlert(msg, type = 'danger') {
    if (window.Utils && window.Utils.showAlert) {
        window.Utils.showAlert('', msg, type);
    } else {
        alert(msg);
    }
}

$(document).ready(function () {
    let currentModule = 'courses';
    let moduleData = { courses: [], faculty: [], students: [], events: [], specializations: [], contact_messages: [] };

    // ────────────────────────────────────────────
    // DATA FETCHING
    // ────────────────────────────────────────────
    async function initModuleData(module) {
        try {
            const { data, error } = await supabase.from(module).select('*').order('created_at', { ascending: false });
            if (error) throw error;
            moduleData[module] = data || [];
            renderTable(module);
            updateCount(module);
        } catch (err) {
            console.error(`Error fetching ${module}:`, err.message);
            const isTableMissing = err.message && err.message.includes('schema cache');
            const msg = isTableMissing
                ? `⚠️ The <strong>${module}</strong> table does not exist yet. Please run <code>${module}_setup.sql</code> in your Supabase SQL Editor first.`
                : `Failed to load ${module}: ${err.message}`;
            $(`#${module}-count`).html(`<span class="text-danger">Table not found</span>`);
            $(`#${module}-tbody`).html(`<tr><td colspan="8" class="text-center py-4">${msg}</td></tr>`);
        }
    }

    function updateCount(module) {
        $(`#${module}-count`).text(`${moduleData[module].length} items total`);
        if (module === 'contact_messages') {
            const count = moduleData[module].length;
            const $badge = $('#contact_messages-badge');
            if (count > 0) {
                $badge.text(count).removeClass('d-none');
            } else {
                $badge.addClass('d-none');
            }
        }
    }

    // Load all modules on startup
    const modules = ['courses', 'faculty', 'students', 'events', 'specializations', 'contact_messages'];
    modules.forEach(m => initModuleData(m));

    // Initialize Real-time for all modules
    function initRealtime() {
        supabase
            .channel('admin-realtime')
            .on('postgres_changes', { event: '*', schema: 'public' }, payload => {
                const table = payload.table;
                if (modules.includes(table)) {
                    initModuleData(table); // Refresh the specific table
                }
            })
            .subscribe();
    }
    initRealtime();

    // ────────────────────────────────────────────
    // NAVIGATION (Sidebar & Mobile)
    // ────────────────────────────────────────────
    $('.sidebar-link').on('click', function () {
        const section = $(this).attr('data-section');
        if (!section) return;
        switchSection(section);
    });

    // Mobile Navigation Selector
    $('#mobile-section-select').on('change', function() {
        switchSection($(this).val());
    });

    function switchSection(section) {
        $('.sidebar-link').removeClass('active');
        $(`.sidebar-link[data-section="${section}"]`).addClass('active');
        
        // Sync the mobile select dropdown
        $('#mobile-section-select').val(section);
        
        $('.content-section').addClass('d-none');
        $(`#section-${section}`).removeClass('d-none');
        currentModule = section;
        
        // Ensure the scroll area resets
        $('.main-area').scrollTop(0);
    }

    // ────────────────────────────────────────────
    // TABLE RENDERING
    // ────────────────────────────────────────────
    function renderTable(module) {
        const $tbody = $(`#${module}-tbody`);
        $tbody.empty();

        if (!moduleData[module] || moduleData[module].length === 0) {
            $tbody.html(`<tr><td colspan="8" class="text-center py-4 text-secondary">No ${module} records found.</td></tr>`);
            return;
        }

        moduleData[module].forEach((item, i) => {
            let row = '';
            if (module === 'courses') {
                row = `<tr>
                    <td>${i + 1}</td>
                    <td class="fw-semibold">${item.title}</td>
                    <td><span class="badge bg-light text-dark border">${item.department || 'CSE'}</span></td>
                    <td>${item.instructor || '—'}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-ghost btn-edit" data-id="${item.id}" data-module="courses">Edit</button>
                        <button class="btn btn-sm btn-ghost text-danger btn-delete" data-id="${item.id}" data-module="courses">Delete</button>
                    </td></tr>`;
            } else if (module === 'faculty') {
                row = `<tr>
                    <td>${i + 1}</td>
                    <td class="fw-semibold">${item.name}</td>
                    <td>${item.designation}</td>
                    <td>${item.department}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-ghost btn-edit" data-id="${item.id}" data-module="faculty">Edit</button>
                        <button class="btn btn-sm btn-ghost text-danger btn-delete" data-id="${item.id}" data-module="faculty">Delete</button>
                    </td></tr>`;
            } else if (module === 'students') {
                row = `<tr>
                    <td>${i + 1}</td>
                    <td class="fw-semibold">
                        <a href="dashboard.html?view_email=${item.email}" class="text-decoration-none text-dark hover-accent fw-bold" target="_blank" title="View Student Dashboard">
                            ${item.name}
                        </a>
                    </td>
                    <td><code class="small text-accent">${item.student_id || '—'}</code></td>
                    <td class="small text-secondary">${item.email || '—'}</td>
                    <td><span class="badge bg-light text-dark border">${item.department || 'CSE'}</span></td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-ghost text-primary btn-student-details" data-id="${item.student_id}" data-name="${item.name.replace(/"/g,'&quot;')}">Details</button>
                        <button class="btn btn-sm btn-ghost btn-edit" data-id="${item.id}" data-module="students">Edit</button>
                        <button class="btn btn-sm btn-ghost text-danger btn-delete" data-id="${item.id}" data-module="students">Delete</button>
                    </td>
                </tr>`;
            } else if (module === 'events') {
                const date = item.event_date ? new Date(item.event_date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
                const filled = item.seats_total - (item.seats_remaining ?? item.seats_total);
                const pct = item.seats_total > 0 ? Math.round((filled / item.seats_total) * 100) : 0;
                const featured = item.is_featured
                    ? `<span class="badge bg-warning text-dark border-0">⭐ Featured</span>`
                    : `<span class="badge bg-light text-secondary border">—</span>`;
                row = `<tr>
                    <td>${i + 1}</td>
                    <td class="fw-semibold">${item.title}</td>
                    <td><span class="badge bg-light text-dark border">${item.type}</span></td>
                    <td>${date}<br><span class="small text-secondary">${item.event_time || ''}</span></td>
                    <td class="small">${item.location || '—'}</td>
                    <td>
                        <div class="small fw-semibold">${item.seats_remaining ?? item.seats_total} / ${item.seats_total}</div>
                        <div class="seat-bar"><div class="seat-bar-fill" style="width:${pct}%"></div></div>
                    </td>
                    <td>${featured}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-ghost btn-view-regs" data-id="${item.id}" data-title="${item.title.replace(/"/g,'&quot;')}">Regs</button>
                        <button class="btn btn-sm btn-ghost btn-edit" data-id="${item.id}" data-module="events">Edit</button>
                        <button class="btn btn-sm btn-ghost text-danger btn-delete" data-id="${item.id}" data-module="events">Delete</button>
                    </td></tr>`;
            } else if (module === 'specializations') {
                row = `<tr>
                    <td>${i + 1}</td>
                    <td class="fw-semibold">${item.title}</td>
                    <td><span class="badge bg-primary text-white" style="background:var(--color-accent)!important">${item.tag}</span></td>
                    <td class="small text-secondary">${item.course_count} Courses · ${item.faculty_count} Faculty</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-ghost btn-edit" data-id="${item.id}" data-module="specializations">Edit</button>
                        <button class="btn btn-sm btn-ghost text-danger btn-delete" data-id="${item.id}" data-module="specializations">Delete</button>
                    </td></tr>`;
            } else if (module === 'contact_messages') {
                const date = new Date(item.created_at).toLocaleString();
                row = `<tr>
                    <td>${i + 1}</td>
                    <td class="fw-semibold">${item.name}<br><small class="text-secondary fw-normal">${item.email}</small></td>
                    <td><span class="badge bg-light text-dark border">${item.subject || 'General'}</span></td>
                    <td><div style="max-width:300px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${item.message.replace(/"/g, '&quot;')}">${item.message}</div></td>
                    <td class="small text-secondary">${date}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-ghost text-primary btn-read-msg" data-id="${item.id}">Read</button>
                        <button class="btn btn-sm btn-ghost text-danger btn-delete" data-id="${item.id}" data-module="contact_messages">Delete</button>
                    </td></tr>`;
            }
            $tbody.append(row);
        });
    }

    // ────────────────────────────────────────────
    // OPEN ADD MODALS
    // ────────────────────────────────────────────
    $('#btnAddCourse').on('click', () => { $('#courseForm')[0].reset(); $('#courseModal').removeAttr('data-edit-id'); $('#courseModal').modal('show'); });
    $('#btnAddFaculty').on('click', () => { $('#facultyForm')[0].reset(); $('#facultyModal').removeAttr('data-edit-id'); $('#facultyModal').modal('show'); });
    $('#btnAddStudent').on('click', () => { $('#studentForm')[0].reset(); $('#studentModal').removeAttr('data-edit-id'); $('#studentModal').modal('show'); });
    $('#btnAddSpecialization').on('click', () => { $('#specializationForm')[0].reset(); $('#specializationModal').removeAttr('data-edit-id'); $('#specializationModal').modal('show'); });
    $('#btnAddEvent').on('click', () => {
        $('#eventForm')[0].reset();
        $('#evFeatured').prop('checked', false);
        $('#eventModal').removeAttr('data-edit-id');
        $('#eventModalLabel').text('Add New Event');
        $('#eventModal').modal('show');
    });

    // ────────────────────────────────────────────
    // EDIT HANDLER
    // ────────────────────────────────────────────
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
            $('#facultyDept').val(item.department);
            $('#facultyModal').attr('data-edit-id', id).modal('show');
        } else if (module === 'students') {
            $('#studentName').val(item.name);
            $('#studentIdField').val(item.student_id);
            $('#studentEmail').val(item.email);
            $('#studentDept').val(item.department);
            $('#studentModal').attr('data-edit-id', id).modal('show');
        } else if (module === 'events') {
            $('#evTitle').val(item.title);
            $('#evType').val(item.type);
            $('#evDate').val(item.event_date);
            $('#evTime').val(item.event_time);
            $('#evLocation').val(item.location);
            $('#evSeats').val(item.seats_total);
            $('#evFeatured').prop('checked', item.is_featured);
            $('#evDesc').val(item.description);
            $('#eventModalLabel').text('Edit Event');
            $('#eventModal').attr('data-edit-id', id).modal('show');
        } else if (module === 'specializations') {
            $('#specTitle').val(item.title);
            $('#specTag').val(item.tag);
            $('#specCourses').val(item.course_count);
            $('#specFaculty').val(item.faculty_count);
            $('#specDesc').val(item.description);
            $('#specializationModal').attr('data-edit-id', id).modal('show');
        }
    });

    // ────────────────────────────────────────────
    // VIEW REGISTRATIONS
    // ────────────────────────────────────────────
    $(document).on('click', '.btn-view-regs', async function () {
        const eventId = $(this).attr('data-id');
        const eventTitle = $(this).attr('data-title');
        $('#registrationsModalTitle').text(`Registrations — ${eventTitle}`);
        $('#registrations-tbody').html('<tr><td colspan="5" class="text-center py-3"><div class="spinner-border spinner-border-sm text-secondary"></div></td></tr>');
        $('#registrationsModal').modal('show');

        try {
            const { data, error } = await supabase.from('event_registrations').select('*').eq('event_id', eventId).order('registered_at', { ascending: false });
            if (error) throw error;
            const $tbody = $('#registrations-tbody');
            $tbody.empty();
            if (!data || data.length === 0) {
                $tbody.html('<tr><td colspan="5" class="text-center py-3 text-secondary">No registrations yet.</td></tr>');
                return;
            }
            data.forEach((r, i) => {
                $tbody.append(`<tr>
                    <td>${i + 1}</td>
                    <td>${r.student_name}</td>
                    <td>${r.student_email}</td>
                    <td>${r.student_id || '—'}</td>
                    <td>${new Date(r.registered_at).toLocaleString()}</td>
                </tr>`);
            });
        } catch (e) {
            $('#registrations-tbody').html(`<tr><td colspan="5" class="text-center text-danger">${e.message}</td></tr>`);
        }
    });

    // ────────────────────────────────────────────
    // STUDENT ENROLLMENTS & OVERRIDES
    // ────────────────────────────────────────────
    $(document).on('click', '.btn-student-details', async function () {
        const studentId = $(this).attr('data-id');
        const studentName = $(this).attr('data-name');
        
        $('#enrollmentsOverrideModalTitle').text(`Enrollments — ${studentName}`);
        $('#student-enrollments-tbody').html('<tr><td colspan="4" class="text-center py-3"><div class="spinner-border spinner-border-sm text-secondary"></div></td></tr>');
        $('#enrollmentsOverrideModal').modal('show');

        fetchStudentEnrollments(studentId);
    });

    async function fetchStudentEnrollments(studentId) {
        try {
            const { data, error } = await supabase
                .from('enrollments')
                .select('*')
                .eq('student_id', studentId)
                .order('enrolled_at', { ascending: false });

            if (error) throw error;
            
            const $tbody = $('#student-enrollments-tbody');
            $tbody.empty();
            
            if (!data || data.length === 0) {
                $tbody.html('<tr><td colspan="4" class="text-center py-3 text-secondary">No enrollments found.</td></tr>');
                return;
            }

            data.forEach(e => {
                const statusClass = e.status === 'completed' ? 'bg-success' : 'bg-primary';
                $tbody.append(`
                    <tr>
                        <td><strong>${e.course_title}</strong><br><small class="text-secondary">${e.course_id}</small></td>
                        <td><span class="badge ${statusClass}">${e.status}</span></td>
                        <td><span class="fw-bold">${e.certificate_count || 0}</span></td>
                        <td class="text-end">
                            <div class="btn-group">
                                <button class="btn btn-sm btn-outline-secondary btn-toggle-status" data-id="${e.id}" data-status="${e.status}" data-sid="${studentId}" title="Toggle Completion Status">
                                    ${e.status === 'completed' ? 'Mark Active' : 'Mark Completed'}
                                </button>
                            </div>
                        </td>
                    </tr>
                `);
            });
        } catch (e) {
            $('#student-enrollments-tbody').html(`<tr><td colspan="4" class="text-center text-danger">${e.message}</td></tr>`);
        }
    }

    $(document).on('click', '.btn-toggle-status', async function () {
        const id = $(this).attr('data-id');
        const currentStatus = $(this).attr('data-status');
        const studentId = $(this).attr('data-sid');
        const newStatus = currentStatus === 'completed' ? 'active' : 'completed';
        const newCertCount = newStatus === 'completed' ? 1 : 0;
        
        try {
            const { error } = await supabase.from('enrollments')
                .update({ status: newStatus, certificate_count: newCertCount })
                .eq('id', id);
            if (error) throw error;
            fetchStudentEnrollments(studentId);
        } catch (e) {
            alert('Failed to update status: ' + e.message);
        }
    });

    // ────────────────────────────────────────────
    // READ MESSAGE
    // ────────────────────────────────────────────
    $(document).on('click', '.btn-read-msg', function () {
        const id = $(this).attr('data-id');
        const item = moduleData['contact_messages'].find(i => String(i.id) === String(id));
        if (!item) return;

        $('#readMsgName').text(item.name);
        $('#readMsgEmail').text(item.email);
        $('#readMsgDate').text(new Date(item.created_at).toLocaleString());
        $('#readMsgSubject').text(item.subject || 'General Inquiry');
        $('#readMsgContent').text(item.message);

        $('#readMessageModal').modal('show');
    });

    // ────────────────────────────────────────────
    // SAVE HANDLERS
    // ────────────────────────────────────────────

    // SAVE EVENT
    $('#btnSaveEvent').on('click', async function () {
        const title = $('#evTitle').val().trim();
        const date = $('#evDate').val();
        if (!title || !date) return showAdminAlert('Title and Date are required.');

        const seats = parseInt($('#evSeats').val()) || 50;
        const editId = $('#eventModal').attr('data-edit-id');

        const payload = {
            title,
            type: $('#evType').val(),
            event_date: date,
            event_time: $('#evTime').val().trim(),
            location: $('#evLocation').val().trim(),
            seats_total: seats,
            seats_remaining: editId ? undefined : seats, // only set on create
            is_featured: $('#evFeatured').is(':checked'),
            description: $('#evDesc').val().trim()
        };

        // Remove undefined on edit
        if (editId) delete payload.seats_remaining;

        // Show inline error in modal
        const $modalErr = $('#eventModal .modal-body').find('#ev-save-error');
        $modalErr.length === 0 && $('#eventModal .modal-body').prepend('<div id="ev-save-error" class="alert alert-danger d-none small py-2 mb-3"></div>');
        try {
            if (editId) {
                const { error } = await supabase.from('events').update(payload).eq('id', editId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('events').insert([payload]);
                if (error) throw error;
            }
            $('#eventModal').modal('hide');
            initModuleData('events');
            showAdminAlert('Event saved successfully!', 'success');
        } catch (e) {
            console.error('Save Event Error:', e);
            const isTableMissing = e.message && e.message.includes('schema cache');
            const msg = isTableMissing
                ? 'The <strong>events</strong> table does not exist yet. Please run <code>events_setup.sql</code> in your Supabase SQL Editor first, then try again.'
                : 'Save failed: ' + e.message;
            $('#ev-save-error').removeClass('d-none').html('⚠️ ' + msg);
            $(this).prop('disabled', false).text('Save Event');
        }
    });

    // SAVE COURSE
    $('#btnSaveCourse').on('click', async function () {
        const title = $('#formTitle').val().trim();
        const instructor = $('#formInstructor').val().trim();
        if (!title || !instructor) return showAdminAlert('Title and Instructor are required.');
        const payload = { title, instructor, department: 'CSE', description: $('#formDesc').val().trim() };
        const editId = $('#courseModal').attr('data-edit-id');
        try {
            if (editId) { const { error } = await supabase.from('courses').update(payload).eq('id', editId); if (error) throw error; }
            else { payload.id = 'C-' + Date.now(); const { error } = await supabase.from('courses').insert([payload]); if (error) throw error; }
            $('#courseModal').modal('hide');
            initModuleData('courses');
            showAdminAlert('Course saved!', 'success');
        } catch (e) { console.error(e); showAdminAlert('Save failed: ' + e.message); }
    });

    // SAVE FACULTY
    $('#btnSaveFaculty').on('click', async function () {
        const name = $('#facultyName').val().trim();
        if (!name) return showAdminAlert('Faculty name is required.');
        const payload = { name, designation: $('#facultyDesignation').val(), email: $('#facultyEmail').val(), department: $('#facultyDept').val() };
        const editId = $('#facultyModal').attr('data-edit-id');
        try {
            if (editId) { const { error } = await supabase.from('faculty').update(payload).eq('id', editId); if (error) throw error; }
            else { const { error } = await supabase.from('faculty').insert([payload]); if (error) throw error; }
            $('#facultyModal').modal('hide');
            initModuleData('faculty');
            showAdminAlert('Faculty saved!', 'success');
        } catch (e) { console.error(e); showAdminAlert('Save failed: ' + e.message); }
    });

    // SAVE STUDENT
    $('#btnSaveStudent').on('click', async function () {
        const name = $('#studentName').val().trim();
        if (!name) return showAdminAlert('Student name is required.');
        const payload = { 
            name, 
            student_id: $('#studentIdField').val().trim(),
            email: $('#studentEmail').val().trim(),
            department: $('#studentDept').val() 
        };
        const editId = $('#studentModal').attr('data-edit-id');
        try {
            if (editId) { 
                const { error } = await supabase.from('students').update(payload).eq('id', editId); 
                if (error) throw error; 
            }
            else { 
                const { error } = await supabase.from('students').insert([payload]); 
                if (error) throw error; 
            }
            $('#studentModal').modal('hide');
            initModuleData('students');
            showAdminAlert('Student record saved!', 'success');
        } catch (e) { console.error(e); showAdminAlert('Save failed: ' + e.message); }
    });

    // SAVE SPECIALIZATION
    $('#btnSaveSpecialization').on('click', async function () {
        const title = $('#specTitle').val().trim();
        const tag = $('#specTag').val().trim();
        if (!title || !tag) return showAdminAlert('Title and Tag are required.');
        const payload = { title, tag, course_count: parseInt($('#specCourses').val()) || 0, faculty_count: parseInt($('#specFaculty').val()) || 0, description: $('#specDesc').val().trim() };
        const editId = $('#specializationModal').attr('data-edit-id');
        try {
            if (editId) { const { error } = await supabase.from('specializations').update(payload).eq('id', editId); if (error) throw error; }
            else { const { error } = await supabase.from('specializations').insert([payload]); if (error) throw error; }
            $('#specializationModal').modal('hide');
            initModuleData('specializations');
            showAdminAlert('Specialization saved!', 'success');
        } catch (e) { console.error(e); showAdminAlert('Save failed: ' + e.message); }
    });

    // ────────────────────────────────────────────
    // DELETE HANDLER
    // ────────────────────────────────────────────
    $(document).on('click', '.btn-delete', function () {
        $('#deleteModal').attr('data-id', $(this).attr('data-id')).attr('data-module', $(this).attr('data-module')).modal('show');
    });

    $('#btnConfirmDelete').on('click', async function () {
        const id = $('#deleteModal').attr('data-id');
        const module = $('#deleteModal').attr('data-module');
        try {
            const { error } = await supabase.from(module).delete().eq('id', id);
            if (error) throw error;
            $('#deleteModal').modal('hide');
            initModuleData(module);
            showAdminAlert('Record deleted.', 'success');
        } catch (e) { console.error(e); showAdminAlert('Delete failed: ' + e.message); }
    });

    // Logout Handlers
    $('#btnLogout, #btnMobileLogout').on('click', function (e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            sessionStorage.removeItem('adminLoggedIn');
            window.location.href = '../index.html';
        }
    });
});
