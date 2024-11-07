export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      crosswords: {
        Row: {
          created_at: string | null
          created_by: string | null
          data: Json | null
          description: string | null
          difficulty: Database["public"]["Enums"]["crossword_difficulty"]
          id: number
          is_public: boolean | null
          status: string | null
          tags: string[] | null
          time_limit: unknown | null
          title: string
          topic: Database["public"]["Enums"]["crossword_topic"] | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          data?: Json | null
          description?: string | null
          difficulty: Database["public"]["Enums"]["crossword_difficulty"]
          id?: number
          is_public?: boolean | null
          status?: string | null
          tags?: string[] | null
          time_limit?: unknown | null
          title: string
          topic?: Database["public"]["Enums"]["crossword_topic"] | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          data?: Json | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["crossword_difficulty"]
          id?: number
          is_public?: boolean | null
          status?: string | null
          tags?: string[] | null
          time_limit?: unknown | null
          title?: string
          topic?: Database["public"]["Enums"]["crossword_topic"] | null
        }
        Relationships: [
          {
            foreignKeyName: "crosswords_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_progress: {
        Row: {
          created_at: string
          difficulty: Database["public"]["Enums"]["crossword_difficulty"]
          id: number
          profile_id: string | null
          topic: Database["public"]["Enums"]["crossword_topic"]
        }
        Insert: {
          created_at?: string
          difficulty: Database["public"]["Enums"]["crossword_difficulty"]
          id?: number
          profile_id?: string | null
          topic: Database["public"]["Enums"]["crossword_topic"]
        }
        Update: {
          created_at?: string
          difficulty?: Database["public"]["Enums"]["crossword_difficulty"]
          id?: number
          profile_id?: string | null
          topic?: Database["public"]["Enums"]["crossword_topic"]
        }
        Relationships: [
          {
            foreignKeyName: "learning_progress_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          username: string | null
        }
        Insert: {
          id: string
          username?: string | null
        }
        Update: {
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          id: number
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          id?: number
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          id?: number
          permission?: Database["public"]["Enums"]["app_permission"]
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      user_activity_logs: {
        Row: {
          activity_timestamp: string | null
          activity_type: string | null
          crossword_id: number | null
          id: number
          profile_id: string | null
        }
        Insert: {
          activity_timestamp?: string | null
          activity_type?: string | null
          crossword_id?: number | null
          id?: number
          profile_id?: string | null
        }
        Update: {
          activity_timestamp?: string | null
          activity_type?: string | null
          crossword_id?: number | null
          id?: number
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_logs_crossword_id_fkey"
            columns: ["crossword_id"]
            isOneToOne: false
            referencedRelation: "crosswords"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_activity_logs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed: boolean | null
          crossword_id: number | null
          current_answers: Json | null
          id: number
          last_accessed: string | null
          profile_id: string | null
          time_spent: unknown | null
        }
        Insert: {
          completed?: boolean | null
          crossword_id?: number | null
          current_answers?: Json | null
          id?: number
          last_accessed?: string | null
          profile_id?: string | null
          time_spent?: unknown | null
        }
        Update: {
          completed?: boolean | null
          crossword_id?: number | null
          current_answers?: Json | null
          id?: number
          last_accessed?: string | null
          profile_id?: string | null
          time_spent?: unknown | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_crossword_id_fkey"
            columns: ["crossword_id"]
            isOneToOne: false
            referencedRelation: "crosswords"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: number
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_scores: {
        Row: {
          completed: boolean | null
          crossword_id: number | null
          id: number
          profile_id: string | null
          score: number | null
          total_time_spent: unknown | null
        }
        Insert: {
          completed?: boolean | null
          crossword_id?: number | null
          id: number
          profile_id?: string | null
          score?: number | null
          total_time_spent?: unknown | null
        }
        Update: {
          completed?: boolean | null
          crossword_id?: number | null
          id?: number
          profile_id?: string | null
          score?: number | null
          total_time_spent?: unknown | null
        }
        Relationships: [
          {
            foreignKeyName: "user_scores_crossword_id_fkey"
            columns: ["crossword_id"]
            isOneToOne: false
            referencedRelation: "crosswords"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_scores_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authorize: {
        Args: {
          requested_permission: Database["public"]["Enums"]["app_permission"]
        }
        Returns: boolean
      }
      custom_access_token_hook: {
        Args: {
          event: Json
        }
        Returns: Json
      }
    }
    Enums: {
      app_permission: "crosswords.create"
      app_role: "admin"
      crossword_difficulty: "EASY" | "MEDIUM" | "HARD"
      crossword_topic: "SCRUM" | "PMBOK"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
