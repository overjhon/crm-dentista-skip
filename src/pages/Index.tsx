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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { format, isSameMonth, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'

export default function Dashboard() {
  const { payments, patients, appointments, settings } = useAppStore()

  const currentMonth = new Date()

  // Metrics
  const monthlyRevenue = payments
    .filter(
      (p) => p.status === 'Pago' && isSameMonth(parseISO(p.date), currentMonth),
    )
    .reduce((acc, curr) => acc + curr.amount, 0)

  const pendingAmount = payments
    .filter((p) => p.status === 'Pendente' || p.status === 'Atrasado')
    .reduce((acc, curr) => acc + curr.amount, 0)

  const activePatients = patients.filter(
    (p) => p.status === 'Em Atendimento' || p.status === 'Aguardando Pagamento',
  ).length
  const newLeads = patients.filter(
    (p) =>
      p.status === 'Novo' && isSameMonth(parseISO(p.createdAt), currentMonth),
  ).length

  const monthlyAppointments = appointments.filter(
    (a) =>
      a.status === 'Realizada' && isSameMonth(parseISO(a.date), currentMonth),
  ).length
  const nextAppointments = appointments
    .filter((a) => a.status === 'Confirmada' && parseISO(a.date) >= new Date())
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 3)

  // Pending Balances Logic
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

    const promise = new Promise(async (resolve, reject) => {
      try {
        // In a real scenario, we would fetch the webhook
        // await fetch(webhookUrl, { method: 'POST', body: JSON.stringify({ patientName, amount }) })

        // Simulating network request
        setTimeout(() => {
          console.log(
            `Sending webhook to ${webhookUrl} for ${patientName} - R$ ${amount}`,
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

  // Chart Data
  const revenueData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Fev', revenue: 15000 },
    { month: 'Mar', revenue: 18000 },
    { month: 'Abr', revenue: 14000 },
    { month: 'Mai', revenue: 20000 },
    { month: 'Jun', revenue: monthlyRevenue || 22000 },
  ]

  const procedureData = [
    { name: 'Limpeza', value: 40 },
    { name: 'Canal', value: 25 },
    { name: 'Extração', value: 15 },
    { name: 'Implante', value: 20 },
  ]
  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
  ]

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
              R$ {monthlyRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Mês atual</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendências</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              R$ {pendingAmount.toFixed(2)}
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
              +{newLeads} novos este mês
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
            <CardTitle>Faturamento Semestral</CardTitle>
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
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-revenue)"
                  radius={[4, 4, 0, 0]}
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
                          R$ {patient.amount.toFixed(2)}
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
