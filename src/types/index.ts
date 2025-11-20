export type Status =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'completed'
  | 'cancelled'

export interface Patient {
  id: string
  name: string
  cpf: string
  birthDate?: string // Not in DB schema provided in user story, keeping optional or mapping from other field if needed. User story didn't ask for birthDate in DB.
  phone: string
  email: string
  address: string
  status:
    | 'Novo'
    | 'Em Atendimento'
    | 'Aguardando Pagamento'
    | 'Finalizado'
    | 'Confirmada'
  notes: string
  createdAt: string
}

export interface Procedure {
  id: string
  name: string
  standardValue: number
  description: string
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  procedureId: string
  procedure: string // Name of procedure
  date: string // ISO string (YYYY-MM-DD)
  time: string // HH:mm
  status: 'Confirmada' | 'Realizada' | 'Reagendada' | 'Cancelada'
  notes: string
}

export interface Payment {
  id: string
  patientId: string
  patientName: string
  procedureId?: string
  procedure: string
  amount: number
  date: string
  status: 'Pago' | 'Pendente' | 'Atrasado'
  method: 'Dinheiro' | 'Cartão' | 'PIX' | 'Link'
  notes?: string
}

export interface Expense {
  id: string
  description: string
  amount: number
  type: 'Fixa' | 'Variável'
  date: string
  notes?: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

export interface IntegrationSettings {
  webhookConfirmation: string
  webhookReminder: string
  webhookBilling: string
}
