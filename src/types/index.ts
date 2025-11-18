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
  birthDate: string
  phone: string
  email: string
  address: string
  status: 'Novo' | 'Em Atendimento' | 'Aguardando Pagamento' | 'Finalizado'
  notes: string
  createdAt: string
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  date: string // ISO string
  time: string // HH:mm
  procedure: string
  status: 'Confirmada' | 'Realizada' | 'Reagendada' | 'Cancelada'
  notes: string
}

export interface Payment {
  id: string
  patientId: string
  patientName: string
  procedure: string
  amount: number
  date: string
  status: 'Pago' | 'Pendente' | 'Atrasado'
  method: 'Dinheiro' | 'Cartão' | 'PIX' | 'Link'
  notes: string
}

export interface Expense {
  id: string
  description: string
  amount: number
  type: 'Fixa' | 'Variável'
  date: string
  notes: string
}

export interface UserProfile {
  name: string
  email: string
  avatarUrl?: string
}

export interface IntegrationSettings {
  webhookConfirmation: string
  webhookReminder: string
  webhookBilling: string
}
