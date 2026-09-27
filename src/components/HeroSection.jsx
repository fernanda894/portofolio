import { memo, useRef } from 'react';
import { Gsap, useGsapReducedMotion, useGsapScroll, useGsapTransform } from '../utils/gsapAnimate';

const HeroSection = memo(function HeroSection({ isRevealed = true }) {
  const containerRef = useRef(null);
  const reduceMotion = useGsapReducedMotion();

  const { scrollYProgress } = useGsapScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax effects
  const bgY = useGsapTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const textY = useGsapTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const imgY = useGsapTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  return (
    <header
      ref={containerRef}
      id="hero-section"
      className="min-h-[100svh] w-full relative bg-[#F1F1F1] dark:bg-[#111111] transition-colors duration-500 overflow-hidden flex flex-col items-center justify-end"
    >
      {/* ── BACKGROUND PARALLAX ── */}
      <Gsap.div
        style={!reduceMotion ? { y: bgY } : undefined}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02),transparent_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_60%)]" />
      </Gsap.div>

      {/* ── MASSIVE OUTLINE TEXT (SCROLLING/MARQUEE) ── */}
      <Gsap.div
        style={!reduceMotion ? { y: textY } : undefined}
        className="absolute top-[40%] left-0 w-full -translate-y-1/2 z-10 pointer-events-none overflow-hidden"
      >
        <div 
          className="flex whitespace-nowrap animate-[marquee-scroll-left_30s_linear_infinite]"
          style={{ width: 'fit-content' }}
        >
          {/* Repeating the text to create a seamless loop */}
          {[1, 2, 3, 4].map((i) => (
            <Gsap.h1
              key={i}
              initial={false}
              animate={isRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(4rem,15vw,15rem)] font-black tracking-tighter leading-[1] px-8 text-black/90 dark:text-white/90 whitespace-nowrap flex items-center"
              style={{
                WebkitTextFillColor: 'transparent',
                WebkitTextStroke: '2px currentColor'
              }}
            >
              <span className="uppercase drop-shadow-sm whitespace-nowrap">
                FERNANDA PRATAMA -
              </span>
            </Gsap.h1>
          ))}
        </div>
      </Gsap.div>

      {/* ── PORTRAIT PHOTO ── */}
      <Gsap.div
        style={!reduceMotion ? { y: imgY } : undefined}
        initial={false}
        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 w-[90vw] max-w-[500px] lg:max-w-[700px] mt-auto bottom-0 flex justify-center items-end"
      >
        <div className="w-full relative flex items-end justify-center group pointer-events-none">
          <img 
            src="/hero.png" 
            alt="Fernanda Pratama" 
            className="w-full h-auto object-contain object-bottom transition-transform duration-700 group-hover:scale-105 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            onError={(e) => {
              e.target.style.opacity = '0';
            }}
          />
        </div>
      </Gsap.div>

      {/* ── SCROLL DOWN INDICATOR ── */}
      <Gsap.div
        initial={false}
        animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-12 right-12 z-30 hidden md:flex flex-col items-center gap-4"
      >
        <div className="w-[1px] h-16 bg-black/20 dark:bg-white/20 origin-top animate-pulse" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50 dark:text-white/50 rotate-90 origin-top-left translate-x-2">
          Scroll Down
        </span>
      </Gsap.div>
    </header>
  );
});

export default HeroSection;
