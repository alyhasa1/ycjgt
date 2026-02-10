"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Paperclip,
  Wand2,
  Send,
  Play,
  ImageIcon,
  Check,
  Bot,
  User,
  ChevronRight,
  RotateCcw,
  Download,
  Share2,
  PlayCircle,
} from "lucide-react";
import Image from "next/image";

interface Asset {
  id: string;
  type: "image" | "video";
  url: string;
  name: string;
}

interface StoryboardScene {
  id: number;
  description: string;
  duration: string;
  transition: string;
  asset: string;
}

const DEMO_ASSETS: Asset[] = [
  { id: "1", type: "image", url: "/image1.png", name: "Editorial Look" },
  { id: "2", type: "image", url: "/image2.png", name: "Layered Outfit" },
  { id: "3", type: "image", url: "/image3.png", name: "Minimal Knit" },
  { id: "4", type: "image", url: "/image4.png", name: "Chain Bag" },
];

const VIDEO_URL = "https://upload.salemate.app/?op=stream&key=44076465-db37-4840-af9c-b89095d43708%2Fvideos%2F1770677557261-cea30a90-cab1-4a1b-86a8-e85def23b3b1-jimeng-2026-02-05-5881.mp4";

const DEMO_SCENES: StoryboardScene[] = [
  { id: 1, asset: "Editorial Look", description: "Bold editorial opening — geometric color-block backdrop, slow zoom into model", duration: "5s", transition: "Fade" },
  { id: 2, asset: "Layered Outfit", description: "Textured layering reveal — dusty rose coat, camera pans across fabric details", duration: "4s", transition: "Dissolve" },
  { id: 3, asset: "Minimal Knit", description: "Clean minimalism — soft focus on waffle-knit texture, gentle parallax drift", duration: "4s", transition: "Cut" },
  { id: 4, asset: "Chain Bag", description: "Hero product close-up — dramatic lighting on patent leather, chain detail macro", duration: "5s", transition: "Fade" },
];

type Phase = "idle" | "dropping" | "sending" | "typing" | "storyboard" | "approving" | "generating" | "done" | "video";

const TIMINGS: Partial<Record<Phase, number>> = {
  dropping: 2400,
  sending: 600,
  typing: 1800,
  storyboard: 3200,
  approving: 2200,
  generating: 3000,
  done: 1800,
};

const TITLE_WORDS = ["You", "Can", "Just", "Generate", "Things..."];

