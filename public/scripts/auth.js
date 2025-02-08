//Gestion de l'authentifiacation
import supabase from './supabaseClient.js';

// Fonction pour se connecter avec Google
async function signInWithGoogle() {
    try {
        document.getElementById('message').textContent = 'Connexion en cours...';

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });

        if (error) throw error;
    } catch (error) {
        document.getElementById('message').textContent = 'Erreur: ' + error.message;
    }
}

// Vérifier si l'utilisateur est déjà connecté au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        document.getElementById('message').textContent = `Connecté en tant que: ${session.user.email}`;
    }
});

// Exporter la fonction pour l'utiliser ailleurs si besoin
export { signInWithGoogle };
