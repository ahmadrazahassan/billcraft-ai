"use client"

import { Template } from "@/lib/templates"

interface TemplateThumbnailProps {
  template: Template
  className?: string
}

export function TemplateThumbnail({ template, className }: TemplateThumbnailProps) {
  const { id, color } = template
  
  // Render different thumbnail based on template category/id
  switch (id) {
    case "minimal":
    case "clean-slate":
    case "nordic":
      return <MinimalThumbnail color={color} className={className} />
    case "corporate":
    case "executive":
    case "consultant":
      return <CorporateThumbnail color={color} className={className} />
    case "creative":
    case "studio":
    case "neon":
      return <CreativeThumbnail color={color} className={className} />
    case "startup":
    case "saas":
    case "fintech":
      return <ModernThumbnail color={color} className={className} />
    case "classic":
    case "elegant":
    case "heritage":
      return <ClassicThumbnail color={color} className={className} />
    default:
      return <MinimalThumbnail color={color} className={className} />
  }
}

function MinimalThumbnail({ color, className }: { color: string; className?: string }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`} style={{ aspectRatio: '8.5/11' }}>
      <div className="p-4 h-full flex flex-col text-[6px]">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="w-5 h-5 rounded mb-1.5" style={{ backgroundColor: color }} />
            <div className="h-1.5 w-12 bg-gray-800 rounded mb-0.5" />
            <div className="h-1 w-10 bg-gray-300 rounded" />
          </div>
          <div className="text-right">
            <div className="text-gray-800 font-light text-[10px] mb-0.5">Invoice</div>
            <div className="h-1 w-8 bg-gray-300 rounded ml-auto" />
          </div>
        </div>
        
        {/* Bill To */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="h-1 w-6 bg-gray-300 rounded mb-1" />
            <div className="h-1.5 w-14 bg-gray-700 rounded mb-0.5" />
            <div className="h-1 w-12 bg-gray-300 rounded" />
          </div>
          <div className="text-right">
            <div className="h-1 w-6 bg-gray-300 rounded mb-1 ml-auto" />
            <div className="h-1 w-14 bg-gray-500 rounded ml-auto mb-0.5" />
            <div className="h-1 w-12 bg-gray-500 rounded ml-auto" />
          </div>
        </div>
        
        {/* Line Items */}
        <div className="flex-1 space-y-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between py-1.5 border-b border-dashed border-gray-200">
              <div className="h-1 bg-gray-600 rounded" style={{ width: `${40 + i * 10}%` }} />
              <div className="h-1 w-6 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
        
        {/* Total */}
        <div className="flex justify-end mt-auto pt-2">
          <div className="text-right">
            <div className="h-1 w-6 bg-gray-300 rounded mb-1 ml-auto" />
            <div className="h-2.5 w-12 rounded font-semibold" style={{ backgroundColor: color, opacity: 0.2 }} />
            <div className="h-2 w-10 rounded mt-0.5" style={{ backgroundColor: color }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function CorporateThumbnail({ color, className }: { color: string; className?: string }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`} style={{ aspectRatio: '8.5/11' }}>
      <div className="p-4 h-full flex flex-col text-[6px]">
        {/* Header with border */}
        <div className="flex justify-between items-center pb-2 mb-3" style={{ borderBottom: `2px solid ${color}` }}>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded flex items-center justify-center text-white text-[8px] font-bold" style={{ backgroundColor: color }}>C</div>
            <div>
              <div className="h-1.5 w-14 bg-gray-800 rounded mb-0.5" />
              <div className="h-1 w-10 bg-gray-300 rounded" />
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-[8px]" style={{ color }}>INVOICE</div>
            <div className="h-1 w-10 bg-gray-300 rounded ml-auto" />
          </div>
        </div>
        
        {/* Info boxes */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="p-1.5 bg-gray-50 rounded">
            <div className="h-1 w-6 bg-gray-400 rounded mb-1" />
            <div className="h-1.5 w-12 bg-gray-700 rounded mb-0.5" />
            <div className="h-1 w-10 bg-gray-400 rounded" />
          </div>
          <div className="text-right space-y-0.5">
            <div className="h-1 w-full bg-gray-200 rounded" />
            <div className="h-1 w-full bg-gray-200 rounded" />
          </div>
        </div>
        
        {/* Table */}
        <div className="flex-1">
          <div className="rounded overflow-hidden">
            <div className="flex text-white text-[5px] p-1" style={{ backgroundColor: color }}>
              <div className="flex-1">Description</div>
              <div className="w-6 text-right">Qty</div>
              <div className="w-8 text-right">Rate</div>
              <div className="w-8 text-right">Amount</div>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex p-1 border-b border-gray-100 text-[5px]">
                <div className="flex-1 h-1 bg-gray-500 rounded" style={{ width: '60%' }} />
                <div className="w-6 h-1 bg-gray-400 rounded ml-auto" />
                <div className="w-8 h-1 bg-gray-400 rounded ml-1" />
                <div className="w-8 h-1 bg-gray-600 rounded ml-1" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Totals */}
        <div className="flex justify-end mt-2">
          <div className="w-20 space-y-1">
            <div className="flex justify-between">
              <div className="h-1 w-8 bg-gray-400 rounded" />
              <div className="h-1 w-6 bg-gray-600 rounded" />
            </div>
            <div className="flex justify-between pt-1" style={{ borderTop: `1.5px solid ${color}` }}>
              <div className="h-1.5 w-8 bg-gray-700 rounded" />
              <div className="h-1.5 w-8 rounded" style={{ backgroundColor: color }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CreativeThumbnail({ color, className }: { color: string; className?: string }) {
  return (
    <div className={`rounded-lg shadow-sm overflow-hidden ${className}`} style={{ aspectRatio: '8.5/11' }}>
      <div className="h-full flex">
        {/* Left colored panel */}
        <div className="w-1/3 p-3 text-white flex flex-col justify-between" style={{ backgroundColor: color }}>
          <div>
            <div className="text-[8px] font-bold mb-0.5">INVOICE</div>
            <div className="h-1 w-8 bg-white/40 rounded" />
          </div>
          <div>
            <div className="h-1 w-6 bg-white/40 rounded mb-1" />
            <div className="h-1.5 w-12 bg-white rounded mb-0.5" />
            <div className="h-1 w-10 bg-white/60 rounded" />
          </div>
          <div>
            <div className="h-1 w-6 bg-white/40 rounded mb-1" />
            <div className="h-1.5 w-10 bg-white rounded" />
          </div>
        </div>
        
        {/* Right content panel */}
        <div className="flex-1 bg-white p-3 flex flex-col">
          <div className="mb-3">
            <div className="h-1 w-6 bg-gray-300 rounded mb-1" />
            <div className="h-1.5 w-16 bg-gray-800 rounded mb-0.5" />
            <div className="h-1 w-12 bg-gray-400 rounded" />
          </div>
          
          <div className="flex-1 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between py-1.5 border-b border-gray-100">
                <div className="h-1.5 bg-gray-700 rounded" style={{ width: `${50 + i * 8}%` }} />
                <div className="h-1.5 w-8 bg-gray-800 rounded" />
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-auto pt-2">
            <div className="text-right">
              <div className="h-1 w-10 bg-gray-300 rounded mb-1 ml-auto" />
              <div className="h-3 w-14 rounded" style={{ backgroundColor: color }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ModernThumbnail({ color, className }: { color: string; className?: string }) {
  return (
    <div className={`bg-[#0F0F10] rounded-lg shadow-sm overflow-hidden ${className}`} style={{ aspectRatio: '8.5/11' }}>
      <div className="p-4 h-full flex flex-col text-[6px] text-white">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-md flex items-center justify-center text-[7px] font-bold" style={{ backgroundColor: color }}>S</div>
            <div className="h-1.5 w-12 bg-white rounded" />
          </div>
          <div className="text-right">
            <div className="h-1 w-6 bg-gray-600 rounded mb-0.5" />
            <div className="h-1 w-10 bg-gray-400 rounded font-mono" />
          </div>
        </div>
        
        {/* Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="h-1 w-4 bg-gray-600 rounded mb-1" />
            <div className="h-1.5 w-14 bg-white rounded mb-0.5" />
            <div className="h-1 w-10 bg-gray-500 rounded" />
          </div>
          <div className="text-right">
            <div className="h-1 w-6 bg-gray-600 rounded mb-1 ml-auto" />
            <div className="h-1.5 w-10 bg-white rounded ml-auto" />
          </div>
        </div>
        
        {/* Items */}
        <div className="flex-1 space-y-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center p-2 rounded-md bg-white/5">
              <div>
                <div className="h-1.5 bg-white rounded mb-0.5" style={{ width: `${40 + i * 12}px` }} />
                <div className="h-1 w-8 bg-gray-600 rounded" />
              </div>
              <div className="h-1.5 w-8 bg-white rounded font-mono" />
            </div>
          ))}
        </div>
        
        {/* Total */}
        <div className="mt-3 p-2 rounded-md flex justify-between items-center" style={{ backgroundColor: `${color}30`, border: `1px solid ${color}50` }}>
          <div className="h-1 w-6 bg-gray-500 rounded" />
          <div className="h-2 w-12 rounded" style={{ backgroundColor: color }} />
        </div>
      </div>
    </div>
  )
}

function ClassicThumbnail({ color, className }: { color: string; className?: string }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`} style={{ aspectRatio: '8.5/11' }}>
      <div className="p-4 h-full flex flex-col text-[6px]">
        {/* Header with double border */}
        <div className="flex justify-between items-start pb-2 mb-3" style={{ borderBottom: `3px double ${color}` }}>
          <div>
            <div className="font-bold text-[10px]" style={{ color }}>INVOICE</div>
            <div className="h-1 w-16 bg-gray-400 rounded mt-0.5" />
          </div>
          <div className="text-right">
            <div className="h-1.5 w-16 bg-gray-800 rounded mb-0.5" />
            <div className="h-1 w-14 bg-gray-400 rounded" />
          </div>
        </div>
        
        {/* From/To */}
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <div className="font-bold text-[6px] mb-1" style={{ color }}>FROM:</div>
            <div className="h-1.5 w-14 bg-gray-700 rounded mb-0.5" />
            <div className="h-1 w-12 bg-gray-400 rounded mb-0.5" />
            <div className="h-1 w-10 bg-gray-400 rounded" />
          </div>
          <div>
            <div className="font-bold text-[6px] mb-1" style={{ color }}>TO:</div>
            <div className="h-1.5 w-14 bg-gray-700 rounded mb-0.5" />
            <div className="h-1 w-12 bg-gray-400 rounded mb-0.5" />
            <div className="h-1 w-10 bg-gray-400 rounded" />
          </div>
        </div>
        
        {/* Table */}
        <div className="flex-1">
          <div className="border-y-2 py-1 mb-1" style={{ borderColor: color }}>
            <div className="flex text-[5px] font-bold">
              <div className="flex-1">Description</div>
              <div className="w-6 text-right">Hrs</div>
              <div className="w-8 text-right">Rate</div>
              <div className="w-8 text-right">Amount</div>
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex py-1 border-b border-gray-200 text-[5px]">
              <div className="flex-1 h-1 bg-gray-600 rounded" style={{ width: '50%' }} />
              <div className="w-6 h-1 bg-gray-500 rounded ml-auto" />
              <div className="w-8 h-1 bg-gray-500 rounded ml-1" />
              <div className="w-8 h-1 bg-gray-700 rounded ml-1" />
            </div>
          ))}
        </div>
        
        {/* Totals */}
        <div className="flex justify-end mt-2">
          <div className="w-20 space-y-0.5">
            <div className="flex justify-between">
              <div className="h-1 w-10 bg-gray-500 rounded" />
              <div className="h-1 w-6 bg-gray-600 rounded" />
            </div>
            <div className="flex justify-between">
              <div className="h-1 w-8 bg-gray-500 rounded" />
              <div className="h-1 w-5 bg-gray-600 rounded" />
            </div>
            <div className="flex justify-between pt-1 font-bold" style={{ borderTop: `2px solid ${color}` }}>
              <div className="h-1.5 w-10 bg-gray-800 rounded" />
              <div className="h-1.5 w-8 rounded" style={{ backgroundColor: color }} />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-2 pt-2 border-t border-gray-200 text-center">
          <div className="h-1 w-24 bg-gray-300 rounded mx-auto" />
        </div>
      </div>
    </div>
  )
}
