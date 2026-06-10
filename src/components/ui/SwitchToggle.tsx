interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  size?: "default" | "sm";
  color?: string;
}

/**
 * Custom CSS toggle switch.
 * Fixed: thumb is perfectly centered vertically using flexbox instead of
 * absolute positioning with translate, which caused a 1px offset on some screens.
 */
export function Toggle({ checked, onChange, size = "default", color = "#9146FF" }: Props) {
  const w = size === "sm" ? 28 : 36;
  const h = size === "sm" ? 16 : 20;
  const thumbSize = h - 4;
  const travel = w - thumbSize - 4; // distance thumb travels when ON

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200"
      style={{
        width: w,
        height: h,
        background: checked ? color : "#1A1A26",
        padding: "0 2px",
      }}
    >
      <span
        className="rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{
          width: thumbSize,
          height: thumbSize,
          transform: `translateX(${checked ? travel : 0}px)`,
          display: "block",
          flexShrink: 0,
        }}
      />
    </button>
  );
}
