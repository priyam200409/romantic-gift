import {
  useEffect,
  useRef,
  useState,
} from "react"

import {
  ArrowDown,
  ArrowRight,
  CalendarHeart,
  Camera,
  ChevronDown,
  Heart,
  LockKeyhole,
  Mail,
  MapPin,
  Pause,
  Play,
  Sparkles,
  Stars,
} from "lucide-react"

import {
  Link,
  useNavigate,
} from "react-router-dom"


/* ============================================================
   PRIVATE GIFT DATA
============================================================ */

const GIFT_DATA = {

  creatorName: "Priyam",

  partnerName: "Sneha",

  nickname: "Amor",

  relationship: "Partner",

  importantDate: "2021-12-05",


  story: {

    howWeMet:
      "We met in school in class 12 th A1",

    whereWeMet:
      "first time we met outside the school canteen",

    firstImpression:
      "She Was so pretty ",

    turningPoint:
      "When we start Dating each other",

  },


  feelings: {

    whatILove:
      "Your Figure",

    whatMakesThemSpecial:
      "Love & Loyalty",

    thingsThatMakeMeSmile:
      "Thinking About Her",

    whatIAdmire:
      "Her Eyes",

    unforgettableThing:
      "When I see you first time in mask",

  },


  personalMessage: `Sneha, my love,

I was just sitting here thinking about how much better my life has been ever since you came into it. You have this easy way of making everything feel calm, simple, and light. When things get chaotic around me, you're the one place where I always feel completely at peace.

I really want you to know how much you mean to me. You’re not just someone in my life; you're in everything I do, my comfort on the bad days, and the very first person I want to talk to when something good happens. Your laugh and your kind heart always remind me how lucky I am to have you. Loving you is so natural, and I never take a single day with you for granted.

Without you, my life feels incomplete,

With you around, every moment is sweet.

Thank you for being my favorite person and my whole world.

I LOVE YOU ❤️`,


  venue: {

    enabled: true,

    name: "AIPL JOY CITY",

    address: "",

    date: "2026-08-19",

    message:
      "I want to spend some beautiful time with you here and create another special memory ❤️",

  },


  finalSurprise: {

    title:
      "One last thing..., Sneha",

    message:
      "I love you more than words can explain. ❤️",

  },

}


/* ============================================================
   QUESTIONS

   ADD AS MANY QUESTIONS AS YOU WANT HERE
============================================================ */

const QUESTIONS = [

  {
    question:
      "Do you know what I love the most about you?",

    answer:
      "I Love your nature And your Eyes toooooooooo.",
  },

  {
    question:
      "What was my first impression of you?",

    answer:
      "You are looking so cute and pretty. You look so adorable, babe.",
  },

  {
    question:
      "What do I want you to always remember?",

    answer:
      "No matter what happens, I want you to remember that you are deeply special to me and that our memories will always have a place in my heart.",
  },

  {
    question:
      "I want to tell you something?",

    answer:
      "You are so gorgeous and pretty.",
  },

  {
    question:
      "What do I want to do with you?",

    answer:
      "I want to spend time with you and want to hug you.",
  },

]


/* ============================================================
   PHOTOS

   ORIGINAL PATHS — NOT CHANGED
============================================================ */

const PHOTOS = [

  {
    id: 1,
    name: "Memory 1",
    url: "/WhatsApp Image 2026-08-18 at 11.50.45 PM (1).jpeg",
  },

  {
    id: 2,
    name: "Memory 2",
    url: "/WhatsApp Image 2026-08-18 at 11.50.45 PM.jpeg",
  },

  {
    id: 3,
    name: "Memory 3",
    url: "/WhatsApp Image 2026-08-18 at 11.50.46 PM (1).jpeg",
  },

  {
    id: 4,
    name: "Memory 4",
    url: "/WhatsApp Image 2026-08-18 at 11.50.46 PM.jpeg",
  },

]


/* ============================================================
   MUSIC
============================================================ */

const BACKGROUND_MUSIC =
  "/I_Think_They_Call_This_Love_Cover.mp3"

