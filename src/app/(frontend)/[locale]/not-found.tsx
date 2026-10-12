import Link from 'next/link'

// Shown inside the language layout. The locale is not available here, so both languages are shown.
export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-asphalt pt-24 text-white">
      <div className="container-x">
        <div className="barrier-stripe h-3 w-48 -rotate-12 rounded-full" aria-hidden />
        <h1 className="mt-10 text-[clamp(2.2rem,5vw,4rem)] font-semibold">Stranica nije pronađena</h1>
        <p className="mt-4 max-w-xl text-lg text-white/70">
          Adresa je možda promenjena. Krenite od početne strane ili nas kontaktirajte.
          <span className="mt-2 block text-white/50">Page not found. The address may have changed.</span>
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/sr" className="btn btn-primary">
            Nazad na početnu
          </Link>
          <Link href="/en" className="btn btn-ghost">
            English home
          </Link>
        </div>
      </div>
    </section>
  )
}
