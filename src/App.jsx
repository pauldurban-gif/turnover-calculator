import { useState, useEffect, useRef } from "react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lora:ital,wght@0,600;0,700;1,400;1,500&display=swap');
`;

// ─── Brand colors ─────────────────────────────────────────────────────────────
const C = {
  navy:         "#001e46",
  navyMid:      "#002d66",
  navyLight:    "#e8edf5",
  teal:         "#00adb0",
  tealDark:     "#008f92",
  tealLight:    "#e6f7f7",
  tealBorder:   "#9de0e1",
  gray:         "#bebebe",
  grayDark:     "#8a8a8a",
  grayLight:    "#e8e8e8",
  cardGrad:     "linear-gradient(160deg, #ffffff 0%, #eceef2 100%)",
  cardGradAlt:  "linear-gradient(160deg, #f4f6f9 0%, #e4e8ee 100%)",
  cardGradTeal: "linear-gradient(160deg, #e6f7f7 0%, #c8eeee 100%)",
  cardGradNavy: "linear-gradient(160deg, #001e46 0%, #002d66 100%)",
  text:         "#001e46",
  textMid:      "#2a3f5f",
  textMuted:    "#5a7090",
  textFaint:    "#8a9ab0",
  shadowSm:     "0 1px 3px rgba(0,30,70,0.08), 0 4px 12px rgba(0,30,70,0.10)",
  shadow:       "0 2px 6px rgba(0,30,70,0.10), 0 8px 24px rgba(0,30,70,0.12)",
  shadowLg:     "0 4px 10px rgba(0,30,70,0.11), 0 18px 48px rgba(0,30,70,0.16)",
  shadowTeal:   "0 2px 6px rgba(0,173,176,0.18), 0 8px 24px rgba(0,173,176,0.22)",
  shadowNavy:   "0 4px 10px rgba(0,30,70,0.28), 0 16px 40px rgba(0,30,70,0.35)",
  border:       "#dde2ea",
  borderLight:  "#eaedf2",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const ORG_TYPES = [
  { id: "human_services", label: "Human Services",   icon: "🤝", sectorMultiplier: 1.20,
    sectorNote: "Frontline burnout and client-relationship disruption push costs ~20% above average.",
    source: "Nonprofit HR, 2023 Nonprofit Sector Survey",
    benchmarkRate: 0.30,
    risks: [
      { factor: "Supervisor-to-staff ratios",    detail: "High caseloads with insufficient supervision are the #1 driver of burnout and early departure in direct-service roles." },
      { factor: "Compensation compression",       detail: "Entry and mid-level salaries often haven't kept pace with inflation, narrowing the gap between new hires and experienced staff — reducing incentive to stay." },
      { factor: "Secondary traumatic stress",     detail: "Staff working with trauma-affected populations absorb stress over time. Without formal support structures, this quietly accelerates departure." },
    ],
    firstSteps: [
      "Audit your supervisor-to-staff ratios against sector benchmarks (1:6 is a common ceiling for frontline roles).",
      "Conduct stay interviews — not just exit interviews — with staff in their first 18 months.",
      "Review whether your compensation structure rewards tenure with meaningful increases.",
    ],
    filamentBridge: "Filament works with Human Services organizations on the HR fundamentals that support retention — performance frameworks that keep frontline staff engaged, policy documentation that protects your team, and recruitment systems that reduce time-to-hire when departures do happen.",
  },
  { id: "health", label: "Health & Wellness", icon: "🏥", sectorMultiplier: 1.30,
    sectorNote: "Licensed/credentialed roles and clinical onboarding add ~30% to replacement cost.",
    source: "SHRM, Healthcare Workforce Trends Report 2022",
    benchmarkRate: 0.26,
    risks: [
      { factor: "Credentialed role scarcity",     detail: "Licensed clinical staff are in high demand across sectors — your nonprofit is competing with health systems that can offer higher pay and better benefits." },
      { factor: "Long onboarding timelines",      detail: "Clinical orientation and compliance training can take 3–6 months, dramatically extending the productivity gap after each departure." },
      { factor: "Regulatory compliance burden",   detail: "Documentation and reporting requirements add invisible workload that accelerates burnout, particularly in smaller orgs without dedicated compliance support." },
    ],
    firstSteps: [
      "Map your compensation against local healthcare market rates — not just nonprofit benchmarks.",
      "Identify which compliance tasks could be streamlined or delegated to reduce clinical staff burden.",
      "Explore student loan repayment assistance or loan forgiveness programs as retention tools.",
    ],
    filamentBridge: "Filament helps Health & Wellness nonprofits reduce the administrative burden that accelerates burnout — HR compliance, benefits administration, and performance management systems that free your clinical staff to focus on the work they came to do.",
  },
  { id: "education", label: "Education", icon: "📚", sectorMultiplier: 1.15,
    sectorNote: "Program continuity losses and student-relationship disruption add a ~15% premium.",
    source: "Learning Policy Institute, Teacher Turnover Cost Study",
    benchmarkRate: 0.20,
    risks: [
      { factor: "Mid-year departure impact",      detail: "Unlike corporate roles, education departures mid-program create immediate, visible harm — to students, to program outcomes, and to community trust." },
      { factor: "Limited advancement pathways",   detail: "Program staff often see no clear path from frontline roles to leadership, making external moves the only way to grow." },
      { factor: "Underpaid relative to schools",  detail: "Nonprofit education organizations frequently lose staff to school districts offering union wages, pensions, and summers off." },
    ],
    firstSteps: [
      "Create visible internal pathways — coordinator to manager to director — with salary bands attached.",
      "Consider academic-year scheduling options to compete with school district employment models.",
      "Build program handoff protocols so departures don't derail student outcomes.",
    ],
    filamentBridge: "Filament works with Education nonprofits on the HR foundations that support staff retention — performance frameworks, employee relations support, and the policy documentation that creates consistency and clarity across your team.",
  },
  { id: "arts", label: "Arts & Culture", icon: "🎨", sectorMultiplier: 0.95,
    sectorNote: "Broader candidate pools and mission passion slightly reduce recruiting overhead (~5% below average).",
    source: "Americans for the Arts, Workforce Report 2021",
    benchmarkRate: 0.22,
    risks: [
      { factor: "Mission passion masking burnout", detail: "Staff who love the work often stay too long in unsustainable conditions — then leave suddenly. Mission alignment delays but doesn't prevent turnover." },
      { factor: "Funding cycle instability",       detail: "Grant-dependent positions create genuine uncertainty that prompts talented staff to seek more stable employment elsewhere." },
      { factor: "Volunteer-professional tension",  detail: "When boards or volunteers have operational influence, paid staff can feel undervalued or undermined — a quiet but real turnover driver." },
    ],
    firstSteps: [
      "Review whether any staff are carrying responsibilities that should be in a higher-compensated role.",
      "Communicate funding timelines and position security proactively — uncertainty is more damaging than bad news.",
      "Clarify board and volunteer roles to protect staff from scope creep.",
    ],
    filamentBridge: "Filament helps Arts & Culture organizations build the HR infrastructure that supports stability — clear policies, benefits administration, and performance management frameworks that protect staff and reduce the uncertainty that quietly drives turnover.",
  },
  { id: "environment", label: "Environment", icon: "🌿", sectorMultiplier: 0.90,
    sectorNote: "Strong mission alignment and lower role specialization reduce costs ~10% below average.",
    source: "Nonprofit HR, 2023 Nonprofit Sector Survey",
    benchmarkRate: 0.18,
    risks: [
      { factor: "Urgency fatigue",                detail: "Climate and environmental work carries high emotional stakes — staff can feel the weight of the mission in ways that accumulate into burnout." },
      { factor: "Geographic concentration",       detail: "Many environmental orgs are concentrated in specific metro areas, creating a small local talent pool and peer recruiting pressure." },
      { factor: "Pay gap vs. advocacy funders",   detail: "Foundation and government roles in the environmental space often pay significantly more, creating an attractive off-ramp for experienced staff." },
    ],
    firstSteps: [
      "Build sustainable workload expectations — model the urgency of the mission without modeling unsustainable hours.",
      "Invest in professional development that keeps environmental staff engaged and growing internally.",
      "Track departures to see if government or foundation roles are the primary destination.",
    ],
    filamentBridge: "Filament helps Environmental organizations build sustainable HR practices — performance frameworks, employee relations support, and the compliance documentation that lets mission-driven staff focus on the work rather than the friction.",
  },
  { id: "advocacy", label: "Advocacy / Policy", icon: "📣", sectorMultiplier: 1.10,
    sectorNote: "Policy context and relationship networks are hard to transfer — a ~10% knowledge-loss premium applies.",
    source: "SHRM, Nonprofit HR Benchmarking Study 2022",
    benchmarkRate: 0.24,
    risks: [
      { factor: "Relationship and network loss",  detail: "In advocacy, departing staff take with them years of cultivated relationships with legislators, media, and coalition partners — these can't be replaced from a job posting." },
      { factor: "Policy cycle misalignment",      detail: "Election cycles and legislative sessions create natural pressure points where staff reassess their role — departure often clusters around these moments." },
      { factor: "Expertise concentration risk",   detail: "Smaller advocacy orgs often have one or two people who hold institutional knowledge of complex policy areas — their departure creates organizational vulnerability." },
    ],
    firstSteps: [
      "Document key relationships and context — don't let critical knowledge live only in someone's head.",
      "Anticipate pressure points (election years, session ends) and proactively check in with staff around retention.",
      "Assess whether any single position represents a knowledge concentration risk and begin succession planning.",
    ],
    filamentBridge: "Filament helps Advocacy organizations reduce the operational friction that drives good people out — HR policy development, performance management, and the documentation systems that protect institutional continuity when departures do happen.",
  },
  { id: "faith", label: "Faith-Based", icon: "✦", sectorMultiplier: 0.85,
    sectorNote: "Community-fit filtering and mission alignment tend to extend tenure, reducing costs ~15% below average.",
    source: "Nonprofit HR, 2023 Nonprofit Sector Survey",
    benchmarkRate: 0.15,
    risks: [
      { factor: "Values-fit dependency",          detail: "Hiring for cultural and values alignment is a strength — but it can narrow the candidate pool and create vulnerability when fit-based staff do leave." },
      { factor: "Compensation expectations gap",  detail: "Staff drawn by mission may accept below-market pay, but this creates financial stress over time that eventually overrides commitment." },
      { factor: "Leadership transition sensitivity", detail: "Faith-based orgs often experience staff departures following pastoral or executive transitions — loyalty is frequently person-specific rather than institution-specific." },
    ],
    firstSteps: [
      "Conduct a compensation review against nonprofit (not just faith-sector) benchmarks to identify compression points.",
      "Build succession and transition planning into leadership development — not just crisis response.",
      "Review which roles have single-person knowledge concentration.",
    ],
    filamentBridge: "Filament works with Faith-Based organizations on the HR practices that build long-term stability — employee handbooks, performance management frameworks, and benefits administration that reflects your values and supports your team through transitions.",
  },
  { id: "other", label: "Other Nonprofit", icon: "◎", sectorMultiplier: 1.00,
    sectorNote: "Baseline nonprofit average applied — no sector-specific adjustment.",
    source: "SHRM, Human Capital Benchmarking Report",
    benchmarkRate: 0.22,
    risks: [
      { factor: "Compensation vs. for-profit sector", detail: "Nonprofits routinely lose mid-career staff to private sector roles offering 20–40% salary premiums and equity compensation." },
      { factor: "Limited internal mobility",          detail: "Flat org structures mean staff who want to grow often have no path forward — leading them to seek growth elsewhere." },
      { factor: "Manager effectiveness",              detail: "Research consistently shows that people leave managers more than organizations. Investing in frontline manager development has among the highest retention ROI of any intervention." },
    ],
    firstSteps: [
      "Benchmark your compensation annually against both nonprofit and local market data — not just sector surveys.",
      "Map career pathways for your most common roles and communicate them explicitly.",
      "Assess manager effectiveness through structured staff feedback.",
    ],
    filamentBridge: "Filament helps nonprofits build the HR foundation that supports retention — recruitment systems, performance frameworks, compliance documentation, and benefits administration that reduces the friction that drives good people out.",
  },
];

const ORG_SIZES = [
  { id: "tiny",   label: "1–10 staff",    employees: 5   },
  { id: "small",  label: "11–25 staff",   employees: 18  },
  { id: "medium", label: "26–75 staff",   employees: 50  },
  { id: "large",  label: "76–150 staff",  employees: 112 },
  { id: "xlarge", label: "150+ staff",    employees: 200 },
];

const SALARY_RANGES = [
  { id: "low",      label: "$30,000 – $45,000",  midpoint: 37500,  complexity: "entry"  },
  { id: "mid_low",  label: "$45,000 – $60,000",  midpoint: 52500,  complexity: "mid"    },
  { id: "mid",      label: "$60,000 – $80,000",  midpoint: 70000,  complexity: "mid"    },
  { id: "mid_high", label: "$80,000 – $110,000", midpoint: 95000,  complexity: "senior" },
  { id: "high",     label: "$110,000+",           midpoint: 130000, complexity: "senior" },
];

const TURNOVER_RATES = [
  { id: "low",     label: "Low — under 15%",  rate: 0.12 },
  { id: "typical", label: "Typical — 15–25%", rate: 0.20 },
  { id: "high",    label: "High — 25–40%",    rate: 0.32 },
  { id: "crisis",  label: "Crisis — 40%+",    rate: 0.50 },
];

const BASE_MULTIPLIERS = { entry: 0.65, mid: 1.00, senior: 1.50 };
const MULTIPLIER_LABELS = {
  entry:  "65% of salary (entry-level roles)",
  mid:    "100% of salary (professional roles)",
  senior: "150% of salary (senior / management roles)",
};

const VISIBLE_ITEMS = [
  { label: "Job posting & advertising",     pct: 0.06, example: "LinkedIn, Indeed, sector job boards" },
  { label: "HR & recruiting admin time",    pct: 0.08, example: "Screening, scheduling, offer letters" },
  { label: "Reference & background checks", pct: 0.02, example: "Standard pre-hire process" },
];
const INVISIBLE_ITEMS = [
  { label: "Executive & manager time",      pct: 0.10, example: "60–80 hrs of leadership attention per departure — interviews, debriefs, re-onboarding" },
  { label: "New-hire productivity ramp",    pct: 0.22, example: "New staff typically reach full productivity 6–12 months in; your team covers the gap" },
  { label: "Remaining team drag",           pct: 0.16, example: "Colleagues absorb extra work, morale dips, and their own tenure risk rises" },
  { label: "Institutional knowledge loss",  pct: 0.20, example: "Donor relationships, program context, undocumented processes — irreplaceable" },
  { label: "Onboarding & training",         pct: 0.16, example: "Orientation, tools setup, mentoring, training materials" },
];

// ─── Calculation ──────────────────────────────────────────────────────────────
function calcCosts(orgType, size, salary, turnover) {
  const employees           = size.employees;
  const departures          = Math.max(1, Math.round(employees * turnover.rate));
  const baseMultiplier      = BASE_MULTIPLIERS[salary.complexity];
  const sectorMultiplier    = orgType.sectorMultiplier;
  const effectiveMultiplier = baseMultiplier * sectorMultiplier;
  const costPerDeparture    = Math.round(salary.midpoint * effectiveMultiplier);
  const total               = departures * costPerDeparture;
  const visibleTotal        = Math.round(total * VISIBLE_ITEMS.reduce((s, i) => s + i.pct, 0));
  const invisibleTotal      = Math.round(total * INVISIBLE_ITEMS.reduce((s, i) => s + i.pct, 0));

  // ROI: tiered based on scale
  // For orgs with 3+ departures: show savings from a 5-point rate reduction
  // For orgs with fewer than 3 departures: "per departure prevented" framing instead
  const reducedRate         = Math.max(0.05, turnover.rate - 0.05);
  const reducedDepartures   = Math.max(0, Math.round(employees * reducedRate));
  const roiDepartureSavings = Math.max(0, (departures - reducedDepartures) * costPerDeparture);
  const roiMode             = departures >= 3 ? "projection" : "perDeparture";

  return { total, departures, costPerDeparture, employees, baseMultiplier, sectorMultiplier,
           effectiveMultiplier, visibleTotal, invisibleTotal,
           roiDepartureSavings, reducedRate, reducedDepartures, roiMode };
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ value, duration = 1600 }) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(null);
  const rafRef   = useRef(null);
  useEffect(() => {
    startRef.current = null;
    const animate = ts => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / duration, 1);
      setDisplay(Math.round((1 - Math.pow(2, -10 * p)) * value));
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);
  return <span>${display.toLocaleString()}</span>;
}

// ─── Cost row ─────────────────────────────────────────────────────────────────
function CostRow({ label, amount, example, barColor, barPct, delay = 0 }) {
  const [filled, setFilled] = useState(false);
  useEffect(() => { const t = setTimeout(() => setFilled(true), delay + 200); return () => clearTimeout(t); }, []);
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: C.textMid, fontWeight: 500 }}>{label}</span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: barColor, fontWeight: 700 }}>${amount.toLocaleString()}</span>
      </div>
      <div style={{ height: "5px", background: C.grayLight, borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: filled ? `${barPct}%` : "0%", background: barColor, borderRadius: "3px", transition: `width 0.9s ease ${delay}ms` }} />
      </div>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: C.textFaint, marginTop: "4px", lineHeight: 1.5 }}>{example}</p>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionLabel({ text }) {
  return (
    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.textFaint, marginBottom: "12px" }}>
      {text}
    </p>
  );
}

// ─── Interactive button ───────────────────────────────────────────────────────
function PressButton({ onClick, disabled, variant = "primary", children, style: extraStyle = {} }) {
  const [hovered,  setHovered]  = useState(false);
  const [pressed,  setPressed]  = useState(false);

  const base = {
    fontFamily:     "Inter, sans-serif",
    fontWeight:     600,
    fontSize:       "14px",
    border:         "none",
    borderRadius:   "9px",
    cursor:         disabled ? "not-allowed" : "pointer",
    letterSpacing:  "0.02em",
    transition:     "all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
    transform:      pressed ? "scale(0.97) translateY(1px)"
                  : hovered ? "scale(1.015) translateY(-1px)"
                  : "scale(1) translateY(0)",
    outline:        "none",
    display:        "inline-flex",
    alignItems:     "center",
    justifyContent: "center",
  };

  const variants = {
    primary: {
      background: disabled ? C.grayLight
                : pressed  ? C.tealDark
                : hovered  ? C.teal
                : `linear-gradient(135deg, ${C.teal}, ${C.tealDark})`,
      color:     disabled ? C.gray : "#fff",
      boxShadow: disabled  ? "none"
                : pressed  ? "0 1px 4px rgba(0,173,176,0.3)"
                : hovered  ? `0 6px 20px rgba(0,173,176,0.45), 0 2px 6px rgba(0,173,176,0.3)`
                : C.shadowTeal,
      padding:   "15px 24px",
      width:     "100%",
      fontSize:  "15px",
    },
    outline: {
      background: pressed  ? C.navy
                : hovered  ? C.navy
                : "transparent",
      color:     pressed || hovered ? "#fff" : C.navy,
      border:    `2px solid ${C.navy}`,
      boxShadow: pressed   ? "none"
                : hovered  ? `0 4px 14px rgba(0,30,70,0.22)`
                : C.shadowSm,
      padding:   "12px 36px",
    },
    ghost: {
      background: pressed  ? C.navyLight
                : hovered  ? C.borderLight
                : C.cardGrad,
      color:     pressed   ? C.navy : C.textMid,
      border:    `1.5px solid ${hovered || pressed ? C.border : C.border}`,
      boxShadow: pressed   ? "none"
                : hovered  ? C.shadow
                : C.shadowSm,
      padding:   "10px 20px",
    },
    ghostTeal: {
      background: pressed  ? C.tealLight
                : hovered  ? C.tealLight
                : C.cardGrad,
      color:     pressed || hovered ? C.tealDark : C.textMid,
      border:    `1.5px solid ${hovered || pressed ? C.tealBorder : C.border}`,
      boxShadow: pressed   ? "none"
                : hovered  ? C.shadowTeal
                : C.shadowSm,
      padding:   "10px 20px",
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{ ...base, ...variants[variant], ...extraStyle }}
    >
      {children}
    </button>
  );
}

// ─── Methodology accordion ────────────────────────────────────────────────────
function MethRow({ label, value, detail, source }) {
  return (
    <div style={{ padding: "10px 0", borderBottom: `1px solid ${C.borderLight}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: C.textFaint, fontWeight: 500 }}>{label}</span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: C.textMid, fontWeight: 600 }}>{value}</span>
      </div>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: C.textMuted, lineHeight: 1.6 }}>{detail}</p>
      {source && <p style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: C.textFaint, marginTop: "2px" }}>Source: {source}</p>}
    </div>
  );
}

