import { supabase } from '@/lib/supabase/client'
import { Payment } from '@/types'

export const getPayments = async (): Promise<Payment[]> => {
  const { data, error } = await supabase
    .from('transacoes_financeiras')
    .select(
      `
      *,
      pacientes (nome_completo),
      procedimentos (nome_procedimento)
    `,
    )
    .order('data_transacao', { ascending: false })

  if (error) throw error

  return data.map((t: any) => ({
    id: t.id,
    patientId: t.paciente_id,
    patientName: t.pacientes?.nome_completo || 'Desconhecido',
    procedureId: t.procedimento_id || undefined,
    procedure: t.procedimentos?.nome_procedimento || 'Avulso',
    amount: Number(t.valor),
    date: t.data_transacao,
    status: t.status_pagamento as any,
    method: t.forma_pagamento || undefined,
    notes: '',
  }))
}

export const createPayment = async (
  payment: Omit<Payment, 'id' | 'patientName' | 'procedure'>,
) => {
  const { data, error } = await supabase
    .from('transacoes_financeiras')
    .insert({
      paciente_id: payment.patientId,
      procedimento_id: payment.procedureId || null,
      valor: payment.amount,
      data_transacao: payment.date,
      forma_pagamento: payment.method || null,
      status_pagamento: payment.status,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const updatePayment = async (id: string, payment: Partial<Payment>) => {
  const updates: any = {}
  if (payment.patientId) updates.paciente_id = payment.patientId
  // Handle procedureId explicitly to allow clearing it (setting to null)
  if (payment.procedureId !== undefined)
    updates.procedimento_id = payment.procedureId || null
  if (payment.amount) updates.valor = payment.amount
  if (payment.date) updates.data_transacao = payment.date
  if (payment.method !== undefined)
    updates.forma_pagamento = payment.method || null
  if (payment.status) updates.status_pagamento = payment.status

  const { error } = await supabase
    .from('transacoes_financeiras')
    .update(updates)
    .eq('id', id)

  if (error) throw error
}

export const deletePayment = async (id: string) => {
  const { error } = await supabase
    .from('transacoes_financeiras')
    .delete()
    .eq('id', id)
  if (error) throw error
}
