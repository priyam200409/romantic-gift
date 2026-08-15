import { ArrowUpRight, Heart, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"

import ThemeToggle from "./ThemeToggle"


function Navbar({
  theme,
  setTheme,
}) {

  return (

    <header
      className="
        fixed
        left-0
        right-0
        top-0
        z-50
      "
    >

      <div
        className="
          mx-auto
          px-4
          pt-3
          sm:px-6
          lg:max-w-[1320px]
          lg:px-10
        "
      >

        <nav
          className="
            flex
            h-[58px]
            items-center
            justify-between
            rounded-full
            border
            border-theme
            bg-surface-soft
            px-3
            pl-3
            shadow-[0_12px_40px_var(--shadow-soft)]
            backdrop-blur-xl
            sm:h-[62px]
            sm:pl-4
            sm:pr-2
          "
        >

          {/* =====================================================
              BRAND
          ===================================================== */}

          <Link
            to="/"
            className="
              group
              flex
              shrink-0
              items-center
              gap-3
            "
          >

            <span
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
                transition-all
                duration-300
                group-hover:border-theme-strong
                group-hover:bg-surface-hover
              "
            >

              <Heart
                size={14}
                strokeWidth={1.8}
                className="
                  text-theme-secondary
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              />

            </span>


            <span
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.26em]
                text-theme-primary
              "
            >
              Our Story
            </span>

          </Link>


          {/* =====================================================
              DESKTOP NAVIGATION
          ===================================================== */}

          <div
            className="
              hidden
              items-center
              gap-7
              lg:flex
            "
          >

            {/* OUR IDEA */}

            <a
              href="#story"
              className="
                text-xs
                text-theme-muted
                transition-colors
                duration-300
                hover:text-theme-primary
              "
            >
              Our idea
            </a>


            {/* HOW IT WORKS */}

            <a
              href="#how-it-works"
              className="
                text-xs
                text-theme-muted
                transition-colors
                duration-300
                hover:text-theme-primary
              "
            >
              How it works
            </a>


            {/* SPECIAL PERSON */}

            <Link
              to="/access"
              className="
                flex
                items-center
                gap-1.5
                text-xs
                text-theme-muted
                transition-colors
                duration-300
                hover:text-theme-primary
              "
            >

              <Sparkles
                size={12}
                className="
                  text-theme-secondary
                "
              />

              Special person

            </Link>

          </div>


          {/* =====================================================
              RIGHT SIDE
          ===================================================== */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            {/* =================================================
                THEME TOGGLE
            ================================================= */}

            <ThemeToggle
              theme={theme}
              setTheme={setTheme}
            />


            {/* =================================================
                CREATOR SIGN IN
            ================================================= */}

            <Link
              to="/creator-login"
              className="
                hidden
                rounded-full
                px-3
                py-2
                text-[10px]
                font-medium
                text-theme-muted
                transition-colors
                duration-300
                hover:bg-surface-hover
                hover:text-theme-primary
                sm:block
              "
            >
              Sign in
            </Link>


            {/* =================================================
                CREATE BUTTON
            ================================================= */}

            <Link
              to="/creator-login?mode=signup"
              className="
                group
                flex
                items-center
                gap-2
                rounded-full
                bg-theme-button
                px-4
                py-2.5
                text-xs
                font-semibold
                text-theme-button
                shadow-[0_6px_20px_var(--shadow-soft)]
                transition-all
                duration-300
                hover:-translate-y-[1px]
                hover:shadow-[0_8px_25px_var(--shadow-card)]
                sm:px-5
              "
            >

              <span className="hidden xs:inline">
                Create
              </span>

              <span className="xs:hidden">
                Create
              </span>

              <ArrowUpRight
                size={14}
                className="
                  transition-transform
                  duration-200
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />

            </Link>

          </div>

        </nav>

      </div>

    </header>

  )
}


export default Navbar