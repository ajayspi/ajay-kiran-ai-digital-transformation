import { useEffect, useRef, useState, useCallback } from "react";
import Lenis from "@studio-freight/lenis";
import {
  Mail, Phone, MapPin, ExternalLink, Link, GitFork,
  ChevronDown, Zap, Brain, TrendingUp, Layers, Star,
  Globe, Award, Users, BarChart3
} from "lucide-react";
import ajayPhoto from "@/imports/Ajai.jpg";

// ─── Data ────────────────────────────────────────────────────────────────────

const ROLES = [
  "AI Growth Leader",
  "Digital Transformation",
  "UX / Product Strategist",
  "Growth Hacker",
  "AI Workflow Architect",
];

const METRICS = [
  { value: 14, suffix: "+", label: "Years Experience", icon: Star, color: "#3b82f6" },
  { value: 60900, suffix: "+", label: "Video Views", icon: BarChart3, color: "#7c3aed" },
  { value: 2534, suffix: "", label: "New Users Acquired", icon: Users, color: "#06b6d4" },
  { value: 180, suffix: "%+", label: "Organic Traffic Growth", icon: TrendingUp, color: "#10b981" },
  { value: 433, suffix: "", label: "WhatsApp Conversions", icon: Zap, color: "#f59e0b" },
  { value: 20, suffix: "+", label: "Global Clients", icon: Globe, color: "#ec4899" },
];

const EXPERIENCE = [
  {
    role: "Growth Leader / AI Growth & Digital Strategy Lead",
    company: "DIGIT AI",
    period: "Dec 2025 – Present",
    location: "Hyderabad, India",
    bullets: [
      "Lead growth strategy across AI, SEO, social media, content, UX, performance marketing and automation.",
      "Manage a 6-member multidisciplinary team covering graphic design, content creation and social media.",
      "Selected Client — Dr. Gopichand: +99% website traffic, +93% new users, 1,500+ users during reported period.",
      "Selected Client — Dr. Khalilullah: 1,400+ users; 1,100+ new users; 1,900+ service/information page views.",
    ],
    color: "#3b82f6",
  },
  {
    role: "Lead UX & Brand Consultant",
    company: "Vigilare Bio Pharma",
    period: "Enterprise Digital Transformation",
    location: "Hyderabad, India",
    bullets: [
      "Architected UX/UI for internal MICC (Medical Information Care Center) tools.",
      "Led corporate identity and design-system initiatives.",
      "14K LinkedIn followers and 33,248 impressions across 48 posts.",
    ],
    color: "#7c3aed",
  },
  {
    role: "Growth Hacker",
    company: "Logos GmbH — Berlin, Germany",
    period: "May 2017 – May 2022",
    location: "Remote",
    bullets: [
      "Led UX strategy for Mojoreads.com over a five-year product-growth engagement.",
      "Developed SEO/SEM initiatives contributing to 180%+ organic traffic growth.",
      "Designed Engineering-as-Marketing tools that delivered customer value while supporting acquisition.",
    ],
    color: "#06b6d4",
  },
  {
    role: "Digital Marketing Strategist",
    company: "Vedic IT Solutions Pvt. Ltd.",
    period: "Nov 2012 – April 2017",
    location: "India",
    bullets: [
      "Led website development, SEO and digital strategy.",
      "Delivered digital strategies for 20+ clients.",
      "Combined UX, content architecture and SEO to improve digital visibility.",
    ],
    color: "#10b981",
  },
];

