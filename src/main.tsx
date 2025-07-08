import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { enGB } from 'date-fns/locale'
import { ConfirmProvider } from 'material-ui-confirm'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
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
          <HelmetProvider>
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
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                    <App />
                  </LocalizationProvider>
                  <ToastContainer position='bottom-left' theme='colored' />
                </ErrorBoundary>
              </ConfirmProvider>
            </CssVarsProvider>
          </HelmetProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
)
