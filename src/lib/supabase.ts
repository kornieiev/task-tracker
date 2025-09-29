import { createClient } from '@supabase/supabase-js'
import { Database } from './types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Для демонстрации создаем клиент с заглушками
// В продакшене здесь будут реальные URL и ключи Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // Отключаем персистентную сессию для демо
  }
})

// Для серверных операций
export const createServerSupabaseClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key'
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false
    }
  })
}
