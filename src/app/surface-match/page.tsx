'use client';

import { useState, useRef, useCallback } from "react";

function thumbUrl(secureUrl: string, w = 400) {
  return secureUrl.replace("/upload/", `/upload/w_${w},c_fill,q_auto,f_auto/`);
}

function humanLabel(name: string = "") {
  return name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim();
}

function scoreColor(score: number) {
  if (score >= 0.85) return "#22c55e";
  if (score >= 0.70) return "#f59e0b";
  return "#94a3b8";
}

const STEPS = [
  {
    icon: "📸",
    title: "Snap or Upload",
    desc: "Take a photo of any surface — a wall, floor, countertop, furniture — or upload an existing image from your gallery.",
  },
  {
    icon: "🔍",
    title: "AI Scans the Library",
    desc: "Our AI visually compares your photo against the full Lamitak collection to find the closest design and colour matches.",
  },
  {
    icon: "✨",
    title: "Discover Your Match",
    desc: "Browse suggested Lamitak items with match scores. Each result shows the product code so you can order or request a sample.",
  },
];

const TIPS = [
  { icon: "💡", text: "Good lighting gives better results — natural light works best." },
  { icon: "🎯", text: "Fill the frame with the surface texture for highest accuracy." },
  { icon: "📐", text: "Flat, head-on shots match better than angled perspectives." },
];

const CLOUD_NAME = "varindo";

