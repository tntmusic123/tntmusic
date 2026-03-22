import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkSchema() {
  console.log("Checking 'artists' table...");
  const { data, error } = await supabase.from("artists").select("*").limit(1);
  if (error) {
    console.error("Error accessing 'artists' table:", error.message);
  } else {
    console.log("Successfully accessed 'artists' table. Sample data:", data);
  }

  console.log("Checking storage bucket 'tnt-media'...");
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    console.error("Error listing buckets:", bucketError.message);
  } else {
    console.log("Buckets:", buckets.map(b => b.name));
  }
}

checkSchema();
