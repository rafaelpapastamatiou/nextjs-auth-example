import { FormEvent, useState } from 'react'

import { useAuth } from '../contexts/AuthContext'
import styles from './home.module.scss'
import { withSSRGuest } from '../utils/withSSRGuest'

export const Home = (): JSX.Element => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const {signIn} = useAuth()

  async function handleSubmit(e: FormEvent){
    e.preventDefault();
		
    const data = { 
      email, password 
    };

    await signIn(data)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Entrar</button>
    </form>
  )
}

export const getServerSideProps = withSSRGuest(async (_ctx) => {
  return {
    props: {}
  }
}) 

export default Home
