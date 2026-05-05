import { createContext, useContext, useState } from 'react'

const AuthContext = createContext<any>(undefined)

export const AuthProvider = ({ children }: any) => {
  const [session, setSession] = useState(null)
  
  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)