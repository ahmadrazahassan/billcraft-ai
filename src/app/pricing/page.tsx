import { Navigation } from "@/components/landing/navigation"
import { PricingSection } from "@/components/landing/pricing-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function PricingPage() {
  return (
    <main>
      <Navigation />
      <div className="pt-24">
        <PricingSection />
        <CTASection />
      </div>
      <Footer />
    </main>
  )
}
