// file: js/stats.js

$(document).ready(function() {
    // Only run on the home page (where these elements exist)
    if ($('#stat-courses-band').length === 0) return;

    async function updateStats() {
        try {
            // 1. Fetch Course Count
            const { count: courseCount, error: courseError } = await supabase
                .from('courses')
                .select('*', { count: 'exact', head: true });

            if (courseError) {
                console.error("Stats Error (Courses):", courseError.message);
                $('#stat-courses-band').text("Check DB");
            } else {
                const displayCount = courseCount || 0;
                $('#stat-courses-band').text(displayCount + "+");
                $('#stat-courses-hero').text(displayCount + "+");
            }

            // 2. Fetch Faculty Count
            const { count: facultyCount, error: facultyError } = await supabase
                .from('faculty')
                .select('*', { count: 'exact', head: true });

            if (facultyError) {
                console.error("Stats Error (Faculty):", facultyError.message);
                $('#stat-faculty-band').text("Check DB");
            } else {
                $('#stat-faculty-band').text((facultyCount || 0) + "+");
            }

            // 3. Fetch Student Count
            const { count: studentCount, error: studentError } = await supabase
                .from('students')
                .select('*', { count: 'exact', head: true });

            if (studentError) {
                console.error("Stats Error (Students):", studentError.message);
                $('#stat-students-band').text("Check DB");
            } else {
                const formatted = (studentCount || 0).toLocaleString();
                $('#stat-students-band').text(formatted);
                $('#stat-students-hero').text(formatted + "+");
            }

            if (courseCount === 0 && facultyCount === 0 && studentCount === 0) {
                console.warn("All stats returned 0. This strongly suggests RLS is blocking the 'anon' role.");
            }
    }

    // Initial load
    updateStats();
});
