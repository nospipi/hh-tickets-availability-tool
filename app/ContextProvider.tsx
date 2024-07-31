"use client"

import { createContext, useState, ReactNode } from "react"

export type ZoneDate = {
  placedate: string;
  place: string;
};

type GlobalContextType = {
  zoneDates: ZoneDate[]
  setZoneDates: (value: ZoneDate[]) => void
  triggerRefetch: boolean
  setTriggerRefetch: (value: boolean) => void
}

const GlobalContext = createContext<GlobalContextType>({
  zoneDates: [],
  setZoneDates: () => {},
  triggerRefetch: false,
  setTriggerRefetch: () => {},
})

const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  const [zoneDates, setZoneDates] = useState<ZoneDate[]>([])
  const [triggerRefetch, setTriggerRefetch] = useState(false)

  return (
    <GlobalContext.Provider
      value={{
        zoneDates,
        setZoneDates,
        triggerRefetch,
        setTriggerRefetch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export { GlobalContext, GlobalContextProvider }
