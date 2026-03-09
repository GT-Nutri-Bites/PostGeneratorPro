export default function LoadingOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="loading-overlay" style={{ display: "flex" }}>
      <div style={{ textAlign: "center" }}>
        <div className="spinner" style={{ margin: "0 auto 12px" }} />
        <div
          style={{
            color: "#FDE68A",
            fontSize: 13,
            letterSpacing: "0.1em",
          }}
        >
          GENERATING POST…
        </div>
      </div>
    </div>
  );
}
