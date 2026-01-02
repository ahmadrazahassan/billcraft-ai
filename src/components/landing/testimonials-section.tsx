"use client"

import Image from "next/image"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { Star } from "lucide-react"

const testimonials = [
  {
    quote: "Billcraft cut our invoicing time by 80%. The AI understands exactly what we need.",
    name: "Sarah Chen",
    role: "CEO",
    company: "Design Studio Co",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    quote: "Finally, invoicing software that doesn't feel like it's from 2005. Beautiful and fast.",
    name: "Marcus Johnson",
    role: "Freelancer",
    company: "Independent",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    quote: "Our clients love the professional invoices. Payment times dropped by 40%.",
    name: "Emily Rodriguez",
    role: "Founder",
    company: "Tech Solutions",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  {
    quote: "The best investment we made this year. ROI was visible within the first month.",
    name: "David Kim",
    role: "CFO",
    company: "Creative Agency",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    quote: "Switched from QuickBooks. Never looking back. Billcraft is leagues ahead.",
    name: "Lisa Thompson",
    role: "Accountant",
    company: "Thompson & Co",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
  },
  {
    quote: "The AI feature alone saves me 5 hours every week. Absolutely game-changing.",
    name: "James Wilson",
    role: "Director",
    company: "Wilson Creative",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
  {
    quote: "Clean, intuitive, powerful. Everything an invoicing tool should be.",
    name: "Anna Martinez",
    role: "Owner",
    company: "Martinez Design",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
  },
  {
    quote: "We process 500+ invoices monthly. Billcraft handles it effortlessly.",
    name: "Robert Chen",
    role: "Operations",
    company: "Scale Inc",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
  },
]

const firstRow = testimonials.slice(0, 4)
const secondRow = testimonials.slice(4)

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <ScrollReveal>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-sm font-medium text-primary">Testimonials</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
              Loved by businesses
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto">
              Join thousands of companies using Billcraft to streamline their invoicing
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Marquee Row 1 */}
      <div className="relative mb-6">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <div className="flex gap-6 animate-marquee">
          {[...firstRow, ...firstRow, ...firstRow].map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>

      {/* Marquee Row 2 - Reverse direction */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <div className="flex gap-6 animate-marquee-reverse">
          {[...secondRow, ...secondRow, ...secondRow].map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <ScrollReveal delay={200}>
          <div className="grid grid-cols-3 gap-8">
            {[
              { value: "10,000+", label: "Happy customers" },
              { value: "4.9/5", label: "Average rating" },
              { value: "$50M+", label: "Invoiced" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="flex-shrink-0 w-[350px] p-6 rounded-2xl bg-card hover:shadow-xl transition-shadow duration-300">
      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
        ))}
      </div>
      
      {/* Quote */}
      <p className="text-sm leading-relaxed mb-6">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      
      {/* Author */}
      <div className="flex items-center gap-3">
        <Image
          src={testimonial.avatar}
          alt={testimonial.name}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-sm">{testimonial.name}</p>
          <p className="text-xs text-muted">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  )
}
