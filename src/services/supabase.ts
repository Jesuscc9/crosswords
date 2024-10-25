import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ijdmkgwagoezcofonjhd.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqZG1rZ3dhZ29lemNvZm9uamhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk4MTUxOTUsImV4cCI6MjA0NTM5MTE5NX0.D5X4NrjmFhett1wTNqaLIn0BAUsseIGA9GYr7sFCx5I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