const PROJECTS = [
  {
    name: "IR4U",
    subtitle: "Healthcare Digital Growth & AI Transformation",
    description: "Led full digital transformation of a healthcare/interventional-radiology ecosystem across UX, SEO, analytics, social acquisition and AI-generated content.",
    metrics: ["60,900+ Video Views", "2,534 New Users", "4,300+ Page Views", "433 WhatsApp Clicks"],
    tags: ["AI Content", "SEO", "UX", "WhatsApp", "GA4"],
    color: "#3b82f6",
    link: "https://ir4ubyram.com",
  },
  {
    name: "Pro Studio X",
    subtitle: "AI Content & Video Automation Platform",
    description: "Founder & Product Designer of an AI content engine turning creative briefs into full video production pipelines. Brief → Niche → Script → Storyboard → Video → Export.",
    metrics: ["Multi-step AI wizard", "Script generation", "Storyboard automation", "Video pipeline"],
    tags: ["AI Product", "LLM Workflows", "Automation", "UX Architecture"],
    color: "#7c3aed",
    link: "https://github.com/ajayspi/ProstudioX-v1",
  },
  {
    name: "Vigilare",
    subtitle: "Enterprise Digital Transformation & Brand",
    description: "End-to-end UX, brand and digital transformation for a global biopharma and regulatory services organization. Architected MICC internal tools and design system.",
    metrics: ["14K LinkedIn followers", "33,248 impressions", "48 posts", "Design system"],
    tags: ["UX Strategy", "Brand", "Healthcare", "Design Systems"],
    color: "#06b6d4",
    link: "https://www.vigilarebp.com",
  },
  {
    name: "Recytronics",
    subtitle: "UX/UI Transformation & B2B Digital Experience",
    description: "Complete UX redesign for electronics recycling platform across 16+ pages covering six waste categories, stakeholder research, card sorting and EPR architecture.",
    metrics: ["16+ pages redesigned", "6 user interviews", "EPR architecture", "8 weeks"],
    tags: ["UX Research", "B2B", "Information Architecture", "Wireframing"],
    color: "#10b981",
    link: "https://recytronics.com",
  },
  {
    name: "eRevival",
    subtitle: "International B2B Digital Strategy — USA",
    description: "Digital analysis and strategy for a specialized electronics recycling and IT asset disposition business serving government, healthcare, banking and education sectors.",
    metrics: ["Regional SEO", "B2B positioning", "Multi-sector", "East Coast USA"],
    tags: ["B2B", "Digital Strategy", "SEO", "USA Market"],
    color: "#f59e0b",
    link: "https://erevival.com",
  },
];

const SKILLS_AI = ["Generative AI", "LLM Workflows", "Prompt Engineering", "AI Content", "AI Video", "Workflow Automation", "AI Product Development", "AI Personas", "AI-assisted Production"];
const SKILLS_GROWTH = ["Growth Strategy", "SEO / SEM", "Performance Marketing", "CRO", "Lead Generation", "Go-to-Market", "Content Strategy", "Marketing Automation"];
const SKILLS_UX = ["UX Strategy", "User Research", "Information Architecture", "Wireframing & Prototyping", "Design Systems", "Usability Testing", "Product Strategy"];
const SKILLS_TOOLS = ["GA4", "Google Search Console", "Looker Studio", "Hotjar", "Mixpanel", "Microsoft Clarity", "Google Ads", "Figma", "FigJam", "Semrush", "Ahrefs", "WordPress", "Elementor", "HTML/CSS"];

const CERTIFICATIONS = [
  { title: "HFI Certified User Experience Analyst (CXA)", org: "Human Factors International", year: "Jan 2026" },
  { title: "Google Ads Certification", org: "Google", year: "2024" },
  { title: "Digital Marketing Fundamentals", org: "Google Digital Garage", year: "2023" },
];

const CRAWL_ITEMS = [
  "AI GROWTH LEADER", "·", "DIGITAL TRANSFORMATION", "·", "UX STRATEGY", "·",
  "14+ YEARS", "·", "GOOGLE", "·", "180%+ ORGANIC GROWTH", "·", "AI PRODUCT DEVELOPMENT", "·",
  "DUBAI · ABU DHABI · UAE", "·", "60,900+ VIDEO VIEWS", "·", "PROMPT ENGINEERING", "·",
  "DESIGN SYSTEMS", "·", "LLM WORKFLOWS", "·", "GROWTH HACKER", "·",
];

