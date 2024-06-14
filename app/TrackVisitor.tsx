"use client"
import { useEffect } from "react"
import axios from "axios"

function TrackVisitor() {
  useEffect(() => {
    const logVisitorDetails = async () => {
      try {
        const response = await axios.get("/server/api/visitor-details")

        console.log("Visitor Data from CLIENT:", response.data)
      } catch (error) {
        console.error("Error logging visitor details:", error)
      }
    }

    logVisitorDetails()
  }, [])

  return null
}

export default TrackVisitor
