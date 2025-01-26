// Configuration de Supabase
const supabaseUrl = 'https://wmghsskigtjhzvqklawf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtZ2hzc2tpZ3RqaHp2cWtsYXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyOTAxMTIsImV4cCI6MjA1Mjg2NjExMn0.DsPtv0qXg_0zPEDfciDuPIatARa63Q6-L1G8v4aAL5o';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);


// Fonction pour se connecter avec Google
async function signInWithGoogle() {
    try {
        // Afficher un message de chargement
        const messageElement = document.getElementById('message');
        messageElement.textContent = 'Connexion en cours...';

        // Appel à l'API Supabase pour la connexion Google
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // Redirection vers la page d'accueil après connexion réussie
                redirectTo: window.location.origin
            }
        });

        if (error) throw error;
        
        // En cas de succès (ne sera probablement pas affiché à cause de la redirection)
        messageElement.textContent = 'Connexion réussie!';
        
    } catch (error) {
        // Affichage des erreurs éventuelles
        document.getElementById('message').textContent = 'Erreur: ' + error.message;
    }
}

// Vérifier si l'utilisateur est déjà connecté au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (session) {
        // Si l'utilisateur est connecté, afficher un message
        document.getElementById('message').textContent = 'Déjà connecté!';
    }
});