import { useState, useEffect, useRef } from "react";

const arduinoCode = `// IR Alert System — Intelligent Proximity Alarm
// Arduino Uno Sketch

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Pin Definitions
const int IR_PIN    = 2;
const int BUZZER    = 8;
const int LED_PIN   = 13;

// LCD: I2C address 0x27, 16 columns, 2 rows
LiquidCrystal_I2C lcd(0x27, 16, 2);

bool lastState = HIGH;

void setup() {
  pinMode(IR_PIN,  INPUT);
  pinMode(BUZZER,  OUTPUT);
  pinMode(LED_PIN, OUTPUT);

  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("  IR Alert Sys  ");
  lcd.setCursor(0, 1);
  lcd.print("   Standby...   ");

  Serial.begin(9600);
  delay(1500);
}

void loop() {
  bool detected = (digitalRead(IR_PIN) == LOW);

  if (detected && lastState == HIGH) {
    // Object detected
    digitalWrite(LED_PIN, HIGH);
    tone(BUZZER, 1000, 300);

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(" >> ALERT! <<   ");
    lcd.setCursor(0, 1);
    lcd.print("Object Detected ");

    Serial.println("ALERT: Object in range");
  }

  if (!detected && lastState == LOW) {
    // Zone cleared
    digitalWrite(LED_PIN, LOW);
    noTone(BUZZER);

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("  IR Alert Sys  ");
    lcd.setCursor(0, 1);
    lcd.print("   Standby...   ");

    Serial.println("Zone cleared.");
  }

  lastState = detected ? LOW : HIGH;
  delay(50);
}`;

