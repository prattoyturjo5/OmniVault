// file: js/supabase-client.js

(function() {
    // If window.supabase is already a client (has the 'from' method), don't re-initialize
    if (window.supabase && typeof window.supabase.from === 'function') return;

    const supabaseUrl = 'https://ulvuilebcongklvzcrba.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsdnVpbGViY29uZ2tsdnpjcmJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNjgyMjUsImV4cCI6MjA5Mjc0NDIyNX0.dotxvwPRU3-xVv5gMv5StSv8Y-EL2sXPGMcN43h3-3s';

    // Ensure the library is loaded
    if (typeof supabase === 'undefined') {
        console.error('Supabase library not found. Make sure the CDN script is loaded before supabase-client.js');
        return;
    }

    // Create a single supabase client for interacting with your database
    // We use the 'supabase' global from the CDN to create the client
    const client = supabase.createClient(supabaseUrl, supabaseKey);
    
    // Export the client to the window object
    window.supabase = client;
})();
