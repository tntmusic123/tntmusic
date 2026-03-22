import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
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

const supabase = createClient(url, anonKey);

async function check() {
  console.log("=== Checking 'artists' table ===");
  const { data: aData, error: aErr } = await supabase.from('artists').select('*').limit(1);
  if (aErr) console.error("artists select error:", aErr);
  else console.log("artists data:", aData);

  console.log("=== Checking 'inquiries' table ===");
  const { data: iData, error: iErr } = await supabase.from('inquiries').select('*').limit(1);
  if (iErr) console.error("inquiries select error:", iErr);
  else console.log("inquiries data:", iData);
  
  // Try inserting a dummy inquiry
  console.log("=== Testing inquiry insert ===");
  const { error: insErr } = await supabase.from('inquiries').insert({
    type: 'test',
    name: 'test',
    phone: 'test',
    status: 'unread'
  });
  if (insErr) console.error("Insert Error:", insErr);
  else console.log("Insert Success!");
  
  console.log("=== Testing artist insert ===");
  const { error: artErr } = await supabase.from('artists').insert({
    name: 'test',
    voice: 'test',
    field: 'test',
    image_url: 'test'
  });
  if (artErr) console.error("Artist Insert Error:", artErr);
  else console.log("Artist Insert Success!");
}
check();
