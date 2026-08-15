import {
  LogOut,
  UserRound,
} from "lucide-react"

import { useNavigate } from "react-router-dom"

import { useAuth } from "../context/AuthContext"


function CreatorAccount() {

  const navigate = useNavigate()

  const {
    user,
    signOut,
  } = useAuth()


  if (!user) {
    return null
  }


  const handleLogout = async () => {

    try {

      await signOut()

      navigate(
        "/",
        {
          replace: true,
        }
      )

    } catch (error) {

      console.error(
        "Logout failed:",
        error
      )

    }

  }


  return (

    <div
      className="
        flex
        items-center
        gap-2
      "
    >

      <div
        className="
          hidden
          items-center
          gap-2
          rounded-full
          border
          border-theme
          bg-surface-soft
          px-3
          py-2
          sm:flex
        "
      >

        <UserRound
          size={13}
          className="text-theme-secondary"
        />

        <span
          className="
            max-w-[160px]
            truncate
            text-[10px]
            text-theme-muted
          "
        >
          {user.email}
        </span>

      </div>


      <button
        type="button"
        onClick={handleLogout}
        className="
          flex
          items-center
          gap-2
          rounded-full
          border
          border-theme
          bg-surface-soft
          px-3
          py-2
          text-[10px]
          font-medium
          text-theme-secondary
          transition-all
          duration-300
          hover:border-theme-strong
          hover:bg-surface-hover
          hover:text-theme-primary
        "
      >

        <LogOut size={13} />

        <span className="hidden sm:inline">
          Log out
        </span>

      </button>

    </div>

  )

}


export default CreatorAccount