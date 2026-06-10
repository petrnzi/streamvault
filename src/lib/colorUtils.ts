export function hashString(str: string): number {
  return str.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
}

const READABLE_COLORS = [
  "#FF4500", "#FF6347", "#FF7F50", "#1E90FF", "#00FF7F",
  "#FF69B4", "#9ACD32", "#FF8C00", "#DA70D6", "#5F9EA0",
  "#DC143C", "#00CED1", "#7B68EE", "#32CD32", "#FFD700",
  "#40E0D0", "#FF1493", "#7FFF00", "#FF6B6B", "#4ECDC4",
];

export function colorForUsername(username: string): string {
  return READABLE_COLORS[hashString(username) % READABLE_COLORS.length];
}

export function avatarColors(username: string): { bg: string; fg: string } {
  const h = hashString(username) % 360;
  return {
    bg: `hsl(${h}, 55%, 28%)`,
    fg: `hsl(${h}, 65%, 70%)`,
  };
}

export function initialOf(name: string): string {
  return (name?.[0] ?? "?").toUpperCase();
}
