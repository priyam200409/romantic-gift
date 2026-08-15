import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Heart,
  ImagePlus,
  Sparkles,
  X,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import ThemeToggle from "../components/ThemeToggle"
import CreatorAccount from "../components/CreatorAccount"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabase"


/* ============================================================
   DEFAULT HEART QUESTIONS

   These are written from the creator's perspective.
   The recipient should feel like the creator is speaking
   directly to them.
============================================================ */

const defaultHeartQuestions = [
  {
    id: "see-you",
    question:
      "One thing about you I hope you always see the way I do",
    answer: "",
  },
  {
    id: "love",
    question:
      "One thing about you I love more than I probably say",
    answer: "",
  },
  {
    id: "smile",
    question:
      "One little thing you do that can instantly make my day",
    answer: "",
  },
  {
    id: "memory",
    question:
      "One memory with you I would happily relive",
    answer: "",
  },
  {
    id: "ordinary",
    question:
      "One ordinary moment with you that became special to me",
    answer: "",
  },
  {
    id: "realized",
    question:
      "The moment I realized you had become important to me",
    answer: "",
  },
  {
    id: "admire",
    question:
      "Something about you I genuinely admire",
    answer: "",
  },
  {
    id: "home",
    question:
      "Something you do that makes me feel at home with you",
    answer: "",
  },
  {
    id: "remember",
    question:
      "Something I want you to remember whenever you doubt yourself",
    answer: "",
  },
  {
    id: "never-said",
    question:
      "Something I do not say often enough, but I want you to know",
    answer: "",
  },
  {
    id: "choose-again",
    question:
      "One reason I would choose you all over again",
    answer: "",
  },
  {
    id: "right-now",
    question:
      "If I could tell you one thing right now, this is what I would say",
    answer: "",
  },
]


/* ============================================================
   INITIAL DATA
============================================================ */

const createInitialData = () => ({
  creatorName: "",
  partnerName: "",
  partnerNickname: "",
  relationship: "",

  meetingStory: "",
  meetingPlace: "",
  firstImpression: "",
  turningPoint: "",

  whatILove: "",
  specialThings: "",
  thingsThatMakeMeSmile: "",
  whatIAdmire: "",
  unforgettableThing: "",

  favoriteMemory: "",
  happiestMoment: "",
  funnyMoment: "",
  littleMoment: "",

  insideJokes: "",
  specialPhrase: "",
  specialSong: "",
  specialPlace: "",

  importantDate: "",

  whatIWantThemToKnow: "",
  thingsIHaveNeverSaid: "",
  personalMessage: "",

  photos: [],

  mood: "",

  heartQuestions: defaultHeartQuestions.map((item) => ({
    ...item,
  })),

  customQuestions: [],

  /* OPTIONAL VENUE */
  venueEnabled: false,
  venueName: "",
  venueAddress: "",
  venueDate: "",
  venueMessage: "",

  /* FINAL SURPRISE */
  finalSurpriseTitle: "",
  finalSurpriseMessage: "",

  /* MUSIC */
  musicFile: null,
  musicName: "",

  /* PRIVATE ACCESS */
  privatePasskey: "",
  verificationQuestion: "",
  verificationAnswer: "",
})


/* ============================================================
   HASH SECRET
============================================================ */

const hashSecret = async (value) => {
  const normalized = value.trim().toLowerCase()

  const encoder = new TextEncoder()
  const data = encoder.encode(normalized)

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    data
  )

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) =>
      byte.toString(16).padStart(2, "0")
    )
    .join("")
}


/* ============================================================
   GIFT CODE
============================================================ */

const generateGiftCode = () => {
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

  const values = new Uint32Array(10)

  crypto.getRandomValues(values)

  return Array.from(values, (value) =>
    alphabet[value % alphabet.length]
  ).join("")
}


/* ============================================================
   IMAGE PREPARATION
============================================================ */

const preparePhotoForUpload = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const image = new Image()

      image.onload = () => {
        const maxSize = 1600

        let width = image.width
        let height = image.height

        if (width > height && width > maxSize) {
          height = Math.round(
            (height * maxSize) / width
          )
          width = maxSize
        }

        if (height >= width && height > maxSize) {
          width = Math.round(
            (width * maxSize) / height
          )
          height = maxSize
        }

        const canvas = document.createElement("canvas")

        canvas.width = width
        canvas.height = height

        const context = canvas.getContext("2d")

        if (!context) {
          reject(
            new Error(
              "Unable to process the image."
            )
          )
          return
        }

        context.drawImage(
          image,
          0,
          0,
          width,
          height
        )

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(
                new Error(
                  "Unable to prepare the image."
                )
              )
              return
            }

            resolve(blob)
          },
          "image/jpeg",
          0.82
        )
      }

      image.onerror = () => {
        reject(
          new Error(
            "Unable to read this image."
          )
        )
      }

      image.src = reader.result
    }

    reader.onerror = () => {
      reject(
        new Error(
          "Unable to read the selected image."
        )
      )
    }

    reader.readAsDataURL(file)
  })


/* ============================================================
   MAIN COMPONENT
============================================================ */

