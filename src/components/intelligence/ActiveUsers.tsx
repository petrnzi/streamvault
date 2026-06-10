import { Users } from "lucide-react";

export function ActiveUsers({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border-subtle bg-elevated px-4 py-3">
      <Users size={14} className="text-text-muted" />
      <div className="font-mono text-[20px] font-semibold leading-none text-text-primary">
        {count}
      </div>
      <div className="text-[11px] leading-tight text-text-muted">
        chatting<br />right now
      </div>
    </div>
  );
}
