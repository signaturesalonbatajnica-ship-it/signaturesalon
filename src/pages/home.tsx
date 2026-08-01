import { useEffect, useRef, type FormEvent } from 'react';
import { animate, inView } from 'motion';

// TODO: Fix layout crap
// Layout was forced before the page was fully loaded. If stylesheets are not yet loaded this may cause a flash of unstyled content.
//

export function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const sigPathRef = useRef<SVGPathElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) return;

    if (sigPathRef.current) {
      animate(
        sigPathRef.current,
        { strokeDashoffset: [1400, 0] },
        { duration: 2.2, delay: 0.3, ease: [0.65, 0, 0.35, 1] },
      );
    }

    if (!rootRef.current) return;

    const targets = rootRef.current.querySelectorAll('.reveal');
    if (targets.length === 0) return;

    let isActive = true;

    const stop = inView(
      targets,
      (element) => {
        if (!isActive) return;
        animate(
          element,
          { opacity: [0, 1], y: [24, 0] },
          { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        );
      },
      { margin: '0px 0px -10% 0px' },
    );

    return () => {
      isActive = false;
      stop();
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const note = noteRef.current;
    if (note) {
      note.textContent = "Thanks — we'll confirm by phone shortly.";
      animate(note, { opacity: [0, 1] }, { duration: 0.4 });
    }
    e.currentTarget.reset();
  };

  return (
    <div ref={rootRef} className="font-body text-ink antialiased">
      {/* ===== NAV ===== */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-sm bg-paper/80 border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <a href="#top" className="font-display text-lg tracking-tight">
            Signature <span className="text-gold">Salon</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide text-ink/70">
            <a href="#services" className="hover:text-ink transition-colors">
              Services
            </a>
            <a href="#work" className="hover:text-ink transition-colors">
              Work
            </a>
            <a href="#stylists" className="hover:text-ink transition-colors">
              Stylists
            </a>
            <a href="/about" className="hover:text-ink transition-colors">
              About
            </a>
            <a href="#visit" className="hover:text-ink transition-colors">
              Visit
            </a>
          </nav>
          <a
            href="#book"
            className="text-sm px-4 py-2 rounded-full bg-ink text-paper hover:bg-wine transition-colors"
          >
            Book a chair
          </a>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section
        id="top"
        className="relative overflow-hidden bg-ink text-paper grain"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 pt-40 pb-28 md:pt-52 md:pb-36 relative">
          <p className="text-gold/90 text-xs md:text-sm tracking-[0.3em] uppercase mb-6">
            Batajnica, Belgrade — by appointment
          </p>

          <h1 className="font-display font-light text-[13vw] md:text-[6.5vw] leading-[0.95] max-w-4xl">
            A cut that carries
            <br className="hidden md:block" />
            your{' '}
            <em className="italic text-gold not-italic-fallback">signature</em>.
          </h1>

          <div className="mt-10 flex items-center gap-6">
            <svg
              id="sig-svg"
              viewBox="0 0 420 90"
              className="w-56 md:w-72 h-auto"
              fill="none"
              aria-hidden="true"
            >
              <path
                ref={sigPathRef}
                className="signature-path"
                d="M10 60 C 40 10, 70 10, 85 55 C 95 80, 60 85, 55 60 C 50 30, 90 20, 120 45 C 140 62, 150 30, 175 30 C 210 30, 190 70, 220 65 C 250 60, 240 20, 270 25 C 300 30, 285 65, 310 60 C 335 55, 330 20, 355 30 C 375 38, 370 55, 400 45"
                stroke="#B08A3E"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-paper/60 text-sm max-w-[14rem]">
              Every appointment ends the same way — with a finish that&rsquo;s
              unmistakably yours.
            </p>
          </div>

          <div className="mt-14 flex flex-wrap gap-4">
            <a
              href="#book"
              className="px-6 py-3 rounded-full bg-gold text-ink text-sm font-medium hover:bg-paper transition-colors"
            >
              Book a chair
            </a>
            <a
              href="#services"
              className="px-6 py-3 rounded-full border border-paper/30 text-sm hover:border-gold hover:text-gold transition-colors"
            >
              See services
            </a>
          </div>
        </div>
        <div className="hairline absolute bottom-0 inset-x-0" />
      </section>

      {/* ===== SERVICES ===== */}
      <section
        id="services"
        className="max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-32"
      >
        <div className="reveal flex items-end justify-between mb-14 flex-wrap gap-4">
          <h2 className="font-display text-4xl md:text-5xl font-light">
            Services
          </h2>
          <p className="text-taupe text-sm max-w-xs">
            Priced per consultation — every head of hair is a different brief.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-16">
          {SERVICES.map((service) => (
            <div
              key={service.name}
              className={`reveal border-t border-ink/15 py-6 flex justify-between items-baseline ${service.wide ? 'border-b md:col-span-2' : ''}`}
            >
              <div>
                <h3 className="font-display text-xl">{service.name}</h3>
                <p className="text-taupe text-sm mt-1">{service.detail}</p>
              </div>
              <span className="text-gold text-sm whitespace-nowrap ml-6">
                {service.price}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== WORK / GALLERY ===== */}
      <section id="work" className="bg-wine text-paper py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <h2 className="reveal font-display text-4xl md:text-5xl font-light mb-3">
            Recent work
          </h2>
          <p className="reveal text-paper/60 text-sm mb-14 max-w-md">
            A handful of finishes from the chair this season.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {WORK.map((item) => (
              <div
                key={item.label}
                className={`reveal aspect-[3/4] rounded-lg bg-gradient-to-br ${item.gradient} flex items-end p-4 ${item.offset ? 'mt-6 md:mt-10' : ''}`}
              >
                <span
                  className={`font-script text-2xl ${item.ink === 'gold' ? 'text-gold/90' : 'text-paper/90'}`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STYLISTS ===== */}
      <section
        id="stylists"
        className="max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-32"
      >
        <h2 className="reveal font-display text-4xl md:text-5xl font-light mb-14">
          Behind the chair
        </h2>
        <div className="grid sm:grid-cols-3 gap-10">
          {STYLISTS.map((stylist) => (
            <div key={stylist.name} className="reveal">
              <div className="aspect-square rounded-full bg-ink/8 mb-5 flex items-center justify-center">
                <span className="font-script text-3xl text-gold">
                  {stylist.name.charAt(0)}
                </span>
              </div>
              <h3 className="font-display text-lg">{stylist.name}</h3>
              <p className="text-taupe text-sm">{stylist.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== BOOK / CTA ===== */}
      <section
        id="book"
        className="bg-ink text-paper relative overflow-hidden grain"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-2 gap-14 items-center relative">
          <div className="reveal">
            <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-6">
              Reserve your <span className="text-gold">chair</span>.
            </h2>
            <p className="text-paper/60 text-sm max-w-sm mb-8">
              Tell us what you&rsquo;re after and when suits you — we&rsquo;ll
              confirm within the day.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:+381600000000"
                className="px-6 py-3 rounded-full bg-gold text-ink text-sm font-medium hover:bg-paper transition-colors"
              >
                Call +381 60 000 000
              </a>
              <a
                href="https://instagram.com"
                className="px-6 py-3 rounded-full border border-paper/30 text-sm hover:border-gold hover:text-gold transition-colors"
              >
                @signaturesalon.batajnica
              </a>
            </div>
          </div>

          <form
            id="book-form"
            onSubmit={handleSubmit}
            className="reveal space-y-4"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-xs tracking-wide uppercase text-paper/50 mb-2"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full bg-transparent border-b border-paper/25 py-2 focus:border-gold outline-none transition-colors placeholder:text-paper/30"
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="service"
                className="block text-xs tracking-wide uppercase text-paper/50 mb-2"
              >
                Service
              </label>
              <select
                id="service"
                name="service"
                defaultValue="Cut & Finish"
                className="w-full bg-transparent border-b border-paper/25 py-2 focus:border-gold outline-none transition-colors text-paper [&>option]:text-ink"
              >
                {SERVICES.map((service) => (
                  <option key={service.name}>{service.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="date"
                className="block text-xs tracking-wide uppercase text-paper/50 mb-2"
              >
                Preferred date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                className="w-full bg-transparent border-b border-paper/25 py-2 focus:border-gold outline-none transition-colors text-paper"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-4 px-6 py-3 rounded-full bg-gold text-ink text-sm font-medium hover:bg-paper transition-colors"
            >
              Request booking
            </button>
            <p
              ref={noteRef}
              className="text-xs text-paper/40 pt-1"
              aria-live="polite"
            />
          </form>
        </div>
      </section>

      {/* ===== VISIT / FOOTER ===== */}
      <footer
        id="visit"
        className="max-w-6xl mx-auto px-6 md:px-10 py-16 grid sm:grid-cols-3 gap-10 text-sm"
      >
        <div>
          <h3 className="font-display text-lg mb-3">Signature Salon</h3>
          <p className="text-taupe">
            Cara Dušana 214
            <br />
            Batajnica, Belgrade
          </p>
        </div>
        <div>
          <h3 className="font-display text-lg mb-3">Hours</h3>
          <p className="text-taupe">
            Tue–Sat, 09:00–20:00
            <br />
            Closed Sun–Mon
          </p>
        </div>
        <div>
          <h3 className="font-display text-lg mb-3">Contact</h3>
          <p className="text-taupe">
            +381 60 000 000
            <br />
            hello@signaturesalon.rs
          </p>
        </div>
      </footer>
      <div className="hairline max-w-6xl mx-auto" />
      <p className="text-center text-xs text-taupe py-6">
        © 2026 Signature Salon. All rights reserved.
      </p>
    </div>
  );
}

const SERVICES = [
  {
    name: 'Cut & Finish',
    detail: 'Consultation, wash, precision cut, blow-dry styling.',
    price: 'from 2.500 din',
  },
  {
    name: 'Color & Balayage',
    detail: 'Full color, root touch-up, or hand-painted balayage.',
    price: 'from 5.000 din',
  },
  {
    name: 'Keratin Treatment',
    detail: 'Smoothing treatment for frizz-free, glass-finish hair.',
    price: 'from 8.000 din',
  },
  {
    name: 'Bridal & Occasion',
    detail: 'Trial included. Styling that holds through the whole night.',
    price: 'from 6.500 din',
  },
  {
    name: "Men's Grooming",
    detail: 'Cut, beard shape, and hot towel finish.',
    price: 'from 1.800 din',
    wide: true,
  },
] as const satisfies ReadonlyArray<{
  name: string;
  detail: string;
  price: string;
  wide?: boolean;
}>;

const WORK = [
  {
    label: 'balayage',
    gradient: 'from-[#7a3346] to-[#3d0f1b]',
    ink: 'gold',
  },
  {
    label: 'bridal updo',
    gradient: 'from-[#8a5a2c] to-[#3d2410]',
    ink: 'paper',
    offset: true,
  },
  {
    label: 'textured crop',
    gradient: 'from-[#4d2e35] to-[#1e1013]',
    ink: 'gold',
  },
  {
    label: 'copper gloss',
    gradient: 'from-[#6d4a2e] to-[#2b1c10]',
    ink: 'paper',
    offset: true,
  },
] as const satisfies ReadonlyArray<{
  label: string;
  gradient: string;
  ink: 'gold' | 'paper';
  offset?: boolean;
}>;

const STYLISTS = [
  {
    name: 'Milica',
    role: 'Color & balayage specialist, 11 years behind the chair.',
  },
  {
    name: 'Dušan',
    role: "Precision cuts and men's grooming, trained in Milan.",
  },
  { name: 'Ana', role: 'Bridal styling and keratin treatments.' },
] as const;
