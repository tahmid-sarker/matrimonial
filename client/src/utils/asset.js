export function asset(path) {
  const base = import.meta.env.BASE_URL;
  return base + String(path).replace(/^\/+/, "");
}
