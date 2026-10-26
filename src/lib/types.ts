export const CATEGORIES = [
  "Top / Superior",
  "Bottom / Inferior",
  "Suit / Traje",
  "Pet / Animal",
  "Prom / Promocional",
] as const

export type Category = (typeof CATEGORIES)[number]

export type Product = {
  code: string
  gender: string
  category: Category
  description: string
  sizes: string[]
}

export type Fabric = {
  code: string
  type: string
  cutWidth: number
  color: string
  composition: string
  supplier?: string
  notes?: string
}

export type OrderLine = {
  id: string
  styleCode: string
  fabricCode: string
  size: string
  quantity: number
  personalized: boolean
  notes: string
}

export type WorkOrder = {
  id: string
  number: string
  createdAt: string
  client: string
  seller: string
  lines: OrderLine[]
}

export type NewOrderLine = Omit<OrderLine, "id">
