'use client';

import { useState, useRef, useCallback } from "react";
import { useLang } from '@/lib/LangContext';
import { t } from '@/lib/i18n';

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

const CLOUD_NAME = "varindo";

export function SurfaceMatchClient() {
  const { lang } = useLang();
  const [phase, setPhase] = useState("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const STEPS = [
    { icon: "📸", title: t('surfaceMatch', 'step1Title', lang), desc: t('surfaceMatch', 'step1Desc', lang) },
    { icon: "🔍", title: t('surfaceMatch', 'step2Title', lang), desc: t('surfaceMatch', 'step2Desc', lang) },
    { icon: "✨", title: t('surfaceMatch', 'step3Title', lang), desc: t('surfaceMatch', 'step3Desc', lang) },
  ];

  const TIPS = [
    { icon: "💡", text: t('surfaceMatch', 'tip1', lang) },
    { icon: "🎯", text: t('surfaceMatch', 'tip2', lang) },
    { icon: "📐", text: t('surfaceMatch', 'tip3', lang) },
  ];

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMsg(t('surfaceMatch', 'uploadImageOnly', lang));
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
        throw new Error(err?.error?.message || t('surfaceMatch', 'uploadFailed', lang));
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
        throw new Error(err?.error || t('surfaceMatch', 'searchFailed', lang));
      }

      const data = await response.json();
      setResults(data.matches || []);
      setPhase("results");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || t('surfaceMatch', 'errorGeneric', lang));
      setPhase("error");
    }
  }, [lang]);

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
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        * { box-sizing: border-box; }
        .lam-btn-primary:active { transform: scale(0.97); }
        .lam-btn-secondary:active { transform: scale(0.97); }
        .result-card:active { transform: scale(0.98); border-color: #a8763e !important; }
      ` }} />

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
                  <circle cx="28" cy="28" r="27" stroke="#a8763e" strokeWidth="1.5" strokeDasharray="4 3"/>
                  <rect x="14" y="18" width="28" height="22" rx="3" fill="#1a1714" stroke="#a8763e" strokeWidth="1.5"/>
                  <circle cx="22" cy="26" r="4" stroke="#a8763e" strokeWidth="1.5"/>
                  <path d="M14 34l8-6 6 5 5-4 9 7" stroke="#a8763e" strokeWidth="1.5" strokeLinejoin="round"/>
                  <circle cx="38" cy="19" r="5" fill="#faf8f5" stroke="#a8763e" strokeWidth="1.5"/>
                  <path d="M38 16v6M35 19h6" stroke="#a8763e" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h1 style={S.heroTitle}>{t('surfaceMatch', 'heroTitle', lang)}</h1>
              <p style={S.heroSub}>
                {t('surfaceMatch', 'heroSub', lang)}
              </p>
              <div style={S.btnStack}>
                <label htmlFor="camera-input" style={S.btnPrimary} className="lam-btn-primary">
                  {t('surfaceMatch', 'takePhoto', lang)}
                </label>
                <label htmlFor="browse-input" style={S.btnSecondary} className="lam-btn-secondary">
                  {t('surfaceMatch', 'chooseGallery', lang)}
                </label>
              </div>
            </div>

            <div style={S.divider}>
              <div style={S.dividerLine} />
              <span style={S.dividerText}>{t('surfaceMatch', 'howItWorks', lang)}</span>
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
              <div style={S.tipsHeading}>{t('surfaceMatch', 'tipsHeading', lang)}</div>
              {TIPS.map((tip, i) => (
                <div key={i} style={S.tipRow}>
                  <span style={S.tipIcon}>{tip.icon}</span>
                  <span style={S.tipText}>{tip.text}</span>
                </div>
              ))}
            </div>

          </div>
        )}

        {phase !== "idle" && (
          <div style={{ animation: "fadeUp 0.35s ease both" }}>

            {preview && (
              <div style={S.previewWrap}>
                <img src={preview} alt={t('surfaceMatch', 'yourSurface', lang)} style={S.previewImg} />
                <div style={S.previewGradient} />
                <div style={S.previewLabel}>{t('surfaceMatch', 'yourSurface', lang)}</div>
                <div style={S.statusBadge}>
                  {phase === "uploading" && <span style={{ ...S.pill, animation: "pulse 1.2s ease infinite" }}>{t('surfaceMatch', 'uploadingBadge', lang)}</span>}
                  {phase === "searching" && <span style={{ ...S.pill, animation: "pulse 1.2s ease infinite" }}>{t('surfaceMatch', 'matchingBadge', lang)}</span>}
                  {phase === "results" && <span style={{ ...S.pill, background: "#22c55e", color: "#fff" }}>{t('surfaceMatch', 'matchesBadge', lang, { n: results.length, s: results.length !== 1 ? 'es' : '' })}</span>}
                  {phase === "error" && <span style={{ ...S.pill, background: "#ef4444", color: "#fff" }}>{t('surfaceMatch', 'errorBadge', lang)}</span>}
                </div>
              </div>
            )}

            {(phase === "uploading" || phase === "searching") && (
              <div style={S.spinnerSection}>
                <div style={S.spinner} />
                <div style={S.spinnerText}>
                  {phase === "uploading" ? t('surfaceMatch', 'uploadingImage', lang) : t('surfaceMatch', 'scanningLibrary', lang)}
                </div>
                <div style={S.spinnerSub}>
                  {phase === "searching" && t('surfaceMatch', 'comparingDesigns', lang)}
                </div>
              </div>
            )}

            {phase === "error" && (
              <div style={S.errorBox}>
                <div style={S.errorIcon}>⚠️</div>
                <p style={S.errorText}>{errorMsg}</p>
                <button style={S.btnRetry} onClick={reset}>{t('surfaceMatch', 'tryAgain', lang)}</button>
              </div>
            )}

            {phase === "results" && results.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div style={S.resultsHeader}>
                  <h2 style={S.resultsHeading}>{t('surfaceMatch', 'suggestedDesigns', lang)}</h2>
                  <span style={S.resultsBadge}>{t('surfaceMatch', 'foundCount', lang, { n: results.length })}</span>
                </div>
                <div style={S.grid}>
                  {results.map((r, i) => <ResultCard key={r.code || i} result={r} rank={i} />)}
                </div>
                <button style={S.btnNewSearch} onClick={reset}>{t('surfaceMatch', 'newSearch', lang)}</button>
              </div>
            )}

            {phase === "results" && results.length === 0 && (
              <div style={S.noResults}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔎</div>
                <p style={S.noResultsTitle}>{t('surfaceMatch', 'noMatchesTitle', lang)}</p>
                <p style={S.noResultsSub}>{t('surfaceMatch', 'noMatchesSub', lang)}</p>
                <button style={S.btnRetry} onClick={reset}>{t('surfaceMatch', 'tryAgain', lang)}</button>
              </div>
            )}

          </div>
        )}

      </main>
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
        : <div style={S.cardImgPlaceholder}><span style={{ color: "#a8763e", fontSize: 32 }}>◈</span></div>
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

const FONT_BODY = "var(--font-body), 'DM Sans', ui-sans-serif, system-ui, sans-serif";
const FONT_DISPLAY = "var(--font-display), 'Cormorant Garamond', Georgia, serif";

const S = {
  root: { minHeight: "100vh", background: "#faf8f5", fontFamily: FONT_BODY, color: "#1a1714", display: "flex", flexDirection: "column" },
  main: { flex: 1, padding: "24px 16px 40px", maxWidth: 520, margin: "0 auto", width: "100%" },
  hero: { textAlign: "center", padding: "8px 0 28px" },
  heroIcon: { margin: "0 auto 20px", width: 56, height: 56 },
  heroTitle: { fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 600, color: "#1a1714", margin: "0 0 12px", lineHeight: 1.2 },
  heroSub: { fontSize: 14, color: "#6b6159", lineHeight: 1.6, margin: "0 0 28px", padding: "0 8px" },
  btnStack: { display: "flex", flexDirection: "column", gap: 12, maxWidth: 320, margin: "0 auto" },
  btnPrimary: { display: "block", padding: "16px 24px", background: "#1a1714", borderRadius: 12, color: "#ffffff", fontSize: 16, fontWeight: 600, cursor: "pointer", textAlign: "center", letterSpacing: 0.3, transition: "transform 0.15s", userSelect: "none" },
  btnSecondary: { display: "block", padding: "14px 24px", background: "transparent", border: "1.5px solid #1a1714", borderRadius: 12, color: "#1a1714", fontSize: 15, cursor: "pointer", textAlign: "center", letterSpacing: 0.3, transition: "transform 0.15s", userSelect: "none" },
  divider: { display: "flex", alignItems: "center", gap: 12, margin: "8px 0 24px" },
  dividerLine: { flex: 1, height: 1, background: "#e4ddd4" },
  dividerText: { fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#6b6159", whiteSpace: "nowrap" },
  stepsGrid: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 },
  stepCard: { display: "flex", alignItems: "flex-start", gap: 14, background: "#ffffff", border: "1px solid #e4ddd4", borderRadius: 14, padding: "16px", animation: "fadeUp 0.4s ease both" },
  stepNumber: { width: 22, height: 22, borderRadius: "50%", background: "#a8763e20", border: "1px solid #a8763e60", color: "#a8763e", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 },
  stepIcon: { fontSize: 22, flexShrink: 0 },
  stepTitle: { fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 600, color: "#1a1714", marginBottom: 4 },
  stepDesc: { fontSize: 13, color: "#6b6159", lineHeight: 1.55 },
  tipsBox: { background: "#ffffff", border: "1px solid #e4ddd4", borderRadius: 14, padding: "16px", marginBottom: 20 },
  tipsHeading: { fontSize: 12, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", color: "#a8763e", marginBottom: 12 },
  tipRow: { display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 },
  tipIcon: { fontSize: 14, flexShrink: 0, marginTop: 1 },
  tipText: { fontSize: 13, color: "#6b6159", lineHeight: 1.5 },
  previewWrap: { position: "relative", width: "100%", borderRadius: 16, overflow: "hidden", marginBottom: 20, maxHeight: 280 },
  previewImg: { width: "100%", height: 240, objectFit: "cover", display: "block" },
  previewGradient: { position: "absolute", inset: 0, background: "linear-gradient(to top, #1a1714aa 0%, transparent 50%)" },
  previewLabel: { position: "absolute", bottom: 40, left: 14, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#f0e8dc" },
  statusBadge: { position: "absolute", bottom: 12, left: 14 },
  pill: { display: "inline-block", padding: "5px 12px", background: "#a8763e", color: "#ffffff", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  spinnerSection: { textAlign: "center", padding: "20px 0 8px" },
  spinner: { width: 32, height: 32, border: "2.5px solid #e4ddd4", borderTop: "2.5px solid #a8763e", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 14px" },
  spinnerText: { fontSize: 15, color: "#1a1714", marginBottom: 4 },
  spinnerSub: { fontSize: 12, color: "#6b6159", letterSpacing: 0.5 },
  errorBox: { textAlign: "center", background: "#fdf2f2", border: "1px solid #ef444440", borderRadius: 14, padding: "28px 20px", marginTop: 8 },
  errorIcon: { fontSize: 32, marginBottom: 12 },
  errorText: { color: "#dc2626", fontSize: 14, margin: "0 0 16px", lineHeight: 1.5 },
  btnRetry: { padding: "12px 28px", background: "#1a1714", border: "none", borderRadius: 10, color: "#ffffff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT_BODY },
  resultsHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  resultsHeading: { fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 600, color: "#1a1714", margin: 0 },
  resultsBadge: { fontSize: 11, padding: "3px 10px", background: "#a8763e20", border: "1px solid #a8763e40", borderRadius: 20, color: "#a8763e", letterSpacing: 0.5 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  card: { background: "#ffffff", border: "1px solid #e4ddd4", borderRadius: 12, overflow: "hidden", animation: "fadeUp 0.4s ease both", transition: "border-color 0.2s, transform 0.15s", cursor: "default" },
  cardImg: { width: "100%", height: 130, objectFit: "cover", display: "block" },
  cardImgPlaceholder: { width: "100%", height: 130, display: "flex", alignItems: "center", justifyContent: "center", background: "#f2ede5" },
  cardBody: { padding: "10px 12px 12px" },
  cardMeta: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  cardFolder: { fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "#6b6159" },
  cardCode: { fontSize: 14, fontFamily: FONT_DISPLAY, fontWeight: 600, color: "#1a1714", marginBottom: 2 },
  cardLabel: { fontSize: 11, color: "#6b6159", lineHeight: 1.3 },
  btnNewSearch: { display: "block", width: "100%", marginTop: 20, padding: "13px", background: "transparent", border: "1px solid #e4ddd4", borderRadius: 10, color: "#6b6159", fontSize: 13, cursor: "pointer", fontFamily: FONT_BODY, textAlign: "center" },
  noResults: { textAlign: "center", padding: "32px 20px", marginTop: 8 },
  noResultsTitle: { fontFamily: FONT_DISPLAY, fontSize: 20, color: "#1a1714", margin: "0 0 8px" },
  noResultsSub: { fontSize: 13, color: "#6b6159", margin: "0 0 20px", lineHeight: 1.5 },
} as any;
