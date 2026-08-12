import { motion, useScroll, useTransform } from "framer-motion";
import { type ReactNode, useRef } from "react";

import { SafeVideo } from "@/components/SafeVideo";

type ScrollExpandMediaProps = {
  mediaType?: "video" | "image";
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
};

export function ScrollExpandMedia({
  mediaType = "video",
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  const scale = useTransform(scrollYProgress, [0, 0.12, 0.78, 1], [0.52, 0.52, 1, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.72, 1], [28, 20, 0]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.55, 0.9], [0.78, 0.34, 0]);
  const mediaShade = useTransform(scrollYProgress, [0, 0.72, 1], [0.38, 0.2, 0.08]);
  const textLeft = useTransform(scrollYProgress, [0, 0.78], [0, -46]);
  const textRight = useTransform(scrollYProgress, [0, 0.78], [0, 46]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.62, 0.86], [1, 0.9, 0]);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <div className="relative bg-black">
      <div ref={sectionRef} className="relative h-[240svh] overflow-clip bg-black">
        <div className="sticky top-0 h-svh overflow-hidden">
          <motion.div className="absolute inset-0" style={{ opacity: backgroundOpacity }}>
            <img src={bgImageSrc} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_10%,rgba(0,0,0,.72)_78%),linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,.72))]" />
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center px-3 sm:px-6">
            <motion.div
              className="relative aspect-video w-[min(94vw,1380px)] overflow-hidden border border-white/12 bg-black shadow-[0_32px_100px_rgba(0,0,0,.6)]"
              style={{ scale, borderRadius: radius }}
            >
              {mediaType === "video" ? (
                <SafeVideo
                  src={mediaSrc}
                  fallbackSrc={posterSrc || bgImageSrc}
                  fallbackAlt={title || "Mídia profissional"}
                  poster={posterSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="h-full w-full object-cover"
                  controls={false}
                  disablePictureInPicture
                  disableRemotePlayback
                />
              ) : (
                <img src={mediaSrc} alt={title || "Mídia profissional"} className="h-full w-full object-cover" />
              )}
              <motion.div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: mediaShade }} />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,rgba(95,199,255,.12),transparent_32%,transparent_68%,rgba(101,212,159,.08))]" />
            </motion.div>
          </div>

          <motion.div
            className={`pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center ${textBlend ? "mix-blend-difference" : ""}`}
            style={{ opacity: titleOpacity }}
          >
            <motion.h2 className="font-display text-[clamp(2.7rem,7vw,6.8rem)] font-bold leading-[.88] text-blue-100" style={{ x: textLeft }}>
              {firstWord}
            </motion.h2>
            <motion.h2 className="mt-2 font-display text-[clamp(2.7rem,7vw,6.8rem)] font-bold leading-[.88] text-blue-100" style={{ x: textRight }}>
              {restOfTitle}
            </motion.h2>
          </motion.div>

          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-2 px-5 text-center">
            {date ? <p className="font-mono text-[9px] uppercase tracking-[.2em] text-white/55">{date}</p> : null}
            {scrollToExpand ? <p className="text-xs text-white/45">{scrollToExpand}</p> : null}
            <div className="mt-1 h-px w-40 overflow-hidden bg-white/10">
              <motion.div className="h-full origin-left bg-gradient-to-r from-tech via-signal to-clarity" style={{ scaleX: progressScale }} />
            </div>
          </div>
        </div>
      </div>

      <motion.section
        className="relative z-30 mt-[-6svh] border-t border-white/8 bg-background px-5 py-16 md:px-16 lg:py-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.section>
    </div>
  );
}
