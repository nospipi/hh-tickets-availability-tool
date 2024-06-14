"use client"
import styled from "styled-components"
import { useState, createContext } from "react"
import NavBar from "./navbar/Navbar"
import TrackVisitor from "./TrackVisitor"
import Container from "./container/Container"

type ZoneDate = {
  placedate: string
  place: string
}

const GlobalContext = createContext({
  zoneDates: [
    {
      placedate: "",
      place: "",
    },
  ],
  setZoneDates: (value: []) => {},
  triggerRefetch: false,
  setTriggerRefetch: (value: boolean) => {},
  navBarMenuOpen: false,
  setNavBarMenuOpen: (value: boolean) => {},
})

//------------------------------------------------------------------------

const Main = styled.main`
  display: flex;
  flex-direction: column;
  background-color: #dbdbdb;
  height: 100%;
  flex: 1;
  overflow: hidden;

  h5 {
    color: #333;
  }
`

//------------------------------------------------------------------------

const Home = () => {
  const [zoneDates, setZoneDates] = useState<ZoneDate[]>([])
  const [triggerRefetch, setTriggerRefetch] = useState(false)
  const [navBarMenuOpen, setNavBarMenuOpen] = useState(false)

  return (
    <GlobalContext.Provider
      value={{
        zoneDates,
        setZoneDates,
        triggerRefetch,
        setTriggerRefetch,
        navBarMenuOpen,
        setNavBarMenuOpen,
      }}
    >
      <Main>
        <TrackVisitor />
        <NavBar />
        <Container />
      </Main>
    </GlobalContext.Provider>
  )
}

export { GlobalContext }
export default Home