export default function SurfaceMatch() {
  const [phase, setPhase] = useState("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload an image file.");
      setPhase("error");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setPhase("uploading");
    setResults([]);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default");

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err?.error?.message || "Upload failed");
      }

      const uploadData = await uploadRes.json();
      const publicCloudinaryUrl = uploadData.secure_url;
      setPhase("searching");

      const response = await fetch("/api/surface-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: publicCloudinaryUrl })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error || "Search failed");
      }

      const data = await response.json();
      setResults(data.matches || []);
      setPhase("results");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setPhase("error");
    }
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) handleFile(file);
  };

  const reset = () => {
    setPhase("idle");
    setPreview(null);
    setResults([]);
    setErrorMsg("");
  };

  return (
    <div style={S.root}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        * { box-sizing: border-box; }
        .lam-btn-primary { background: linear-gradient(135deg,#c8a96e,#a07840) !important; }
        .lam-btn-primary:active { transform: scale(0.97); }
        .lam-btn-secondary:active { transform: scale(0.97); }
        .result-card:active { transform: scale(0.98); border-color: #c8a96e !important; }
      ` }} />

      <header style={S.header}>
        <div style={S.logoRow}>
          <div style={S.logoMark}>L</div>
          <div>
            <div style={S.logoText}>LAMITAK</div>
            <div style={S.tagline}>Surface Match</div>
          </div>
        </div>
      </header>

      <main style={S.main}>

        {phase === "idle" && (
          <div style={{ animation: "fadeUp 0.4s ease both" }}>

            <input id="browse-input" type="file" accept="image/jpeg,image/png"
              style={{ display: "none" }} onChange={onFileChange} />
            <input id="camera-input" type="file" accept="image/*" capture="environment"
              style={{ display: "none" }} onChange={onFileChange} />

            <div style={S.hero}>
              <div style={S.heroIcon}>
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <circle cx="28" cy="28" r="27" stroke="#c8a96e" strokeWidth="1.5" strokeDasharray="4 3"/>
                  <rect x="14" y="18" width="28" height="22" rx="3" fill="#1e1a14" stroke="#c8a96e" strokeWidth="1.5"/>
                  <circle cx="22" cy="26" r="4" stroke="#c8a96e" strokeWidth="1.5"/>
                  <path d="M14 34l8-6 6 5 5-4 9 7" stroke="#c8a96e" strokeWidth="1.5" strokeLinejoin="round"/>
                  <circle cx="38" cy="19" r="5" fill="#0f0e0c" stroke="#c8a96e" strokeWidth="1.5"/>
                  <path d="M38 16v6M35 19h6" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h1 style={S.heroTitle}>Find Your Perfect Surface</h1>
              <p style={S.heroSub}>
                Point your camera at any surface and instantly discover matching Lamitak designs from our full collection.
              </p>
              <div style={S.btnStack}>
                <label htmlFor="camera-input" style={S.btnPrimary} className="lam-btn-primary">
                  📷 Take a Photo
                </label>
                <label htmlFor="browse-input" style={S.btnSecondary} className="lam-btn-secondary">
                  🖼 Choose from Gallery
                </label>
              </div>
            </div>

            <div style={S.divider}>
              <div style={S.dividerLine} />
              <span style={S.dividerText}>How it works</span>
              <div style={S.dividerLine} />
            </div>

            <div style={S.stepsGrid}>
              {STEPS.map((step, i) => (
                <div key={i} style={{ ...S.stepCard, animationDelay: `${i * 80}ms` }}>
                  <div style={S.stepNumber}>{i + 1}</div>
                  <div style={S.stepIcon}>{step.icon}</div>
                  <div>
                    <div style={S.stepTitle}>{step.title}</div>
                    <div style={S.stepDesc}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={S.tipsBox}>
              <div style={S.tipsHeading}>📌 Tips for best results</div>
              {TIPS.map((tip, i) => (
                <div key={i} style={S.tipRow}>
                  <span style={S.tipIcon}>{tip.icon}</span>
                  <span style={S.tipText}>{tip.text}</span>
                </div>
              ))}
            </div>

            <div style={S.aboutBox}>
              <div style={S.aboutTitle}>About Lamitak</div>
              <p style={S.aboutText}>
                Lamitak is a premium range of high-pressure laminates (HPL) available in hundreds of colours,
                textures and finishes — from natural wood grains to solid mattes and stone effects.
                This tool helps you discover the closest match in our collection from a real-world photo.
              </p>
              <div style={S.collectionStats}>
                <div style={S.stat}><span style={S.statNum}>2,000+</span><span style={S.statLabel}>Designs</span></div>
                <div style={S.statDivider} />
                <div style={S.stat}><span style={S.statNum}>3</span><span style={S.statLabel}>Collections</span></div>
                <div style={S.statDivider} />
                <div style={S.stat}><span style={S.statNum}>AI</span><span style={S.statLabel}>Powered</span></div>
              </div>
            </div>

          </div>
        )}

        {phase !== "idle" && (
          <div style={{ animation: "fadeUp 0.35s ease both" }}>

            {preview && (
              <div style={S.previewWrap}>
                <img src={preview} alt="Your surface" style={S.previewImg} />
                <div style={S.previewGradient} />
                <div style={S.previewLabel}>Your Surface</div>
                <div style={S.statusBadge}>
                  {phase === "uploading" && <span style={{ ...S.pill, animation: "pulse 1.2s ease infinite" }}>⏫ Uploading…</span>}
                  {phase === "searching" && <span style={{ ...S.pill, animation: "pulse 1.2s ease infinite" }}>🔍 Matching…</span>}
                  {phase === "results" && <span style={{ ...S.pill, background: "#22c55e", color: "#fff" }}>✓ {results.length} match{results.length !== 1 ? "es" : ""}</span>}
                  {phase === "error" && <span style={{ ...S.pill, background: "#ef4444", color: "#fff" }}>✗ Error</span>}
                </div>
              </div>
            )}

            {(phase === "uploading" || phase === "searching") && (
              <div style={S.spinnerSection}>
                <div style={S.spinner} />
                <div style={S.spinnerText}>
                  {phase === "uploading" ? "Uploading your image…" : "Scanning Lamitak library…"}
                </div>
                <div style={S.spinnerSub}>
                  {phase === "searching" && "Comparing against 2,000+ designs"}
                </div>
              </div>
            )}

            {phase === "error" && (
              <div style={S.errorBox}>
                <div style={S.errorIcon}>⚠️</div>
                <p style={S.errorText}>{errorMsg}</p>
                <button style={S.btnRetry} onClick={reset}>Try again</button>
              </div>
            )}

            {phase === "results" && results.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div style={S.resultsHeader}>
                  <h2 style={S.resultsHeading}>Suggested Designs</h2>
                  <span style={S.resultsBadge}>{results.length} found</span>
                </div>
                <div style={S.grid}>
                  {results.map((r, i) => <ResultCard key={r.code || i} result={r} rank={i} />)}
                </div>
                <button style={S.btnNewSearch} onClick={reset}>← New Search</button>
              </div>
            )}

            {phase === "results" && results.length === 0 && (
              <div style={S.noResults}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔎</div>
                <p style={S.noResultsTitle}>No close matches found</p>
                <p style={S.noResultsSub}>Try a clearer photo with even lighting and less angle.</p>
                <button style={S.btnRetry} onClick={reset}>Try again</button>
              </div>
            )}

          </div>
        )}

      </main>

      <footer style={S.footer}>
        <div style={S.footerInner}>
          Powered by Cloudinary Visual Search
          <span style={S.footerDot}>·</span>
          Lamitak Collection
        </div>
      </footer>
    </div>
  );
}

function ResultCard({ result, rank }: { result: any; rank: number }) {
  const code = result.code || "Unknown";
  const label = humanLabel(result.name || code);
  const score = result.score ?? 0.75;
  const folderLabel = result.collection || result.category || "Lamitak";
  const imageUrl = result.imageUrl ? thumbUrl(result.imageUrl, 400) : null;

  return (
    <div className="result-card" style={{ ...S.card, animationDelay: `${rank * 70}ms` }}>
      {imageUrl
        ? <img src={imageUrl} alt={label} style={S.cardImg} onError={(e: any) => { e.target.style.display = "none"; }} />
        : <div style={S.cardImgPlaceholder}><span style={{ color: "#c8a96e", fontSize: 32 }}>◈</span></div>
      }
      <div style={S.cardBody}>
        <div style={S.cardMeta}>
          <span style={S.cardFolder}>{folderLabel}</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: scoreColor(score) }}>{Math.round(score * 100)}%</span>
        </div>
        <div style={S.cardCode}>{code}</div>
        {label !== code && <div style={S.cardLabel}>{label}</div>}
      </div>
    </div>
  );
}

const S = {
  root: { minHeight: "100vh", background: "#0f0e0c", fontFamily: "'DM Sans', sans-serif", color: "#e8e0d4", display: "flex", flexDirection: "column" },
  header: { padding: "16px 20px", borderBottom: "1px solid #1e1c18", background: "#0d0c0a" },
  logoRow: { display: "flex", alignItems: "center", gap: 12 },
  logoMark: { width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#c8a96e,#7a5230)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, color: "#fff", flexShrink: 0 },
  logoText: { fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 600, letterSpacing: 5, color: "#e8e0d4", lineHeight: 1 },
  tagline: { fontSize: 9, letterSpacing: 3, color: "#c8a96e", textTransform: "uppercase", marginTop: 2 },
  main: { flex: 1, padding: "24px 16px 40px", maxWidth: 520, margin: "0 auto", width: "100%" },
  hero: { textAlign: "center", padding: "8px 0 28px" },
  heroIcon: { margin: "0 auto 20px", width: 56, height: 56 },
  heroTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 600, color: "#e8e0d4", margin: "0 0 12px", lineHeight: 1.2 },
  heroSub: { fontSize: 14, color: "#8a8070", lineHeight: 1.6, margin: "0 0 28px", padding: "0 8px" },
  btnStack: { display: "flex", flexDirection: "column", gap: 12, maxWidth: 320, margin: "0 auto" },
  btnPrimary: { display: "block", padding: "16px 24px", background: "linear-gradient(135deg,#c8a96e,#a07840)", borderRadius: 12, color: "#0f0e0c", fontSize: 16, fontWeight: 600, cursor: "pointer", textAlign: "center", letterSpacing: 0.3, transition: "transform 0.15s", userSelect: "none" },
  btnSecondary: { display: "block", padding: "14px 24px", background: "transparent", border: "1.5px solid #3a3530", borderRadius: 12, color: "#c8a96e", fontSize: 15, cursor: "pointer", textAlign: "center", letterSpacing: 0.3, transition: "transform 0.15s", userSelect: "none" },
  divider: { display: "flex", alignItems: "center", gap: 12, margin: "8px 0 24px" },
  dividerLine: { flex: 1, height: 1, background: "#2a2620" },
  dividerText: { fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#4a4540", whiteSpace: "nowrap" },
  stepsGrid: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 },
  stepCard: { display: "flex", alignItems: "flex-start", gap: 14, background: "#141210", border: "1px solid #222018", borderRadius: 14, padding: "16px", animation: "fadeUp 0.4s ease both" },
  stepNumber: { width: 22, height: 22, borderRadius: "50%", background: "#c8a96e20", border: "1px solid #c8a96e60", color: "#c8a96e", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 },
  stepIcon: { fontSize: 22, flexShrink: 0 },
  stepTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 600, color: "#e8e0d4", marginBottom: 4 },
  stepDesc: { fontSize: 13, color: "#7a7060", lineHeight: 1.55 },
  tipsBox: { background: "#141210", border: "1px solid #1e1c18", borderRadius: 14, padding: "16px", marginBottom: 20 },
  tipsHeading: { fontSize: 12, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", color: "#c8a96e", marginBottom: 12 },
  tipRow: { display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 },
  tipIcon: { fontSize: 14, flexShrink: 0, marginTop: 1 },
  tipText: { fontSize: 13, color: "#7a7060", lineHeight: 1.5 },
  aboutBox: { background: "#0d0c0a", border: "1px solid #1e1c18", borderRadius: 14, padding: "18px" },
  aboutTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 600, color: "#e8e0d4", marginBottom: 8 },
  aboutText: { fontSize: 13, color: "#6a6050", lineHeight: 1.65, margin: "0 0 16px" },
  collectionStats: { display: "flex", alignItems: "center", justifyContent: "center", gap: 0 },
  stat: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  statNum: { fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 600, color: "#c8a96e" },
  statLabel: { fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#4a4540" },
  statDivider: { width: 1, height: 32, background: "#2a2620" },
  previewWrap: { position: "relative", width: "100%", borderRadius: 16, overflow: "hidden", marginBottom: 20, maxHeight: 280 },
  previewImg: { width: "100%", height: 240, objectFit: "cover", display: "block" },
  previewGradient: { position: "absolute", inset: 0, background: "linear-gradient(to top, #0f0e0caa 0%, transparent 50%)" },
  previewLabel: { position: "absolute", bottom: 40, left: 14, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#c8a96e" },
  statusBadge: { position: "absolute", bottom: 12, left: 14 },
  pill: { display: "inline-block", padding: "5px 12px", background: "#c8a96e", color: "#0f0e0c", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  spinnerSection: { textAlign: "center", padding: "20px 0 8px" },
  spinner: { width: 32, height: 32, border: "2.5px solid #2a2620", borderTop: "2.5px solid #c8a96e", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 14px" },
  spinnerText: { fontSize: 15, color: "#e8e0d4", marginBottom: 4 },
  spinnerSub: { fontSize: 12, color: "#4a4540", letterSpacing: 0.5 },
  errorBox: { textAlign: "center", background: "#180f0f", border: "1px solid #ef444330", borderRadius: 14, padding: "28px 20px", marginTop: 8 },
  errorIcon: { fontSize: 32, marginBottom: 12 },
  errorText: { color: "#ef4444", fontSize: 14, margin: "0 0 16px", lineHeight: 1.5 },
  btnRetry: { padding: "12px 28px", background: "#c8a96e", border: "none", borderRadius: 10, color: "#0f0e0c", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" },
  resultsHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  resultsHeading: { fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 600, color: "#e8e0d4", margin: 0 },
  resultsBadge: { fontSize: 11, padding: "3px 10px", background: "#c8a96e20", border: "1px solid #c8a96e40", borderRadius: 20, color: "#c8a96e", letterSpacing: 0.5 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  card: { background: "#141210", border: "1px solid #222018", borderRadius: 12, overflow: "hidden", animation: "fadeUp 0.4s ease both", transition: "border-color 0.2s, transform 0.15s", cursor: "default" },
  cardImg: { width: "100%", height: 130, objectFit: "cover", display: "block" },
  cardImgPlaceholder: { width: "100%", height: 130, display: "flex", alignItems: "center", justifyContent: "center", background: "#1a1712" },
  cardBody: { padding: "10px 12px 12px" },
  cardMeta: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  cardFolder: { fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "#4a4540" },
  cardCode: { fontSize: 14, fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, color: "#e8e0d4", marginBottom: 2 },
  cardLabel: { fontSize: 11, color: "#6a6050", lineHeight: 1.3 },
  btnNewSearch: { display: "block", width: "100%", marginTop: 20, padding: "13px", background: "transparent", border: "1px solid #2a2620", borderRadius: 10, color: "#6a6050", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", textAlign: "center" },
  noResults: { textAlign: "center", padding: "32px 20px", marginTop: 8 },
  noResultsTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "#e8e0d4", margin: "0 0 8px" },
  noResultsSub: { fontSize: 13, color: "#6a6050", margin: "0 0 20px", lineHeight: 1.5 },
  footer: { borderTop: "1px solid #1a1814", padding: "16px 20px" },
  footerInner: { textAlign: "center", fontSize: 10, color: "#3a3530", letterSpacing: 1.5, textTransform: "uppercase" },
  footerDot: { margin: "0 8px" },
} as any;
