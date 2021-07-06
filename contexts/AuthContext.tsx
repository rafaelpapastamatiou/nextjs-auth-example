import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { setCookie, destroyCookie } from 'nookies'
import Router, { useRouter } from 'next/router'

import { api } from "../services/apiClient";

type User = {
  email: string;
  permissions: string[];
  roles: string[];
}

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  user: User;
}

type AuthProviderProps = {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData)

let authChannel: BroadcastChannel;

export function signOut() {
  destroyCookie(undefined, '@nextauth.token')
  destroyCookie(undefined, '@nextauth.refreshToken')

  authChannel.postMessage('signOut')

  Router.push('/')
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()

  const [user, setUser] = useState<User>()
  const isAuthenticated = !!user;
  
  async function getUserProfile(){
    try {
      const response = await api.get('/me')
      
      const { email, permissions, roles } = response.data

      setUser(({ email, permissions, roles }))
    }
    catch(err){
      signOut();
    }
  }

  useEffect(() => {
    authChannel = new BroadcastChannel('auth');

    authChannel.onmessage = (message) => {
      switch(message.data){
        case 'signOut':
          signOut();
          break;
        default:
          break;
      }
    }
  }, [])

  useEffect(() => {
    getUserProfile()
  }, [])

  async function signIn({ email, password }: SignInCredentials) {
    try{
      const response = await api.post('/sessions', {
        email, password
      })

      const { permissions, roles, token, refreshToken } = response.data

      setCookie(undefined, '@nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })

      setCookie(undefined, '@nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })

      setUser({
        email,
        permissions, 
        roles 
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`

      router.push('/dashboard')
    }
    catch(err){
      console.log(err)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, user, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);