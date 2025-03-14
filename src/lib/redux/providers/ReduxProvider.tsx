import { Provider } from 'react-redux'
import PersistProvider from '~/lib/redux/providers/PersistProvider'
import { store } from '~/lib/redux/store'

export default function ReduxProvider({ children }: { children?: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistProvider>{children}</PersistProvider>
    </Provider>
  )
}