export function ChatDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [demoStarted, setDemoStarted] = useState(false);
  const [inputAssets, setInputAssets] = useState<Asset[]>([]);
  const [progress, setProgress] = useState(0);
  const [visibleScenes, setVisibleScenes] = useState(0);
  const [chatVisible, setChatVisible] = useState(false);
  const [storyboardText, setStoryboardText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const showStoryboard = ["storyboard", "approving", "generating", "done", "video"].includes(phase);
  const showApproveGlow = phase === "approving";
  const showVideoCard = phase === "video";
  const isComplete = ["done", "video"].includes(phase);

  const advance = useCallback(() => {
    setPhase((p) => {
      const order: Phase[] = ["idle", "dropping", "sending", "typing", "storyboard", "approving", "generating", "done", "video"];
      const idx = order.indexOf(p);
      if (idx >= order.length - 1) return p;
      return order[idx + 1];
    });
  }, []);

  const startDemo = useCallback(() => {
    setDemoStarted(true);
    setPhase("dropping");
  }, []);

  const replay = useCallback(() => {
    setChatVisible(false);
    setInputAssets([]);
    setVisibleScenes(0);
    setProgress(0);
    setStoryboardText("");
    setDemoStarted(false);
    setPhase("idle");
  }, []);

  useEffect(() => {
    if (phase === "idle" || phase === "video") return;
    const timing = TIMINGS[phase];
    if (!timing) return;
    const t = setTimeout(advance, timing);
    return () => clearTimeout(t);
  }, [phase, advance]);

  useEffect(() => {
    if (phase === "dropping") {
      setInputAssets([]);
      DEMO_ASSETS.forEach((a, i) => {
        setTimeout(() => setInputAssets((prev) => [...prev, a]), i * 350);
      });
    }
    if (phase === "sending") {
      setChatVisible(true);
    }
    if (phase === "typing") {
      setStoryboardText("");
    }
    if (phase === "storyboard") {
      setVisibleScenes(0);
      DEMO_SCENES.forEach((_, i) => {
        setTimeout(() => setVisibleScenes((v) => v + 1), 300 + i * 250);
      });
    }
    if (phase === "generating") {
      setProgress(0);
      const iv = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) { clearInterval(iv); return 100; }
          return p + 3;
        });
      }, 80);
      return () => clearInterval(iv);
    }
  }, [phase]);

  useEffect(() => {
    if (chatVisible) {
      const delay = phase === "video" ? 500 : 150;
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, delay);
    }
  }, [phase, chatVisible, visibleScenes]);

  const viewKey = chatVisible ? "chat" : "empty";

  return (
    <div className="flex h-full flex-col">
      {/* Chat messages area — scrollable */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-6 py-6">
        <div className="mx-auto max-w-[720px] flex flex-col gap-4 min-h-full">
          <AnimatePresence mode="wait">
            {viewKey === "empty" ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="flex flex-1 flex-col items-center justify-center pt-[18vh] md:pt-[22vh]"
              >
                {/* Animated logo */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-5"
                >
                  <Image src="/ycjgt.png" alt="YCJGT" width={52} height={52} className="object-contain drop-shadow-md" />
                </motion.div>

                {/* Animated title — word by word */}
                <div className="flex items-center gap-[5px] select-none mb-8">
                  {TITLE_WORDS.map((word, i) => (
                    <motion.span
                      key={word}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.15 + i * 0.1,
                        duration: 0.35,
                        ease: [0.25, 1, 0.5, 1],
                      }}
                      className="text-base md:text-lg font-semibold text-navy/20 tracking-tight"
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>

                {/* CTA — How it works */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                  onClick={startDemo}
                  className="group flex items-center gap-2 rounded-full border border-navy/[0.08] bg-white/60 px-5 py-2.5 text-sm font-medium text-navy/50 shadow-sm hover:bg-white/80 hover:text-navy/70 hover:border-navy/[0.12] hover:shadow-md cursor-pointer transition-all duration-200"
                >
                  <PlayCircle className="h-4 w-4 text-primary group-hover:text-primary-dark transition-colors" />
                  See How It Works
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col gap-5 pt-2"
              >
                {/* User message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                  className="flex gap-3 justify-end"
                >
                  <div className="max-w-[520px]">
                    <div className="rounded-2xl rounded-tr-sm bg-navy/[0.04] px-4 py-3">
                      <p className="mb-2 text-[13px] text-navy/60">Generate a storyboard from these assets:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {DEMO_ASSETS.map((a) => (
                          <div key={a.id} className="relative h-[44px] w-[62px] rounded-lg overflow-hidden ring-1 ring-navy/[0.06]">
                            <Image src={a.url} alt={a.name} fill className="object-cover" unoptimized />
                            {a.type === "video" && (
                              <div className="absolute inset-0 flex items-center justify-center bg-navy/20">
                                <Play className="h-2.5 w-2.5 text-white ml-[1px]" fill="currentColor" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-navy/[0.06] mt-1">
                    <User className="h-3 w-3 text-navy/40" />
                  </div>
                </motion.div>

                {/* AI response */}
                {["typing", "storyboard", "approving", "generating", "done", "video"].includes(phase) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                    className="flex gap-3"
                  >
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-navy/[0.06] mt-1">
                      <Bot className="h-3 w-3 text-navy/40" />
                    </div>
                    <div className="max-w-[620px] flex-1 min-w-0">
                      {/* Typing indicator */}
                      {phase === "typing" && (
                        <div className="flex items-center gap-1 py-2.5 px-0.5">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ opacity: [0.25, 0.8, 0.25] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                              className="h-1.5 w-1.5 rounded-full bg-navy/25"
                            />
                          ))}
                        </div>
                      )}

                      {/* Storyboard — native conversation table */}
                      {showStoryboard && (
                        <div className="space-y-3">
                          <p className="text-[13px] text-navy/60 leading-relaxed">
                            Here&apos;s your storyboard. I organized your 4 assets into a fashion lookbook sequence:
                          </p>

                          {/* Clean table — like ChatGPT/Claude output */}
                          <div className="overflow-x-auto -mx-1">
                            <table className="w-full text-left text-[12px] border-collapse">
                              <thead>
                                <tr className="border-b border-navy/[0.08]">
                                  <th className="py-2 px-2 font-semibold text-navy/45 w-8">#</th>
                                  <th className="py-2 px-2 font-semibold text-navy/45">Scene</th>
                                  <th className="py-2 px-2 font-semibold text-navy/45">Description</th>
                                  <th className="py-2 px-2 font-semibold text-navy/45 w-12">Dur.</th>
                                  <th className="py-2 px-2 font-semibold text-navy/45 w-16">Trans.</th>
                                </tr>
                              </thead>
                              <tbody>
                                {DEMO_SCENES.slice(0, visibleScenes).map((s) => (
                                  <motion.tr
                                    key={s.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.25 }}
                                    className="border-b border-navy/[0.04] last:border-0"
                                  >
                                    <td className="py-2 px-2 text-navy/30 tabular-nums font-medium">{s.id}</td>
                                    <td className="py-2 px-2 text-navy/55 font-medium whitespace-nowrap">{s.asset}</td>
                                    <td className="py-2 px-2 text-navy/45 leading-snug">{s.description}</td>
                                    <td className="py-2 px-2 text-navy/35 font-mono text-[11px]">{s.duration}</td>
                                    <td className="py-2 px-2 text-navy/35">{s.transition}</td>
                                  </motion.tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {visibleScenes >= DEMO_SCENES.length && (
                            <p className="text-[13px] text-navy/50 leading-relaxed">
                              Total duration: <span className="font-medium text-navy/60">18 seconds</span>. Ready to generate?
                            </p>
                          )}

                          {/* Progress bar */}
                          {phase === "generating" && (
                            <div className="pt-1">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[12px] text-navy/50">Generating video...</span>
                                <span className="text-[11px] text-navy/30 font-mono tabular-nums">{Math.min(progress, 100)}%</span>
                              </div>
                              <div className="h-1 w-full rounded-full bg-navy/[0.05] overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full bg-primary/60"
                                  style={{ width: `${Math.min(progress, 100)}%` }}
                                  transition={{ duration: 0.08, ease: "linear" }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Done */}
                          {isComplete && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className="flex items-center gap-2"
                            >
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                              <span className="text-[13px] text-emerald-600 font-medium">Video generated successfully</span>
                            </motion.div>
                          )}

                          {/* Approve CTA */}
                          {showStoryboard && !isComplete && phase !== "generating" && (
                            <motion.button
                              animate={showApproveGlow ? { boxShadow: ["0 0 0 0 rgba(79,195,247,0)", "0 0 12px 2px rgba(79,195,247,0.15)", "0 0 0 0 rgba(79,195,247,0)"] } : {}}
                              transition={showApproveGlow ? { duration: 1.8, repeat: Infinity } : {}}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-navy/[0.06] px-4 py-2 text-[12px] font-medium text-navy/55 hover:bg-navy/[0.1] cursor-pointer transition-colors"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Approve &amp; Generate
                              <ChevronRight className="h-3.5 w-3.5" />
                            </motion.button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Video card */}
                {showVideoCard && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                    className="flex gap-3"
                  >
                    <div className="w-6 flex-shrink-0" />
                    <div className="max-w-[560px] flex-1">
                      <div className="rounded-xl overflow-hidden bg-white border border-navy/[0.06] shadow-sm">
                        {/* Video player */}
                        <div className="relative aspect-video bg-navy/[0.03] overflow-hidden">
                          <video
                            src={VIDEO_URL}
                            poster="/image1.png"
                            controls
                            playsInline
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="px-4 py-3">
                          <h4 className="text-[13px] font-semibold text-navy/70 mb-0.5">Fashion Lookbook — Generated</h4>
                          <p className="text-[11px] text-navy/35 mb-3">4 scenes · 18s · HD 1080p</p>
                          <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1.5 rounded-lg bg-navy/[0.05] px-3 py-1.5 text-[11px] font-medium text-navy/50 hover:bg-navy/[0.08] cursor-pointer transition-colors">
                              <Download className="h-3 w-3" />Download
                            </button>
                            <button className="flex items-center gap-1.5 rounded-lg bg-navy/[0.05] px-3 py-1.5 text-[11px] font-medium text-navy/50 hover:bg-navy/[0.08] cursor-pointer transition-colors">
                              <Share2 className="h-3 w-3" />Share
                            </button>
                          </div>
                        </div>

                        {/* Replay CTA */}
                        <div className="border-t border-navy/[0.05] px-4 py-2.5 flex items-center justify-center">
                          <button
                            onClick={replay}
                            className="flex items-center gap-1.5 text-[11px] font-medium text-navy/35 hover:text-navy/55 cursor-pointer transition-colors"
                          >
                            <RotateCcw className="h-3 w-3" />
                            Replay Demo
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={chatEndRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input bar — pinned bottom */}
      <div className="flex-shrink-0 px-4 md:px-6 pb-4 md:pb-5 pt-2">
        <div className="mx-auto max-w-[720px]">
          <div
            className="rounded-xl overflow-hidden transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.65)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(0,0,0,0.04)",
              boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
            }}
          >
            {/* Dropping thumbnails */}
            <AnimatePresence>
              {inputAssets.length > 0 && phase === "dropping" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2 p-3 pb-1 overflow-x-auto">
                    {inputAssets.map((asset) => (
                      <motion.div
                        key={asset.id}
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="flex-shrink-0"
                      >
                        <div className="relative h-[48px] w-[68px] rounded-lg overflow-hidden ring-1 ring-navy/[0.06]">
                          <Image src={asset.url} alt={asset.name} fill className="object-cover" unoptimized />
                          {asset.type === "video" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-navy/20">
                              <Play className="h-2.5 w-2.5 text-white ml-[1px]" fill="currentColor" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2 px-4 py-3">
              <ImageIcon className="h-4 w-4 text-navy/15 flex-shrink-0" />
              <span className="flex-1 text-sm text-navy/25 select-none">Drop images, videos, or describe your vision...</span>
            </div>

            <div className="flex items-center justify-between px-3 pb-2.5 -mt-1">
              <div className="flex items-center gap-1">
                <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-navy/35 hover:text-navy/50 hover:bg-navy/[0.04] cursor-pointer transition-colors">
                  <Paperclip className="h-3.5 w-3.5" />Attach
                </button>
                <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-navy/35 hover:text-navy/50 hover:bg-navy/[0.04] cursor-pointer transition-colors">
                  <Wand2 className="h-3.5 w-3.5" />Storyboard
                </button>
              </div>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy/[0.07] text-navy/40 hover:bg-navy/[0.12] hover:text-navy/55 cursor-pointer transition-colors">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <p className="mt-2 text-center text-[10px] text-navy/12 select-none">ycjgt uses AI to generate content. Results may vary.</p>
        </div>
      </div>
    </div>
  );
}
