import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { motion, MotionConfig, animate, useInView, useReducedMotion } from "framer-motion";
import {
  Mail, Phone, ExternalLink, Link, GitFork,
  ChevronDown, Zap, Brain, TrendingUp, Layers, Star,
  Globe, Award, Users, BarChart3, Target, Cpu,
  Home, UserCircle, Briefcase, FolderOpen
} from "lucide-react";
import ajayPhoto from "@/imports/Screenshot_2026-08-26_034116-2.png";
import { Reveal } from "./Reveal";
const Metrics = lazy(() => import("./Charts").then((m) => ({ default: m.Metrics })));
const ImpactDashboard = lazy(() => import("./Charts").then((m) => ({ default: m.ImpactDashboard })));
import djLogo from "@/imports/Designjoom-logo-1.png";

import { lazy, Suspense } from "react";
import { P, ROLES, CRAWL_ITEMS, GROWTH_DATA, PROJECT_IMPACT, SKILLS_RADAR, FUNNEL_DATA, EXPERIENCE, PROJECTS, SKILLS_AI, SKILLS_GROWTH, SKILLS_UX, SKILLS_TOOLS } from "./data";


// ─── Neural Canvas ────────────────────────────────────────────────────────────

function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const PALETTE_RGB = [[59,130,246],[124,58,237],[6,182,212],[99,102,241],[139,92,246]];
    interface Node { x: number; y: number; vx: number; vy: number; r: number; pulse: number; ci: number; }
    const nodes: Node[] = Array.from({ length: 90 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.8,
      pulse: Math.random() * Math.PI * 2,
      ci: i % PALETTE_RGB.length,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        n.pulse += 0.022;
        const dx = mx - n.x, dy = my - n.y, dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 300 && dist > 0) { n.vx += (dx/dist)*0.028; n.vy += (dy/dist)*0.028; }
        n.vx *= 0.96; n.vy *= 0.96;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 155) {
            const a = (1 - d/155) * 0.25;
            const ci = PALETTE_RGB[nodes[i].ci], cj = PALETTE_RGB[nodes[j].ci];
            const g = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            g.addColorStop(0, `rgba(${ci[0]},${ci[1]},${ci[2]},${a})`);
            g.addColorStop(1, `rgba(${cj[0]},${cj[1]},${cj[2]},${a})`);
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = g; ctx.lineWidth = 0.6; ctx.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        const pulse = Math.sin(n.pulse) * 0.5 + 0.5;
        const c = PALETTE_RGB[n.ci];
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (1 + pulse * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${0.65 + pulse * 0.35})`;
        ctx.fill();
        const g2 = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 9);
        g2.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},0.1)`);
        g2.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 9, 0, Math.PI * 2);
        ctx.fillStyle = g2; ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    window.addEventListener("mousemove", onMouse);
    // ponytail: pause the O(n²) loop when the hero canvas is off-screen
    const vis = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!animRef.current) draw(); }
      else { cancelAnimationFrame(animRef.current); animRef.current = 0; }
    });
    vis.observe(canvas);
    draw();
    return () => { cancelAnimationFrame(animRef.current); animRef.current = 0; vis.disconnect(); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMouse); };
  }, []);

  return <canvas ref={canvasRef} id="neural-canvas" />;
}

// ─── Typewriter ───────────────────────────────────────────────────────────────

function Typewriter({ words }: { words: string[] }) {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    if (reduce) { setText(words[0]); return; }
    const current = words[idx];
    const timer = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) setTimeout(() => setDeleting(true), 1800);
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length === 0) { setDeleting(false); setIdx((i) => (i + 1) % words.length); }
      }
    }, deleting ? 38 : 75);
    return () => clearTimeout(timer);
  }, [text, deleting, idx, words, reduce]);
  return (
    <span style={{ fontFamily: "'Sora', sans-serif" }} aria-live="polite">
      <span className="text-shimmer">{text}</span>
      {!reduce && <span style={{ animation: "blink 1s step-end infinite", color: P.blue, fontStyle: "normal" }}>|</span>}
    </span>
  );
}

