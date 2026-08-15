import { useEffect, useState } from "react"
import {
  Heart,
  Sparkles,
  Stars,
} from "lucide-react"
import {
  useLocation,
  useNavigate,
} from "react-router-dom"


function Generating({
  theme,
  setTheme,
}) {

  const navigate = useNavigate()
  const location = useLocation()

  const [messageIndex, setMessageIndex] =
    useState(0)

  const messages = [
    "Gathering your memories...",
    "Finding the moments that matter...",
    "Turning your words into something beautiful...",
    "Adding a little magic...",
    "Your little universe is almost ready...",
  ]


  /*
   * ==========================================================
   * GET GIFT ID
   *
   * CreateGift already gives us the gift ID.
   * We do NOT query Supabase again here.
   * ==========================================================
   */

  const giftId =
    location.state?.giftId ||
    localStorage.getItem(
      "our-story-gift-id"
    )


  const giftCode =
    location.state?.giftCode ||
    localStorage.getItem(
      "our-story-gift-code"
    )


  /*
   * ==========================================================
   * MESSAGE ANIMATION
   * ==========================================================
   */

  useEffect(() => {

    const interval =
      window.setInterval(() => {

        setMessageIndex(
          (previous) =>
            Math.min(
              previous + 1,
              messages.length - 1
            )
        )

      }, 1300)


    return () => {
      window.clearInterval(interval)
    }

  }, [])


  /*
   * ==========================================================
   * MOVE TO UNIVERSE
   *
   * We only need the ID.
   *
   * No Supabase request here.
   * ==========================================================
   */

  useEffect(() => {

    if (!giftId) {
      return
    }


    const timer =
      window.setTimeout(() => {

        navigate(
          "/universe",
          {
            replace: true,

            state: {
              giftId,
              giftCode,
            },
          }
        )

      }, 5200)


    return () => {
      window.clearTimeout(timer)
    }

  }, [
    giftId,
    giftCode,
    navigate,
  ])


  /*
   * ==========================================================
   * NO GIFT ID
   * ==========================================================
   */

  if (!giftId) {

    return (

      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          px-6
        "
      >

        <div
          className="
            w-full
            max-w-md
            rounded-3xl
            border
            border-theme
            bg-surface-elevated
            p-8
            text-center
          "
        >

          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              border
              border-theme
              bg-surface-soft
            "
          >

            <Heart
              size={20}
              className="
                text-theme-secondary
              "
              fill="currentColor"
            />

          </div>


          <h1
            className="
              mt-6
              text-xl
              font-medium
              text-theme-primary
            "
          >
            Your story wasn't found
          </h1>


          <p
            className="
              mt-3
              text-sm
              leading-6
              text-theme-muted
            "
          >
            We couldn't find the experience
            you just created.
          </p>


          <button
            type="button"
            onClick={() =>
              navigate(
                "/create",
                {
                  replace: true,
                }
              )
            }
            className="
              mt-7
              rounded-full
              bg-theme-button
              px-6
              py-3
              text-sm
              font-semibold
              text-theme-button
            "
          >
            Create again
          </button>

        </div>

      </main>

    )

  }


  /*
   * ==========================================================
   * MAIN GENERATING SCREEN
   * ==========================================================
   */

  return (

    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        px-6
      "
    >

      {/* ======================================================
          AMBIENT GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[420px]
          w-[420px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[var(--glow-rose)]
          opacity-30
          blur-[110px]
        "
      />


      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-10
          flex
          max-w-xl
          flex-col
          items-center
          text-center
        "
      >

        <div
          className="
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full
            border
            border-theme
            bg-surface-soft
            shadow-[0_20px_60px_var(--shadow-card)]
          "
        >

          <Heart
            size={28}
            className="
              animate-pulse
              text-theme-secondary
            "
            fill="currentColor"
          />

        </div>


        <p
          className="
            mt-10
            text-[9px]
            uppercase
            tracking-[0.35em]
            text-theme-muted
          "
        >
          Creating your little universe
        </p>


        <h1
          className="
            mt-5
            text-[clamp(2.4rem,6vw,4.5rem)]
            font-medium
            leading-[0.95]
            tracking-[-0.055em]
            text-theme-primary
          "
        >
          Almost ready.
        </h1>


        <div
          className="
            mt-8
            flex
            min-h-8
            items-center
            justify-center
            gap-3
          "
        >

          <Sparkles
            size={15}
            className="
              text-theme-secondary
            "
          />

          <p
            className="
              text-sm
              text-theme-muted
            "
          >
            {messages[messageIndex]}
          </p>

        </div>


        {/* ====================================================
            PROGRESS
        ==================================================== */}

        <div
          className="
            mt-10
            h-1
            w-full
            max-w-xs
            overflow-hidden
            rounded-full
            bg-surface-hover
          "
        >

          <div
            className="
              h-full
              rounded-full
              bg-theme-button
            "
            style={{
              width:
                `${Math.min(
                  ((messageIndex + 1) /
                    messages.length) *
                    100,
                  100
                )}%`,
              transition:
                "width 1200ms ease",
            }}
          />

        </div>


        <div
          className="
            mt-7
            flex
            items-center
            gap-2
          "
        >

          <Stars
            size={12}
            className="
              text-theme-muted
            "
          />

          <span
            className="
              text-[9px]
              uppercase
              tracking-[0.25em]
              text-theme-faint
            "
          >
            Made from your story
          </span>

        </div>

      </div>

    </main>

  )
}


export default Generating