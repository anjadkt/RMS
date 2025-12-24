export default function DotLoader({
  size = "md",
  color = "#cd0045",
  backdrop = true,
}) {
  const sizes = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-3 w-3",
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        backdrop ? "bg-black/50" : ""
      }`}
    >
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`${sizes[size]} rounded-full animate-bounce`}
            style={{
              backgroundColor: color,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}