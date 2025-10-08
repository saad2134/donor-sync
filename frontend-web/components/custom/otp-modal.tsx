// modal.tsx
"use client"

import React from "react"
import { createRoot } from "react-dom/client"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

let modalContainer: HTMLElement | null = null
let modalRoot: ReturnType<typeof createRoot> | null = null

interface ModalProps {
  children?: React.ReactNode
}

// Default OTP content component with countdown, wrong email link, and resend functionality.
const DefaultOTPContent: React.FC = () => {
  const [countdown, setCountdown] = React.useState(60)

  React.useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handleResend = () => {
    // Place your OTP resend logic here, if needed.
    setCountdown(60)
  }

  return (
    <div className="p-2 text-center ">
      <h2 className="text-xl font-bold mb-2">OTP Sent</h2>
      <p>Please check your email for the OTP.</p>

      <div className="pt-4 flex justify-center ">
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} className="bg-bg border border-foreground/30 text-foreground" />
            <InputOTPSlot index={1} className="bg-bg border border-foreground/30 text-foreground" />
            <InputOTPSlot index={2} className="bg-bg border border-foreground/30 text-foreground" />
          </InputOTPGroup>
          <span className="text-foreground/50">•</span>
          <InputOTPGroup>
            <InputOTPSlot index={3} className="bg-bg border border-foreground/30 text-foreground" />
            <InputOTPSlot index={4} className="bg-bg border border-foreground/30 text-foreground" />
            <InputOTPSlot index={5} className="bg-bg border border-foreground/30 text-foreground" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="mt-4">
        <button
          onClick={hideModal}
          className="text-accent hover:underline text-sm"
        >
          Wrong email? Go back
        </button>
      </div>

      <div className="mt-2 text-sm text-foreground">
        Didn't receive OTP?{" "}
        {countdown > 0 ? (
          <span>Resend in {countdown} seconds</span>
        ) : (
          <button
            onClick={handleResend}
            className="text-accent hover:underline"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  )
}

// The Modal component renders a full-screen overlay with a blurred background.
// If no children are provided, the default OTP content is shown.
const Modal: React.FC<ModalProps> = ({ children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm ">
      <div className="bg-background p-8 rounded-lg shadow-lg border border-foreground/30">
        {children || <DefaultOTPContent />}
      </div>
    </div>
  )
}

/**
 * Creates and mounts the modal.
 * @param content - The React node to render inside the modal.
 */
export function showModal(content?: React.ReactNode) {
  // Remove an existing modal if needed.
  if (modalContainer) {
    hideModal()
  }
  modalContainer = document.createElement("div")
  document.body.appendChild(modalContainer)
  modalRoot = createRoot(modalContainer)
  modalRoot.render(<Modal>{content}</Modal>)
}

/**
 * Unmounts and removes the modal.
 */
export function hideModal() {
    if (modalRoot && modalContainer) {
      modalRoot.unmount();
      modalContainer.remove(); // Removes the container from the DOM.
      modalContainer = null;
      modalRoot = null;
    }
  }
