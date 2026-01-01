import { useState } from "react"
import { LandingPage } from "./landing-page"
import { LoginScreen } from "./login-screen"
import { NeuralBackground } from "./neural-background"

export function AppContainer() {
  const [showLogin, setShowLogin] = useState(false)

  if (showLogin) {
    return (
      <>
        <NeuralBackground />
        <LoginScreen />
      </>
    )
  }

  return <LandingPage onShowLogin={() => setShowLogin(true)} />
}
