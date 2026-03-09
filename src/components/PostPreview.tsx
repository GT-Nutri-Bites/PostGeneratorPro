"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import type { Product } from "@/data/types";

/* eslint-disable @next/next/no-img-element */

const badgeMap: Record<string, { bg: string; color: string }> = {
  "BEST SELLER": { bg: "#15803D", color: "#fff" },
  PREMIUM: { bg: "#7C3AED", color: "#fff" },
  NEW: { bg: "#D97706", color: "#fff" },
  ORGANIC: { bg: "#15803D", color: "#fff" },
};

function formatNutVal(val: string): string {
  const normalized = val.trim().replace(/\s+/g, "");
  const match = normalized.match(/^([\d.]+)(.*)$/);
  if (match && match[2]) {
    return `${match[1]}<span class="post-nut-unit">${match[2]}</span>`;
  }
  return val;
}

function generateCaption(
  product: Product,
  price: number,
  weight: string,
  website: string,
  company: string
): string {
  const hashtags: Record<string, string> = {
    nuts: "#almonds #nuts #healthysnacks #organicnuts #premium",
    seeds: "#seeds #healthyfood #superfood #nutrients #wellness",
    dried_fruits: "#driedfruits #healthysnack #natural #organic",
    mix: "#mixednuts #healthy #snack #premium #organic",
  };
  const ht = hashtags[product.type] || "#healthyfood #natural #organic";
  return `✨ ${product.name} — Now Available!\n\n${product.description}\n\n🌟 Key Benefits:\n${product.benefits
    .slice(0, 3)
    .map((b) => `• ${b}`)
    .join("\n")}\n\n💰 Price: Rs. ${price.toLocaleString()} / ${weight}\n\n🛒 Order Now: ${website}\n📦 Fast Delivery Island-wide\n\n${ht} #${company.replace(/\s+/g, "").toLowerCase()} #srilanka #nutrisri`;
}

interface PostPreviewProps {
  product: Product;
  weight: string;
  tmpl: number;
  companyName: string;
  websiteUrl: string;
  tagline: string;
  showNutrition: boolean;
  showBenefits: boolean;
  showOldPrice: boolean;
  showQR: boolean;
  price: number;
  oldPrice: number;
  saving: number;
}