const components = [
  {
    id: "arduino",
    icon: "⬡",
    name: "Arduino Uno",
    subtitle: "Microcontroller Board",
    specs: ["ATmega328P @ 16 MHz", "14 Digital I/O pins", "6 PWM outputs", "5V / 3.3V power rails"],
    color: "#0f766e",
    bg: "#f0fdfa",
    border: "#99f6e4",
  },
  {
    id: "ir",
    icon: "◎",
    name: "IR Sensor Module",
    subtitle: "FC-51 / TCRT5000",
    specs: ["Digital output signal", "Detection range 2–30 cm", "Adjustable via potentiometer", "3-pin interface"],
    color: "#0369a1",
    bg: "#f0f9ff",
    border: "#bae6fd",
  },
  {
    id: "buzzer",
    icon: "◉",
    name: "Passive Buzzer",
    subtitle: "PWM-driven Alarm",
    specs: ["5V operating voltage", "Frequency: 1–5 kHz", "Controlled via tone()", "Pin 8 trigger"],
    color: "#b45309",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  {
    id: "led",
    icon: "●",
    name: "5mm LED + Resistor",
    subtitle: "Visual Indicator",
    specs: ["220Ω current-limiting resistor", "Red indicator LED", "Vf ≈ 2V forward voltage", "Pin 13 output"],
    color: "#dc2626",
    bg: "#fff1f2",
    border: "#fecdd3",
  },
  {
    id: "lcd",
    icon: "▤",
    name: "I²C LCD 16×2",
    subtitle: "Status Display",
    specs: ["I²C address: 0x27", "16 columns × 2 rows", "SDA → A4, SCL → A5", "Built-in backlight"],
    color: "#7c3aed",
    bg: "#faf5ff",
    border: "#ddd6fe",
  },
  {
    id: "breadboard",
    icon: "⊞",
    name: "Breadboard & Wires",
    subtitle: "Prototyping Platform",
    specs: ["Half-size breadboard", "Jumper wire set M-M", "400 tie-point grid", "No soldering required"],
    color: "#374151",
    bg: "#f9fafb",
    border: "#e5e7eb",
  },
];

const wiring = [
  { component: "IR Sensor", pin: "VCC", arduino: "5V", note: "Power" },
  { component: "IR Sensor", pin: "GND", arduino: "GND", note: "Ground" },
  { component: "IR Sensor", pin: "OUT", arduino: "Digital Pin 2", note: "Digital input" },
  { component: "Buzzer", pin: "+", arduino: "Digital Pin 8", note: "PWM tone output" },
  { component: "Buzzer", pin: "−", arduino: "GND", note: "Ground" },
  { component: "LED", pin: "Anode (+)", arduino: "Digital Pin 13 → 220Ω", note: "With resistor in series" },
  { component: "LED", pin: "Cathode (−)", arduino: "GND", note: "Ground" },
  { component: "LCD (I²C)", pin: "VCC", arduino: "5V", note: "Power" },
  { component: "LCD (I²C)", pin: "GND", arduino: "GND", note: "Ground" },
  { component: "LCD (I²C)", pin: "SDA", arduino: "Analog Pin A4", note: "I²C data" },
  { component: "LCD (I²C)", pin: "SCL", arduino: "Analog Pin A5", note: "I²C clock" },
];

function TokenizedCode({ code }) {
  const keywords = ["void", "bool", "int", "const", "true", "false", "HIGH", "LOW", "if", "return", "delay", "include"];
  const functions = ["setup", "loop", "pinMode", "digitalWrite", "digitalRead", "tone", "noTone", "Serial", "println", "print", "init", "backlight", "setCursor", "clear", "begin"];

  const lines = code.split("\n");

  return (
    <div className="font-mono text-sm leading-relaxed">
      {lines.map((line, i) => {
        const isComment = line.trim().startsWith("//");
        const isDirective = line.trim().startsWith("#");

        if (isComment) return (
          <div key={i} className="flex">
            <span className="select-none w-10 text-right pr-4 text-slate-500 shrink-0">{i + 1}</span>
            <span className="text-slate-400 italic">{line}</span>
          </div>
        );

        if (isDirective) return (
          <div key={i} className="flex">
            <span className="select-none w-10 text-right pr-4 text-slate-500 shrink-0">{i + 1}</span>
            <span className="text-teal-400">{line}</span>
          </div>
        );

        // Simple tokenizer
        let rendered = line;
        return (
          <div key={i} className="flex">
            <span className="select-none w-10 text-right pr-4 text-slate-500 shrink-0">{i + 1}</span>
            <span className="text-slate-200 whitespace-pre">{line}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function IRAlertSystem() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const codeRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(arduinoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        * { box-sizing: border-box; }
        body { margin: 0; }

        .font-display { font-family: 'DM Serif Display', serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        .font-mono { font-family: 'DM Mono', monospace; }

        .card-hover {
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .nav-link {
          position: relative;
          color: #374151;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: color 0.2s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1.5px;
          background: #0f766e;
          transition: width 0.25s ease;
        }
        .nav-link:hover { color: #0f766e; }
        .nav-link:hover::after { width: 100%; }

        .pulse-dot {
          animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(15, 118, 110, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(15, 118, 110, 0); }
          100% { box-shadow: 0 0 0 0 rgba(15, 118, 110, 0); }
        }

        .hero-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .table-row:hover td {
          background: #f0fdfa;
        }
        .table-row td {
          transition: background 0.15s;
        }

        .fade-in {
          opacity: 0;
          transform: translateY(16px);
          animation: fadeIn 0.6s ease forwards;
        }
        @keyframes fadeIn {
          to { opacity: 1; transform: translateY(0); }
        }

        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }

        .scrollbar-thin::-webkit-scrollbar { height: 4px; width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: #1e293b; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #0f766e; border-radius: 2px; }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 font-body"
        style={{
          background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid #f1f5f9" : "1px solid transparent",
          transition: "all 0.3s ease",
          padding: "0 1.5rem",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="pulse-dot w-2.5 h-2.5 rounded-full"
              style={{ background: "#0f766e" }}
            />
            <span className="font-display text-xl tracking-tight" style={{ color: "#0f2027" }}>
              IR Alert<span style={{ color: "#0f766e" }}>.</span>
            </span>
          </div>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {["Overview", "Components", "Wiring", "Code"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">
                {item}
              </a>
            ))}
          </nav>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg"
            aria-label="Toggle menu"
            style={{ background: menuOpen ? "#f0fdfa" : "transparent" }}
          >
            <span
              className="block h-0.5 w-5 rounded"
              style={{
                background: "#0f2027",
                transform: menuOpen ? "rotate(45deg) translate(3px, 3px)" : "none",
                transition: "transform 0.2s",
              }}
            />
            <span
              className="block h-0.5 rounded"
              style={{
                background: "#0f2027",
                width: menuOpen ? "0" : "1.25rem",
                transition: "width 0.2s",
              }}
            />
            <span
              className="block h-0.5 w-5 rounded"
              style={{
                background: "#0f2027",
                transform: menuOpen ? "rotate(-45deg) translate(3px, -3px)" : "none",
                transition: "transform 0.2s",
              }}
            />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden font-body border-t"
            style={{ borderColor: "#f1f5f9", background: "rgba(255,255,255,0.97)" }}
          >
            {["Overview", "Components", "Wiring", "Code"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-3.5 text-sm font-medium"
                style={{ color: "#374151", borderBottom: "1px solid #f9fafb" }}
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section
        id="overview"
        className="pt-32 pb-24 px-6 font-body"
        style={{
          background: "linear-gradient(160deg, #f9fafb 0%, #ffffff 50%, #f0fdfa 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 fade-in"
                style={{ background: "#f0fdfa", color: "#0f766e", border: "1px solid #99f6e4" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                Arduino Project · Proximity Detection
              </div>

              <h1
                className="font-display text-5xl md:text-6xl leading-tight mb-6 fade-in stagger-1"
                style={{ color: "#0f2027" }}
              >
                IR Alert<br />
                <span style={{ color: "#0f766e" }}>System</span>
              </h1>

              <p
                className="text-lg leading-relaxed mb-8 fade-in stagger-2"
                style={{ color: "#6b7280", maxWidth: "440px" }}
              >
                An <strong style={{ color: "#374151", fontWeight: 600 }}>Intelligent Proximity Security Alarm</strong> built
                with Arduino Uno. Using infrared detection, it triggers real-time visual and audio alerts
                whenever an object enters the monitored zone.
              </p>

              <div className="flex flex-wrap gap-3 fade-in stagger-3">
                <a
                  href="#code"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "#0f766e", boxShadow: "0 4px 14px rgba(15,118,110,0.3)" }}
                >
                  View Code →
                </a>
                <a
                  href="#components"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ color: "#374151", background: "white", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                >
                  Components
                </a>
              </div>
            </div>

            {/* Diagram illustration */}
            <div className="flex justify-center hero-float">
              <div
                className="relative rounded-3xl p-8"
                style={{
                  background: "white",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)",
                  width: "340px",
                }}
              >
                {/* Arduino board visual */}
                <div
                  className="rounded-2xl p-5 mb-4"
                  style={{ background: "#0f2027" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-400 font-mono">ARDUINO UNO</span>
                    <div className="w-2 h-2 rounded-full" style={{ background: "#0f766e", boxShadow: "0 0 8px #0f766e" }} />
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-3">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-5 rounded-sm flex items-center justify-center"
                        style={{
                          background: i === 2 ? "#0f766e" : i === 8 ? "#b45309" : i === 13 ? "#dc2626" : "#1e293b",
                        }}
                      >
                        <span className="text-[7px] text-slate-500">{i}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 justify-between text-[9px] font-mono">
                    <span className="text-teal-400">D2 — IR</span>
                    <span className="text-amber-400">D8 — BZR</span>
                    <span className="text-red-400">D13 — LED</span>
                  </div>
                </div>

                {/* Status display */}
                <div
                  className="rounded-xl p-3 font-mono text-xs"
                  style={{ background: "#f0fdfa", border: "1px solid #99f6e4" }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#0f766e" }} />
                    <span className="text-slate-500">LCD 16×2 @ 0x27</span>
                  </div>
                  <div className="text-center py-2" style={{ color: "#0f766e" }}>
                    <div>  IR Alert Sys  </div>
                    <div>   Standby...   </div>
                  </div>
                </div>

                {/* Sensor modules row */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {[
                    { label: "IR", color: "#0369a1", bg: "#f0f9ff" },
                    { label: "BZR", color: "#b45309", bg: "#fffbeb" },
                    { label: "LED", color: "#dc2626", bg: "#fff1f2" },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="rounded-lg p-2 text-center text-xs font-semibold font-mono"
                      style={{ background: m.bg, color: m.color }}
                    >
                      {m.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 pt-8"
            style={{ borderTop: "1px solid #e5e7eb" }}
          >
            {[
              { value: "6", label: "Components" },
              { value: "30cm", label: "Max Range" },
              { value: "I²C", label: "LCD Protocol" },
              { value: "16MHz", label: "Clock Speed" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-3xl" style={{ color: "#0f2027" }}>{s.value}</div>
                <div className="text-sm mt-1" style={{ color: "#9ca3af" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPONENTS ─────────────────────────────────────── */}
      <section id="components" className="py-24 px-6 font-body" style={{ background: "#f9fafb" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: "#0f766e" }}>
              Hardware
            </p>
            <h2 className="font-display text-4xl" style={{ color: "#0f2027" }}>
              Component Library
            </h2>
            <p className="mt-3 text-base" style={{ color: "#6b7280", maxWidth: "480px" }}>
              Each module plays a specific role. Click any card to highlight its specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {components.map((c) => (
              <div
                key={c.id}
                className="card-hover rounded-2xl p-6 cursor-pointer"
                onClick={() => setActiveCard(activeCard === c.id ? null : c.id)}
                style={{
                  background: activeCard === c.id ? c.bg : "white",
                  border: `1.5px solid ${activeCard === c.id ? c.border : "#f1f5f9"}`,
                  boxShadow: activeCard === c.id
                    ? `0 8px 30px rgba(0,0,0,0.08), 0 0 0 3px ${c.border}`
                    : "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
                  >
                    {c.icon}
                  </div>
                  <div
                    className="w-2 h-2 rounded-full mt-1.5"
                    style={{ background: activeCard === c.id ? c.color : "#d1d5db" }}
                  />
                </div>

                <h3 className="font-semibold text-base mb-0.5" style={{ color: "#0f2027" }}>
                  {c.name}
                </h3>
                <p className="text-xs mb-4" style={{ color: "#9ca3af" }}>{c.subtitle}</p>

                <ul className="space-y-1.5">
                  {c.specs.map((spec, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#6b7280" }}>
                      <span className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ background: c.color }} />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WIRING TABLE ───────────────────────────────────── */}
      <section id="wiring" className="py-24 px-6 font-body" style={{ background: "white" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: "#0f766e" }}>
              Connections
            </p>
            <h2 className="font-display text-4xl" style={{ color: "#0f2027" }}>
              Wiring Diagram
            </h2>
            <p className="mt-3 text-base" style={{ color: "#6b7280", maxWidth: "480px" }}>
              Connect each component to the Arduino Uno following the table below. Use the breadboard for ground and power rails.
            </p>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}
          >
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#0f2027" }}>
                    {["Component", "Pin / Terminal", "Arduino Connection", "Notes"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-xs font-semibold tracking-wide"
                        style={{ color: "#94a3b8" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {wiring.map((row, i) => (
                    <tr
                      key={i}
                      className="table-row"
                      style={{ borderBottom: "1px solid #f1f5f9" }}
                    >
                      <td className="px-5 py-3.5 font-semibold text-xs" style={{ color: "#0f2027" }}>
                        {row.component}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs" style={{ color: "#374151" }}>
                        {row.pin}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-medium"
                          style={{
                            background: row.arduino.includes("Pin 2") ? "#f0f9ff" :
                              row.arduino.includes("Pin 8") ? "#fffbeb" :
                              row.arduino.includes("Pin 13") ? "#fff1f2" :
                              row.arduino.includes("A4") || row.arduino.includes("A5") ? "#faf5ff" :
                              row.arduino.includes("5V") ? "#f0fdfa" : "#f9fafb",
                            color: row.arduino.includes("Pin 2") ? "#0369a1" :
                              row.arduino.includes("Pin 8") ? "#b45309" :
                              row.arduino.includes("Pin 13") ? "#dc2626" :
                              row.arduino.includes("A4") || row.arduino.includes("A5") ? "#7c3aed" :
                              row.arduino.includes("5V") ? "#0f766e" : "#374151",
                          }}
                        >
                          {row.arduino}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs" style={{ color: "#9ca3af" }}>
                        {row.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Breadboard tip */}
          <div
            className="mt-5 flex items-start gap-3 rounded-xl p-4 text-sm"
            style={{ background: "#f0fdfa", border: "1px solid #99f6e4" }}
          >
            <span className="text-lg mt-0.5">💡</span>
            <p style={{ color: "#0f766e" }}>
              <strong>Tip:</strong> Use the breadboard's power rails for 5V and GND distribution.
              Keep signal wires short to reduce noise on the IR sensor output.
            </p>
          </div>
        </div>
      </section>

      {/* ── CODE SNIPPET ───────────────────────────────────── */}
      <section id="code" className="py-24 px-6 font-body" style={{ background: "#f9fafb" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: "#0f766e" }}>
              Firmware
            </p>
            <h2 className="font-display text-4xl" style={{ color: "#0f2027" }}>
              Arduino Sketch
            </h2>
            <p className="mt-3 text-base" style={{ color: "#6b7280", maxWidth: "480px" }}>
              Upload this sketch via Arduino IDE. Requires the <code className="text-xs px-1.5 py-0.5 rounded" style={{ background: "#e5e7eb", color: "#374151" }}>LiquidCrystal_I2C</code> library.
            </p>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}
          >
            {/* Code toolbar */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ background: "#0a1628", borderBottom: "1px solid #1e293b" }}
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#ef4444" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#f59e0b" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#22c55e" }} />
                </div>
                <span className="ml-3 text-xs font-mono" style={{ color: "#475569" }}>ir_alert_system.ino</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: copied ? "#0f766e" : "#1e293b",
                  color: copied ? "white" : "#94a3b8",
                  border: "1px solid " + (copied ? "#0f766e" : "#334155"),
                }}
              >
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            </div>

            {/* Code body */}
            <div
              ref={codeRef}
              className="overflow-auto scrollbar-thin"
              style={{
                background: "#0f172a",
                padding: "1.5rem 1rem",
                maxHeight: "480px",
              }}
            >
              <pre className="font-mono text-sm leading-relaxed">
                {arduinoCode.split("\n").map((line, i) => {
                  const isComment = line.trim().startsWith("//");
                  const isDirective = line.trim().startsWith("#");
                  const isString = line.includes('"');

                  // Simple highlight
                  const kws = ["void", "bool", "int", "const", "true", "false", "HIGH", "LOW", "if", "return", "delay", "include"];

                  if (isComment) return (
                    <div key={i} className="flex">
                      <span className="select-none w-10 text-right pr-5 shrink-0" style={{ color: "#334155" }}>{i + 1}</span>
                      <span style={{ color: "#64748b", fontStyle: "italic" }}>{line}</span>
                    </div>
                  );
                  if (isDirective) return (
                    <div key={i} className="flex">
                      <span className="select-none w-10 text-right pr-5 shrink-0" style={{ color: "#334155" }}>{i + 1}</span>
                      <span style={{ color: "#2dd4bf" }}>{line}</span>
                    </div>
                  );

                  // Color certain tokens
                  let colored = line
                    .replace(/(void|bool|int|const|true|false|HIGH|LOW|return|delay)/g,
                      '<kw>$1</kw>')
                    .replace(/(setup|loop|pinMode|digitalWrite|digitalRead|tone|noTone|init|backlight|setCursor|clear|begin|println|print)/g,
                      '<fn>$1</fn>')
                    .replace(/"([^"]*)"/g, '<str>"$1"</str>')
                    .replace(/\b(\d+)\b/g, '<num>$1</num>');

                  return (
                    <div key={i} className="flex">
                      <span className="select-none w-10 text-right pr-5 shrink-0" style={{ color: "#334155" }}>{i + 1}</span>
                      <span
                        style={{ color: "#e2e8f0" }}
                        dangerouslySetInnerHTML={{
                          __html: colored
                            .replace(/<kw>/g, '<span style="color:#f472b6;font-weight:600">')
                            .replace(/<\/kw>/g, "</span>")
                            .replace(/<fn>/g, '<span style="color:#38bdf8">')
                            .replace(/<\/fn>/g, "</span>")
                            .replace(/<str>/g, '<span style="color:#86efac">')
                            .replace(/<\/str>/g, "</span>")
                            .replace(/<num>/g, '<span style="color:#fb923c">')
                            .replace(/<\/num>/g, "</span>")
                        }}
                      />
                    </div>
                  );
                })}
              </pre>
            </div>

            {/* Code footer */}
            <div
              className="flex items-center justify-between px-5 py-2.5 text-xs"
              style={{ background: "#0a1628", borderTop: "1px solid #1e293b", color: "#475569" }}
            >
              <span>Arduino C++ · ATmega328P</span>
              <span>Requires: Wire.h · LiquidCrystal_I2C.h</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer
        className="py-12 px-6 font-body"
        style={{ background: "#0f2027", borderTop: "1px solid #1e293b" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="pulse-dot w-2 h-2 rounded-full" style={{ background: "#0f766e" }} />
              <span className="font-display text-lg text-white">IR Alert System</span>
            </div>

            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
              style={{
                background: "rgba(15,118,110,0.12)",
                color: "#2dd4bf",
                border: "1px solid rgba(15,118,110,0.25)",
              }}
            >
              <span>🔬</span>
              Based in your lab / workspace
            </div>

            <p className="text-xs" style={{ color: "#475569" }}>
              Built with Arduino Uno · FC-51 IR · I²C LCD
            </p>
          </div>

          <div
            className="mt-8 pt-6 flex flex-wrap gap-6 justify-center"
            style={{ borderTop: "1px solid #1e293b" }}
          >
            {["Arduino Uno", "IR Sensor FC-51", "Passive Buzzer", "LED + 220Ω", "I²C LCD 16×2", "Breadboard"].map((item) => (
              <span key={item} className="text-xs" style={{ color: "#334155" }}>{item}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
