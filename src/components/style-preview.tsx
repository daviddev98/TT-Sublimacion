import type { Category, Product } from "@/lib/types"

function Garment({ category }: { category: Category }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  }

  if (category === "Bottom / Inferior") {
    return (
      <svg viewBox="0 0 120 160" className="size-56 text-brand" aria-hidden>
        <path
          {...common}
          d="M38 18h44l8 28-10 96H62l-2-52-2 52H40L30 46z"
        />
        <path {...common} d="M48 18c2 8 22 8 24 0" />
      </svg>
    )
  }

  if (category === "Suit / Traje") {
    return (
      <svg viewBox="0 0 120 160" className="size-56 text-brand" aria-hidden>
        <path
          {...common}
          d="M46 22c0-8 28-8 28 0l8 18 10 14-8 8-8-8v78c0 10-32 10-32 0V54l-8 8-8-8 10-14z"
        />
        <path {...common} d="M52 48h16M60 48v18" />
      </svg>
    )
  }

  if (category === "Prom / Promocional") {
    return (
      <svg viewBox="0 0 120 160" className="size-56 text-brand" aria-hidden>
        <path
          {...common}
          d="M28 58c18-22 46-22 64 0 6 28-8 48-32 62-24-14-38-34-32-62z"
        />
        <path {...common} d="M46 78h28" />
      </svg>
    )
  }

  if (category === "Pet / Animal") {
    return (
      <svg viewBox="0 0 120 160" className="size-56 text-brand" aria-hidden>
        <circle {...common} cx="40" cy="58" r="10" />
        <circle {...common} cx="80" cy="58" r="10" />
        <circle {...common} cx="28" cy="78" r="8" />
        <circle {...common} cx="92" cy="78" r="8" />
        <path {...common} d="M46 96c8 16 20 16 28 0 6 18-8 28-14 28s-20-10-14-28z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 120 160" className="size-56 text-brand" aria-hidden>
      <path
        {...common}
        d="M42 28l-16 18 10 12 6-8v72h36V50l6 8 10-12-16-18c-4 10-32 10-36 0z"
      />
      <path {...common} d="M50 46h20" />
    </svg>
  )
}

export function StylePreview({ product }: { product: Product | null }) {
  if (!product) {
    return (
      <div className="flex min-h-[28rem] items-center justify-center rounded-xl border border-dashed border-brand/30 bg-brand/5 px-6 text-center text-sm leading-6 text-muted-foreground">
        Elige un estilo para ver la imagen en grande.
      </div>
    )
  }

  return (
    <div className="flex min-h-[28rem] flex-col items-center justify-center rounded-xl border border-brand/20 bg-brand/5 px-6 py-8 text-center">
      <Garment category={product.category} />
      <p className="text-xs tracking-[0.18em] text-brand uppercase">
        {product.category}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{product.code}</p>
      <p className="mt-1 max-w-xs text-sm leading-6 text-muted-foreground">
        {product.description}
      </p>
      <p className="mt-3 text-xs tracking-wide text-muted-foreground uppercase">
        {product.gender}
      </p>
    </div>
  )
}
