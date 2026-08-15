import {
  useEffect,
  useMemo,
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
  useLocation,
  useNavigate,
} from "react-router-dom"

import { supabase } from "../lib/supabase"


function Universe({
  theme,
  setTheme,
}) {

  const navigate = useNavigate()
  const location = useLocation()


  /* ==========================================================
     STATE
  ========================================================== */

  const [gift, setGift] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  const [showWelcome, setShowWelcome] =
    useState(true)

  const [openQuestion, setOpenQuestion] =
    useState(null)

  const [photoUrls, setPhotoUrls] =
    useState([])

  const [musicUrl, setMusicUrl] =
    useState("")

  const [musicPlaying, setMusicPlaying] =
    useState(false)

  const audioRef =
    useRef(null)


  /* ==========================================================
     GIFT ID
  ========================================================== */

  const giftId =
    location.state?.giftId ||
    localStorage.getItem(
      "our-story-gift-id"
    )


  /* ==========================================================
     LOAD GIFT
  ========================================================== */

  useEffect(() => {

    let cancelled = false


    async function loadGift() {

      setLoading(true)
      setError("")


      /*
       * No ID means this route was opened directly.
       */

      if (!giftId) {

        if (!cancelled) {

          setLoading(false)

          setError(
            "No experience was selected."
          )

        }

        return

      }


      try {

        /*
         * ====================================================
         * CREATOR AUTH
         *
         * This is still required for the current MVP because
         * the current gifts RLS policy is creator-owned.
         *
         * Recipient authentication will be connected through
         * the unlock flow in the next stage.
         * ====================================================
         */

        const {
          data: authData,
          error: authError,
        } =
          await supabase.auth.getUser()


        if (authError) {
          throw authError
        }


        const user =
          authData?.user


        if (!user) {

          if (!cancelled) {

            navigate(
              "/creator-login",
              {
                replace: true,
              }
            )

          }

          return

        }


        /*
         * ====================================================
         * GET GIFT
         * ====================================================
         */

        const {
          data: giftData,
          error: giftError,
        } =
          await supabase
            .from("gifts")
            .select(
              `
                id,
                gift_code,
                creator_id,
                creator_name,
                partner_name,
                partner_nickname,
                relationship,
                story_data,
                published,
                created_at
              `
            )
            .eq(
              "id",
              giftId
            )
            .eq(
              "creator_id",
              user.id
            )
            .single()


        if (giftError) {
          throw giftError
        }


        if (!giftData) {

          throw new Error(
            "The experience could not be found."
          )

        }


        if (cancelled) {
          return
        }


        setGift(giftData)


        /*
         * Keep it available on refresh.
         */

        localStorage.setItem(
          "our-story-gift-id",
          giftData.id
        )

        localStorage.setItem(
          "our-story-gift-code",
          giftData.gift_code
        )


        /*
         * ====================================================
         * PRIVATE PHOTOS
         *
         * Database contains only Storage paths.
         *
         * We create temporary signed URLs.
         * ====================================================
         */

        const storedPhotos =
          Array.isArray(
            giftData.story_data?.photos
          )
            ? giftData.story_data.photos
            : []


        if (
          storedPhotos.length === 0
        ) {

          setPhotoUrls([])

        } else {

          const paths =
            storedPhotos
              .map(
                (photo) =>
                  photo?.path
              )
              .filter(Boolean)


          if (
            paths.length > 0
          ) {

            const {
              data: signedUrls,
              error:
                signedUrlError,
            } =
              await supabase.storage
                .from(
                  "our-story-photos"
                )
                .createSignedUrls(
                  paths,
                  60 * 60
                )


            /*
             * Photo failure must never destroy
             * the complete Universe.
             */

            if (
              signedUrlError
            ) {

              console.error(
                "PHOTO ERROR:",
                signedUrlError
              )

              if (!cancelled) {
                setPhotoUrls([])
              }

            } else {

              const mapped =
                (signedUrls || [])
                  .map(
                    (
                      item,
                      index
                    ) => {

                      if (
                        !item?.signedUrl
                      ) {

                        return null

                      }


                      return {

                        id:
                          storedPhotos[
                            index
                          ]?.id ||
                          index,

                        name:
                          storedPhotos[
                            index
                          ]?.name ||
                          `Memory ${index + 1}`,

                        url:
                          item.signedUrl,

                      }

                    }
                  )
                  .filter(Boolean)


              if (!cancelled) {

                setPhotoUrls(
                  mapped
                )

              }

            }

          }

        }


        /*
         * ====================================================
         * PRIVATE BACKGROUND MUSIC
         *
         * Optional.
         *
         * If CreateGift later stores:
         *
         * story_data.music.path
         *
         * or
         *
         * story_data.backgroundMusic.path
         *
         * we create a temporary signed URL.
         *
         * If music isn't configured, nothing breaks.
         * ====================================================
         */

        const musicPath =
          giftData.story_data?.music?.path ||
          giftData.story_data?.backgroundMusic?.path ||
          null


        if (musicPath) {

          const {
            data: signedMusic,
            error:
              signedMusicError,
          } =
            await supabase.storage
              .from(
                "our-story-music"
              )
              .createSignedUrl(
                musicPath,
                60 * 60
              )


          if (
            signedMusicError
          ) {

            /*
             * Music must never break the page.
             */

            console.error(
              "MUSIC ERROR:",
              signedMusicError
            )

            if (!cancelled) {

              setMusicUrl("")

            }

          } else if (
            !cancelled
          ) {

            setMusicUrl(
              signedMusic?.signedUrl ||
              ""
            )

          }

        } else if (
          !cancelled
        ) {

          setMusicUrl("")

        }

      } catch (loadError) {

        console.error(
          "UNIVERSE ERROR:",
          loadError
        )


        if (!cancelled) {

          setError(
            loadError?.message ||
            "We couldn't open your experience."
          )

        }

      } finally {

        if (!cancelled) {

          setLoading(false)

        }

      }

    }


    loadGift()


    return () => {

      cancelled = true

    }

  }, [
    giftId,
    navigate,
  ])


  /* ==========================================================
     AUDIO CLEANUP
  ========================================================== */

  useEffect(() => {

    return () => {

      if (audioRef.current) {

        audioRef.current.pause()

        audioRef.current = null

      }

    }

  }, [])


  /* ==========================================================
     MUSIC CONTROLS
  ========================================================== */

  const startUniverse =
    async () => {

      setShowWelcome(false)


      /*
       * Browser autoplay protection:
       *
       * Music starts only after the user presses
       * the Enter button.
       */

      if (
        !audioRef.current ||
        !musicUrl
      ) {

        return

      }


      try {

        await audioRef.current.play()

        setMusicPlaying(true)

      } catch (musicError) {

        console.error(
          "Unable to start background music:",
          musicError
        )

      }

    }


  const toggleMusic =
    async () => {

      if (
        !audioRef.current ||
        !musicUrl
      ) {

        return

      }


      try {

        if (
          audioRef.current.paused
        ) {

          await audioRef.current.play()

          setMusicPlaying(true)

        } else {

          audioRef.current.pause()

          setMusicPlaying(false)

        }

      } catch (musicError) {

        console.error(
          "Unable to control background music:",
          musicError
        )

      }

    }


  /* ==========================================================
     SAFE STORY
  ========================================================== */

  const story =
    gift?.story_data ||
    {}


  /* ==========================================================
     BASIC INFORMATION
  ========================================================== */

  const creatorName =
    gift?.creator_name ||
    story.creator?.name ||
    "Someone special"


  const partnerName =
    gift?.partner_name ||
    story.partner?.name ||
    "Someone special"


  const nickname =
    gift?.partner_nickname ||
    story.partner?.nickname ||
    partnerName


  const relationship =
    gift?.relationship ||
    story.relationship ||
    "two people"


  /* ==========================================================
     OPTIONAL VENUE
  ========================================================== */

  /*
   * Venue is deliberately hidden unless:
   *
   * - venue exists
   * - venue is not disabled
   * - venue has a name
   *
   * This prevents the empty venue section that existed before.
   */

  const venue =
    story.venue &&
    story.venue.enabled !== false &&
    story.venue.name
      ? story.venue
      : null


  /* ==========================================================
     FINAL SURPRISE
  ========================================================== */

  const finalSurprise =
    story.finalSurprise ||
    {}


  const hasFinalSurprise =
    Boolean(
      finalSurprise.title?.trim() ||
      finalSurprise.message?.trim()
    )


  /* ==========================================================
     MUSIC INFORMATION
  ========================================================== */

  const musicName =
    story.music?.name ||
    story.backgroundMusic?.name ||
    ""


  /* ==========================================================
     FEELINGS
  ========================================================== */

  const feelings =
    story.feelings ||
    {}


  /* ==========================================================
     QUESTIONS
  ========================================================== */

  const questions =
    useMemo(() => {

      const heartQuestions =
        Array.isArray(
          story.heartQuestions
        )
          ? story.heartQuestions
          : []


      const customQuestions =
        Array.isArray(
          story.customQuestions
        )
          ? story.customQuestions
          : []


      /*
       * Creator answers only.
       *
       * No chatbot.
       * No text input.
       */

      return [
        ...heartQuestions,
        ...customQuestions,
      ].filter(
        (item) =>
          item?.question &&
          item?.answer
      )

    }, [
      story.heartQuestions,
      story.customQuestions,
    ])


  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {

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
     ERROR
  ========================================================== */

  if (
    error ||
    !gift
  ) {

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
            w-full
            max-w-md
            rounded-[30px]
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

            <LockKeyhole
              size={20}
              className="
                text-theme-secondary
              "
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
            We couldn't open this universe
          </h1>


          <p
            className="
              mt-3
              text-sm
              leading-6
              text-theme-muted
            "
          >
            {error}
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
            Back to creation
          </button>

        </div>

      </main>

    )

  }


  /* ==========================================================
     UNIVERSE
  ========================================================== */

  return (

    <main
      className="
        min-h-screen
        overflow-hidden
      "
    >

      {/* ======================================================
          BACKGROUND MUSIC
      ====================================================== */}

      {musicUrl && (

        <>

          <audio
            ref={audioRef}
            src={musicUrl}
            loop
            preload="metadata"
            onPlay={() =>
              setMusicPlaying(true)
            }
            onPause={() =>
              setMusicPlaying(false)
            }
          />


          <button
            type="button"
            onClick={
              toggleMusic
            }
            aria-label={
              musicPlaying
                ? "Pause background music"
                : "Play background music"
            }
            className="
              fixed
              bottom-5
              right-5
              z-50
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

              <Pause
                size={14}
              />

            ) : (

              <Play
                size={14}
              />

            )}


            <span
              className="
                hidden
                max-w-[180px]
                truncate
                sm:block
              "
            >
              {musicName ||
                "Our song"}
            </span>

          </button>

        </>

      )}


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


      {/* ======================================================
          HERO
      ====================================================== */}

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

            Hi{" "}

            <span
              className="
                serif
                italic
                text-theme-secondary
              "
            >
              {nickname}
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

            <ArrowDown
              size={14}
            />

          </a>

        </div>


        {/* ====================================================
            QUICK NAVIGATION
        ==================================================== */}

        <div
          className="
            mx-auto
            mt-20
            grid
            max-w-6xl
            gap-3
            sm:grid-cols-2
            lg:grid-cols-5
          "
        >

          <NavigationCard
            href="#our-story"
            icon={
              <Heart
                size={17}
              />
            }
            number="01"
            title="Our Story"
            description="Where everything began."
          />


          <NavigationCard
            href="#memories"
            icon={
              <Camera
                size={17}
              />
            }
            number="02"
            title="Memories"
            description="Moments worth keeping."
          />


          <NavigationCard
            href="#questions"
            icon={
              <Sparkles
                size={17}
              />
            }
            number="03"
            title="From My Heart"
            description="Answers written just for you."
          />


          <NavigationCard
            href="#letter"
            icon={
              <Mail
                size={17}
              />
            }
            number="04"
            title="A Letter"
            description="Words that deserve to be read."
          />


          {(feelings.whatILove ||
            feelings.whatMakesThemSpecial ||
            feelings.thingsThatMakeMeSmile ||
            feelings.whatIAdmire ||
            feelings.unforgettableThing) && (

            <NavigationCard
              href="#what-i-love"
              icon={
                <Sparkles
                  size={17}
                />
              }
              number="05"
              title="What I See In You"
              description="The things I notice and cherish."
            />

          )}

        </div>

      </section>


      {/* ======================================================
          STORY
      ====================================================== */}

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


              {story.importantDate && (

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
                      story.importantDate
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
                text={
                  story.beginning?.howWeMet ||
                  "Every beautiful story has a beginning."
                }
              />


              {story.beginning?.whereWeMet && (

                <StoryCard
                  title="Where we met"
                  text={
                    story.beginning.whereWeMet
                  }
                />

              )}


              {story.beginning?.firstImpression && (

                <StoryCard
                  title="First impression"
                  text={
                    story.beginning.firstImpression
                  }
                />

              )}


              {story.beginning?.turningPoint && (

                <StoryCard
                  title="The turning point"
                  text={
                    story.beginning.turningPoint
                  }
                />

              )}

            </div>

          </div>

        </div>

      </section>


      {/* ======================================================
          MEMORIES
      ====================================================== */}

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


          {photoUrls.length > 0 ? (

            <div
              className="
                mt-12
                grid
                grid-cols-2
                gap-4
                md:grid-cols-3
              "
            >

              {photoUrls.map(
                (
                  photo,
                  index
                ) => (

                  <div
                    key={
                      photo.id ||
                      index
                    }
                    className="
                      group
                      overflow-hidden
                      rounded-3xl
                      border
                      border-theme-soft
                      bg-surface-soft
                    "
                  >

                    <div
                      className="
                        aspect-square
                      "
                    >

                      <img
                        src={
                          photo.url
                        }
                        alt={
                          photo.name ||
                          "Memory"
                        }
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                      />

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div
              className="
                mt-12
                rounded-3xl
                border
                border-dashed
                border-theme
                bg-surface-soft
                px-6
                py-20
                text-center
              "
            >

              <Camera
                size={22}
                className="
                  mx-auto
                  text-theme-muted
                "
              />


              <p
                className="
                  mt-5
                  text-sm
                  text-theme-secondary
                "
              >
                Your memories will appear here.
              </p>

            </div>

          )}

        </div>

      </section>


      {/* ======================================================
          WHAT I SEE IN YOU
      ====================================================== */}

      {(feelings.whatILove ||
        feelings.whatMakesThemSpecial ||
        feelings.thingsThatMakeMeSmile ||
        feelings.whatIAdmire ||
        feelings.unforgettableThing) && (

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

              This is what makes

              <br />

              <span
                className="
                  serif
                  italic
                  text-theme-secondary
                "
              >
                you, you.
              </span>

            </h2>


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
                  (
                    [label, text]
                  ) => (

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


      {/* ======================================================
          HEART QUESTIONS
      ====================================================== */}

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

              {questions.length > 0 ? (

                questions.map(
                  (
                    item,
                    index
                  ) => {

                    const id =
                      item.id ||
                      index

                    const open =
                      openQuestion ===
                      id


                    return (

                      <div
                        key={id}
                        className="
                          overflow-hidden
                          rounded-3xl
                          border
                          border-theme-soft
                          bg-surface-soft
                          transition
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
                            className={`
                              shrink-0
                              transition-transform
                              duration-300
                              ${
                                open
                                  ? "rotate-180 text-theme-secondary"
                                  : "text-theme-muted"
                              }
                            `}
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
                )

              ) : (

                <div
                  className="
                    rounded-3xl
                    border
                    border-dashed
                    border-theme
                    bg-surface-soft
                    p-8
                    text-center
                  "
                >

                  <Sparkles
                    size={20}
                    className="
                      mx-auto
                      text-theme-muted
                    "
                  />


                  <p
                    className="
                      mt-4
                      text-sm
                      text-theme-secondary
                    "
                  >
                    Your personal questions will appear here.
                  </p>

                </div>

              )}

            </div>

          </div>

        </div>

      </section>


      {/* ======================================================
          LETTER
      ====================================================== */}

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

              {story.personalMessage ||
                story.message?.personalMessage ||
                story.message?.whatIWantThemToKnow ||
                `There are some things that are difficult to say in an ordinary message. So ${creatorName} left these words here — somewhere you can come back to them whenever you need a reminder of how special you are.`}

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


      {/* ======================================================
          OPTIONAL VENUE
      ====================================================== */}

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


      {/* ======================================================
          FINAL SURPRISE
      ====================================================== */}

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


      {/* ======================================================
          FOOTER
      ====================================================== */}

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


      {/* ======================================================
          WELCOME MODAL
      ====================================================== */}

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


            {musicUrl && (

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

                <Play
                  size={11}
                />

                {musicName ||
                  "A song chosen for you"}

              </p>

            )}


            <button
              type="button"
              onClick={
                startUniverse
              }
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

              <ArrowRight
                size={15}
              />

            </button>

          </div>

        </div>

      )}

    </main>

  )
}


/* ============================================================
   NAVIGATION CARD
============================================================ */

function NavigationCard({
  href,
  icon,
  number,
  title,
  description,
}) {

  return (

    <a
      href={href}
      className="
        group
        rounded-3xl
        border
        border-theme-soft
        bg-surface-soft
        p-5
        transition
        hover:-translate-y-1
        hover:border-theme
        hover:bg-surface-hover
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
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
            text-theme-muted
          "
        >
          {icon}
        </span>


        <span
          className="
            text-[9px]
            tracking-[0.25em]
            text-theme-faint
          "
        >
          {number}
        </span>

      </div>


      <h3
        className="
          mt-8
          text-sm
          font-semibold
          text-theme-primary
        "
      >
        {title}
      </h3>


      <p
        className="
          mt-2
          text-xs
          leading-5
          text-theme-muted
        "
      >
        {description}
      </p>

    </a>

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
   DATE
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