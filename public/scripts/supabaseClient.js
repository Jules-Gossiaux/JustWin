//Configuration Supabase
const supabaseUrl = 'https://ajqpdqgwowpmzpdcpvfi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqcXBkcWd3b3dwbXpwZGNwdmZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwMTA0NzUsImV4cCI6MjA1MzU4NjQ3NX0.YX1jhjEwrvwDdPPt1cm7H8FgWTZ7_MRZ1Hr0Yk8kYgM';

// Initialisation du client Supabase
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Export du client pour pouvoir l'utiliser ailleurs
export default supabase;