function MethodologyAccordion({ orgType, size, salary, turnover, calc }) {
  const [open, setOpen] = useState(false);
  const { departures, costPerDeparture, total, baseMultiplier, sectorMultiplier, effectiveMultiplier } = calc;
  const pctChange = Math.round(Math.abs(sectorMultiplier - 1) * 100);
  const direction = sectorMultiplier > 1 ? "above" : sectorMultiplier < 1 ? "below" : null;

  return (
    <div style={{ background: C.cardGrad, border: `1px solid ${C.border}`, borderRadius: "12px", marginBottom: "16px", overflow: "hidden", boxShadow: C.shadowSm }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: "100%", background: "transparent", border: "none", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.textMuted, transition: "color 0.15s ease" }}
        onMouseEnter={e => e.currentTarget.style.color = C.navy}
        onMouseLeave={e => e.currentTarget.style.color = C.textMuted}>
        <span>How we calculated this</span>
        <span style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.25s", fontSize: "14px", color: C.teal }}>▾</span>
      </button>
      <div style={{ maxHeight: open ? "1500px" : 0, overflow: "hidden", transition: "max-height 0.45s ease" }}>
        <div style={{ padding: "0 20px 24px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ background: C.navyLight, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "14px 16px", margin: "16px 0", fontFamily: "Inter, sans-serif", fontSize: "13px", color: C.textMid, lineHeight: 2.1 }}>
            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textFaint, marginBottom: "10px" }}>The formula</div>
            <div><span style={{ color: C.teal, fontWeight: 600 }}>{size.employees} staff</span> × <span style={{ color: C.teal, fontWeight: 600 }}>{Math.round(turnover.rate * 100)}% turnover</span> = <strong style={{ color: C.navy }}>{departures} departure{departures !== 1 ? "s" : ""}/year</strong></div>
            <div>
              <span style={{ color: C.teal, fontWeight: 600 }}>${salary.midpoint.toLocaleString()} salary</span> × <span style={{ color: C.teal, fontWeight: 600 }}>{Math.round(baseMultiplier * 100)}% base</span>
              {sectorMultiplier !== 1 && <> × <span style={{ color: C.teal, fontWeight: 600 }}>{Math.round(sectorMultiplier * 100)}% sector</span></>}
              {" = "}<strong style={{ color: C.navy }}>${costPerDeparture.toLocaleString()} per departure</strong>
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "8px", marginTop: "4px" }}>
              <strong style={{ color: C.navy }}>{departures} × ${costPerDeparture.toLocaleString()} = </strong>
              <strong style={{ color: C.teal, fontSize: "15px" }}>${total.toLocaleString()}</strong>
            </div>
          </div>

          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textFaint, marginBottom: "8px" }}>Your inputs</div>
          <MethRow label="Org type"     value={orgType.label}
            detail={direction ? `${pctChange}% ${direction} the nonprofit baseline. ${orgType.sectorNote}` : orgType.sectorNote}
            source={orgType.source} />
          <MethRow label="Staff count"  value={size.label}
            detail={`We use ${size.employees} as the midpoint for this range.`} />
          <MethRow label="Salary range" value={salary.label}
            detail={`Midpoint $${salary.midpoint.toLocaleString()} used. ${MULTIPLIER_LABELS[salary.complexity]}.`}
            source="SHRM Human Capital Benchmarking Report; Center for American Progress" />
          <MethRow label="Turnover"     value={turnover.label}
            detail={`${Math.round(turnover.rate * 100)}% applied to staff count to estimate annual departures.`}
            source="Nonprofit HR, 2023 State of the Nonprofit Sector" />

          <div style={{ background: C.tealLight, border: `1px solid ${C.tealBorder}`, borderRadius: "8px", padding: "12px 14px", margin: "16px 0" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.tealDark, marginBottom: "6px" }}>Effective replacement multiplier</div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: C.textMid, lineHeight: 1.7 }}>
              Base ({Math.round(baseMultiplier * 100)}%) × Sector ({Math.round(sectorMultiplier * 100)}%) = <strong style={{ color: C.teal }}>{Math.round(effectiveMultiplier * 100)}% of annual salary</strong>. One departure costs roughly <strong style={{ color: C.teal }}>${costPerDeparture.toLocaleString()}</strong>.
            </p>
          </div>

          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textFaint, marginBottom: "8px" }}>Cost category breakdown</div>
          {[...VISIBLE_ITEMS, ...INVISIBLE_ITEMS].map(item => (
            <div key={item.label} style={{ display: "flex", gap: "10px", marginBottom: "7px", alignItems: "flex-start" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: C.teal, fontWeight: 700, whiteSpace: "nowrap", minWidth: "28px" }}>{Math.round(item.pct * 100)}%</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: C.textMuted, lineHeight: 1.5 }}><strong style={{ color: C.textMid }}>{item.label}</strong> — {item.example}</span>
            </div>
          ))}
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: C.textFaint, marginTop: "14px", lineHeight: 1.6 }}>
            Sources: SHRM Human Capital Benchmarking Report; Boushey & Glynn, "There Are Significant Business Costs to Replacing Employees" (Center for American Progress); Nonprofit HR Annual Surveys 2021–2023.
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: C.textFaint, marginTop: "8px", fontStyle: "italic", lineHeight: 1.6 }}>
            This calculator produces estimates, not audited figures. Actual costs vary by organization, role, and market.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Option grid ──────────────────────────────────────────────────────────────
