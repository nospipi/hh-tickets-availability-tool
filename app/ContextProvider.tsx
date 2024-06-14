"use client"

import { createContext, useState, ReactNode } from "react"

type ZoneDate = {
  placedate: string
  place: string
}

type GlobalContextType = {
  zoneDates: ZoneDate[]
  setZoneDates: (value: ZoneDate[]) => void
  triggerRefetch: boolean
  setTriggerRefetch: (value: boolean) => void
  navBarMenuOpen: boolean
  setNavBarMenuOpen: (value: boolean) => void
}

const GlobalContext = createContext<GlobalContextType>({
  zoneDates: [],
  setZoneDates: () => {},
  triggerRefetch: false,
  setTriggerRefetch: () => {},
  navBarMenuOpen: false,
  setNavBarMenuOpen: () => {},
})

const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
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
      {children}
    </GlobalContext.Provider>
  )
}

export { GlobalContext, GlobalContextProvider }
