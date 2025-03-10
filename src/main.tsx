import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '~/App'
import '~/index.css'
import theme from '~/theme'
import { BrowserRouter } from 'react-router-dom'
import GlobalStyles from '@mui/material/GlobalStyles'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CssVarsProvider theme={theme}>
        <GlobalStyles styles={{ a: { textDecoration: 'none' } }} />
        <CssBaseline />
        <App />
      </CssVarsProvider>
    </BrowserRouter>
  </StrictMode>
)