export default function PostPreview({
  product,
  weight,
  tmpl,
  companyName,
  websiteUrl,
  tagline,
  showNutrition,
  showBenefits,
  showOldPrice,
  showQR,
  price,
  oldPrice,
  saving,
}: PostPreviewProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [bgRemovedUrl, setBgRemovedUrl] = useState<string | null>(null);

  const company = companyName || "GT Nutri Bites";
  const website = websiteUrl || "gt-nutri-bites.github.io";

  // Parse calorie parts
  const calParts = product.nutrition.calories.split(" ");
  const calValue = calParts[0];
  const calServing = calParts.length > 1 ? calParts.slice(1).join(" ") : "";

  const bStyle = product.badge
    ? badgeMap[product.badge] || { bg: "#374151", color: "#fff" }
    : null;

  // Generate QR code
  useEffect(() => {
    const url =
      "https://" +
      website.replace("https://", "").replace("http://", "");

    let cancelled = false;
    import("qrcode").then((QRCode) => {
      QRCode.toDataURL(url, {
        width: 80,
        margin: 0,
        color: { dark: "#000000", light: "#ffffff" },
        errorCorrectionLevel: "M",
      }).then((dataUrl) => {
        if (!cancelled) setQrDataUrl(dataUrl);
      }).catch(() => {
        if (!cancelled) setQrDataUrl("");
      });
    });

    return () => { cancelled = true; };
  }, [website]);

  // Try background removal via Cloudinary
  useEffect(() => {
    setBgRemovedUrl(null);
    const bgRemovedImgUrl = product.image.replace(
      "/upload/",
      "/upload/e_background_removal/"
    );
    const testImg = new Image();
    testImg.crossOrigin = "anonymous";
    testImg.onload = () => setBgRemovedUrl(bgRemovedImgUrl);
    testImg.onerror = () => setBgRemovedUrl(null);
    testImg.src = bgRemovedImgUrl;
  }, [product.image]);

  const displayImage = bgRemovedUrl || product.image;

  const caption = useMemo(
    () => generateCaption(product, price, weight, website, company),
    [product, price, weight, website, company]
  );

  return (
    <div
      className="preview-area"
      style={{
        flex: 1,
        padding: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowY: "auto",
      }}
    >
      <div style={{ width: "100%", maxWidth: 540 }}>
        {/* Post Preview */}
        <div id="post-canvas-wrap">
          <div id="post-canvas" className={`post-inner tmpl-${tmpl} animate-up`} key={`${product.id}-${tmpl}`}>
            <div className="post-bg-deco" />
            <div className="post-geo" />
            <div className="post-shimmer" />

            {/* Corner SVG decoration */}
            <svg
              className="post-corner-deco"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="30" cy="30" r="28" stroke="white" strokeWidth="1" />
              <circle
                cx="30"
                cy="30"
                r="20"
                stroke="white"
                strokeWidth="0.5"
              />
              <line
                x1="30"
                y1="2"
                x2="30"
                y2="58"
                stroke="white"
                strokeWidth="0.5"
              />
              <line
                x1="2"
                y1="30"
                x2="58"
                y2="30"
                stroke="white"
                strokeWidth="0.5"
              />
            </svg>

            {/* Top header */}
            <div className="post-header-bar">
              <div>
                <div className="post-company-name">{company}</div>
                {tagline && (
                  <div
                    style={{
                      fontSize: "clamp(7px,1.2vw,9px)",
                      color: "rgba(255,255,255,0.45)",
                      letterSpacing: "0.06em",
                      marginTop: 1,
                    }}
                  >
                    {tagline}
                  </div>
                )}
              </div>
              <div className="post-category-badge post-tag">
                {product.category}
              </div>
            </div>

            {/* Badge float */}
            {product.badge && bStyle && (
              <div
                className="post-badge-float"
                style={{ background: bStyle.bg, color: bStyle.color }}
              >
                <span
                  style={{ fontSize: "inherit" }}
                  dangerouslySetInnerHTML={{
                    __html: product.badge.replace(/ /g, "<br>"),
                  }}
                />
              </div>
            )}

            {/* Image zone */}
            <div className="post-img-zone">
              <div className="post-img-glow" />
              <img
                className="post-img"
                src={displayImage}
                data-original={product.image}
                crossOrigin="anonymous"
                alt={product.name}
              />
            </div>

            {/* Info */}
            <div className="post-info">
              <div className="post-divider" />

              {showNutrition && (
                <div className="post-nutrition-strip">
                  <div className="post-nut-item">
                    <div
                      className="post-nut-val"
                      dangerouslySetInnerHTML={{ __html: calValue }}
                    />
                    <div className="post-nut-key">Kcal</div>
                    {calServing && (
                      <div
                        className="post-nut-key"
                        style={{
                          fontSize: "clamp(6px,1vw,8px)",
                          marginTop: 1,
                        }}
                      >
                        {calServing}
                      </div>
                    )}
                  </div>
                  <div className="post-nut-item">
                    <div
                      className="post-nut-val"
                      dangerouslySetInnerHTML={{
                        __html: formatNutVal(product.nutrition.protein),
                      }}
                    />
                    <div className="post-nut-key">Protein</div>
                  </div>
                  <div className="post-nut-item">
                    <div
                      className="post-nut-val"
                      dangerouslySetInnerHTML={{
                        __html: formatNutVal(product.nutrition.fat),
                      }}
                    />
                    <div className="post-nut-key">Fat</div>
                  </div>
                  <div className="post-nut-item">
                    <div
                      className="post-nut-val"
                      dangerouslySetInnerHTML={{
                        __html: formatNutVal(product.nutrition.carbs),
                      }}
                    />
                    <div className="post-nut-key">Carbs</div>
                  </div>
                  <div className="post-nut-item">
                    <div
                      className="post-nut-val"
                      dangerouslySetInnerHTML={{
                        __html: formatNutVal(product.nutrition.fiber),
                      }}
                    />
                    <div className="post-nut-key">Fiber</div>
                  </div>
                </div>
              )}

              <div className="post-product-name">{product.name}</div>
              <div className="post-desc">{product.description}</div>

              {showBenefits && product.benefits && (
                <div className="post-benefits-row">
                  {product.benefits.slice(0, 3).map((b, i) => (
                    <span key={i} className="post-benefit-tag post-tag">
                      {b}
                    </span>
                  ))}
                </div>
              )}

              {/* Bottom row */}
              <div className="post-bottom-row">
                <div>
                  <div className="post-price-block">
                    <div className="post-price-main">
                      Rs. {price.toLocaleString()}
                    </div>
                    {showOldPrice && oldPrice > 0 && (
                      <div className="post-price-old">
                        Rs. {oldPrice.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="post-price-weight" style={{ marginTop: 2 }}>
                    per {weight}
                  </div>
                  {showOldPrice && saving > 0 && (
                    <div style={{ marginTop: 4 }}>
                      <span className="post-save-chip post-price-bg">
                        SAVE Rs.{saving}
                      </span>
                    </div>
                  )}
                </div>

                {showQR && qrDataUrl && (
                  <div className="post-qr-col">
                    <div className="qr-wrap">
                      <img
                        src={qrDataUrl}
                        width="48"
                        height="48"
                        alt="QR Code"
                        style={{ display: "block" }}
                      />
                    </div>
                    <div className="post-qr-label">Scan to Order</div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="post-footer-bar post-footer">
              <div className="post-website-text">{website.toUpperCase()}</div>
            </div>
          </div>
        </div>

        {/* Caption area */}
        <div
          style={{
            marginTop: 20,
            background: "#1a1a1a",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.1em",
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            Caption Preview
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#ddd",
              lineHeight: 1.6,
              whiteSpace: "pre-line",
            }}
          >
            {caption}
          </div>
        </div>

        {/* Export info */}
        <div
          style={{
            marginTop: 12,
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {[
            "📐 1080 × 1080 px",
            "📱 Instagram / Facebook",
            "🎨 High Quality PNG",
          ].map((label) => (
            <div
              key={label}
              style={{
                background: "#1a1a1a",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Hidden QR generator */}
      <div
        ref={qrRef}
        style={{ position: "absolute", visibility: "hidden", left: -9999 }}
      />
    </div>
  );
}
