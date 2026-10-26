import { isoDate } from "@/lib/format"
import type { WorkOrder } from "@/lib/types"

/**
 * Orden de ejemplo con la misma cuenta del cutplan de referencia:
 * 3+2+3 = 8, 2+1 = 3, 3 = 3, total general 14.
 * Telas y estilos salen de las hojas PRODUCTO y TELAS.
 */
export function createSeed(): WorkOrder[] {
  return [
    {
      id: "odt-demo-1",
      number: "ODT-0001",
      createdAt: isoDate(-3),
      client: "Escuela Deportiva Atlas",
      seller: "Carlos Méndez",
      lines: [
        {
          id: "ln-1",
          styleCode: "TT CAM HOM MC CR",
          fabricCode: "DRY PERU",
          size: "S",
          quantity: 3,
          personalized: false,
          notes: "",
        },
        {
          id: "ln-2",
          styleCode: "TT CAM HOM MC CR",
          fabricCode: "DRY PERU",
          size: "M",
          quantity: 2,
          personalized: false,
          notes: "",
        },
        {
          id: "ln-3",
          styleCode: "TT CAM HOM MC CR",
          fabricCode: "DRY PERU",
          size: "L",
          quantity: 3,
          personalized: true,
          notes: "",
        },
        {
          id: "ln-4",
          styleCode: "TT BUZO BASICO",
          fabricCode: "SUPERKIANA",
          size: "M",
          quantity: 2,
          personalized: false,
          notes: "Elastico con Cordon",
        },
        {
          id: "ln-5",
          styleCode: "TT BUZO BASICO",
          fabricCode: "SUPERKIANA",
          size: "XL",
          quantity: 1,
          personalized: false,
          notes: "Elastico con Cordon",
        },
        {
          id: "ln-6",
          styleCode: "TT03-02-BGY-01",
          fabricCode: "FITMAX",
          size: "M",
          quantity: 3,
          personalized: false,
          notes: "Sin elastico en Pierna",
        },
      ],
    },
  ]
}
