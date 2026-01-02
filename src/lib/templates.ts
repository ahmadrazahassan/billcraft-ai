export interface Template {
  id: string
  name: string
  description: string
  category: "minimal" | "professional" | "creative" | "modern" | "classic"
  color: string
  accentColor: string
  popular?: boolean
  new?: boolean
}

export const templates: Template[] = [
  // Minimal Category
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean lines, maximum clarity",
    category: "minimal",
    color: "#92487A",
    accentColor: "#E49BA6",
    popular: true,
  },
  {
    id: "clean-slate",
    name: "Clean Slate",
    description: "Pure simplicity, zero distractions",
    category: "minimal",
    color: "#64748B",
    accentColor: "#94A3B8",
  },
  {
    id: "nordic",
    name: "Nordic",
    description: "Scandinavian-inspired minimalism",
    category: "minimal",
    color: "#1E293B",
    accentColor: "#475569",
    new: true,
  },
  // Professional Category
  {
    id: "corporate",
    name: "Corporate",
    description: "Enterprise-grade professionalism",
    category: "professional",
    color: "#0F172A",
    accentColor: "#334155",
    popular: true,
  },
  {
    id: "executive",
    name: "Executive",
    description: "C-suite approved design",
    category: "professional",
    color: "#1E3A5F",
    accentColor: "#3B82F6",
  },
  {
    id: "consultant",
    name: "Consultant",
    description: "Perfect for advisory services",
    category: "professional",
    color: "#374151",
    accentColor: "#6B7280",
  },
  // Creative Category
  {
    id: "creative",
    name: "Creative",
    description: "Bold colors, bold statements",
    category: "creative",
    color: "#3B82F6",
    accentColor: "#60A5FA",
    popular: true,
  },
  {
    id: "studio",
    name: "Studio",
    description: "For design agencies & creatives",
    category: "creative",
    color: "#EC4899",
    accentColor: "#F472B6",
    new: true,
  },
  {
    id: "neon",
    name: "Neon",
    description: "Electric vibes, modern edge",
    category: "creative",
    color: "#8B5CF6",
    accentColor: "#A78BFA",
  },
  // Modern Category
  {
    id: "startup",
    name: "Startup",
    description: "Tech-forward, investor-ready",
    category: "modern",
    color: "#8B5CF6",
    accentColor: "#A78BFA",
    popular: true,
  },
  {
    id: "saas",
    name: "SaaS",
    description: "Subscription billing made beautiful",
    category: "modern",
    color: "#06B6D4",
    accentColor: "#22D3EE",
    new: true,
  },
  {
    id: "fintech",
    name: "Fintech",
    description: "Financial services aesthetic",
    category: "modern",
    color: "#10B981",
    accentColor: "#34D399",
  },
  // Classic Category
  {
    id: "classic",
    name: "Classic",
    description: "Timeless, trusted, traditional",
    category: "classic",
    color: "#DC2626",
    accentColor: "#EF4444",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Refined luxury aesthetic",
    category: "classic",
    color: "#059669",
    accentColor: "#10B981",
  },
  {
    id: "heritage",
    name: "Heritage",
    description: "Old-world charm, modern function",
    category: "classic",
    color: "#92400E",
    accentColor: "#B45309",
  },
]

export const categories = [
  { id: "all", name: "All Templates", count: templates.length },
  { id: "minimal", name: "Minimal", count: templates.filter(t => t.category === "minimal").length },
  { id: "professional", name: "Professional", count: templates.filter(t => t.category === "professional").length },
  { id: "creative", name: "Creative", count: templates.filter(t => t.category === "creative").length },
  { id: "modern", name: "Modern", count: templates.filter(t => t.category === "modern").length },
  { id: "classic", name: "Classic", count: templates.filter(t => t.category === "classic").length },
]
