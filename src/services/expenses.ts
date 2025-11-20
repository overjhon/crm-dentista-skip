import { supabase } from '@/lib/supabase/client'
import { Expense } from '@/types'

export const getExpenses = async (): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('despesas')
    .select('*')
    .order('data_despesa', { ascending: false })

  if (error) throw error

  return data.map((e: any) => ({
    id: e.id,
    description: e.descricao,
    amount: e.valor,
    type: e.tipo_despesa as any,
    date: e.data_despesa,
    notes: '',
  }))
}

export const createExpense = async (expense: Omit<Expense, 'id'>) => {
  const { data, error } = await supabase
    .from('despesas')
    .insert({
      descricao: expense.description,
      valor: expense.amount,
      data_despesa: expense.date,
      tipo_despesa: expense.type,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateExpense = async (id: string, expense: Partial<Expense>) => {
  const updates: any = {}
  if (expense.description) updates.descricao = expense.description
  if (expense.amount) updates.valor = expense.amount
  if (expense.date) updates.data_despesa = expense.date
  if (expense.type) updates.tipo_despesa = expense.type

  const { error } = await supabase.from('despesas').update(updates).eq('id', id)

  if (error) throw error
}

export const deleteExpense = async (id: string) => {
  const { error } = await supabase.from('despesas').delete().eq('id', id)
  if (error) throw error
}
