import { Suspense } from "react"
import { CutplanWorkspace } from "@/components/cutplan-workspace"

export default function CutplanPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Cargando cutplan…</p>}>
      <CutplanWorkspace />
    </Suspense>
  )
}
