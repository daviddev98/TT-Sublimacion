"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { StylePreview } from "@/components/style-preview"
import { Badge } from "@/components/ui/badge"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FABRICS, PRODUCTS, fabricDetail, findFabric, findProduct } from "@/lib/catalog"
import { searchStyles } from "@/lib/orders"
import { CATEGORIES, type Category, type NewOrderLine } from "@/lib/types"

type DraftRow = {
  key: string
  fabricCode: string
  size: string
  quantity: string
  personalized: boolean
  notes: string
}

function emptyRow(): DraftRow {
  return {
    key: crypto.randomUUID(),
    fabricCode: "",
    size: "",
    quantity: "1",
    personalized: false,
    notes: "",
  }
}

export function StyleFinder({
  onAdd,
}: {
  onAdd: (lines: NewOrderLine[]) => void
}) {
  const [query, setQuery] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [previewCode, setPreviewCode] = useState<string | null>(null)
  const [styleCode, setStyleCode] = useState<string | null>(null)
  const [rows, setRows] = useState<DraftRow[]>([emptyRow()])

  const results = useMemo(
    () => searchStyles(PRODUCTS, query, categories),
    [query, categories],
  )
  const preview = results.find((product) => product.code === previewCode) ?? null
  const selected = findProduct(styleCode ?? "")

  useEffect(() => {
    if (previewCode && !results.some((product) => product.code === previewCode)) {
      setPreviewCode(null)
    }
  }, [previewCode, results])

  function toggleCategory(category: Category) {
    setCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    )
  }

  function choose(code: string) {
    setPreviewCode(code)
    setStyleCode(code)
    setRows([emptyRow()])
    document.getElementById("agregar-tallas")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  function patchRow(key: string, patch: Partial<DraftRow>) {
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    )
  }

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!selected) {
      toast.error("Primero elige un estilo.")
      return
    }

    const filled = rows.filter(
      (row) => row.fabricCode || row.size || row.notes.trim() || row.personalized,
    )
    if (filled.length === 0) {
      toast.error("Indica la tela y la talla.")
      return
    }

    const lines: NewOrderLine[] = []
    for (const row of filled) {
      const quantity = Number(row.quantity)
      if (!row.fabricCode) {
        toast.error("Cada talla necesita una tela.")
        return
      }
      if (!row.size || !selected.sizes.includes(row.size)) {
        toast.error("La talla tiene que pertenecer al estilo.")
        return
      }
      if (!Number.isInteger(quantity) || quantity < 1) {
        toast.error("La cantidad es un entero mayor que cero.")
        return
      }
      lines.push({
        styleCode: selected.code,
        fabricCode: row.fabricCode,
        size: row.size,
        quantity,
        personalized: row.personalized,
        notes: row.notes.trim(),
      })
    }

    onAdd(lines)
    setRows([emptyRow()])
    toast.success(
      lines.length === 1
        ? "Talla agregada a la orden"
        : `${lines.length} tallas agregadas a la orden`,
    )
  }

  return (
    <div className="grid gap-6">
      <Card className="border-brand/20 shadow-none">
        <CardHeader>
          <CardTitle>Buscar estilo</CardTitle>
          <CardDescription>
            Escribe cualquier palabra de la descripción, el código o el género.
            Las categorías se combinan con ese texto.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              value={query}
              placeholder="Ej. buzo, redondo, bandana, hombre"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <p className="text-sm font-medium">Categoría</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => {
                const active = categories.includes(category)
                return (
                  <Button
                    key={category}
                    type="button"
                    size="sm"
                    variant={active ? "default" : "outline"}
                    className={active ? "" : "border-brand/25"}
                    aria-pressed={active}
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="grid gap-2">
              <p className="text-sm text-muted-foreground">
                {results.length === 1
                  ? "1 estilo"
                  : `${results.length} estilos`}
              </p>
              {results.length === 0 ? (
                <p className="rounded-xl border border-dashed border-brand/30 px-4 py-8 text-center text-sm text-muted-foreground">
                  Ningún estilo coincide. Prueba otra palabra o quita categorías.
                </p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {results.map((product) => {
                    const active = product.code === previewCode
                    return (
                      <button
                        key={product.code}
                        type="button"
                        onClick={() => setPreviewCode(product.code)}
                        onDoubleClick={() => choose(product.code)}
                        className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                          active
                            ? "border-brand bg-brand/5"
                            : "border-brand/20 hover:border-brand/50"
                        }`}
                      >
                        <p className="font-medium">{product.code}</p>
                        <p className="mt-1 text-sm leading-5 text-muted-foreground">
                          {product.description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <Badge variant="outline">{product.gender}</Badge>
                          <Badge variant="outline">{product.category}</Badge>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            <div className="grid gap-3">
              <StylePreview product={preview} />
              <Button
                type="button"
                disabled={!preview}
                onClick={() => preview && choose(preview.code)}
              >
                Agregar tallas y cantidades
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                También puedes hacer doble clic en el estilo.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card id="agregar-tallas" className="border-brand/20 shadow-none">
        <CardHeader>
          <CardTitle>Tallas y cantidades</CardTitle>
          <CardDescription>
            El estilo queda fijo. La tela sale del catálogo y la talla, solo del
            patrón elegido. Personalización es sí o no.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={submit}>
            <div className="grid gap-2">
              <Label>Estilo / Patrón</Label>
              <Input
                readOnly
                value={selected ? `${selected.code} · ${selected.description}` : ""}
                placeholder="Seleccionado desde la búsqueda"
              />
            </div>

            {rows.map((row, index) => {
              const fabric = findFabric(row.fabricCode)
              return (
                <div
                  key={row.key}
                  className="grid gap-3 rounded-xl border border-brand/15 p-3 md:grid-cols-2 xl:grid-cols-6"
                >
                  <div className="grid gap-2 xl:col-span-2">
                    <Label>Tela</Label>
                    <Select
                      value={row.fabricCode}
                      onValueChange={(fabricCode) => patchRow(row.key, { fabricCode })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Lista de telas" />
                      </SelectTrigger>
                      <SelectContent>
                        {FABRICS.map((item) => (
                          <SelectItem key={item.code} value={item.code}>
                            {item.code} · {item.color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fabric ? (
                      <p className="text-xs leading-5 text-muted-foreground">
                        {fabricDetail(fabric)}
                      </p>
                    ) : null}
                  </div>
                  <div className="grid gap-2">
                    <Label>Talla</Label>
                    <Select
                      value={row.size}
                      onValueChange={(size) => patchRow(row.key, { size })}
                      disabled={!selected}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Del estilo" />
                      </SelectTrigger>
                      <SelectContent>
                        {(selected?.sizes ?? []).map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`cantidad-${row.key}`}>Cantidad</Label>
                    <Input
                      id={`cantidad-${row.key}`}
                      inputMode="numeric"
                      value={row.quantity}
                      onChange={(event) =>
                        patchRow(row.key, {
                          quantity: event.target.value.replace(/[^\d]/g, ""),
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Personalización</Label>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant={row.personalized ? "outline" : "default"}
                        onClick={() => patchRow(row.key, { personalized: false })}
                      >
                        No
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={row.personalized ? "default" : "outline"}
                        onClick={() => patchRow(row.key, { personalized: true })}
                      >
                        Sí
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2 md:col-span-2 xl:col-span-6">
                    <Label htmlFor={`obs-${row.key}`}>Obs</Label>
                    <Textarea
                      id={`obs-${row.key}`}
                      rows={2}
                      value={row.notes}
                      placeholder="Observación del cliente, si hace falta"
                      onChange={(event) =>
                        patchRow(row.key, { notes: event.target.value })
                      }
                    />
                  </div>
                  {rows.length > 1 ? (
                    <div className="md:col-span-2 xl:col-span-6">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setRows((current) =>
                            current.filter((item) => item.key !== row.key),
                          )
                        }
                      >
                        Quitar talla {index + 1}
                      </Button>
                    </div>
                  ) : null}
                </div>
              )
            })}

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="border-brand/30"
                disabled={!selected}
                onClick={() => setRows((current) => [...current, emptyRow()])}
              >
                Otra talla
              </Button>
              <Button type="submit" disabled={!selected}>
                Agregar a la orden
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
