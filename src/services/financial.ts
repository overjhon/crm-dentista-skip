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

  if (error) {
    console.error('Error fetching payments:', error)
    throw new Error('Falha ao carregar pagamentos: ' + error.message)
  }

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
  // Normalize status
  let normalizedStatus = payment.status
  if (normalizedStatus) {
    const lower = normalizedStatus.toLowerCase()
    if (['pago', 'pagou'].includes(lower)) normalizedStatus = 'Pago'
    else if (['pendente', 'aberto', 'a receber'].includes(lower))
      normalizedStatus = 'Pendente'
    else if (['atrasado', 'vencido'].includes(lower))
      normalizedStatus = 'Atrasado'
  }

  const { data, error } = await supabase
    .from('transacoes_financeiras')
    .insert({
      paciente_id: payment.patientId,
      procedimento_id: payment.procedureId || null,
      valor: payment.amount,
      data_transacao: payment.date,
      forma_pagamento: payment.method || null,
      status_pagamento: normalizedStatus,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating payment:', error)
    throw new Error('Falha ao registrar pagamento: ' + error.message)
  }
  return data
}

export const updatePayment = async (id: string, payment: Partial<Payment>) => {
  const updates: any = {}
  if (payment.patientId) updates.paciente_id = payment.patientId
  if (payment.procedureId !== undefined)
    updates.procedimento_id = payment.procedureId || null
  if (payment.amount) updates.valor = payment.amount
  if (payment.date) updates.data_transacao = payment.date
  if (payment.method !== undefined)
    updates.forma_pagamento = payment.method || null

  if (payment.status) {
    let normalizedStatus = payment.status
    const lower = normalizedStatus.toLowerCase()
    if (['pago', 'pagou'].includes(lower)) normalizedStatus = 'Pago'
    else if (['pendente', 'aberto', 'a receber'].includes(lower))
      normalizedStatus = 'Pendente'
    else if (['atrasado', 'vencido'].includes(lower))
      normalizedStatus = 'Atrasado'
    updates.status_pagamento = normalizedStatus
  }

  const { error } = await supabase
    .from('transacoes_financeiras')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Error updating payment:', error)
    throw new Error('Falha ao atualizar pagamento: ' + error.message)
  }
}

export const deletePayment = async (id: string) => {
  const { error } = await supabase
    .from('transacoes_financeiras')
    .delete()
    .eq('id', id)
  if (error) {
    console.error('Error deleting payment:', error)
    throw new Error('Falha ao excluir pagamento: ' + error.message)
  }
}
