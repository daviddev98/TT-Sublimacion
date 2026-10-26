"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { isoDate } from "@/lib/format"
import { nextOdtNumber } from "@/lib/orders"
import { createSeed } from "@/lib/seed"
import type { NewOrderLine, OrderLine, WorkOrder } from "@/lib/types"

const STORAGE_KEY = "tt-sublimacion-v1"

type Store = {
  ready: boolean
  orders: WorkOrder[]
  createOrder: () => WorkOrder
  updateOrder: (id: string, patch: Partial<Omit<WorkOrder, "id" | "lines">>) => void
  removeOrder: (id: string) => void
  addLines: (orderId: string, lines: NewOrderLine[]) => void
  updateLine: (orderId: string, lineId: string, patch: Partial<OrderLine>) => void
  removeLine: (orderId: string, lineId: string) => void
  resetDemo: () => void
}

const OrdersContext = createContext<Store | null>(null)

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<WorkOrder[]>(() => createSeed())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as WorkOrder[]
        if (Array.isArray(parsed)) setOrders(parsed)
      } catch {
        setOrders(createSeed())
      }
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  }, [orders, ready])

  const store = useMemo<Store>(() => {
    return {
      ready,
      orders,
      createOrder: () => {
        const order: WorkOrder = {
          id: uid("odt"),
          number: nextOdtNumber(orders),
          createdAt: isoDate(),
          client: "",
          seller: "",
          lines: [],
        }
        setOrders((current) => {
          const fresh = {
            ...order,
            number: nextOdtNumber(current),
          }
          order.number = fresh.number
          return [fresh, ...current]
        })
        return order
      },
      updateOrder: (id, patch) => {
        setOrders((current) =>
          current.map((order) => (order.id === id ? { ...order, ...patch } : order)),
        )
      },
      removeOrder: (id) => {
        setOrders((current) => current.filter((order) => order.id !== id))
      },
      addLines: (orderId, lines) => {
        const withIds = lines.map((line) => ({ ...line, id: uid("ln") }))
        setOrders((current) =>
          current.map((order) =>
            order.id === orderId
              ? { ...order, lines: [...order.lines, ...withIds] }
              : order,
          ),
        )
      },
      updateLine: (orderId, lineId, patch) => {
        setOrders((current) =>
          current.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  lines: order.lines.map((line) =>
                    line.id === lineId ? { ...line, ...patch, id: line.id } : line,
                  ),
                }
              : order,
          ),
        )
      },
      removeLine: (orderId, lineId) => {
        setOrders((current) =>
          current.map((order) =>
            order.id === orderId
              ? { ...order, lines: order.lines.filter((line) => line.id !== lineId) }
              : order,
          ),
        )
      },
      resetDemo: () => setOrders(createSeed()),
    }
  }, [orders, ready])

  return <OrdersContext.Provider value={store}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const store = useContext(OrdersContext)
  if (!store) throw new Error("useOrders debe usarse dentro de OrdersProvider")
  return store
}
