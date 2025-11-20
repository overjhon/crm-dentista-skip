import useAppStore from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, Users, Calendar, Clock, MessageCircle } from 'lucide-react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from 'recharts'
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
import { formatCurrency } from '@/lib/utils'

export default function Dashboard() {
  const { payments, patients, appointments, settings } = useAppStore()

  const today = startOfDay(new Date())
  const currentMonth = new Date()

  // 1. Faturamento Mensal
  // Sum of 'Pago' transactions in the current month
  const monthlyRevenue = payments
    .filter(
      (p) =>
        p.status === 'Pago' &&
        isSameMonth(parseISO(p.date), currentMonth) &&
        isSameYear(parseISO(p.date), currentMonth),
    )
    .reduce((acc, curr) => acc + curr.amount, 0)

  // 2. Pendências Financeiras
  // Sum of 'Pendente' or 'Atrasado' transactions
  const pendingAmount = payments
    .filter((p) => p.status === 'Pendente' || p.status === 'Atrasado')
    .reduce((acc, curr) => acc + curr.amount, 0)

  // 3. Pacientes Ativos
  // Total count of records in patients table
  const activePatients = patients.length

  // New leads for context (optional, keeping existing logic for sub-text)
  const newLeads = patients.filter(
    (p) =>
      p.status === 'Novo' && isSameMonth(parseISO(p.createdAt), currentMonth),
  ).length

  // 4. Consultas Realizadas no Mês
  // Count of 'Realizada' appointments in the current month
  const monthlyAppointments = appointments.filter(
    (a) =>
      a.status === 'Realizada' &&
      isSameMonth(parseISO(a.date), currentMonth) &&
      isSameYear(parseISO(a.date), currentMonth),
  ).length

  // 5. Evolução do Faturamento Semestral Graph
  // Last 6 months revenue
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
  // Count of appointments grouped by procedure name
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
    .slice(0, 5) // Top 5 procedures

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ]

  // 7. Próximas Consultas List
  // Appointments today or in the future
  const nextAppointments = appointments
    .filter((a) => {
      const apptDate = parseISO(a.date)
      // Filter for confirmed appointments today or in the future
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
    .slice(0, 5) // Show top 5

  // 8. Pacientes com Saldo Pendente List
  // Group pending payments by patient
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

  const handleSendMessage = async (patientName: string, amount: number) => {
    const webhookUrl = settings.webhookBilling

    if (!webhookUrl) {
      toast.error('URL do Webhook de cobrança não configurada.')
      return
    }

    const promise = new Promise((resolve, reject) => {
      try {
        // Simulating network request
        setTimeout(() => {
          console.log(
            `Sending webhook to ${webhookUrl} for ${patientName} - ${formatCurrency(amount)}`,
          )
          resolve(true)
        }, 1500)
      } catch (error) {
        reject(error)
      }
    })

    toast.promise(promise, {
      loading: 'Enviando mensagem...',
      success: `Mensagem enviada para ${patientName}!`,
      error: 'Erro ao enviar mensagem',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturamento Mensal
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(monthlyRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">Mês atual</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendências Financeiras
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(pendingAmount)}
            </div>
            <p className="text-xs text-muted-foreground">A receber</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pacientes Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePatients}</div>
            <p className="text-xs text-muted-foreground">
              Total de pacientes cadastrados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Consultas Realizadas
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyAppointments}</div>
            <p className="text-xs text-muted-foreground">Mês atual</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Evolução do Faturamento Semestral</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer
              config={{
                revenue: { label: 'Faturamento', color: 'hsl(var(--primary))' },
              }}
              className="h-[300px]"
            >
              <BarChart data={revenueData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-revenue)"
                  radius={[4, 4, 0, 0]}
                  name="Faturamento"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Procedimentos Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {procedureData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={procedureData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {procedureData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  Sem dados de procedimentos
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximas Consultas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nextAppointments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma consulta agendada.
                </p>
              ) : (
                nextAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{appt.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {appt.procedure}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{appt.time}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(appt.date), 'dd/MM/yyyy', {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Patients with Pending Balance */}
        <Card>
          <CardHeader>
            <CardTitle>Pacientes com Saldo Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingPatientsList.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum paciente com pendências.
                </p>
              ) : (
                pendingPatientsList.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10">
                        <DollarSign className="h-4 w-4 text-destructive" />
                      </div>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-xs text-destructive font-semibold">
                          {formatCurrency(patient.amount)}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() =>
                        handleSendMessage(patient.name, patient.amount)
                      }
                    >
                      <MessageCircle className="h-3 w-3" />
                      <span className="hidden sm:inline">Mandar Mensagem</span>
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
