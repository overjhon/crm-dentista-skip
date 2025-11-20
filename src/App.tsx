import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/stores/useAppStore'
import { AuthProvider } from '@/hooks/use-auth'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Index'
import Pacientes from './pages/Pacientes'
import Agenda from './pages/Agenda'
import Financeiro from './pages/Financeiro'
import Despesas from './pages/Despesas'
import Relatorios from './pages/Relatorios'
import Configuracoes from './pages/Configuracoes'
import NotFound from './pages/NotFound'

const App = () => (
  <AuthProvider>
    <AppProvider>
      <BrowserRouter
        future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pacientes" element={<Pacientes />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/financeiro" element={<Financeiro />} />
              <Route path="/despesas" element={<Despesas />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </AppProvider>
  </AuthProvider>
)

export default App
