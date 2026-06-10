import { motion } from "framer-motion";

export function HypeMeter({ hype }: { hype: number }) {
  const clamped = Math.min(200, Math.max(0, hype));
  const pct = clamped / 200;
  // semicircle: from 180deg to 360deg = length = PI * r
  const r = 88;
  const cx = 110;
  const cy = 100;
  const circumference = Math.PI * r;
  const dashoffset = circumference * (1 - pct);

  const color = clamped < 60 ? "#53FC18" : clamped < 120 ? "#F0A500" : "#FF3B3B";
  const label = clamped < 60 ? "CALM" : clamped < 120 ? "HYPE" : "🔥 LIT";
  const isLit = clamped >= 150;

  return (
    <div
      className={`rounded-xl border border-border-subtle bg-elevated p-4 pb-3 ${isLit ? "hype-pulse" : ""}`}
    >
      <div className="font-mono text-2xs tracking-[0.1em] text-text-muted">HYPE</div>
      <div className="flex justify-center">
        <svg width="220" height="120" viewBox="0 0 220 120">
          <defs>
            <filter id="hypeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>
          {/* track */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            stroke="#1A1A26"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* glow */}
          <motion.path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={false}
            animate={{ strokeDashoffset: dashoffset }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            opacity={0.35}
            filter="url(#hypeGlow)"
          />
          {/* value */}
          <motion.path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={false}
            animate={{ strokeDashoffset: dashoffset }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
          />
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fontSize="28"
            fontWeight="700"
            fontFamily="Geist Mono, monospace"
            fill={color}
          >
            {Math.round(clamped)}
          </text>
        </svg>
      </div>
      <div
        className="-mt-2 text-center font-mono text-2xs tracking-[0.12em]"
        style={{ color: isLit ? color : "#505068" }}
      >
        {label}
      </div>
    </div>
  );
}
