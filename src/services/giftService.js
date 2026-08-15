import { supabase } from "../lib/supabase"
import { generateGiftCode } from "../utils/giftCode"
import { generatePrivateKey } from "../utils/security"
import { hashText } from "../utils/hash"


export async function createGift({
  story,
  securityQuestion,
  securityAnswer,
}) {

  /* ==========================================================
     CHECK CREATOR AUTH
  ========================================================== */

  const {
    data: {
      user,
    },
    error: userError,
  } = await supabase.auth.getUser()


  if (userError) {
    throw userError
  }


  if (!user) {

    throw new Error(
      "You must be signed in to create a gift."
    )

  }


  /* ==========================================================
     GENERATE SECRETS
  ========================================================== */

  const giftCode =
    generateGiftCode()


  const privateKey =
    generatePrivateKey()


  const privateKeyHash =
    await hashText(
      privateKey
    )


  const securityAnswerHash =
    await hashText(
      securityAnswer
    )


  /* ==========================================================
     INSERT GIFT
  ========================================================== */

  const {
    data,
    error,
  } = await supabase
    .from("gifts")
    .insert({

      gift_code:
        giftCode,

      creator_id:
        user.id,

      creator_name:
        story.creator?.name || "",

      partner_name:
        story.partner?.name || "",

      partner_nickname:
        story.partner?.nickname || "",

      relationship:
        story.relationship || "",

      story_data:
        story,

      private_key_hash:
        privateKeyHash,

      security_question:
        securityQuestion,

      security_answer_hash:
        securityAnswerHash,

      published:
        true,

    })
    .select()
    .single()


  if (error) {
    throw error
  }


  return {

    gift: data,

    giftCode,

    privateKey,

  }

}