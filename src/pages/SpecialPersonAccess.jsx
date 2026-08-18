import { useState } from "react"
import { Heart, LockKeyhole, ArrowRight } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import ThemeToggle from "../components/ThemeToggle"


/*
  ==========================================================
  FRONTEND GIFT CODE

  Change this value whenever you want to change the code
  that unlocks the private experience.

  IMPORTANT:
  This is frontend-only validation. The code is bundled
  into the browser, so it is suitable for your current
  private MVP, not production-grade security.
  ==========================================================
*/

const VALID_GIFT_CODE = "PRIYAM2026"


function SpecialPersonAccess({
  theme,
  setTheme,
}) {

  const navigate = useNavigate()

  const [giftCode, setGiftCode] =
    useState("")

  const [error, setError] =
    useState("")


  /*
    ==========================================================
    VALIDATE THE SINGLE FIELD

    The entered value is compared directly with the code
    defined above.
    ==========================================================
  */

  const handleUnlock = () => {

    setError("")

    const enteredCode =
      giftCode.trim()

    if (!enteredCode) {

      setError(
        "Please enter your private gift code."
      )

      return

    }


    if (
      enteredCode.toUpperCase() !==
      VALID_GIFT_CODE.toUpperCase()
    ) {

      setError(
        "That gift code doesn't look right. Try again ❤️"
      )

      return

    }


    /*
      Code is valid.

      For now we simply open the personalized universe.
      Later this can be replaced with Supabase/backend
      verification without changing the UI.
    */

    sessionStorage.setItem(
      "our-story-access",
      "verified"
    )

    navigate("/universe")

  }


  return (

    <main
      className="
        relative
        min-h-screen
        px-5
        pb-20
        pt-28
        sm:px-8
      "
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-50
          border-b
          border-theme-soft
          bg-theme/75
          backdrop-blur-xl
        "
      >

        <div
          className="
            mx-auto
            flex
            h-16
            max-w-7xl
            items-center
            justify-between
            px-5
            sm:px-8
          "
        >

          <Link
            to="/"
            className="
              flex
              items-center
              gap-3
            "
          >

            <span
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                border
                border-theme
                bg-surface-soft
              "
            >

              <Heart
                size={13}
                className="text-theme-secondary"
                fill="currentColor"
              />

            </span>


            <span
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.25em]
                text-theme-primary
              "
            >
              Our Story
            </span>

          </Link>


          <ThemeToggle
            theme={theme}
            setTheme={setTheme}
          />

        </div>

      </header>


      {/* ======================================================
          ACCESS CARD
          UI intentionally kept the same.
      ====================================================== */}

      <section
        className="
          mx-auto
          flex
          min-h-[calc(100vh-8rem)]
          max-w-xl
          items-center
          justify-center
        "
      >

        <div
          className="
            w-full
            rounded-[32px]
            border
            border-theme
            bg-surface-elevated
            p-7
            shadow-[0_30px_90px_var(--shadow-card)]
            sm:p-10
          "
        >

          {/* ICON */}

          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              border
              border-theme
              bg-surface-soft
            "
          >

            <LockKeyhole
              size={21}
              className="text-theme-secondary"
            />

          </div>


          {/* LABEL */}

          <p
            className="
              mt-7
              text-center
              text-[9px]
              uppercase
              tracking-[0.35em]
              text-theme-muted
            "
          >
            Private access
          </p>


          {/* TITLE */}

          <h1
            className="
              mt-4
              text-center
              text-[clamp(2.4rem,7vw,4rem)]
              font-medium
              leading-[0.95]
              tracking-[-0.055em]
              text-theme-primary
            "
          >

            Someone made
            <br />

            <span className="serif italic text-theme-secondary">
              something for you.
            </span>

          </h1>


          {/* DESCRIPTION */}

          <p
            className="
              mx-auto
              mt-6
              max-w-md
              text-center
              text-sm
              leading-7
              text-theme-muted
            "
          >
            Enter the private code that the creator gave you
            to access your little universe.
          </p>


          {/* ==================================================
              SINGLE VALIDATING FIELD
          ================================================== */}

          <div className="mt-10">

            <label
              className="
                mb-3
                block
                text-xs
                text-theme-secondary
              "
            >
              Gift code
            </label>


            <input
              type="password"
              value={giftCode}
              onChange={(event) => {
                setGiftCode(event.target.value)
                setError("")
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleUnlock()
                }
              }}
              placeholder="Enter your gift code"
              autoComplete="off"
              className="
                create-input
                w-full
                rounded-2xl
                border
                px-5
                py-4
                text-sm
                outline-none
                transition
              "
            />


            <button
              type="button"
              onClick={handleUnlock}
              className="
                group
                mt-5
                flex
                w-full
                items-center
                justify-center
                gap-3
                rounded-full
                bg-theme-button
                px-6
                py-4
                text-sm
                font-semibold
                text-theme-button
                transition
                hover:-translate-y-0.5
              "
            >

              Open my universe

              <ArrowRight
                size={15}
                className="
                  transition-transform
                  group-hover:translate-x-1
                "
              />

            </button>

          </div>


          {/* ERROR */}

          {error && (

            <p
              className="
                mt-4
                text-center
                text-xs
                text-theme-secondary
              "
            >
              {error}
            </p>

          )}

        </div>

      </section>

    </main>

  )
}


export default SpecialPersonAccess