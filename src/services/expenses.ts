import { supabase } from '@/lib/supabase/client'
import { Expense } from '@/types'

export const getExpenses = async (): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('despesas')
    .select('*')
    .order('data_despesa', { ascending: false })

  if (error) {
    console.error('Error fetching expenses:', error)
    throw new Error('Falha ao carregar despesas: ' + error.message)
  }

  return data.map((e: any) => ({
    id: e.id,
    description: e.descricao,
    amount: Number(e.valor),
    type: e.tipo_despesa || undefined,
    date: e.data_despesa,
    notes: '',
  }))
}

export const createExpense = async (expense: Omit<Expense, 'id'>) => {
  // Ensure type is one of the allowed values or null
  let normalizedType = expense.type
  if (normalizedType) {
    const lower = normalizedType.toLowerCase()
    if (['fixa', 'fixo'].includes(lower)) normalizedType = 'Fixa'
    else if (['variável', 'variavel', 'var'].includes(lower))
      normalizedType = 'Variável'
  }

  const { data, error } = await supabase
    .from('despesas')
    .insert({
      descricao: expense.description,
      valor: expense.amount,
      data_despesa: expense.date,
      tipo_despesa: normalizedType || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating expense:', error)
    throw new Error('Falha ao criar despesa: ' + error.message)
  }
  return data
}

export const updateExpense = async (id: string, expense: Partial<Expense>) => {
  const updates: any = {}
  if (expense.description) updates.descricao = expense.description
  if (expense.amount) updates.valor = expense.amount
  if (expense.date) updates.data_despesa = expense.date

  if (expense.type !== undefined) {
    let normalizedType = expense.type
    if (normalizedType) {
      const lower = normalizedType.toLowerCase()
      if (['fixa', 'fixo'].includes(lower)) normalizedType = 'Fixa'
      else if (['variável', 'variavel', 'var'].includes(lower))
        normalizedType = 'Variável'
    }
    updates.tipo_despesa = normalizedType || null
  }

  const { error } = await supabase.from('despesas').update(updates).eq('id', id)

  if (error) {
    console.error('Error updating expense:', error)
    throw new Error('Falha ao atualizar despesa: ' + error.message)
  }
}

export const deleteExpense = async (id: string) => {
  const { error } = await supabase.from('despesas').delete().eq('id', id)
  if (error) {
    console.error('Error deleting expense:', error)
    throw new Error('Falha ao excluir despesa: ' + error.message)
  }
}
