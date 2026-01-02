"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowUpRight, Shield, Clock, CreditCard } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

const trustBadges = [
  { icon: CreditCard, label: "No credit card required" },
  { icon: Clock, label: "14-day free trial" },
  { icon: Shield, label: "Cancel anytime" },
]

const avatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
]

export function CTASection() {
  const [email, setEmail] = React.useState("")

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-primary rounded-[2.5rem]" />
            <div className="absolute inset-0 dot-pattern opacity-10 rounded-[2.5rem]" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-light/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary-dark/30 rounded-full blur-3xl" />
            
            {/* Content */}
            <div className="relative px-6 sm:px-12 py-16 sm:py-20 text-center text-white">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 tracking-tight">
                Ready to get started?
              </h2>
              <p className="text-white/70 text-lg max-w-xl mx-auto mb-10">
                Join thousands of businesses saving hours every week with Billcraft
              </p>

              {/* Email Form */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-10">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/10 text-white placeholder:text-white/50 focus:ring-white/10 rounded-xl"
                />
                <Button variant="glass" className="bg-white text-primary hover:bg-white/90 gap-2 shadow-lg rounded-xl">
                  Get Started
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <div className="flex -space-x-2">
                  {avatars.map((avatar, i) => (
                    <Image
                      key={i}
                      src={avatar}
                      alt="Customer"
                      width={32}
                      height={32}
                      className="rounded-full ring-2 ring-primary object-cover"
                    />
                  ))}
                </div>
                <p className="text-sm text-white/70">
                  <span className="font-semibold text-white">2,847</span> people signed up this week
                </p>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
                {trustBadges.map((badge) => (
                  <div key={badge.label} className="flex items-center gap-2">
                    <badge.icon className="h-4 w-4" />
                    <span>{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
