import { useEffect, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react"
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom"

import ThemeToggle from "../components/ThemeToggle"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabase"


function CreatorLogin({
  theme,
  setTheme,
}) {

  const navigate = useNavigate()
  const location = useLocation()

  const {
    user,
    loading: authLoading,
  } = useAuth()


  /* ============================================================
     DETERMINE LOGIN / SIGNUP MODE
  ============================================================ */

  const searchParams = new URLSearchParams(
    location.search
  )

  const urlMode =
    searchParams.get("mode") === "signup"
      ? "signup"
      : "signin"


  const [mode, setMode] = useState(
    urlMode
  )


  /* ============================================================
     FORM STATE
  ============================================================ */

  const [email, setEmail] = useState("")

  const [password, setPassword] = useState("")


  /* ============================================================
     UI STATE
  ============================================================ */

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")

  const [message, setMessage] = useState("")


  /* ============================================================
     REDIRECT IF ALREADY AUTHENTICATED
  ============================================================ */

  useEffect(() => {

    if (
      !authLoading &&
      user
    ) {

      navigate(
        "/create",
        {
          replace: true,
        }
      )

    }

  }, [
    user,
    authLoading,
    navigate,
  ])


  /* ============================================================
     CHANGE LOGIN / SIGNUP MODE
  ============================================================ */

  const changeMode = (newMode) => {

    setMode(newMode)

    setEmail("")

    setPassword("")

    setError("")

    setMessage("")


    navigate(
      newMode === "signup"
        ? "/creator-login?mode=signup"
        : "/creator-login",
      {
        replace: true,
      }
    )

  }


  /* ============================================================
     VALIDATION
  ============================================================ */

  const validateForm = () => {

    const cleanEmail =
      email.trim()


    if (!cleanEmail) {

      return "Please enter your email address."

    }


    if (!cleanEmail.includes("@")) {

      return "Please enter a valid email address."

    }


    if (!password) {

      return "Please enter your password."

    }


    if (password.length < 6) {

      return "Password must contain at least 6 characters."

    }


    return ""

  }


  /* ============================================================
     SUBMIT FORM
  ============================================================ */

  const handleSubmit = async (event) => {

    event.preventDefault()

    setError("")

    setMessage("")


    const validationError =
      validateForm()


    if (validationError) {

      setError(
        validationError
      )

      return

    }


    setLoading(true)


    try {

      /* ========================================================
         SIGN UP
      ======================================================== */

      if (mode === "signup") {

        const {
          data,
          error: signUpError,
        } = await supabase.auth.signUp({

          email:
            email.trim(),

          password,

        })


        if (signUpError) {

          throw signUpError

        }


        /* ------------------------------------------------------
           EMAIL CONFIRMATION ENABLED

           Supabase may create the user but not give
           us a session until the email is confirmed.
        ------------------------------------------------------ */

        if (
          data.user &&
          !data.session
        ) {

          setMessage(
            "Your account has been created. Please check your email and confirm your account before signing in."
          )

          setPassword("")

          return

        }


        /* ------------------------------------------------------
           EMAIL CONFIRMATION DISABLED

           User receives a session immediately.
        ------------------------------------------------------ */

        if (data.session) {

          navigate(
            "/create",
            {
              replace: true,
            }
          )

          return

        }


        throw new Error(
          "Account was created, but no login session was returned."
        )

      }


      /* ========================================================
         SIGN IN
      ======================================================== */

      const {
        data,
        error: signInError,
      } =
        await supabase.auth.signInWithPassword({

          email:
            email.trim(),

          password,

        })


      if (signInError) {

        throw signInError

      }


      if (!data.session) {

        throw new Error(
          "Login succeeded, but no active session was created."
        )

      }


      /* ========================================================
         SUCCESS
      ======================================================== */

      navigate(
        "/create",
        {
          replace: true,
        }
      )

    } catch (authError) {

      console.error(
        "Creator authentication error:",
        authError
      )


      let friendlyMessage =
        authError?.message ||
        "Something went wrong. Please try again."


      /* ========================================================
         COMMON SUPABASE ERRORS
      ======================================================== */

      if (
        authError?.message
          ?.toLowerCase()
          .includes("invalid login credentials")
      ) {

        friendlyMessage =
          "Email or password is incorrect."

      }


      if (
        authError?.message
          ?.toLowerCase()
          .includes("user already registered")
      ) {

        friendlyMessage =
          "This email is already registered. Try signing in."

      }


      if (
        authError?.message
          ?.toLowerCase()
          .includes("email not confirmed")
      ) {

        friendlyMessage =
          "Please confirm your email before signing in."

      }


      setError(
        friendlyMessage
      )

    } finally {

      setLoading(false)

    }

  }


  /* ============================================================
     LOADING AUTH SESSION
  ============================================================ */

  if (authLoading) {

    return (

      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          px-5
        "
      >

        <div
          className="
            flex
            flex-col
            items-center
            gap-4
          "
        >

          <div
            className="
              h-8
              w-8
              animate-spin
              rounded-full
              border-2
              border-theme
              border-t-transparent
            "
          />

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.25em]
              text-theme-muted
            "
          >
            Opening your space...
          </p>

        </div>

      </main>

    )

  }


  /* ============================================================
     IF ALREADY LOGGED IN

     Redirect is handled by useEffect.
  ============================================================ */

  if (user) {
    return null
  }


  /* ============================================================
     PAGE
  ============================================================ */

  return (

    <main
      className="
        min-h-screen
        px-5
        pb-20
        pt-28
        sm:px-8
      "
    >

      {/* ========================================================
          TOP BAR
      ======================================================== */}

      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-50
          px-4
          pt-3
          sm:px-6
        "
      >

        <div
          className="
            mx-auto
            flex
            h-[58px]
            max-w-5xl
            items-center
            justify-between
            rounded-full
            border
            border-theme
            bg-surface-soft
            px-3
            shadow-[0_12px_40px_var(--shadow-soft)]
            backdrop-blur-xl
            sm:h-[62px]
            sm:px-4
          "
        >

          {/* BRAND */}

          <Link
            to="/"
            className="
              group
              flex
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


          {/* THEME */}

          <ThemeToggle
            theme={theme}
            setTheme={setTheme}
          />

        </div>

      </header>


      {/* ========================================================
          LOGIN CARD
      ======================================================== */}

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

          {/* ====================================================
              ICON
          ==================================================== */}

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

            {mode === "signup" ? (

              <Heart
                size={22}
                fill="currentColor"
                className="
                  text-theme-secondary
                "
              />

            ) : (

              <LockKeyhole
                size={21}
                className="
                  text-theme-secondary
                "
              />

            )}

          </div>


          {/* ====================================================
              EYEBROW
          ==================================================== */}

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

            {mode === "signup"
              ? "Create your space"
              : "Creator access"
            }

          </p>


          {/* ====================================================
              TITLE
          ==================================================== */}

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

            {mode === "signup" ? (

              <>
                Create something
                <br />

                <span
                  className="
                    font-serif
                    italic
                    font-normal
                    text-theme-secondary
                  "
                >
                  unforgettable.
                </span>
              </>

            ) : (

              <>
                Welcome
                <br />

                <span
                  className="
                    font-serif
                    italic
                    font-normal
                    text-theme-secondary
                  "
                >
                  back.
                </span>
              </>

            )}

          </h1>


          {/* ====================================================
              DESCRIPTION
          ==================================================== */}

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

            {mode === "signup"

              ? "Create your private creator account and begin making something beautiful for someone special."

              : "Sign in to continue creating and managing your private experiences."

            }

          </p>


          {/* ====================================================
              FORM
          ==================================================== */}

          <form
            onSubmit={handleSubmit}
            className="mt-9"
          >

            {/* EMAIL */}

            <label
              htmlFor="creator-email"
              className="
                block
                text-xs
                font-medium
                text-theme-secondary
              "
            >
              Email address
            </label>


            <div
              className="
                relative
                mt-2
              "
            >

              <Mail
                size={15}
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-theme-faint
                "
              />


              <input
                id="creator-email"
                type="email"
                value={email}
                onChange={(event) => {

                  setEmail(
                    event.target.value
                  )

                  setError("")
                  setMessage("")

                }}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                className="
                  w-full
                  rounded-2xl
                  border
                  border-theme-soft
                  bg-surface-soft
                  px-11
                  py-4
                  text-sm
                  text-theme-primary
                  outline-none
                  placeholder:text-theme-faint
                  transition
                  focus:border-theme-strong
                "
              />

            </div>


            {/* PASSWORD */}

            <label
              htmlFor="creator-password"
              className="
                mt-5
                block
                text-xs
                font-medium
                text-theme-secondary
              "
            >
              Password
            </label>


            <input
              id="creator-password"
              type="password"
              value={password}
              onChange={(event) => {

                setPassword(
                  event.target.value
                )

                setError("")
                setMessage("")

              }}
              placeholder="At least 6 characters"
              autoComplete={
                mode === "signup"
                  ? "new-password"
                  : "current-password"
              }
              disabled={loading}
              className="
                mt-2
                w-full
                rounded-2xl
                border
                border-theme-soft
                bg-surface-soft
                px-5
                py-4
                text-sm
                text-theme-primary
                outline-none
                placeholder:text-theme-faint
                transition
                focus:border-theme-strong
              "
            />


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

              <div
                className="
                  mt-4
                  rounded-2xl
                  border
                  border-theme-soft
                  bg-surface-soft
                  px-4
                  py-3
                  text-center
                  text-xs
                  leading-5
                  text-theme-secondary
                "
              >

                {error}

              </div>

            )}


            {/* ==================================================
                MESSAGE
            ================================================== */}

            {message && (

              <div
                className="
                  mt-4
                  rounded-2xl
                  border
                  border-theme-soft
                  bg-surface-soft
                  px-4
                  py-3
                  text-center
                  text-xs
                  leading-5
                  text-theme-secondary
                "
              >

                {message}

              </div>

            )}


            {/* ==================================================
                SUBMIT
            ================================================== */}

            <button
              type="submit"
              disabled={loading}
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
                transition-all
                duration-300
                hover:-translate-y-0.5
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {loading ? (

                <>
                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-current
                      border-t-transparent
                    "
                  />

                  {mode === "signup"
                    ? "Creating..."
                    : "Signing in..."
                  }

                </>

              ) : (

                <>
                  {mode === "signup"
                    ? "Create my account"
                    : "Sign in"
                  }

                  <ArrowRight
                    size={15}
                    className="
                      transition-transform
                      duration-200
                      group-hover:translate-x-1
                    "
                  />

                </>

              )}

            </button>

          </form>


          {/* ====================================================
              SWITCH MODE
          ==================================================== */}

          <div
            className="
              mt-7
              text-center
            "
          >

            <p
              className="
                text-xs
                text-theme-muted
              "
            >

              {mode === "signup"
                ? "Already have a creator account?"
                : "New here?"
              }

            </p>


            <button
              type="button"
              onClick={() =>
                changeMode(
                  mode === "signup"
                    ? "signin"
                    : "signup"
                )
              }
              className="
                mt-2
                inline-flex
                items-center
                gap-1
                text-xs
                font-semibold
                text-theme-secondary
                transition
                hover:text-theme-primary
              "
            >

              {mode === "signup"
                ? "Sign in"
                : "Create an account"
              }

              <ArrowRight
                size={12}
              />

            </button>

          </div>


          {/* ====================================================
              SECURITY MESSAGE
          ==================================================== */}

          <div
            className="
              mt-8
              flex
              items-center
              justify-center
              gap-2
            "
          >

            <ShieldCheck
              size={13}
              className="
                text-theme-faint
              "
            />

            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.16em]
                text-theme-faint
              "
            >
              Secure creator access
            </span>

          </div>


          {/* ====================================================
              BACK HOME
          ==================================================== */}

          <Link
            to="/"
            className="
              mx-auto
              mt-7
              flex
              w-fit
              items-center
              gap-2
              text-[10px]
              uppercase
              tracking-[0.18em]
              text-theme-muted
              transition
              hover:text-theme-primary
            "
          >

            <ArrowLeft
              size={12}
            />

            Back home

          </Link>

        </div>

      </section>

    </main>

  )
}


export default CreatorLogin