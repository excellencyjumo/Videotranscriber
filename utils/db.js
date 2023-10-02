const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://booqwbwszbdfkeqpsbdi.supabase.co",
  "be680759d2964168f22fbbcecdeb8cd21d76d602"
);

module.exports = supabase;
