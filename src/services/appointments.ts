import { supabase } from '@/lib/supabase/client'
import { Appointment } from '@/types'

// Helper to convert DD/MM/YYYY to YYYY-MM-DD
const toISODate = (dateStr: string): string => {
  if (!dateStr) return dateStr
  // Check if it matches DD/MM/YYYY format (simple check)
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/')
    if (parts.length === 3) {
      const [day, month, year] = parts
      return `${year}-${month}-${day}`
    }
  }
  return dateStr
}

// Helper to convert YYYY-MM-DD to DD/MM/YYYY
const toDBDate = (isoDate: string): string => {
  if (!isoDate) return isoDate
  // Check if it matches YYYY-MM-DD format (simple check)
  if (isoDate.includes('-')) {
    const parts = isoDate.split('-')
    if (parts.length === 3) {
      const [year, month, day] = parts
      return `${day}/${month}/${year}`
    }
  }
  return isoDate
}

export const getAppointments = async (): Promise<Appointment[]> => {
  const { data, error } = await supabase.from('agendamentos').select(
    `
      *,
      pacientes (nome_completo),
      procedimentos (nome_procedimento)
    `,
  )

  if (error) throw error

  const appointments = (data || []).map((a: any) => ({
    id: a.id,
    patientId: a.paciente_id,
    patientName: a.pacientes?.nome_completo || 'Desconhecido',
    procedureId: a.procedimento_id,
    procedure: a.procedimentos?.nome_procedimento || 'Desconhecido',
    date: toISODate(a.data_procedimento),
    time: a.hora_inicio,
    status: a.Status as any,
    notes: a.observacoes_cliente || '',
  }))

  // Sort by date and time in memory since DB sort on DD/MM/YYYY string is incorrect
  return appointments.sort((a, b) => {
    const dateA = a.date + 'T' + a.time
    const dateB = b.date + 'T' + b.time
    return dateA.localeCompare(dateB)
  })
}

export const createAppointment = async (
  appointment: Omit<Appointment, 'id' | 'patientName' | 'procedure'>,
) => {
  const dbDate = toDBDate(appointment.date)

  const { data, error } = await supabase
    .from('agendamentos')
    .insert({
      paciente_id: appointment.patientId,
      procedimento_id: appointment.procedureId,
      data_procedimento: dbDate,
      hora_inicio: appointment.time,
      hora_fim: appointment.time, // Simplified
      Status: appointment.status,
      observacoes_cliente: appointment.notes,
      nome_profissional: 'Dr. Everson',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateAppointment = async (
  id: string,
  appointment: Partial<Appointment>,
) => {
  const updates: any = {}
  if (appointment.patientId) updates.paciente_id = appointment.patientId
  if (appointment.procedureId) updates.procedimento_id = appointment.procedureId
  if (appointment.date) updates.data_procedimento = toDBDate(appointment.date)
  if (appointment.time) updates.hora_inicio = appointment.time
  if (appointment.status) updates.Status = appointment.status
  if (appointment.notes) updates.observacoes_cliente = appointment.notes

  const { error } = await supabase
    .from('agendamentos')
    .update(updates)
    .eq('id', id)

  if (error) throw error
}

export const deleteAppointment = async (id: string) => {
  const { error } = await supabase.from('agendamentos').delete().eq('id', id)
  if (error) throw error
}
