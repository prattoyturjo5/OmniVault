// file: js/stats.js

$(document).ready(function() {
    // Only run if stat elements exist
    if ($('#stat-courses-band').length === 0) return;

    async function updateStats() {
        try {
            // 1. Fetch Course Count
            const { count: courseCount, error: courseError } = await supabase
                .from('courses')
                .select('*', { count: 'exact', head: true });

            if (courseError) {
                console.error("Stats Error (Courses):", courseError.message);
                $('#stat-courses-band, #stat-courses-hero').text("Check DB");
            } else {
                const val = courseCount || 0;
                $('#stat-courses-band, #stat-courses-hero').text(val);
            }

            // 2. Fetch Faculty Count
            const { count: facultyCount, error: facultyError } = await supabase
                .from('faculty')
                .select('*', { count: 'exact', head: true });

            if (facultyError) {
                console.error("Stats Error (Faculty):", facultyError.message);
                $('#stat-faculty-band').text("Check DB");
            } else {
                $('#stat-faculty-band').text(facultyCount || 0);
            }

            // 3. Fetch Student Count
            const { count: studentCount, error: studentError } = await supabase
                .from('students')
                .select('*', { count: 'exact', head: true });

            if (studentError) {
                console.error("Stats Error (Students):", studentError.message);
                $('#stat-students-band, #stat-students-hero').text("Check DB");
            } else {
                const val = studentCount || 0;
                $('#stat-students-band, #stat-students-hero').text(val);
            }

            // 4. Fetch Specialization Count
            const { count: specCount, error: specError } = await supabase
                .from('specializations')
                .select('*', { count: 'exact', head: true });
            
            if (!specError && specCount !== null) {
                if (specCount > 1) {
                    $('#stat-spec-band').text(specCount + " Fields");
                } else if (specCount === 1) {
                    $('#stat-spec-band').text("CSE Only");
                }
            }

            if (courseCount === 0 && facultyCount === 0 && studentCount === 0) {
                console.warn("All stats returned 0. This strongly suggests RLS is blocking the 'anon' role.");
            }

        } catch (err) {
            console.error("Stats Sync Error:", err);
        }
    }

    // Initial sync
    updateStats();

    // "Real-time" sync: Refresh every 30 seconds
    setInterval(updateStats, 30000);
});
