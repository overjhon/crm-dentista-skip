import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, Info } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { formatCurrency } from '@/lib/utils'
import { Appointment } from '@/types'

interface DashboardListsProps {
  nextAppointments: Appointment[]
  pendingPatients: {
    name: string
    amount: number
    id: string
    status: string
  }[]
  onViewPatient: (id: string) => void
}

export function DashboardLists({
  nextAppointments,
  pendingPatients,
  onViewPatient,
}: DashboardListsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Próximas Consultas Confirmadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nextAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma consulta confirmada agendada.
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
                    <p className="font-medium text-primary">{appt.time}</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Pacientes com Saldo Pendente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingPatients.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum paciente com pendências.
              </p>
            ) : (
              pendingPatients.map((patient) => (
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
                    onClick={() => onViewPatient(patient.id)}
                  >
                    <Info className="h-3 w-3" />
                    <span className="hidden sm:inline">Abrir Informações</span>
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
