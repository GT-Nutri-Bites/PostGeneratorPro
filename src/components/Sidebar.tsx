"use client";

import { useState } from "react";
import type { Product } from "@/data/types";
import { generateCaption } from "@/utils/caption";

/* eslint-disable @next/next/no-img-element */

const tmplStyles: Record<number, { bg: string; letter: string }> = {
  1: { bg: "linear-gradient(135deg,#3d1a00,#D97706)", letter: "G" },
  2: { bg: "linear-gradient(135deg,#0a1f0f,#22C55E)", letter: "F" },
  3: { bg: "linear-gradient(135deg,#2d0f00,#F97316)", letter: "S" },
  4: { bg: "linear-gradient(135deg,#10103a,#A855F7)", letter: "M" },
  5: { bg: "linear-gradient(135deg,#001a1a,#14B8A6)", letter: "T" },
};

const tmplTitles: Record<number | string, string> = {
  1: "Golden Harvest",
  2: "Forest Fresh",
  3: "Sunset Spice",
  4: "Midnight Luxury",
  5: "Tropical Burst",
  custom: "Custom",
};

const QUICK_PRESETS = [
  { bg: "#2d1200", accent: "#D97706", label: "Amber" },
  { bg: "#0a2014", accent: "#22C55E", label: "Green" },
  { bg: "#1a0030", accent: "#A855F7", label: "Purple" },
  { bg: "#001830", accent: "#3B82F6", label: "Blue" },
  { bg: "#200010", accent: "#EC4899", label: "Pink" },
  { bg: "#181800", accent: "#EAB308", label: "Yellow" },
];

interface SidebarProps {
  products: Product[];
  selectedProduct: Product;
  onSelectProduct: (p: Product) => void;
  weight: string;
  onSelectWeight: (w: string) => void;
  availableWeights: string[];
  tmpl: number | "custom";
  onSelectTmpl: (t: number | "custom") => void;
  tmplNames: Record<number | string, string>;
  customBgColor: string;
  onCustomBgColorChange: (v: string) => void;
  customAccentColor: string;
  onCustomAccentColorChange: (v: string) => void;
  companyName: string;
  onCompanyNameChange: (v: string) => void;
  websiteUrl: string;
  onWebsiteUrlChange: (v: string) => void;
  tagline: string;
  onTaglineChange: (v: string) => void;
  showNutrition: boolean;
  onShowNutritionChange: (v: boolean) => void;
  showBenefits: boolean;
  onShowBenefitsChange: (v: boolean) => void;
  showOldPrice: boolean;
  onShowOldPriceChange: (v: boolean) => void;
  showQR: boolean;
  onShowQRChange: (v: boolean) => void;
  postFormat: "square" | "story";
  onPostFormatChange: (v: "square" | "story") => void;
  platform: string;
  onPlatformChange: (v: string) => void;
  captionTone: string;
  onCaptionToneChange: (v: string) => void;
  setLoading: (v: boolean) => void;
  showToast: (msg: string) => void;
  product: Product;
  price: number;
  oldPrice: number;
  saving: number;
  priceOverride: boolean;
  onPriceOverrideChange: (v: boolean) => void;
  manualPrice: string;
  onManualPriceChange: (v: string) => void;
}

