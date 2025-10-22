import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto'; // ✅ fixes URL.protocol error

const SUPABASE_URL = 'https://upxuvqswuvumrnrcqmkk.supabase.co';
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVweHV2cXN3dXZ1bXJucmNxbWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMDgzMTYsImV4cCI6MjA3NjY4NDMxNn0.wvkF8eFxSiI8cVFDDAGoba-4ui8I3nKAyXkfOofjEPw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false, // React Native doesn't support localStorage
    autoRefreshToken: false,
  },
});