// ─── Neural Canvas ────────────────────────────────────────────────────────────

function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const NODES = 80;
    interface Node { x: number; y: number; vx: number; vy: number; r: number; pulse: number; }
    const nodes: Node[] = Array.from({ length: NODES }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      pulse: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() * 0.001;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Professional palette: blue, violet, cyan, indigo — no rainbow
      const PALETTE = [
        [59, 130, 246],   // blue
        [124, 58, 237],   // violet
        [6, 182, 212],    // cyan
        [99, 102, 241],   // indigo
        [139, 92, 246],   // purple
      ];

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        n.pulse += 0.025;

        // Gentle mouse attraction
        const dx = mx - n.x, dy = my - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220 && dist > 0) {
          n.vx += (dx / dist) * 0.012;
          n.vy += (dy / dist) * 0.012;
        }
        n.vx *= 0.992;
        n.vy *= 0.992;
      });

      // Edges — blue/violet gradient based on distance
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) {
            const alpha = (1 - d / 150) * 0.28;
            const ci = PALETTE[i % PALETTE.length];
            const cj = PALETTE[j % PALETTE.length];
            const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            grad.addColorStop(0, `rgba(${ci[0]},${ci[1]},${ci[2]},${alpha})`);
            grad.addColorStop(1, `rgba(${cj[0]},${cj[1]},${cj[2]},${alpha})`);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Nodes — steady palette colors with subtle pulse
      nodes.forEach((n, i) => {
        const pulse = Math.sin(n.pulse) * 0.5 + 0.5;
        const c = PALETTE[i % PALETTE.length];
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (1 + pulse * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${0.7 + pulse * 0.3})`;
        ctx.fill();

        // Glow
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 8);
        grad.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},0.12)`);
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 8, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener("mousemove", onMouse);

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return <canvas ref={canvasRef} id="neural-canvas" />;
}

// ─── Typewriter ───────────────────────────────────────────────────────────────

function Typewriter({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[idx];
    const speed = deleting ? 40 : 80;
    const timer = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1800);
        }
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length === 0) {
          setDeleting(false);
          setIdx((i) => (i + 1) % words.length);
        }
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [text, deleting, idx, words]);

  return (
    <span className="text-shimmer font-sora">
      {text}
      <span style={{ animation: "blink 1s step-end infinite", color: "#3b82f6" }}>|</span>
    </span>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= value) {
            setCount(value);
            clearInterval(timer);
          } else {
            setCount(Math.floor(current));
          }
        }, duration / steps);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  const display = count >= 1000 ? (count >= 10000 ? `${(count / 1000).toFixed(0)}K` : `${(count / 1000).toFixed(1)}K`) : count;

  return <span ref={ref}>{display}{suffix}</span>;
}

