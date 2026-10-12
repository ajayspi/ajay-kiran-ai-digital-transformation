import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line,
  Cell
} from "recharts";
import { Star, TrendingUp, BarChart3, Users, Zap, Globe } from "lucide-react";
import { P, GROWTH_DATA, PROJECT_IMPACT, SKILLS_RADAR, FUNNEL_DATA } from "./data";
import { Reveal } from "./Reveal";

// ─── Tooltip Styles ───────────────────────────────────────────────────────────

const tooltipStyle = {
  contentStyle: {
    background: "rgba(10,15,35,0.95)",
    border: "1px solid rgba(59,130,246,0.25)",
    borderRadius: 10,
    fontSize: "0.75rem",
    color: "#e8eeff",
    fontFamily: "'JetBrains Mono', monospace",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
  labelStyle: { color: "#6b9fef", marginBottom: 4 },
  cursor: { stroke: "rgba(59,130,246,0.2)", strokeWidth: 1 },
};

function fmtCount(count: number, decimals: number) {
  return decimals > 0 ? count.toFixed(decimals) : count >= 10000 ? `${(count / 1000).toFixed(0)}K` : count >= 1000 ? `${(count / 1000).toFixed(1)}K` : Math.floor(count).toString();
}

function Counter({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(`0${suffix}`);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setDisplay(`${fmtCount(value, decimals)}${suffix}`); return; }
    // ponytail: single rAF-driven tween instead of a 64-tick setInterval
    const controls = animate(0, value, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setDisplay(`${fmtCount(v, decimals)}${suffix}`) });
    return () => controls.stop();
  }, [inView, value, decimals, suffix, reduce]);
  return <span ref={ref}>{display}</span>;
}
// ─── Metrics — Compact Viewport-fit ──────────────────────────────────────────

