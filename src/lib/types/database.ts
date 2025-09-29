// export type Json =
//   | string
//   | number
//   | boolean
//   | null
//   | { [key: string]: Json | undefined }
//   | Json[]

// export interface Database {
//   public: {
//     Tables: {
//       users: {
//         Row: {
//           id: string
//           email: string
//           name: string | null
//           created_at: string
//           updated_at: string
//         }
//         Insert: {
//           id?: string
//           email: string
//           name?: string | null
//           created_at?: string
//           updated_at?: string
//         }
//         Update: {
//           id?: string
//           email?: string
//           name?: string | null
//           updated_at?: string
//         }
//       }
//       tasks: {
//         Row: {
//           id: string
//           title: string
//           description: string | null
//           user_id: string
//           completed: boolean
//           created_at: string
//           updated_at: string
//         }
//         Insert: {
//           id?: string
//           title: string
//           description?: string | null
//           user_id: string
//           completed?: boolean
//           created_at?: string
//           updated_at?: string
//         }
//         Update: {
//           id?: string
//           title?: string
//           description?: string | null
//           user_id?: string
//           completed?: boolean
//           updated_at?: string
//         }
//       }
//       terms_of_service: {
//         Row: {
//           id: string
//           title: string
//           content: string
//           version: string
//           effective_date: string
//           created_at: string
//         }
//         Insert: {
//           id?: string
//           title: string
//           content: string
//           version: string
//           effective_date: string
//           created_at?: string
//         }
//         Update: {
//           id?: string
//           title?: string
//           content?: string
//           version?: string
//           effective_date?: string
//         }
//       }
//     }
//     Views: {
//       [_ in never]: never
//     }
//     Functions: {
//       [_ in never]: never
//     }
//     Enums: {
//       [_ in never]: never
//     }
//   }
// }

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          name: string
          image: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          name: string
          image: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          name?: string
          image?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string
          status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
          priority: 'LOW' | 'MEDIUM' | 'HIGH'
          due_date: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title?: string
          description: string
          status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
          priority?: 'LOW' | 'MEDIUM' | 'HIGH'
          due_date: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
          priority?: 'LOW' | 'MEDIUM' | 'HIGH'
          due_date?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      terms_of_service: {
        Row: {
          id: string
          title: string
          content: string
          version: string
          effective_date: string
          created_at: string
        }
        Insert: {
          id?: string
          title?: string
          content: string
          version: string
          effective_date: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          version?: string
          effective_date?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      task_status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
      task_priority: 'LOW' | 'MEDIUM' | 'HIGH'
    }
  }
}

// Helper types for easier usage
export type User = Database['public']['Tables']['users']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type TermsOfService =
  Database['public']['Tables']['terms_of_service']['Row']

export type CreateTask = Database['public']['Tables']['tasks']['Insert']
export type UpdateTask = Database['public']['Tables']['tasks']['Update']

export type CreateUser = Database['public']['Tables']['users']['Insert']
export type UpdateUser = Database['public']['Tables']['users']['Update']
