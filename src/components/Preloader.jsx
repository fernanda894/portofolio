import { useEffect, useState } from "react";
import { Gsap } from "../utils/gsapAnimate";

const Preloader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                const diff = Math.random() * 12;
                return Math.min(prev + diff, 100);
            });
        }, 100);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (progress === 100) {
            setTimeout(() => {
                setIsExiting(true);
                setTimeout(onComplete, 800);
            }, 800);
        }
    }, [progress, onComplete]);

    return (
        <div
            className={`fixed inset-0 z-[9999] bg-[#111] text-white flex flex-col justify-center items-center overflow-hidden transition-transform duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${isExiting ? '-translate-y-full' : 'translate-y-0'}`}
        >
            <div className="flex flex-col items-center">
                <div className="overflow-hidden">
                    <Gsap.h1 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        className="text-4xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-center"
                    >
                        Welcome To
                    </Gsap.h1>
                </div>
                <div className="overflow-hidden mt-1 md:mt-2">
                    <Gsap.h1 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                        className="text-4xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white/40 text-center"
                    >
                        My Portfolio
                    </Gsap.h1>
                </div>
            </div>

            {/* Premium Loading Bar */}
            <div className="absolute bottom-12 left-8 right-8 md:left-24 md:right-24">
                <div className="flex justify-between items-end mb-4 font-mono text-xs md:text-sm tracking-[0.2em] uppercase text-white/50">
                    <span>Loading Experience</span>
                    <span className="text-white">{Math.round(progress)}%</span>
                </div>
                <div className="h-[2px] w-full bg-white/10 overflow-hidden relative">
                    <div 
                        className="absolute top-0 left-0 h-full bg-white transition-all duration-200 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Preloader;
