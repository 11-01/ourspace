import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nmukkxmctxrzhfqmoqhh.supabase.co'
const supabaseAnonKey = 'sb_publishable_zBijBHrXci1krDFCaQdmtw_roMiyEnB'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
