import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

const getEnv = (key) => {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].replace(/["'\r]/g, '').trim() : '';
};

const url = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const anonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

async function getOpenAPI() {
  const res = await fetch(`${url}/rest/v1/`, {
    headers: { 'apikey': anonKey }
  });
  const data = await res.json();
  const artistsSchema = data.definitions.artists;
  console.log("Artists Schema:", JSON.stringify(artistsSchema.properties, null, 2));
}

getOpenAPI();
