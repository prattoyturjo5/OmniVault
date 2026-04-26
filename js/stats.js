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

            if (!courseError) {
                const displayCount = courseCount > 0 ? courseCount : 0;
                $('#stat-courses-band').text(displayCount + "+");
                $('#stat-courses-hero').text(displayCount + "+");
            }

            // 2. Fetch Faculty Count
            const { count: facultyCount, error: facultyError } = await supabase
                .from('faculty')
                .select('*', { count: 'exact', head: true });

            if (!facultyError) {
                // If we have very few real rows but want to keep the "vibe", 
                // we can either show real or real + offset. 
                // For a "real" sync, we show real.
                $('#stat-faculty-band').text((facultyCount || 0) + "+");
            } else {
                console.warn("Faculty table might not exist yet. Run stats_setup.sql");
            }

            // 3. Fetch Student Count
            const { count: studentCount, error: studentError } = await supabase
                .from('students')
                .select('*', { count: 'exact', head: true });

            if (!studentError) {
                // Formatting large numbers with commas
                const formatted = (studentCount || 0).toLocaleString();
                $('#stat-students-band').text(formatted);
                $('#stat-students-hero').text(formatted + "+");
            } else {
                console.warn("Students table might not exist yet. Run stats_setup.sql");
            }

        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    }

    // Initial load
    updateStats();
});
