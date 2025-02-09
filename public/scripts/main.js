//Fichier de référence pour les scripts de la page frontend
console.log("main.js loaded");
import { signInWithGoogle, checkSession } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    checkSession();

    const googleButton = document.getElementById('google-signin');
    if (googleButton) {
        console.log("googleButton exists");
        
        googleButton.addEventListener('click', signInWithGoogle);
    }
});
