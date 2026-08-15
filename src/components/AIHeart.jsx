import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowUp,
  ChevronDown,
  Heart,
  RotateCcw,
  Sparkles,
  WandSparkles,
} from "lucide-react"


/* ============================================================
   QUESTION BANK

   These are not random questions.

   Each question has an intent so the chatbot knows which
   part of the relationship profile should be used.
============================================================ */

const QUESTION_BANK = [

  /* ==========================================================
     ABOUT PARTNER
  ========================================================== */

  {
    id: "special",
    category: "About them",
    icon: "❤️",
    label: "What makes them special?",
    examples: [
      "what makes her special",
      "what makes him special",
      "why are they special",
      "why is my partner special",
    ],
    intent: "SPECIAL",
  },

  {
    id: "love",
    category: "About them",
    icon: "💕",
    label: "What do I love most about them?",
    examples: [
      "what do i love about her",
      "what do i love about him",
      "what does he love about me",
      "what does she love about me",
      "what do they love about me",
      "favorite thing about me",
    ],
    intent: "LOVE",
  },

  {
    id: "admire",
    category: "About them",
    icon: "✨",
    label: "What do I admire about them?",
    examples: [
      "what do i admire",
      "what do i admire about her",
      "what do i admire about him",
      "what does my partner admire",
    ],
    intent: "ADMIRE",
  },

  {
    id: "smile",
    category: "About them",
    icon: "😊",
    label: "What makes me smile?",
    examples: [
      "what makes me smile",
      "what does she do that makes me smile",
      "what does he do that makes me smile",
      "what makes my partner smile",
    ],
    intent: "SMILE",
  },


  /* ==========================================================
     OUR STORY
  ========================================================== */

  {
    id: "meet",
    category: "Our story",
    icon: "🌱",
    label: "How did our story begin?",
    examples: [
      "how did we meet",
      "where did we meet",
      "how did our story start",
      "how did our relationship begin",
      "tell me how we met",
    ],
    intent: "MEETING",
  },

  {
    id: "first-impression",
    category: "Our story",
    icon: "👀",
    label: "What was the first impression?",
    examples: [
      "first impression",
      "what did they think when we met",
      "what was my first impression",
      "what did i think of them",
    ],
    intent: "FIRST_IMPRESSION",
  },

  {
    id: "turning-point",
    category: "Our story",
    icon: "✨",
    label: "When did I realize they mattered?",
    examples: [
      "when did i realize",
      "when did they become important",
      "turning point",
      "when did i fall",
      "when did i know",
    ],
    intent: "TURNING_POINT",
  },

  {
    id: "story",
    category: "Our story",
    icon: "📖",
    label: "Tell me our story.",
    examples: [
      "tell me our story",
      "our story",
      "summarize our relationship",
      "tell me about us",
      "what is our story",
    ],
    intent: "STORY",
  },


  /* ==========================================================
     MEMORIES
  ========================================================== */

  {
    id: "favorite-memory",
    category: "Memories",
    icon: "📸",
    label: "What's our favorite memory?",
    examples: [
      "favorite memory",
      "best memory",
      "what is our favorite memory",
      "which memory is special",
      "what memory should i remember",
    ],
    intent: "FAVORITE_MEMORY",
  },

  {
    id: "happy",
    category: "Memories",
    icon: "☀️",
    label: "What was our happiest moment?",
    examples: [
      "happiest moment",
      "when were we happiest",
      "best moment together",
      "happiest memory",
    ],
    intent: "HAPPIEST",
  },

  {
    id: "funny",
    category: "Memories",
    icon: "😂",
    label: "What's our funniest memory?",
    examples: [
      "funniest memory",
      "funny memory",
      "what made us laugh",
      "funniest moment",
      "what do we laugh about",
    ],
    intent: "FUNNY",
  },

  {
    id: "little",
    category: "Memories",
    icon: "🌙",
    label: "What little moment means a lot?",
    examples: [
      "little moment",
      "small moment",
      "ordinary moment",
      "small things",
      "little things",
    ],
    intent: "LITTLE_MOMENT",
  },


  /* ==========================================================
     PRIVATE WORLD
  ========================================================== */

  {
    id: "jokes",
    category: "Our little world",
    icon: "😂",
    label: "Do we have an inside joke?",
    examples: [
      "inside joke",
      "our jokes",
      "private joke",
      "joke between us",
    ],
    intent: "JOKES",
  },

  {
    id: "phrase",
    category: "Our little world",
    icon: "💬",
    label: "Do we have a special phrase?",
    examples: [
      "special phrase",
      "special word",
      "what do we say",
      "our phrase",
      "nickname",
    ],
    intent: "PHRASE",
  },

  {
    id: "song",
    category: "Our little world",
    icon: "🎵",
    label: "What song reminds us of each other?",
    examples: [
      "our song",
      "song reminds",
      "special song",
      "song about us",
    ],
    intent: "SONG",
  },

  {
    id: "place",
    category: "Our little world",
    icon: "📍",
    label: "What place is special to us?",
    examples: [
      "special place",
      "favorite place",
      "place special",
      "where is special",
    ],
    intent: "PLACE",
  },


  /* ==========================================================
     EMOTIONAL
  ========================================================== */

  {
    id: "message",
    category: "From the heart",
    icon: "💌",
    label: "What do they want me to know?",
    examples: [
      "what do they want me to know",
      "what does he want me to know",
      "what does she want me to know",
      "what should i know",
    ],
    intent: "WHAT_TO_KNOW",
  },

  {
    id: "never-said",
    category: "From the heart",
    icon: "🤍",
    label: "What have they never said?",
    examples: [
      "never said",
      "something they never said",
      "what have they wanted to say",
      "what couldn't they say",
    ],
    intent: "NEVER_SAID",
  },

  {
    id: "sad",
    category: "From the heart",
    icon: "🌙",
    label: "What would they tell me if I were sad?",
    examples: [
      "if i were sad",
      "if i am sad",
      "what would they tell me",
      "comfort me",
      "what would my partner say",
    ],
    intent: "SAD",
  },

  {
    id: "romantic",
    category: "From the heart",
    icon: "💗",
    label: "Tell me something romantic.",
    examples: [
      "say something romantic",
      "romantic message",
      "tell me something sweet",
      "something romantic",
      "make me feel loved",
    ],
    intent: "ROMANTIC",
  },


  /* ==========================================================
     CREATIVE
  ========================================================== */

  {
    id: "three-words",
    category: "Just for fun",
    icon: "✨",
    label: "Describe us in three words.",
    examples: [
      "three words",
      "describe us",
      "three words about us",
    ],
    intent: "THREE_WORDS",
  },

  {
    id: "title",
    category: "Just for fun",
    icon: "🎬",
    label: "Give our story a title.",
    examples: [
      "title for our story",
      "story title",
      "name our story",
      "what would our story be called",
    ],
    intent: "TITLE",
  },

]


