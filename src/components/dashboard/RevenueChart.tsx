import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface RevenueChartProps {
  data: {
    month: string
    fullDate: string
    revenue: number
  }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
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
          <BarChart data={data}>
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
  )
}
