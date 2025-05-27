import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import { useTheme } from "../lib/theme";
import clsx from "clsx";

export default function Layout({ children }) {
  const { theme } = useTheme();
  return (
    <div className={clsx(
      "min-h-screen transition-colors duration-500",
      theme === "dark" ? "bg-black text-white" : "bg-gradient-to-br from-peach to-lightyellow text-black"
    )}>
      <nav className="w-full flex justify-between items-center px-6 py-4 shadow-md">
        <Link href="/" className="font-bold text-2xl flex items-center gap-2">
          <img src="/images/logo.png" alt="GPB Nexus" className="h-8 w-8" />
          GPB Nexus
        </Link>
        <ThemeToggle />
      </nav>
      <main className="max-w-3xl mx-auto p-4">{children}</main>
    </div>
  );
}
