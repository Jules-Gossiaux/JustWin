import supabase from './supabaseClient.js';

// Fonction pour se connecter avec Google
async function signInWithGoogle() {
    try {
        document.getElementById('message').textContent = 'Connexion en cours...';

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                //redirige l'utilisateur vers la page d'accueil après la connexion
                redirectTo: "http://localhost:5000/public/index.html",
            }
        });

        if (error) throw error;
    } catch (error) {
        document.getElementById('message').textContent = 'Erreur: ' + error.message;
    }
}

// Fonction pour vérifier la session
async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        document.getElementById('message').textContent = `Connecté en tant que: ${session.user.email}`;
        //affiche dans la console le même message
        console.log(`Connecté en tant que: ${session.user.email}`);
    }
}

// Exporter les fonctions
export { signInWithGoogle, checkSession };
