"use client"
import { useEffect } from "react"

function TrackVisitor() {
  useEffect(() => {
    const logVisitorDetails = async () => {
      try {
        const response = await fetch("/server/api/visitor-details")

        console.log("Visitor Data:", response)
      } catch (error) {
        console.error("Error logging visitor details:", error)
      }
    }

    logVisitorDetails()
  }, [])

  return null
}

export default TrackVisitor
