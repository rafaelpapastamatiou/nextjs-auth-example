import { AppProps } from "next/dist/next-server/lib/router/router";
import { AuthProvider } from "../contexts/AuthContext";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp;