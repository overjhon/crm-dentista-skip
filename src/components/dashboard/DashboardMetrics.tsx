import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Users, Calendar, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface DashboardMetricsProps {
  monthlyRevenue: number
  pendingAmount: number
  activePatients: number
  monthlyAppointments: number
}

export function DashboardMetrics({
  monthlyRevenue,
  pendingAmount,
  activePatients,
  monthlyAppointments,
}: DashboardMetricsProps) {
  return (
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
  )
}
