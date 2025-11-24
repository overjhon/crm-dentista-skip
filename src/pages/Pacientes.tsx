import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Patient } from '@/types'

export default function Pacientes() {
  const { patients, addPatient, updatePatient, deletePatient } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)

  // Initialize with default values to avoid uncontrolled inputs
  const [formData, setFormData] = useState<Partial<Patient>>({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    address: '',
    status: 'Novo',
    notes: '',
  })

  const filteredPatients = patients.filter((p) => {
    const search = searchTerm.toLowerCase()
    const name = p.name?.toLowerCase() || ''
    const cpf = p.cpf || ''
    return name.includes(search) || cpf.includes(search)
  })

  const handleOpenModal = (patient?: Patient) => {
    if (patient) {
      setEditingPatient(patient)
      setFormData({ ...patient })
    } else {
      setEditingPatient(null)
      setFormData({
        name: '',
        cpf: '',
        phone: '',
        email: '',
        address: '',
        status: 'Novo',
        notes: '',
      })
    }
    setIsModalOpen(true)
  }

  const cleanCPF = (value: string) => {
    if (!value) return ''
    return value.replace(/\D/g, '')
  }

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      toast.error('Nome é obrigatório')
      return
    }

    if (!formData.cpf?.trim()) {
      toast.error('CPF é obrigatório')
      return
    }

    const cleanedCPF = cleanCPF(formData.cpf)

    if (cleanedCPF.length === 0) {
      toast.error('CPF inválido')
      return
    }

    // Check for duplicate CPF
    const duplicate = patients.find(
      (p) => cleanCPF(p.cpf) === cleanedCPF && p.id !== editingPatient?.id,
    )

    if (duplicate) {
      toast.error('Este CPF já está cadastrado para outro paciente.')
      return
    }

    try {
      if (editingPatient) {
        await updatePatient(editingPatient.id, formData)
        toast.success('Paciente atualizado com sucesso')
      } else {
        // Ensure we pass a complete object for creation
        const newPatient = {
          name: formData.name,
          cpf: formData.cpf,
          phone: formData.phone || '',
          email: formData.email || '',
          address: formData.address || '',
          status: formData.status || 'Novo',
          notes: formData.notes || '',
        } as Omit<Patient, 'id' | 'createdAt'>

        await addPatient(newPatient)
        toast.success('Paciente cadastrado com sucesso')
      }
      setIsModalOpen(false)
    } catch (error: any) {
      console.error(error)
      toast.error(
        'Erro ao salvar paciente: ' + (error.message || 'Erro desconhecido'),
      )
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
      try {
        await deletePatient(id)
        toast.success('Paciente excluído')
      } catch (error) {
        toast.error('Erro ao excluir paciente')
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Novo':
        return 'bg-blue-500'
      case 'Confirmada':
        return 'bg-green-600'
      case 'Em Atendimento':
        return 'bg-yellow-500'
      case 'Aguardando Pagamento':
        return 'bg-orange-500'
      case 'Finalizado':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Pacientes</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Paciente
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  {searchTerm
                    ? 'Nenhum paciente encontrado.'
                    : 'Nenhum paciente cadastrado.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.cpf}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell
                    className="max-w-[200px] truncate"
                    title={patient.notes}
                  >
                    {patient.notes}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(patient.status)}>
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenModal(patient)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(patient.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingPatient ? 'Editar Paciente' : 'Novo Paciente'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF (Apenas números) *</Label>
                <Input
                  id="cpf"
                  value={formData.cpf || ''}
                  onChange={(e) => {
                    // Only allow numbers
                    const val = e.target.value.replace(/\D/g, '')
                    setFormData({ ...formData, cpf: val })
                  }}
                  placeholder="00000000000"
                  maxLength={11}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="exemplo@email.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address || ''}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Rua, Número, Bairro"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val: any) =>
                  setFormData({ ...formData, status: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Novo">Novo</SelectItem>
                  <SelectItem value="Confirmada">Confirmada</SelectItem>
                  <SelectItem value="Em Atendimento">Em Atendimento</SelectItem>
                  <SelectItem value="Aguardando Pagamento">
                    Aguardando Pagamento
                  </SelectItem>
                  <SelectItem value="Finalizado">Finalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Observações Gerais</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Observações gerais sobre o paciente (ex: alergias, histórico)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
