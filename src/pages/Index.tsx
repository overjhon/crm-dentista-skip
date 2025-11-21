import { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import {
  format,
  isSameMonth,
  parseISO,
  subMonths,
  isSameYear,
  startOfDay,
  isAfter,
  isEqual,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Patient } from '@/types'
import { Loader2 } from 'lucide-react'
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { ProceduresChart } from '@/components/dashboard/ProceduresChart'
import { DashboardLists } from '@/components/dashboard/DashboardLists'

export default function Dashboard() {
  const { payments, patients, appointments, loading } = useAppStore()
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null)
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const today = startOfDay(new Date())
  const currentMonth = new Date()

  // 1. Faturamento Mensal
  const monthlyRevenue = payments
    .filter(
      (p) =>
        p.status === 'Pago' &&
        isSameMonth(parseISO(p.date), currentMonth) &&
        isSameYear(parseISO(p.date), currentMonth),
    )
    .reduce((acc, curr) => acc + curr.amount, 0)

  // 2. Pendências Financeiras
  const pendingAmount = payments
    .filter((p) => p.status === 'Pendente' || p.status === 'Atrasado')
    .reduce((acc, curr) => acc + curr.amount, 0)

  // 3. Pacientes Ativos
  const activePatients = patients.length

  // 4. Consultas Realizadas no Mês
  const monthlyAppointments = appointments.filter(
    (a) =>
      a.status === 'Realizada' &&
      isSameMonth(parseISO(a.date), currentMonth) &&
      isSameYear(parseISO(a.date), currentMonth),
  ).length

  // 5. Evolução do Faturamento Semestral Graph
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(new Date(), 5 - i)
    return d
  })

  const revenueData = last6Months.map((date) => {
    const revenue = payments
      .filter(
        (p) =>
          p.status === 'Pago' &&
          isSameMonth(parseISO(p.date), date) &&
          isSameYear(parseISO(p.date), date),
      )
      .reduce((acc, curr) => acc + curr.amount, 0)

    return {
      month: format(date, 'MMM', { locale: ptBR }),
      fullDate: format(date, 'MMMM yyyy', { locale: ptBR }),
      revenue,
    }
  })

  // 6. Distribuição de Procedimentos Populares Graph
  const procedureCounts = appointments.reduce(
    (acc, curr) => {
      const name = curr.procedure || 'Outros'
      acc[name] = (acc[name] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const procedureData = Object.entries(procedureCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  // 7. Próximas Consultas List (Confirmed Appointments)
  const nextAppointments = appointments
    .filter((a) => {
      const apptDate = parseISO(a.date)
      return (
        a.status === 'Confirmada' &&
        (isAfter(apptDate, today) || isEqual(apptDate, today))
      )
    })
    .sort((a, b) => {
      const dateA = parseISO(a.date).getTime()
      const dateB = parseISO(b.date).getTime()
      if (dateA === dateB) {
        return a.time.localeCompare(b.time)
      }
      return dateA - dateB
    })
    .slice(0, 5)

  // 8. Pacientes com Saldo Pendente List
  const pendingPayments = payments.filter(
    (p) => p.status === 'Pendente' || p.status === 'Atrasado',
  )

  const patientBalances = pendingPayments.reduce(
    (acc, curr) => {
      if (!acc[curr.patientId]) {
        acc[curr.patientId] = {
          name: curr.patientName,
          amount: 0,
          id: curr.patientId,
          status: curr.status,
        }
      }
      acc[curr.patientId].amount += curr.amount
      return acc
    },
    {} as Record<
      string,
      { name: string; amount: number; id: string; status: string }
    >,
  )

  const pendingPatientsList = Object.values(patientBalances)

  const handleOpenPatientInfo = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId)
    if (patient) {
      setViewingPatient(patient)
      setIsPatientModalOpen(true)
    } else {
      toast.error('Paciente não encontrado')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <DashboardMetrics
        monthlyRevenue={monthlyRevenue}
        pendingAmount={pendingAmount}
        activePatients={activePatients}
        monthlyAppointments={monthlyAppointments}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RevenueChart data={revenueData} />
        <ProceduresChart data={procedureData} />
      </div>

      <DashboardLists
        nextAppointments={nextAppointments}
        pendingPatients={pendingPatientsList}
        onViewPatient={handleOpenPatientInfo}
      />

      <Dialog open={isPatientModalOpen} onOpenChange={setIsPatientModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informações do Paciente</DialogTitle>
            <DialogDescription>Detalhes do cadastro</DialogDescription>
          </DialogHeader>
          {viewingPatient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Nome
                  </p>
                  <p className="font-medium">{viewingPatient.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    CPF
                  </p>
                  <p>{viewingPatient.cpf}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Telefone
                  </p>
                  <p>{viewingPatient.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    E-mail
                  </p>
                  <p>{viewingPatient.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Endereço
                  </p>
                  <p>{viewingPatient.address}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Observações
                  </p>
                  <p className="text-sm">
                    {viewingPatient.notes || 'Nenhuma observação.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
