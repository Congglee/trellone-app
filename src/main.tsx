import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from '~/App'
import '~/index.css'
import ReduxProvider from '~/lib/redux/providers/ReduxProvider'
import theme from '~/theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider>
      <BrowserRouter>
        <CssVarsProvider theme={theme}>
          <GlobalStyles styles={{ a: { textDecoration: 'none' } }} />
          <CssBaseline />
          <App />
        </CssVarsProvider>
      </BrowserRouter>
    </ReduxProvider>
  </StrictMode>
)
