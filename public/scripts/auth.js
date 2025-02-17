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

async function handleAuthStateChange(session) {
    const loginButton = document.getElementById('google-signin');
    
    if (session) {
        // L'utilisateur est connecté
        const userEmail = session.user.email;
        
        // Créer un nouvel élément pour afficher l'email
        const emailDisplay = document.createElement('span');
        emailDisplay.className = 'user-email';
        emailDisplay.id = 'profile-email';
        emailDisplay.textContent = userEmail;
        
        // Remplacer le bouton par l'email
        loginButton.parentNode.replaceChild(emailDisplay, loginButton);
    } else {
        // L'utilisateur est déconnecté
        const emailDisplay = document.querySelector('.user-email');
        if (emailDisplay) {
            // Recréer le bouton de connexion
            const loginButton = document.createElement('button');
            loginButton.className = 'logInButton btn';
            loginButton.id = 'google-signin';
            loginButton.textContent = 'se connecter';
            
            // Remettre le bouton à la place de l'email
            emailDisplay.parentNode.replaceChild(loginButton, emailDisplay);
            
            // Réattacher l'event listener pour la connexion
            loginButton.addEventListener('click', signInWithGoogle);
        }
    }
}

// Ajouter l'écouteur d'événements pour les changements d'authentification
supabase.auth.onAuthStateChange((event, session) => {
    handleAuthStateChange(session);
});

// Exporter les fonctions
export { signInWithGoogle, checkSession };
