import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import { ConfirmProvider } from 'material-ui-confirm'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { PersistGate } from 'redux-persist/integration/react'
import App from '~/App'
import ErrorBoundary from '~/components/ErrorBoundary'
import '~/index.css'
import { injectStore } from '~/lib/http'
import { persistor, store } from '~/lib/redux/store'
import theme from '~/theme'

injectStore(store)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <CssVarsProvider theme={theme}>
            <ConfirmProvider
              defaultOptions={{
                allowClose: false,
                dialogProps: { maxWidth: 'xs' },
                buttonOrder: ['confirm', 'cancel'],
                cancellationButtonProps: { color: 'inherit' },
                confirmationButtonProps: { color: 'secondary', variant: 'outlined' }
              }}
            >
              <GlobalStyles styles={{ a: { textDecoration: 'none' } }} />
              <CssBaseline />
              <ErrorBoundary>
                <App />
                <ToastContainer position='bottom-left' theme='colored' />
              </ErrorBoundary>
            </ConfirmProvider>
          </CssVarsProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
)
