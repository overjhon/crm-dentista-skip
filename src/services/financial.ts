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
    procedureId: t.procedimento_id,
    procedure: t.procedimentos?.nome_procedimento || 'Desconhecido',
    amount: t.valor,
    date: t.data_transacao,
    status: t.status_pagamento as any,
    method: t.forma_pagamento as any,
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
      procedimento_id: payment.procedureId,
      valor: payment.amount,
      data_transacao: payment.date,
      forma_pagamento: payment.method,
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
  if (payment.procedureId) updates.procedimento_id = payment.procedureId
  if (payment.amount) updates.valor = payment.amount
  if (payment.date) updates.data_transacao = payment.date
  if (payment.method) updates.forma_pagamento = payment.method
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
