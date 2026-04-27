// file: js/migrate.js
// Run this script from a browser console on any page with supabase-client.js loaded
// e.g. Open index.html, open DevTools Console, paste this script.

async function migrateCourses() {
    try {
        const response = await fetch('../data/courses.json');
        if (!response.ok) {
            // Try root path if inside pages/
            const rootResponse = await fetch('data/courses.json');
            if (!rootResponse.ok) throw new Error("Could not find courses.json");
            var courses = await rootResponse.json();
        } else {
            var courses = await response.json();
        }

        const { data, error } = await supabase
            .from('courses')
            .upsert(courses, { onConflict: 'id' });

        if (error) {
            alert("Migration failed! Check console.");
        } else {
            alert("Migration successful!");
        }
    } catch (err) {
        alert("Error during migration: " + err.message);
    }
}

// migrateCourses(); // Uncomment to run automatically or call from console