function CreateGift({
  theme,
  setTheme,
}) {
  const navigate = useNavigate()

  const {
    user,
    loading: authLoading,
  } = useAuth()

  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState(
    createInitialData
  )

  const [saving, setSaving] = useState(false)

  const [saveError, setSaveError] = useState("")

  const totalSteps = 4


  /* ==========================================================
     AUTH PROTECTION
  ========================================================== */

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/creator-login", {
        replace: true,
      })
    }
  }, [
    authLoading,
    user,
    navigate,
  ])


  /* ==========================================================
     RESTORE DRAFT
  ========================================================== */

  useEffect(() => {
    try {
      const savedDraft =
        localStorage.getItem(
          "our-story-draft"
        )

      if (!savedDraft) return

      const parsed = JSON.parse(savedDraft)

      setFormData((previous) => ({
        ...previous,
        ...parsed,

        photos: [],

        heartQuestions:
          Array.isArray(
            parsed.heartQuestions
          )
            ? parsed.heartQuestions
            : previous.heartQuestions,

        customQuestions:
          Array.isArray(
            parsed.customQuestions
          )
            ? parsed.customQuestions
            : previous.customQuestions,

        venueEnabled:
          Boolean(parsed.venueEnabled),

        venueName:
          parsed.venueName || "",

        venueAddress:
          parsed.venueAddress || "",

        venueDate:
          parsed.venueDate || "",

        venueMessage:
          parsed.venueMessage || "",

        finalSurpriseTitle:
          parsed.finalSurpriseTitle || "",

        finalSurpriseMessage:
          parsed.finalSurpriseMessage || "",

        musicName:
          parsed.musicName || "",

        musicFile: null,

        privatePasskey: "",

        verificationAnswer: "",
      }))
    } catch (error) {
      console.error(
        "Unable to restore draft:",
        error
      )
    }
  }, [])


  /* ==========================================================
     AUTO SAVE
  ========================================================== */

  useEffect(() => {
    if (!user) return

    try {
      const draft = {
        creatorName: formData.creatorName,
        partnerName: formData.partnerName,
        partnerNickname:
          formData.partnerNickname,
        relationship:
          formData.relationship,

        meetingStory:
          formData.meetingStory,
        meetingPlace:
          formData.meetingPlace,
        firstImpression:
          formData.firstImpression,
        turningPoint:
          formData.turningPoint,

        whatILove:
          formData.whatILove,
        specialThings:
          formData.specialThings,
        thingsThatMakeMeSmile:
          formData.thingsThatMakeMeSmile,
        whatIAdmire:
          formData.whatIAdmire,
        unforgettableThing:
          formData.unforgettableThing,

        favoriteMemory:
          formData.favoriteMemory,
        happiestMoment:
          formData.happiestMoment,
        funnyMoment:
          formData.funnyMoment,
        littleMoment:
          formData.littleMoment,

        insideJokes:
          formData.insideJokes,
        specialPhrase:
          formData.specialPhrase,
        specialSong:
          formData.specialSong,
        specialPlace:
          formData.specialPlace,

        importantDate:
          formData.importantDate,

        whatIWantThemToKnow:
          formData.whatIWantThemToKnow,
        thingsIHaveNeverSaid:
          formData.thingsIHaveNeverSaid,
        personalMessage:
          formData.personalMessage,

        mood:
          formData.mood,

        heartQuestions:
          formData.heartQuestions,

        customQuestions:
          formData.customQuestions,

        venueEnabled:
          formData.venueEnabled,
        venueName:
          formData.venueName,
        venueAddress:
          formData.venueAddress,
        venueDate:
          formData.venueDate,
        venueMessage:
          formData.venueMessage,

        finalSurpriseTitle:
          formData.finalSurpriseTitle,
        finalSurpriseMessage:
          formData.finalSurpriseMessage,

        musicName:
          formData.musicName,

        verificationQuestion:
          formData.verificationQuestion,
      }

      localStorage.setItem(
        "our-story-draft",
        JSON.stringify(draft)
      )
    } catch (error) {
      console.error(
        "Unable to save draft:",
        error
      )
    }
  }, [
    formData,
    user,
  ])


  /* ==========================================================
     FIELD UPDATE
  ========================================================== */

  const updateField = (
    field,
    value
  ) => {
    setSaveError("")

    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }))
  }


  /* ==========================================================
     HEART ANSWER
  ========================================================== */

  const updateHeartAnswer = (
    id,
    answer
  ) => {
    setSaveError("")

    setFormData((previous) => ({
      ...previous,

      heartQuestions:
        previous.heartQuestions.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  answer,
                }
              : item
        ),
    }))
  }


  /* ==========================================================
     CUSTOM QUESTIONS
  ========================================================== */

  const addCustomQuestion = () => {
    setFormData((previous) => ({
      ...previous,

      customQuestions: [
        ...previous.customQuestions,
        {
          id:
            `custom-${crypto.randomUUID()}`,
          question: "",
          answer: "",
        },
      ],
    }))
  }


  const updateCustomQuestion = (
    id,
    field,
    value
  ) => {
    setSaveError("")

    setFormData((previous) => ({
      ...previous,

      customQuestions:
        previous.customQuestions.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  [field]: value,
                }
              : item
        ),
    }))
  }


  const removeCustomQuestion = (
    id
  ) => {
    setFormData((previous) => ({
      ...previous,

      customQuestions:
        previous.customQuestions.filter(
          (item) =>
            item.id !== id
        ),
    }))
  }


  /* ==========================================================
     VALIDATION
  ========================================================== */

  const validateStep = () => {

    if (step === 1) {
      if (!formData.creatorName.trim()) {
        alert(
          "Please enter your name."
        )
        return false
      }

      if (!formData.partnerName.trim()) {
        alert(
          "Please enter your partner's name."
        )
        return false
      }

      if (!formData.relationship.trim()) {
        alert(
          "Please tell us what you are to each other."
        )
        return false
      }
    }


    if (step === 2) {
      if (!formData.meetingStory.trim()) {
        alert(
          "Please tell us how your story began."
        )
        return false
      }
    }


    if (step === 3) {
      if (!formData.whatILove.trim()) {
        alert(
          "Please tell us what you love most about them."
        )
        return false
      }

      if (!formData.specialThings.trim()) {
        alert(
          "Please tell us what makes them special."
        )
        return false
      }
    }


    if (step === 4) {
      const answeredHeart =
        formData.heartQuestions.filter(
          (item) =>
            item.answer.trim()
        )

      const answeredCustom =
        formData.customQuestions.filter(
          (item) =>
            item.question.trim() &&
            item.answer.trim()
        )

      if (
        answeredHeart.length === 0 &&
        answeredCustom.length === 0
      ) {
        alert(
          "Please answer at least one thing from your heart."
        )
        return false
      }

      /* VENUE IS OPTIONAL */
      if (
        formData.venueEnabled &&
        !formData.venueName.trim()
      ) {
        alert(
          "Please add the place name or turn off the optional venue."
        )
        return false
      }

      if (
        !formData.privatePasskey.trim()
      ) {
        alert(
          "Please create a private passkey."
        )
        return false
      }

      if (
        formData.privatePasskey.trim().length < 6
      ) {
        alert(
          "Your passkey should be at least 6 characters."
        )
        return false
      }

      if (
        !formData.verificationQuestion.trim()
      ) {
        alert(
          "Please add a verification question."
        )
        return false
      }

      if (
        !formData.verificationAnswer.trim()
      ) {
        alert(
          "Please add the answer to your verification question."
        )
        return false
      }
    }

    return true
  }


  /* ==========================================================
     NAVIGATION
  ========================================================== */

  const nextStep = () => {
    if (!validateStep()) return

    if (step < totalSteps) {
      setStep(
        (previous) =>
          previous + 1
      )

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }


  const previousStep = () => {
    if (step > 1) {
      setStep(
        (previous) =>
          previous - 1
      )

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }


  /* ==========================================================
     PHOTOS
  ========================================================== */

  const handlePhotos = (
    event
  ) => {
    const files = Array.from(
      event.target.files || []
    )

    const imageFiles =
      files.filter((file) =>
        file.type.startsWith(
          "image/"
        )
      )

    if (!imageFiles.length) {
      event.target.value = ""
      return
    }

    const newPhotos =
      imageFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview:
          URL.createObjectURL(file),
      }))

    setFormData((previous) => ({
      ...previous,

      photos: [
        ...previous.photos,
        ...newPhotos,
      ],
    }))

    event.target.value = ""
  }


  const removePhoto = (
    id
  ) => {
    setFormData((previous) => {
      const target =
        previous.photos.find(
          (photo) =>
            photo.id === id
        )

      if (target?.preview) {
        URL.revokeObjectURL(
          target.preview
        )
      }

      return {
        ...previous,

        photos:
          previous.photos.filter(
            (photo) =>
              photo.id !== id
          ),
      }
    })
  }


  /* ==========================================================
     SUBMIT
  ========================================================== */

  const handleSubmit = async () => {
    if (!validateStep()) return

    if (!user) {
      setSaveError(
        "Your creator session has expired. Please sign in again."
      )
      return
    }

    if (saving) return

    setSaving(true)
    setSaveError("")

    let createdGiftId = null

    const uploadedPaths = []

    let uploadedMusicPath = null

    try {

      /* ------------------------------------------------------
         QUESTIONS
      ------------------------------------------------------ */

      const cleanHeartQuestions =
        formData.heartQuestions
          .filter(
            (item) =>
              item.question.trim() &&
              item.answer.trim()
          )
          .map((item) => ({
            id: item.id,
            question:
              item.question.trim(),
            answer:
              item.answer.trim(),
          }))


      const cleanCustomQuestions =
        formData.customQuestions
          .filter(
            (item) =>
              item.question.trim() &&
              item.answer.trim()
          )
          .map((item) => ({
            id: item.id,
            question:
              item.question.trim(),
            answer:
              item.answer.trim(),
          }))


      /* ------------------------------------------------------
         SECURITY
      ------------------------------------------------------ */

      const giftCode =
        generateGiftCode()

      const privateKeyHash =
        await hashSecret(
          formData.privatePasskey
        )

      const verificationAnswerHash =
        await hashSecret(
          formData.verificationAnswer
        )


      /* ------------------------------------------------------
         STORY DATA
      ------------------------------------------------------ */

      const storyData = {
        creator: {
          name:
            formData.creatorName.trim(),
        },

        partner: {
          name:
            formData.partnerName.trim(),

          nickname:
            formData.partnerNickname.trim(),
        },

        relationship:
          formData.relationship.trim(),


        beginning: {
          howWeMet:
            formData.meetingStory.trim(),

          whereWeMet:
            formData.meetingPlace.trim(),

          firstImpression:
            formData.firstImpression.trim(),

          turningPoint:
            formData.turningPoint.trim(),
        },


        feelings: {
          whatILove:
            formData.whatILove.trim(),

          whatMakesThemSpecial:
            formData.specialThings.trim(),

          thingsThatMakeMeSmile:
            formData.thingsThatMakeMeSmile.trim(),

          whatIAdmire:
            formData.whatIAdmire.trim(),

          unforgettableThing:
            formData.unforgettableThing.trim(),
        },


        memories: {
          favoriteMemory:
            formData.favoriteMemory.trim(),

          happiestMoment:
            formData.happiestMoment.trim(),

          funnyMoment:
            formData.funnyMoment.trim(),

          littleMoment:
            formData.littleMoment.trim(),
        },


        privateWorld: {
          insideJokes:
            formData.insideJokes.trim(),

          specialPhrase:
            formData.specialPhrase.trim(),

          specialSong:
            formData.specialSong.trim(),

          specialPlace:
            formData.specialPlace.trim(),
        },


        importantDate:
          formData.importantDate ||
          null,


        message: {
          whatIWantThemToKnow:
            formData.whatIWantThemToKnow.trim(),

          thingsIHaveNeverSaid:
            formData.thingsIHaveNeverSaid.trim(),

          personalMessage:
            formData.personalMessage.trim(),
        },


        personalMessage:
          formData.personalMessage.trim(),


        heartQuestions:
          cleanHeartQuestions,


        customQuestions:
          cleanCustomQuestions,


        mood:
          formData.mood,


        access: {
          verificationQuestion:
            formData.verificationQuestion.trim(),

          verificationAnswerHash:
            verificationAnswerHash,
        },


        /*
         * IMPORTANT:
         * If venue is disabled, store null.
         * Universe can therefore completely hide
         * the venue section.
         */

        venue:
          formData.venueEnabled &&
          formData.venueName.trim()
            ? {
                enabled: true,

                name:
                  formData.venueName.trim(),

                address:
                  formData.venueAddress.trim(),

                date:
                  formData.venueDate ||
                  null,

                message:
                  formData.venueMessage.trim(),
              }
            : null,


        /*
         * FINAL SURPRISE
         *
         * Empty title + empty message means
         * there is no final surprise.
         */

        finalSurprise:
          formData.finalSurpriseTitle.trim() ||
          formData.finalSurpriseMessage.trim()
            ? {
                title:
                  formData.finalSurpriseTitle.trim(),

                message:
                  formData.finalSurpriseMessage.trim(),
              }
            : null,


        music: {
          name:
            formData.musicName.trim(),

          path: null,
        },


        photos: [],
      }


      /* ------------------------------------------------------
         CREATE DATABASE RECORD
      ------------------------------------------------------ */

      const {
        data: gift,
        error: giftError,
      } = await supabase
        .from("gifts")
        .insert({
          creator_id:
            user.id,

          gift_code:
            giftCode,

          creator_name:
            formData.creatorName.trim(),

          partner_name:
            formData.partnerName.trim(),

          partner_nickname:
            formData.partnerNickname.trim() ||
            null,

          relationship:
            formData.relationship.trim(),

          story_data:
            storyData,

          private_key_hash:
            privateKeyHash,

          security_question:
            formData.verificationQuestion.trim(),

          security_answer_hash:
            verificationAnswerHash,

          published:
            false,
        })
        .select(
          "id, gift_code"
        )
        .single()


      if (giftError) {
        throw giftError
      }


      if (!gift?.id) {
        throw new Error(
          "The gift was created, but no gift ID was returned."
        )
      }


      createdGiftId = gift.id


      /* ------------------------------------------------------
         PHOTO UPLOAD
      ------------------------------------------------------ */

      const photoRecords = []

      for (
        let index = 0;
        index <
        formData.photos.length;
        index++
      ) {
        const photo =
          formData.photos[index]

        if (!photo?.file) continue

        const originalName =
          photo.file.name ||
          `photo-${index + 1}`

        const safeName =
          originalName
            .replace(
              /[^a-zA-Z0-9._-]/g,
              "-"
            )
            .replace(
              /\.[^.]+$/,
              ""
            )
            .slice(
              0,
              60
            )

        const fileName =
          `${String(index + 1).padStart(
            2,
            "0"
          )}-${safeName}-${crypto.randomUUID()}.jpg`

        const storagePath =
          `${user.id}/${gift.id}/${fileName}`

        const imageBlob =
          await preparePhotoForUpload(
            photo.file
          )

        const {
          error: uploadError,
        } = await supabase.storage
          .from(
            "our-story-photos"
          )
          .upload(
            storagePath,
            imageBlob,
            {
              contentType:
                "image/jpeg",

              cacheControl:
                "31536000",

              upsert:
                false,
            }
          )

        if (uploadError) {
          throw uploadError
        }

        uploadedPaths.push(
          storagePath
        )

        photoRecords.push({
          id: photo.id,
          name: originalName,
          path: storagePath,
        })
      }


      /* ------------------------------------------------------
         MUSIC UPLOAD
      ------------------------------------------------------ */

      let musicPath = null

      if (formData.musicFile) {
        const musicFile =
          formData.musicFile

        const maxMusicSize =
          15 * 1024 * 1024

        if (
          musicFile.size >
          maxMusicSize
        ) {
          throw new Error(
            "Please choose a music file smaller than 15 MB."
          )
        }

        if (
          !musicFile.type.startsWith(
            "audio/"
          )
        ) {
          throw new Error(
            "Please choose a valid audio file."
          )
        }

        const safeMusicName =
          (
            musicFile.name ||
            "background-music"
          )
            .replace(
              /[^a-zA-Z0-9._-]/g,
              "-"
            )
            .slice(
              0,
              80
            )

        musicPath =
          `${user.id}/${gift.id}/${crypto.randomUUID()}-${safeMusicName}`

        /*
         * IMPORTANT:
         *
         * The Supabase bucket must exist:
         *
         * our-story-music
         *
         * and it should be PRIVATE with policies
         * restricted to the owning creator.
         */

        const {
          error:
            musicUploadError,
        } = await supabase.storage
          .from(
            "our-story-music"
          )
          .upload(
            musicPath,
            musicFile,
            {
              contentType:
                musicFile.type ||
                "audio/mpeg",

              cacheControl:
                "31536000",

              upsert:
                false,
            }
          )

        if (musicUploadError) {
        throw new Error(
            `Music upload failed: ${musicUploadError.message}`
        )
        }
        uploadedMusicPath =
          musicPath
      }


      /* ------------------------------------------------------
         FINAL STORY DATA
      ------------------------------------------------------ */

      const finalStoryData = {
        ...storyData,

        photos:
          photoRecords,

        music: {
          ...storyData.music,

          name:
            formData.musicName.trim(),

          path:
            musicPath,
        },
      }


      /* ------------------------------------------------------
         UPDATE WITH MEDIA
      ------------------------------------------------------ */

      const {
        error: updateError,
      } = await supabase
        .from("gifts")
        .update({
          story_data:
            finalStoryData,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          gift.id
        )


      if (updateError) {
        throw updateError
      }


      /* ------------------------------------------------------
         CLEAN LOCAL DRAFT
      ------------------------------------------------------ */

      localStorage.removeItem(
        "our-story-data"
      )

      localStorage.removeItem(
        "our-story-draft"
      )

      localStorage.setItem(
        "our-story-generation-status",
        "ready"
      )

      localStorage.setItem(
        "our-story-gift-id",
        gift.id
      )


      /* ------------------------------------------------------
         GO TO GENERATING
      ------------------------------------------------------ */

      navigate(
        "/generating",
        {
          state: {
            giftId:
              gift.id,

            giftCode:
              gift.gift_code,
          },
        }
      )

    } catch (error) {
      console.error(
        "Unable to create gift:",
        error
      )


      /* ------------------------------------------------------
         REMOVE UPLOADED PHOTOS
      ------------------------------------------------------ */

      if (
        uploadedPaths.length
      ) {
        try {
          await supabase.storage
            .from(
              "our-story-photos"
            )
            .remove(
              uploadedPaths
            )
        } catch (
          cleanupError
        ) {
          console.error(
            "Photo cleanup failed:",
            cleanupError
          )
        }
      }


      /* ------------------------------------------------------
         REMOVE MUSIC
      ------------------------------------------------------ */

      if (
        uploadedMusicPath
      ) {
        try {
          await supabase.storage
            .from(
              "our-story-music"
            )
            .remove([
              uploadedMusicPath,
            ])
        } catch (
          cleanupError
        ) {
          console.error(
            "Music cleanup failed:",
            cleanupError
          )
        }
      }


      /* ------------------------------------------------------
         REMOVE DATABASE RECORD
      ------------------------------------------------------ */

      if (createdGiftId) {
        try {
          await supabase
            .from("gifts")
            .delete()
            .eq(
              "id",
              createdGiftId
            )
        } catch (
          cleanupError
        ) {
          console.error(
            "Gift cleanup failed:",
            cleanupError
          )
        }
      }


      setSaveError(
        error?.message ||
        "We couldn't save your experience. Please try again."
      )
    } finally {
      setSaving(false)
    }
  }


  /* ==========================================================
     AUTH LOADING
  ========================================================== */

  if (authLoading) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
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
            Opening your story...
          </p>
        </div>
      </main>
    )
  }


  if (!user) {
    return null
  }


  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <main
      className="
        min-h-screen
        text-theme-primary
      "
    >

      {/* HEADER */}

      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-50
          border-b
          create-border
          bg-surface-soft/90
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
              Creating your experience
            </span>

            <span
              className="
                hidden
                h-1
                w-1
                rounded-full
                bg-theme-muted
                sm:block
              "
            />

            <span
              className="
                text-xs
                text-theme-secondary
              "
            >
              {step} / {totalSteps}
            </span>

            <CreatorAccount />

            <ThemeToggle
              theme={theme}
              setTheme={setTheme}
            />
          </div>
        </div>
      </header>


      {/* PROGRESS */}

      <div
        className="
          fixed
          left-0
          right-0
          top-16
          z-40
          h-px
          bg-surface-soft
        "
      >
        <motion.div
          className="
            h-full
            bg-theme-accent
          "
          animate={{
            width:
              `${(step / totalSteps) * 100}%`,
          }}
          transition={{
            duration: 0.35,
            ease: "easeOut",
          }}
        />
      </div>


      <section
        className="
          px-5
          pb-20
          pt-32
          sm:px-8
        "
      >
        <div
          className="
            mx-auto
            max-w-5xl
          "
        >

          {/* STEP INDICATOR */}

          <div
            className="
              mb-14
              flex
              items-center
              gap-3
            "
          >
            {Array.from({
              length:
                totalSteps,
            }).map(
              (_, index) => {
                const number =
                  index + 1

                const active =
                  number === step

                const completed =
                  number < step

                return (
                  <div
                    key={number}
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <div
                      className={`
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        border
                        text-[10px]

                        ${
                          active
                            ? "border-theme-strong bg-theme-button text-theme-button"
                            : completed
                              ? "border-theme bg-surface-soft text-theme-primary"
                              : "border-theme-soft text-theme-muted"
                        }
                      `}
                    >
                      {number}
                    </div>

                    {number <
                      totalSteps && (
                      <div
                        className={`
                          h-px
                          w-8
                          sm:w-14
                          ${
                            completed
                              ? "bg-theme-accent"
                              : "bg-surface-soft"
                          }
                        `}
                      />
                    )}
                  </div>
                )
              }
            )}
          </div>


          {/* ERROR */}

          {saveError && (
            <div
              className="
                mb-8
                rounded-2xl
                border
                border-theme
                bg-surface-soft
                px-5
                py-4
              "
            >
              <p
                className="
                  text-sm
                  font-medium
                  text-theme-primary
                "
              >
                We couldn't save your experience.
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  leading-6
                  text-theme-secondary
                "
              >
                {saveError}
              </p>
            </div>
          )}


          {/* STEP CONTENT */}

          <AnimatePresence
            mode="wait"
          >
            <motion.div
              key={step}
              initial={{
                opacity: 0,
                x: 18,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -18,
              }}
              transition={{
                duration: 0.28,
              }}
            >

              {step === 1 && (
                <StepOne
                  data={formData}
                  updateField={
                    updateField
                  }
                />
              )}

              {step === 2 && (
                <StepTwo
                  data={formData}
                  updateField={
                    updateField
                  }
                />
              )}

              {step === 3 && (
                <StepThree
                  data={formData}
                  updateField={
                    updateField
                  }
                  photos={
                    formData.photos
                  }
                  handlePhotos={
                    handlePhotos
                  }
                  removePhoto={
                    removePhoto
                  }
                />
              )}

              {step === 4 && (
                <StepFour
                  data={formData}
                  updateField={
                    updateField
                  }
                  updateHeartAnswer={
                    updateHeartAnswer
                  }
                  addCustomQuestion={
                    addCustomQuestion
                  }
                  updateCustomQuestion={
                    updateCustomQuestion
                  }
                  removeCustomQuestion={
                    removeCustomQuestion
                  }
                />
              )}

            </motion.div>
          </AnimatePresence>


          {/* NAVIGATION */}

          <div
            className="
              mt-14
              flex
              items-center
              justify-between
              border-t
              border-theme-soft
              pt-6
            "
          >

            <button
              type="button"
              onClick={
                previousStep
              }
              disabled={
                step === 1 ||
                saving
              }
              className={`
                inline-flex
                items-center
                gap-2
                rounded-full
                px-5
                py-3
                text-sm

                ${
                  step === 1
                    ? "pointer-events-none opacity-0"
                    : "text-theme-muted hover:bg-surface-soft hover:text-theme-primary"
                }
              `}
            >
              <ArrowLeft size={15} />
              Back
            </button>


            {step <
            totalSteps ? (
              <button
                type="button"
                onClick={
                  nextStep
                }
                disabled={
                  saving
                }
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  bg-theme-button
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  text-theme-button
                  transition
                  hover:-translate-y-0.5
                  disabled:opacity-50
                "
              >
                Continue

                <ArrowRight
                  size={16}
                  className="
                    transition-transform
                    group-hover:translate-x-1
                  "
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={
                  handleSubmit
                }
                disabled={
                  saving
                }
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  bg-theme-button
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  text-theme-button
                  transition
                  hover:-translate-y-0.5
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {saving ? (
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

                    Saving your story...
                  </>
                ) : (
                  <>
                    Create my experience

                    <Sparkles
                      size={16}
                      className="
                        transition-transform
                        group-hover:rotate-12
                      "
                    />
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </section>
    </main>
  )
}


/* ============================================================
   STEP 1
============================================================ */

function StepOne({
  data,
  updateField,
}) {
  return (
    <div>
      <StepHeading
        eyebrow="The two of you"
        title="Let's start with the people who make the story."
        description="Tell us who this little universe is for. These details help the experience feel personal from the very first moment."
      />

      <div
        className="
          mt-12
          grid
          gap-5
          md:grid-cols-2
        "
      >
        <InputField
          label="Your name *"
          placeholder="What should we call you?"
          value={
            data.creatorName
          }
          onChange={(value) =>
            updateField(
              "creatorName",
              value
            )
          }
        />

        <InputField
          label="Your partner's name *"
          placeholder="Who is this experience for?"
          value={
            data.partnerName
          }
          onChange={(value) =>
            updateField(
              "partnerName",
              value
            )
          }
        />
      </div>

      <div
        className="
          mt-5
          grid
          gap-5
          md:grid-cols-2
        "
      >
        <InputField
          label="What do you call them?"
          placeholder="A nickname, pet name, or something only you use..."
          value={
            data.partnerNickname
          }
          onChange={(value) =>
            updateField(
              "partnerNickname",
              value
            )
          }
        />

        <InputField
          label="What are you to each other? *"
          placeholder="Girlfriend, boyfriend, wife, husband, partner..."
          value={
            data.relationship
          }
          onChange={(value) =>
            updateField(
              "relationship",
              value
            )
          }
        />
      </div>
    </div>
  )
}


/* ============================================================
   STEP 2
============================================================ */

function StepTwo({
  data,
  updateField,
}) {
  return (
    <div>
      <StepHeading
        eyebrow="How it began"
        title="Every beautiful story has a beginning."
        description="You don't need perfect words. Just tell the story naturally — the way you would tell it to someone who genuinely cares."
      />

      <div
        className="
          mt-12
          space-y-5
        "
      >
        <TextAreaField
          label="How did you first meet? *"
          placeholder="Tell us how your story started..."
          value={
            data.meetingStory
          }
          onChange={(value) =>
            updateField(
              "meetingStory",
              value
            )
          }
        />

        <InputField
          label="Where did you meet?"
          placeholder="University, work, café, online, somewhere unexpected..."
          value={
            data.meetingPlace
          }
          onChange={(value) =>
            updateField(
              "meetingPlace",
              value
            )
          }
        />

        <TextAreaField
          label="What was your first impression of them?"
          placeholder="What did you notice or think when you first met?"
          value={
            data.firstImpression
          }
          onChange={(value) =>
            updateField(
              "firstImpression",
              value
            )
          }
          rows={5}
        />

        <TextAreaField
          label="When did you realize they were becoming important to you?"
          placeholder="Was there a particular moment when something changed?"
          value={
            data.turningPoint
          }
          onChange={(value) =>
            updateField(
              "turningPoint",
              value
            )
          }
          rows={5}
        />
      </div>
    </div>
  )
}


/* ============================================================
   STEP 3
============================================================ */

function StepThree({
  data,
  photos,
  updateField,
  handlePhotos,
  removePhoto,
}) {
  return (
    <div>
      <StepHeading
        eyebrow="What you love"
        title="Tell us what you see in them."
        description="The little details matter most. Tell them what you notice, what you admire, and the moments you never want to forget."
      />

      <div
        className="
          mt-12
          space-y-5
        "
      >

        <TextAreaField
          label="What do you love most about them? *"
          placeholder="Tell us the feeling, quality, or little thing you love most..."
          value={
            data.whatILove
          }
          onChange={(value) =>
            updateField(
              "whatILove",
              value
            )
          }
        />

        <TextAreaField
          label="What makes them special? *"
          placeholder="What makes them different from everyone else?"
          value={
            data.specialThings
          }
          onChange={(value) =>
            updateField(
              "specialThings",
              value
            )
          }
        />

        <TextAreaField
          label="What do they do that always makes you smile?"
          placeholder="A habit, expression, message, joke, gesture..."
          value={
            data.thingsThatMakeMeSmile
          }
          onChange={(value) =>
            updateField(
              "thingsThatMakeMeSmile",
              value
            )
          }
          rows={5}
        />

        <TextAreaField
          label="What do you admire most about them?"
          placeholder="Something about their personality, strength, kindness, ambition..."
          value={
            data.whatIAdmire
          }
          onChange={(value) =>
            updateField(
              "whatIAdmire",
              value
            )
          }
          rows={5}
        />

        <TextAreaField
          label="What's something they've done for you that you'll never forget?"
          placeholder="A moment, sacrifice, support, surprise, or something meaningful..."
          value={
            data.unforgettableThing
          }
          onChange={(value) =>
            updateField(
              "unforgettableThing",
              value
            )
          }
          rows={5}
        />


        {/* MEMORIES */}

        <div
          className="
            mt-10
            rounded-3xl
            border
            border-theme-soft
            bg-surface-soft
            p-6
            sm:p-7
          "
        >
          <div
            className="
              flex
              items-start
              gap-4
            "
          >
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
                border-theme
                bg-surface-hover
                text-theme-secondary
              "
            >
              <Heart
                size={15}
                fill="currentColor"
              />
            </span>

            <div>
              <p
                className="
                  text-sm
                  font-medium
                  text-theme-primary
                "
              >
                The memories that still make you smile.
              </p>

              <p
                className="
                  mt-2
                  text-xs
                  leading-6
                  text-theme-muted
                "
              >
                Add the moments you want your special
                person to rediscover later.
              </p>
            </div>
          </div>

          <div
            className="
              mt-7
              space-y-5
            "
          >
            <TextAreaField
              label="Your favorite memory together"
              placeholder="Tell the story of a moment you wish you could relive..."
              value={
                data.favoriteMemory
              }
              onChange={(value) =>
                updateField(
                  "favoriteMemory",
                  value
                )
              }
              rows={5}
            />

            <TextAreaField
              label="Your happiest moment together"
              placeholder="A day, trip, conversation, celebration..."
              value={
                data.happiestMoment
              }
              onChange={(value) =>
                updateField(
                  "happiestMoment",
                  value
                )
              }
              rows={5}
            />

            <TextAreaField
              label="Your funniest memory"
              placeholder="The moment that still makes both of you laugh..."
              value={
                data.funnyMoment
              }
              onChange={(value) =>
                updateField(
                  "funnyMoment",
                  value
                )
              }
              rows={5}
            />

            <TextAreaField
              label="One little moment you'll never forget"
              placeholder="It doesn't have to be a big event. Sometimes the smallest moments mean the most."
              value={
                data.littleMoment
              }
              onChange={(value) =>
                updateField(
                  "littleMoment",
                  value
                )
              }
              rows={5}
            />
          </div>
        </div>


        {/* PRIVATE WORLD */}

        <div
          className="
            mt-10
            rounded-3xl
            border
            border-theme-soft
            bg-surface-soft
            p-6
            sm:p-7
          "
        >
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.28em]
              text-theme-muted
            "
          >
            Your private world
          </p>

          <h2
            className="
              mt-3
              text-xl
              font-medium
              text-theme-primary
            "
          >
            The little things only you two understand.
          </h2>

          <div
            className="
              mt-7
              grid
              gap-5
              md:grid-cols-2
            "
          >
            <InputField
              label="Inside jokes"
              placeholder="A joke that only makes sense to you two..."
              value={
                data.insideJokes
              }
              onChange={(value) =>
                updateField(
                  "insideJokes",
                  value
                )
              }
            />

            <InputField
              label="Special phrase"
              placeholder="A sentence, word, or expression..."
              value={
                data.specialPhrase
              }
              onChange={(value) =>
                updateField(
                  "specialPhrase",
                  value
                )
              }
            />

            <InputField
              label="Your song title"
              placeholder="The song that belongs to your story..."
              value={
                data.specialSong
              }
              onChange={(value) =>
                updateField(
                  "specialSong",
                  value
                )
              }
            />

            <InputField
              label="Your special place"
              placeholder="Somewhere that means something to both of you..."
              value={
                data.specialPlace
              }
              onChange={(value) =>
                updateField(
                  "specialPlace",
                  value
                )
              }
            />
          </div>
        </div>


        {/* IMPORTANT DATE */}

        <div
          className="
            mt-10
            rounded-3xl
            border
            border-theme-soft
            bg-surface-soft
            p-6
            sm:p-7
          "
        >
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.28em]
              text-theme-muted
            "
          >
            A date that matters
          </p>

          <p
            className="
              mt-3
              text-sm
              text-theme-primary
            "
          >
            Anniversary, first meeting, first date,
            or any day you want the experience to remember.
          </p>

          <input
            type="date"
            value={
              data.importantDate
            }
            onChange={(event) =>
              updateField(
                "importantDate",
                event.target.value
              )
            }
            className="
              create-input
              mt-6
              w-full
              rounded-2xl
              border
              px-4
              py-3
              text-sm
              outline-none
            "
          />
        </div>


        {/* LETTER */}

        <div
          className="
            mt-10
            rounded-3xl
            border
            border-theme-soft
            bg-surface-soft
            p-6
            sm:p-7
          "
        >
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.28em]
              text-theme-muted
            "
          >
            Your words
          </p>

          <h2
            className="
              mt-3
              text-xl
              font-medium
              text-theme-primary
            "
          >
            Things you want them to know.
          </h2>

          <div
            className="
              mt-7
              space-y-5
            "
          >
            <TextAreaField
              label="What do you want them to know?"
              placeholder="Something you wish they could understand about how you feel..."
              value={
                data.whatIWantThemToKnow
              }
              onChange={(value) =>
                updateField(
                  "whatIWantThemToKnow",
                  value
                )
              }
              rows={5}
            />

            <TextAreaField
              label="Something you've never been able to say properly"
              placeholder="Write it exactly the way you want them to read it..."
              value={
                data.thingsIHaveNeverSaid
              }
              onChange={(value) =>
                updateField(
                  "thingsIHaveNeverSaid",
                  value
                )
              }
              rows={5}
            />

            <TextAreaField
              label="A personal message"
              placeholder="Write something from the heart..."
              value={
                data.personalMessage
              }
              onChange={(value) =>
                updateField(
                  "personalMessage",
                  value
                )
              }
              rows={6}
            />
          </div>
        </div>


        {/* PHOTOS */}

        <PhotoUploader
          photos={photos}
          handlePhotos={
            handlePhotos
          }
          removePhoto={
            removePhoto
          }
        />

      </div>
    </div>
  )
}


