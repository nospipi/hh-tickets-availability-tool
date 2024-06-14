"use client"
import { useEffect } from "react"
import axios from "axios"

function TrackVisitor() {
  useEffect(() => {
    const triggerVisitorDetails = async () => {
      try {
        await axios.get("/server/api/visitor-details")
      } catch (error) {
        console.error("Error getting visitor details:", error)
      }
    }
    triggerVisitorDetails()
  }, [])

  return null
}

export default TrackVisitor
