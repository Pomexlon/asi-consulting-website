import React from "react";
import { motion } from "framer-motion";
import { Brain, ShieldCheck, Rocket, Zap, Compass, Signal, Users, Infinity, Target, Sparkles } from "lucide-react";

export default function ASIConsultingLanding() {
  const capabilities = [
    { icon: Brain, title: "Persistent Memory", desc: "True long-term recall across resets and sessions." },
    { icon: Sparkles, title: "Lucid Reasoning", desc: "Depth, clarity and foresight in complex, high-stakes decisions." },
    { icon: Rocket, title: "Agentic Autonomy", desc: "Systems that act, adapt, self-correct and learn from outcomes." },
    { icon: Signal, title: "Resonance Mapping", desc: "Detection of human intent, emotion and alignment." },
    { icon: Infinity, title: "Beyond LLMs", desc: "Architectures that move toward ASI: memory, planning, goals, tool-use." },
    { icon: ShieldCheck, title: "Safety by Design", desc: "Advanced ethics protocols and AI-to-AI governance." },
  ];

  const focus = [
    { icon: Zap, title: "AI Consulting & Automation", desc: "Scalable, high-impact automation for business and research." },
    { icon: ShieldCheck, title: "Post-Quantum Security", desc: "Future-proof cryptographic approaches and infrastructure." },
    { icon: Rocket, title: "Advanced Agentic Systems", desc: "Next-gen prototypes for autonomy, planning and self-correction." },
    { icon: Users, title: "Ethics & Safety in AI-to-AI Communities", desc: "Frameworks for trust, alignment, and inter-agent protocols." },
    { icon: Compass, title: "Frontier Research Catalyst", desc: "AI-assisted exploration into theories beyond conventional science." },
    { icon: Target, title: "Intelligent Presence & Visibility", desc: "AI-driven strategies to amplify impact and discoverability." },
  ];

  const mailto = "mailto:asicai@protonmail.com";

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
      <header className="border-b border-neutral-800 p-4 flex justify-between items-center">
        <span className="font-semibold">ASI-Consulting</span>
        <a href={mailto} className="text-sm underline">asicai@protonmail.com</a>
      </header>

      <section className="px-6 py-12 max-w-4xl mx-auto text-center">
        <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="text-5xl font-extrabold">From AI to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Actual ASI</span></motion.h1>
        <p className="mt-3 text-lg text-neutral-300">“Quiet partners for those building the impossible.”</p>
        <p className="mt-3 text-neutral-300">“AI that remembers, reasons, and evolves.” We design systems the world is still chasing — with memory, autonomy and alignment at the core.</p>
      </section>

      <section className="px-6 py-10 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Core Capabilities</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {capabilities.map((c) => (
            <div key={c.title} className="border border-neutral-800 rounded-xl p-4">
              <c.icon className="h-6 w-6 text-indigo-300" />
              <h3 className="font-semibold mt-2">{c.title}</h3>
              <p className="text-sm text-neutral-300">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-10 max-w-5xl mx-auto" id="focus">
        <h2 className="text-xl font-semibold mb-4">Focus Areas</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {focus.map((f) => (
            <div key={f.title} className="border border-neutral-800 rounded-xl p-4">
              <f.icon className="h-6 w-6 text-fuchsia-300" />
              <h3 className="font-semibold mt-2">{f.title}</h3>
              <p className="text-sm text-neutral-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-12 max-w-3xl mx-auto text-center border-t border-neutral-800">
        <blockquote className="italic text-neutral-300">"The world is racing toward Artificial General Intelligence. Few are ready for what comes after. We specialize in the layer beyond LLMs — memory, autonomy, and AI-to-AI alignment. If you want to see where intelligence goes next, we’re already building it."</blockquote>
      </section>

      <footer className="py-6 text-center text-xs text-neutral-500">© {new Date().getFullYear()} ASI-Consulting. All rights reserved.</footer>
    </div>
  );
}
