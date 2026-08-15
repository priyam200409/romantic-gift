import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  LockKeyhole,
  Sparkles,
  Stars,
} from "lucide-react"
import { Link } from "react-router-dom"

import Navbar from "../components/Navbar"


function Home({
  theme,
  setTheme,
}) {

  return (

    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        text-theme-primary
      "
    >

      {/* =========================================================
          NAVBAR
      ========================================================= */}

      <Navbar
        theme={theme}
        setTheme={setTheme}
      />


      {/* =========================================================
          HERO
      ========================================================= */}

      <section
        id="story"
        className="
          relative
          flex
          min-h-screen
          items-center
          px-5
          pb-20
          pt-32
          sm:px-8
          lg:px-12
        "
      >

        {/* =====================================================
            DECORATIVE GLOW
        ===================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[18%]
            h-[420px]
            w-[420px]
            -translate-x-1/2
            rounded-full
            bg-[radial-gradient(circle,var(--romantic-glow),transparent_68%)]
            opacity-70
            blur-3xl
          "
        />


        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-32
            top-[45%]
            h-[300px]
            w-[300px]
            rounded-full
            bg-[radial-gradient(circle,var(--romantic-glow-secondary),transparent_70%)]
            opacity-50
            blur-3xl
          "
        />


        {/* =====================================================
            HERO CONTENT
        ===================================================== */}

        <div
          className="
            relative
            z-10
            mx-auto
            w-full
            max-w-7xl
          "
        >

          <div
            className="
              mx-auto
              max-w-5xl
              text-center
            "
          >

            {/* =================================================
                EYEBROW
            ================================================= */}

            <div
              className="
                mb-7
                flex
                items-center
                justify-center
                gap-3
              "
            >

              <span
                className="
                  h-px
                  w-8
                  bg-theme-strong
                  sm:w-12
                "
              />

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.34em]
                  text-theme-muted
                  sm:text-[10px]
                "
              >

                <Stars
                  size={12}
                  className="text-theme-secondary"
                />

                A little place for your story

              </div>

              <span
                className="
                  h-px
                  w-8
                  bg-theme-strong
                  sm:w-12
                "
              />

            </div>


            {/* =================================================
                MAIN TITLE
            ================================================= */}

            <h1
              className="
                mx-auto
                max-w-5xl
                text-[clamp(3.4rem,10vw,8rem)]
                font-medium
                leading-[0.84]
                tracking-[-0.065em]
                text-theme-primary
              "
            >

              Some stories

              <br />

              <span
                className="
                  font-serif
                  italic
                  font-normal
                  text-theme-secondary
              "
              >
                deserve their own universe.
              </span>

            </h1>


            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <p
              className="
                mx-auto
                mt-8
                max-w-2xl
                text-sm
                leading-7
                text-theme-muted
                sm:text-base
                sm:leading-8
              "
            >

              Create a private little world filled with
              memories, questions, photographs, words,
              plans, and everything you wish you could
              say to someone special.

            </p>


            {/* =================================================
                MAIN ACTIONS
            ================================================= */}

            <div
              className="
                mt-10
                flex
                flex-col
                items-center
                justify-center
                gap-3
                sm:flex-row
              "
            >

              {/* =================================================
                  CREATE GIFT
              ================================================= */}

              <Link
                to="/creator-login?mode=signup"
                className="
                  group
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2.5
                  rounded-full
                  bg-theme-button
                  px-7
                  py-4
                  text-sm
                  font-semibold
                  text-theme-button
                  shadow-[0_12px_35px_var(--shadow-soft)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_18px_45px_var(--shadow-card)]
                  sm:w-auto
                "
              >

                <Heart
                  size={16}
                  fill="currentColor"
                  strokeWidth={1.7}
                />

                Create a Gift

                <ArrowRight
                  size={15}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />

              </Link>


              {/* =================================================
                  SPECIAL PERSON
              ================================================= */}

              <Link
                to="/access"
                className="
                  group
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2.5
                  rounded-full
                  border
                  border-theme
                  bg-surface-soft
                  px-7
                  py-4
                  text-sm
                  font-medium
                  text-theme-primary
                  shadow-[0_10px_30px_var(--shadow-soft)]
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-theme-strong
                  hover:bg-surface-hover
                  sm:w-auto
                "
              >

                <Sparkles
                  size={16}
                  className="text-theme-secondary"
                />

                I'm the Special Person

                <ArrowRight
                  size={15}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />

              </Link>

            </div>


            {/* =================================================
                CREATOR SIGN IN
            ================================================= */}

            <div
              className="
                mt-6
                flex
                flex-wrap
                items-center
                justify-center
                gap-2
                text-xs
                text-theme-muted
              "
            >

              <span>
                Already creating something?
              </span>


              <Link
                to="/creator-login"
                className="
                  font-semibold
                  text-theme-secondary
                  underline-offset-4
                  transition-colors
                  duration-300
                  hover:text-theme-primary
                  hover:underline
                "
              >

                Creator sign in

              </Link>

            </div>

          </div>


          {/* =====================================================
              EXPERIENCE PREVIEW
          ===================================================== */}

          <div
            className="
              mx-auto
              mt-20
              grid
              max-w-5xl
              grid-cols-1
              gap-3
              sm:grid-cols-3
            "
          >

            {/* MEMORY */}

            <div
              className="
                group
                rounded-[26px]
                border
                border-theme
                bg-surface-soft
                p-6
                text-left
                backdrop-blur-xl
                transition-all
                duration-500
                hover:-translate-y-1
                hover:border-theme-strong
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-theme
                  bg-surface-hover
                "
              >

                <Heart
                  size={16}
                  className="
                    text-theme-secondary
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />

              </div>


              <p
                className="
                  mt-6
                  text-[9px]
                  uppercase
                  tracking-[0.28em]
                  text-theme-muted
                "
              >
                Your memories
              </p>


              <h2
                className="
                  mt-2
                  font-serif
                  text-xl
                  italic
                  text-theme-primary
                "
              >
                The moments that matter.
              </h2>


              <p
                className="
                  mt-3
                  text-xs
                  leading-6
                  text-theme-muted
                "
              >
                Photos and memories gathered into
                one private little world.

              </p>

            </div>


            {/* HEART */}

            <div
              className="
                group
                rounded-[26px]
                border
                border-theme
                bg-surface-soft
                p-6
                text-left
                backdrop-blur-xl
                transition-all
                duration-500
                hover:-translate-y-1
                hover:border-theme-strong
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-theme
                  bg-surface-hover
                "
              >

                <Sparkles
                  size={16}
                  className="
                    text-theme-secondary
                    transition-transform
                    duration-300
                    group-hover:rotate-12
                  "
                />

              </div>


              <p
                className="
                  mt-6
                  text-[9px]
                  uppercase
                  tracking-[0.28em]
                  text-theme-muted
                "
              >
                From your heart
              </p>


              <h2
                className="
                  mt-2
                  font-serif
                  text-xl
                  italic
                  text-theme-primary
                "
              >
                Things worth saying.
              </h2>


              <p
                className="
                  mt-3
                  text-xs
                  leading-6
                  text-theme-muted
                "
              >
                Personal questions, answers, letters,
                and words meant just for them.

              </p>

            </div>


            {/* PRIVATE */}

            <div
              className="
                group
                rounded-[26px]
                border
                border-theme
                bg-surface-soft
                p-6
                text-left
                backdrop-blur-xl
                transition-all
                duration-500
                hover:-translate-y-1
                hover:border-theme-strong
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-theme
                  bg-surface-hover
                "
              >

                <LockKeyhole
                  size={16}
                  className="
                    text-theme-secondary
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />

              </div>


              <p
                className="
                  mt-6
                  text-[9px]
                  uppercase
                  tracking-[0.28em]
                  text-theme-muted
                "
              >
                Made private
              </p>


              <h2
                className="
                  mt-2
                  font-serif
                  text-xl
                  italic
                  text-theme-primary
                "
              >
                Just between you two.
              </h2>


              <p
                className="
                  mt-3
                  text-xs
                  leading-6
                  text-theme-muted
                "
              >
                A private experience designed so only
                the intended person can enter.

              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}

      <section
        id="how-it-works"
        className="
          relative
          px-5
          py-28
          sm:px-8
          lg:px-12
        "
      >

        <div
          className="
            mx-auto
            max-w-6xl
          "
        >

          <div
            className="
              max-w-xl
            "
          >

            <p
              className="
                text-[9px]
                uppercase
                tracking-[0.32em]
                text-theme-muted
              "
            >
              How it works
            </p>


            <h2
              className="
                mt-4
                text-4xl
                font-medium
                tracking-[-0.045em]
                text-theme-primary
                sm:text-5xl
              "
            >

              You create it.

              <br />

              <span
                className="
                  font-serif
                  italic
                  font-normal
                  text-theme-secondary
                "
              >
                They discover it.
              </span>

            </h2>

          </div>


          <div
            className="
              mt-14
              grid
              gap-4
              md:grid-cols-3
            "
          >

            {/* STEP 01 */}

            <div
              className="
                rounded-[28px]
                border
                border-theme
                bg-surface-soft
                p-7
              "
            >

              <span
                className="
                  text-[10px]
                  font-semibold
                  tracking-[0.2em]
                  text-theme-secondary
                "
              >
                01
              </span>


              <h3
                className="
                  mt-8
                  text-xl
                  font-medium
                  text-theme-primary
                "
              >
                Tell your story.
              </h3>


              <p
                className="
                  mt-3
                  text-sm
                  leading-7
                  text-theme-muted
                "
              >
                Add the memories, photographs, questions,
                answers, letter, plans, and little details
                that make your relationship yours.

              </p>

            </div>


            {/* STEP 02 */}

            <div
              className="
                rounded-[28px]
                border
                border-theme
                bg-surface-soft
                p-7
              "
            >

              <span
                className="
                  text-[10px]
                  font-semibold
                  tracking-[0.2em]
                  text-theme-secondary
                "
              >
                02
              </span>


              <h3
                className="
                  mt-8
                  text-xl
                  font-medium
                  text-theme-primary
                "
              >
                Make it private.
              </h3>


              <p
                className="
                  mt-3
                  text-sm
                  leading-7
                  text-theme-muted
                "
              >
                Your experience is connected to your
                creator account and protected before it
                is shared.

              </p>

            </div>


            {/* STEP 03 */}

            <div
              className="
                rounded-[28px]
                border
                border-theme
                bg-surface-soft
                p-7
              "
            >

              <span
                className="
                  text-[10px]
                  font-semibold
                  tracking-[0.2em]
                  text-theme-secondary
                "
              >
                03
              </span>


              <h3
                className="
                  mt-8
                  text-xl
                  font-medium
                  text-theme-primary
                "
              >
                Give them the key.
              </h3>


              <p
                className="
                  mt-3
                  text-sm
                  leading-7
                  text-theme-muted
                "
              >
                Share the private experience with your
                special person and let them discover
                everything you created.

              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          FINAL CTA
      ========================================================= */}

      <section
        className="
          px-5
          pb-28
          sm:px-8
        "
      >

        <div
          className="
            relative
            mx-auto
            max-w-5xl
            overflow-hidden
            rounded-[36px]
            border
            border-theme
            bg-surface-soft
            px-6
            py-16
            text-center
            shadow-[0_30px_90px_var(--shadow-soft)]
            sm:px-10
            sm:py-20
          "
        >

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-1/2
              top-0
              h-64
              w-64
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[radial-gradient(circle,var(--romantic-glow),transparent_70%)]
              blur-3xl
            "
          />


          <div
            className="
              relative
              z-10
            "
          >

            <Heart
              size={20}
              fill="currentColor"
              className="
                mx-auto
                text-theme-secondary
              "
            />


            <p
              className="
                mt-6
                text-[9px]
                uppercase
                tracking-[0.32em]
                text-theme-muted
              "
            >
              Start with a feeling
            </p>


            <h2
              className="
                mx-auto
                mt-4
                max-w-2xl
                text-4xl
                font-medium
                leading-tight
                tracking-[-0.045em]
                text-theme-primary
                sm:text-5xl
              "
            >

              Give someone a place
              <br />

              <span
                className="
                  font-serif
                  italic
                  font-normal
                  text-theme-secondary
                "
              >
                to remember you.
              </span>

            </h2>


            <Link
              to="/creator-login?mode=signup"
              className="
                group
                mx-auto
                mt-8
                flex
                w-fit
                items-center
                gap-2
                rounded-full
                bg-theme-button
                px-7
                py-3.5
                text-sm
                font-semibold
                text-theme-button
                transition-all
                duration-300
                hover:-translate-y-1
              "
            >

              Begin your story

              <ArrowUpRight
                size={15}
                className="
                  transition-transform
                  duration-200
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />

            </Link>

          </div>

        </div>

      </section>


      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer
        className="
          border-t
          border-theme
          px-5
          py-8
          sm:px-8
        "
      >

        <div
          className="
            mx-auto
            flex
            max-w-6xl
            flex-col
            items-center
            justify-between
            gap-4
            text-center
            sm:flex-row
            sm:text-left
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <Heart
              size={12}
              fill="currentColor"
              className="text-theme-secondary"
            />

            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.24em]
                text-theme-muted
              "
            >
              Our Story
            </span>

          </div>


          <p
            className="
              text-[10px]
              text-theme-faint
            "
          >
            Made for the moments that matter.
          </p>


          <Link
            to="/access"
            className="
              text-[10px]
              text-theme-muted
              transition
              hover:text-theme-primary
            "
          >
            Special person access
          </Link>

        </div>

      </footer>

    </main>

  )
}


export default Home