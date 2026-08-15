import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import { supabase } from "../lib/supabase"


const AuthContext = createContext(null)


export function AuthProvider({ children }) {

  const [user, setUser] = useState(null)

  const [loading, setLoading] = useState(true)


  useEffect(() => {

    let mounted = true


    const loadSession = async () => {

      const {
        data,
        error,
      } = await supabase.auth.getUser()


      if (!mounted) {
        return
      }


      if (error) {

        console.error(
          "Unable to load creator session:",
          error
        )

        setUser(null)

      } else {

        setUser(
          data?.user || null
        )

      }


      setLoading(false)

    }


    loadSession()


    const {
      data: {
        subscription,
      },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {

        if (!mounted) {
          return
        }


        setUser(
          session?.user || null
        )

        setLoading(false)

      }
    )


    return () => {

      mounted = false

      subscription.unsubscribe()

    }

  }, [])


  const signOut = async () => {

    const {
      error,
    } = await supabase.auth.signOut()


    if (error) {
      throw error
    }

    setUser(null)

  }


  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        signOut,
      }}
    >

      {children}

    </AuthContext.Provider>

  )

}


export function useAuth() {

  const context =
    useContext(AuthContext)


  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    )

  }


  return context

}