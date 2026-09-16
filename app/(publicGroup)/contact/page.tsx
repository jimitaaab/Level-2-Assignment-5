"use client"

import { useActionState, useEffect, useRef } from "react"
import Image from "next/image"
import { ArrowUpRight, CheckCircle2, Mail, MapPin, Send } from "lucide-react"
import { FaGithub, FaLinkedinIn } from "react-icons/fa6"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export type ContactState = {
  success: boolean
  message: string
}

export async function submitContact(
  prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = (formData.get("name") as string)?.trim() ?? ""
  const email = (formData.get("email") as string)?.trim() ?? ""
  const message = (formData.get("message") as string)?.trim() ?? ""

  if (!name || !email || !message) {
    return { success: false, message: "Please fill in your name, email, and message." }
  }

  await new Promise((resolve) => setTimeout(resolve, 600))

  return {
    success: true,
    message: "Thanks for reaching out. I'll get back to you soon.",
  }
}

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/MishkatMukit",
    icon: FaGithub,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/mishkat-mahabub",
    icon: FaLinkedinIn,
  },
]

export default function ContactPage() {
  const [state, formAction, pending] = useActionState(submitContact, {
    success: false,
    message: "",
  })
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!state.message) return

    if (state.success) {
      toast.success(state.message)
      queueMicrotask(() => formRef.current?.reset())
    } else {
      toast.error(state.message)
    }
  }, [state])

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.06),transparent_50%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-4 pt-32 pb-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:pt-40 lg:pb-28">
          <div>
            <p className="text-sm font-semibold tracking-widest text-primary uppercase">
              Contact
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Let&apos;s talk about your next shoot
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
              Questions about renting, listing gear, or partnering with GearUp? Send a
              message and I&apos;ll get back to you.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-white/10 blur-2xl" />
              <div className="relative size-44 overflow-hidden rounded-full border-4 border-white/20 sm:size-52">
                <Image
                  src="/developer.png"
                  alt="Mishkat Mahabub, developer of GearUp"
                  fill
                  priority
                  sizes="(max-width: 640px) 176px, 208px"
                  className="object-cover"
                />
              </div>
            </div>
            <p className="mt-6 text-lg font-bold text-white">Mishkat Mahabub</p>
            <p className="text-sm text-white/70">Full-stack developer</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Get in touch</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                I&apos;m the developer behind GearUp. Whether you found a bug, have a feature
                idea, or want to collaborate, my inbox is open.
              </p>

              <dl className="mt-10 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <dt className="text-sm font-semibold">Email</dt>
                    <dd className="mt-1 text-sm text-muted-foreground">
                      <a
                        href="mailto:mishkatmahabub2002@gmail.com"
                        className="hover:text-foreground hover:underline"
                      >
                        mishkatmahabub2002@gmail.com
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <dt className="text-sm font-semibold">Location</dt>
                    <dd className="mt-1 text-sm text-muted-foreground">Chattogram, Bangladesh</dd>
                  </div>
                </div>
              </dl>

              <div className="mt-10">
                <p className="text-sm font-semibold">Find me online</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {socials.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex h-11 items-center gap-2 rounded-lg border bg-card px-4 text-sm font-medium shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
                    >
                      <Icon className="size-4" />
                      {label}
                      <ArrowUpRight className="size-3.5 opacity-50 transition-opacity group-hover:opacity-100" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
              <form ref={formRef} action={formAction} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      minLength={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell me what you need"
                    required
                    rows={6}
                    className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                {state.success && (
                  <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
                    <CheckCircle2 className="size-4" />
                    {state.message}
                  </div>
                )}
                <Button type="submit" size="lg" className="w-full" disabled={pending}>
                  {pending ? "Sending..." : "Send message"}
                  <Send data-icon="inline-end" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
