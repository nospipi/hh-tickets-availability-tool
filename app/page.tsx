"use client"

import styled from "styled-components"
import NavBar from "./navbar/Navbar"
import TrackVisitor from "./TrackVisitor"
import Container from "./container/Container"

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
  return (
    <Main>
      <TrackVisitor />
      <NavBar />
      <Container />
    </Main>
  )
}

export default Home
