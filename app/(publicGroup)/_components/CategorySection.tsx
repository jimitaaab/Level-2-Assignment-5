import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { ApiCategory } from "@/lib/types"

const BACKEND_URL = process.env.BACKEND_API_URL ?? ""

export async function CategorySection() {
  let categories: ApiCategory[] = []

  try {
    const res = await fetch(`${BACKEND_URL}/api/categories`, {
      next: { revalidate: 300, tags: ["categories"] },
    })
    if (res.ok) {
      const body = await res.json()
      const raw = body.data ?? body
      categories = Array.isArray(raw) ? raw : []
    }
  } catch {
    categories = []
  }

  if (categories.length === 0) return null

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Browse by Category</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Find the perfect gear for your activity
            </p>
          </div>
          <Link
            href="/gear"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
          >
            View all gear
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map(({ id, name }) => (
            <Link
              key={id}
              href={`/gear?category=${name.toLowerCase().replace(/\s+/g, "-")}`}
              className="inline-flex items-center rounded-full border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-primary/5"
            >
              {name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