const MUSIC_NAME =
  "FOR YOU"


/* ============================================================
   UNIVERSE
============================================================ */

function Universe() {

  const navigate =
    useNavigate()


  const [
    showWelcome,
    setShowWelcome,
  ] =
    useState(true)


  const [
    openQuestion,
    setOpenQuestion,
  ] =
    useState(null)


  const [
    musicPlaying,
    setMusicPlaying,
  ] =
    useState(false)


  const [
    ready,
    setReady,
  ] =
    useState(false)


  const audioRef =
    useRef(null)


  /* ==========================================================
     ACCESS CHECK
  ========================================================== */

  useEffect(() => {

    const access =
      sessionStorage.getItem(
        "our-story-access"
      )


    if (
      access !== "verified"
    ) {

      navigate(
        "/special",
        {
          replace: true,
        }
      )

    }

  }, [
    navigate,
  ])


  /* ==========================================================
     LOADING
  ========================================================== */

  useEffect(() => {

    const timer =
      setTimeout(
        () => {
          setReady(true)
        },
        150
      )


    return () => {

      clearTimeout(timer)

    }

  }, [])


  /* ==========================================================
     MUSIC SETUP
  ========================================================== */

  useEffect(() => {

    const audio =
      audioRef.current


    if (!audio) {
      return
    }


    audio.volume = 0.9


    return () => {

      audio.pause()

      audio.currentTime = 0

    }

  }, [])


  /* ==========================================================
     MUSIC BUTTON
  ========================================================== */

  const toggleMusic =
    async () => {

      const audio =
        audioRef.current


      if (!audio) {
        return
      }


      try {

        if (
          audio.paused
        ) {

          await audio.play()

          setMusicPlaying(true)

        } else {

          audio.pause()

          setMusicPlaying(false)

        }

      } catch (error) {

        console.error(
          "Unable to play music:",
          error
        )

        setMusicPlaying(false)

      }

    }


  /* ==========================================================
     ENTER UNIVERSE
  ========================================================== */

  const startUniverse =
    async () => {

      setShowWelcome(false)


      const audio =
        audioRef.current


      if (!audio) {
        return
      }


      try {

        await audio.play()

        setMusicPlaying(true)

      } catch (error) {

        console.error(
          "Unable to start music:",
          error
        )

      }

    }


  /* ==========================================================
     SAFE DATA
  ========================================================== */

  const creatorName =
    GIFT_DATA.creatorName ||
    "Someone special"


  const partnerName =
    GIFT_DATA.partnerName ||
    "Someone special"


  const nickname =
    GIFT_DATA.nickname ||
    partnerName


  const story =
    GIFT_DATA.story ||
    {}


  const feelings =
    GIFT_DATA.feelings ||
    {}


  const venue =
    GIFT_DATA.venue &&
    GIFT_DATA.venue.enabled !== false &&
    GIFT_DATA.venue.name
      ? GIFT_DATA.venue
      : null


  const finalSurprise =
    GIFT_DATA.finalSurprise ||
    {}


  const hasFinalSurprise =
    Boolean(
      finalSurprise.title ||
      finalSurprise.message
    )


  const hasFeelings =
    Boolean(
      feelings.whatILove ||
      feelings.whatMakesThemSpecial ||
      feelings.thingsThatMakeMeSmile ||
      feelings.whatIAdmire ||
      feelings.unforgettableThing
    )


  /* ==========================================================
     LOADING SCREEN
  ========================================================== */

  if (!ready) {

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
            text-center
          "
        >

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

            <Heart
              size={22}
              className="
                animate-pulse
                text-theme-secondary
              "
              fill="currentColor"
            />

          </div>


          <p
            className="
              mt-6
              text-[10px]
              uppercase
              tracking-[0.28em]
              text-theme-muted
            "
          >
            Opening your universe...
          </p>

        </div>

      </main>

    )

  }


  /* ==========================================================
     MAIN UI
  ========================================================== */

  return (

    <main
      className="
        min-h-screen
        overflow-hidden
      "
    >

      {/* ====================================================
          AUDIO
      ==================================================== */}

      <audio
        ref={audioRef}
        src={BACKGROUND_MUSIC}
        loop
        preload="auto"
        onPlay={() =>
          setMusicPlaying(true)
        }
        onPause={() =>
          setMusicPlaying(false)
        }
      />


      {/* ====================================================
          MUSIC BUTTON
      ==================================================== */}

      <button
        type="button"
        onClick={toggleMusic}
        aria-label={
          musicPlaying
            ? "Pause background music"
            : "Play background music"
        }
        className="
          fixed
          bottom-5
          right-5
          z-[60]
          flex
          items-center
          gap-3
          rounded-full
          border
          border-theme
          bg-surface-elevated/90
          px-4
          py-3
          text-xs
          text-theme-secondary
          shadow-[0_15px_50px_var(--shadow-card)]
          backdrop-blur-xl
          transition
          hover:bg-surface-hover
        "
      >

        {musicPlaying ? (

          <Pause size={14} />

        ) : (

          <Play size={14} />

        )}


        <span
          className="
            hidden
            max-w-[180px]
            truncate
            sm:block
          "
        >
          {MUSIC_NAME}
        </span>

      </button>


      {/* ====================================================
          HEADER
      ==================================================== */}

      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-50
          border-b
          border-theme-soft
          bg-surface-soft
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
                size={14}
                className="
                  text-theme-secondary
                "
                fill="currentColor"
              />

            </span>


            <span
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.26em]
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
              gap-2
            "
          >

            <LockKeyhole
              size={11}
              className="
                text-theme-muted
              "
            />

            <span
              className="
                hidden
                text-[9px]
                uppercase
                tracking-[0.2em]
                text-theme-faint
                sm:block
              "
            >
              Private experience
            </span>

          </div>

        </div>

      </header>


      {/* ====================================================
          HERO
      ==================================================== */}

      <section
        className="
          mx-auto
          max-w-7xl
          px-5
          pb-24
          pt-36
          sm:px-8
          sm:pt-44
        "
      >

        <div
          className="
            mx-auto
            max-w-4xl
            text-center
          "
        >

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

            <Stars
              size={20}
              className="
                text-theme-secondary
              "
            />

          </div>


          <p
            className="
              mt-8
              text-[9px]
              uppercase
              tracking-[0.35em]
              text-theme-muted
            "
          >
            A little universe made for you
          </p>


          <h1
            className="
              mt-5
              text-[clamp(3rem,8vw,6rem)]
              font-medium
              leading-[0.9]
              tracking-[-0.06em]
              text-theme-primary
            "
          >

            

            Happy Birthday,

            <br />

            <span
              className="
                serif
                italic
                text-theme-secondary
              "
            >
              Sneha!
            </span>

            .

          </h1>


          <p
            className="
              mx-auto
              mt-7
              max-w-2xl
              text-sm
              leading-7
              text-theme-muted
              sm:text-base
            "
          >

            {creatorName} created this private
            space for you — filled with memories,
            words and pieces of your story.

          </p>


          <a
            href="#our-story"
            className="
              mt-10
              inline-flex
              items-center
              gap-3
              rounded-full
              border
              border-theme
              bg-surface-soft
              px-6
              py-3
              text-xs
              font-semibold
              text-theme-secondary
            "
          >

            Explore our story

            <ArrowDown size={14} />

          </a>

        </div>

      </section>


      {/* ====================================================
          STORY
      ==================================================== */}

      <section
        id="our-story"
        className="
          scroll-mt-20
          border-t
          border-theme-soft
        "
      >

        <div
          className="
            mx-auto
            max-w-7xl
            px-5
            py-24
            sm:px-8
            sm:py-32
          "
        >

          <SectionLabel
            text="Our story"
          />


          <div
            className="
              mt-10
              grid
              gap-12
              lg:grid-cols-2
              lg:gap-20
            "
          >

            <div>

              <h2
                className="
                  text-[clamp(2.5rem,5vw,5rem)]
                  font-medium
                  leading-[0.94]
                  tracking-[-0.06em]
                  text-theme-primary
                "
              >

                It all started

                <br />

                <span
                  className="
                    serif
                    italic
                    text-theme-secondary
                  "
                >
                  somewhere.
                </span>

              </h2>


              {GIFT_DATA.importantDate && (

                <div
                  className="
                    mt-8
                    flex
                    items-center
                    gap-3
                  "
                >

                  <CalendarHeart
                    size={15}
                    className="
                      text-theme-muted
                    "
                  />

                  <span
                    className="
                      text-xs
                      text-theme-muted
                    "
                  >
                    {formatDate(
                      GIFT_DATA.importantDate
                    )}
                  </span>

                </div>

              )}

            </div>


            <div
              className="
                space-y-4
              "
            >

              <StoryCard
                title="How we met"
                text={story.howWeMet}
              />


              {story.whereWeMet && (

                <StoryCard
                  title="Where we met"
                  text={story.whereWeMet}
                />

              )}


              {story.firstImpression && (

                <StoryCard
                  title="First impression"
                  text={story.firstImpression}
                />

              )}


              {story.turningPoint && (

                <StoryCard
                  title="The turning point"
                  text={story.turningPoint}
                />

              )}

            </div>

          </div>

        </div>

      </section>


      {/* ====================================================
          MEMORIES
      ==================================================== */}

      <section
        id="memories"
        className="
          scroll-mt-20
          border-t
          border-theme-soft
        "
      >

        <div
          className="
            mx-auto
            max-w-7xl
            px-5
            py-24
            sm:px-8
            sm:py-32
          "
        >

          <SectionLabel
            text="Your memories"
          />


          <h2
            className="
              mt-8
              text-[clamp(2.5rem,5vw,5rem)]
              font-medium
              leading-[0.94]
              tracking-[-0.06em]
              text-theme-primary
            "
          >

            Little moments.

            <br />

            <span
              className="
                serif
                italic
                text-theme-secondary
              "
            >
              Forever yours.
            </span>

          </h2>


          <div
            className="
              mt-12
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              md:grid-cols-3
            "
          >

            {PHOTOS.map(
              (photo) => (

                <div
                  key={photo.id}
                  className="
                    group
                    overflow-hidden
                    rounded-3xl
                    border
                    border-theme-soft
                    bg-surface-soft
                  "
                >

                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="
                      block
                      h-auto
                      w-full
                      transition-transform
                      duration-500
                      group-hover:scale-[1.02]
                    "
                  />

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* ====================================================
          FEELINGS
      ==================================================== */}

      {hasFeelings && (

        <section
          id="what-i-love"
          className="
            scroll-mt-20
            border-t
            border-theme-soft
          "
        >

          <div
            className="
              mx-auto
              max-w-7xl
              px-5
              py-24
              sm:px-8
              sm:py-32
            "
          >

            <SectionLabel
              text="What I see in you"
            />


            <div
              className="
                mt-12
                grid
                gap-4
                md:grid-cols-2
              "
            >

              {[
                [
                  "What I love",
                  feelings.whatILove,
                ],
                [
                  "What makes you special",
                  feelings.whatMakesThemSpecial,
                ],
                [
                  "What always makes me smile",
                  feelings.thingsThatMakeMeSmile,
                ],
                [
                  "What I admire",
                  feelings.whatIAdmire,
                ],
                [
                  "Something I'll never forget",
                  feelings.unforgettableThing,
                ],
              ]
                .filter(
                  ([, text]) =>
                    text
                )
                .map(
                  ([label, text]) => (

                    <StoryCard
                      key={label}
                      title={label}
                      text={text}
                    />

                  )
                )}

            </div>

          </div>

        </section>

      )}


      {/* ====================================================
          QUESTIONS
      ==================================================== */}

      <section
        id="questions"
        className="
          scroll-mt-20
          border-t
          border-theme-soft
        "
      >

        <div
          className="
            mx-auto
            max-w-7xl
            px-5
            py-24
            sm:px-8
            sm:py-32
          "
        >

          <SectionLabel
            text="From my heart"
          />


          <div
            className="
              mt-10
              grid
              gap-12
              lg:grid-cols-2
              lg:gap-20
            "
          >

            <div>

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

                <Heart
                  size={18}
                  className="
                    text-theme-secondary
                  "
                  fill="currentColor"
                />

              </div>


              <h2
                className="
                  mt-7
                  text-[clamp(2.5rem,5vw,4.5rem)]
                  font-medium
                  leading-[0.94]
                  tracking-[-0.06em]
                  text-theme-primary
                "
              >

                Things I want

                <br />

                <span
                  className="
                    serif
                    italic
                    text-theme-secondary
                  "
                >
                  you to know.
                </span>

              </h2>


              <p
                className="
                  mt-6
                  max-w-md
                  text-sm
                  leading-7
                  text-theme-muted
                "
              >

                I wrote these for you.
                Take your time with each one.

              </p>

            </div>


            <div
              className="
                space-y-3
              "
            >

              {QUESTIONS.map(
                (item, index) => {

                  const id =
                    index


                  const open =
                    openQuestion === id


                  return (

                    <div
                      key={id}
                      className="
                        overflow-hidden
                        rounded-3xl
                        border
                        border-theme-soft
                        bg-surface-soft
                      "
                    >

                      <button
                        type="button"
                        onClick={() =>
                          setOpenQuestion(
                            open
                              ? null
                              : id
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          justify-between
                          gap-4
                          px-5
                          py-5
                          text-left
                          transition
                          hover:bg-surface-hover
                        "
                      >

                        <span
                          className="
                            flex
                            items-start
                            gap-4
                          "
                        >

                          <span
                            className="
                              pt-1
                              text-[9px]
                              text-theme-faint
                            "
                          >
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>


                          <span
                            className="
                              text-sm
                              font-medium
                              leading-6
                              text-theme-primary
                            "
                          >
                            {item.question}
                          </span>

                        </span>


                        <ChevronDown
                          size={16}
                          className={
                            `
                              shrink-0
                              transition-transform
                              duration-300
                              ${
                                open
                                  ? "rotate-180 text-theme-secondary"
                                  : "text-theme-muted"
                              }
                            `
                          }
                        />

                      </button>


                      {open && (

                        <div
                          className="
                            border-t
                            border-theme-soft
                            px-5
                            pb-6
                            pt-5
                          "
                        >

                          <div
                            className="
                              rounded-2xl
                              border
                              border-theme-soft
                              bg-surface-hover
                              p-5
                            "
                          >

                            <p
                              className="
                                whitespace-pre-line
                                text-sm
                                leading-7
                                text-theme-secondary
                              "
                            >
                              {item.answer}
                            </p>

                          </div>

                        </div>

                      )}

                    </div>

                  )

                }
              )}

            </div>

          </div>

        </div>

      </section>


      {/* ====================================================
          LETTER
      ==================================================== */}

      <section
        id="letter"
        className="
          scroll-mt-20
          border-t
          border-theme-soft
        "
      >

        <div
          className="
            mx-auto
            max-w-4xl
            px-5
            py-24
            sm:px-8
            sm:py-32
          "
        >

          <SectionLabel
            text="A letter"
          />


          <div
            className="
              mt-10
              rounded-[30px]
              border
              border-theme
              bg-surface-elevated
              p-7
              sm:p-12
            "
          >

            <Mail
              size={19}
              className="
                text-theme-secondary
              "
            />


            <p
              className="
                mt-10
                serif
                text-2xl
                italic
                text-theme-secondary
              "
            >
              Dear {partnerName},
            </p>


            <p
              className="
                mt-8
                whitespace-pre-line
                text-sm
                leading-8
                text-theme-muted
                sm:text-base
              "
            >
              {GIFT_DATA.personalMessage}
            </p>


            <div
              className="
                mt-10
                h-px
                w-12
                bg-theme-muted
              "
            />


            <p
              className="
                mt-5
                text-sm
                text-theme-secondary
              "
            >

              With love,

              <br />

              <span
                className="
                  font-medium
                "
              >
                {creatorName}
              </span>

            </p>

          </div>

        </div>

      </section>


      {/* ====================================================
          VENUE
      ==================================================== */}

      {venue && (

        <section
          id="venue"
          className="
            scroll-mt-20
            border-t
            border-theme-soft
          "
        >

          <div
            className="
              mx-auto
              max-w-4xl
              px-5
              py-24
              sm:px-8
              sm:py-32
            "
          >

            <SectionLabel
              text="A place for us"
            />


            <div
              className="
                mt-10
                rounded-[30px]
                border
                border-theme
                bg-surface-elevated
                p-7
                sm:p-10
              "
            >

              <MapPin
                size={19}
                className="
                  text-theme-secondary
                "
              />


              <p
                className="
                  mt-7
                  text-[9px]
                  uppercase
                  tracking-[0.3em]
                  text-theme-muted
                "
              >
                Maybe somewhere special
              </p>


              <h2
                className="
                  mt-4
                  text-[clamp(2.5rem,5vw,4.5rem)]
                  font-medium
                  leading-[0.94]
                  tracking-[-0.06em]
                  text-theme-primary
                "
              >

                Our next

                <br />

                <span
                  className="
                    serif
                    italic
                    text-theme-secondary
                  "
                >
                  place.
                </span>

              </h2>


              <div
                className="
                  mt-8
                  rounded-3xl
                  border
                  border-theme-soft
                  bg-surface-soft
                  p-6
                "
              >

                <h3
                  className="
                    text-lg
                    font-semibold
                    text-theme-primary
                  "
                >
                  {venue.name}
                </h3>


                {venue.address && (

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-6
                      text-theme-muted
                    "
                  >
                    {venue.address}
                  </p>

                )}


                {venue.date && (

                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <CalendarHeart
                      size={15}
                      className="
                        text-theme-muted
                      "
                    />

                    <span
                      className="
                        text-xs
                        text-theme-muted
                      "
                    >
                      {formatDate(
                        venue.date
                      )}
                    </span>

                  </div>

                )}


                {venue.message && (

                  <p
                    className="
                      mt-5
                      whitespace-pre-line
                      text-sm
                      leading-7
                      text-theme-secondary
                    "
                  >
                    {venue.message}
                  </p>

                )}

              </div>

            </div>

          </div>

        </section>

      )}


      {/* ====================================================
          FINAL SURPRISE
      ==================================================== */}

      {hasFinalSurprise && (

        <section
          id="final-surprise"
          className="
            scroll-mt-20
            border-t
            border-theme-soft
          "
        >

          <div
            className="
              mx-auto
              max-w-7xl
              px-5
              py-24
              sm:px-8
              sm:py-32
            "
          >

            <div
              className="
                relative
                overflow-hidden
                rounded-[32px]
                border
                border-theme
                bg-surface-elevated
                px-6
                py-24
                text-center
                shadow-[0_30px_80px_var(--shadow-card)]
                sm:px-10
                lg:py-32
              "
            >

              <div
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-1/2
                  h-72
                  w-72
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-[var(--glow-rose)]
                  opacity-30
                  blur-[100px]
                "
              />


              <div
                className="
                  relative
                "
              >

                <Sparkles
                  size={20}
                  className="
                    mx-auto
                    text-theme-secondary
                  "
                />


                <p
                  className="
                    mt-7
                    text-[9px]
                    uppercase
                    tracking-[0.35em]
                    text-theme-muted
                  "
                >
                  A final surprise
                </p>


                {finalSurprise.title && (

                  <h2
                    className="
                      mx-auto
                      mt-5
                      max-w-3xl
                      text-[clamp(2.8rem,6vw,5.5rem)]
                      font-medium
                      leading-[0.92]
                      tracking-[-0.06em]
                      text-theme-primary
                    "
                  >
                    {finalSurprise.title}
                  </h2>

                )}


                {finalSurprise.message && (

                  <p
                    className="
                      mx-auto
                      mt-8
                      max-w-2xl
                      whitespace-pre-line
                      text-sm
                      leading-8
                      text-theme-secondary
                      sm:text-base
                    "
                  >
                    {finalSurprise.message}
                  </p>

                )}


                <div
                  className="
                    mx-auto
                    mt-10
                    h-px
                    w-12
                    bg-theme-muted
                  "
                />


                <p
                  className="
                    mt-5
                    text-xs
                    uppercase
                    tracking-[0.25em]
                    text-theme-faint
                  "
                >
                  Made especially for you
                </p>

              </div>

            </div>

          </div>

        </section>

      )}


      {/* ====================================================
          FOOTER
      ==================================================== */}

      <footer
        className="
          border-t
          border-theme-soft
        "
      >

        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            px-5
            py-8
            sm:px-8
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <Heart
              size={12}
              className="
                text-theme-secondary
              "
              fill="currentColor"
            />


            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.25em]
                text-theme-faint
              "
            >
              Our Story
            </span>

          </div>


          <span
            className="
              text-[10px]
              text-theme-faint
            "
          >
            Made from your story.
          </span>

        </div>

      </footer>


      {/* ====================================================
          WELCOME MODAL
      ==================================================== */}

      {showWelcome && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/50
            px-5
            backdrop-blur-sm
          "
        >

          <div
            className="
              w-full
              max-w-md
              rounded-[30px]
              border
              border-theme
              bg-surface-elevated
              p-8
              text-center
              shadow-2xl
              sm:p-10
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


            <p
              className="
                mt-7
                text-[9px]
                uppercase
                tracking-[0.32em]
                text-theme-muted
              "
            >
              A private little universe
            </p>


            <h2
              className="
                mt-4
                text-3xl
                font-medium
                text-theme-primary
              "
            >
              Welcome, {partnerName}.
            </h2>


            <p
              className="
                mx-auto
                mt-4
                max-w-sm
                text-sm
                leading-6
                text-theme-muted
              "
            >

              {creatorName} made this place
              especially for you.

            </p>


            <p
              className="
                mt-5
                flex
                items-center
                justify-center
                gap-2
                text-[10px]
                uppercase
                tracking-[0.2em]
                text-theme-faint
              "
            >

              <Play size={11} />

              {MUSIC_NAME}

            </p>


            <button
              type="button"
              onClick={startUniverse}
              className="
                mt-8
                inline-flex
                items-center
                gap-3
                rounded-full
                bg-theme-button
                px-6
                py-3
                text-sm
                font-semibold
                text-theme-button
                transition
                hover:-translate-y-0.5
              "
            >

              Enter my universe

              <ArrowRight size={15} />

            </button>

          </div>

        </div>

      )}

    </main>

  )

}


