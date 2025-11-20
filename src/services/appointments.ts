import { supabase } from '@/lib/supabase/client'
import { Appointment } from '@/types'

export const getAppointments = async (): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from('agendamentos')
    .select(
      `
      *,
      pacientes (nome_completo),
      procedimentos (nome_procedimento)
    `,
    )
    .order('data_procedimento')

  if (error) throw error

  return data.map((a: any) => ({
    id: a.id,
    patientId: a.paciente_id,
    patientName: a.pacientes?.nome_completo || 'Desconhecido',
    procedureId: a.procedimento_id,
    procedure: a.procedimentos?.nome_procedimento || 'Desconhecido',
    date: a.data_procedimento,
    time: a.hora_inicio,
    status: a.Status as any,
    notes: a.observacoes_cliente || '',
  }))
}

export const createAppointment = async (
  appointment: Omit<Appointment, 'id' | 'patientName' | 'procedure'>,
) => {
  const { data, error } = await supabase
    .from('agendamentos')
    .insert({
      paciente_id: appointment.patientId,
      procedimento_id: appointment.procedureId,
      data_procedimento: appointment.date,
      hora_inicio: appointment.time,
      hora_fim: appointment.time, // Simplified for now, ideally calculate based on duration
      Status: appointment.status,
      observacoes_cliente: appointment.notes,
      nome_profissional: 'Dr. Everson', // Default
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
  if (appointment.date) updates.data_procedimento = appointment.date
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
