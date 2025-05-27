import { useTheme } from "../lib/theme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      className="rounded-full p-2 bg-accent text-white hover:scale-105 transition"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