/* ============================================================
   CATEGORY ORDER
============================================================ */

const CATEGORY_ORDER = [

  "About them",
  "Our story",
  "Memories",
  "Our little world",
  "From the heart",
  "Just for fun",

]


/* ============================================================
   NORMALIZE TEXT
============================================================ */

function normalizeText(value = "") {

  return value
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

}


/* ============================================================
   SAFE VALUE

   Returns only meaningful creator-provided information.
============================================================ */

function safeValue(value) {

  if (
    typeof value !== "string"
  ) {
    return ""
  }


  return value.trim()

}


/* ============================================================
   GET STORY VALUE

   Supports the NEW relationship profile.

   Also supports the older structure so previously-created
   stories don't suddenly stop working.
============================================================ */

function getStoryValue(
  story,
  paths = []
) {

  for (const path of paths) {

    const parts =
      path.split(".")


    let current =
      story


    for (const part of parts) {

      current =
        current?.[part]

    }


    const value =
      safeValue(current)


    if (value) {
      return value
    }

  }


  return ""

}


/* ============================================================
   BUILD STORY PROFILE

   Converts the raw saved object into a clean profile for
   our answer engine.
============================================================ */

function buildProfile(story) {

  return {

    creatorName:
      getStoryValue(
        story,
        [
          "creator.name",
        ]
      ) || "you",


    partnerName:
      getStoryValue(
        story,
        [
          "partner.name",
        ]
      ) || "your partner",


    nickname:
      getStoryValue(
        story,
        [
          "partner.nickname",
        ]
      ),


    relationship:
      getStoryValue(
        story,
        [
          "relationship",
        ]
      ),


    meeting:
      getStoryValue(
        story,
        [
          "beginning.howWeMet",
          "story.meeting",
        ]
      ),


    meetingPlace:
      getStoryValue(
        story,
        [
          "beginning.whereWeMet",
        ]
      ),


    firstImpression:
      getStoryValue(
        story,
        [
          "beginning.firstImpression",
        ]
      ),


    turningPoint:
      getStoryValue(
        story,
        [
          "beginning.turningPoint",
        ]
      ),


    whatILove:
      getStoryValue(
        story,
        [
          "feelings.whatILove",
        ]
      ),


    specialThings:
      getStoryValue(
        story,
        [
          "feelings.whatMakesThemSpecial",
          "story.specialThings",
        ]
      ),


    smile:
      getStoryValue(
        story,
        [
          "feelings.thingsThatMakeMeSmile",
        ]
      ),


    admire:
      getStoryValue(
        story,
        [
          "feelings.whatIAdmire",
        ]
      ),


    unforgettable:
      getStoryValue(
        story,
        [
          "feelings.unforgettableThing",
        ]
      ),


    favoriteMemory:
      getStoryValue(
        story,
        [
          "memories.favoriteMemory",
          "story.favoriteMemory",
        ]
      ),


    happiestMoment:
      getStoryValue(
        story,
        [
          "memories.happiestMoment",
        ]
      ),


    funnyMoment:
      getStoryValue(
        story,
        [
          "memories.funnyMoment",
        ]
      ),


    littleMoment:
      getStoryValue(
        story,
        [
          "memories.littleMoment",
        ]
      ),


    insideJokes:
      getStoryValue(
        story,
        [
          "privateWorld.insideJokes",
        ]
      ),


    specialPhrase:
      getStoryValue(
        story,
        [
          "privateWorld.specialPhrase",
        ]
      ),


    specialSong:
      getStoryValue(
        story,
        [
          "privateWorld.specialSong",
        ]
      ),


    specialPlace:
      getStoryValue(
        story,
        [
          "privateWorld.specialPlace",
        ]
      ),


    importantDate:
      getStoryValue(
        story,
        [
          "importantDate",
        ]
      ),


    whatIWantThemToKnow:
      getStoryValue(
        story,
        [
          "message.whatIWantThemToKnow",
        ]
      ),


    neverSaid:
      getStoryValue(
        story,
        [
          "message.thingsIHaveNeverSaid",
        ]
      ),


    personalMessage:
      getStoryValue(
        story,
        [
          "message.personalMessage",
          "personalMessage",
        ]
      ),


    mood:
      getStoryValue(
        story,
        [
          "mood",
        ]
      ),

  }

}


