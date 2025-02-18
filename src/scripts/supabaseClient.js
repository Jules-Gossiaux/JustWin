// import { createClient } from '@supabase/supabase-js'
// import dotenv from 'dotenv'

// dotenv.config()

// const supabaseUrl = process.env.SUPABASE_URL
// const supabaseAnonKey = process.env.SUPABASE_ANON_KEY



// export const supabase = createClient(supabaseUrl, supabaseAnonKey)
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Vérifier que les variables sont bien définies
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Les variables d'environnement SUPABASE_URL et SUPABASE_ANON_KEY doivent être définies.");
}

// Créer le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
