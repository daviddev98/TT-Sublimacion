import type { Category, OrderLine, Product, WorkOrder } from "@/lib/types"

export function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
}

/**
 * Buscador alfanumérico: cada palabra debe aparecer en la descripción,
 * el código del patrón, el género o la categoría. Las categorías activas
 * se combinan con ese texto (cualquiera de las elegidas).
 */
export function searchStyles(
  products: Product[],
  query: string,
  categories: Category[],
) {
  const words = normalizeText(query)
    .split(/[^a-z0-9]+/)
    .filter(Boolean)

  return products.filter((product) => {
    if (categories.length > 0 && !categories.includes(product.category)) {
      return false
    }
    if (words.length === 0) return true
    const haystack = normalizeText(
      `${product.description} ${product.code} ${product.gender} ${product.category}`,
    )
    return words.every((word) => haystack.includes(word))
  })
}

export type StyleGroup = {
  styleCode: string
  lines: OrderLine[]
  quantity: number
}

/** Agrupa como el cutplan: un bloque por estilo, en el orden en que apareció. */
export function piecesByStyle(lines: OrderLine[]): StyleGroup[] {
  const groups: StyleGroup[] = []
  for (const line of lines) {
    let group = groups.find((item) => item.styleCode === line.styleCode)
    if (!group) {
      group = { styleCode: line.styleCode, lines: [], quantity: 0 }
      groups.push(group)
    }
    group.lines.push(line)
    group.quantity += line.quantity
  }
  return groups
}

export function totalPieces(lines: OrderLine[]) {
  return lines.reduce((sum, line) => sum + line.quantity, 0)
}

export function nextOdtNumber(orders: WorkOrder[]) {
  const max = orders.reduce((highest, order) => {
    const match = order.number.match(/(\d+)\s*$/)
    const value = match ? Number(match[1]) : 0
    return Math.max(highest, value)
  }, 0)
  return `ODT-${String(max + 1).padStart(4, "0")}`
}

export function formatSiNo(personalized: boolean) {
  return personalized ? "SI" : "NO"
}

export function sizesForStyle(product: Product | undefined, current?: string) {
  const sizes = product ? [...product.sizes] : []
  if (current && !sizes.includes(current)) sizes.unshift(current)
  return sizes
}