/* ============================================================
   QUESTION MATCHING

   Finds the closest predefined intent for free text.
============================================================ */

function detectIntent(question) {

  const text =
    normalizeText(question)


  if (!text) {
    return null
  }


  let bestMatch = null
  let bestScore = 0


  for (
    const item
    of QUESTION_BANK
  ) {

    let score = 0


    for (
      const example
      of item.examples
    ) {

      const normalizedExample =
        normalizeText(example)


      /* Exact phrase */

      if (
        text.includes(
          normalizedExample
        )
      ) {

        score += 8

      }


      /* Individual words */

      const words =
        normalizedExample
          .split(" ")
          .filter(
            (word) =>
              word.length > 2
          )


      for (
        const word
        of words
      ) {

        if (
          text.includes(word)
        ) {

          score += 1

        }

      }

    }


    if (
      score > bestScore
    ) {

      bestScore =
        score

      bestMatch =
        item

    }

  }


  return bestMatch

}


/* ============================================================
   JOIN STORY DETAILS
============================================================ */

function joinDetails(
  details
) {

  return details
    .map(
      (item) =>
        safeValue(item)
    )
    .filter(Boolean)

}


/* ============================================================
   RESPONSE ENGINE
============================================================ */

function generateAnswer(
  intent,
  profile,
  question
) {

  const name =
    profile.partnerName


  const nickname =
    profile.nickname


  const calledName =
    nickname ||
    name


  /* ==========================================================
     SPECIAL
  ========================================================== */

  if (
    intent === "SPECIAL"
  ) {

    if (
      profile.specialThings
    ) {

      return (
        `What makes ${calledName} special is something ` +
        `you described very personally: ${profile.specialThings}`
      )

    }


    if (
      profile.whatILove
    ) {

      return (
        `From what you shared, one of the things you love ` +
        `most about ${calledName} is ${profile.whatILove}`
      )

    }


    return (
      `You haven't given me enough details about what makes ` +
      `${calledName} special yet. Tell me one little thing ` +
      `about them and I'll remember it here. ❤️`
    )

  }


  /* ==========================================================
     LOVE
  ========================================================== */

  if (
    intent === "LOVE"
  ) {

    const details =
      joinDetails([
        profile.whatILove,
        profile.specialThings,
      ])


    if (
      details.length > 0
    ) {

      return (
        `From your story, you love ${calledName} because ` +
        `${details.join(" And ")}`
      )

    }


    return (
      `I don't want to invent an answer for you. ` +
      `You haven't told me what you love most about ` +
      `${calledName} yet. ❤️`
    )

  }


  /* ==========================================================
     ADMIRE
  ========================================================== */

  if (
    intent === "ADMIRE"
  ) {

    if (
      profile.admire
    ) {

      return (
        `What you admire most about ${calledName} is ` +
        `${profile.admire}`
      )

    }


    return (
      `You haven't shared what you admire most about ` +
      `${calledName} yet. That's one of the details I'd ` +
      `love to have in your story. ✨`
    )

  }


  /* ==========================================================
     SMILE
  ========================================================== */

  if (
    intent === "SMILE"
  ) {

    if (
      profile.smile
    ) {

      return (
        `One thing that always makes you smile is ` +
        `${profile.smile}`
      )

    }


    return (
      `I don't have that detail yet. Tell me what ` +
      `${calledName} does that instantly makes you smile. 😊`
    )

  }


  /* ==========================================================
     MEETING
  ========================================================== */

  if (
    intent === "MEETING"
  ) {

    const meeting =
      profile.meeting


    if (meeting) {

      if (
        profile.meetingPlace
      ) {

        return (
          `Your story began ${profile.meetingPlace}. ` +
          `${meeting}`
        )

      }


      return (
        `Your story began like this: ${meeting}`
      )

    }


    return (
      `I don't have the beginning of your story yet. ` +
      `Tell me how you first met ${calledName}. 🌱`
    )

  }


  /* ==========================================================
     FIRST IMPRESSION
  ========================================================== */

  if (
    intent === "FIRST_IMPRESSION"
  ) {

    if (
      profile.firstImpression
    ) {

      return (
        `Your first impression of ${calledName} was: ` +
        `${profile.firstImpression}`
      )

    }


    return (
      `You haven't told me your first impression of ` +
      `${calledName} yet. 👀`
    )

  }


  /* ==========================================================
     TURNING POINT
  ========================================================== */

  if (
    intent === "TURNING_POINT"
  ) {

    if (
      profile.turningPoint
    ) {

      return (
        `The moment you described as important was: ` +
        `${profile.turningPoint}`
      )

    }


    return (
      `That part of your story hasn't been shared with me yet. ` +
      `When did you first realize ${calledName} was becoming ` +
      `important to you? ❤️`
    )

  }


  /* ==========================================================
     STORY
  ========================================================== */

  if (
    intent === "STORY"
  ) {

    const parts =
      joinDetails([

        profile.meeting,

        profile.firstImpression,

        profile.turningPoint,

        profile.favoriteMemory,

      ])


    if (
      parts.length > 0
    ) {

      return (
        `Your story, in a few words: ` +
        `${parts.join(" ")}` +
        ` And one memory that stands out is ` +
        `${profile.favoriteMemory || "one of the moments you shared together"}.`
      )

    }


    return (
      `I know that ${calledName} is someone important to you, ` +
      `but I need more of your story before I can tell it properly.`
    )

  }


  /* ==========================================================
     FAVORITE MEMORY
  ========================================================== */

  if (
    intent === "FAVORITE_MEMORY"
  ) {

    if (
      profile.favoriteMemory
    ) {

      return (
        `The favorite memory you gave me is: ` +
        `${profile.favoriteMemory} ❤️`
      )

    }


    return (
      `I don't have a favorite memory saved yet. ` +
      `Tell me about the moment you would choose to relive. 📸`
    )

  }


  /* ==========================================================
     HAPPIEST
  ========================================================== */

  if (
    intent === "HAPPIEST"
  ) {

    if (
      profile.happiestMoment
    ) {

      return (
        `The happiest moment you shared with me is: ` +
        `${profile.happiestMoment} ☀️`
      )

    }


    if (
      profile.favoriteMemory
    ) {

      return (
        `You didn't give me a separate happiest moment, ` +
        `but the memory you marked as your favorite is: ` +
        `${profile.favoriteMemory}`
      )

    }


    return (
      `I don't have that memory yet. Tell me about the ` +
      `happiest moment you shared with ${calledName}.`
    )

  }


  /* ==========================================================
     FUNNY
  ========================================================== */

  if (
    intent === "FUNNY"
  ) {

    if (
      profile.funnyMoment
    ) {

      return (
        `Your funny memory is: ${profile.funnyMoment} 😂`
      )

    }


    if (
      profile.insideJokes
    ) {

      return (
        `You haven't given me a funny memory, but you did ` +
        `tell me about an inside joke: ${profile.insideJokes} 😂`
      )

    }


    return (
      `I don't have a funny memory yet. Tell me the moment ` +
      `that still makes both of you laugh. 😂`
    )

  }


  /* ==========================================================
     LITTLE MOMENT
  ========================================================== */

  if (
    intent === "LITTLE_MOMENT"
  ) {

    if (
      profile.littleMoment
    ) {

      return (
        `One of those quiet moments that means a lot is: ` +
        `${profile.littleMoment} 🌙`
      )

    }


    return (
      `I don't have that little moment yet. ` +
      `Sometimes the smallest memories are the most beautiful.`
    )

  }


  /* ==========================================================
     JOKES
  ========================================================== */

  if (
    intent === "JOKES"
  ) {

    if (
      profile.insideJokes
    ) {

      return (
        `Yes — you shared this inside joke with me: ` +
        `${profile.insideJokes} 😂`
      )

    }


    return (
      `No inside joke has been saved yet. ` +
      `Maybe that's one of the little things you two should add.`
    )

  }


  /* ==========================================================
     PHRASE
  ========================================================== */

  if (
    intent === "PHRASE"
  ) {

    if (
      profile.specialPhrase
    ) {

      return (
        `Your special phrase is: "${profile.specialPhrase}" 💕`
      )

    }


    if (
      nickname
    ) {

      return (
        `You call ${name} "${nickname}". ` +
        `That's already a little piece of your private world. ❤️`
      )

    }


    return (
      `You haven't shared a special phrase yet.`
    )

  }


  /* ==========================================================
     SONG
  ========================================================== */

  if (
    intent === "SONG"
  ) {

    if (
      profile.specialSong
    ) {

      return (
        `The song you connected with your story is ` +
        `"${profile.specialSong}". 🎵`
      )

    }


    return (
      `You haven't told me your special song yet.`
    )

  }


  /* ==========================================================
     PLACE
  ========================================================== */

  if (
    intent === "PLACE"
  ) {

    if (
      profile.specialPlace
    ) {

      return (
        `The place you marked as special is ` +
        `${profile.specialPlace}. 📍`
      )

    }


    return (
      `You haven't shared a special place yet.`
    )

  }


  /* ==========================================================
     WHAT TO KNOW
  ========================================================== */

  if (
    intent === "WHAT_TO_KNOW"
  ) {

    if (
      profile.whatIWantThemToKnow
    ) {

      return (
        `If there is one thing you wanted ${calledName} ` +
        `to know, it's this: ${profile.whatIWantThemToKnow} ❤️`
      )

    }


    return (
      `That message hasn't been shared with me yet.`
    )

  }


  /* ==========================================================
     NEVER SAID
  ========================================================== */

  if (
    intent === "NEVER_SAID"
  ) {

    if (
      profile.neverSaid
    ) {

      return (
        `Something you said you've always wanted to say is: ` +
        `${profile.neverSaid}`
      )

    }


    return (
      `You haven't shared that private thought with me yet.`
    )

  }


  /* ==========================================================
     SAD
  ========================================================== */

  if (
    intent === "SAD"
  ) {

    const details =
      joinDetails([

        profile.whatIWantThemToKnow,

        profile.whatILove,

        profile.specialThings,

      ])


    if (
      details.length > 0
    ) {

      return (
        `If you were having a difficult day, the heart ` +
        `behind this story would probably remind you that ` +
        `${details.join(" ")} ` +
        `You are clearly someone who matters deeply. ❤️`
      )

    }


    return (
      `I don't want to pretend I know words they haven't shared. ` +
      `But if you're having a hard day, remember this: ` +
      `you are worth being loved gently. 🌙`
    )

  }


  /* ==========================================================
     ROMANTIC
  ========================================================== */

  if (
    intent === "ROMANTIC"
  ) {

    const details =
      joinDetails([

        profile.whatILove,

        profile.favoriteMemory,

        profile.whatIWantThemToKnow,

      ])


    if (
      details.length > 0
    ) {

      return (
        `Maybe this is what your story would say tonight: ` +
        `"${calledName}, I love the little things about you — ` +
        `${profile.whatILove || "the things that make you uniquely you"}. ` +
        `And I'll always carry the memory of ` +
        `${profile.favoriteMemory || "our moments together"}. ` +
        `${profile.whatIWantThemToKnow || ""}"`
      )

    }


    return (
      `Somewhere between all the ordinary moments, ` +
      `you became someone extraordinary to each other. ❤️`
    )

  }


  /* ==========================================================
     THREE WORDS
  ========================================================== */

  if (
    intent === "THREE_WORDS"
  ) {

    return (
      `From the feeling of your story, I'd describe ` +
      `you as **personal, memorable, and deeply connected**. ✨`
    )

  }


  /* ==========================================================
     TITLE
  ========================================================== */

  if (
    intent === "TITLE"
  ) {

    if (
      profile.meeting &&
      profile.favoriteMemory
    ) {

      return (
        `"The Moment We Became Us" ❤️`
      )

    }


    return (
      `"Our Little Universe" ✨`
    )

  }


  /* ==========================================================
     UNKNOWN
  ========================================================== */

  return (
    `I want to answer that from your story, not make ` +
    `something up. Try asking me about ${calledName}, ` +
    `your memories, how you met, or something you love ` +
    `about each other. ❤️`
  )

}


