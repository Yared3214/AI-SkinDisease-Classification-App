import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto'; // ✅ fixes URL.protocol error

const SUPABASE_URL = 'https://vxhmdftrzweaehofhoqr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aG1kZnRyendlYWVob2Zob3FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3NzIzMDEsImV4cCI6MjA2NDM0ODMwMX0.jRrigizZgep_68CRbCmNrN7EWIkJXLPSpxdFQGKMc8Y';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false, // React Native doesn't support localStorage
    autoRefreshToken: false,
  },
});
