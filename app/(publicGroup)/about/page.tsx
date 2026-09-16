import Link from "next/link"
import { ArrowRight, CalendarCheck, Camera, MapPin, ShieldCheck, Smartphone, Store, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

type ApiGearStats = {
  id: string
  providerId: string
  provider?: { id: string; role?: string }
  _count?: { reviews: number }
}

const BACKEND_URL = process.env.BACKEND_API_URL ?? ""

async function getMarketplaceStats() {
  let gearCount = 0
  let providerCount = 0
  let categoryCount = 0
  let reviewCount = 0

  try {
    const [gearRes, categoryRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/gear?limit=1000`, {
        cache: "force-cache",
        next: { revalidate: 300, tags: ["public-gear", "about-stats"] },
      }),
      fetch(`${BACKEND_URL}/api/categories`, {
        cache: "force-cache",
        next: { revalidate: 300, tags: ["categories", "about-stats"] },
      }),
    ])

    if (gearRes.ok) {
      const body = await gearRes.json()
      const raw = body.data ?? body
      const items: ApiGearStats[] = Array.isArray(raw) ? raw : []
      gearCount = body.meta?.total ?? items.length

      const providerIds = new Set<string>()
      items.forEach((item) => {
        if (item.provider?.id) providerIds.add(item.provider.id)
        else if (item.providerId) providerIds.add(item.providerId)
        reviewCount += item._count?.reviews ?? 0
      })
      providerCount = providerIds.size
    }

    if (categoryRes.ok) {
      const body = await categoryRes.json()
      const raw = body.data ?? body
      categoryCount = Array.isArray(raw) ? raw.length : 0
    }
  } catch {
    gearCount = 0
    providerCount = 0
    categoryCount = 0
    reviewCount = 0
  }

  return { gearCount, providerCount, categoryCount, reviewCount }
}

const values = [
  {
    title: "Renting beats owning",
    description:
      "Photography and filmmaking gear is expensive and spends most of its life idle. We exist to put that equipment to work, one rental at a time.",
  },
  {
    title: "Trust is the product",
    description:
      "Every provider is verified and every rental is protected. You know who you are renting from and what you are getting before you commit.",
  },
  {
    title: "Crews over catalogs",
    description:
      "We are built for people who make things: shooters, producers, creators. Gear is just the tool, the work is yours.",
  },
  {
    title: "A marketplace that pays both ways",
    description:
      "Renters get pro-grade equipment without the price tag. Providers turn idle gear into income. One platform, both sides win.",
  },
]

const forRenters = [
  {
    icon: Camera,
    title: "Pro gear, no purchase",
    description:
      "Rent the same cameras, lenses, and lighting the pros use, for a fraction of the cost of owning.",
  },
  {
    icon: CalendarCheck,
    title: "Book in minutes",
    description:
      "Pick your dates, review the provider, and confirm your rental in a few clicks. No phone calls, no paperwork.",
  },
  {
    icon: ShieldCheck,
    title: "Protected rentals",
    description:
      "Clear condition notes, verified providers, and a structured booking flow keep every rental predictable.",
  },
]

const forProviders = [
  {
    icon: Store,
    title: "List once, earn always",
    description:
      "Your equipment works for you between shoots. List it, set your price, and let renters come to you.",
  },
  {
    icon: Users,
    title: "Reach the right crew",
    description:
      "Your listings appear in front of active creators and producers who are already searching for gear.",
  },
  {
    icon: Smartphone,
    title: "Manage from anywhere",
    description:
      "Accept bookings, check calendars, and track orders from your dashboard, on any device.",
  },
]

export default async function AboutPage() {
  const stats = await getMarketplaceStats()
  const statItems = [
    { value: stats.gearCount.toLocaleString(), label: "Gear items listed" },
    { value: stats.providerCount.toLocaleString(), label: "Active providers" },
    { value: stats.categoryCount.toLocaleString(), label: "Gear categories" },
    { value: stats.reviewCount.toLocaleString(), label: "Reviews written" },
  ]

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.06),transparent_50%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-4 pt-32 pb-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:pt-40 lg:pb-28">
          <div>
            <p className="text-sm font-semibold tracking-widest text-primary uppercase">
              About GearUp
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              The marketplace for gear that should be shared
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
              GearUp connects people who need professional photography and filmmaking
              equipment with trusted local providers who have it. We built a rental
              marketplace that treats every booking like a handshake: verified,
              protected, and easy.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button size="lg" asChild className="bg-white text-slate-900 hover:bg-white/90">
                <Link href="/gear">
                  Browse Gear
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white">
                <Link href="/auth/register">Become a Provider</Link>
              </Button>
            </div>
            <dl className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-4">
              {statItems.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</dd>
                  <dd className="mt-1 text-xs text-white/60 sm:text-sm">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <div className="absolute -inset-8 rounded-3xl bg-white/5 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10">
              <div className="border-b border-white/10 bg-white/5 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex size-2.5 rounded-full bg-emerald-400" />
                    <span className="text-sm font-medium text-white/90">Rental confirmed</span>
                  </div>
                  <span className="text-xs text-white/50">#GU-4821</span>
                </div>
              </div>
              <div className="space-y-4 px-6 py-6">
                <div className="flex items-center gap-4">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-white/10 text-white">
                    <Camera className="size-7" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Sony A7 IV + 24-70mm f/2.8 GM</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-white/60">
                      <MapPin className="size-3.5" />
                      Central Dhaka
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
                  <div>
                    <p className="text-xs text-white/50">Pickup</p>
                    <p className="mt-1 font-medium text-white">Aug 14, 9:00 AM</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50">Return</p>
                    <p className="mt-1 font-medium text-white">Aug 17, 6:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xs text-white/50">Total for 3 days</p>
                    <p className="text-lg font-bold text-white">$150.00</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-300">
                    <ShieldCheck className="size-3.5" />
                    Covered
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Why we built GearUp
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                Owning professional equipment is a barrier to making great work. GearUp
                removes that barrier by making the gear already in the market available
                to everyone who needs it, on the days they need it.
              </p>
            </div>
            <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {values.map((value, i) => (
                <div key={value.title} className="border-t pt-5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-base font-semibold">{value.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                For renters
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Rent the gear your project needs
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                Whether it is a weekend shoot or a month-long production, find the
                equipment that fits your budget and your calendar.
              </p>
              <ul className="mt-10 space-y-8">
                {forRenters.map(({ icon: Icon, title, description }) => (
                  <li key={title} className="flex gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <Button className="mt-10" asChild>
                <Link href="/gear">
                  Start browsing
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-slate-900 shadow-sm">
                For providers
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Turn idle gear into income
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                Your equipment should not sit in a case between shoots. List it, set the
                terms, and let the marketplace bring renters to you.
              </p>
              <ul className="mt-10 space-y-8">
                {forProviders.map(({ icon: Icon, title, description }) => (
                  <li key={title} className="flex gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="mt-10" asChild>
                <Link href="/auth/register">
                  Become a provider
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 rounded-2xl bg-slate-950 px-8 py-14 text-center sm:px-12 md:flex-row md:text-left">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Ready to get your next shoot off the ground?
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Join the GearUp community. Rent what you need today, or share what you
                own and start earning.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                className="bg-white text-slate-900 hover:bg-white/90"
              >
                <Link href="/auth/register">
                  Get started
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
