import { signInWithGoogle } from '../../public/scripts/auth.js';

// Attacher l'événement au bouton de connexion
document.getElementById('google-signin').addEventListener('click', signInWithGoogle);
