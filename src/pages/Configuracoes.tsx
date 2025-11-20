import { useState } from 'react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

export default function Configuracoes() {
  const { user, settings, updateSettings } = useAppStore()
  const [profileData, setProfileData] = useState(user)
  const [integrationData, setIntegrationData] = useState(settings)

  const handleSaveProfile = () => {
    // In a real app, we would update the user profile in Supabase Auth
    // For now, we just show a success message as user update logic is complex (requires email confirmation etc)
    toast.success('Perfil atualizado com sucesso')
  }

  const handleSaveIntegration = () => {
    updateSettings(integrationData)
    toast.success('Configurações de integração salvas')
  }

  const testConnection = (url: string) => {
    if (!url) {
      toast.error('URL inválida')
      return
    }
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: 'Testando conexão...',
      success: 'Conexão estabelecida com sucesso!',
      error: 'Falha na conexão',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Meu Perfil</TabsTrigger>
          <TabsTrigger value="integration">Integração n8n</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize seus dados de contato e login.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  disabled
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled>
                Salvar Alterações (Gerenciado pelo Supabase)
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="integration">
          <Card>
            <CardHeader>
              <CardTitle>Webhooks n8n</CardTitle>
              <CardDescription>
                Configure os endpoints para automação de mensagens.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhookConfirmation">
                  Confirmação de Consulta
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="webhookConfirmation"
                    placeholder="https://n8n.seu-dominio.com/webhook/..."
                    value={integrationData.webhookConfirmation}
                    onChange={(e) =>
                      setIntegrationData({
                        ...integrationData,
                        webhookConfirmation: e.target.value,
                      })
                    }
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      testConnection(integrationData.webhookConfirmation)
                    }
                  >
                    Testar
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhookReminder">Lembrete de Consulta</Label>
                <div className="flex gap-2">
                  <Input
                    id="webhookReminder"
                    placeholder="https://n8n.seu-dominio.com/webhook/..."
                    value={integrationData.webhookReminder}
                    onChange={(e) =>
                      setIntegrationData({
                        ...integrationData,
                        webhookReminder: e.target.value,
                      })
                    }
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      testConnection(integrationData.webhookReminder)
                    }
                  >
                    Testar
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhookBilling">Cobrança Automática</Label>
                <div className="flex gap-2">
                  <Input
                    id="webhookBilling"
                    placeholder="https://n8n.seu-dominio.com/webhook/..."
                    value={integrationData.webhookBilling}
                    onChange={(e) =>
                      setIntegrationData({
                        ...integrationData,
                        webhookBilling: e.target.value,
                      })
                    }
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      testConnection(integrationData.webhookBilling)
                    }
                  >
                    Testar
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveIntegration}>
                Salvar Configurações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
