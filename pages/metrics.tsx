import { withSSRAuth } from "../utils/withSRRAuth"

export default function Metrics(): JSX.Element {

  return (
    <>
      <h1>Metrics</h1>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (_ctx) => {
  return {
    props: {}
  }
}, {
  permissions: ['metrics.list'],
  roles: ['administrator']
})