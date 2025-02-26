import { blueGrey } from '@mui/material/colors'
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Theme {
    // Add your custom properties here
    trellone: {
      navBarHeight: string
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    // Add your custom properties here
    trellone: {
      navBarHeight: string
    }
  }
}

const NAV_BAR_HEIGHT = '58px'

// A custom theme for this app
const theme = extendTheme({
  trellone: {
    navBarHeight: NAV_BAR_HEIGHT
  },
  colorSchemes: {
    light: {
      palette: {
        text: {
          primary: '#000000'
        },
        secondary: {
          main: blueGrey[900]
        }
      }
    },
    dark: {
      palette: {
        text: {
          primary: '#ffffff'
        },
        secondary: {
          main: blueGrey[50]
        }
      }
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#dcdde1',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'white'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth: '0.5px',
          fontWeight: 600,
          '&:hover': { borderWidth: '0.5px' }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: '0.875rem' }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body1': { fontSize: '0.875rem' }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '& fieldset': { borderWidth: '0.5px !important' },
          '&:hover fieldset': { borderWidth: '1px !important' },
          '&.Mui-focused fieldset': { borderWidth: '1px !important' }
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) =>
          theme.unstable_sx({
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.primary.main
              }
            }
          })
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 30,
          color: 'inherit'
        }
      }
    }
  }
})

export default theme
