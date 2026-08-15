import { Moon, Sun } from "lucide-react"

function ThemeToggle({ theme, setTheme }) {

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark"
        ? "light"
        : "dark"
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-full
        border
        border-theme
        bg-surface-soft
        text-theme-secondary
        transition-all
        duration-300
        hover:border-theme-strong
        hover:bg-surface-hover
        hover:text-theme-primary
      "
    >
      {theme === "dark" ? (
        <Sun
          size={15}
          strokeWidth={1.8}
        />
      ) : (
        <Moon
          size={15}
          strokeWidth={1.8}
        />
      )}
    </button>
  )
}

export default ThemeToggle