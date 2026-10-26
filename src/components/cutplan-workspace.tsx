"use client"

import { Fragment, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Printer } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { findProduct } from "@/lib/catalog"
import { formatDate, isoDate } from "@/lib/format"
import { formatSiNo, piecesByStyle, totalPieces } from "@/lib/orders"
import { useOrders } from "@/lib/store"

export function CutplanWorkspace() {
  const router = useRouter()
  const params = useSearchParams()
  const { ready, orders } = useOrders()
  const requested = params.get("odt")
  const order =
    orders.find((item) => item.id === requested) ?? orders[0] ?? null
  const printedAt = isoDate()

  useEffect(() => {
    document.title = "Cutplan · TT Sublimación"
  }, [])

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Cargando cutplan…</p>
  }

  return (
    <div>
      <div className="no-print">
        <PageHeader
          title="Cutplan"
          description="Agrupa las piezas de la orden de trabajo por estilo, con el total de cada uno y el total general."
          actions={
            <Button onClick={() => window.print()} disabled={!order}>
              <Printer />
              Imprimir
            </Button>
          }
        />
        {orders.length > 0 ? (
          <div className="mb-6 grid max-w-sm gap-2">
            <p className="text-sm font-medium">Orden de trabajo</p>
            <Select
              value={order?.id}
              onValueChange={(id) => router.replace(`/cutplan?odt=${id}`)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Elige una ODT" />
              </SelectTrigger>
              <SelectContent>
                {orders.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.number} · {item.client || "Sin cliente"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </div>

      {!order ? (
        <p className="rounded-xl border border-dashed border-brand/30 px-4 py-10 text-center text-sm text-muted-foreground">
          No hay órdenes. Crea una en Pedido para generar su cutplan.
        </p>
      ) : (
        <CutplanDocument orderId={order.id} printedAt={printedAt} />
      )}
    </div>
  )
}

function CutplanDocument({
  orderId,
  printedAt,
}: {
  orderId: string
  printedAt: string
}) {
  const { orders } = useOrders()
  const order = orders.find((item) => item.id === orderId)
  if (!order) return null

  const groups = piecesByStyle(order.lines)
  const total = totalPieces(order.lines)

  return (
    <article className="print-sheet max-w-full rounded-xl border border-brand/20 bg-white p-4 md:p-8">
      <div className="grid gap-4 border-b border-brand/20 pb-4 sm:grid-cols-2">
        <p className="text-sm">
          <span className="text-muted-foreground">Fecha de creación</span>
          <span className="mt-1 block text-base font-medium">
            {formatDate(order.createdAt)}
          </span>
        </p>
        <p className="text-sm">
          <span className="text-muted-foreground"># ODT</span>
          <span className="mt-1 block text-base font-medium">{order.number}</span>
        </p>
        <p className="text-sm">
          <span className="text-muted-foreground">Cliente</span>
          <span className="mt-1 block text-base font-medium">
            {order.client || "—"}
          </span>
        </p>
        <p className="text-sm">
          <span className="text-muted-foreground">Vendedor</span>
          <span className="mt-1 block text-base font-medium">
            {order.seller || "—"}
          </span>
        </p>
      </div>

      <h2 className="mt-6 text-xl font-semibold tracking-tight">Cutplan</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Orden de trabajo {order.number}
      </p>

      <div className="mt-4 overflow-hidden rounded-xl border border-brand/20">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[24%] whitespace-normal">Estilo / Patrón</TableHead>
              <TableHead className="w-[16%] whitespace-normal">Tela</TableHead>
              <TableHead className="w-[10%] whitespace-normal">Talla</TableHead>
              <TableHead className="w-[12%] whitespace-normal">Cantidad</TableHead>
              <TableHead className="w-[16%] whitespace-normal">Personalización</TableHead>
              <TableHead className="whitespace-normal">Obs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  Esta orden no tiene piezas.
                </TableCell>
              </TableRow>
            ) : (
              groups.map((group, index) => (
                <Fragment key={group.styleCode}>
                  {group.lines.map((line) => {
                    const product = findProduct(line.styleCode)
                    return (
                      <TableRow
                        key={line.id}
                        className={index > 0 ? "border-brand/10" : undefined}
                      >
<TableCell className="whitespace-normal">
                        <p className="font-medium">{line.styleCode}</p>
                        {product ? (
                          <p className="text-xs text-muted-foreground">
                            {product.description}
                          </p>
                        ) : null}
                      </TableCell>
                      <TableCell className="whitespace-normal">{line.fabricCode}</TableCell>
                      <TableCell className="whitespace-normal">{line.size}</TableCell>
                      <TableCell className="tabular-nums">{line.quantity}</TableCell>
                      <TableCell>{formatSiNo(line.personalized)}</TableCell>
                      <TableCell className="whitespace-normal">{line.notes}</TableCell>
                      </TableRow>
                    )
                  })}
                  <TableRow className="bg-muted/60 font-medium">
                    <TableCell className="whitespace-normal">{group.styleCode}</TableCell>
                    <TableCell colSpan={2}>TOTAL</TableCell>
                    <TableCell className="tabular-nums">{group.quantity}</TableCell>
                    <TableCell />
                    <TableCell />
                  </TableRow>
                </Fragment>
              ))
            )}
            {groups.length > 0 ? (
              <TableRow className="bg-brand font-semibold text-white hover:bg-brand">
                <TableCell colSpan={3}>TOTAL GENERAL DE PIEZAS</TableCell>
                <TableCell className="tabular-nums">{total}</TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <p className="mt-6 text-right text-sm">
        <span className="text-muted-foreground">Fecha de impresión</span>
        <span className="mt-1 block font-medium">{formatDate(printedAt)}</span>
      </p>
    </article>
  )
}
