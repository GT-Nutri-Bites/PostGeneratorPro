"use client";

import type { Product } from "@/data/types";

/* eslint-disable @next/next/no-img-element */

const tmplStyles: Record<number, { bg: string; letter: string }> = {
  1: { bg: "linear-gradient(135deg,#3d1a00,#D97706)", letter: "G" },
  2: { bg: "linear-gradient(135deg,#0a1f0f,#22C55E)", letter: "F" },
  3: { bg: "linear-gradient(135deg,#2d0f00,#F97316)", letter: "S" },
  4: { bg: "linear-gradient(135deg,#10103a,#A855F7)", letter: "M" },
  5: { bg: "linear-gradient(135deg,#001a1a,#14B8A6)", letter: "T" },
};

const tmplTitles = [
  "",
  "Golden Harvest",
  "Forest Fresh",
  "Sunset Spice",
  "Midnight Luxury",
  "Tropical Burst",
];

interface SidebarProps {
  products: Product[];
  selectedProduct: Product;
  onSelectProduct: (p: Product) => void;
  weight: string;
  onSelectWeight: (w: string) => void;
  availableWeights: string[];
  tmpl: number;
  onSelectTmpl: (t: number) => void;
  tmplNames: string[];
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
  setLoading: (v: boolean) => void;
  showToast: (msg: string) => void;
  product: Product;
  price: number;
  oldPrice: number;
  saving: number;
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
  setLoading,
  showToast,
  product,
  price,
  saving,
}: SidebarProps) {
  const handleDownload = async () => {
    setLoading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const wrap = document.getElementById("post-canvas-wrap");
      if (!wrap) throw new Error("Canvas not found");

      // Pre-load product image as data-URI to avoid CORS
      const productImgEl = wrap.querySelector(".post-img") as HTMLImageElement;
      const productImgUrl = productImgEl?.src || product.image;
      const imgDataUrl = await loadImageAsDataUrl(productImgUrl);

      wrap.classList.add("export-mode");
      await document.fonts.ready;
      await new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(r))
      );

      const previewWidth = wrap.offsetWidth;
      const scaleFactor = 1080 / previewWidth;

      const h2cOpts = {
        scale: scaleFactor,
        useCORS: true,
        logging: false,
        backgroundColor: null as string | null,
        onclone: (clonedDoc: Document) => {
          const cw = clonedDoc.getElementById("post-canvas-wrap");
          if (!cw) return;

          const cImg = cw.querySelector(".post-img") as HTMLImageElement;
          if (cImg) cImg.src = imgDataUrl;

          const shimmer = cw.querySelector(".post-shimmer") as HTMLElement;
          if (shimmer) shimmer.style.display = "none";

          const animatedEl = cw.querySelector(".animate-up") as HTMLElement;
          if (animatedEl) {
            animatedEl.style.animation = "none";
            animatedEl.style.opacity = "1";
            animatedEl.style.transform = "none";
          }

          // Badge circle: flex → table/table-cell
          const badge = cw.querySelector(".post-badge-float") as HTMLElement;
          if (badge) {
            badge.style.display = "table";
            badge.style.textAlign = "center";
            const badgeInner = badge.firstElementChild as HTMLElement;
            if (badgeInner) {
              badgeInner.style.display = "table-cell";
              badgeInner.style.verticalAlign = "middle";
              badgeInner.style.textAlign = "center";
            }
          }

          // Footer bar: flex → table/table-cell
          const footer = cw.querySelector(".post-footer-bar") as HTMLElement;
          if (footer) {
            footer.style.display = "table";
            footer.style.width = "100%";
            const ftText = footer.querySelector(
              ".post-website-text"
            ) as HTMLElement;
            if (ftText) {
              ftText.style.display = "table-cell";
              ftText.style.verticalAlign = "middle";
              ftText.style.textAlign = "center";
            }
          }

          // Nutrition strip: flex → table
          const nutStrip = cw.querySelector(
            ".post-nutrition-strip"
          ) as HTMLElement;
          if (nutStrip) {
            nutStrip.style.display = "table";
            nutStrip.style.width = "100%";
            nutStrip.style.tableLayout = "fixed";
            cw.querySelectorAll(".post-nut-item").forEach((item) => {
              const el = item as HTMLElement;
              el.style.display = "table-cell";
              el.style.verticalAlign = "middle";
              el.style.textAlign = "center";
            });
          }

          // Category badge & benefit tags
          const catBadge = cw.querySelector(
            ".post-category-badge"
          ) as HTMLElement;
          if (catBadge) catBadge.style.display = "inline-block";
          cw.querySelectorAll(".post-benefit-tag").forEach((t) => {
            (t as HTMLElement).style.display = "inline-block";
          });

          const saveChip = cw.querySelector(".post-save-chip") as HTMLElement;
          if (saveChip) saveChip.style.display = "inline-block";

          cw.querySelectorAll(".post-nut-val").forEach((v) => {
            (v as HTMLElement).style.display = "inline-block";
          });
        },
      };

      let result;
      try {
        result = await html2canvas(wrap, { ...h2cOpts, allowTaint: false });
      } catch {
        result = await html2canvas(wrap, { ...h2cOpts, allowTaint: true });
      }

      const link = document.createElement("a");
      link.download = `${product.name.replace(/\s+/g, "_")}_${weight}_post.png`;
      link.href = result.toDataURL("image/png");
      link.click();
      showToast("✓ Post downloaded!");
    } catch (e) {
      showToast("⚠ Error generating image. Try again.");
      console.error(e);
    } finally {
      const wrap = document.getElementById("post-canvas-wrap");
      if (wrap) wrap.classList.remove("export-mode");
      setLoading(false);
    }
  };

  const handleCopyCaption = () => {
    const website = websiteUrl || "gt-nutri-bites.github.io";
    const company = companyName || "GT Nutri Bites";
    const hashtags: Record<string, string> = {
      nuts: "#almonds #nuts #healthysnacks #organicnuts #premium",
      seeds: "#seeds #healthyfood #superfood #nutrients #wellness",
      dried_fruits: "#driedfruits #healthysnack #natural #organic",
      mix: "#mixednuts #healthy #snack #premium #organic",
    };
    const ht = hashtags[product.type] || "#healthyfood #natural #organic";
    const caption = `✨ ${product.name} — Now Available!\n\n${product.description}\n\n🌟 Key Benefits:\n${product.benefits
      .slice(0, 3)
      .map((b) => `• ${b}`)
      .join("\n")}\n\n💰 Price: Rs. ${price.toLocaleString()} / ${weight}\n\n🛒 Order Now: ${website}\n📦 Fast Delivery Island-wide\n\n${ht} #${company.replace(/\s+/g, "").toLowerCase()} #srilanka #nutrisri`;

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
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 10,
            color: "rgba(255,255,255,0.3)",
          }}
        >
          {tmplTitles[tmpl]}
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

      {/* Products List */}
      <div className="ctrl-section">
        <div className="ctrl-label">🌰 Select Product</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {products.map((p) => (
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
          ))}
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
