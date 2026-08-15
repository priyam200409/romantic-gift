import { useState } from "react"
import { Heart, LockKeyhole, ArrowRight, ShieldCheck } from "lucide-react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import ThemeToggle from "../components/ThemeToggle"


function SpecialPersonAccess({
  theme,
  setTheme,
}) {

  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const giftIdFromUrl =
    searchParams.get("gift") || ""


  const [giftId, setGiftId] =
    useState(giftIdFromUrl)

  const [privateKey, setPrivateKey] =
    useState("")

  const [step, setStep] =
    useState(1)


  const [error, setError] =
    useState("")


  /* ==========================================================
     STEP 1
     IDENTIFY THE GIFT
  ========================================================== */

  const handleContinue = () => {

    setError("")

    if (!giftId.trim()) {

      setError(
        "Please enter your private gift code."
      )

      return

    }

    setStep(2)

  }


  /* ==========================================================
     STEP 2
     PRIVATE KEY

     IMPORTANT:

     This is currently a prototype.

     Later the backend will verify the key securely.
  ========================================================== */

  const handleUnlock = () => {

    setError("")


    if (!privateKey.trim()) {

      setError(
        "Please enter your private key."
      )

      return

    }


    /*
      TEMPORARY DEVELOPMENT BEHAVIOUR

      We are not pretending this is production
      authentication yet.

      Later:

      privateKey
          ↓
      Supabase/server
          ↓
      verify gift
          ↓
      create recipient session
          ↓
      Universe
    */


    sessionStorage.setItem(
      "our-story-access",
      "pending-verification"
    )


    sessionStorage.setItem(
      "our-story-gift-id",
      giftId.trim()
    )


    navigate(
      `/access?gift=${encodeURIComponent(
        giftId.trim()
      )}&verify=true`
    )

  }


  const verificationMode =
    searchParams.get("verify") === "true"


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

            {verificationMode ? (

              <ShieldCheck
                size={22}
                className="text-theme-secondary"
              />

            ) : (

              <LockKeyhole
                size={21}
                className="text-theme-secondary"
              />

            )}

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

            {verificationMode
              ? "One more step"
              : "Private access"}

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

            {verificationMode ? (

              <>
                Make sure it's
                <br />
                <span className="serif italic text-theme-secondary">
                  really you.
                </span>
              </>

            ) : (

              <>
                Someone made
                <br />
                <span className="serif italic text-theme-secondary">
                  something for you.
                </span>
              </>

            )}

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

            {verificationMode

              ? "This private experience has one more little question before it opens."

              : "Enter the private code that the creator gave you to access your little universe."
            }

          </p>


          {/* ==================================================
              STEP 1
          ================================================== */}

          {!verificationMode && step === 1 && (

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
                value={giftId}
                onChange={(event) =>
                  setGiftId(
                    event.target.value
                  )
                }
                placeholder="Enter your gift code"
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
                onClick={handleContinue}
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

                Continue

                <ArrowRight
                  size={15}
                  className="
                    transition-transform
                    group-hover:translate-x-1
                  "
                />

              </button>

            </div>

          )}


          {/* ==================================================
              STEP 2
          ================================================== */}

          {!verificationMode && step === 2 && (

            <div className="mt-10">

              <label
                className="
                  mb-3
                  block
                  text-xs
                  text-theme-secondary
                "
              >
                Private key
              </label>


              <input
                type="password"
                value={privateKey}
                onChange={(event) =>
                  setPrivateKey(
                    event.target.value
                  )
                }
                placeholder="Enter the private key"
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

                Continue to verification

                <ArrowRight
                  size={15}
                  className="
                    transition-transform
                    group-hover:translate-x-1
                  "
                />

              </button>

            </div>

          )}


          {/* ==================================================
              VERIFICATION PLACEHOLDER

              We will replace this with the creator-defined
              question once the backend/data structure is ready.
          ================================================== */}

          {verificationMode && (

            <div className="mt-10">

              <div
                className="
                  rounded-2xl
                  border
                  border-theme-soft
                  bg-surface-soft
                  p-5
                "
              >

                <p
                  className="
                    text-xs
                    text-theme-muted
                  "
                >
                  Verification question
                </p>


                <p
                  className="
                    mt-3
                    text-sm
                    leading-6
                    text-theme-primary
                  "
                >
                  What is a special memory only the two of you would know?
                </p>

              </div>


              <input
                placeholder="Your answer..."
                className="
                  create-input
                  mt-4
                  w-full
                  rounded-2xl
                  border
                  px-5
                  py-4
                  text-sm
                  outline-none
                "
              />


              <button
                type="button"
                onClick={() =>
                  navigate("/universe")
                }
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

                Enter my universe

                <Heart
                  size={15}
                  fill="currentColor"
                  className="
                    transition-transform
                    group-hover:scale-110
                  "
                />

              </button>

            </div>

          )}


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