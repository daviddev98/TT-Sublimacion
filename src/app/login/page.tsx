"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { credentialsMatch, SESSION_COOKIE } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!credentialsMatch(username, password)) {
      setError("Usuario o contraseña incorrectos.")
      return
    }
    document.cookie = `${SESSION_COOKIE}=ok; Path=/; Max-Age=43200; SameSite=Lax`
    toast.success("Sesión iniciada")
    router.push("/pedido")
    router.refresh()
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-white px-4 py-10">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full border border-brand/30 bg-brand text-sm font-semibold tracking-[0.18em] text-white">
            TT
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-black">
            TT Sublimación
          </h1>
          <p className="mt-2 text-xs tracking-[0.22em] text-brand uppercase">
            Pedidos y cutplan
          </p>
        </div>
        <Card className="border-brand/30 shadow-none">
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Órdenes de trabajo, estilos y corte por talla.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={submit}>
              <div className="grid gap-2">
                <Label htmlFor="usuario">Usuario</Label>
                <Input
                  id="usuario"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="clave">Contraseña</Label>
                <Input
                  id="clave"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              {error ? <p className="text-sm text-brand">{error}</p> : null}
              <Button type="submit" className="mt-1">
                Entrar
              </Button>
            </form>
            <p className="mt-4 rounded-lg border border-brand/20 px-3 py-2 text-sm leading-6 text-muted-foreground">
              Demo: usuario{" "}
              <span className="font-medium text-foreground">tt</span> ·
              contraseña{" "}
              <span className="font-medium text-foreground">sublimacion</span>
            </p>
          </CardContent>
        </Card>
      </motion.div>
      <Toaster />
    </main>
  )
}
