// add bootstrap css 
import 'bootstrap/dist/css/bootstrap.css'
// add global css
import '../styles/globals.css'

import { UserContextProvider } from '../utils/user-context'

function MyApp({ Component, pageProps }) {
  return (
    <UserContextProvider>
      <Component {...pageProps} />
    </UserContextProvider>
  )
}

export default MyApp
