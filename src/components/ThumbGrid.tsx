import type { Product } from "@/data/types";

/* eslint-disable @next/next/no-img-element */
export default function ThumbGrid({
  products,
  selectedProduct,
  onSelectProduct,
}: {
  products: Product[];
  selectedProduct: Product;
  onSelectProduct: (p: Product) => void;
}) {
  return (
    <div
      className="right-panel"
      style={{
        width: 220,
        background: "#141414",
        borderLeft: "1px solid rgba(255,255,255,0.07)",
        padding: 16,
        overflowY: "auto",
        maxHeight: "calc(100vh - 64px)",
      }}
    >
      <div className="ctrl-label">🛒 All Products</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {products.map((p) => (
          <div
            key={p.id}
            className={`thumb-card${p.id === selectedProduct.id ? " active" : ""}`}
            onClick={() => onSelectProduct(p)}
          >
            <img
              src={p.image}
              alt={p.name}
              crossOrigin="anonymous"
              style={{
                width: "100%",
                aspectRatio: "1",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div style={{ padding: "6px 8px" }}>
              <div
                style={{
                  fontSize: 10,
                  color: "#ccc",
                  lineHeight: 1.3,
                  fontWeight: 500,
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#FDE68A",
                  fontWeight: 600,
                  marginTop: 2,
                }}
              >
                Rs. {p.price.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

