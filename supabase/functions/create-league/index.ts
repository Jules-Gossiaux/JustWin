// Suivez ce guide d'installation pour intégrer le serveur de langage Deno avec votre éditeur :
// https://deno.land/manual/getting_started/setup_your_environment
// Cela permet d'activer l'autocomplétion, la navigation vers la définition, etc.

// Import des modules nécessaires
import "jsr:@supabase/functions-js/edge-runtime.d.ts"  // Définitions de types pour l'environnement Edge Functions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";  // Module Deno pour créer un serveur HTTP
import { createClient } from "https://esm.sh/@supabase/supabase-js";  // Client Supabase

// Définition de l'interface League qui décrit la structure d'une ligue
interface League {
  dateDebut: string;      // Date de début de la ligue au format ISO
  dateFin: string;        // Date de fin de la ligue au format ISO
  joueurs: any[];         // Tableau des joueurs participants
  buyIn: number;          // Montant d'entrée pour participer
  classement: any[];      // Tableau du classement des joueurs
  type: 'vitesse' | 'precision' | 'endurance';  // Type de ligue avec valeurs spécifiques
  statut: 'en_attente' | 'en_cours' | 'terminee';  // État actuel de la ligue
}

// Fonction qui retourne aléatoirement un type de ligue
const determinerTypeLeague = (): League['type'] => {
  const types: League['type'][] = ['vitesse', 'precision', 'endurance'];
  return types[Math.floor(Math.random() * types.length)];
};

// Fonction qui retourne aléatoirement un montant de buy-in
const determinerBuyIn = (): number => {
  const buyIns = [100, 200, 500, 1000];
  return buyIns[Math.floor(Math.random() * buyIns.length)];
};

// Point d'entrée de l'Edge Function
serve(async (req) => {
  // Vérification de l'authentification
  const authHeader = req.headers.get('Authorization')
  if (!authHeader || !authHeader.includes(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '')) {
    return new Response(
      JSON.stringify({ error: 'Non autorisé' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    // Création d'une instance du client Supabase avec les variables d'environnement
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )
    
    // Création d'une nouvelle ligue
    const maintenant = new Date();
    const nouvelleLeague: League = {
      dateDebut: maintenant.toISOString(),  // Date actuelle
      dateFin: new Date(maintenant.getTime() + 60 * 60 * 1000).toISOString(),  // Date actuelle + 1 heure
      joueurs: [],  // Tableau vide initial
      buyIn: determinerBuyIn(),  // Montant aléatoire
      classement: [],  // Tableau vide initial
      type: determinerTypeLeague(),  // Type aléatoire
      statut: 'en_attente'  // Statut initial
    };

    // Insertion de la nouvelle ligue dans la base de données
    const { data, error } = await supabase
      .from('leagues')
      .insert([nouvelleLeague])
      .select();

    // Gestion des erreurs de base de données
    if (error) throw error;

    // Retour d'une réponse réussie
    return new Response(
      JSON.stringify({ message: 'League créée avec succès', data }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    // Gestion des erreurs générales
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})


/* Pour invoquer localement :

  1. Exécutez `supabase start` (voir : https://supabase.com/docs/reference/cli/supabase-start)
  2. Faites une requête HTTP :

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-league' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
