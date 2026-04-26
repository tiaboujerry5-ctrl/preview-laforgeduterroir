import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion"
import { cn } from "./lib/utils"
import { ArrowRight, Phone, Mail, MapPin, ChevronDown, Menu, X, Star, Check } from "lucide-react"
import * as Tabs from "@radix-ui/react-tabs"
import * as Accordion from "@radix-ui/react-accordion"

// ─── Utility Components ───────────────────────────────────────────────────────

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Button({ children, className, variant = "default", size = "default", onClick, type = "button" }) {
  const base =
    "inline-flex items-center justify-center rounded-full font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    default: "bg-[#b5451b] text-[#faf6f0] hover:bg-[#8f3515]",
    outline: "border-2 border-[#b5451b] text-[#b5451b] bg-transparent hover:bg-[#b5451b]/10",
    ghost: "border border-[#d4c4a8] text-[#2c1a0e] bg-transparent hover:bg-[#f5f0e8]",
    dark: "bg-[#2c1a0e] text-[#faf6f0] hover:bg-[#3d2510]",
  }
  const sizes = {
    sm: "h-9 px-4 text-sm",
    default: "h-11 px-6 text-base",
    lg: "h-13 px-8 text-lg",
  }
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </motion.button>
  )
}

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <motion.div
      className={cn(
        "fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-2xl px-5 py-4 shadow-2xl",
        type === "success" ? "bg-[#2c1a0e] text-[#faf6f0]" : "bg-red-600 text-white"
      )}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
    >
      <Check className="h-4 w-4 shrink-0" />
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

const navLinks = [
  { label: "Accueil", href: "#accueil" },
  { label: "À propos", href: "#apropos" },
  { label: "Services", href: "#services" },
  { label: "Menu", href: "#menu" },
  { label: "Nous joindre", href: "#contact" },
]

