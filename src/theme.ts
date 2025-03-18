import { blueGrey } from '@mui/material/colors'
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Theme {
    // Add your custom properties here
    trellone: {
      navBarHeight: string
      workspaceDrawerWidth: string
      boardDrawerWidth: string
      boardBarHeight: string
      boardMainHeight: string
      boardContentHeight: string
      columnHeaderHeight: string
      columnFooterHeight: string
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    // Add your custom properties here
    trellone: {
      navBarHeight: string
      workspaceDrawerWidth: string
      boardDrawerWidth: string
      boardBarHeight: string
      boardMainHeight: string
      boardContentHeight: string
      columnHeaderHeight: string
      columnFooterHeight: string
    }
  }
}

const NAV_BAR_HEIGHT = '58px'
const WORKSPACE_DRAWER_WIDTH = '300px'

const BOARD_DRAWER_WIDTH = '300px'
const BOARD_BAR_HEIGHT = '60px'
const BOARD_MAIN_HEIGHT = `calc(100vh - ${BOARD_BAR_HEIGHT})`
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${NAV_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`

const COLUMN_HEADER_HEIGHT = '50px'
const COLUMN_FOOTER_HEIGHT = '56px'

// A custom theme for this app
const theme = extendTheme({
  trellone: {
    navBarHeight: NAV_BAR_HEIGHT,
    workspaceDrawerWidth: WORKSPACE_DRAWER_WIDTH,
    boardDrawerWidth: BOARD_DRAWER_WIDTH,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardMainHeight: BOARD_MAIN_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    columnHeaderHeight: COLUMN_HEADER_HEIGHT,
    columnFooterHeight: COLUMN_FOOTER_HEIGHT
  },
  typography: {
    fontFamily: 'Rubik, sans-serif'
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
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) =>
          theme.unstable_sx({
            backgroundColor: theme.palette.mode === 'dark' ? '' : '#ffffff',
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
            boxShadow: 'none'
          })
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth: '0.5px',
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
