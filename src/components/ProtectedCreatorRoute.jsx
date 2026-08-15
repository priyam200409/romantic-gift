import { Navigate } from "react-router-dom"

import { useAuth } from "../context/AuthContext"


function ProtectedCreatorRoute({
  children,
}) {

  const {
    user,
    loading,
  } = useAuth()


  if (loading) {

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
            Preparing your space...
          </p>

        </div>

      </main>

    )

  }


  if (!user) {

    return (
      <Navigate
        to="/creator-login"
        replace
      />
    )

  }


  return children

}


export default ProtectedCreatorRoute