import { supabase } from '@/lib/supabase/client'
import { Procedure } from '@/types'

export const getProcedures = async (): Promise<Procedure[]> => {
  const { data, error } = await supabase
    .from('procedimentos')
    .select('*')
    .order('nome_procedimento')

  if (error) throw error

  return data.map((p: any) => ({
    id: p.id,
    name: p.nome_procedimento,
    standardValue: p.valor_padrao,
    description: p.descricao || '',
  }))
}
