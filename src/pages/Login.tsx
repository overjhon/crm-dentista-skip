import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAuthenticated } = useAppStore()
  const navigate = useNavigate()

  if (isAuthenticated) {
    navigate('/')
    return null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (email === 'admin' && password === 'everson123') {
        login(email)
        toast.success('Login realizado com sucesso!')
        navigate('/')
      } else {
        toast.error('Usuário ou senha inválidos.')
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="text-xl font-bold">EM</span>
          </div>
          <CardTitle className="text-2xl font-bold">
            Dr. Everson Monteiro
          </CardTitle>
          <CardDescription>CRM & Controle Financeiro</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Usuário</Label>
              <Input
                id="email"
                type="text"
                placeholder="admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Entrar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
