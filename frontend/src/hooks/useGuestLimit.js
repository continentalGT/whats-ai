import { useState } from 'react'

const LIMIT = 3
const ATTEMPTS_KEY = 'whatsai_attempts'
const SIGNED_UP_KEY = 'whatsai_signed_up'

export function useGuestLimit() {
  const [showModal, setShowModal] = useState(false)
  const [pendingInput, setPendingInput] = useState(null)

  function isSignedUp() {
    return localStorage.getItem(SIGNED_UP_KEY) === 'true'
  }

  function getAttempts() {
    return parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0', 10)
  }

  function attemptsLeft() {
    if (isSignedUp()) return Infinity
    return Math.max(0, LIMIT - getAttempts())
  }

  function requestRun(input, onAllowed) {
    if (isSignedUp()) {
      onAllowed(input)
      return
    }
    const used = getAttempts()
    if (used < LIMIT) {
      localStorage.setItem(ATTEMPTS_KEY, String(used + 1))
      onAllowed(input)
    } else {
      setPendingInput(input)
      setShowModal(true)
    }
  }

  function onSignupSuccess(onAllowed) {
    localStorage.setItem(SIGNED_UP_KEY, 'true')
    setShowModal(false)
    if (pendingInput !== null) onAllowed(pendingInput)
    setPendingInput(null)
  }

  return { showModal, setShowModal, attemptsLeft, requestRun, onSignupSuccess }
}
