import { useMemo } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FinancialBalances() {
  const { payments } = useAppStore()

  const { positive, denied, pending } = useMemo(() => {
    const acc = {
      positive: {} as Record<string, { name: string; amount: number }>,
      denied: {} as Record<string, { name: string; amount: number }>,
      pending: {} as Record<string, { name: string; amount: number }>,
    }

    payments.forEach((payment) => {
      const { patientId, patientName, amount, status } = payment
      let target = null

      if (status === 'Pago') target = acc.positive
      else if (status === 'Atrasado') target = acc.denied
      else if (status === 'Pendente') target = acc.pending

      if (target) {
        if (!target[patientId]) {
          target[patientId] = { name: patientName, amount: 0 }
        }
        target[patientId].amount += amount
      }
    })

    return {
      positive: Object.values(acc.positive),
      denied: Object.values(acc.denied),
      pending: Object.values(acc.pending),
    }
  }, [payments])

  const renderList = (
    items: { name: string; amount: number }[],
    type: 'positive' | 'denied' | 'pending',
  ) => {
    if (items.length === 0) {
      return (
        <div className="flex h-20 items-center justify-center text-sm text-muted-foreground">
          Nenhum registro.
        </div>
      )
    }

    return (
      <ScrollArea className="h-[200px] pr-4">
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-md border p-2 text-sm"
            >
              <span
                className="font-medium truncate max-w-[120px]"
                title={item.name}
              >
                {item.name}
              </span>
              <span
                className={cn(
                  'font-bold',
                  type === 'positive' && 'text-green-600',
                  type === 'denied' && 'text-destructive',
                  type === 'pending' && 'text-yellow-600',
                )}
              >
                R$ {item.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-t-4 border-t-green-500 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Saldo Positivo
          </CardTitle>
        </CardHeader>
        <CardContent>{renderList(positive, 'positive')}</CardContent>
      </Card>

      <Card className="border-t-4 border-t-destructive shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <XCircle className="h-4 w-4 text-destructive" />
            Saldo Atrasado
          </CardTitle>
        </CardHeader>
        <CardContent>{renderList(denied, 'denied')}</CardContent>
      </Card>

      <Card className="border-t-4 border-t-yellow-500 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Clock className="h-4 w-4 text-yellow-500" />
            Saldo Pendente
          </CardTitle>
        </CardHeader>
        <CardContent>{renderList(pending, 'pending')}</CardContent>
      </Card>
    </div>
  )
}
