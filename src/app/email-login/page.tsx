"use client"

import { useState } from "react"

export default function EmailLogin() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">

      {/* LOGIN BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-pink-500 to-purple-600"
      >
        Open Login
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">

          <div className="bg-black border border-white/20 rounded-xl p-8 w-[90%] max-w-md shadow-lg">

            {/* CLOSE */}
            <div className="flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="text-white text-xl"
              >
                ×
              </button>
            </div>

            {/* TITLE */}
            <h2 className="text-white text-2xl font-semibold text-center">
              Email Login
            </h2>

            <p className="text-white/60 text-center text-sm mt-2">
              Enter your email to continue
            </p>

            {/* INPUT */}
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-6 px-4 py-3 rounded-lg bg-black border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-pink-500"
            />

            {/* BUTTON */}
            <button className="w-full mt-5 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-pink-500 to-purple-600">
              Continue
            </button>

          </div>

        </div>
      )}
    </div>
  )
}