import { useEffect, useState } from "react"
import {
  ArrowLeft,
  Heart,
  Plus,
  Sparkles,
} from "lucide-react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import ThemeToggle from "../components/ThemeToggle"


function FromTheirHeart({
  theme,
  setTheme,
}) {

  const [story, setStory] = useState(null)

  const [activeQuestion, setActiveQuestion] =
    useState(null)


  /* ============================================================
     LOAD STORY
  ============================================================ */

  useEffect(() => {

    try {

      const savedStory =
        localStorage.getItem(
          "our-story-data"
        )


      if (!savedStory) {
        return
      }


      const parsedStory =
        JSON.parse(savedStory)


      setStory(parsedStory)

    } catch (error) {

      console.error(
        "Unable to load story:",
        error
      )

    }

  }, [])


  /* ============================================================
     QUESTIONS

     Combine:

     1. Default heart questions
     2. Creator's custom questions
  ============================================================ */

  const personalQuestions =
    Array.isArray(
      story?.heartQuestions
    )
      ? story.heartQuestions
      : []


  const customQuestions =
    Array.isArray(
      story?.customQuestions
    )
      ? story.customQuestions
      : []


  const questions = [

    ...personalQuestions
      .filter(
        (item) =>
          item?.question?.trim() &&
          item?.answer?.trim()
      )
      .map(
        (item) => ({
          ...item,
          category:
            "From my heart",
        })
      ),


    ...customQuestions
      .filter(
        (item) =>
          item?.question?.trim() &&
          item?.answer?.trim()
      )
      .map(
        (item) => ({
          ...item,
          category:
            "Just for you",
        })
      ),

  ]


  /* ============================================================
     TOGGLE ANSWER

     IMPORTANT:

     We don't use layout animation here.

     This prevents the entire page from sliding/jumping.
  ============================================================ */

  const toggleQuestion = (id) => {

    setActiveQuestion(
      (current) =>
        current === id
          ? null
          : id
    )

  }


  /* ============================================================
     LOADING
  ============================================================ */

  if (!story) {

    return (

      <main
        className="
          min-h-screen
          flex
          items-center
          justify-center
          px-6
        "
      >

        <div
          className="
            text-center
          "
        >

          <Heart
            size={22}
            className="
              mx-auto
              text-theme-secondary
            "
          />


          <p
            className="
              mt-5
              text-sm
              text-theme-muted
            "
          >
            This story hasn't been created yet.
          </p>


          <Link
            to="/"
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-theme-button
              px-5
              py-3
              text-xs
              font-semibold
              text-theme-button
            "
          >

            <ArrowLeft size={14} />

            Go home

          </Link>

        </div>

      </main>

    )

  }


  const creatorName =
    story.creator?.name ||
    "Someone"


  const partnerName =
    story.partner?.name ||
    "you"


  return (

    <main
      className="
        min-h-screen
        px-5
        pb-24
        pt-28
        sm:px-8
        lg:pt-32
      "
    >

      {/* ========================================================
          NAVBAR
      ======================================================== */}

      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-50
          border-b
          create-border
          bg-theme/80
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
                create-border
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


          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <span
              className="
                hidden
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-theme-muted
                sm:block
              "
            >
              A little piece of their heart
            </span>


            <ThemeToggle
              theme={theme}
              setTheme={setTheme}
            />

          </div>

        </div>

      </header>


      {/* ========================================================
          MAIN CONTENT
      ======================================================== */}

      <section
        className="
          mx-auto
          max-w-6xl
        "
      >

        <div
          className="
            grid
            gap-14
            lg:grid-cols-[0.8fr_1.2fr]
            lg:gap-24
          "
        >

          {/* ==================================================
              LEFT
          ================================================== */}

          <div
            className="
              lg:sticky
              lg:top-32
              lg:self-start
            "
          >

            {/* Decorative icon */}

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                border
                border-theme
                bg-surface-soft
              "
            >

              <Sparkles
                size={17}
                className="
                  text-theme-secondary
                "
              />

            </div>


            <p
              className="
                mt-8
                text-[10px]
                uppercase
                tracking-[0.32em]
                text-theme-muted
              "
            >
              A little something from {creatorName}
            </p>


            <h1
              className="
                mt-5
                text-[clamp(3rem,6vw,5.8rem)]
                font-medium
                leading-[0.93]
                tracking-[-0.06em]
                text-theme-primary
              "
            >

              Things I

              <span
                className="
                  mt-2
                  block
                  font-serif
                  italic
                  font-normal
                "
              >
                want you
              </span>

              to know.

            </h1>


            <p
              className="
                mt-8
                max-w-md
                text-sm
                leading-7
                text-theme-muted
                sm:text-base
              "
            >

              {creatorName} left some answers
              here for you, {partnerName}.

              <br />

              No chatbot.
              No guessing.

              Just their own words,
              written especially for you.

            </p>


            {/* Small signature */}

            <div
              className="
                mt-10
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
                "
              >

                <Heart
                  size={13}
                  className="
                    text-theme-secondary
                  "
                  fill="currentColor"
                />

              </span>


              <div>

                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.25em]
                    text-theme-muted
                  "
                >
                  Written by {creatorName}
                </p>


                <p
                  className="
                    mt-1
                    text-xs
                    text-theme-secondary
                  "
                >
                  {questions.length} little answers
                </p>

              </div>

            </div>

          </div>


          {/* ==================================================
              RIGHT
          ================================================== */}

          <div>

            {questions.length === 0 ? (

              <EmptyState />

            ) : (

              <div
                className="
                  space-y-4
                "
              >

                {questions.map(
                  (item, index) => {

                    const isOpen =
                      activeQuestion ===
                      item.id


                    return (

                      <QuestionCard
                        key={item.id}
                        item={item}
                        index={index}
                        isOpen={isOpen}
                        onClick={() =>
                          toggleQuestion(
                            item.id
                          )
                        }
                      />

                    )

                  }
                )}

              </div>

            )}


            {/* Bottom */}

            {questions.length > 0 && (

              <div
                className="
                  mt-10
                  flex
                  items-center
                  justify-center
                  gap-4
                "
              >

                <span
                  className="
                    h-px
                    w-12
                    bg-theme-soft
                  "
                />


                <Heart
                  size={11}
                  className="
                    text-theme-faint
                  "
                  fill="currentColor"
                />


                <span
                  className="
                    h-px
                    w-12
                    bg-theme-soft
                  "
                />

              </div>

            )}

          </div>

        </div>

      </section>

    </main>

  )

}


