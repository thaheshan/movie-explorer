import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext<any>(undefined)

export const ThemeProvider = ({ children }: any) => {
  const [isDark, setIsDark] = useState(false)
  
  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)