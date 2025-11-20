import { supabase } from '@/lib/supabase/client'
import { Patient } from '@/types'

export const getPatients = async (): Promise<Patient[]> => {
  const { data, error } = await supabase
    .from('pacientes')
    .select('*')
    .order('nome_completo')

  if (error) throw error

  return data.map((p: any) => ({
    id: p.id,
    name: p.nome_completo,
    cpf: p.cpf,
    phone: p.telefone || '',
    email: p.email || '',
    address: p.endereco || '',
    status: p.status as any,
    notes: p.observacoes || '',
    createdAt: p.criado_em,
  }))
}

export const createPatient = async (
  patient: Omit<Patient, 'id' | 'createdAt'>,
) => {
  const { data, error } = await supabase
    .from('pacientes')
    .insert({
      nome_completo: patient.name,
      cpf: patient.cpf,
      telefone: patient.phone,
      email: patient.email,
      endereco: patient.address,
      status: patient.status,
      observacoes: patient.notes,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const updatePatient = async (id: string, patient: Partial<Patient>) => {
  const updates: any = {}
  if (patient.name) updates.nome_completo = patient.name
  if (patient.cpf) updates.cpf = patient.cpf
  if (patient.phone) updates.telefone = patient.phone
  if (patient.email) updates.email = patient.email
  if (patient.address) updates.endereco = patient.address
  if (patient.status) updates.status = patient.status
  if (patient.notes) updates.observacoes = patient.notes

  const { error } = await supabase
    .from('pacientes')
    .update(updates)
    .eq('id', id)

  if (error) throw error
}

export const deletePatient = async (id: string) => {
  const { error } = await supabase.from('pacientes').delete().eq('id', id)
  if (error) throw error
}