/* ============================================================
   COMPONENT
============================================================ */

function AIHeart() {

  const [story, setStory] =
    useState(null)


  const [question, setQuestion] =
    useState("")


  const [messages, setMessages] =
    useState([])


  const [isThinking, setIsThinking] =
    useState(false)


  const [showAllQuestions, setShowAllQuestions] =
    useState(false)


  const messagesEndRef =
    useRef(null)


  /* ==========================================================
     LOAD STORY
  ========================================================== */

  useEffect(() => {

    const loadStory = () => {

      const saved =
        localStorage.getItem(
          "our-story-data"
        )


      if (!saved) {
        return
      }


      try {

        setStory(
          JSON.parse(saved)
        )

      } catch (error) {

        console.error(
          "AI Heart could not read story:",
          error
        )

      }

    }


    loadStory()


    /* If another part of the app updates the story */

    window.addEventListener(
      "storage",
      loadStory
    )


    return () => {

      window.removeEventListener(
        "storage",
        loadStory
      )

    }

  }, [])


  /* ==========================================================
     BUILD PROFILE
  ========================================================== */

  const profile =
    useMemo(
      () =>
        buildProfile(
          story || {}
        ),
      [story]
    )


  /* ==========================================================
     AUTO SCROLL
  ========================================================== */

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    })

  }, [
    messages,
    isThinking,
  ])


  /* ==========================================================
     QUESTIONS BY CATEGORY
  ========================================================== */

  const groupedQuestions =
    useMemo(() => {

      const result = {}


      for (
        const category
        of CATEGORY_ORDER
      ) {

        result[category] =
          QUESTION_BANK.filter(
            (item) =>
              item.category === category
          )

      }


      return result

    }, [])


  /* ==========================================================
     VISIBLE QUESTIONS

     We show a useful set first instead of overwhelming the user.
  ========================================================== */

  const visibleQuestions =
    useMemo(() => {

      if (
        showAllQuestions
      ) {

        return QUESTION_BANK

      }


      return [

        QUESTION_BANK.find(
          (item) =>
            item.intent === "SPECIAL"
        ),

        QUESTION_BANK.find(
          (item) =>
            item.intent === "LOVE"
        ),

        QUESTION_BANK.find(
          (item) =>
            item.intent === "FAVORITE_MEMORY"
        ),

        QUESTION_BANK.find(
          (item) =>
            item.intent === "FUNNY"
        ),

        QUESTION_BANK.find(
          (item) =>
            item.intent === "MEETING"
        ),

        QUESTION_BANK.find(
          (item) =>
            item.intent === "WHAT_TO_KNOW"
        ),

      ].filter(Boolean)

    }, [
      showAllQuestions,
    ])


  /* ==========================================================
     ASK
  ========================================================== */

  const askQuestion = (
    providedQuestion = question
  ) => {

    const text =
      safeValue(
        providedQuestion
      )


    if (
      !text ||
      isThinking
    ) {

      return

    }


    const detected =
      detectIntent(text)


    const userMessage = {

      id:
        `user-${Date.now()}`,

      role:
        "user",

      text,

    }


    setMessages(
      (previous) => [
        ...previous,
        userMessage,
      ]
    )


    setQuestion("")

    setIsThinking(true)


    /* ========================================================
       Natural response delay
    ======================================================== */

    setTimeout(() => {

      const answer =
        generateAnswer(
          detected?.intent,
          profile,
          text
        )


      const aiMessage = {

        id:
          `ai-${Date.now()}`,

        role:
          "assistant",

        text:
          answer,

      }


      setMessages(
        (previous) => [
          ...previous,
          aiMessage,
        ]
      )


      setIsThinking(false)

    }, 650)

  }


  /* ==========================================================
     ENTER KEY
  ========================================================== */

  const handleKeyDown = (
    event
  ) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault()

      askQuestion()

    }

  }


  /* ==========================================================
     CLEAR CHAT
  ========================================================== */

  const clearChat = () => {

    if (
      messages.length === 0
    ) {

      return

    }


    setMessages([])

  }


  /* ==========================================================
     EMPTY STORY STATE
  ========================================================== */

  if (!story) {

    return (

      <div
        className="
          rounded-[30px]
          border
          border-theme
          bg-surface-elevated
          p-8
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
            bg-surface-soft
          "
        >

          <Heart
            size={17}
            className="text-theme-secondary"
          />

        </div>


        <p
          className="
            mt-5
            text-center
            text-sm
            text-theme-secondary
          "
        >
          Your story hasn't been loaded yet.
        </p>

      </div>

    )

  }


  return (

    <div
      className="
        overflow-hidden
        rounded-[30px]
        border
        border-theme
        bg-surface-elevated
        shadow-[0_30px_80px_var(--shadow-card)]
      "
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          border-b
          border-theme-soft
          px-5
          py-5
          sm:px-7
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <motion.div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-theme-button
                text-theme-button
              "
              animate={{
                scale: [
                  1,
                  1.05,
                  1,
                ],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
              }}
            >

              <Heart
                size={15}
                fill="currentColor"
              />

            </motion.div>


            <div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <h3
                  className="
                    text-sm
                    font-medium
                    text-theme-primary
                  "
                >
                  AI Heart
                </h3>


                <span
                  className="
                    rounded-full
                    border
                    border-theme
                    px-2
                    py-0.5
                    text-[8px]
                    uppercase
                    tracking-[0.16em]
                    text-theme-muted
                  "
                >
                  Personal
                </span>

              </div>


              <p
                className="
                  mt-1
                  text-[10px]
                  text-theme-faint
                "
              >
                A little voice built from your story.
              </p>

            </div>

          </div>


          {messages.length > 0 && (

            <button
              type="button"
              onClick={clearChat}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                border-theme-soft
                text-theme-muted
                transition
                hover:border-theme
                hover:bg-surface-hover
                hover:text-theme-primary
              "
              aria-label="Clear conversation"
              title="Clear conversation"
            >

              <RotateCcw
                size={13}
              />

            </button>

          )}

        </div>

      </div>


      {/* ======================================================
          CHAT AREA
      ====================================================== */}

      <div
        className="
          max-h-[520px]
          min-h-[360px]
          overflow-y-auto
          px-5
          py-6
          sm:px-7
        "
      >

        {/* ====================================================
            EMPTY STATE
        ==================================================== */}

        {messages.length === 0 && (

          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
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

                <WandSparkles
                  size={17}
                  className="text-theme-secondary"
                />

              </div>


              <p
                className="
                  mt-5
                  text-sm
                  text-theme-secondary
                "
              >

                Ask me about {profile.partnerName}.

              </p>


              <p
                className="
                  mx-auto
                  mt-2
                  max-w-sm
                  text-xs
                  leading-5
                  text-theme-faint
                "
              >

                I can answer from the memories,
                feelings and details {profile.creatorName}
                shared while creating this universe.

              </p>

            </div>


            {/* ==================================================
                QUESTION CATEGORIES
            ================================================== */}

            <div
              className="
                mt-8
                space-y-6
              "
            >

              {(
                showAllQuestions
                  ? CATEGORY_ORDER
                  : [
                      "About them",
                      "Our story",
                      "Memories",
                    ]
              ).map(
                (category) => {

                  const questions =
                    groupedQuestions[
                      category
                    ]


                  return (

                    <div
                      key={category}
                    >

                      <p
                        className="
                          mb-2.5
                          px-1
                          text-[9px]
                          uppercase
                          tracking-[0.22em]
                          text-theme-faint
                        "
                      >
                        {category}
                      </p>


                      <div
                        className="
                          grid
                          gap-2
                          sm:grid-cols-2
                        "
                      >

                        {questions.map(
                          (item) => (

                            <button
                              key={item.id}
                              type="button"
                              onClick={() =>
                                askQuestion(
                                  item.label
                                )
                              }
                              className="
                                group
                                flex
                                items-center
                                gap-3
                                rounded-2xl
                                border
                                border-theme-soft
                                bg-surface-soft
                                px-4
                                py-3.5
                                text-left
                                transition-all
                                duration-200
                                hover:-translate-y-0.5
                                hover:border-theme
                                hover:bg-surface-hover
                              "
                            >

                              <span
                                className="
                                  text-sm
                                "
                              >
                                {item.icon}
                              </span>


                              <span
                                className="
                                  flex-1
                                  text-xs
                                  leading-5
                                  text-theme-secondary
                                  transition
                                  group-hover:text-theme-primary
                                "
                              >
                                {item.label}
                              </span>


                              <span
                                className="
                                  text-theme-faint
                                "
                              >
                                →
                              </span>

                            </button>

                          )
                        )}

                      </div>

                    </div>

                  )

                }
              )}

            </div>


            {/* ==================================================
                SHOW MORE
            ================================================== */}

            <button
              type="button"
              onClick={() =>
                setShowAllQuestions(
                  (current) =>
                    !current
                )
              }
              className="
                mx-auto
                mt-7
                flex
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

              {showAllQuestions
                ? "Show fewer questions"
                : "Explore more questions"}


              <ChevronDown
                size={12}
                className={`
                  transition-transform
                  ${
                    showAllQuestions
                      ? "rotate-180"
                      : ""
                  }
                `}
              />

            </button>

          </motion.div>

        )}


        {/* ====================================================
            MESSAGES
        ==================================================== */}

        {messages.length > 0 && (

          <div
            className="
              space-y-5
            "
          >

            <AnimatePresence
              initial={false}
            >

              {messages.map(
                (message) => (

                  <motion.div
                    key={message.id}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.28,
                    }}
                    className={`
                      flex
                      ${
                        message.role ===
                        "user"
                          ? "justify-end"
                          : "justify-start"
                      }
                    `}
                  >

                    <div
                      className={`
                        max-w-[90%]
                        rounded-3xl
                        px-5
                        py-4
                        text-sm
                        leading-7

                        ${
                          message.role ===
                          "user"
                            ? `
                              rounded-br-lg
                              bg-theme-button
                              text-theme-button
                            `
                            : `
                              rounded-bl-lg
                              border
                              border-theme-soft
                              bg-surface-soft
                              text-theme-secondary
                            `
                        }
                      `}
                    >

                      {message.role ===
                        "assistant" && (

                        <div
                          className="
                            mb-2.5
                            flex
                            items-center
                            gap-2
                            text-[9px]
                            uppercase
                            tracking-[0.2em]
                            text-theme-muted
                          "
                        >

                          <Heart
                            size={9}
                            fill="currentColor"
                          />

                          AI Heart

                        </div>

                      )}


                      {message.text}

                    </div>

                  </motion.div>

                )
              )}

            </AnimatePresence>


            {/* ==================================================
                THINKING
            ================================================== */}

            {isThinking && (

              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                className="
                  flex
                  justify-start
                "
              >

                <div
                  className="
                    rounded-3xl
                    rounded-bl-lg
                    border
                    border-theme-soft
                    bg-surface-soft
                    px-5
                    py-4
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                    "
                  >

                    {[0, 1, 2].map(
                      (index) => (

                        <motion.span
                          key={index}
                          className="
                            h-1.5
                            w-1.5
                            rounded-full
                            bg-theme-muted
                          "
                          animate={{
                            y: [
                              0,
                              -4,
                              0,
                            ],
                          }}
                          transition={{
                            duration: 0.7,
                            repeat: Infinity,
                            delay:
                              index * 0.12,
                          }}
                        />

                      )
                    )}

                  </div>

                </div>

              </motion.div>

            )}

            <div
              ref={messagesEndRef}
            />

          </div>

        )}

      </div>


      {/* ======================================================
          INPUT
      ====================================================== */}

      <div
        className="
          border-t
          border-theme-soft
          p-4
          sm:p-5
        "
      >

        <div
          className="
            flex
            items-end
            gap-2
            rounded-2xl
            border
            border-theme
            bg-surface-soft
            p-2
            transition
            focus-within:border-theme-strong
          "
        >

          <textarea
            value={question}
            onChange={(event) =>
              setQuestion(
                event.target.value
              )
            }
            onKeyDown={
              handleKeyDown
            }
            placeholder={
              `Ask anything about ${profile.partnerName}...`
            }
            rows={1}
            className="
              min-h-[42px]
              flex-1
              resize-none
              bg-transparent
              px-3
              py-3
              text-sm
              leading-5
              text-theme-primary
              outline-none
              placeholder:text-theme-faint
            "
          />


          <button
            type="button"
            onClick={() =>
              askQuestion()
            }
            disabled={
              !question.trim() ||
              isThinking
            }
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-theme-button
              text-theme-button
              transition
              hover:-translate-y-0.5
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
            aria-label="Ask AI Heart"
          >

            <ArrowUp
              size={16}
            />

          </button>

        </div>


        <div
          className="
            mt-3
            flex
            items-center
            justify-between
            px-1
          "
        >

          <p
            className="
              text-[9px]
              text-theme-faint
            "
          >
            Enter to ask · Shift + Enter for a new line
          </p>


          <div
            className="
              hidden
              items-center
              gap-1.5
              sm:flex
            "
          >

            <Sparkles
              size={9}
              className="text-theme-faint"
            />

            <span
              className="
                text-[8px]
                uppercase
                tracking-[0.15em]
                text-theme-faint
              "
            >
              Story aware
            </span>

          </div>

        </div>

      </div>

    </div>

  )

}


export default AIHeart