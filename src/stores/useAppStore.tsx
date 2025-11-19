import React, { createContext, useContext, useState } from 'react'
import {
  Patient,
  Appointment,
  Payment,
  Expense,
  UserProfile,
  IntegrationSettings,
} from '@/types'
import { addDays, format, subDays } from 'date-fns'

interface AppState {
  isAuthenticated: boolean
  user: UserProfile
  patients: Patient[]
  appointments: Appointment[]
  payments: Payment[]
  expenses: Expense[]
  settings: IntegrationSettings
  login: (email: string) => void
  logout: () => void
  updateUser: (user: UserProfile) => void
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => void
  updatePatient: (id: string, data: Partial<Patient>) => void
  deletePatient: (id: string) => void
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void
  updateAppointment: (id: string, data: Partial<Appointment>) => void
  deleteAppointment: (id: string) => void
  addPayment: (payment: Omit<Payment, 'id'>) => void
  updatePayment: (id: string, data: Partial<Payment>) => void
  deletePayment: (id: string) => void
  addExpense: (expense: Omit<Expense, 'id'>) => void
  updateExpense: (id: string, data: Partial<Expense>) => void
  deleteExpense: (id: string) => void
  updateSettings: (settings: IntegrationSettings) => void
}

const AppContext = createContext<AppState | undefined>(undefined)

const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'Ana Silva',
    cpf: '12345678900',
    birthDate: '1990-05-15',
    phone: '(11) 99999-1111',
    email: 'ana@example.com',
    address: 'Rua A, 123',
    status: 'Em Atendimento',
    notes: 'Alergia a penicilina',
    createdAt: '2023-01-10',
  },
  {
    id: '2',
    name: 'Bruno Souza',
    cpf: '23456789011',
    birthDate: '1985-08-20',
    phone: '(11) 98888-2222',
    email: 'bruno@example.com',
    address: 'Av B, 456',
    status: 'Novo',
    notes: '',
    createdAt: '2023-02-15',
  },
  {
    id: '3',
    name: 'Carla Dias',
    cpf: '34567890122',
    birthDate: '1995-12-01',
    phone: '(11) 97777-3333',
    email: 'carla@example.com',
    address: 'Travessa C, 789',
    status: 'Aguardando Pagamento',
    notes: 'Tratamento de canal',
    createdAt: '2023-03-20',
  },
  {
    id: '4',
    name: 'Daniel Oliveira',
    cpf: '45678901233',
    birthDate: '1988-03-10',
    phone: '(11) 96666-4444',
    email: 'daniel@example.com',
    address: 'Rua D, 101',
    status: 'Aguardando Pagamento',
    notes: '',
    createdAt: '2023-04-05',
  },
]

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Ana Silva',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    procedure: 'Limpeza',
    status: 'Confirmada',
    notes: '',
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Bruno Souza',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    time: '14:00',
    procedure: 'Avaliação',
    status: 'Confirmada',
    notes: '',
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Carla Dias',
    date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    time: '10:00',
    procedure: 'Canal',
    status: 'Realizada',
    notes: 'Paciente sentiu dor leve',
  },
  {
    id: '4',
    patientId: '1',
    patientName: 'Ana Silva',
    date: '2025-11-18',
    time: '15:00',
    procedure: 'Retorno Anual',
    status: 'Confirmada',
    notes: 'Agendamento futuro para 2025',
  },
]

const MOCK_PAYMENTS: Payment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Ana Silva',
    procedure: 'Limpeza',
    amount: 250,
    date: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    status: 'Pago',
    method: 'PIX',
    notes: '',
  },
  {
    id: '2',
    patientId: '3',
    patientName: 'Carla Dias',
    procedure: 'Canal',
    amount: 800,
    date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    status: 'Pendente',
    method: 'Cartão',
    notes: 'Parcelado em 2x',
  },
  {
    id: '3',
    patientId: '4',
    patientName: 'Daniel Oliveira',
    procedure: 'Implante',
    amount: 1500,
    date: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
    status: 'Atrasado',
    method: 'Boleto',
    notes: 'Vencido há 5 dias',
  },
]

const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    description: 'Aluguel Consultório',
    amount: 2500,
    type: 'Fixa',
    date: format(new Date(), 'yyyy-MM-05'),
    notes: '',
  },
  {
    id: '2',
    description: 'Material Descartável',
    amount: 450,
    type: 'Variável',
    date: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
    notes: 'Luvas e máscaras',
  },
]

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<UserProfile>({
    name: 'Dr. Everson Monteiro',
    email: 'dr.everson@example.com',
  })
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS)
  const [appointments, setAppointments] =
    useState<Appointment[]>(MOCK_APPOINTMENTS)
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS)
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES)
  const [settings, setSettings] = useState<IntegrationSettings>({
    webhookConfirmation: '',
    webhookReminder: '',
    webhookBilling: '',
  })

  const login = () => setIsAuthenticated(true)
  const logout = () => setIsAuthenticated(false)
  const updateUser = (data: UserProfile) => setUser(data)

  const addPatient = (data: Omit<Patient, 'id' | 'createdAt'>) => {
    const newPatient: Patient = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    }
    setPatients([...patients, newPatient])
  }
  const updatePatient = (id: string, data: Partial<Patient>) => {
    setPatients(patients.map((p) => (p.id === id ? { ...p, ...data } : p)))
  }
  const deletePatient = (id: string) => {
    setPatients(patients.filter((p) => p.id !== id))
  }

  const addAppointment = (data: Omit<Appointment, 'id'>) => {
    const newAppt: Appointment = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    }
    setAppointments([...appointments, newAppt])
  }
  const updateAppointment = (id: string, data: Partial<Appointment>) => {
    setAppointments(
      appointments.map((a) => (a.id === id ? { ...a, ...data } : a)),
    )
  }
  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter((a) => a.id !== id))
  }

  const addPayment = (data: Omit<Payment, 'id'>) => {
    const newPayment: Payment = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    }
    setPayments([...payments, newPayment])
  }
  const updatePayment = (id: string, data: Partial<Payment>) => {
    setPayments(payments.map((p) => (p.id === id ? { ...p, ...data } : p)))
  }
  const deletePayment = (id: string) => {
    setPayments(payments.filter((p) => p.id !== id))
  }

  const addExpense = (data: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    }
    setExpenses([...expenses, newExpense])
  }
  const updateExpense = (id: string, data: Partial<Expense>) => {
    setExpenses(expenses.map((e) => (e.id === id ? { ...e, ...data } : e)))
  }
  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  const updateSettings = (data: IntegrationSettings) => setSettings(data)

  return React.createElement(
    AppContext.Provider,
    {
      value: {
        isAuthenticated,
        user,
        patients,
        appointments,
        payments,
        expenses,
        settings,
        login,
        logout,
        updateUser,
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
