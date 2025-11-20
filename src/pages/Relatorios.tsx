import useAppStore from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Line,
  LineChart,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  format,
  subMonths,
  startOfMonth,
  isSameMonth,
  parseISO,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useMemo } from 'react'
import { formatCurrency } from '@/lib/utils'

export default function Relatorios() {
  const { payments, expenses } = useAppStore()

  const financialData = useMemo(() => {
    // Get last 6 months including current
    const months = Array.from({ length: 6 }, (_, i) => {
      return subMonths(new Date(), 5 - i)
    })

    return months.map((date) => {
      const monthDate = startOfMonth(date)

      const monthlyRevenue = payments
        .filter(
          (p) =>
            p.status === 'Pago' && isSameMonth(parseISO(p.date), monthDate),
        )
        .reduce((acc, curr) => acc + curr.amount, 0)

      const monthlyExpenses = expenses
        .filter((e) => isSameMonth(parseISO(e.date), monthDate))
        .reduce((acc, curr) => acc + curr.amount, 0)

      return {
        month: format(monthDate, 'MMM', { locale: ptBR }), // e.g., "Nov"
        fullDate: format(monthDate, 'MMMM yyyy', { locale: ptBR }), // e.g., "Novembro 2025"
        revenue: monthlyRevenue,
        expenses: monthlyExpenses,
        profit: monthlyRevenue - monthlyExpenses,
      }
    })
  }, [payments, expenses])

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold tracking-tight">
        Relatórios Financeiros
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Receita vs Despesas (Últimos 6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ChartContainer
                config={{
                  revenue: { label: 'Receita', color: 'hsl(var(--primary))' },
                  expenses: {
                    label: 'Despesas',
                    color: 'hsl(var(--destructive))',
                  },
                }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `R$ ${value / 1000}k`}
                      tick={{ fontSize: 12 }}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      fill="var(--color-revenue)"
                      radius={[4, 4, 0, 0]}
                      name="Receita"
                    />
                    <Bar
                      dataKey="expenses"
                      fill="var(--color-expenses)"
                      radius={[4, 4, 0, 0]}
                      name="Despesas"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução do Lucro Líquido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ChartContainer
                config={{
                  profit: { label: 'Lucro', color: 'hsl(var(--chart-2))' },
                }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={financialData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `R$ ${value / 1000}k`}
                      tick={{ fontSize: 12 }}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="var(--color-profit)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Lucro"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhamento Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financialData
              .slice()
              .reverse()
              .map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{item.fullDate}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                      <span className="text-green-600">
                        Receita: {formatCurrency(item.revenue)}
                      </span>
                      <span className="text-red-600">
                        Despesas: {formatCurrency(item.expenses)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Resultado</p>
                    <p
                      className={`font-bold ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {formatCurrency(item.profit)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
