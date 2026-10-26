import type { Fabric, Product } from "@/lib/types"

/** Catálogo de la hoja PRODUCTO. Patronaje alimenta esta tabla; no tiene pantalla propia. */
export const PRODUCTS: Product[] = [
  {
    code: "TT CAM HOM MC CR",
    gender: "HOMBRE",
    category: "Top / Superior",
    description: "Camisa manga corta cuello Redondo",
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL"],
  },
  {
    code: "TT CAM MUJ MC CR",
    gender: "MUJER",
    category: "Top / Superior",
    description: "Camisa manga corta cuello Redondo",
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
  },
  {
    code: "TT CAM NINO MC CR",
    gender: "INFANTIL",
    category: "Top / Superior",
    description: "Camisa manga corta cuello Redondo",
    sizes: ["1", "2", "4", "6", "8", "10", "12", "14", "16"],
  },
  {
    code: "TT BUZO BASICO",
    gender: "HOMBRE",
    category: "Bottom / Inferior",
    description: "Buzo Basico con cordon y bolsas laterales",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
  },
  {
    code: "BANDANA",
    gender: "PROMOCIONAL",
    category: "Prom / Promocional",
    description: "Bandana tipo bincha",
    sizes: ["BASE"],
  },
  {
    code: "TT03-02-BGY-01",
    gender: "INFANTIL",
    category: "Suit / Traje",
    description: "Body Gimnasia Sin mangas y elastico en pierna",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
  },
]

/** Catálogo de la hoja TELAS. Compras alimenta esta tabla; no tiene pantalla propia. */
export const FABRICS: Fabric[] = [
  {
    code: "DRY PERU",
    type: "Tela P/ Sublimar",
    cutWidth: 67,
    color: "Blanco",
    composition: "100% Poliester",
  },
  {
    code: "CITY",
    type: "Tela P/ Sublimar",
    cutWidth: 63,
    color: "Blanco",
    composition: "100% Poliester",
  },
  {
    code: "MESH CARIBE",
    type: "Tela P/ Sublimar",
    cutWidth: 70,
    color: "Blanco",
    composition: "100% Poliester",
  },
  {
    code: "FITMAX",
    type: "Tela Color",
    cutWidth: 58,
    color: "Navy",
    composition: "98% Poliester 2% Elastano",
  },
  {
    code: "SUPERKIANA",
    type: "Tela P/ Sublimar",
    cutWidth: 58,
    color: "Blanco",
    composition: "100% Poliester",
    supplier: "Textiles Universales",
    notes: "Proveedor Local",
  },
  {
    code: "PELLUM",
    type: "Entretela / Fusionar",
    cutWidth: 58,
    color: "Blanco",
    composition: "100% Poliester",
    supplier: "Wendell",
    notes: "Entretela Suave para Cuellos",
  },
]

export function findProduct(code: string) {
  return PRODUCTS.find((product) => product.code === code)
}

export function findFabric(code: string) {
  return FABRICS.find((fabric) => fabric.code === code)
}

export function fabricDetail(fabric: Fabric) {
  return [
    fabric.type,
    fabric.color,
    fabric.composition,
    `ancho ${fabric.cutWidth}`,
    fabric.supplier,
    fabric.notes,
  ]
    .filter(Boolean)
    .join(" · ")
}
