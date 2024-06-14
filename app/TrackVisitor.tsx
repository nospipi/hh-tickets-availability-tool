"use client"
import { useEffect } from "react"

function TrackVisitor() {
  useEffect(() => {
    const logVisitorDetails = async () => {
      try {
        const response = await fetch("/server/api/visitor-details")
        const data = await response.json()
        console.log("Visitor Data:", data)
      } catch (error) {
        console.error("Error logging visitor details:", error)
      }
    }

    logVisitorDetails()
  }, [])

  return null
}

export default TrackVisitor
