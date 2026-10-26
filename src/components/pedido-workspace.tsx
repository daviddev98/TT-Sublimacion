"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Scissors } from "lucide-react"
import { OrderLines } from "@/components/order-lines"
import { PageHeader } from "@/components/page-header"
import { StyleFinder } from "@/components/style-finder"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/format"
import { totalPieces } from "@/lib/orders"
import { useOrders } from "@/lib/store"

export function PedidoWorkspace() {
  const { ready, orders, createOrder, updateOrder, removeOrder, addLines, updateLine, removeLine } =
    useOrders()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  const order = orders.find((item) => item.id === activeId) ?? null

  useEffect(() => {
    document.title = "Pedido · TT Sublimación"
  }, [])

  useEffect(() => {
    if (!ready || !activeId) return
    if (!orders.some((item) => item.id === activeId)) setActiveId(null)
  }, [activeId, orders, ready])

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Cargando órdenes…</p>
  }

  if (!order) {
    return (
      <div>
        <PageHeader
          title="Pedido"
          description="Orden de trabajo. Cada pedido guarda cliente, vendedor y las piezas que después arma el cutplan."
          actions={
            <Button
              onClick={() => {
                const created = createOrder()
                setActiveId(created.id)
              }}
            >
              <Plus />
              Nueva orden de trabajo
            </Button>
          }
        />
        <div className="overflow-hidden rounded-xl border border-brand/20">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead># ODT</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead className="text-right">Piezas</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    Todavía no hay órdenes de trabajo.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.number}</TableCell>
                    <TableCell>{formatDate(item.createdAt)}</TableCell>
                    <TableCell>{item.client || "—"}</TableCell>
                    <TableCell>{item.seller || "—"}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {totalPieces(item.lines)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-brand/30"
                          onClick={() => setActiveId(item.id)}
                        >
                          Abrir
                        </Button>
                        <Button size="sm" variant="outline" className="border-brand/30" asChild>
                          <Link href={`/cutplan?odt=${item.id}`}>
                            <Scissors />
                            Cutplan
                          </Link>
                        </Button>
                        {pendingDelete === item.id ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              removeOrder(item.id)
                              setPendingDelete(null)
                            }}
                          >
                            Confirmar
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setPendingDelete(item.id)}
                          >
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  const duplicate = orders.some(
    (item) =>
      item.id !== order.id &&
      item.number.trim().toLowerCase() === order.number.trim().toLowerCase() &&
      order.number.trim() !== "",
  )

  return (
    <div className="grid gap-6">
      <PageHeader
        title={order.number || "Orden de trabajo"}
        description="Busca el estilo, confirma la imagen y agrega tela, talla y cantidad. ODT es la orden de trabajo."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="border-brand/30" onClick={() => setActiveId(null)}>
              <ArrowLeft />
              Órdenes
            </Button>
            <Button asChild>
              <Link href={`/cutplan?odt=${order.id}`}>
                <Scissors />
                Ver cutplan
              </Link>
            </Button>
          </div>
        }
      />

      <Card className="border-brand/20 shadow-none">
        <CardHeader>
          <CardTitle>Datos de la orden</CardTitle>
          <CardDescription>
            La fecha actual de este formulario es la fecha de creación del cutplan.
            El número se propone solo y puedes cambiarlo para ligarlo al sistema actual.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="fecha">Fecha actual</Label>
            <Input
              id="fecha"
              type="date"
              value={order.createdAt}
              onChange={(event) => updateOrder(order.id, { createdAt: event.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="odt"># ODT</Label>
            <Input
              id="odt"
              value={order.number}
              onChange={(event) => updateOrder(order.id, { number: event.target.value })}
            />
            {duplicate ? (
              <p className="text-sm text-brand">Ya hay otra orden con este número.</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cliente">Cliente</Label>
            <Input
              id="cliente"
              value={order.client}
              placeholder="Nombre del cliente"
              onChange={(event) => updateOrder(order.id, { client: event.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vendedor">Vendedor</Label>
            <Input
              id="vendedor"
              value={order.seller}
              placeholder="Nombre del vendedor"
              onChange={(event) => updateOrder(order.id, { seller: event.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <StyleFinder key={order.id} onAdd={(lines) => addLines(order.id, lines)} />

      <section className="grid gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Piezas de la orden</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cada fila es una talla. Abajo se suman las piezas de cada estilo.
          </p>
        </div>
        <OrderLines
          order={order}
          onUpdateLine={(lineId, patch) => updateLine(order.id, lineId, patch)}
          onRemoveLine={(lineId) => removeLine(order.id, lineId)}
        />
      </section>
    </div>
  )
}