function OptionButton({ opt, selected, onChange }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={() => onChange(opt)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        background:    selected        ? C.tealLight
                     : pressed        ? C.navyLight
                     : hovered        ? "#f0f4f8"
                     : C.cardGradAlt,
        border:        `1.5px solid ${selected ? C.teal : hovered ? C.navy : C.border}`,
        borderRadius:  "9px",
        padding:       "13px 10px",
        cursor:        "pointer",
        color:         selected        ? C.tealDark
                     : hovered        ? C.navy
                     : C.textMid,
        fontSize:      "13px",
        fontFamily:    "Inter, sans-serif",
        fontWeight:    selected || hovered ? 600 : 400,
        textAlign:     "center",
        lineHeight:    1.4,
        transform:     pressed          ? "scale(0.96) translateY(1px)"
                     : selected        ? "scale(1.02) translateY(-1px)"
                     : hovered         ? "scale(1.02) translateY(-1px)"
                     : "scale(1)",
        boxShadow:     selected        ? C.shadowTeal
                     : pressed        ? "none"
                     : hovered        ? C.shadow
                     : C.shadowSm,
        transition:    "all 0.14s cubic-bezier(0.34, 1.56, 0.64, 1)",
        outline:       "none",
      }}
    >
      {opt.label}
    </button>
  );
}

