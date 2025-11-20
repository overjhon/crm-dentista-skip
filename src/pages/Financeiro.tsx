import { useState, useEffect } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Payment } from '@/types'
import { format, parseISO } from 'date-fns'
import { FinancialBalances } from '@/components/FinancialBalances'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const paymentSchema = z.object({
  patientId: z.string().min(1, 'Paciente é obrigatório'),
  procedureId: z.string().optional(),
  amount: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  date: z.string().min(1, 'Data é obrigatória'),
  method: z.enum(['Dinheiro', 'Cartão', 'PIX', 'Link']).optional(),
  status: z.enum(['Pago', 'Pendente', 'Atrasado'], {
    required_error: 'Status é obrigatório',
  }),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

export default function Financeiro() {
  const {
    payments,
    patients,
    procedures,
    addPayment,
    updatePayment,
    deletePayment,
  } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      patientId: '',
      procedureId: '',
      amount: 0,
      date: format(new Date(), 'yyyy-MM-dd'),
      method: undefined,
      status: 'Pago',
    },
  })

  useEffect(() => {
    if (isModalOpen) {
      if (editingPayment) {
        form.reset({
          patientId: editingPayment.patientId,
          procedureId: editingPayment.procedureId || '',
          amount: editingPayment.amount,
          date: editingPayment.date,
          method: editingPayment.method,
          status: editingPayment.status,
        })
      } else {
        form.reset({
          patientId: '',
          procedureId: '',
          amount: 0,
          date: format(new Date(), 'yyyy-MM-dd'),
          method: undefined,
          status: 'Pago',
        })
      }
    }
  }, [isModalOpen, editingPayment, form])

  const filteredPayments = payments.filter(
    (p) =>
      p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.procedure.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleOpenModal = (payment?: Payment) => {
    setEditingPayment(payment || null)
    setIsModalOpen(true)
  }

  const onSubmit = async (data: PaymentFormValues) => {
    try {
      if (editingPayment) {
        await updatePayment(editingPayment.id, data)
        toast.success('Pagamento atualizado')
      } else {
        await addPayment({
          ...data,
          procedureId: data.procedureId || undefined,
        })
        toast.success('Pagamento registrado')
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error(error)
      toast.error('Erro ao salvar pagamento')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Excluir este pagamento?')) {
      try {
        await deletePayment(id)
        toast.success('Pagamento excluído')
      } catch (error) {
        toast.error('Erro ao excluir pagamento')
      }
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Financeiro</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" /> Registrar Pagamento
        </Button>
      </div>

      {/* Visual Balance Breakdown */}
      <FinancialBalances />

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por paciente ou procedimento..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Procedimento</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Forma</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  Nenhum pagamento encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {payment.patientName}
                  </TableCell>
                  <TableCell>{payment.procedure}</TableCell>
                  <TableCell>
                    {format(parseISO(payment.date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>R$ {payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{payment.method || '-'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        payment.status === 'Pago'
                          ? 'default'
                          : payment.status === 'Pendente'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenModal(payment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(payment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPayment ? 'Editar Pagamento' : 'Novo Pagamento'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paciente</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o paciente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {patients.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="procedureId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Procedimento (Opcional)</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val === 'none' ? '' : val)
                        if (val !== 'none') {
                          const proc = procedures.find((p) => p.id === val)
                          if (proc) {
                            form.setValue('amount', proc.standardValue)
                          }
                        }
                      }}
                      defaultValue={field.value}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione (Opcional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Nenhum</SelectItem>
                        {procedures.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forma de Pagamento (Opcional)</FormLabel>
                      <Select
                        onValueChange={(val) =>
                          field.onChange(val === 'none' ? undefined : val)
                        }
                        defaultValue={field.value}
                        value={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione (Opcional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Não informado</SelectItem>
                          <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                          <SelectItem value="Cartão">Cartão</SelectItem>
                          <SelectItem value="PIX">PIX</SelectItem>
                          <SelectItem value="Link">Link</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pago">Pago</SelectItem>
                          <SelectItem value="Pendente">Pendente</SelectItem>
                          <SelectItem value="Atrasado">Atrasado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
