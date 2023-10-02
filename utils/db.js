const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://booqwbwszbdfkeqpsbdi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvb3F3YndzemJkZmtlcXBzYmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYxOTU5OTQsImV4cCI6MjAxMTc3MTk5NH0.YOypYo4HS57nrdTIkF8itBJ0sp-_3OwR9Laf3v98N2s"
);

module.exports = supabase;
