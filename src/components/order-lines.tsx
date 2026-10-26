"use client"

import { useEffect, useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FABRICS, findProduct } from "@/lib/catalog"
import { piecesByStyle, sizesForStyle, totalPieces } from "@/lib/orders"
import type { OrderLine, WorkOrder } from "@/lib/types"

function QuantityCell({
  value,
  onCommit,
}: {
  value: number
  onCommit: (quantity: number) => void
}) {
  const [text, setText] = useState(String(value))

  useEffect(() => {
    setText(String(value))
  }, [value])

  return (
    <Input
      className="w-20 tabular-nums"
      inputMode="numeric"
      aria-label="Cantidad"
      value={text}
      onChange={(event) => setText(event.target.value.replace(/[^\d]/g, ""))}
      onBlur={() => {
        const quantity = Number(text)
        if (Number.isInteger(quantity) && quantity >= 1) onCommit(quantity)
        else setText(String(value))
      }}
    />
  )
}

export function OrderLines({
  order,
  onUpdateLine,
  onRemoveLine,
}: {
  order: WorkOrder
  onUpdateLine: (lineId: string, patch: Partial<OrderLine>) => void
  onRemoveLine: (lineId: string) => void
}) {
  const groups = piecesByStyle(order.lines)
  const total = totalPieces(order.lines)

  return (
    <div className="grid gap-6">
      <div className="overflow-hidden rounded-xl border border-brand/20">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estilo / Patrón</TableHead>
              <TableHead>Tela</TableHead>
              <TableHead>Talla</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Personalización</TableHead>
              <TableHead>Obs</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.lines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  Esta orden todavía no tiene piezas.
                </TableCell>
              </TableRow>
            ) : (
              order.lines.map((line) => {
                const product = findProduct(line.styleCode)
                const sizes = sizesForStyle(product, line.size)
                const knownFabric = FABRICS.some(
                  (fabric) => fabric.code === line.fabricCode,
                )
                return (
                  <TableRow key={line.id}>
                    <TableCell>
                      <p className="font-medium">{line.styleCode}</p>
                      {product ? (
                        <p className="text-xs text-muted-foreground">
                          {product.description}
                        </p>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={line.fabricCode}
                        onValueChange={(fabricCode) =>
                          onUpdateLine(line.id, { fabricCode })
                        }
                      >
                        <SelectTrigger className="w-44" aria-label="Tela">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {knownFabric ? null : (
                            <SelectItem value={line.fabricCode}>
                              {line.fabricCode}
                            </SelectItem>
                          )}
                          {FABRICS.map((fabric) => (
                            <SelectItem key={fabric.code} value={fabric.code}>
                              {fabric.code} · {fabric.color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={line.size}
                        onValueChange={(size) => onUpdateLine(line.id, { size })}
                      >
                        <SelectTrigger className="w-24" aria-label="Talla">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sizes.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <QuantityCell
                        value={line.quantity}
                        onCommit={(quantity) => onUpdateLine(line.id, { quantity })}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={line.personalized ? "SI" : "NO"}
                        onValueChange={(value) =>
                          onUpdateLine(line.id, { personalized: value === "SI" })
                        }
                      >
                        <SelectTrigger className="w-20" aria-label="Personalización">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NO">NO</SelectItem>
                          <SelectItem value="SI">SI</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        aria-label="Observación"
                        value={line.notes}
                        onChange={(event) =>
                          onUpdateLine(line.id, { notes: event.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Quitar ${line.styleCode} talla ${line.size}`}
                        onClick={() => onRemoveLine(line.id)}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="overflow-hidden rounded-xl border border-brand/20">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estilo / Patrón</TableHead>
              <TableHead className="text-right">Cantidad de piezas por estilo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="py-6 text-center text-muted-foreground">
                  Sin piezas todavía.
                </TableCell>
              </TableRow>
            ) : (
              groups.map((group) => (
                <TableRow key={group.styleCode}>
                  <TableCell className="font-medium">{group.styleCode}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {group.quantity}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {groups.length > 0 ? (
            <TableFooter>
              <TableRow>
                <TableCell>Total general de piezas</TableCell>
                <TableCell className="text-right tabular-nums">{total}</TableCell>
              </TableRow>
            </TableFooter>
          ) : null}
        </Table>
      </div>
    </div>
  )
}