function OptionGrid({ options, value, onChange, columns = 4 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: "10px" }}>
      {options.map(opt => (
        <OptionButton key={opt.id} opt={opt} selected={value?.id === opt.id} onChange={onChange} />
      ))}
    </div>
  );
}

// ─── Result screen ────────────────────────────────────────────────────────────
function ResultScreen({ orgType, size, salary, turnover, onReset }) {
  const calc = calcCosts(orgType, size, salary, turnover);
  const { total, departures, costPerDeparture, visibleTotal, invisibleTotal,
          roiDepartureSavings, reducedRate, reducedDepartures, roiMode } = calc;
  const [visible, setVisible]       = useState(false);
  const [copied, setCopied]         = useState(false);
  const perMonth       = Math.round(total / 12);
  const pctChange      = Math.round(Math.abs(orgType.sectorMultiplier - 1) * 100);
  const sectorDir      = orgType.sectorMultiplier > 1 ? "higher" : orgType.sectorMultiplier < 1 ? "lower" : null;
  const visMaxPct      = Math.max(...VISIBLE_ITEMS.map(i => i.pct));
  const invMaxPct      = Math.max(...INVISIBLE_ITEMS.map(i => i.pct));
  const currentRateDisplay = Math.round(turnover.rate * 100);

  // Time framing — express total cost as months of a full salary
  const salaryMonths   = Math.round((total / salary.midpoint) * 12);
  const fullSalaries   = (total / salary.midpoint).toFixed(1);

  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

  const handlePrint = () => window.print();

  const handleCopy = () => {
    const text = [
      `HR TURNOVER COST ESTIMATE — ${orgType.label.toUpperCase()}`,
      `Generated by Filament Essential Services`,
      ``,
      `ESTIMATED ANNUAL TURNOVER COST: $${total.toLocaleString()}`,
      `That's roughly $${perMonth.toLocaleString()}/month`,
      `Equivalent to ${salaryMonths} months of a full staff salary leaving every year`,
      ``,
      `Based on:`,
      `  • ${size.label} (est. ${size.employees} staff)`,
      `  • Avg. salary range: ${salary.label}`,
      `  • Turnover rate: ${turnover.label}`,
      `  • Est. departures/year: ${departures} at $${costPerDeparture.toLocaleString()} each`,
      ``,
      `COST BREAKDOWN:`,
      `  Costs you've probably counted:    $${visibleTotal.toLocaleString()}`,
      `  The costs no one tracks:          $${invisibleTotal.toLocaleString()}`,
      ``,
      `RETENTION ROI:`,
      roiMode === "projection"
        ? `  Reducing turnover by 5 points (to ${Math.round(reducedRate * 100)}%) would save approx. $${roiDepartureSavings.toLocaleString()}/year`
        : `  Every departure you prevent saves your organization $${costPerDeparture.toLocaleString()}`,
      ``,
      `Filament Essential Services — filamentservices.org`,
    ].join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "all 0.5s ease" }}>

      {/* ── Hero ── */}
      <div id="print-hero" style={{ background: C.cardGradNavy, borderRadius: "16px", boxShadow: C.shadowNavy, padding: "40px 32px 36px", textAlign: "center", marginBottom: "16px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,173,176,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,173,176,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "16px" }}>Estimated annual turnover cost</p>
        <div style={{ fontFamily: "'Lora', serif", fontSize: "clamp(52px, 11vw, 80px)", fontWeight: 700, color: C.teal, lineHeight: 1, letterSpacing: "-0.02em" }}>
          <AnimatedNumber value={total} />
        </div>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.55)", marginTop: "14px", lineHeight: 1.6 }}>
          Roughly <strong style={{ color: "rgba(255,255,255,0.85)" }}>${perMonth.toLocaleString()}/month</strong> in costs that never appear on a single budget line
        </p>
        {sectorDir && (
          <div style={{ display: "inline-block", marginTop: "18px", background: "rgba(0,173,176,0.15)", border: "1px solid rgba(0,173,176,0.35)", borderRadius: "100px", padding: "5px 16px", fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: C.teal }}>
            {orgType.label} orgs run ~{pctChange}% {sectorDir} than the nonprofit average
          </div>
        )}
      </div>

      {/* ── Context ── */}
      <p style={{ fontFamily: "'Lora', serif", fontSize: "15px", fontStyle: "italic", color: C.textMuted, textAlign: "center", margin: "4px 0 20px", lineHeight: 1.7, padding: "0 8px" }}>
        Based on <strong style={{ fontStyle: "normal", color: C.textMid }}>{departures} departure{departures !== 1 ? "s" : ""}/year</strong> at <strong style={{ fontStyle: "normal", color: C.textMid }}>${costPerDeparture.toLocaleString()} each</strong>
      </p>

      {/* ── TIME FRAMING ── */}
      <div style={{ background: C.cardGrad, border: `1px solid ${C.border}`, borderRadius: "12px", boxShadow: C.shadowSm, padding: "20px 24px", marginBottom: "16px" }}>
        <SectionLabel text="Another way to see it" />
        <div style={{ display: "flex", alignItems: "stretch", gap: "14px" }}>
          <div style={{ width: "4px", borderRadius: "2px", background: C.navy, flexShrink: 0 }} />
          <div>
            <p style={{ fontFamily: "'Lora', serif", fontSize: "18px", fontWeight: 700, color: C.navy, lineHeight: 1.35, marginBottom: "8px" }}>
              That's the equivalent of <span style={{ color: C.teal }}>{salaryMonths} months of a full staff salary</span> walking out the door every year.
            </p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: C.textMuted, lineHeight: 1.7 }}>
              In other words, turnover is quietly consuming the equivalent of <strong style={{ color: C.textMid }}>{fullSalaries} full-time salaries</strong> annually — not as a line item anyone approved, but as a cost absorbed invisibly across your organization.
            </p>
          </div>
        </div>
      </div>

      {/* ── Visible / Invisible split ── */}
      <div style={{ background: C.cardGrad, border: `1px solid ${C.border}`, borderRadius: "12px", boxShadow: C.shadowSm, marginBottom: "10px", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.borderLight}`, background: C.cardGradAlt, gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "stretch", gap: "14px" }}>
            <div style={{ width: "4px", borderRadius: "2px", background: C.navy, flexShrink: 0 }} />
            <div>
              <p style={{ fontFamily: "'Lora', serif", fontSize: "19px", fontWeight: 700, color: C.navy, lineHeight: 1.2, marginBottom: "4px" }}>Costs you've probably counted</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: C.textFaint, fontWeight: 400 }}>The line items that show up in a budget</p>
            </div>
          </div>
          <div style={{ fontFamily: "'Lora', serif", fontSize: "28px", fontWeight: 700, color: C.navy, flexShrink: 0 }}>${visibleTotal.toLocaleString()}</div>
        </div>
        <div style={{ padding: "18px 22px 20px" }}>
          {VISIBLE_ITEMS.map((item, i) => (
            <CostRow key={item.label} label={item.label} amount={Math.round(total * item.pct)}
              example={item.example} barColor={C.navy}
              barPct={(item.pct / visMaxPct) * 100} delay={i * 80} />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "6px 0 10px" }}>
        <div style={{ flex: 1, height: "1px", background: C.border }} />
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700, color: C.textFaint, letterSpacing: "0.12em", whiteSpace: "nowrap" }}>PLUS THE PART MOST LEADERS MISS</span>
        <div style={{ flex: 1, height: "1px", background: C.border }} />
      </div>

      <div style={{ background: C.cardGradTeal, border: `1.5px solid ${C.tealBorder}`, borderRadius: "12px", boxShadow: C.shadowTeal, overflow: "hidden", marginBottom: "12px" }}>
        <div style={{ padding: "20px 24px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.tealBorder}`, gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "stretch", gap: "14px" }}>
            <div style={{ width: "4px", borderRadius: "2px", background: C.teal, flexShrink: 0 }} />
            <div>
              <p style={{ fontFamily: "'Lora', serif", fontSize: "19px", fontWeight: 700, color: C.tealDark, lineHeight: 1.2, marginBottom: "4px" }}>The costs no one tracks — but everyone feels</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: C.tealDark, opacity: 0.65, fontWeight: 400 }}>These never appear on a single budget line</p>
            </div>
          </div>
          <div style={{ fontFamily: "'Lora', serif", fontSize: "28px", fontWeight: 700, color: C.teal, flexShrink: 0 }}>${invisibleTotal.toLocaleString()}</div>
        </div>
        <div style={{ padding: "18px 22px 20px" }}>
          {INVISIBLE_ITEMS.map((item, i) => (
            <CostRow key={item.label} label={item.label} amount={Math.round(total * item.pct)}
              example={item.example} barColor={C.teal}
              barPct={(item.pct / invMaxPct) * 100} delay={300 + i * 80} />
          ))}
        </div>
      </div>

      {/* ── Aha callout ── */}
      <div style={{ background: C.navyLight, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "16px 20px", marginBottom: "16px", boxShadow: C.shadowSm }}>
        <p style={{ fontFamily: "'Lora', serif", fontSize: "14px", fontStyle: "italic", color: C.navy, lineHeight: 1.75, textAlign: "center" }}>
          Most leaders have only ever mentally budgeted <strong style={{ fontStyle: "normal" }}>${visibleTotal.toLocaleString()}</strong>. The other <strong style={{ fontStyle: "normal", color: C.tealDark }}>${invisibleTotal.toLocaleString()}</strong> is just as real — scattered across timesheets, morale, and muscle memory that no one ever measured.
        </p>
      </div>

      {/* ── RETENTION ROI ── */}
      <div style={{ background: C.tealLight, border: `1.5px solid ${C.tealBorder}`, borderRadius: "12px", boxShadow: C.shadowTeal, padding: "20px 24px", marginBottom: "16px" }}>
        <SectionLabel text="Retention ROI" />
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <div style={{ flexShrink: 0, width: "4px", alignSelf: "stretch", borderRadius: "2px", background: C.teal }} />
          {roiMode === "projection" ? (
            <div>
              <p style={{ fontFamily: "'Lora', serif", fontSize: "18px", fontWeight: 700, color: C.tealDark, lineHeight: 1.3, marginBottom: "6px" }}>
                Reducing turnover by just 5 points saves <span style={{ color: C.teal }}>${roiDepartureSavings.toLocaleString()}/year</span>
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: C.textMid, lineHeight: 1.7 }}>
                Moving from <strong>{currentRateDisplay}%</strong> to <strong>{Math.round(reducedRate * 100)}%</strong> would mean <strong>{departures - reducedDepartures} fewer departure{departures - reducedDepartures !== 1 ? "s" : ""}</strong> per year — at ${costPerDeparture.toLocaleString()} each. Targeted retention efforts that cost less than this represent a direct net gain.
              </p>
            </div>
          ) : (
            <div>
              <p style={{ fontFamily: "'Lora', serif", fontSize: "18px", fontWeight: 700, color: C.tealDark, lineHeight: 1.3, marginBottom: "6px" }}>
                Every departure you prevent saves your organization <span style={{ color: C.teal }}>${costPerDeparture.toLocaleString()}</span>
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: C.textMid, lineHeight: 1.7 }}>
                At your current scale, your turnover cost is already relatively contained — but that also means each departure carries significant individual weight. Retention investments that cost less than ${costPerDeparture.toLocaleString()} per person pay for themselves immediately.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── RISK PROFILE ── */}
      <div style={{ background: C.cardGrad, border: `1px solid ${C.border}`, borderRadius: "12px", boxShadow: C.shadow, marginBottom: "16px", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px 18px", borderBottom: `1px solid ${C.borderLight}`, background: C.cardGradAlt }}>
          <SectionLabel text={`${orgType.label} Turnover Risk Profile`} />
          <p style={{ fontFamily: "'Lora', serif", fontSize: "18px", fontWeight: 700, color: C.navy, lineHeight: 1.3 }}>
            Common turnover drivers in {orgType.label} organizations
          </p>
        </div>
        <div style={{ padding: "20px 24px" }}>
          {orgType.risks.map((risk, i) => (
            <div key={risk.factor} style={{ display: "flex", gap: "14px", marginBottom: i < orgType.risks.length - 1 ? "18px" : 0, paddingBottom: i < orgType.risks.length - 1 ? "18px" : 0, borderBottom: i < orgType.risks.length - 1 ? `1px solid ${C.borderLight}` : "none" }}>
              <div style={{ flexShrink: 0, width: "26px", height: "26px", background: C.navyLight, borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 700, color: C.navy, marginTop: "1px" }}>
                {i + 1}
              </div>
              <div>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700, color: C.navy, marginBottom: "4px" }}>{risk.factor}</p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: C.textMuted, lineHeight: 1.65 }}>{risk.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* First Steps */}
        <div style={{ padding: "18px 24px 20px", borderTop: `1px solid ${C.borderLight}`, background: C.navyLight }}>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.navy, marginBottom: "12px" }}>Where to start</p>
          {orgType.firstSteps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0, width: "18px", height: "18px", background: C.teal, borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "1px", background: "#fff" }} />
              </div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: C.textMid, lineHeight: 1.65 }}>{step}</p>
            </div>
          ))}
          {/* Filament bridge */}
          <div style={{ marginTop: "18px", paddingTop: "16px", borderTop: `1px solid ${C.border}`, display: "flex", gap: "14px", alignItems: "stretch" }}>
            <div style={{ width: "3px", borderRadius: "2px", background: C.teal, flexShrink: 0 }} />
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: C.navy, lineHeight: 1.7, fontStyle: "italic" }}>
              {orgType.filamentBridge}
            </p>
          </div>
        </div>
      </div>

      {/* ── Methodology ── */}
      <MethodologyAccordion orgType={orgType} size={size} salary={salary} turnover={turnover} calc={calc} />

      {/* ── CTA ── */}
      <div style={{ background: C.cardGrad, border: `1px solid ${C.border}`, borderRadius: "14px", boxShadow: C.shadow, padding: "32px", textAlign: "center", marginBottom: "20px" }}>
        <p style={{ fontFamily: "'Lora', serif", fontSize: "22px", color: C.navy, marginBottom: "10px", lineHeight: 1.4 }}>Ready to stop the bleeding?</p>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: C.textMuted, lineHeight: 1.8, maxWidth: "420px", margin: "0 auto" }}>
          You now have the number, the risk factors, and the first steps. Filament provides HR support across recruitment, compliance, performance management, and benefits administration — the building blocks that reduce turnover and keep great people in place.
        </p>
      </div>

      {/* ── Actions ── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", paddingBottom: "24px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <PressButton variant="ghost" onClick={handlePrint}>
            Print / Save PDF
          </PressButton>
          <PressButton variant={copied ? "ghostTeal" : "ghost"} onClick={handleCopy}>
            {copied ? "Copied!" : "Copy Summary"}
          </PressButton>
        </div>
        <PressButton variant="outline" onClick={onReset}>
          ↺ Start Over
        </PressButton>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: C.textFaint }}>Try different inputs to explore other scenarios</p>
      </div>
    </div>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: "orgType",  question: "What type of nonprofit do you run?",       sub: "Each sector has distinct turnover dynamics — this shapes how we calibrate the estimate." },
  { id: "size",     question: "How many paid staff members do you have?",  sub: "A rough count is fine. We'll calculate departures from there." },
  { id: "salary",   question: "What's your typical staff salary range?",   sub: "Think about the average across your team, not the highest or lowest paid." },
  { id: "turnover", question: "How would you describe your annual staff turnover?", sub: "If you're unsure, 'Typical' is a reasonable starting point for most nonprofits." },
];
const OPTIONS_MAP = {
  orgType:  { options: ORG_TYPES,      columns: 4 },
  size:     { options: ORG_SIZES,      columns: 3 },
  salary:   { options: SALARY_RANGES,  columns: 3 },
  turnover: { options: TURNOVER_RATES, columns: 2 },
};

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [step,    setStep]    = useState(0);
  const [answers, setAnswers] = useState({ orgType: null, size: null, salary: null, turnover: null });
  const [done,    setDone]    = useState(false);
  const [animIn,  setAnimIn]  = useState(true);

  const stepKey       = STEPS[step]?.id;
  const currentAnswer = answers[stepKey];
  const canContinue   = !!currentAnswer;
  const go = fn => { setAnimIn(false); setTimeout(() => { fn(); setAnimIn(true); }, 220); };

  return (
    <>
      <style>{`
        ${FONTS}
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #ffffff; }
        button:focus-visible { outline: 2px solid ${C.teal}; outline-offset: 2px; }
        @media print {
          body { background: white !important; }
          button, .no-print { display: none !important; }
          * { box-shadow: none !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center", padding: "0 20px 80px" }}>

        {/* Page title */}
        <div style={{ width: "100%", maxWidth: "660px", padding: "48px 0 0", marginBottom: "8px", textAlign: "center" }}>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: C.teal, marginBottom: "10px" }}>Filament Essential Services</p>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: "clamp(28px, 6vw, 42px)", fontWeight: 700, color: C.navy, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
            HR Turnover Cost Calculator
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", color: C.textMuted, marginTop: "10px", lineHeight: 1.65, maxWidth: "500px", margin: "10px auto 0" }}>
            Find out what staff turnover is actually costing your organization — including the costs that never show up on a budget line.
          </p>
          {!done && (
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600, color: C.teal, marginTop: "14px", letterSpacing: "0.03em" }}>
              4 questions &nbsp;·&nbsp; No research required &nbsp;·&nbsp; Results in under a minute
            </p>
          )}
          <div style={{ width: "48px", height: "3px", background: `linear-gradient(90deg, ${C.navy}, ${C.teal})`, borderRadius: "2px", margin: "16px auto 0" }} />
        </div>

        {/* Step counter */}
        {!done && (
          <div className="no-print" style={{ width: "100%", maxWidth: "660px", padding: "20px 0 0", display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: C.textFaint, fontWeight: 500 }}>
              Step <span style={{ color: C.navy, fontWeight: 700 }}>{step + 1}</span> of {STEPS.length}
            </div>
          </div>
        )}

        {/* Progress bar */}
        {!done && (
          <div className="no-print" style={{ width: "100%", maxWidth: "660px", height: "4px", background: C.grayLight, borderRadius: "2px", marginBottom: "32px", overflow: "hidden", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.06)" }}>
            <div style={{ height: "100%", width: `${((step + 1) / STEPS.length) * 100}%`, background: `linear-gradient(90deg, ${C.navy}, ${C.teal})`, borderRadius: "2px", transition: "width 0.4s ease" }} />
          </div>
        )}

        {/* Main content */}
        <div style={{ width: "100%", maxWidth: "660px", opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(10px)", transition: "all 0.22s ease" }}>
          {done ? (
            <ResultScreen
              orgType={answers.orgType} size={answers.size}
              salary={answers.salary}  turnover={answers.turnover}
              onReset={() => go(() => { setDone(false); setStep(0); setAnswers({ orgType: null, size: null, salary: null, turnover: null }); })}
            />
          ) : (
            <div style={{ background: C.cardGrad, borderRadius: "16px", boxShadow: C.shadowLg, overflow: "hidden" }}>
              <div style={{ height: "5px", background: `linear-gradient(90deg, ${C.navy}, ${C.teal})` }} />
              <div style={{ padding: "36px 32px 32px" }}>
                <h1 style={{ fontFamily: "'Lora', serif", fontSize: "clamp(22px, 4.5vw, 30px)", fontWeight: 700, color: C.navy, lineHeight: 1.3, marginBottom: "8px" }}>
                  {STEPS[step].question}
                </h1>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: C.textMuted, marginBottom: "28px", lineHeight: 1.65 }}>
                  {STEPS[step].sub}
                </p>
                <OptionGrid
                  options={OPTIONS_MAP[stepKey].options}
                  value={currentAnswer}
                  onChange={v => setAnswers(prev => ({ ...prev, [stepKey]: v }))}
                  columns={OPTIONS_MAP[stepKey].columns}
                />
                <div style={{ marginTop: "28px" }}>
                  <PressButton
                    variant="primary"
                    onClick={() => go(() => { if (step < STEPS.length - 1) setStep(s => s + 1); else setDone(true); })}
                    disabled={!canContinue}
                  >
                    {step < STEPS.length - 1 ? "Continue →" : "Show me the number →"}
                  </PressButton>
                </div>
                {step > 0 && (
                  <div style={{ textAlign: "center", marginTop: "14px" }}>
                    <PressButton variant="ghost" onClick={() => go(() => setStep(s => s - 1))}
                      style={{ padding: "8px 20px", fontSize: "13px", color: C.textFaint }}>
                      ← Back
                    </PressButton>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <p className="no-print" style={{ marginTop: "28px", fontFamily: "Inter, sans-serif", fontSize: "10px", color: C.textFaint, textAlign: "center", letterSpacing: "0.04em" }}>
          Estimates based on SHRM, Center for American Progress & Nonprofit HR research
        </p>
      </div>
    </>
  );
}