// ─── Counter ──────────────────────────────────────────────────────────────────

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-[transform,box-shadow,background-color,border-color,padding] duration-500"
      style={{ background: scrolled ? "rgba(5,8,16,0.92)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(59,130,246,0.1)" : "none", padding: scrolled ? "12px 0" : "20px 0" }}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a href="https://designjoom.com" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src={djLogo} alt="DesignJoom" width={120} height={28} style={{ height: 28, filter: "invert(1) sepia(1) saturate(6) hue-rotate(195deg) brightness(1.4)", opacity: 1, transition: "opacity 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "1"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.9"; }} />
        </a>
        <div className="hidden md:flex items-center gap-8">
          {["About","Metrics","Experience","Projects","Skills","Contact"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>
          ))}
        </div>
        <a href="mailto:ajayspi@gmail.com"
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full transition-[transform,box-shadow,background-color,border-color] duration-300"
          style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", color: P.blue, fontFamily: "'JetBrains Mono',monospace", fontSize: "0.78rem" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(59,130,246,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(59,130,246,0.1)"; }}>
          <Zap size={12} /> Hire Me
        </a>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 70%)" }}>
      <NeuralCanvas />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="orbit-ring" style={{ width: 620, height: 620, borderColor: "rgba(59,130,246,0.05)", animationDuration: "44s" }} />
        <div className="orbit-ring absolute" style={{ width: 400, height: 400, borderColor: "rgba(124,58,237,0.07)", animationDuration: "28s", animationDirection: "reverse" }} />
        <div className="orbit-ring absolute" style={{ width: 230, height: 230, borderColor: "rgba(6,182,212,0.09)", animationDuration: "16s" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center pt-24 pb-12">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
            style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem", color: "#6b9fef", letterSpacing: "0.1em" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: P.blue, display: "inline-block", animation: "glow-pulse 2s ease-in-out infinite" }} />
            AI GROWTH &amp; DIGITAL TRANSFORMATION LEADER
          </div>

          <h1 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "clamp(2.8rem,6vw,5rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            <span style={{ color: "#f0f4ff" }}>Av. Ajay</span><br />
            <span className="text-shimmer">Kiran</span>
          </h1>

          <div className="mt-4 h-10 flex items-center" style={{ fontSize: "clamp(1rem,2.5vw,1.4rem)", fontWeight: 600 }}>
            <Typewriter words={ROLES} />
          </div>


          <div className="flex flex-wrap gap-3 mt-8">
            <a href="#contact" className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-[transform,box-shadow,background-color,border-color] duration-300"
              style={{ background: "linear-gradient(135deg,#3b82f6,#7c3aed)", color: "#fff", fontFamily: "'Sora',sans-serif" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(59,130,246,0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
              <Mail size={14} /> Get in Touch
            </a>
            <a href="#projects" className="flex items-center gap-2 px-6 py-3 rounded-full text-sm transition-[transform,box-shadow,background-color,border-color] duration-300"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#a8b8d8", fontFamily: "'Sora',sans-serif", fontWeight: 600 }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)"; e.currentTarget.style.color = "#f0f4ff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#a8b8d8"; }}>
              <Layers size={14} /> View Projects
            </a>
          </div>

          <div className="flex items-center gap-5 mt-8">
            {[
              { icon: Link, href: "https://www.linkedin.com/in/aigrowthandautomationleader/", label: "LinkedIn" },
              { icon: GitFork, href: "https://github.com/ajayspi", label: "GitHub" },
              { icon: Globe, href: "https://designjoom.com", label: "Website" },
            ].map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" title={label}
                className="transition-[transform,box-shadow,background-color,border-color,color] duration-200" style={{ color: "#6b7fa8" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = P.blue; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#6b7fa8"; (e.currentTarget as HTMLElement).style.transform = ""; }}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Right — photo + certs */}
        <div className="flex flex-col items-center md:items-end gap-5">
          <div style={{ animation: "float 6s ease-in-out infinite", position: "relative" }}>
            <div style={{ position: "absolute", inset: -30, background: "radial-gradient(circle,rgba(59,130,246,0.18) 0%,rgba(124,58,237,0.1) 50%,transparent 70%)", filter: "blur(36px)" }} />
            <div style={{ position: "relative", width: 260, height: 320, borderRadius: 24, overflow: "hidden", border: "1.5px solid rgba(59,130,246,0.35)", boxShadow: "0 0 48px rgba(59,130,246,0.22),0 0 100px rgba(124,58,237,0.12)" }}>
              <img src={ajayPhoto} alt="Av. Ajay Kiran" width={260} height={320} fetchPriority="high"
                style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "auto", height: "110%", maxWidth: "none" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 16px 14px", background: "linear-gradient(to top,rgba(5,8,16,0.88) 60%,transparent)" }}>
                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#f0f4ff" }}>Av. Ajay Kiran</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.62rem", color: "#6b9fef", letterSpacing: "0.1em", marginTop: 2 }}>AI GROWTH LEADER</div>
              </div>
            </div>
            <div className="glass absolute -left-14 top-10 px-3 py-2 rounded-xl" style={{ border: "1px solid rgba(59,130,246,0.25)", fontSize: "0.7rem", fontFamily: "'JetBrains Mono',monospace", color: "#6b9fef" }}>
              <div style={{ fontWeight: 800, color: P.blue, fontSize: "1rem" }}>14+</div><div>Yrs Exp</div>
            </div>
            <div className="glass absolute -right-12 top-16 px-3 py-2 rounded-xl" style={{ border: "1px solid rgba(124,58,237,0.25)", fontSize: "0.7rem", fontFamily: "'JetBrains Mono',monospace", color: "#a78bfa" }}>
              <div style={{ fontWeight: 800, color: P.violet, fontSize: "1rem" }}>AI</div><div>Architect</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 260 }}>
            {[
              { label: "HFI Certified User Experience Analyst (CXA)", org: "Human Factors International", color: P.amber, dot: P.amber },
              { label: "Generative AI Mastermind", org: "Outskill", color: P.violet, dot: P.violet },
              { label: "Digital Marketing", org: "Google Digital Garage", color: P.green, dot: P.green },
            ].map((c) => (
              <div key={c.label} className="glass" style={{ borderRadius: 12, padding: "9px 12px", border: `1px solid ${c.color}22`, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: c.dot, flexShrink: 0, boxShadow: `0 0 6px ${c.dot}` }} />
                <div>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: "0.7rem", color: "#d8e4ff", lineHeight: 1.35 }}>{c.label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.58rem", color: "#4a5a78", marginTop: 2 }}>{c.org}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{ color: "#6b7fa8", animation: "float 2s ease-in-out infinite" }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", letterSpacing: "0.15em" }}>SCROLL</span>
        <ChevronDown size={14} />
      </div>
    </section>
  );
}

// ─── Crawl ────────────────────────────────────────────────────────────────────

function CrawlStrip() {
  const items = [...CRAWL_ITEMS, ...CRAWL_ITEMS];
  return (
    <div style={{ borderTop: "1px solid rgba(59,130,246,0.12)", borderBottom: "1px solid rgba(59,130,246,0.12)", background: "rgba(5,8,16,0.8)", overflow: "hidden", padding: "14px 0" }}>
      {/* ponytail: decorative duplicate loop — hidden from assistive tech; MotionConfig stops it under reduced motion */}
      <motion.div className="marquee-track" aria-hidden="true"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}>
        {items.map((item, i) => (
          <span key={i} style={{ padding: "0 24px", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.72rem", letterSpacing: "0.15em", color: item === "·" ? P.blue : "#6b7fa8", fontWeight: item === "·" ? 700 : 400 }}>{item}</span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function About() {
  const framework = [
    { step: "THINK", color: P.blue,   icon: Brain,      desc: "Research, strategy, user insights" },
    { step: "DESIGN", color: P.violet, icon: Layers,    desc: "UX, IA, wireframes, systems" },
    { step: "BUILD", color: P.cyan,   icon: Cpu,        desc: "AI workflows, automation, tech" },
    { step: "GROW",  color: P.green,  icon: TrendingUp, desc: "SEO, acquisition, performance" },
  ];
  return (
    <section id="about" style={{ padding: "100px 0" }}>
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <Reveal x={-48}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.72rem", color: P.blue, letterSpacing: "0.2em", marginBottom: 12 }}>ABOUT</div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: "#f0f4ff", lineHeight: 1.1 }}>
            AI + Growth + UX<br /><span className="text-shimmer">+ Digital Transformation</span>
          </h2>
          <p style={{ marginTop: 20, color: "#6b7fa8", lineHeight: 1.8, fontSize: "0.95rem" }}>
            Combining business strategy, UX, technology and measurable growth — with hands-on experience building AI-powered products and automation workflows. Experienced in leading multidisciplinary teams and developing digital ecosystems across international markets.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["India","Germany","Qatar","Singapore","USA","Australia"].map((c) => (
              <span key={c} className="tag">{c}</span>
            ))}
          </div>
          <div className="mt-8 p-4 rounded-xl" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.68rem", color: P.blue, letterSpacing: "0.15em", marginBottom: 8 }}>PROFESSIONAL POSITIONING</div>
            <p style={{ fontSize: "0.85rem", color: "#a8b8d8", lineHeight: 1.7 }}>
              AI + Growth + UX + Digital Transformation — building digital experiences, growth systems and AI-powered workflows that connect business strategy with measurable customer outcomes.
            </p>
          </div>
        </Reveal>
        <Reveal x={48}>
          <div className="grid grid-cols-2 gap-3">
            {framework.map(({ step, color, icon: Icon, desc }) => (
              <div key={step} className="glass-bright card-hover rounded-2xl p-5" style={{ border: `1px solid ${color}22` }}>
                <Icon size={22} style={{ color }} />
                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "1.1rem", color, marginTop: 10 }}>{step}</div>
                <div style={{ fontSize: "0.8rem", color: "#6b7fa8", marginTop: 4 }}>{desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 glass-bright rounded-2xl p-5 flex items-center gap-4" style={{ border: `1px solid ${P.green}20` }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Award size={18} style={{ color: P.green }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: P.green }}>HFI Certified UX Analyst (CXA)</div>
              <div style={{ fontSize: "0.78rem", color: "#6b7fa8" }}>Human Factors International · Jan 2026</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────

function Experience() {
  return (
    <section id="experience" style={{ padding: "100px 0", background: "rgba(5,8,20,0.5)" }}>
      <div className="max-w-4xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.72rem", color: P.blue, letterSpacing: "0.2em", marginBottom: 12 }}>EXPERIENCE</div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: "#f0f4ff" }}>Career <span className="text-shimmer">Timeline</span></h2>
        </Reveal>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 5, top: 0, bottom: 0, width: 1, background: `linear-gradient(to bottom,${P.blue},${P.violet},${P.cyan},${P.green})` }} />
          <div className="flex flex-col gap-10">
            {EXPERIENCE.map((exp, i) => (
              <Reveal key={i} className="flex gap-8" delay={i * 0.1}>
                <div style={{ paddingTop: 6, flexShrink: 0 }}>
                  <div className="timeline-dot" style={{ background: exp.color, boxShadow: `0 0 12px ${exp.color}` }} />
                </div>
                <div className="glass-bright rounded-2xl p-6 flex-1" style={{ border: `1px solid ${exp.color}20` }}>
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                    <div>
                      <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#f0f4ff" }}>{exp.role}</h3>
                      <div style={{ color: exp.color, fontSize: "0.85rem", fontWeight: 600, marginTop: 2 }}>{exp.company}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.72rem", color: "#6b7fa8" }}>{exp.period}</div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.68rem", color: "#4a5a78", marginTop: 2 }}>{exp.location}</div>
                    </div>
                  </div>
                  <ul style={{ paddingLeft: 0, listStyle: "none" }}>
                    {exp.bullets.map((b, j) => (
                      <li key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6, fontSize: "0.82rem", color: "#8898b8", lineHeight: 1.6 }}>
                        <span style={{ color: exp.color, flexShrink: 0, marginTop: 3 }}>›</span>{b}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function Projects() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section id="projects" style={{ padding: "100px 0" }}>
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.72rem", color: P.blue, letterSpacing: "0.2em", marginBottom: 12 }}>PROJECTS</div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: "#f0f4ff" }}>Work That<br /><span className="text-shimmer">Delivers Results</span></h2>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.map((p, i) => (
            <Reveal key={i} className="glass rounded-2xl p-6" delay={i * 0.07} hoverLift={6} hoverShadow={`0 24px 64px ${p.color}33`}
              style={{ border: active === i ? `1px solid ${p.color}55` : "1px solid rgba(59,130,246,0.1)", position: "relative", overflow: "hidden" }}
              onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${p.color},transparent)`, opacity: active === i ? 1 : 0, transition: "opacity 0.3s" }} />
              <div style={{ position: "absolute", top: -60, right: -60, width: 160, height: 160, borderRadius: "50%", background: p.color, opacity: active === i ? 0.07 : 0.02, filter: "blur(40px)", transition: "opacity 0.4s" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "1.25rem", color: p.color }}>{p.name}</h3>
                  <div style={{ fontSize: "0.73rem", color: "#6b7fa8", marginTop: 2 }}>{p.subtitle}</div>
                </div>
                <a href={p.link} target="_blank" rel="noopener noreferrer" aria-label={`Open ${p.name} in a new tab`} style={{ color: "#6b7fa8", transition: "color 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = p.color; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#6b7fa8"; }}>
                  <ExternalLink size={15} />
                </a>
              </div>
              <p style={{ fontSize: "0.82rem", color: "#8898b8", lineHeight: 1.65, marginBottom: 14 }}>{p.description}</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {p.metrics.map((m, j) => (
                  <div key={j} style={{ padding: "5px 9px", borderRadius: 7, background: `${p.color}0d`, border: `1px solid ${p.color}22`, fontSize: "0.7rem", color: p.color, fontFamily: "'JetBrains Mono',monospace" }}>{m}</div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((t) => (<span key={t} className="tag" style={{ fontSize: "0.67rem" }}>{t}</span>))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────

function Skills() {
  const groups = [
    { title: "Artificial Intelligence", items: SKILLS_AI,    color: P.violet },
    { title: "Growth & Marketing",      items: SKILLS_GROWTH, color: P.blue },
    { title: "UX & Product",            items: SKILLS_UX,    color: P.cyan },
    { title: "Tools & Platforms",       items: SKILLS_TOOLS, color: P.green },
  ];
  const CERTS = [
    { title: "HFI Certified User Experience Analyst (CXA)", org: "Human Factors International · Jan 2026", color: P.amber },
    { title: "Generative AI Mastermind", org: "Outskill · 2025", color: P.violet },
    { title: "Digital Marketing", org: "Google Digital Garage · 2023", color: P.green },
  ];
  return (
    <section id="skills" style={{ padding: "100px 0", background: "rgba(5,8,20,0.4)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.72rem", color: P.blue, letterSpacing: "0.2em", marginBottom: 12 }}>SKILLS</div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: "#f0f4ff" }}>The Full <span className="text-shimmer">Stack</span></h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-6">
          {groups.map((g, i) => (
            <Reveal key={i} className="glass-bright rounded-2xl p-6" delay={i * 0.08} style={{ border: `1px solid ${g.color}18` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: g.color, boxShadow: `0 0 8px ${g.color}` }} />
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "0.95rem", color: g.color }}>{g.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {g.items.map((s) => (<span key={s} className="tag">{s}</span>))}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.68rem", color: P.blue, letterSpacing: "0.2em", marginBottom: 12 }}>CERTIFICATIONS</div>
          <div className="flex flex-wrap gap-4">
            {CERTS.map((c) => (
              <div key={c.title} className="glass-bright rounded-xl p-4 flex items-center gap-3" style={{ border: `1px solid ${c.color}22` }}>
                <Award size={16} style={{ color: c.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "#e8eeff" }}>{c.title}</div>
                  <div style={{ fontSize: "0.7rem", color: "#6b7fa8", fontFamily: "'JetBrains Mono',monospace" }}>{c.org}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  return (
    <section id="contact" style={{ padding: "120px 0", background: "radial-gradient(ellipse 80% 60% at 50% 100%,rgba(59,130,246,0.08) 0%,transparent 70%)" }}>
      <Reveal className="max-w-3xl mx-auto px-6 text-center">
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.72rem", color: P.blue, letterSpacing: "0.2em", marginBottom: 12 }}>CONTACT</div>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, color: "#f0f4ff", lineHeight: 1.1 }}>
          Let's Build Something<br /><span className="text-shimmer">Extraordinary</span>
        </h2>
        <p style={{ marginTop: 16, color: "#6b7fa8", fontSize: "0.95rem", lineHeight: 1.8 }}>
          Available for AI Growth, Digital Transformation and UX Strategy roles.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          {[
            { icon: Mail, label: "ajayspi@gmail.com", href: "mailto:ajayspi@gmail.com", color: P.blue },
            { icon: Phone, label: "+91 98853 69345", href: "tel:+919885369345", color: P.violet },
            { icon: Target, label: "Hyderabad · UAE", href: "https://maps.google.com/?q=Hyderabad,India", color: P.cyan },
          ].map(({ icon: Icon, label, href, color }) => (
            <a key={label} href={href} className="glass-bright flex items-center gap-3 px-6 py-4 rounded-2xl transition-[transform,box-shadow,background-color,border-color] duration-300"
              style={{ border: `1px solid ${color}22`, textDecoration: "none" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${color}55`; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${color}22`; (e.currentTarget as HTMLElement).style.transform = ""; }}>
              <Icon size={16} style={{ color }} />
              <span style={{ color: "#a8b8d8", fontSize: "0.85rem" }}>{label}</span>
            </a>
          ))}
        </div>
        {/* DesignJoom brand logo */}
        <div className="flex justify-center mt-8">
          <a href="https://designjoom.com" target="_blank" rel="noopener noreferrer"
            className="glass flex items-center gap-3 px-5 py-3 rounded-2xl transition-[transform,box-shadow,background-color,border-color] duration-300"
            style={{ border: "1px solid rgba(59,130,246,0.15)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.4)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.15)"; (e.currentTarget as HTMLElement).style.transform = ""; }}>
            <img src={djLogo} alt="DesignJoom" width={120} height={30} loading="lazy" style={{ height: 30, filter: "invert(1) sepia(1) saturate(6) hue-rotate(195deg) brightness(1.4)", opacity: 1 }} />
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", color: "#6b7fa8", letterSpacing: "0.1em" }}>designjoom.com</span>
          </a>
        </div>

        <div className="flex justify-center gap-4 mt-5">
          {[
            { label: "LinkedIn", href: "https://www.linkedin.com/in/aigrowthandautomationleader/", icon: Link },
            { label: "GitHub",   href: "https://github.com/ajayspi", icon: GitFork },
            { label: "Behance",  href: "https://www.behance.net/Designjoom", icon: Globe },
          ].map(({ label, href, icon: Icon }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full transition-[transform,box-shadow,background-color,border-color,color] duration-200"
              style={{ fontSize: "0.8rem", color: "#6b7fa8", fontFamily: "'JetBrains Mono',monospace", border: "1px solid rgba(255,255,255,0.06)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = P.blue; (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.3)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#6b7fa8"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}>
              <Icon size={13} /> {label}
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(59,130,246,0.1)", padding: "24px 0" }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-between items-center gap-4">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "1.1rem" }}><span className="text-shimmer">Av. Ajay Kiran</span></span>
          <span style={{ color: "#2a3450", fontSize: "0.8rem" }}>·</span>
          <a href="https://designjoom.com" target="_blank" rel="noopener noreferrer">
            <img src={djLogo} alt="DesignJoom" width={120} height={22} loading="lazy" style={{ height: 22, filter: "invert(1) sepia(1) saturate(5) hue-rotate(195deg) brightness(1.3)", opacity: 0.8, transition: "opacity 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.9"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.55"; }} />
          </a>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem", color: "#4a5a78" }}>AI GROWTH · DIGITAL TRANSFORMATION · UX · AUTOMATION</div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem", color: "#4a5a78" }}>© 2026 · Built with AI</div>
      </div>
    </footer>
  );
}

// ─── Side Nav ────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "hero",       label: "Home",       icon: Home },
  { id: "about",      label: "About",      icon: UserCircle },
  { id: "metrics",    label: "Metrics",    icon: BarChart3 },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects",   label: "Projects",   icon: FolderOpen },
  { id: "skills",     label: "Skills",     icon: Brain },
  { id: "contact",    label: "Contact",    icon: Mail },
];

function SideNav() {
  const [active, setActive] = useState("hero");
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <div
      style={{
        position: "fixed",
        right: 24,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 14,
      }}
    >
      {SECTIONS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        const isHov = hovered === id;
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            title={label}
            aria-label={`Go to ${label} section`}
            className="sidenav-btn"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* Label */}
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              color: isActive ? "#f0f4ff" : "#6b7fa8",
              opacity: isHov || isActive ? 1 : 0,
              transform: isHov || isActive ? "translateX(0)" : "translateX(8px)",
              transition: "opacity 0.25s ease, transform 0.25s ease",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}>
              {label}
            </span>

            {/* Icon button */}
            <span style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: isActive
                ? `rgba(59,130,246,0.18)`
                : isHov
                ? "rgba(255,255,255,0.07)"
                : "rgba(255,255,255,0.03)",
              border: isActive
                ? `1px solid rgba(59,130,246,0.5)`
                : `1px solid rgba(255,255,255,0.08)`,
              boxShadow: isActive ? `0 0 12px rgba(59,130,246,0.35), 0 0 24px rgba(59,130,246,0.15)` : "none",
              transition: "background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, color 0.25s ease",
              flexShrink: 0,
              color: isActive ? P.blue : isHov ? "#a8b8d8" : "#4a5a78",
            }}>
              <Icon size={14} strokeWidth={isActive ? 2.5 : 1.8} />
            </span>
          </button>
        );
      })}

      {/* Vertical line connector */}
      <div style={{
        position: "absolute",
        right: 4,
        top: 8,
        bottom: 8,
        width: 1,
        background: "linear-gradient(to bottom, transparent, rgba(59,130,246,0.2), transparent)",
        zIndex: -1,
        pointerEvents: "none",
      }} />
    </div>
  );
}

// ─── Cursor ───────────────────────────────────────────────────────────────────

function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  // ponytail: custom cursor is a fine-pointer enhancement only; touch/keyboard/reduced-motion users get the native cursor
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
    let rx = 0, ry = 0, ax = 0, ay = 0, raf = 0;
    const onMove = (e: MouseEvent) => { ax = e.clientX; ay = e.clientY; if (dot.current) { dot.current.style.left = ax + "px"; dot.current.style.top = ay + "px"; } };
    const tick = () => {
      rx += (ax - rx) * 0.13; ry += (ay - ry) * 0.13;
      if (ring.current) { ring.current.style.left = rx + "px"; ring.current.style.top = ry + "px"; }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); };
  }, []);
  if (!enabled) return null;
  return (<><div ref={dot} className="cursor" aria-hidden="true" /><div ref={ring} className="cursor-follower" aria-hidden="true" /></>);
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  useEffect(() => {
    // ponytail: smooth-scroll hijack only for users without a reduced-motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
    <div style={{ background: "var(--background)", minHeight: "100vh", overflowX: "hidden" }}>
      <Cursor />
      <SideNav />
      <Nav />
      <Hero />
      <CrawlStrip />
      <About />
      <Suspense fallback={<div style={{ minHeight: 480 }} />}>
        <Metrics />
      </Suspense>
      <Suspense fallback={<div style={{ minHeight: 700 }} />}>
        <ImpactDashboard />
      </Suspense>
      <Experience />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </div>
    </MotionConfig>
  );
}
