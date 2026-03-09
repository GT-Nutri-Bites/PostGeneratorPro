export default function Header() {
  return (
    <div className="header-gradient px-6 py-4 flex items-center justify-between">
      <div>
        <div
          style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: 26,
            letterSpacing: "0.1em",
            color: "#FDE68A",
          }}
        >
          GT Nutri Bites
        </div>
        <div
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.12em",
            marginTop: -2,
          }}
        >
          SOCIAL POST GENERATOR
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            background: "rgba(217,119,6,0.15)",
            border: "1px solid rgba(217,119,6,0.3)",
            borderRadius: 8,
            padding: "6px 14px",
            fontSize: 12,
            color: "#FDE68A",
          }}
        >
          ✦ 1:1 Square Format
        </div>
      </div>
    </div>
  );
}