/* ============================================================
   QUESTION CARD
============================================================ */

function QuestionCard({
  item,
  index,
  isOpen,
  onClick,
}) {

  return (

    <motion.article
      initial={{
        opacity: 0,
        y: 12,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        duration: 0.3,
        delay:
          Math.min(
            index * 0.04,
            0.3
          ),
      }}

      className="
        overflow-hidden
        rounded-[28px]
        border
        border-theme
        bg-surface-soft
      "
    >

      {/* ======================================================
          QUESTION
      ====================================================== */}

      <button
        type="button"
        onClick={onClick}
        aria-expanded={isOpen}
        className="
          group
          flex
          w-full
          items-center
          gap-4
          px-5
          py-5
          text-left
          transition-colors
          hover:bg-surface-hover
          sm:px-6
          sm:py-6
        "
      >

        {/* Number */}

        <span
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-theme-soft
            bg-surface-hover
            text-[10px]
            tracking-[0.08em]
            text-theme-muted
          "
        >

          {String(
            index + 1
          ).padStart(
            2,
            "0"
          )}

        </span>


        {/* Text */}

        <span
          className="
            min-w-0
            flex-1
          "
        >

          <span
            className="
              block
              text-[10px]
              uppercase
              tracking-[0.22em]
              text-theme-faint
            "
          >
            {item.category}
          </span>


          <span
            className="
              mt-2
              block
              text-sm
              font-medium
              leading-6
              text-theme-primary
              sm:text-[15px]
            "
          >
            {item.question}
          </span>

        </span>


        {/* Open icon */}

        <span
          className={`
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-theme-soft
            transition-all
            duration-300

            ${
              isOpen
                ? "rotate-45 bg-surface-hover"
                : "group-hover:bg-surface-hover"
            }
          `}
        >

          <Plus
            size={14}
            className="
              text-theme-secondary
            "
          />

        </span>

      </button>


      {/* ======================================================
          ANSWER

          IMPORTANT:

          We deliberately do NOT use layout animation.

          The answer expands inside its own card,
          so the browser doesn't scroll the entire page.
      ====================================================== */}

      <div
        className={`
          grid
          transition-[grid-template-rows]
          duration-300
          ease-out

          ${
            isOpen
              ? "grid-rows-[1fr]"
              : "grid-rows-[0fr]"
          }
        `}
      >

        <div
          className="
            min-h-0
            overflow-hidden
          "
        >

          <div
            className="
              border-t
              border-theme-soft
              px-5
              pb-6
              pt-5
              sm:px-6
              sm:pb-7
            "
          >

            <div
              className="
                relative
                rounded-2xl
                border
                border-theme-soft
                bg-surface-hover
                px-5
                py-6
                sm:px-6
                sm:py-7
              "
            >

              {/* Decorative quote */}

              <span
                className="
                  absolute
                  right-5
                  top-2
                  font-serif
                  text-5xl
                  leading-none
                  text-theme-faint
                "
              >
                "
              </span>


              <div
                className="
                  flex
                  items-start
                  gap-4
                "
              >

                <Heart
                  size={14}
                  className="
                    mt-1
                    shrink-0
                    text-theme-secondary
                  "
                  fill="currentColor"
                />


                <p
                  className="
                    whitespace-pre-line
                    pr-6
                    font-serif
                    text-base
                    leading-8
                    text-theme-secondary
                    sm:text-[17px]
                  "
                >
                  {item.answer}
                </p>

              </div>


              {/* Small signature */}

              <div
                className="
                  mt-6
                  flex
                  items-center
                  gap-2
                  pl-8
                "
              >

                <span
                  className="
                    h-px
                    w-8
                    bg-theme-soft
                  "
                />


                <span
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.22em]
                    text-theme-faint
                  "
                >
                  From my heart
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </motion.article>

  )

}


/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState() {

  return (

    <div
      className="
        rounded-[28px]
        border
        border-theme
        bg-surface-soft
        px-6
        py-16
        text-center
      "
    >

      <div
        className="
          mx-auto
          flex
          h-12
          w-12
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
          "
        />

      </div>


      <h2
        className="
          mt-6
          text-lg
          font-medium
          text-theme-primary
        "
      >
        A little more is coming.
      </h2>


      <p
        className="
          mx-auto
          mt-2
          max-w-sm
          text-xs
          leading-6
          text-theme-muted
        "
      >
        There aren't any answers here yet.
        Your little story is still being written.
      </p>

    </div>

  )

}


export default FromTheirHeart