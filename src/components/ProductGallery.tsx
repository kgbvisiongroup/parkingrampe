'use client'

import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useState } from 'react'

export function ProductGallery({ images }: { images: { src: string; thumb: string; alt: string }[] }) {
  const [i, setI] = useState(0)
  if (!images.length) return <div className="aspect-square bg-band" />
  const cur = images[i]
  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden bg-[#ececec]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <Image src={cur.src} alt={cur.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain p-6 mix-blend-multiply sm:p-10" />
          </motion.div>
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <ul className="mt-2.5 grid grid-cols-5 gap-2.5">
          {images.map((img, n) => (
            <li key={img.src}>
              <button
                type="button"
                onClick={() => setI(n)}
                aria-label={img.alt}
                aria-current={n === i}
                className={`relative block aspect-square w-full overflow-hidden bg-[#ececec] outline-offset-0 ${n === i ? 'outline outline-2 outline-dark' : 'opacity-70 hover:opacity-100'}`}
              >
                <Image src={img.thumb} alt="" fill sizes="120px" className="object-contain p-1.5 mix-blend-multiply" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
