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
  ResponsiveContainer,
  Legend,
} from 'recharts'

export default function Relatorios() {
  const { payments, expenses } = useAppStore()

  // Mock data aggregation for reports
  const financialData = [
    { month: 'Jan', revenue: 12000, expenses: 5000 },
    { month: 'Fev', revenue: 15000, expenses: 6000 },
    { month: 'Mar', revenue: 18000, expenses: 5500 },
    { month: 'Abr', revenue: 14000, expenses: 7000 },
    { month: 'Mai', revenue: 20000, expenses: 6500 },
    { month: 'Jun', revenue: 22000, expenses: 6000 },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold tracking-tight">Relatórios</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Receita vs Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: 'Receita', color: 'hsl(var(--primary))' },
                expenses: {
                  label: 'Despesas',
                  color: 'hsl(var(--destructive))',
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={financialData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
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
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crescimento Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: 'Receita', color: 'hsl(var(--primary))' },
              }}
              className="h-[300px]"
            >
              <LineChart data={financialData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
