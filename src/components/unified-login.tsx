import { useState, FormEvent } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AudioWave } from "./audio-wave"
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Lock,
  Cpu,
  HardDrive,
  Gauge,
  Settings,
  Zap,
  Shield
} from "lucide-react"

type LoginState = "idle" | "loading" | "success" | "error"

export function UnifiedLogin() {
  const [accessKey, setAccessKey] = useState("")
  const [state, setState] = useState<LoginState>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!accessKey.trim()) {
      setState("error")
      setErrorMessage("Por favor, insira uma chave de acesso")
      return
    }

    setState("loading")
    setErrorMessage("")

    await new Promise(resolve => setTimeout(resolve, 2000))

    if (accessKey === "DEMO123") {
      setState("success")
      setTimeout(() => {
        console.log("Acesso concedido!")
      }, 1000)
    } else {
      setState("error")
      setErrorMessage("Chave de acesso inválida. Tente novamente.")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccessKey(e.target.value)
    if (state === "error") {
      setState("idle")
      setErrorMessage("")
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-orange-950/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent" />

      <header className="relative z-20 border-b border-border/40 backdrop-blur-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-500">
              <Gauge className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground block">KNZ Otimizações</span>
              <span className="text-xs text-muted-foreground">Maximize a performance do seu PC</span>
            </div>
          </div>
        </nav>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-8 text-center lg:text-left animate-fade-in">
              <div className="space-y-4">
                <AudioWave />
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                  Otimize seu PC
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500">
                    ao máximo
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                  Regedit, overclock, limpeza e as melhores configurações para seu sistema em um só lugar.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto lg:mx-0">
                <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-2 mx-auto lg:mx-0">
                    <Cpu className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">Overclock</h3>
                  <p className="text-xs text-muted-foreground">CPU e GPU otimizados</p>
                </div>

                <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-2 mx-auto lg:mx-0">
                    <HardDrive className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">Limpeza</h3>
                  <p className="text-xs text-muted-foreground">Sistema sempre rápido</p>
                </div>

                <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-2 mx-auto lg:mx-0">
                    <Settings className="w-5 h-5 text-yellow-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">Regedit</h3>
                  <p className="text-xs text-muted-foreground">Tweaks avançados</p>
                </div>

                <div className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-2 mx-auto lg:mx-0">
                    <Zap className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">Performance</h3>
                  <p className="text-xs text-muted-foreground">Máximo FPS em jogos</p>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md mx-auto animate-fade-in">
              <Card className="border-border/50 backdrop-blur-sm bg-card/80 shadow-2xl">
                <CardHeader className="space-y-1 pb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-500 shadow-lg shadow-red-500/50 animate-pulse-glow">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-center font-bold">
                    Acesso Restrito
                  </CardTitle>
                  <CardDescription className="text-center">
                    Insira sua chave de acesso para começar
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="accessKey" className="text-foreground">
                        Chave de Acesso
                      </Label>
                      <div className="relative group">
                        <Lock
                          className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                            isFocused ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                        <Input
                          id="accessKey"
                          type="password"
                          placeholder="Digite sua chave de acesso"
                          value={accessKey}
                          onChange={handleInputChange}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          disabled={state === "loading" || state === "success"}
                          className={`pl-10 h-12 transition-all duration-300 ${
                            isFocused ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                          } ${
                            state === "error" ? "border-red-500 focus-visible:ring-red-500" : ""
                          } ${
                            state === "success" ? "border-green-500" : ""
                          }`}
                          aria-invalid={state === "error"}
                          aria-describedby={state === "error" ? "error-message" : undefined}
                        />
                        {state === "success" && (
                          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 animate-fade-in" />
                        )}
                        {state === "error" && (
                          <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500 animate-fade-in" />
                        )}
                      </div>
                      {errorMessage && (
                        <p
                          id="error-message"
                          className="text-sm text-red-500 flex items-center gap-1 animate-fade-in"
                          role="alert"
                        >
                          <XCircle className="w-4 h-4" />
                          {errorMessage}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-semibold relative overflow-hidden group"
                      disabled={state === "loading" || state === "success"}
                    >
                      {state === "loading" && (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Validando...
                        </>
                      )}
                      {state === "success" && (
                        <>
                          <CheckCircle2 className="mr-2 h-5 w-5" />
                          Acesso Concedido!
                        </>
                      )}
                      {state === "idle" && "Acessar Plataforma"}
                      {state === "error" && "Tentar Novamente"}

                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </CardContent>

                  <CardFooter className="flex flex-col space-y-3 pt-2">
                    <div className="flex items-center justify-between w-full text-sm">
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                        onClick={() => alert("Entre em contato: admin@knzotimizacoes.com")}
                      >
                        Solicitar acesso
                      </button>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                        onClick={() => alert("Entre em contato: suporte@knzotimizacoes.com")}
                      >
                        Esqueci minha chave
                      </button>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                      Demo: <code className="px-2 py-1 bg-muted rounded text-primary font-mono">DEMO123</code>
                    </p>
                  </CardFooter>
                </form>
              </Card>

              <p className="text-center text-xs text-muted-foreground mt-6">
                © 2026 KNZ Otimizações. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
