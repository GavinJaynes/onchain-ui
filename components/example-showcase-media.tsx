"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function ExampleShowcaseMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => {
      if (motion.matches) {
        video.pause();
        return;
      }
      void video.play().catch(() => setIsPlaying(false));
    };

    syncMotionPreference();
    motion.addEventListener("change", syncMotionPreference);
    return () => motion.removeEventListener("change", syncMotionPreference);
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };

  return (
    <div className="group relative aspect-video overflow-hidden bg-[#070810] lg:aspect-auto lg:min-h-[31rem]">
      <Image
        src="/showcase/onchain-ui-swap-example.png"
        alt="The onchain-ui swap example running inside a laptop mockup"
        fill
        sizes="(min-width: 1024px) 66vw, 100vw"
        className="object-cover"
      />
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/showcase/onchain-ui-swap-example.png"
        aria-hidden="true"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="absolute inset-0 size-full object-cover motion-reduce:opacity-0"
      >
        <source src="/showcase/onchain-ui-promo.mp4" type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10" />
      <button
        type="button"
        onClick={togglePlayback}
        aria-label={isPlaying ? "Pause example video" : "Play example video"}
        className="absolute right-4 bottom-4 inline-flex size-9 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white/80 opacity-0 backdrop-blur-md transition hover:bg-black/70 hover:text-white focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none group-hover:opacity-100"
      >
        {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
      </button>
    </div>
  );
}
