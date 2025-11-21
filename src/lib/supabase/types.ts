// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agendamentos: {
        Row: {
          criado_em: string | null
          data_procedimento: string
          duração: string | null
          "fallow-up-feedback": string | null
          hora_fim: string
          hora_inicio: string
          id: string
          lembrete_24h: string | null
          lembrete_24h_Enviado: string | null
          lembrete_3h: string | null
          lembrete_3h_Enviado: string | null
          localizacao: string | null
          nome_profissional: string
          numero: number | null
          observacoes_cliente: string | null
          paciente_id: string
          pacientes: string | null
          procedimento_id: string
          procedimentos_: string | null
          Status: string | null
        }
        Insert: {
          criado_em?: string | null
          data_procedimento: string
          duração?: string | null
          "fallow-up-feedback"?: string | null
          hora_fim: string
          hora_inicio: string
          id?: string
          lembrete_24h?: string | null
          lembrete_24h_Enviado?: string | null
          lembrete_3h?: string | null
          lembrete_3h_Enviado?: string | null
          localizacao?: string | null
          nome_profissional: string
          numero?: number | null
          observacoes_cliente?: string | null
          paciente_id: string
          pacientes?: string | null
          procedimento_id: string
          procedimentos_?: string | null
          Status?: string | null
        }
        Update: {
          criado_em?: string | null
          data_procedimento?: string
          duração?: string | null
          "fallow-up-feedback"?: string | null
          hora_fim?: string
          hora_inicio?: string
          id?: string
          lembrete_24h?: string | null
          lembrete_24h_Enviado?: string | null
          lembrete_3h?: string | null
          lembrete_3h_Enviado?: string | null
          localizacao?: string | null
          nome_profissional?: string
          numero?: number | null
          observacoes_cliente?: string | null
          paciente_id?: string
          pacientes?: string | null
          procedimento_id?: string
          procedimentos_?: string | null
          Status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_procedimento_id_fkey"
            columns: ["procedimento_id"]
            isOneToOne: false
            referencedRelation: "procedimentos"
            referencedColumns: ["id"]
          },
        ]
      }
      despesas: {
        Row: {
          criado_em: string | null
          data_despesa: string
          descricao: string
          id: string
          tipo_despesa: string | null
          valor: number
        }
        Insert: {
          criado_em?: string | null
          data_despesa: string
          descricao: string
          id?: string
          tipo_despesa?: string | null
          valor: number
        }
        Update: {
          criado_em?: string | null
          data_despesa?: string
          descricao?: string
          id?: string
          tipo_despesa?: string | null
          valor?: number
        }
        Relationships: []
      }
      pacientes: {
        Row: {
          cpf: string | null
          criado_em: string | null
          email: string | null
          endereco: string | null
          id: string
          nome_completo: string
          observacoes: string | null
          status: string | null
          telefone: string | null
        }
        Insert: {
          cpf?: string | null
          criado_em?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nome_completo: string
          observacoes?: string | null
          status?: string | null
          telefone?: string | null
        }
        Update: {
          cpf?: string | null
          criado_em?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nome_completo?: string
          observacoes?: string | null
          status?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      procedimentos: {
        Row: {
          criado_em: string | null
          descricao: string | null
          id: string
          nome_procedimento: string
          valor_padrao: number | null
        }
        Insert: {
          criado_em?: string | null
          descricao?: string | null
          id?: string
          nome_procedimento: string
          valor_padrao?: number | null
        }
        Update: {
          criado_em?: string | null
          descricao?: string | null
          id?: string
          nome_procedimento?: string
          valor_padrao?: number | null
        }
        Relationships: []
      }
      transacoes_financeiras: {
        Row: {
          criado_em: string | null
          data_transacao: string
          forma_pagamento: string | null
          id: string
          paciente_id: string
          procedimento_id: string | null
          status_pagamento: string
          valor: number
        }
        Insert: {
          criado_em?: string | null
          data_transacao: string
          forma_pagamento?: string | null
          id?: string
          paciente_id: string
          procedimento_id?: string | null
          status_pagamento: string
          valor: number
        }
        Update: {
          criado_em?: string | null
          data_transacao?: string
          forma_pagamento?: string | null
          id?: string
          paciente_id?: string
          procedimento_id?: string | null
          status_pagamento?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_financeiras_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_financeiras_procedimento_id_fkey"
            columns: ["procedimento_id"]
            isOneToOne: false
            referencedRelation: "procedimentos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

