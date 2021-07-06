import { useAuth } from "../contexts/AuthContext"
import { withSSRAuth } from "../utils/withSRRAuth"

export default function Dashboard(): JSX.Element {
  const { user, signOut } = useAuth() 

  return (
    <>
      <h1>Dashboard {user && user.email}</h1>

      <button onClick={signOut}>Sign Out</button>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (_ctx) => {
  return {
    props: {}
  }
})