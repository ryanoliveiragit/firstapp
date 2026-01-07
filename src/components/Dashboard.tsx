import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";
import { Command } from "@tauri-apps/plugin-shell";
import { resolveResource } from "@tauri-apps/api/path";
import { toast } from "sonner";
import { FPSBoostCard } from "./dashboard/FPSBoostCard";
import { AutoGPUCard } from "./dashboard/AutoGPUCard";
import { SettingsPanel } from "./dashboard/SettingsPanel";
import { ProfilePanel } from "./dashboard/ProfilePanel";
import { StatusPanel } from "./dashboard/StatusPanel";
import { MaintenanceCard } from "./dashboard/MaintenanceCard";
import { NetworkOptimizerCard } from "./dashboard/NetworkOptimizerCard";
import { PerformanceOptimizerCard } from "./dashboard/PerformanceOptimizerCard";
import { FPSExtremeCard } from "./dashboard/FPSExtremeCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Info } from "lucide-react";
import { DashboardHeader } from "./dashboard/DashboardHeader";

type OptimizationLevel = "basica" | "intermediaria" | "avancada";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("optimizations");
  const [optimizationLevel, setOptimizationLevel] =
    useState<OptimizationLevel>("avancada");
  const [isFetchingOptimizations, setIsFetchingOptimizations] = useState(false);
  const [, setShowOptimizationModal] = useState(false);
  const [, setOptimizationFlowStep] = useState<
    "intro" | "fetch" | "found" | "redirecting"
  >("intro");
  const [isExecuting, setIsExecuting] = useState(false);
  const [isApplyingFPS, setIsApplyingFPS] = useState(false);
  const [isRunningMaintenance, setIsRunningMaintenance] = useState(false);
  const [isOptimizingNetwork, setIsOptimizingNetwork] = useState(false);
  const [isOptimizingPerformance, setIsOptimizingPerformance] = useState(false);
  const [isApplyingExtremeFPS, setIsApplyingExtremeFPS] = useState(false);
  const [hasAdminConsent, setHasAdminConsent] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const adminConsentResolver = useRef<((value: boolean) => void) | null>(null);
  const [commandOutput, setCommandOutput] = useState<string[]>([]);
  const { user } = useAuth();

  const logCommandResult = (
    label: string,
    output: { code: number | null; stdout?: string; stderr?: string }
  ) => {
    console.info(`[Synapse] ${label} -> exit code: ${output.code ?? "null"}`);
    if (output.stdout) {
      console.info(`[Synapse] ${label} stdout: ${output.stdout}`);
    }
    if (output.stderr) {
      console.info(`[Synapse] ${label} stderr: ${output.stderr}`);
    }
  };

  const buildStartProcessCommand = (filePath: string, args?: string) => {
    const sanitizedPath = filePath.replace(/'/g, "''");
    const sanitizedArgs = args ? args.replace(/'/g, "''") : undefined;
    return `Start-Process -FilePath '${sanitizedPath}' -Verb RunAs${
      sanitizedArgs ? ` -ArgumentList '${sanitizedArgs}'` : ""
    } -WindowStyle Hidden`;
  };

  const requestAdminPermission = async () => {
    if (hasAdminConsent) return true;

    return new Promise<boolean>((resolve) => {
      adminConsentResolver.current = resolve;
      setShowAdminModal(true);
    });
  };

  useEffect(() => {
    void requestAdminPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addOutput = (message: string) => {
    setCommandOutput((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${message}`,
    ]);
  };

  const clearOutput = () => {
    setCommandOutput([]);
  };

  const finalizeConsole = () => {
    setShowConsole(false);
    clearOutput();
  };

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const ensureShellPermissions = async () => true;

  const runBatchCommandWithOutput = async (
    resourceName: string,
    onSuccess: string,
    onError: string,
    setLoading: (value: boolean) => void
  ) => {
    const hasShellPermission = await ensureShellPermissions();
    if (!hasShellPermission) return;

    const hasPermission = await requestAdminPermission();
    if (!hasPermission) return;

    setLoading(true);
    setShowConsole(true);
    clearOutput();
    addOutput(`Iniciando ${resourceName}...`);

    try {
      const batchPath = await resolveResource(resourceName);
      const command = buildStartProcessCommand(
        batchPath,
        `/C "call \\"${batchPath}\\""`
      );

      const cmd = Command.create("powershell-elevated", [
        "-NoProfile",
        "-NonInteractive",
        "-Command",
        command,
      ]);

      // Escuta stdout em tempo real
      cmd.stdout.on("data", (line: string) => {
        addOutput(`[OUT] ${line}`);
      });

      // Escuta stderr em tempo real
      cmd.stderr.on("data", (line: string) => {
        addOutput(`[ERR] ${line}`);
      });

      // Escuta quando o processo termina
      cmd.on(
        "close",
        (data: { code: number | null; signal: number | null }) => {
          logCommandResult(resourceName, { code: data.code });

          if (data.code === 0) {
            const successMessage = `✓ ${onSuccess}`;
            addOutput(successMessage);
            toast.success(successMessage);
          } else {
            const failMessage = `✗ ${onError} - Código: ${data.code}`;
            addOutput(failMessage);
            toast.error(`${onError}: Código de saída ${data.code}`);
          }
          setLoading(false);
          finalizeConsole();
        }
      );

      // Escuta erros
      cmd.on("error", (error: string) => {
        addOutput(`[ERRO] ${error}`);
        toast.error(`${onError}: ${error}`);
        setLoading(false);
        finalizeConsole();
      });

      await cmd.spawn();
    } catch (error) {
      console.error(`[Synapse] ${resourceName} error:`, error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      addOutput(`[EXCEÇÃO] ${errorMsg}`);
      toast.error(`${onError}: ${errorMsg}`);
      setLoading(false);
      finalizeConsole();
    }
  };

  const handleFPSBoost = async () => {
    const hasShellPermission = await ensureShellPermissions();
    if (!hasShellPermission) return;

    const hasPermission = await requestAdminPermission();
    if (!hasPermission) return;

    setIsApplyingFPS(true);
    setShowConsole(true);
    clearOutput();
    addOutput("Aplicando FPS Boost...");

    try {
      const regPath = await resolveResource("fps-boost.reg");
      const command = buildStartProcessCommand(
        "regedit.exe",
        `/s \\"${regPath}\\"`
      );

      const cmd = Command.create("powershell-elevated", [
        "-NoProfile",
        "-NonInteractive",
        "-Command",
        command,
      ]);

      cmd.stdout.on("data", (line: string) => {
        addOutput(`[OUT] ${line}`);
      });

      cmd.stderr.on("data", (line: string) => {
        addOutput(`[ERR] ${line}`);
      });

      cmd.on(
        "close",
        (data: { code: number | null; signal: number | null }) => {
          logCommandResult("fps-boost.reg", { code: data.code });

          if (data.code === 0) {
            const successMessage = "✓ FPS Boost aplicado com sucesso!";
            addOutput(successMessage);
            toast.success(successMessage);
          } else {
            const failMessage = `✗ Erro ao aplicar FPS Boost - Código: ${data.code}`;
            addOutput(failMessage);
            toast.error(`✗ Erro ao aplicar FPS Boost: Código ${data.code}`);
          }
          setIsApplyingFPS(false);
          finalizeConsole();
        }
      );

      cmd.on("error", (error: string) => {
        addOutput(`[ERRO] ${error}`);
        toast.error(`✗ Erro: ${error}`);
        setIsApplyingFPS(false);
        finalizeConsole();
      });

      await cmd.spawn();
    } catch (error) {
      console.error("[Synapse] fps-boost.reg error:", error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      addOutput(`[EXCEÇÃO] ${errorMsg}`);
      toast.error(`✗ Erro: ${errorMsg}`);
      setIsApplyingFPS(false);
      finalizeConsole();
    }
  };

  const handleAutoGPU = async () => {
    await runBatchCommandWithOutput(
      "auto-gpu-config.bat",
      "✓ GPU configurada com sucesso!",
      "✗ Erro ao configurar GPU",
      setIsExecuting
    );
  };

  const handleMaintenance = async () => {
    await runBatchCommandWithOutput(
      "maintenance-cleanup.bat",
      "✓ Limpeza rápida concluída!",
      "✗ Erro ao executar limpeza",
      setIsRunningMaintenance
    );
  };

  const handleNetworkOptimization = async () => {
    await runBatchCommandWithOutput(
      "network-optimizer.bat",
      "✓ Rede otimizada com sucesso!",
      "✗ Erro ao otimizar rede",
      setIsOptimizingNetwork
    );
  };

  const handleExtremeFPSOptimization = async () => {
    await runBatchCommandWithOutput(
      "fps_extremo.bat",
      "FPS Extremo aplicado com sucesso!",
      "Erro ao aplicar FPS Extremo",
      setIsApplyingExtremeFPS
    );
  };

  const handlePerformanceOptimization = async () => {
    await runBatchCommandWithOutput(
      "performance-optimizer.bat",
      "✓ Otimização de desempenho aplicada!",
      "✗ Erro ao aplicar otimizações de desempenho",
      setIsOptimizingPerformance
    );
  };

  const renderOptimizationContent = () => {
    if (optimizationLevel === "avancada") {
      return (
        <div className="grid gap-8 animate-fade-in-up grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr items-stretch z-50">
          <FPSBoostCard isApplying={isApplyingFPS} onApply={handleFPSBoost} />
          <PerformanceOptimizerCard
            isExecuting={isOptimizingPerformance}
            onExecute={handlePerformanceOptimization}
          />
          <FPSExtremeCard
            isExecuting={isApplyingExtremeFPS}
            onExecute={handleExtremeFPSOptimization}
          />
        </div>
      );
    }

    const levelLabel =
      optimizationLevel === "basica"
        ? "Básica"
        : optimizationLevel === "intermediaria"
        ? "Intermediária"
        : "Avançada";

    return (
      <Card
        className="glass-panel glass-card animate-fade-in-up"
        style={{ animationDelay: "120ms" }}
      >
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 bg-secondary rounded-md border border-white/10">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>Nível {levelLabel}</CardTitle>
            <CardDescription>
              Conteúdos deste nível estarão disponíveis em breve.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Selecione o nível{" "}
          <span className="text-foreground font-medium">Avançada</span> para
          acessar as otimizações atuais (regedits e scripts .bat) enquanto os
          demais níveis são finalizados.
        </CardContent>
      </Card>
    );
  };

  const simulateOptimizationFetch = async () => {
    setShowOptimizationModal(true);
    setOptimizationFlowStep("intro");

    await wait(400);
    setOptimizationFlowStep("fetch");

    await wait(1200);
    setOptimizationFlowStep("found");
    setOptimizationLevel("avancada");

    await wait(700);
    setOptimizationFlowStep("redirecting");

    await wait(500);
    setActiveTab("optimizations");
    setShowOptimizationModal(false);
  };

  const handleTabChange = async (tabId: string) => {
    if (tabId === "optimizations") {
      if (isFetchingOptimizations) return;

      try {
        setIsFetchingOptimizations(true);
        await simulateOptimizationFetch();
      } finally {
        setIsFetchingOptimizations(false);
      }
      return;
    }

    setActiveTab(tabId);
  };


  return (
    <div className="app-shell">
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
          <div className="glass-panel rounded-2xl max-w-md w-full mx-4 p-6 space-y-5">
            <div className="flex items-start gap-3">
              <div className="flexitems-center justify-center rounded-full text-primary">
                <span className="text-xl ">!</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  Permissão de Administrador
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Precisamos da sua autorização para executar otimizações com
                  privilégios elevados. Ao continuar, aceite o prompt do Windows
                  que será exibido.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 text-sm rounded-md border border-white/10 hover:border-white/20 transition-colors"
                onClick={() => {
                  setShowAdminModal(false);
                  adminConsentResolver.current?.(false);
                  adminConsentResolver.current = null;
                }}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 text-sm rounded-md bg-primary text-black hover:brightness-110 transition-all shadow-lg shadow-primary/30"
                onClick={() => {
                  setHasAdminConsent(true);
                  setShowAdminModal(false);
                  adminConsentResolver.current?.(true);
                  adminConsentResolver.current = null;
                }}
              >
                Continuar e aceitar
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="relative flex h-screen">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isOptimizationsLoading={isFetchingOptimizations}
        />
        <div className="relative flex-1 overflow-auto">
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="p-6 lg:p-10 space-y-8 relative z-10 max-w-7xl mx-auto">
            <div className="animate-fade-in-up flex flex-col gap-6">
              <DashboardHeader />
            </div>

            {showConsole && (
              <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur">
                <div className="console-surface rounded-2xl max-w-3xl w-full mx-4 p-5 animate-fade-in-up">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="glow-dot" />
                      <h3 className="text-sm font-semibold text-green-400 font-mono">
                        Console Output
                      </h3>
                    </div>
                    <button
                      onClick={finalizeConsole}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Fechar
                    </button>
                  </div>
                  <div className="bg-black/60 border border-white/5 rounded-lg p-3 max-h-72 min-h-[220px] overflow-y-auto font-mono text-xs space-y-1">
                    {commandOutput.length === 0 && (
                      <div className="text-muted-foreground">
                        Aguardando logs...
                      </div>
                    )}
                    {commandOutput.map((line, idx) => (
                      <div
                        key={idx}
                        className={`${
                          line.includes("[ERR]") || line.includes("[ERRO]")
                            ? "text-red-400"
                            : line.includes("✓")
                            ? "text-green-400"
                            : line.includes("✗")
                            ? "text-yellow-300"
                            : "text-gray-200"
                        }`}
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "optimizations" && (
              <div className="space-y-6">
                {renderOptimizationContent()}
              </div>
            )}

            {activeTab === "utilities" && (
              <div
                className="grid gap-8 animate-fade-in-up grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr items-stretch"
                style={{ animationDelay: "100ms" }}
              >
                <AutoGPUCard
                  isExecuting={isExecuting}
                  onExecute={handleAutoGPU}
                />
                <NetworkOptimizerCard
                  isExecuting={isOptimizingNetwork}
                  onExecute={handleNetworkOptimization}
                />
                <MaintenanceCard
                  isExecuting={isRunningMaintenance}
                  onExecute={handleMaintenance}
                />
              </div>
            )}

            {activeTab === "status" && (
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: "100ms" }}
              >
                <StatusPanel />
              </div>
            )}

            {activeTab === "config" && (
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: "100ms" }}
              >
                <SettingsPanel />
              </div>
            )}

            {activeTab === "profile" && (
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: "100ms" }}
              >
                <ProfilePanel user={user} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
