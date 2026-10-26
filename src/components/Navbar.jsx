import { useState, memo, useEffect, useRef } from 'react';
import { Gsap, GsapPresence } from '../utils/gsapAnimate';
import { Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-react';
import Magnetic from './Magnetic';
import { exponentialEaseOut } from '../utils/easing';

const NAV_ITEMS = [
  { label: 'About', sectionId: 'about-section' },
  { label: 'Logs', sectionId: 'project-section' },
  { label: 'Work', sectionId: 'experience-section' },
  { label: 'Stack', sectionId: 'tech-stack-section' },
  { label: 'Stats', sectionId: 'github-stats-section' },
  { label: 'Skills', sectionId: 'capabilities-section' },
];

const SECTION_CONFIG = [
  { id: 'hero-section', isDark: (isDark) => isDark },
  { id: 'about-section', isDark: false },
  { id: 'project-section', isDark: true },
  { id: 'experience-section', isDark: false },
  { id: 'tech-stack-section', isDark: true },
  { id: 'github-stats-section', isDark: true },
  { id: 'capabilities-section', isDark: false },
  { id: 'contact-section', isDark: true },
];

const Navbar = memo(function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isOnDarkSection, setIsOnDarkSection] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const previousBodyOverflowRef = useRef('');
  const menuStoppedLenisRef = useRef(false);

  const capsuleRef = useRef(null);
  const navItemRefs = useRef([]);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Track scroll position to determine background theme and active section
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const nextScrolled = scrollY > 40;
        setScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));

        // Probe point for the navbar capsule (around 56px from top)
        const probeY = 56;
        let detectedDark = isDarkMode;

        for (const section of SECTION_CONFIG) {
          const el = document.getElementById(section.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= probeY && rect.bottom > probeY) {
              detectedDark = typeof section.isDark === 'function' ? section.isDark(isDarkMode) : section.isDark;
              break;
            }
          }
        }

        // Detect which nav section is most prominently in view
        const viewportTrigger = window.innerHeight * 0.4;
        let currentActive = null;

        for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
          const item = NAV_ITEMS[i];
          const el = document.getElementById(item.sectionId);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= viewportTrigger && rect.bottom > probeY) {
              currentActive = item.sectionId;
              break;
            }
          }
        }

        setIsOnDarkSection((prev) => (prev === detectedDark ? prev : detectedDark));
        setActiveSectionId((prev) => (prev === currentActive ? prev : currentActive));

        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isDarkMode]);

  // Synchronize gliding pill position to hovered or active item
  const targetIndex = hoveredIndex !== null
    ? hoveredIndex
    : NAV_ITEMS.findIndex((item) => item.sectionId === activeSectionId);

  useEffect(() => {
    const updatePillPosition = () => {
      if (targetIndex >= 0 && navItemRefs.current[targetIndex]) {
        const el = navItemRefs.current[targetIndex];
        setPillStyle({
          left: el.offsetLeft,
          width: el.offsetWidth,
          opacity: 1,
        });
      } else {
        setPillStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updatePillPosition();
    window.addEventListener('resize', updatePillPosition);
    return () => window.removeEventListener('resize', updatePillPosition);
  }, [targetIndex, scrolled, isOnDarkSection]);

  useEffect(() => {
    const lenis = window.lenisInstance;

    if (isMenuOpen) {
      previousBodyOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      if (lenis && typeof lenis.stop === 'function') {
        lenis.stop();
        menuStoppedLenisRef.current = true;
      }

      return;
    }

    document.body.style.overflow = previousBodyOverflowRef.current;

    if (menuStoppedLenisRef.current && lenis && typeof lenis.start === 'function') {
      lenis.start();
      menuStoppedLenisRef.current = false;
    }
  }, [isMenuOpen]);

  useEffect(() => () => {
    document.body.style.overflow = previousBodyOverflowRef.current;
  }, []);

  const scrollTo = (sectionId) => {
    setActiveSectionId(sectionId);
    setIsMenuOpen(false);

    setTimeout(() => {
      const target = document.getElementById(sectionId);
      if (!target) return;

      if (window.lenisInstance && typeof window.lenisInstance.scrollTo === 'function') {
        window.lenisInstance.scrollTo(target, {
          offset: -24,
          duration: 1.5,
          easing: exponentialEaseOut
        });
        return;
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <nav className="fixed top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-50 pointer-events-none transition-all duration-300">
      {/* ── Logo ── */}
      <Magnetic>
        <div
          onClick={() => {
            if (window.lenisInstance && typeof window.lenisInstance.scrollTo === 'function') {
              window.lenisInstance.scrollTo(0, {
                duration: 1.5,
                easing: exponentialEaseOut
              });
              return;
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`group pointer-events-auto flex items-center gap-3 px-5 py-2.5 rounded-full backdrop-blur-2xl border transition-all duration-300 cursor-pointer ${
            isOnDarkSection
              ? 'bg-[#141414]/90 border-white/15 text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)]'
              : 'bg-white/92 border-black/10 text-black shadow-[0_8px_24px_rgba(0,0,0,0.08)]'
          }`}
        >
          <span className="text-sm font-black tracking-[0.16em] md:tracking-[0.2em] uppercase transition-colors duration-200">
            Danxzyy_
          </span>
        </div>
      </Magnetic>

      {/* ── Mobile Menu Toggle ── */}
      <div className="lg:hidden pointer-events-auto relative z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className={`w-11 h-11 flex items-center justify-center rounded-full backdrop-blur-2xl border transition-all duration-300 ${
            isMenuOpen
              ? 'bg-white text-black border-black/10 shadow-[0_8px_24px_rgba(0,0,0,0.15)]'
              : isOnDarkSection
                ? 'bg-[#141414]/90 border-white/15 text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)]'
                : 'bg-white/92 border-black/10 text-black shadow-[0_8px_24px_rgba(0,0,0,0.08)]'
          }`}
        >
          {isMenuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
        </button>
      </div>

      {/* ── Mobile Menu Overlay ── */}
      <GsapPresence>
        {isMenuOpen && (
          <Gsap.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className={`fixed inset-0 z-40 pointer-events-auto lg:hidden backdrop-blur-xl overflow-hidden ${isOnDarkSection ? 'bg-[#0A0A0A]/95 text-white' : 'bg-[#FAF9F6]/98 text-black'}`}
          >
            <div className={`absolute inset-0 opacity-[0.08] pointer-events-none [background-size:28px_28px] ${isOnDarkSection ? '[background-image:linear-gradient(to_right,rgba(255,255,255,0.24)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.24)_1px,transparent_1px)]' : '[background-image:linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)]'}`} />
            <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-neutral-400/15 blur-3xl pointer-events-none" />
            <div className={`absolute -bottom-24 -left-10 w-64 h-64 rounded-full blur-3xl pointer-events-none ${isOnDarkSection ? 'bg-white/10' : 'bg-black/5'}`} />

            <Gsap.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 h-full w-full px-6 pt-24 pb-8 flex flex-col"
            >
              <div className={`w-full max-w-md mx-auto pb-4 border-b flex items-center justify-between ${isOnDarkSection ? 'border-white/20' : 'border-black/15'}`}>
                <span className={`font-mono text-[10px] uppercase tracking-[0.22em] ${isOnDarkSection ? 'text-white/70' : 'text-black/60'}`}>Navigation Matrix</span>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className={`font-mono text-[10px] tracking-[0.14em] ${isOnDarkSection ? 'text-white/60' : 'text-black/50'}`}>MOBILE</span>
                </div>
              </div>

              <div className="w-full max-w-md mx-auto mt-6 flex-1 flex flex-col justify-center">
                {NAV_ITEMS.map((item, i) => (
                  <Gsap.button
                    key={item.sectionId}
                    onClick={() => scrollTo(item.sectionId)}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, delay: 0.05 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    className={`w-full border-b last:border-b-0 py-4 flex items-center justify-between text-left active:translate-x-1 transition-transform ${isOnDarkSection ? 'border-white/15 active:bg-white/5' : 'border-black/10 active:bg-black/5'}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-[11px] font-mono font-bold tracking-[0.14em] ${isOnDarkSection ? 'text-white/50' : 'text-black/40'}`}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={`text-[28px] sm:text-[32px] leading-none font-black uppercase tracking-tight ${isOnDarkSection ? 'text-white' : 'text-black'}`}>{item.label}</span>
                    </div>
                    <span className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${isOnDarkSection ? 'border-white/20 text-white/80' : 'border-black/15 text-black/80'}`}>
                      <ArrowUpRight size={16} />
                    </span>
                  </Gsap.button>
                ))}
              </div>

              <Gsap.button
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.28 }}
                onClick={() => scrollTo('contact-section')}
                className={`w-full max-w-md mx-auto mt-6 h-12 rounded-full text-xs font-bold uppercase tracking-[0.16em] flex items-center justify-center gap-2 shadow-[0_10px_24px_rgba(0,0,0,0.2)] transition-transform active:scale-95 ${isOnDarkSection ? 'bg-white text-black' : 'bg-black text-white'}`}
              >
                Let's Talk
                <ArrowUpRight size={14} />
              </Gsap.button>

              <div className={`w-full max-w-md mx-auto mt-5 pt-4 border-t flex items-center justify-between ${isOnDarkSection ? 'border-white/15' : 'border-black/10'}`}>
                <span className={`font-mono text-[10px] tracking-[0.14em] ${isOnDarkSection ? 'text-white/60' : 'text-black/50'}`}>Select Section</span>
                <span className={`font-mono text-[10px] tracking-[0.14em] ${isOnDarkSection ? 'text-white/60' : 'text-black/50'}`}>Tap To Navigate</span>
              </div>
            </Gsap.div>
          </Gsap.div>
        )}
      </GsapPresence>

      {/* ── Desktop Menu (Floating Capsule with Gliding Pill) ── */}
      <div className={`hidden lg:flex items-center pointer-events-auto absolute left-1/2 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolled ? 'top-5 scale-100' : 'top-7 scale-[1.02]'}`}>
        <div
          ref={capsuleRef}
          className={`flex items-center p-1.5 backdrop-blur-2xl border rounded-full relative transition-all duration-300 ${
            isOnDarkSection
              ? 'bg-[#141414]/90 border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]'
              : 'bg-white/92 border-black/10 shadow-[0_12px_36px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)]'
          }`}
        >
          {/* Gliding Pill Indicator */}
          <div
            className={`absolute top-1.5 bottom-1.5 rounded-full pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isOnDarkSection
                ? 'bg-white/15 border border-white/10 shadow-sm'
                : 'bg-black/10 border border-black/5 shadow-sm'
            }`}
            style={{
              left: `${pillStyle.left}px`,
              width: `${pillStyle.width}px`,
              opacity: pillStyle.opacity,
            }}
          />

          {NAV_ITEMS.map((item, index) => {
            const isActive = activeSectionId === item.sectionId;
            const isHovered = hoveredIndex === index;
            const isHighlighted = isHovered || (hoveredIndex === null && isActive);

            return (
              <div
                key={item.sectionId}
                ref={(el) => (navItemRefs.current[index] = el)}
                className="relative z-10"
              >
                <Magnetic>
                  <button
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => scrollTo(item.sectionId)}
                    className={`relative px-4 xl:px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[0.12em] md:tracking-[0.14em] transition-colors duration-200 select-none ${
                      isOnDarkSection
                        ? isHighlighted
                          ? 'text-white'
                          : 'text-neutral-400 hover:text-white'
                        : isHighlighted
                          ? 'text-black'
                          : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    {item.label}
                  </button>
                </Magnetic>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Desktop Right (Premium CTA & Theme Toggle) ── */}
      <div className="hidden lg:flex pointer-events-auto items-center gap-3">
        <Magnetic>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 border ${
              isOnDarkSection
                ? 'bg-[#141414]/90 text-white border-white/15 hover:bg-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.3)]'
                : 'bg-white/92 text-black border-black/10 hover:bg-black/5 shadow-[0_4px_16px_rgba(0,0,0,0.08)]'
            }`}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </Magnetic>

        <Magnetic>
          <button
            onClick={() => scrollTo('contact-section')}
            className={`group relative overflow-hidden flex items-center gap-3 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.12em] md:tracking-[0.14em] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.15)] ${
              isOnDarkSection
                ? 'bg-white text-black hover:bg-neutral-200'
                : 'bg-black text-white hover:bg-neutral-800'
            }`}
          >
            {/* Core Label */}
            <span className="relative z-10 pl-1">Let's Talk</span>

            {/* Glowing Icon Container */}
            <div
              className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                isOnDarkSection ? 'bg-black text-white' : 'bg-neutral-300 text-black'
              }`}
            >
              <ArrowUpRight size={14} strokeWidth={2.5} className="group-hover:rotate-45 transition-transform duration-300" />
            </div>
          </button>
        </Magnetic>
      </div>
    </nav>
  );
});

export default Navbar;