/* ============================================================
   SECTION LABEL
============================================================ */

function SectionLabel({
  text,
}) {

  return (

    <div
      className="
        flex
        items-center
        gap-3
      "
    >

      <span
        className="
          h-px
          w-8
          bg-theme-muted
        "
      />


      <span
        className="
          text-[9px]
          uppercase
          tracking-[0.3em]
          text-theme-muted
        "
      >
        {text}
      </span>

    </div>

  )

}


/* ============================================================
   STORY CARD
============================================================ */

function StoryCard({
  title,
  text,
}) {

  return (

    <article
      className="
        rounded-3xl
        border
        border-theme-soft
        bg-surface-soft
        p-6
      "
    >

      <p
        className="
          text-[9px]
          uppercase
          tracking-[0.25em]
          text-theme-faint
        "
      >
        {title}
      </p>


      <p
        className="
          mt-4
          whitespace-pre-line
          text-sm
          leading-7
          text-theme-secondary
        "
      >
        {text}
      </p>

    </article>

  )

}


/* ============================================================
   DATE FORMATTER
============================================================ */

function formatDate(
  value
) {

  if (!value) {
    return ""
  }


  const date =
    new Date(value)


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return String(value)

  }


  return new Intl.DateTimeFormat(
    "en-US",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(date)

}


export default Universe