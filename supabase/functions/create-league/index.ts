// Suivez ce guide d'installation pour intégrer le serveur de langage Deno avec votre éditeur :
// https://deno.land/manual/getting_started/setup_your_environment
// Cela permet d'activer l'autocomplétion, la navigation vers la définition, etc.

// Import des modules nécessaires
import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Récupération des variables d'environnement
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Interface pour la structure d'une ligue
interface League {
  dateDebut: string;
  dateFin: string;
  joueurs: any[];
  buyIn: number;
  classement: any[];
  type: "vitesse" | "precision" | "endurance";
  statut: "en_attente" | "en_cours" | "terminee";
}

// Fonction pour choisir un type de ligue au hasard
const determinerTypeLeague = (): League["type"] => {
  const types: League["type"][] = ["vitesse", "precision", "endurance"];
  return types[Math.floor(Math.random() * types.length)];
};

// Fonction pour choisir un buy-in aléatoire
const determinerBuyIn = (): number => {
  const buyIns = [100, 200, 500, 1000];
  return buyIns[Math.floor(Math.random() * buyIns.length)];
};

// Serveur qui écoute les requêtes HTTP
serve(async (req) => {
  // Vérification de l'authentification
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || authHeader !== `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`) {
    return new Response(JSON.stringify({ error: "Non autorisé" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    console.log("Création d'une nouvelle ligue...");

    // Initialisation du client Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Définition de la nouvelle ligue
    const maintenant = new Date();
    const nouvelleLeague: League = {
      dateDebut: maintenant.toISOString(),
      dateFin: new Date(maintenant.getTime() + 60 * 60 * 1000).toISOString(), // +1h
      joueurs: [],
      buyIn: determinerBuyIn(),
      classement: [],
      type: determinerTypeLeague(),
      statut: "en_attente",
    };

    // Insertion dans la base de données Supabase
    const { data, error } = await supabase.from("leagues").insert([nouvelleLeague]).select();

    if (error) throw error;

    console.log("Ligue créée avec succès :", data);

    return new Response(
      JSON.stringify({ message: "Ligue créée avec succès", data }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erreur lors de la création de la ligue :", error.message);

    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 400 }
    );
  }
});



/* Pour invoquer localement :

  1. Exécutez `supabase start` (voir : https://supabase.com/docs/reference/cli/supabase-start)
  2. Faites une requête HTTP :

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-league' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
