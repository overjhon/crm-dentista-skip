import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  Patient,
  Appointment,
  Payment,
  Expense,
  UserProfile,
  IntegrationSettings,
  Procedure,
} from '@/types'
import { useAuth } from '@/hooks/use-auth'
import * as patientService from '@/services/patients'
import * as appointmentService from '@/services/appointments'
import * as financialService from '@/services/financial'
import * as expenseService from '@/services/expenses'
import * as procedureService from '@/services/procedures'
import { toast } from 'sonner'

interface AppState {
  user: UserProfile
  patients: Patient[]
  appointments: Appointment[]
  payments: Payment[]
  expenses: Expense[]
  procedures: Procedure[]
  settings: IntegrationSettings
  loading: boolean
  refreshData: () => Promise<void>
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => Promise<void>
  updatePatient: (id: string, data: Partial<Patient>) => Promise<void>
  deletePatient: (id: string) => Promise<void>
  addAppointment: (
    appointment: Omit<Appointment, 'id' | 'patientName' | 'procedure'>,
  ) => Promise<void>
  updateAppointment: (id: string, data: Partial<Appointment>) => Promise<void>
  deleteAppointment: (id: string) => Promise<void>
  addPayment: (
    payment: Omit<Payment, 'id' | 'patientName' | 'procedure'>,
  ) => Promise<void>
  updatePayment: (id: string, data: Partial<Payment>) => Promise<void>
  deletePayment: (id: string) => Promise<void>
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>
  updateExpense: (id: string, data: Partial<Expense>) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  updateSettings: (settings: IntegrationSettings) => void
  logout: () => Promise<void>
}

const AppContext = createContext<AppState | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user: authUser, signOut } = useAuth()
  const [user, setUser] = useState<UserProfile>({
    id: '',
    name: 'Dr. Everson Monteiro',
    email: '',
  })
  const [patients, setPatients] = useState<Patient[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [settings, setSettings] = useState<IntegrationSettings>({
    webhookConfirmation: '',
    webhookReminder: '',
    webhookBilling: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (authUser) {
      setUser({
        id: authUser.id,
        name: authUser.user_metadata?.name || 'Dr. Everson Monteiro',
        email: authUser.email || '',
      })
      refreshData()
    } else {
      // Clear data on logout
      setPatients([])
      setAppointments([])
      setPayments([])
      setExpenses([])
      setProcedures([])
      setUser({ id: '', name: '', email: '' })
    }
  }, [authUser])

  const refreshData = async () => {
    setLoading(true)
    try {
      const [p, a, f, e, proc] = await Promise.all([
        patientService.getPatients(),
        appointmentService.getAppointments(),
        financialService.getPayments(),
        expenseService.getExpenses(),
        procedureService.getProcedures(),
      ])
      setPatients(p)
      setAppointments(a)
      setPayments(f)
      setExpenses(e)
      setProcedures(proc)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const addPatient = async (data: Omit<Patient, 'id' | 'createdAt'>) => {
    try {
      await patientService.createPatient(data)
      await refreshData()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const updatePatient = async (id: string, data: Partial<Patient>) => {
    try {
      await patientService.updatePatient(id, data)
      await refreshData()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const deletePatient = async (id: string) => {
    try {
      await patientService.deletePatient(id)
      await refreshData()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const addAppointment = async (
    data: Omit<Appointment, 'id' | 'patientName' | 'procedure'>,
  ) => {
    try {
      await appointmentService.createAppointment(data)
      await refreshData()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const updateAppointment = async (id: string, data: Partial<Appointment>) => {
    try {
      await appointmentService.updateAppointment(id, data)
      await refreshData()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const deleteAppointment = async (id: string) => {
    try {
      await appointmentService.deleteAppointment(id)
      await refreshData()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const addPayment = async (
    data: Omit<Payment, 'id' | 'patientName' | 'procedure'>,
  ) => {
    try {
      await financialService.createPayment(data)
      await refreshData()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const updatePayment = async (id: string, data: Partial<Payment>) => {
    try {
      await financialService.updatePayment(id, data)
      await refreshData()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const deletePayment = async (id: string) => {
    try {
      await financialService.deletePayment(id)
      await refreshData()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const addExpense = async (data: Omit<Expense, 'id'>) => {
    try {
      await expenseService.createExpense(data)
      await refreshData()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const updateExpense = async (id: string, data: Partial<Expense>) => {
    try {
      await expenseService.updateExpense(id, data)
      await refreshData()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      await expenseService.deleteExpense(id)
      await refreshData()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const updateSettings = (data: IntegrationSettings) => setSettings(data)

  const logout = async () => {
    try {
      await signOut()
      // State clearing is handled by the useEffect when authUser becomes null
      toast.success('Logout realizado com sucesso')
    } catch (error: any) {
      console.error('Logout error:', error)
      toast.error('Erro ao sair: ' + error.message)
    }
  }

  return React.createElement(
    AppContext.Provider,
    {
      value: {
        user,
        patients,
        appointments,
        payments,
        expenses,
        procedures,
        settings,
        loading,
        refreshData,
        addPatient,
        updatePatient,
        deletePatient,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        addPayment,
        updatePayment,
        deletePayment,
        addExpense,
        updateExpense,
        deleteExpense,
        updateSettings,
        logout,
      },
    },
    children,
  )
}

const useAppStore = () => {
  const context = useContext(AppContext)
  if (!context)
    throw new Error('useAppStore must be used within an AppProvider')
  return context
}

export default useAppStore