export default function Sidebar({
  products,
  selectedProduct,
  onSelectProduct,
  weight,
  onSelectWeight,
  availableWeights,
  tmpl,
  onSelectTmpl,
  customBgColor,
  onCustomBgColorChange,
  customAccentColor,
  onCustomAccentColorChange,
  companyName,
  onCompanyNameChange,
  websiteUrl,
  onWebsiteUrlChange,
  tagline,
  onTaglineChange,
  showNutrition,
  onShowNutritionChange,
  showBenefits,
  onShowBenefitsChange,
  showOldPrice,
  onShowOldPriceChange,
  showQR,
  onShowQRChange,
  postFormat,
  onPostFormatChange,
  platform,
  onPlatformChange,
  captionTone,
  onCaptionToneChange,
  setLoading,
  showToast,
  product,
  price,
  saving,
  priceOverride,
  onPriceOverrideChange,
  manualPrice,
  onManualPriceChange,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  const handleDownload = async () => {
    setLoading(true);
    const wrap = document.getElementById("post-canvas-wrap");
    const productImgEl = wrap?.querySelector(".post-img") as HTMLImageElement | null;
    const shimmerEl = wrap?.querySelector(".post-shimmer") as HTMLElement | null;
    const animatedEl = wrap?.querySelector(".animate-up") as HTMLElement | null;

    // Stash original values so we can restore after capture
    const origImgSrc = productImgEl?.src ?? null;
    const origShimmerDisplay = shimmerEl?.style.display ?? null;
    const origAnimation = animatedEl?.style.animation ?? null;
    const origOpacity = animatedEl?.style.opacity ?? null;
    const origTransform = animatedEl?.style.transform ?? null;

    const restoreDOM = () => {
      if (productImgEl && origImgSrc !== null) productImgEl.src = origImgSrc;
      if (shimmerEl && origShimmerDisplay !== null) shimmerEl.style.display = origShimmerDisplay;
      if (animatedEl) {
        if (origAnimation !== null) animatedEl.style.animation = origAnimation;
        if (origOpacity !== null) animatedEl.style.opacity = origOpacity;
        if (origTransform !== null) animatedEl.style.transform = origTransform;
      }
    };

    try {
      const { toPng } = await import("html-to-image");
      if (!wrap) throw new Error("Canvas not found");

      // Pre-load product image as data-URI to avoid cross-origin issues
      const productImgUrl = productImgEl?.src || product.image;
      const imgDataUrl = await loadImageAsDataUrl(productImgUrl);

      // Swap product image to pre-loaded data URI
      if (productImgEl) productImgEl.src = imgDataUrl;

      // Suppress shimmer and entry animation during capture
      if (shimmerEl) shimmerEl.style.display = "none";
      if (animatedEl) {
        animatedEl.style.animation = "none";
        animatedEl.style.opacity = "1";
        animatedEl.style.transform = "none";
      }

      // Strip preview-only cosmetics (border-radius, box-shadow)
      wrap.classList.add("export-mode");
      await document.fonts.ready;
      await new Promise<void>((r) =>
        requestAnimationFrame(() => requestAnimationFrame(() => r()))
      );

      const pixelRatio = 1080 / wrap.offsetWidth;

      const dataUrl = await toPng(wrap, {
        pixelRatio,
        skipFonts: false,
        fetchRequestInit: { mode: "cors" },
      });

      restoreDOM();

      const formatSuffix = postFormat === "story" ? "_story" : "_square";
      const link = document.createElement("a");
      link.download = `${product.name.replace(/\s+/g, "_")}_${weight}${formatSuffix}_post.png`;
      link.href = dataUrl;
      link.click();
      showToast("✓ Post downloaded!");
    } catch (e) {
      restoreDOM();
      showToast("⚠ Error generating image. Try again.");
      console.error(e);
    } finally {
      if (wrap) wrap.classList.remove("export-mode");
      setLoading(false);
    }
  };

  const handleCopyCaption = () => {
    const website = websiteUrl || "gt-nutri-bites.github.io";
    const company = companyName || "GT Nutri Bites";
    const caption = generateCaption(product, price, weight, website, company, platform, captionTone);
    navigator.clipboard.writeText(caption).then(() => {
      showToast("Caption copied to clipboard!");
    });
  };

  return (
    <div
      className="sidebar"
      style={{
        width: 280,
        minWidth: 260,
        padding: 20,
        overflowY: "auto",
        maxHeight: "calc(100vh - 64px)",
      }}
    >
      {/* Company Settings */}
      <div className="ctrl-section">
        <div className="ctrl-label">🏪 Company Settings</div>
        <input
          className="ctrl-input"
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          style={{ marginBottom: 8 }}
        />
        <input
          className="ctrl-input"
          type="text"
          placeholder="Website URL"
          value={websiteUrl}
          onChange={(e) => onWebsiteUrlChange(e.target.value)}
        />
        <input
          className="ctrl-input"
          type="text"
          placeholder="Tagline (optional)"
          value={tagline}
          onChange={(e) => onTaglineChange(e.target.value)}
          style={{ marginTop: 8 }}
        />
      </div>

      {/* Template */}
      <div className="ctrl-section">
        <div className="ctrl-label">🎨 Color Theme</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[1, 2, 3, 4, 5].map((t) => (
            <div
              key={t}
              className={`tmpl-btn${tmpl === t ? " active" : ""}`}
              title={tmplTitles[t]}
              style={{ background: tmplStyles[t].bg }}
              onClick={() => onSelectTmpl(t)}
            >
              <span
                style={{
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  fontSize: 7,
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 600,
                }}
              >
                {tmplStyles[t].letter}
              </span>
            </div>
          ))}
          {/* Custom color button */}
          <div
            className={`tmpl-btn${tmpl === "custom" ? " active" : ""}`}
            title="Custom Color"
            style={{
              position: "relative",
              overflow: "hidden",
              background: "conic-gradient(from 0deg,#D97706,#22C55E,#14B8A6,#A855F7,#F97316,#D97706)",
              border: tmpl === "custom" ? "2px solid #fff" : "2px dashed rgba(255,255,255,0.35)",
            }}
            onClick={() => onSelectTmpl("custom")}
          >
            <span
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                lineHeight: 1,
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.8))",
                pointerEvents: "none",
              }}
            >
              🎨
            </span>
          </div>
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 10,
            color: "rgba(255,255,255,0.3)",
          }}
        >
          {tmplTitles[tmpl] ?? ""}
        </div>

        {/* Custom color picker panel */}
        {tmpl === "custom" && (
          <div
            style={{
              marginTop: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              padding: "12px 10px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.08em",
                marginBottom: 10,
                textTransform: "uppercase",
              }}
            >
              Customize Colors
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              {/* Background color */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div
                  className="color-swatch-btn"
                  title="Background Color"
                  style={{ background: customBgColor }}
                >
                  <input
                    type="color"
                    value={customBgColor}
                    onChange={(e) => onCustomBgColorChange(e.target.value)}
                  />
                </div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em" }}>
                  BACKGROUND
                </div>
              </div>
              {/* Accent color */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div
                  className="color-swatch-btn"
                  title="Accent Color"
                  style={{ background: customAccentColor }}
                >
                  <input
                    type="color"
                    value={customAccentColor}
                    onChange={(e) => onCustomAccentColorChange(e.target.value)}
                  />
                </div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em" }}>
                  ACCENT
                </div>
              </div>
              {/* Quick preset swatches */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em", marginBottom: 2 }}>
                  QUICK PICKS
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {QUICK_PRESETS.map((preset) => (
                    <div
                      key={preset.label}
                      className="custom-preset-swatch"
                      title={preset.label}
                      style={{
                        background: `linear-gradient(135deg,${preset.bg},${preset.accent})`,
                      }}
                      onClick={() => {
                        onCustomBgColorChange(preset.bg);
                        onCustomAccentColorChange(preset.accent);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Post Format */}
      <div className="ctrl-section">
        <div className="ctrl-label">📐 Post Format</div>
        <div style={{ display: "flex", gap: 6 }}>
          {(["square", "story"] as const).map((fmt) => (
            <button
              key={fmt}
              className={`seg-btn${postFormat === fmt ? " active" : ""}`}
              onClick={() => onPostFormatChange(fmt)}
            >
              {fmt === "square" ? "⬛ Square 1:1" : "📱 Story 4:5"}
            </button>
          ))}
        </div>
      </div>

      {/* Social Platform */}
      <div className="ctrl-section">
        <div className="ctrl-label">📣 Target Platform</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[
            { id: "instagram", label: "📷 Instagram" },
            { id: "facebook", label: "📘 Facebook" },
            { id: "whatsapp", label: "💬 WhatsApp" },
          ].map((p) => (
            <button
              key={p.id}
              className={`seg-btn${platform === p.id ? " active" : ""}`}
              onClick={() => onPlatformChange(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Weight */}
      <div className="ctrl-section">
        <div className="ctrl-label">⚖️ Weight / Size</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {availableWeights.map((w) => (
            <div
              key={w}
              className={`weight-pill${w === weight ? " active" : ""}`}
              onClick={() => onSelectWeight(w)}
            >
              {w}
            </div>
          ))}
        </div>
      </div>

      {/* Post Sections */}
      <div className="ctrl-section">
        <div className="ctrl-label">📊 Post Sections</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            {
              label: "Nutrition Facts",
              checked: showNutrition,
              onChange: onShowNutritionChange,
            },
            {
              label: "Benefits Tags",
              checked: showBenefits,
              onChange: onShowBenefitsChange,
            },
            {
              label: "Original Price / Savings",
              checked: showOldPrice,
              onChange: onShowOldPriceChange,
            },
            { label: "QR Code", checked: showQR, onChange: onShowQRChange },
          ].map((item) => (
            <label
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                fontSize: 12,
                color: "#ccc",
              }}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => item.onChange(e.target.checked)}
                style={{ accentColor: "var(--amber)" }}
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>

      {/* Price Override */}
      <div className="ctrl-section">
        <div className="ctrl-label">💰 Price Override</div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            fontSize: 12,
            color: "#ccc",
            marginBottom: priceOverride ? 8 : 0,
          }}
        >
          <input
            type="checkbox"
            checked={priceOverride}
            onChange={(e) => onPriceOverrideChange(e.target.checked)}
            style={{ accentColor: "var(--amber)" }}
          />
          Override price manually
        </label>
        {priceOverride && (
          <input
            className="ctrl-input"
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter price (Rs.)"
            value={manualPrice}
            onChange={(e) => onManualPriceChange(e.target.value)}
          />
        )}
      </div>

      {/* Caption Tone */}
      <div className="ctrl-section">
        <div className="ctrl-label">✍️ Caption Tone</div>
        <select
          className="tone-select"
          value={captionTone}
          onChange={(e) => onCaptionToneChange(e.target.value)}
        >
          <option value="professional">🌟 Professional</option>
          <option value="friendly">😊 Friendly</option>
          <option value="promotional">🔥 Promotional</option>
        </select>
      </div>

      {/* Products List */}
      <div className="ctrl-section">
        <div className="ctrl-label">🌰 Select Product</div>
        {/* Product search */}
        <input
          className="ctrl-input"
          type="text"
          placeholder="🔍 Search products…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredProducts.length === 0 ? (
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", padding: "8px 0" }}>
              No products found.
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                className={`product-card${p.id === selectedProduct.id ? " active" : ""}`}
                onClick={() => onSelectProduct(p)}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  crossOrigin="anonymous"
                  style={{
                    width: 42,
                    height: 42,
                    objectFit: "contain",
                    borderRadius: 6,
                    background: "#2a2a2a",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#eee",
                      lineHeight: 1.3,
                    }}
                  >
                    {p.name}
                  </div>
                  <div style={{ fontSize: 10, color: "#888", marginTop: 1 }}>
                    {p.category}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#FDE68A",
                      marginTop: 2,
                      fontWeight: 600,
                    }}
                  >
                    Rs. {p.price.toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Download */}
      <div style={{ marginTop: 8 }}>
        <button className="dl-btn" onClick={handleDownload}>
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Download Post (PNG)
        </button>
        <button className="copy-btn" onClick={handleCopyCaption}>
          📋 Copy Caption Text
        </button>
      </div>
    </div>
  );
}

function loadImageAsDataUrl(url: string, timeout = 10000): Promise<string> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(url), timeout);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      clearTimeout(timer);
      try {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        c.getContext("2d")!.drawImage(img, 0, 0);
        resolve(c.toDataURL("image/png"));
      } catch {
        resolve(url);
      }
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(url);
    };
    img.src = url;
  });
}

