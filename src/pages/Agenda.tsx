import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { format, parseISO, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Appointment } from '@/types'
import { toast } from 'sonner'
import { Plus, Clock } from 'lucide-react'

export default function Agenda() {
  const {
    appointments,
    patients,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  } = useAppStore()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null)
  const [formData, setFormData] = useState<Partial<Appointment>>({})

  const dailyAppointments = appointments
    .filter((a) => selectedDate && isSameDay(parseISO(a.date), selectedDate))
    .sort((a, b) => a.time.localeCompare(b.time))

  const handleOpenModal = (appt?: Appointment) => {
    if (appt) {
      setEditingAppt(appt)
      setFormData(appt)
    } else {
      setEditingAppt(null)
      setFormData({
        date: selectedDate
          ? format(selectedDate, 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd'),
        status: 'Confirmada',
      })
    }
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.patientId || !formData.date || !formData.time) {
      toast.error('Paciente, Data e Hora são obrigatórios')
      return
    }

    const patient = patients.find((p) => p.id === formData.patientId)
    const dataToSave = { ...formData, patientName: patient?.name || '' }

    if (editingAppt) {
      updateAppointment(editingAppt.id, dataToSave)
      toast.success('Agendamento atualizado')
    } else {
      addAppointment(dataToSave as any)
      toast.success('Agendamento criado')
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Cancelar este agendamento?')) {
      deleteAppointment(id)
      toast.success('Agendamento cancelado')
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in h-[calc(100vh-100px)]">
      <div className="w-full lg:w-auto flex-shrink-0">
        <Card className="h-full">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              locale={ptBR}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {selectedDate
              ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR })
              : 'Selecione uma data'}
          </h2>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2 h-4 w-4" /> Novo Agendamento
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {dailyAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border rounded-lg bg-card">
              <Clock className="h-12 w-12 mb-2 opacity-20" />
              <p>Nenhum agendamento para este dia.</p>
            </div>
          ) : (
            dailyAppointments.map((appt) => (
              <Card
                key={appt.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleOpenModal(appt)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary font-bold px-3 py-2 rounded text-lg">
                      {appt.time}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {appt.patientName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {appt.procedure}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium
                      ${
                        appt.status === 'Confirmada'
                          ? 'bg-green-100 text-green-800'
                          : appt.status === 'Realizada'
                            ? 'bg-blue-100 text-blue-800'
                            : appt.status === 'Cancelada'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAppt ? 'Editar Agendamento' : 'Novo Agendamento'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Paciente</Label>
              <Select
                value={formData.patientId}
                onValueChange={(val) =>
                  setFormData({ ...formData, patientId: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Hora</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="procedure">Procedimento</Label>
              <Input
                id="procedure"
                value={formData.procedure || ''}
                onChange={(e) =>
                  setFormData({ ...formData, procedure: e.target.value })
                }
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
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Confirmada">Confirmada</SelectItem>
                  <SelectItem value="Realizada">Realizada</SelectItem>
                  <SelectItem value="Reagendada">Reagendada</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            {editingAppt && (
              <Button
                variant="destructive"
                onClick={() => handleDelete(editingAppt.id)}
              >
                Excluir
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Salvar</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
