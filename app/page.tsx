import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/landing/hero"
import { LogoBand } from "@/components/landing/logo-band"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Metrics } from "@/components/landing/metrics"
import { Faq } from "@/components/landing/faq"
import { Cta } from "@/components/landing/cta"

export default function HomePage() {
  return (
    <div className="relative z-10">
      <SiteHeader />
      <main>
        <Hero />
        <LogoBand />
        <Features />
        <HowItWorks />
        <Metrics />
        <Faq />
        <Cta />
      </main>
      <SiteFooter />
    </div>
  )
}