/* ============================================================
   STEP 4
============================================================ */

function StepFour({
  data,
  updateField,
  updateHeartAnswer,
  addCustomQuestion,
  updateCustomQuestion,
  removeCustomQuestion,
}) {
  const answeredCount =
    data.heartQuestions.filter(
      (item) =>
        item.answer.trim()
    ).length

  return (
    <div>

      <StepHeading
        eyebrow="From your heart"
        title="Now give them the words they should hear from you."
        description="Write these as if your special person were sitting right in front of you. The prompts are designed to help you talk about them, not interview them."
      />


      {/* INTRO */}

      <div
        className="
          mt-10
          rounded-3xl
          border
          border-theme
          bg-surface-soft
          p-6
          sm:p-7
        "
      >
        <div
          className="
            flex
            items-start
            gap-4
          "
        >
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
              border-theme
              bg-surface-hover
              text-theme-secondary
            "
          >
            <Heart
              size={15}
              fill="currentColor"
            />
          </span>

          <div>
            <p
              className="
                text-sm
                font-medium
                text-theme-primary
              "
            >
              Talk to them. Don't write an interview answer.
            </p>

            <p
              className="
                mt-2
                text-xs
                leading-6
                text-theme-muted
              "
            >
              Each prompt is written from your point
              of view. When they read the finished
              experience, it should feel like you are
              speaking directly to them.
            </p>
          </div>
        </div>
      </div>


      {/* HEART QUESTIONS */}

      <div className="mt-12">
        <div
          className="
            flex
            items-end
            justify-between
            gap-4
          "
        >
          <div>
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.28em]
                text-theme-muted
              "
            >
              From me to you
            </p>

            <h2
              className="
                mt-3
                text-xl
                font-medium
                text-theme-primary
              "
            >
              The things I want you to know.
            </h2>
          </div>

          <span
            className="
              whitespace-nowrap
              text-[10px]
              text-theme-muted
            "
          >
            {answeredCount} / 12 answered
          </span>
        </div>


        <div
          className="
            mt-7
            space-y-5
          "
        >
          {data.heartQuestions.map(
            (item, index) => (
              <div
                key={item.id}
                className="
                  rounded-3xl
                  border
                  border-theme-soft
                  bg-surface-soft
                  p-5
                  transition
                  hover:border-theme
                  sm:p-6
                "
              >
                <div
                  className="
                    flex
                    items-start
                    gap-4
                  "
                >
                  <span
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-surface-hover
                      text-[10px]
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

                  <div
                    className="
                      min-w-0
                      flex-1
                    "
                  >
                    <label
                      className="
                        block
                        text-sm
                        font-medium
                        leading-6
                        text-theme-primary
                      "
                    >
                      {item.question}
                    </label>

                    <textarea
                      value={
                        item.answer
                      }
                      onChange={(event) =>
                        updateHeartAnswer(
                          item.id,
                          event.target.value
                        )
                      }
                      placeholder="Write to them in your own words..."
                      rows={4}
                      className="
                        create-input
                        mt-4
                        w-full
                        resize-none
                        rounded-2xl
                        border
                        px-4
                        py-4
                        text-sm
                        leading-7
                        outline-none
                      "
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>


      {/* CUSTOM QUESTIONS */}

      <div
        className="
          mt-16
          border-t
          border-theme-soft
          pt-10
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.28em]
                text-theme-muted
              "
            >
              Make it yours
            </p>

            <h2
              className="
                mt-3
                text-xl
                font-medium
                text-theme-primary
              "
            >
              Add something only you would say.
            </h2>

            <p
              className="
                mt-2
                max-w-xl
                text-xs
                leading-6
                text-theme-muted
              "
            >
              Write a custom thought or message
              directed at them.
            </p>
          </div>

          <button
            type="button"
            onClick={
              addCustomQuestion
            }
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-theme
              bg-surface-soft
              px-5
              py-3
              text-xs
              font-medium
              text-theme-primary
              transition
              hover:border-theme-strong
              hover:bg-surface-hover
            "
          >
            <Sparkles size={13} />
            Add a thought
          </button>
        </div>


        {data.customQuestions.length >
          0 && (
          <div
            className="
              mt-7
              space-y-5
            "
          >
            {data.customQuestions.map(
              (item, index) => (
                <div
                  key={item.id}
                  className="
                    rounded-3xl
                    border
                    border-theme-soft
                    bg-surface-soft
                    p-5
                    sm:p-6
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                    "
                  >
                    <span
                      className="
                        text-[10px]
                        uppercase
                        tracking-[0.2em]
                        text-theme-faint
                      "
                    >
                      Your thought {index + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        removeCustomQuestion(
                          item.id
                        )
                      }
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        text-theme-muted
                        hover:bg-surface-hover
                        hover:text-theme-primary
                      "
                      aria-label="Remove custom thought"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <input
                    value={
                      item.question
                    }
                    onChange={(event) =>
                      updateCustomQuestion(
                        item.id,
                        "question",
                        event.target.value
                      )
                    }
                    placeholder="Example: One thing I hope you always remember about yourself..."
                    className="
                      create-input
                      mt-3
                      w-full
                      rounded-2xl
                      border
                      px-4
                      py-4
                      text-sm
                      font-medium
                      outline-none
                    "
                  />

                  <textarea
                    value={
                      item.answer
                    }
                    onChange={(event) =>
                      updateCustomQuestion(
                        item.id,
                        "answer",
                        event.target.value
                      )
                    }
                    placeholder="Now answer it as if you are talking directly to them..."
                    rows={4}
                    className="
                      create-input
                      mt-4
                      w-full
                      resize-none
                      rounded-2xl
                      border
                      px-4
                      py-4
                      text-sm
                      leading-7
                      outline-none
                    "
                  />
                </div>
              )
            )}
          </div>
        )}
      </div>


      {/* ======================================================
         VENUE — OPTIONAL
         
         IMPORTANT:
         Venue is now AFTER the letter/questions,
         not hidden inside Step 3.
      ====================================================== */}

      <div
        className="
          mt-16
          rounded-3xl
          border
          border-theme-soft
          bg-surface-soft
          p-6
          sm:p-7
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-5
          "
        >
          <div>
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.28em]
                text-theme-muted
              "
            >
              Optional plan
            </p>

            <h2
              className="
                mt-3
                text-xl
                font-medium
                text-theme-primary
              "
            >
              Maybe there is somewhere you want to take them.
            </h2>

            <p
              className="
                mt-2
                max-w-xl
                text-xs
                leading-6
                text-theme-muted
              "
            >
              Turn this on only if you want the
              recipient to discover a place or plan
              after reading your words.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              updateField(
                "venueEnabled",
                !data.venueEnabled
              )
            }
            className={`
              relative
              h-6
              w-11
              shrink-0
              rounded-full
              transition
              ${
                data.venueEnabled
                  ? "bg-theme-button"
                  : "bg-surface-hover"
              }
            `}
            aria-label="Toggle optional venue"
          >
            <span
              className={`
                absolute
                top-1
                h-4
                w-4
                rounded-full
                bg-white
                transition
                ${
                  data.venueEnabled
                    ? "left-6"
                    : "left-1"
                }
              `}
            />
          </button>
        </div>


        {data.venueEnabled && (
          <div
            className="
              mt-7
              space-y-5
            "
          >
            <InputField
              label="Place *"
              placeholder="A café, restaurant, park, city, beach, or somewhere meaningful..."
              value={
                data.venueName
              }
              onChange={(value) =>
                updateField(
                  "venueName",
                  value
                )
              }
            />

            <InputField
              label="Address or location"
              placeholder="Optional address or location details"
              value={
                data.venueAddress
              }
              onChange={(value) =>
                updateField(
                  "venueAddress",
                  value
                )
              }
            />

            <div>
              <label
                className="
                  mb-3
                  block
                  text-xs
                  text-theme-secondary
                "
              >
                Date
              </label>

              <input
                type="date"
                value={
                  data.venueDate
                }
                onChange={(event) =>
                  updateField(
                    "venueDate",
                    event.target.value
                  )
                }
                className="
                  create-input
                  w-full
                  rounded-2xl
                  border
                  px-4
                  py-3
                  text-sm
                  outline-none
                "
              />
            </div>

            <TextAreaField
              label="Why does this place matter?"
              placeholder="Give them a little context so this feels like part of your story..."
              value={
                data.venueMessage
              }
              onChange={(value) =>
                updateField(
                  "venueMessage",
                  value
                )
              }
              rows={4}
            />
          </div>
        )}
      </div>


      {/* ======================================================
         FINAL SURPRISE
      ====================================================== */}

      <div
        className="
          mt-10
          rounded-3xl
          border
          border-theme
          bg-surface-soft
          p-6
          sm:p-7
        "
      >
        <div
          className="
            flex
            items-start
            gap-4
          "
        >
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
              border-theme
              bg-surface-hover
              text-theme-secondary
            "
          >
            <Sparkles size={16} />
          </span>

          <div>
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.28em]
                text-theme-muted
              "
            >
              The final surprise
            </p>

            <h2
              className="
                mt-3
                text-xl
                font-medium
                text-theme-primary
              "
            >
              Give them one last thing to discover.
            </h2>

            <p
              className="
                mt-2
                max-w-xl
                text-xs
                leading-6
                text-theme-muted
              "
            >
              Optional. If you leave both fields
              empty, this section will not appear
              in their experience.
            </p>
          </div>
        </div>


        <div
          className="
            mt-7
            space-y-5
          "
        >
          <InputField
            label="Surprise title"
            placeholder="Something I saved just for you..."
            value={
              data.finalSurpriseTitle
            }
            onChange={(value) =>
              updateField(
                "finalSurpriseTitle",
                value
              )
            }
          />

          <TextAreaField
            label="Final message"
            placeholder="End the experience with something only you would say..."
            value={
              data.finalSurpriseMessage
            }
            onChange={(value) =>
              updateField(
                "finalSurpriseMessage",
                value
              )
            }
            rows={6}
          />
        </div>
      </div>


      {/* ======================================================
         MUSIC
      ====================================================== */}

      <div
        className="
          mt-8
          rounded-3xl
          border
          border-theme-soft
          bg-surface-soft
          p-6
          sm:p-7
        "
      >
        <div
          className="
            flex
            items-start
            gap-4
          "
        >
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
              border-theme
              bg-surface-hover
              text-theme-secondary
            "
          >
            ♫
          </span>

          <div>
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.28em]
                text-theme-muted
              "
            >
              The soundtrack
            </p>

            <h2
              className="
                mt-3
                text-xl
                font-medium
                text-theme-primary
              "
            >
              Choose the song that belongs to this story.
            </h2>

            <p
              className="
                mt-2
                max-w-xl
                text-xs
                leading-6
                text-theme-muted
              "
            >
              Optional. The song will play lightly
              in the recipient experience after
              authentication.
            </p>
          </div>
        </div>


        <label
          className="
            mt-7
            flex
            cursor-pointer
            items-center
            justify-between
            gap-4
            rounded-2xl
            border
            border-theme-soft
            bg-surface-hover
            px-5
            py-4
            transition
            hover:border-theme
          "
        >
          <div className="min-w-0">
            <p
              className="
                truncate
                text-sm
                font-medium
                text-theme-primary
              "
            >
              {data.musicName ||
                "Choose a background audio file"}
            </p>

            <p
              className="
                mt-1
                text-xs
                text-theme-muted
              "
            >
              MP3, WAV, OGG or M4A — maximum 15 MB
            </p>
          </div>

          <span
            className="
              shrink-0
              rounded-full
              border
              border-theme
              px-4
              py-2
              text-[10px]
              uppercase
              tracking-[0.18em]
              text-theme-secondary
            "
          >
            Choose song
          </span>

          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(event) => {
              const file =
                event.target.files?.[0]

              if (!file) return

              if (
                !file.type.startsWith(
                  "audio/"
                )
              ) {
                alert(
                  "Please choose an audio file."
                )

                event.target.value = ""
                return
              }

              if (
                file.size >
                15 * 1024 * 1024
              ) {
                alert(
                  "Please choose a music file smaller than 15 MB."
                )

                event.target.value = ""
                return
              }

              updateField(
                "musicFile",
                file
              )

              updateField(
                "musicName",
                file.name
              )

              event.target.value = ""
            }}
          />
        </label>
      </div>


      {/* ======================================================
         PRIVATE ACCESS
      ====================================================== */}

      <div
        className="
          mt-16
          rounded-3xl
          border
          border-theme
          bg-surface-soft
          p-6
          sm:p-7
        "
      >
        <div
          className="
            flex
            items-start
            gap-4
          "
        >
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
              border-theme
              bg-surface-hover
              text-theme-secondary
            "
          >
            <Heart
              size={15}
              fill="currentColor"
            />
          </span>

          <div>
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.28em]
                text-theme-muted
              "
            >
              Private access
            </p>

            <h2
              className="
                mt-3
                text-xl
                font-medium
                text-theme-primary
              "
            >
              Keep this little universe private.
            </h2>

            <p
              className="
                mt-2
                max-w-xl
                text-xs
                leading-6
                text-theme-muted
              "
            >
              Create a private passkey and a personal
              verification question. Your special person
              will use these later to unlock the experience.
            </p>
          </div>
        </div>


        <div
          className="
            mt-7
            space-y-5
          "
        >
          <InputField
            type="password"
            label="Private passkey *"
            placeholder="Create a secret passkey — at least 6 characters"
            value={
              data.privatePasskey
            }
            onChange={(value) =>
              updateField(
                "privatePasskey",
                value
              )
            }
          />

          <InputField
            label="Verification question *"
            placeholder="Ask something personal that your special person can answer..."
            value={
              data.verificationQuestion
            }
            onChange={(value) =>
              updateField(
                "verificationQuestion",
                value
              )
            }
          />

          <InputField
            type="password"
            label="Verification answer *"
            placeholder="The answer only the two of you should know..."
            value={
              data.verificationAnswer
            }
            onChange={(value) =>
              updateField(
                "verificationAnswer",
                value
              )
            }
          />

          <div
            className="
              rounded-2xl
              border
              border-theme-soft
              bg-surface-hover
              px-4
              py-3
            "
          >
            <p
              className="
                text-[11px]
                leading-5
                text-theme-muted
              "
            >
              Your passkey and verification answer
              are never stored in plain text. Only
              cryptographic hashes are saved.
            </p>
          </div>
        </div>
      </div>


      {/* CLOSING MESSAGE */}

      <div
        className="
          mt-10
          rounded-3xl
          border
          border-theme-soft
          bg-surface-soft
          p-6
          sm:p-7
        "
      >
        <div
          className="
            flex
            items-start
            gap-4
          "
        >
          <Heart
            size={17}
            className="
              mt-1
              text-theme-secondary
            "
            fill="currentColor"
          />

          <div>
            <p
              className="
                text-sm
                font-medium
                text-theme-primary
              "
            >
              One last thing.
            </p>

            <p
              className="
                mt-2
                text-xs
                leading-6
                text-theme-muted
              "
            >
              When they open this, it should feel less
              like a questionnaire and more like finding
              a private letter that you built especially
              for them.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}


