import { createContext, useContext, useState } from 'react'

const WatchlistContext = createContext<any>(undefined)

export const WatchlistProvider = ({ children }: any) => {
  const [watchlist, setWatchlist] = useState<number[]>([])
  
  return (
    <WatchlistContext.Provider value={{ watchlist, setWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  )
}

export const useWatchlist = () => useContext(WatchlistContext)