import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

export function VelocityCard({
  msgPerMin,
  prev,
  sparkline,
}: {
  msgPerMin: number;
  prev: number;
  sparkline: { v: number }[];
}) {
  const diff = prev > 0 ? Math.round(((msgPerMin - prev) / prev) * 100) : 0;
  const up = diff >= 0;

  return (
    <div className="rounded-xl border border-border-subtle bg-elevated p-4">
      <div className="font-mono text-2xs tracking-[0.1em] text-text-muted">
        MESSAGES / MIN
      </div>
      <div className="mt-1 flex items-end justify-between">
        <motion.div
          key={msgPerMin}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
          className="font-mono text-[32px] font-bold leading-none text-text-primary"
        >
          {msgPerMin}
        </motion.div>
        {prev > 0 && (
          <div
            className="inline-flex items-center gap-1 font-mono text-[11px]"
            style={{ color: up ? "#00CC7A" : "#FF3B3B" }}
          >
            {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(diff)}%
          </div>
        )}
      </div>
      <div className="mt-3 h-12 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkline} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="velGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9146FF" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#9146FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke="#9146FF"
              strokeWidth={1.5}
              fill="url(#velGrad)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
