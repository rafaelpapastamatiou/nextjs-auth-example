import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { parseCookies, destroyCookie } from "nookies"
import decode from 'jwt-decode'

import { InvalidTokenError } from "../errors/InvalidTokenError"
import { validateUserPermissions } from "./validateUserPermissions"

type WithSSRAuthOptions = {
  permissions?: string[];
  roles?: string[];
}

export function withSSRAuth<P>(fn: GetServerSideProps<P>, options?: WithSSRAuthOptions): GetServerSideProps<P> {
  return async(ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx)

    const { '@nextauth.token': token } = cookies
  
    if(!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }

    if(options) {
      const user = decode<{ permissions: string[]; roles: string[]; }>(token)

      const { permissions, roles } = options

      const userHasValidPermissions = validateUserPermissions({
        user, permissions, roles
      })
      
      if(!userHasValidPermissions){
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false
          }
        }
      }
    }
    
    try{
      return await fn(ctx)
    }
    catch(err){
      if(err instanceof InvalidTokenError){
        destroyCookie(ctx, '@nextauth.token')
        destroyCookie(ctx, '@nextauth.refreshToken')
  
        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      }
    }
  }
}