const menuDropdown = [
  { label: "Menu Midi", href: "#menu" },
  { label: "Menu Soir", href: "#menu" },
  { label: "Menu Créations", href: "#menu" },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-[#2c1a0e]/95 backdrop-blur-xl border-b border-[#faf6f0]/10"
            : "bg-[#2c1a0e]"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          {/* Logo */}
          <a href="#accueil" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b5451b]">
              <span className="text-sm font-bold text-[#faf6f0]">FT</span>
            </div>
            <span className="font-serif text-xl font-bold text-[#faf6f0] tracking-wide">
              La Forge du Terroir
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) =>
              link.label === "Menu" ? (
                <div key={link.label} className="relative" onMouseEnter={() => setDropOpen(true)} onMouseLeave={() => setDropOpen(false)}>
                  <button className="flex items-center gap-1 text-sm font-medium text-[#faf6f0]/80 hover:text-[#faf6f0] transition-colors">
                    Menu <ChevronDown className="h-4 w-4" />
                  </button>
                  <AnimatePresence>
                    {dropOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-0 mt-2 w-44 rounded-xl border border-[#faf6f0]/10 bg-[#2c1a0e] shadow-xl overflow-hidden"
                      >
                        {menuDropdown.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            className="block px-4 py-2.5 text-sm text-[#faf6f0]/80 hover:bg-[#b5451b]/20 hover:text-[#faf6f0] transition-colors"
                          >
                            {item.label}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-[#faf6f0]/80 hover:text-[#faf6f0] transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
            <Button size="sm" className="ml-2">
              Réserver une table
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex items-center justify-center min-w-[44px] min-h-[44px] text-[#faf6f0]"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-[#2c1a0e]/95 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute right-5 top-5 flex items-center justify-center min-w-[44px] min-h-[44px] text-[#faf6f0]"
              >
                <X className="h-6 w-6" />
              </button>
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="text-3xl font-bold text-[#faf6f0] hover:text-[#b5451b] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.08 }}
              >
                <Button size="lg" onClick={() => setMenuOpen(false)}>
                  Réserver une table
                </Button>
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, -120])

  return (
    <section id="accueil" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80"
          alt="Restaurant ambiance"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2c1a0e]/70 via-[#2c1a0e]/50 to-[#2c1a0e]/80" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#b5451b]"
        >
          Restaurant · Boucherie · Traiteur · Boutique
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 font-serif text-4xl font-bold leading-tight text-[#faf6f0] sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Saveurs locales,
          <br />
          <span className="text-[#b5451b]">façonnées chaque jour</span>
          <br />
          à La Tuque
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-10 text-lg text-[#faf6f0]/80 md:text-xl"
        >
          Une expérience culinaire authentique au cœur de la Mauricie — depuis 2014
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" className="gap-2">
            Réserver une table <ArrowRight className="h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="border-[#faf6f0]/50 text-[#faf6f0] hover:bg-[#faf6f0]/10">
            Découvrir nos menus
          </Button>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-6 w-6 text-[#faf6f0]/50" />
      </motion.div>
    </section>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────

function About() {
  return (
    <section id="apropos" className="bg-[#faf6f0] py-24 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
          <FadeUp>
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#b5451b]">
                Notre histoire
              </p>
              <h2 className="mb-6 font-serif text-4xl font-bold text-[#2c1a0e] md:text-5xl">
                Ancrés dans notre
                <br />
                terroir depuis 2014
              </h2>
              <p className="mb-4 text-lg leading-relaxed text-[#2c1a0e]/70">
                La Forge du Terroir est née d'une vision simple : réunir sous un même toit l'excellence de la boucherie artisanale, les richesses de la boutique gourmande et la chaleur d'une table généreuse. Inspirée par les meilleurs producteurs québécois, notre cuisine célèbre ce que notre région a de plus précieux.
              </p>
              <p className="mb-8 text-lg leading-relaxed text-[#2c1a0e]/70">
                Chaque assiette raconte une histoire — celle d'un boucher passionné, d'un maraîcher dévoué, d'un fromager patient. Nous choisissons nos viandes, nos poissons, nos légumes avec la même rigueur que celle d'un artisan fier de son métier.
              </p>
              <div className="flex items-center gap-3 rounded-2xl border border-[#d4c4a8] bg-[#f5f0e8] p-4">
                <Check className="h-5 w-5 shrink-0 text-[#b5451b]" />
                <p className="text-sm font-medium text-[#2c1a0e]">
                  Nous soutenons fièrement les producteurs artisans du Québec — toujours frais, toujours de première qualité.
                </p>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="relative">
              <div className="overflow-hidden rounded-3xl shadow-2xl">
                <motion.img
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80"
                  alt="Notre salle à manger"
                  className="h-[480px] w-full object-cover"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-[#b5451b] p-6 shadow-xl">
                <p className="text-3xl font-bold text-[#faf6f0]">10+</p>
                <p className="text-sm text-[#faf6f0]/80">ans d'excellence</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

// ─── Philosophy (new section) ─────────────────────────────────────────────────

const stats = [
  { value: "100%", label: "Viandes AAA certifiées" },
  { value: "30+", label: "Producteurs locaux partenaires" },
  { value: "4", label: "Expériences sous un même toit" },
  { value: "5★", label: "Note Google moyenne" },
]

function Philosophy() {
  return (
    <section className="bg-[#2c1a0e] py-24 px-4">
      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#b5451b]">
              Notre philosophie
            </p>
            <h2 className="font-serif text-4xl font-bold text-[#faf6f0] md:text-5xl">
              La qualité ne se négocie pas
            </h2>
            <p className="mt-4 text-lg text-[#faf6f0]/60 max-w-2xl mx-auto">
              Du champ à l'assiette, chaque étape est pensée pour vous offrir une expérience authentique, enracinée dans le meilleur de la Mauricie.
            </p>
          </div>
        </FadeUp>

        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="rounded-2xl border border-[#faf6f0]/10 bg-[#faf6f0]/5 p-8 text-center"
            >
              <p className="mb-2 font-serif text-4xl font-bold text-[#b5451b]">{stat.value}</p>
              <p className="text-sm text-[#faf6f0]/70">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Services ─────────────────────────────────────────────────────────────────

const services = [
  {
    icon: "🍽",
    title: "Salle à manger",
    description:
      "Une expérience gastronomique complète dans un cadre chaleureux et raffiné. Réservation requise — même une heure avant, nous vous en remercions.",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
  },
  {
    icon: "🤝",
    title: "Traiteur",
    description:
      "Des banquets d'entreprise aux célébrations intimes, notre équipe compose des menus sur mesure qui émerveillent vos convives.",
    img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80",
  },
  {
    icon: "🥩",
    title: "Boucherie",
    description:
      "Des coupes AAA sélectionnées avec soin, découpées par des artisans bouchers. Bœuf, porc, veau, agneau — toujours frais, jamais congelé.",
    img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
  },
  {
    icon: "🧀",
    title: "Boutique Gourmande",
    description:
      "Fromages fins, terrines, charcuteries artisanales et produits du terroir québécois. Un arrêt obligatoire pour les amateurs de belles saveurs.",
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
  },
]

function Services() {
  return (
    <section id="services" className="bg-[#f5f0e8] py-24 px-4">
      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#b5451b]">
              Nos offres
            </p>
            <h2 className="font-serif text-4xl font-bold text-[#2c1a0e] md:text-5xl">
              Ce que nous offrons
            </h2>
          </div>
        </FadeUp>

        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((s) => (
            <motion.div
              key={s.title}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="rounded-2xl border border-[#d4c4a8] bg-[#faf6f0] overflow-hidden text-[#2c1a0e] shadow-sm"
            >
              <div className="overflow-hidden h-48">
                <motion.img
                  src={s.img}
                  alt={s.title}
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 font-serif text-xl font-bold text-[#2c1a0e]">{s.title}</h3>
                <p className="text-sm leading-relaxed text-[#2c1a0e]/70">{s.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Menu ─────────────────────────────────────────────────────────────────────

const midiDishes = [
  { title: "Tartare du boucher", description: "Servi avec croûtons maison, frites artisanales ou salade du marché", price: "22$" },
  { title: "Fish & Chip de morue", description: "Tempura à la blonde locale, sauce tartare maison, salade de chou croquante", price: "24$" },
  { title: "Forge-Burger", description: "Bœuf Angus AAA, laitue mesclun, bacon fumé, fromage affiné, mayo maison & frites", price: "22$" },
  { title: "Burger du Terroir", description: "Cerf rouge, oignons confits à l'érable, fromage suisse, mayo au pesto & frites", price: "25$" },
  { title: "Poutine du Forgeron", description: "Frites à la bière locale, canard fumé, sauce maison, saucisse artisanale & fromage de curds", price: "19$" },
]

const soirDishes = [
  { title: "Tartare de bœuf Angus & shiitakes", description: "6 oz avec croûtons maison, frites ou salade — format entrée 3 oz disponible", price: "18$" },
  { title: "Cassolette de brie chaud", description: "Abricots secs, canneberges fraîches et filet de sirop d'érable", price: "16$" },
  { title: "Bavette AAA 8 oz", description: "Sauce au poivre vert, légumes de saison rôtis, pomme de terre farcie", price: "40$" },
  { title: "Contre-filet Angus 12 oz", description: "Beurre composé maison, frites artisanales & salade du marché", price: "50$" },
  { title: "Côtes levées fumées", description: "Sauce whisky & érable — demi-portion ou portion entière", price: "30$–40$" },
  { title: "Tournedos de poulet chipotle", description: "Sauce whisky, légumes du jour, frites & salade", price: "30$" },
]

const creationsDishes = [
  { title: "Filet mignon AAA 5 oz", description: "Pomme de terre au four farcie, légumes du marché & salade fraîche — Surf n turf disponible +16$", price: "52$" },
  { title: "Magret de canard", description: "Chutney de figues maison, purée de patate douce veloutée", price: "45$" },
  { title: "Filet de saumon grillé", description: "Purée de pois verts, salsa de mangue au citron vert", price: "36$" },
  { title: "Trilogie de crevettes", description: "Tartare de grosses crevettes, crevettes nordiques & tempura — frites de patates douces", price: "40$" },
  { title: "Poulet farci", description: "Poivrons grillés, fromage de chèvre crémeux & prosciutto", price: "34$" },
  { title: "Raviolis de courge butternut", description: "Sauce demi-glace aux oignons caramélisés & fromage de chèvre affiné", price: "30$" },
]

function DishCard({ dish, delay = 0 }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-2xl border border-[#d4c4a8] bg-[#faf6f0] p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="mb-1 font-serif text-lg font-bold text-[#2c1a0e]">{dish.title}</h4>
          <p className="text-sm leading-relaxed text-[#2c1a0e]/60">{dish.description}</p>
        </div>
        <span className="shrink-0 rounded-full bg-[#b5451b]/10 px-3 py-1 text-sm font-bold text-[#b5451b]">
          {dish.price}
        </span>
      </div>
    </motion.div>
  )
}

function MenuSection() {
  return (
    <section id="menu" className="bg-[#faf6f0] py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <FadeUp>
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#b5451b]">
              Notre table
            </p>
            <h2 className="font-serif text-4xl font-bold text-[#2c1a0e] md:text-5xl">
              Nos Menus
            </h2>
          </div>
        </FadeUp>

        <Tabs.Root defaultValue="midi">
          <FadeUp delay={0.1}>
            <Tabs.List className="mx-auto mb-10 flex w-fit gap-1 rounded-full bg-[#f5f0e8] border border-[#d4c4a8] p-1">
              {[
                { value: "midi", label: "Menu Midi" },
                { value: "soir", label: "Menu Soir" },
                { value: "creations", label: "Créations" },
              ].map((tab) => (
                <Tabs.Trigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#2c1a0e]/60 transition-all data-[state=active]:bg-[#b5451b] data-[state=active]:text-[#faf6f0] data-[state=active]:shadow-sm"
                >
                  {tab.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </FadeUp>

          <Tabs.Content value="midi">
            <motion.div
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {midiDishes.map((d) => (
                <DishCard key={d.title} dish={d} />
              ))}
            </motion.div>
            <div className="mt-8 text-center">
              <Button variant="ghost">Voir le Menu Midi complet (PDF)</Button>
            </div>
          </Tabs.Content>

          <Tabs.Content value="soir">
            <motion.div
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {soirDishes.map((d) => (
                <DishCard key={d.title} dish={d} />
              ))}
            </motion.div>
            <div className="mt-8 text-center">
              <Button variant="ghost">Voir le Menu Soir complet (PDF)</Button>
            </div>
          </Tabs.Content>

          <Tabs.Content value="creations">
            <motion.div
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {creationsDishes.map((d) => (
                <DishCard key={d.title} dish={d} />
              ))}
            </motion.div>
            <div className="mt-8 text-center">
              <Button variant="ghost">Voir le Menu Créations complet (PDF)</Button>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    quote: "Une cuisine authentique qui rend hommage au terroir québécois. Le filet mignon était à couper le souffle — fondant et parfaitement assaisonné. On y retourne dès que possible!",
    name: "Marie-Claude Leblanc",
    role: "Cliente fidèle",
    avatar: "https://mdceqvjsrzkvnrigaili.supabase.co/storage/v1/object/public/site-assets/LaForgeduTerroir/7795355082769051095.cc/1",
    stars: 5,
  },
  {
    quote: "La boucherie est une révélation. Des coupes que vous ne trouvez nulle part ailleurs à La Tuque. Le personnel connaît son métier et prend le temps d'expliquer chaque pièce.",
    name: "Jean-François Tremblay",
    role: "Amateur de viandes",
    avatar: "https://mdceqvjsrzkvnrigaili.supabase.co/storage/v1/object/public/site-assets/LaForgeduTerroir/3968481648073986364.cc/1",
    stars: 5,
  },
  {
    quote: "Nous avons fait appel à leur service traiteur pour notre mariage. Un service impeccable, des saveurs mémorables. Nos 80 invités en parlent encore!",
    name: "Sophie Gagnon",
    role: "Mariée heureuse",
    avatar: "https://mdceqvjsrzkvnrigaili.supabase.co/storage/v1/object/public/site-assets/LaForgeduTerroir/8542400212886326334.cc/1",
    stars: 5,
  },
]

function TestimonialCard({ t, delay }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-2xl border border-[#d4c4a8] bg-[#faf6f0] p-6 shadow-sm"
    >
      <div className="mb-4 flex gap-1">
        {Array.from({ length: t.stars }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-[#b5451b] text-[#b5451b]" />
        ))}
      </div>
      <p className="mb-6 text-[#2c1a0e]/80 leading-relaxed italic">"{t.quote}"</p>
      <div className="flex items-center gap-3">
        <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
        <div>
          <p className="font-semibold text-[#2c1a0e] text-sm">{t.name}</p>
          <p className="text-xs text-[#2c1a0e]/50">{t.role}</p>
        </div>
      </div>
    </motion.div>
  )
}

function Testimonials() {
  return (
    <section className="bg-[#f5f0e8] py-24 px-4">
      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#b5451b]">
              Témoignages
            </p>
            <h2 className="font-serif text-4xl font-bold text-[#2c1a0e] md:text-5xl">
              Ce que nos clients disent
            </h2>
          </div>
        </FadeUp>

        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", alt: "Plat signature" },
  { src: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80", alt: "Viande grillée" },
  { src: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80", alt: "Boutique gourmande" },
  { src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80", alt: "Salle à manger" },
  { src: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80", alt: "Burger du Terroir" },
  { src: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80", alt: "Dessert du moment" },
]

function Gallery() {
  return (
    <section className="bg-[#2c1a0e] py-24 px-4">
      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#b5451b]">
              Galerie
            </p>
            <h2 className="font-serif text-4xl font-bold text-[#faf6f0] md:text-5xl">
              Notre cuisine en images
            </h2>
          </div>
        </FadeUp>

        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {galleryImages.map((img) => (
            <motion.div
              key={img.alt}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="overflow-hidden rounded-2xl cursor-pointer"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-64 w-full object-cover transition-transform duration-500"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

function Newsletter() {
  const [form, setForm] = useState({ prenom: "", nom: "", email: "" })
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(false)

  function validate() {
    const e = {}
    if (!form.prenom.trim()) e.prenom = "Prénom requis"
    if (!form.nom.trim()) e.nom = "Nom requis"
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Courriel invalide"
    return e
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setForm({ prenom: "", nom: "", email: "" })
    setToast(true)
  }

  return (
    <section className="bg-[#f5f0e8] py-24 px-4">
      <div className="mx-auto max-w-2xl text-center">
        <FadeUp>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#b5451b]">
            Restez informé
          </p>
          <h2 className="mb-4 font-serif text-4xl font-bold text-[#2c1a0e] md:text-5xl">
            Notre infolettre
          </h2>
          <p className="mb-10 text-lg text-[#2c1a0e]/70">
            Inscrivez-vous et recevez nos menus, nos promotions de la semaine et nos nouvelles de saison directement dans votre boîte courriel.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 text-left">
                <label className="text-sm font-medium text-[#2c1a0e]">Prénom</label>
                <input
                  value={form.prenom}
                  onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                  placeholder="Marie-Claude"
                  className={cn(
                    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#2c1a0e] placeholder:text-[#2c1a0e]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b5451b]",
                    errors.prenom ? "border-red-500" : "border-[#d4c4a8]"
                  )}
                />
                <AnimatePresence>
                  {errors.prenom && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-red-500">
                      {errors.prenom}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div className="space-y-1.5 text-left">
                <label className="text-sm font-medium text-[#2c1a0e]">Nom</label>
                <input
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  placeholder="Tremblay"
                  className={cn(
                    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#2c1a0e] placeholder:text-[#2c1a0e]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b5451b]",
                    errors.nom ? "border-red-500" : "border-[#d4c4a8]"
                  )}
                />
                <AnimatePresence>
                  {errors.nom && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-red-500">
                      {errors.nom}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium text-[#2c1a0e]">Courriel</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="marie@exemple.com"
                className={cn(
                  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#2c1a0e] placeholder:text-[#2c1a0e]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b5451b]",
                  errors.email ? "border-red-500" : "border-[#d4c4a8]"
                )}
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-red-500">
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <Button type="submit" size="lg" className="w-full mt-2">
              Soumettre
            </Button>
          </form>
        </FadeUp>
      </div>

      <AnimatePresence>
        {toast && <Toast message="Merci! Vous êtes maintenant inscrit à notre infolettre." onClose={() => setToast(false)} />}
      </AnimatePresence>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────

const hours = [
  { day: "Mardi", time: "11h – 13h30" },
  { day: "Mercredi – Vendredi", time: "11h – 13h30 et 17h – 21h" },
  { day: "Samedi", time: "17h – 21h" },
  { day: "Dimanche – Lundi", time: "Fermé" },
]

function Contact() {
  const [cform, setCform] = useState({ nom: "", email: "", message: "" })
  const [cerrors, setCerrors] = useState({})
  const [ctoast, setCtoast] = useState(false)

  function cvalidate() {
    const e = {}
    if (!cform.nom.trim()) e.nom = "Nom requis"
    if (!cform.email.trim() || !/\S+@\S+\.\S+/.test(cform.email)) e.email = "Courriel invalide"
    if (!cform.message.trim()) e.message = "Message requis"
    return e
  }

  function handleCSubmit(ev) {
    ev.preventDefault()
    const e = cvalidate()
    if (Object.keys(e).length) { setCerrors(e); return }
    setCerrors({})
    setCform({ nom: "", email: "", message: "" })
    setCtoast(true)
  }

  return (
    <section id="contact" className="bg-[#faf6f0] py-24 px-4">
      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#b5451b]">
              Venez nous voir
            </p>
            <h2 className="font-serif text-4xl font-bold text-[#2c1a0e] md:text-5xl">
              Nous joindre
            </h2>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <FadeUp delay={0.05}>
            <div className="space-y-8">
              <div className="rounded-2xl border border-[#d4c4a8] bg-[#f5f0e8] p-8">
                <h3 className="mb-6 font-serif text-2xl font-bold text-[#2c1a0e]">Informations</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#b5451b]/10">
                      <Phone className="h-5 w-5 text-[#b5451b]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#2c1a0e]/50">Téléphone</p>
                      <a href="tel:+18195232991" className="font-semibold text-[#2c1a0e] hover:text-[#b5451b] transition-colors">
                        (819) 523-2991
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#b5451b]/10">
                      <MapPin className="h-5 w-5 text-[#b5451b]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#2c1a0e]/50">Adresse</p>
                      <p className="font-semibold text-[#2c1a0e]">556 Rue Commerciale<br />La Tuque, QC G9X 3A9</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#b5451b]/10">
                      <Mail className="h-5 w-5 text-[#b5451b]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#2c1a0e]/50">Courriel</p>
                      <a href="mailto:info@laforgeduterroir.ca" className="font-semibold text-[#2c1a0e] hover:text-[#b5451b] transition-colors">
                        info@laforgeduterroir.ca
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#d4c4a8] bg-[#f5f0e8] p-8">
                <h3 className="mb-6 font-serif text-2xl font-bold text-[#2c1a0e]">Heures d'opération</h3>
                <div className="space-y-3">
                  {hours.map((h) => (
                    <div key={h.day} className="flex items-center justify-between gap-4 border-b border-[#d4c4a8] pb-3 last:border-0 last:pb-0">
                      <span className="text-sm font-medium text-[#2c1a0e]">{h.day}</span>
                      <span className={cn("text-sm", h.time === "Fermé" ? "text-[#2c1a0e]/40 italic" : "font-semibold text-[#b5451b]")}>
                        {h.time}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-sm text-[#2c1a0e]/60 italic">
                  La réservation est requise pour la salle à manger — même quelques minutes avant votre arrivée.
                </p>
                <div className="mt-6">
                  <Button className="w-full gap-2">
                    Réserver une table <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="rounded-2xl border border-[#d4c4a8] bg-[#f5f0e8] p-8">
              <h3 className="mb-6 font-serif text-2xl font-bold text-[#2c1a0e]">Écrivez-nous</h3>
              <form onSubmit={handleCSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#2c1a0e]">Nom complet</label>
                  <input
                    value={cform.nom}
                    onChange={(e) => setCform({ ...cform, nom: e.target.value })}
                    placeholder="Jean-François Tremblay"
                    className={cn(
                      "w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#2c1a0e] placeholder:text-[#2c1a0e]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b5451b]",
                      cerrors.nom ? "border-red-500" : "border-[#d4c4a8]"
                    )}
                  />
                  <AnimatePresence>
                    {cerrors.nom && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-red-500">
                        {cerrors.nom}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#2c1a0e]">Courriel</label>
                  <input
                    type="email"
                    value={cform.email}
                    onChange={(e) => setCform({ ...cform, email: e.target.value })}
                    placeholder="jean@exemple.com"
                    className={cn(
                      "w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#2c1a0e] placeholder:text-[#2c1a0e]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b5451b]",
                      cerrors.email ? "border-red-500" : "border-[#d4c4a8]"
                    )}
                  />
                  <AnimatePresence>
                    {cerrors.email && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-red-500">
                        {cerrors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#2c1a0e]">Message</label>
                  <textarea
                    rows={5}
                    value={cform.message}
                    onChange={(e) => setCform({ ...cform, message: e.target.value })}
                    placeholder="Votre message, question ou demande de réservation..."
                    className={cn(
                      "w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-[#2c1a0e] placeholder:text-[#2c1a0e]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b5451b]",
                      cerrors.message ? "border-red-500" : "border-[#d4c4a8]"
                    )}
                  />
                  <AnimatePresence>
                    {cerrors.message && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-red-500">
                        {cerrors.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <Button type="submit" size="lg" className="w-full">
                  Envoyer
                </Button>
              </form>
            </div>
          </FadeUp>
        </div>
      </div>

      <AnimatePresence>
        {ctoast && <Toast message="Message envoyé! Nous vous répondrons sous 24h." onClose={() => setCtoast(false)} />}
      </AnimatePresence>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const footerLinks = [
    { label: "Accueil", href: "#accueil" },
    { label: "À propos", href: "#apropos" },
    { label: "Services", href: "#services" },
    { label: "Menu", href: "#menu" },
    { label: "Nous joindre", href: "#contact" },
  ]

  return (
    <footer className="bg-[#2c1a0e] py-16 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b5451b]">
              <span className="text-sm font-bold text-[#faf6f0]">FT</span>
            </div>
            <span className="font-serif text-xl font-bold text-[#faf6f0]">La Forge du Terroir</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-[#faf6f0]/60 hover:text-[#faf6f0] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#faf6f0]/20 text-[#faf6f0]/60 hover:border-[#b5451b] hover:text-[#b5451b] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
        </div>

        <div className="mt-10 border-t border-[#faf6f0]/10 pt-8 text-center">
          <p className="text-sm text-[#faf6f0]/40">
            Tous droits réservés La Forge du Terroir &copy; 2024
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="min-h-[100dvh] bg-[#faf6f0] overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Philosophy />
      <Services />
      <MenuSection />
      <Testimonials />
      <Gallery />
      <Newsletter />
      <Contact />
      <Footer />
    </div>
  )
}
