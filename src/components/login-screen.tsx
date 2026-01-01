import { useState, FormEvent } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle2, XCircle, Lock, Sparkles } from "lucide-react"

type LoginState = "idle" | "loading" | "success" | "error"

export function LoginScreen() {
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-red-950/10" />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600 to-red-500 mb-4 shadow-lg shadow-red-500/50 animate-pulse-glow">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            OptimizerAI
          </h1>
          <p className="text-muted-foreground text-sm">
            Plataforma de Otimização Inteligente
          </p>
        </div>

        <Card className="border-border/50 backdrop-blur-sm bg-card/80 shadow-2xl animate-fade-in">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center font-bold">
              Acesso Restrito
            </CardTitle>
            <CardDescription className="text-center">
              Insira sua chave de acesso para continuar
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
                {state === "idle" && "Acessar"}
                {state === "error" && "Tentar Novamente"}

                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <div className="flex items-center justify-between w-full text-sm">
                <button
                  type="button"
                  className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  onClick={() => alert("Entre em contato: admin@optimizerai.com")}
                >
                  Solicitar acesso
                </button>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  onClick={() => alert("Entre em contato: suporte@optimizerai.com")}
                >
                  Esqueci minha chave
                </button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Para demonstração, use a chave: <code className="px-2 py-1 bg-muted rounded text-primary font-mono">DEMO123</code>
              </p>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2026 OptimizerAI. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