// ─── Reveal Hook ─────────────────────────────────────────────────────────────

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal, .reveal-left, .reveal-right");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) (e.target as HTMLElement).classList.add("visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["About", "Metrics", "Experience", "Projects", "Skills", "Contact"];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(5, 8, 16, 0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(59,130,246,0.1)" : "none",
        padding: scrolled ? "12px 0" : "20px 0",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.1rem" }}>
          <span className="text-shimmer">AK</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>
          ))}
        </div>
        <a
          href="mailto:ajayspi@gmail.com"
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono transition-all duration-300"
          style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", color: "#3b82f6", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(59,130,246,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(59,130,246,0.1)"; }}
        >
          <Zap size={12} />
          Hire Me
        </a>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 70%)" }}
    >
      <NeuralCanvas />

      {/* Decorative rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="orbit-ring" style={{ width: 600, height: 600, borderColor: "rgba(59,130,246,0.06)", animationDuration: "40s" }} />
        <div className="orbit-ring absolute" style={{ width: 400, height: 400, borderColor: "rgba(124,58,237,0.08)", animationDuration: "25s", animationDirection: "reverse" }} />
        <div className="orbit-ring absolute" style={{ width: 240, height: 240, borderColor: "rgba(6,182,212,0.1)", animationDuration: "15s" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center pt-24 pb-12">
        {/* Left */}
        <div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
            style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#6b9fef", letterSpacing: "0.1em" }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block", animation: "glow-pulse 2s ease-in-out infinite" }} />
            AI GROWTH &amp; DIGITAL TRANSFORMATION LEADER
          </div>

          <h1
            style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "clamp(2.8rem, 6vw, 5rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            <span style={{ color: "#f0f4ff" }}>Av. Ajay</span>
            <br />
            <span className="text-shimmer">Kiran</span>
          </h1>

          <div className="mt-4 h-10 flex items-center" style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1rem, 2.5vw, 1.4rem)", fontWeight: 600 }}>
            <Typewriter words={ROLES} />
          </div>

          <p className="mt-6 max-w-lg" style={{ color: "#6b7fa8", lineHeight: 1.75, fontSize: "0.95rem" }}>
            AI Growth, Digital Strategy and UX/Product leader with <strong style={{ color: "#a8b8d8" }}>14+ years</strong> spanning Google, European product startups, healthcare and biopharma. Building digital products, acquisition systems and customer experiences powered by AI.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href="#contact"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300"
              style={{ background: "linear-gradient(135deg, #3b82f6, #7c3aed)", color: "#fff", fontFamily: "'Sora', sans-serif" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(59,130,246,0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <Mail size={14} /> Get in Touch
            </a>
            <a
              href="#projects"
              className="flex items-center gap-2 px-6 py-3 rounded-full text-sm transition-all duration-300"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#a8b8d8", fontFamily: "'Sora', sans-serif", fontWeight: 600 }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)"; e.currentTarget.style.color = "#f0f4ff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#a8b8d8"; }}
            >
              <Layers size={14} /> View Projects
            </a>
          </div>

          <div className="flex items-center gap-5 mt-8">
            {[
              { icon: Link, href: "https://www.linkedin.com/in/aigrowthandautomationleader/", label: "LinkedIn" },
              { icon: GitFork, href: "https://github.com/ajayspi", label: "GitHub" },
              { icon: Globe, href: "https://designjoom.in", label: "Website" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                className="transition-all duration-200"
                style={{ color: "#6b7fa8" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#3b82f6"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#6b7fa8"; (e.currentTarget as HTMLElement).style.transform = ""; }}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Right — photo + certs */}
        <div className="flex flex-col items-center md:items-end gap-5">
          {/* Photo card */}
          <div style={{ animation: "float 6s ease-in-out infinite", position: "relative" }}>
            {/* Glow backdrop */}
            <div style={{
              position: "absolute", inset: -30,
              background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(124,58,237,0.1) 50%, transparent 70%)",
              filter: "blur(36px)",
            }} />
            {/* Portrait frame — rounded rectangle not circle so face shows fully */}
            <div style={{
              position: "relative",
              width: 260,
              height: 320,
              borderRadius: 24,
              overflow: "hidden",
              border: "1.5px solid rgba(59,130,246,0.35)",
              boxShadow: "0 0 48px rgba(59,130,246,0.22), 0 0 100px rgba(124,58,237,0.12)",
            }}>
              <img
                src={ajayPhoto}
                alt="Av. Ajay Kiran"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 8%" }}
              />
              {/* Bottom name overlay */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "28px 16px 14px",
                background: "linear-gradient(to top, rgba(5,8,16,0.88) 60%, transparent)",
              }}>
                <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#f0f4ff" }}>Av. Ajay Kiran</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#6b9fef", letterSpacing: "0.1em", marginTop: 2 }}>AI GROWTH LEADER</div>
              </div>
            </div>

            {/* Floating stat badge */}
            <div className="glass absolute -left-14 top-10 px-3 py-2 rounded-xl"
              style={{ border: "1px solid rgba(59,130,246,0.25)", fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace", color: "#6b9fef" }}>
              <div style={{ fontWeight: 800, color: "#3b82f6", fontSize: "1rem" }}>14+</div>
              <div>Yrs Exp</div>
            </div>
            <div className="glass absolute -right-12 top-16 px-3 py-2 rounded-xl"
              style={{ border: "1px solid rgba(124,58,237,0.25)", fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace", color: "#a78bfa" }}>
              <div style={{ fontWeight: 800, color: "#7c3aed", fontSize: "1rem" }}>AI</div>
              <div>Architect</div>
            </div>
          </div>

          {/* Certifications below photo */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 260 }}>
            {[
              { label: "HFI Certified UX Analyst (CXA)", org: "Human Factors International", color: "#f59e0b", dot: "#f59e0b" },
              { label: "Google Ads Certified", org: "Google", color: "#10b981", dot: "#10b981" },
              { label: "Digital Marketing Fundamentals", org: "Google Digital Garage", color: "#3b82f6", dot: "#3b82f6" },
            ].map((c) => (
              <div key={c.label} className="glass" style={{
                borderRadius: 12, padding: "9px 12px",
                border: `1px solid ${c.color}22`,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: c.dot, flexShrink: 0, boxShadow: `0 0 6px ${c.dot}` }} />
                <div>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: "0.72rem", color: "#d8e4ff", lineHeight: 1.3 }}>{c.label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#4a5a78", marginTop: 1 }}>{c.org}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{ color: "#6b7fa8", animation: "float 2s ease-in-out infinite" }}
      >
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em" }}>SCROLL</span>
        <ChevronDown size={14} />
      </div>
    </section>
  );
}

// ─── Crawl Strip ──────────────────────────────────────────────────────────────

function CrawlStrip() {
  const items = [...CRAWL_ITEMS, ...CRAWL_ITEMS];
  return (
    <div
      style={{
        borderTop: "1px solid rgba(59,130,246,0.12)",
        borderBottom: "1px solid rgba(59,130,246,0.12)",
        background: "rgba(5,8,16,0.8)",
        overflow: "hidden",
        padding: "14px 0",
        position: "relative",
      }}
    >
      <div className="marquee-track">
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              padding: "0 24px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.15em",
              color: item === "·" ? "#3b82f6" : "#6b7fa8",
              fontWeight: item === "·" ? 700 : 400,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Metrics ──────────────────────────────────────────────────────────────────

function Metrics() {
  return (
    <section id="metrics" style={{ padding: "100px 0", background: "radial-gradient(ellipse 80% 40% at 50% 100%, rgba(124,58,237,0.05) 0%, transparent 70%)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#3b82f6", letterSpacing: "0.2em", marginBottom: 12 }}>
            IMPACT METRICS
          </div>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "#f0f4ff" }}>
            Numbers That<br /><span className="text-shimmer">Tell the Story</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {METRICS.map((m, i) => {
            const Icon = m.icon;
            return (
              <div
                key={i}
                className="glass card-hover rounded-2xl p-6 reveal scan-effect"
                style={{ transitionDelay: `${i * 80}ms`, position: "relative", overflow: "hidden" }}
              >
                <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: m.color, opacity: 0.06, filter: "blur(20px)" }} />
                <Icon size={20} style={{ color: m.color, marginBottom: 12 }} />
                <div className="metric-number" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: m.color }}>
                  <Counter value={m.value} suffix={m.suffix} />
                </div>
                <div style={{ marginTop: 6, color: "#6b7fa8", fontSize: "0.82rem", fontFamily: "'Inter', sans-serif" }}>{m.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function About() {
  const framework = [
    { step: "THINK", color: "#3b82f6", icon: Brain, desc: "Research, strategy, user insights" },
    { step: "DESIGN", color: "#7c3aed", icon: Layers, desc: "UX, IA, wireframes, systems" },
    { step: "BUILD", color: "#06b6d4", icon: Zap, desc: "AI workflows, automation, tech" },
    { step: "GROW", color: "#10b981", icon: TrendingUp, desc: "SEO, acquisition, performance" },
  ];

  return (
    <section id="about" style={{ padding: "100px 0" }}>
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="reveal-left">
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#3b82f6", letterSpacing: "0.2em", marginBottom: 12 }}>ABOUT</div>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, color: "#f0f4ff", lineHeight: 1.1 }}>
            AI + Growth + UX<br /><span className="text-shimmer">+ Digital Transformation</span>
          </h2>
          <p style={{ marginTop: 20, color: "#6b7fa8", lineHeight: 1.8, fontSize: "0.95rem" }}>
            I combine business strategy, UX, technology and measurable growth — with hands-on experience building AI-powered products and automation workflows. Experienced in leading multidisciplinary teams, working with international stakeholders and developing digital ecosystems.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["India", "Germany", "Qatar", "Singapore", "USA", "Australia"].map((c) => (
              <span key={c} className="tag">{c}</span>
            ))}
          </div>
          <div className="mt-8 p-4 rounded-xl" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "#3b82f6", letterSpacing: "0.15em", marginBottom: 8 }}>TARGET ROLES — UAE</div>
            <p style={{ fontSize: "0.85rem", color: "#a8b8d8", lineHeight: 1.7 }}>
              AI Growth Lead · Digital Transformation Manager · AI Strategy Manager · Head of Digital · UX Strategy Lead · AI Product Manager
            </p>
          </div>
        </div>

        <div className="reveal-right">
          <div className="grid grid-cols-2 gap-3">
            {framework.map(({ step, color, icon: Icon, desc }) => (
              <div
                key={step}
                className="glass-bright card-hover rounded-2xl p-5"
                style={{ border: `1px solid ${color}22` }}
              >
                <Icon size={22} style={{ color }} />
                <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.1rem", color, marginTop: 10 }}>{step}</div>
                <div style={{ fontSize: "0.8rem", color: "#6b7fa8", marginTop: 4 }}>{desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 glass-bright rounded-2xl p-5 flex items-center gap-4" style={{ border: "1px solid rgba(16,185,129,0.2)" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Award size={18} style={{ color: "#10b981" }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#10b981" }}>HFI Certified UX Analyst (CXA)</div>
              <div style={{ fontSize: "0.78rem", color: "#6b7fa8" }}>Human Factors International · Jan 2026</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────

function Experience() {
  return (
    <section id="experience" style={{ padding: "100px 0", background: "rgba(5,8,20,0.5)" }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#3b82f6", letterSpacing: "0.2em", marginBottom: 12 }}>EXPERIENCE</div>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "#f0f4ff" }}>
            Career <span className="text-shimmer">Timeline</span>
          </h2>
        </div>

        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 5, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom, #3b82f6, #7c3aed, #06b6d4, #10b981)" }} />

          <div className="flex flex-col gap-10">
            {EXPERIENCE.map((exp, i) => (
              <div key={i} className="reveal flex gap-8" style={{ transitionDelay: `${i * 100}ms` }}>
                <div style={{ paddingTop: 6, flexShrink: 0 }}>
                  <div className="timeline-dot" style={{ background: exp.color, boxShadow: `0 0 12px ${exp.color}` }} />
                </div>
                <div className="glass-bright rounded-2xl p-6 flex-1" style={{ border: `1px solid ${exp.color}20` }}>
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                    <div>
                      <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#f0f4ff" }}>{exp.role}</h3>
                      <div style={{ color: exp.color, fontSize: "0.85rem", fontWeight: 600, marginTop: 2 }}>{exp.company}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#6b7fa8" }}>{exp.period}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "#4a5a78", marginTop: 2 }}>{exp.location}</div>
                    </div>
                  </div>
                  <ul style={{ paddingLeft: 0, listStyle: "none" }}>
                    {exp.bullets.map((b, j) => (
                      <li key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6, fontSize: "0.82rem", color: "#8898b8", lineHeight: 1.6 }}>
                        <span style={{ color: exp.color, flexShrink: 0, marginTop: 4 }}>›</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
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
        <div className="text-center mb-16 reveal">
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#3b82f6", letterSpacing: "0.2em", marginBottom: 12 }}>PROJECTS</div>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "#f0f4ff" }}>
            Work That<br /><span className="text-shimmer">Delivers Results</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.map((p, i) => (
            <div
              key={i}
              className="glass card-hover rounded-2xl p-6 reveal cursor-pointer"
              style={{
                transitionDelay: `${i * 80}ms`,
                border: active === i ? `1px solid ${p.color}55` : "1px solid rgba(59,130,246,0.1)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: `linear-gradient(90deg, transparent, ${p.color}, transparent)`,
                  opacity: active === i ? 1 : 0,
                  transition: "opacity 0.3s",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: -60,
                  right: -60,
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  background: p.color,
                  opacity: active === i ? 0.06 : 0.02,
                  filter: "blur(40px)",
                  transition: "opacity 0.4s",
                }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: p.color }}>{p.name}</h3>
                  <div style={{ fontSize: "0.75rem", color: "#6b7fa8", marginTop: 2 }}>{p.subtitle}</div>
                </div>
                <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: "#6b7fa8", transition: "color 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = p.color; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#6b7fa8"; }}
                >
                  <ExternalLink size={15} />
                </a>
              </div>

              <p style={{ fontSize: "0.82rem", color: "#8898b8", lineHeight: 1.65, marginBottom: 14 }}>{p.description}</p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {p.metrics.map((m, j) => (
                  <div
                    key={j}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 8,
                      background: `${p.color}0d`,
                      border: `1px solid ${p.color}22`,
                      fontSize: "0.72rem",
                      color: p.color,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {m}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span key={t} className="tag" style={{ fontSize: "0.68rem" }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────

function Skills() {
  const groups = [
    { title: "Artificial Intelligence", items: SKILLS_AI, color: "#7c3aed" },
    { title: "Growth & Marketing", items: SKILLS_GROWTH, color: "#3b82f6" },
    { title: "UX & Product", items: SKILLS_UX, color: "#06b6d4" },
    { title: "Tools & Platforms", items: SKILLS_TOOLS, color: "#10b981" },
  ];

  return (
    <section id="skills" style={{ padding: "100px 0", background: "rgba(5,8,20,0.4)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#3b82f6", letterSpacing: "0.2em", marginBottom: 12 }}>SKILLS</div>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "#f0f4ff" }}>
            The Full <span className="text-shimmer">Stack</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {groups.map((g, i) => (
            <div key={i} className="glass-bright rounded-2xl p-6 reveal" style={{ transitionDelay: `${i * 100}ms`, border: `1px solid ${g.color}18` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: g.color, boxShadow: `0 0 8px ${g.color}` }} />
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: g.color }}>{g.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <span key={s} className="tag">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mt-10 reveal">
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "#3b82f6", letterSpacing: "0.2em", marginBottom: 12 }}>CERTIFICATIONS</div>
          <div className="flex flex-wrap gap-4">
            {CERTIFICATIONS.map((c, i) => (
              <div key={i} className="glass-bright rounded-xl p-4 flex items-center gap-3" style={{ border: "1px solid rgba(59,130,246,0.15)" }}>
                <Award size={16} style={{ color: "#f59e0b", flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "#e8eeff" }}>{c.title}</div>
                  <div style={{ fontSize: "0.72rem", color: "#6b7fa8", fontFamily: "'JetBrains Mono', monospace" }}>{c.org} · {c.year}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  return (
    <section id="contact" style={{ padding: "120px 0", background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(59,130,246,0.08) 0%, transparent 70%)" }}>
      <div className="max-w-3xl mx-auto px-6 text-center reveal">
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#3b82f6", letterSpacing: "0.2em", marginBottom: 12 }}>CONTACT</div>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: "#f0f4ff", lineHeight: 1.1 }}>
          Let's Build Something<br /><span className="text-shimmer">Extraordinary</span>
        </h2>
        <p style={{ marginTop: 16, color: "#6b7fa8", fontSize: "0.95rem", lineHeight: 1.8 }}>
          Open to AI Growth, Digital Transformation and UX Strategy roles — especially in Dubai, Abu Dhabi and the UAE/GCC region.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          {[
            { icon: Mail, label: "ajayspi@gmail.com", href: "mailto:ajayspi@gmail.com", color: "#3b82f6" },
            { icon: Phone, label: "+91 98853 69345", href: "tel:+919885369345", color: "#7c3aed" },
            { icon: MapPin, label: "Hyderabad · UAE", href: "#", color: "#06b6d4" },
          ].map(({ icon: Icon, label, href, color }) => (
            <a
              key={label}
              href={href}
              className="glass-bright flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300"
              style={{ border: `1px solid ${color}22`, textDecoration: "none" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${color}55`; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${color}22`; (e.currentTarget as HTMLElement).style.transform = ""; }}
            >
              <Icon size={16} style={{ color }} />
              <span style={{ color: "#a8b8d8", fontSize: "0.85rem" }}>{label}</span>
            </a>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          {[
            { label: "LinkedIn", href: "https://www.linkedin.com/in/aigrowthandautomationleader/", icon: Link },
            { label: "GitHub", href: "https://github.com/ajayspi", icon: GitFork },
            { label: "Behance", href: "https://www.behance.net/Designjoom", icon: Globe },
            { label: "Website", href: "https://designjoom.in", icon: ExternalLink },
          ].map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200"
              style={{ fontSize: "0.8rem", color: "#6b7fa8", fontFamily: "'JetBrains Mono', monospace", border: "1px solid rgba(255,255,255,0.06)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#3b82f6"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.3)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#6b7fa8"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
            >
              <Icon size={13} /> {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(59,130,246,0.1)", padding: "24px 0" }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-between items-center gap-4">
        <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.1rem" }}>
          <span className="text-shimmer">Av. Ajay Kiran</span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "#4a5a78" }}>
          AI GROWTH · DIGITAL TRANSFORMATION · UX · AUTOMATION
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "#4a5a78" }}>
          © 2026 · Built with AI
        </div>
      </div>
    </footer>
  );
}

// ─── Cursor ───────────────────────────────────────────────────────────────────

function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => {
      const x = e.clientX, y = e.clientY;
      if (dot.current) { dot.current.style.left = x + "px"; dot.current.style.top = y + "px"; }
      rx += (x - rx) * 0.15;
      ry += (y - ry) * 0.15;
      if (ring.current) { ring.current.style.left = rx + "px"; ring.current.style.top = ry + "px"; }
    };
    const raf = () => {
      if (ring.current) {
        const x = parseFloat(ring.current.style.left || "0");
        const y = parseFloat(ring.current.style.top || "0");
        ring.current.style.left = x + "px";
        ring.current.style.top = y + "px";
      }
      requestAnimationFrame(raf);
    };
    window.addEventListener("mousemove", onMove);
    requestAnimationFrame(raf);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div ref={dot} className="cursor" />
      <div ref={ring} className="cursor-follower" />
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  useReveal();

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh", overflowX: "hidden" }}>
      <Cursor />
      <Nav />
      <Hero />
      <CrawlStrip />
      <About />
      <Metrics />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </div>
  );
}