export function Metrics() {
  const ALL = [
    { value: 14,    suffix: "+",   label: "Years Experience",      sub: "Google · Startups · Healthcare", icon: Star,     color: P.blue,   chart: "area", data: GROWTH_DATA, key: "users" },
    { value: 180,   suffix: "%+",  label: "Organic Traffic Growth", sub: "SEO / SEM · 10+ years",         icon: TrendingUp,color: P.green,  chart: "line", data: GROWTH_DATA, key: "growth" },
    { value: 60900, suffix: "+",   label: "Video Views",            sub: "Cross-platform",                icon: BarChart3, color: P.violet, chart: null,   data: null,        key: null },
    { value: 2534,  suffix: "",    label: "New Users",              sub: "IR4U digital ecosystem",        icon: Users,     color: P.cyan,   chart: null,   data: null,        key: null },
    { value: 433,   suffix: "",    label: "WhatsApp Conversions",   sub: "Instagram → WhatsApp",          icon: Zap,       color: P.amber,  chart: null,   data: null,        key: null },
    { value: 20,    suffix: "+",   label: "Global Clients",         sub: "India · Germany · USA · UAE",   icon: Globe,     color: P.pink,   chart: null,   data: null,        key: null },
  ];

  return (
    <section id="metrics" style={{ padding: "56px 0 60px", background: "radial-gradient(ellipse 80% 50% at 50% 100%,rgba(124,58,237,0.05) 0%,transparent 70%)" }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Header — compact */}
        <Reveal className="flex items-center justify-between mb-8">
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", color: P.blue, letterSpacing: "0.2em", marginBottom: 4 }}>IMPACT METRICS</div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.4rem,2.5vw,1.9rem)", fontWeight: 800, color: "#f0f4ff", lineHeight: 1.1 }}>
              Numbers That <span className="text-shimmer">Tell the Story</span>
            </h2>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", color: "#4a5a78", letterSpacing: "0.1em" }}>14+ YRS · 9 PROJECTS · 5 COUNTRIES</div>
        </Reveal>

        {/* 3-column grid — two rows of 3 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, minWidth: 0 }}>
          {ALL.map((m, i) => {
            const Icon = m.icon;
            return (
              <Reveal key={i} className="glass" delay={i * 0.055} hoverLift={4} style={{
                borderRadius: 14,
                padding: "16px 18px",
                border: `1px solid ${m.color}1a`,
                position: "relative",
                overflow: "hidden",
                minWidth: 0,
              }}>
                {/* Glow orb */}
                <div style={{ position: "absolute", top: -16, right: -16, width: 80, height: 80, borderRadius: "50%", background: m.color, opacity: 0.06, filter: "blur(24px)" }} />

                {/* Top row — icon + label */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: `${m.color}14`, border: `1px solid ${m.color}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={13} style={{ color: m.color }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: "0.72rem", color: "#c8d8f0", lineHeight: 1.2 }}>{m.label}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.57rem", color: "#4a5a78", marginTop: 1 }}>{m.sub}</div>
                  </div>
                </div>

                {/* Number */}
                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem,2.8vw,2.2rem)", color: m.color, lineHeight: 1 }}>
                  <Counter value={m.value} suffix={m.suffix} />
                </div>

                {/* Inline sparkline for the two chart cards */}
                {m.chart && m.data && m.key && (
                  <div role="img" aria-label={`${m.label} trend, 2013 to 2022`} style={{ marginTop: 10, height: 44, minHeight: 44 }}>
                    <ResponsiveContainer width="100%" height={44} minWidth={0}>
                      {m.chart === "area" ? (
                        <AreaChart data={m.data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                          <defs>
                            <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={m.color} stopOpacity={0.3} />
                              <stop offset="100%" stopColor={m.color} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey={m.key} stroke={m.color} strokeWidth={1.5} fill={`url(#grad-${i})`} dot={false} isAnimationActive={false} />
                          <Tooltip {...tooltipStyle} formatter={(v) => [`${v}`, m.label]} />
                        </AreaChart>
                      ) : (
                        <LineChart data={m.data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                          <Line type="monotone" dataKey={m.key} stroke={m.color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
                          <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, m.label]} />
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
// ─── Impact Dashboard ─────────────────────────────────────────────────────────

export function ImpactDashboard() {
  return (
    <section style={{ padding: "80px 0 100px", background: "rgba(5,8,20,0.6)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="text-center mb-14">
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.72rem", color: P.violet, letterSpacing: "0.2em", marginBottom: 12 }}>IMPACT DASHBOARD</div>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: "#f0f4ff" }}>
            Data Behind <span className="text-shimmer">Every Result</span>
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, minWidth: 0 }}>

          {/* Project Impact Bar Chart */}
          <Reveal className="glass-bright" role="img" aria-label="Bar chart: video views in thousands across IR4U, Vigilare, Pro Studio X, Recytronics, eRevival and Precious Jewels" style={{ borderRadius: 20, padding: 28, border: `1px solid ${P.blue}18` }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#d8e4ff" }}>Project Reach</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", color: "#6b7fa8", marginTop: 3 }}>Video views (K) across projects</div>
            </div>
            <ResponsiveContainer width="100%" height={220} minWidth={0}>
              <BarChart data={PROJECT_IMPACT} margin={{ top: 4, right: 4, bottom: 0, left: -20 }} barSize={18}>
                <CartesianGrid vertical={false} stroke="rgba(59,130,246,0.07)" />
                <XAxis dataKey="name" tick={{ fill: "#6b7fa8", fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7fa8", fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} formatter={(v) => [`${v}K`, "Views"]} />
                <Bar dataKey="views" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                  {PROJECT_IMPACT.map((_, i) => (
                    <Cell key={i} fill={[P.blue,P.violet,P.cyan,P.green,P.amber,P.pink][i % 6]} opacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Reveal>

          {/* IR4U Acquisition Funnel */}
          <Reveal className="glass-bright" delay={0.1} style={{ borderRadius: 20, padding: 28, border: `1px solid ${P.violet}18` }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#d8e4ff" }}>IR4U Acquisition Funnel</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", color: "#6b7fa8", marginTop: 3 }}>Instagram → WhatsApp conversion journey</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
              {FUNNEL_DATA.map((f, i) => {
                const pct = (f.value / FUNNEL_DATA[0].value) * 100;
                return (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem", color: "#8898b8" }}>{f.stage}</span>
                      <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "0.8rem", color: f.color }}>
                        {f.value.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, borderRadius: 999, background: f.color, boxShadow: `0 0 8px ${f.color}55`, transition: "width 1.2s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 20, padding: "10px 14px", borderRadius: 10, background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", color: "#10b981" }}>CONVERSION RATE: </span>
              <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "0.9rem", color: "#10b981" }}>0.84%</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", color: "#6b7fa8" }}> impressions → WhatsApp</span>
            </div>
          </Reveal>

          {/* Growth Trajectory */}
          <Reveal className="glass-bright" delay={0.16} role="img" aria-label="Area chart: organic traffic growth from 8 percent in 2013 to 180 percent in 2022" style={{ borderRadius: 20, padding: 28, border: `1px solid ${P.cyan}18` }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#d8e4ff" }}>10-Year Growth Trajectory</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", color: "#6b7fa8", marginTop: 3 }}>Organic traffic % growth curve</div>
            </div>
            <ResponsiveContainer width="100%" height={200} minWidth={0}>
              <AreaChart data={GROWTH_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={P.cyan} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={P.cyan} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="violetGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={P.violet} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={P.violet} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(59,130,246,0.07)" strokeDasharray="4 4" />
                <XAxis dataKey="year" tick={{ fill: "#6b7fa8", fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7fa8", fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, "Growth"]} />
                <Area type="monotone" dataKey="growth" stroke={P.cyan} strokeWidth={2.5} fill="url(#cyanGrad)" dot={{ fill: P.cyan, r: 3, strokeWidth: 0 }} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </Reveal>

          {/* Skills Radar */}
          <Reveal className="glass-bright" delay={0.22} role="img" aria-label="Radar chart: proficiency scores in the eighties and nineties across AI and automation, growth and SEO, UX strategy, product, analytics and leadership" style={{ borderRadius: 20, padding: 28, border: `1px solid ${P.green}18` }}>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#d8e4ff" }}>Competency Radar</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", color: "#6b7fa8", marginTop: 3 }}>Proficiency across core domains</div>
            </div>
            <ResponsiveContainer width="100%" height={220} minWidth={0}>
              <RadarChart data={SKILLS_RADAR} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                <PolarGrid stroke="rgba(59,130,246,0.12)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: "#8898b8", fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }} />
                <Radar dataKey="value" stroke={P.blue} fill={P.blue} fillOpacity={0.18} strokeWidth={2} dot={{ fill: P.blue, r: 3, strokeWidth: 0 }} isAnimationActive={false} />
                <Tooltip {...tooltipStyle} formatter={(v) => [`${v}/100`, "Score"]} />
              </RadarChart>
            </ResponsiveContainer>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

