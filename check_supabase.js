const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.resolve(__dirname, '.env.local'), 'utf8');
const env = {};
envContent.split('\n').forEach((line) => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: storeData, error: storeError } = await supabase
    .from('mcs_store')
    .select('*');

  if (storeError) {
    console.error('Error fetching mcs_store:', storeError);
  } else {
    console.log('--- mcs_store keys and lengths/values ---');
    storeData.forEach((row) => {
      console.log(`Key: ${row.key}`);
      if (Array.isArray(row.value)) {
        console.log(`  Type: Array, Length: ${row.value.length}`);
        row.value.forEach((item, idx) => {
          console.log(`  [${idx}]: ${item.email || 'no-email'} - ${item.name || 'no-name'}`);
        });
      } else {
        console.log(`  Type: ${typeof row.value}`);
      }
    });
  }
}

check();