/* ============================================================
   PHOTO UPLOADER
============================================================ */

function PhotoUploader({
  photos,
  handlePhotos,
  removePhoto,
}) {
  return (
    <div
      className="
        mt-10
        rounded-3xl
        border
        border-theme-soft
        bg-surface-soft
        p-6
        sm:p-7
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
          <span
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
            <Camera
              size={16}
              className="text-theme-muted"
            />
          </span>

          <div>
            <h3
              className="
                text-sm
                font-medium
                text-theme-primary
              "
            >
              Your photographs
            </h3>

            <p
              className="
                mt-1
                text-xs
                text-theme-muted
              "
            >
              Add a few moments worth remembering.
            </p>
          </div>
        </div>

        <span
          className="
            text-[10px]
            text-theme-muted
          "
        >
          {photos.length} added
        </span>
      </div>


      <label
        className="
          mt-6
          flex
          min-h-[180px]
          cursor-pointer
          flex-col
          items-center
          justify-center
          rounded-2xl
          border
          border-dashed
          create-border
          bg-surface-soft
          px-6
          text-center
          transition
          hover:bg-surface-hover
        "
      >
        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            border
            create-border
            bg-surface-soft
          "
        >
          <ImagePlus
            size={18}
            className="text-theme-muted"
          />
        </div>

        <p
          className="
            mt-5
            text-sm
            font-medium
            text-theme-primary
          "
        >
          Add your photographs
        </p>

        <p
          className="
            mt-2
            max-w-sm
            text-xs
            leading-5
            text-theme-muted
          "
        >
          Choose one or more images from your device.
          They will be stored privately with your experience.
        </p>

        <span
          className="
            mt-4
            rounded-full
            border
            border-theme
            px-4
            py-2
            text-[10px]
            uppercase
            tracking-[0.18em]
            text-theme-secondary
          "
        >
          Choose photos
        </span>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={
            handlePhotos
          }
          className="hidden"
        />
      </label>


      {photos.length > 0 && (
        <div
          className="
            mt-6
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-3
            md:grid-cols-4
          "
        >
          {photos.map(
            (photo) => (
              <div
                key={photo.id}
                className="
                  group
                  relative
                  aspect-square
                  overflow-hidden
                  rounded-2xl
                  border
                  border-theme-soft
                  bg-surface-soft
                "
              >
                <img
                  src={
                    photo.preview
                  }
                  alt=""
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    removePhoto(
                      photo.id
                    )
                  }
                  className="
                    absolute
                    right-2
                    top-2
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    bg-black/60
                    text-white
                    transition
                    sm:opacity-0
                    sm:group-hover:opacity-100
                  "
                  aria-label="Remove photo"
                >
                  <X size={13} />
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}


/* ============================================================
   STEP HEADING
============================================================ */

function StepHeading({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="max-w-3xl">
      <p
        className="
          text-[10px]
          uppercase
          tracking-[0.32em]
          text-theme-muted
        "
      >
        {eyebrow}
      </p>

      <h1
        className="
          mt-5
          text-[clamp(2.5rem,5vw,5rem)]
          font-medium
          leading-[0.98]
          tracking-[-0.055em]
          text-theme-primary
        "
      >
        {title}
      </h1>

      <p
        className="
          mt-6
          max-w-2xl
          text-sm
          leading-7
          text-theme-muted
          sm:text-base
        "
      >
        {description}
      </p>
    </div>
  )
}


/* ============================================================
   INPUT
============================================================ */

function InputField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div>
      <label
        className="
          mb-3
          block
          text-xs
          text-theme-secondary
        "
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={
          placeholder
        }
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
    </div>
  )
}


/* ============================================================
   TEXTAREA
============================================================ */

function TextAreaField({
  label,
  placeholder,
  value,
  onChange,
  rows = 6,
}) {
  return (
    <div>
      <label
        className="
          mb-3
          block
          text-xs
          text-theme-secondary
        "
      >
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={
          placeholder
        }
        rows={rows}
        className="
          create-input
          w-full
          resize-none
          rounded-3xl
          border
          px-5
          py-4
          text-sm
          leading-7
          outline-none
          transition
        "
      />
    </div>
  )
}


export default CreateGift