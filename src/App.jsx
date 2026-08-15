import { useEffect, useState } from "react"
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"

import Home from "./pages/Home"
import CreateGift from "./pages/CreateGift"
import CreatorLogin from "./pages/CreatorLogin"
import Generating from "./pages/Generating"
import Universe from "./pages/Universe"
import SpecialPersonAccess from "./pages/SpecialPersonAccess"

import ProtectedCreatorRoute from "./components/ProtectedCreatorRoute"


function App() {

  /* ============================================================
     GLOBAL THEME
  ============================================================ */

  const [theme, setTheme] = useState(() => {

    if (typeof window === "undefined") {
      return "dark"
    }

    return (
      localStorage.getItem(
        "our-story-theme"
      ) || "dark"
    )

  })


  /* ============================================================
     APPLY GLOBAL THEME
  ============================================================ */

  useEffect(() => {

    document.documentElement.setAttribute(
      "data-theme",
      theme
    )

    localStorage.setItem(
      "our-story-theme",
      theme
    )

  }, [theme])


  return (

    <BrowserRouter>

      {/* ======================================================
          GLOBAL CINEMATIC BACKGROUND
      ====================================================== */}

      <div
        className="app-background-layer"
        aria-hidden="true"
      >

        <div className="page-background" />

        <div className="page-grid" />

      </div>


      {/* ======================================================
          APPLICATION
      ====================================================== */}

      <main className="app-content">

        <Routes>

          {/* ==================================================
              LANDING
          ================================================== */}

          <Route
            path="/"
            element={
              <Home
                theme={theme}
                setTheme={setTheme}
              />
            }
          />


          {/* ==================================================
              CREATOR LOGIN
          ================================================== */}

          <Route
            path="/creator-login"
            element={
              <CreatorLogin />
            }
          />


          {/* ==================================================
              CREATE GIFT

              PROTECTED

              Only authenticated creators can enter.
          ================================================== */}

          <Route
            path="/create"
            element={

              <ProtectedCreatorRoute>

                <CreateGift
                  theme={theme}
                  setTheme={setTheme}
                />

              </ProtectedCreatorRoute>

            }
          />


          {/* ==================================================
              GENERATING

              We'll protect this later as well.
          ================================================== */}

          <Route
            path="/generating"
            element={
              <Generating
                theme={theme}
                setTheme={setTheme}
              />
            }
          />


          {/* ==================================================
              SPECIAL PERSON ACCESS
          ================================================== */}

          <Route
            path="/access"
            element={
              <SpecialPersonAccess
                theme={theme}
                setTheme={setTheme}
              />
            }
          />


          {/* ==================================================
              UNIVERSE

              This will become protected by recipient
              authorization later.
          ================================================== */}

          <Route
            path="/universe"
            element={
              <Universe
                theme={theme}
                setTheme={setTheme}
              />
            }
          />

        </Routes>

      </main>

    </BrowserRouter>

  )

}


export default App