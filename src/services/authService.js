import { supabase } from "../lib/supabase"


/* ============================================================
   SIGN UP
============================================================ */

export async function signUpCreator({
  email,
  password,
}) {

  const {
    data,
    error,
  } = await supabase.auth.signUp({
    email: email.trim(),
    password,
  })


  if (error) {
    throw error
  }


  return data
}


/* ============================================================
   SIGN IN
============================================================ */

export async function signInCreator({
  email,
  password,
}) {

  const {
    data,
    error,
  } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })


  if (error) {
    throw error
  }


  return data
}


/* ============================================================
   SIGN OUT
============================================================ */

export async function signOutCreator() {

  const {
    error,
  } = await supabase.auth.signOut()


  if (error) {
    throw error
  }

}


/* ============================================================
   CURRENT USER
============================================================ */

export async function getCurrentCreator() {

  const {
    data,
    error,
  } = await supabase.auth.getUser()


  if (error) {
    return null
  }


  return data?.user || null
}