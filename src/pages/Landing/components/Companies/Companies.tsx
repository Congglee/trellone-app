import { useColorScheme } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import { useEffect, useState } from 'react'

const lightModeLogos = [
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KAZNAhvIPRvP1kJeo5WtxDd6gsIVYzjwXHyfMK',
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KASOIpWndZTQ5KAthD84CypuL761YnNJsIleRj',
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KApXO0OG4ach4iVN5xvWGTnEwzKOtRgmfyu7M3',
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KAjFYGXH0B20tDSxerGVLyFZo67lEMvshA1ipn',
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KA0PKRlT3GoH2Wpwz8he9cNlfTgmBusy3LRJiD',
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KAgRP8Hd4jXs2wIWKYVSvG7Ptqm8fg53hCpRTA'
]

const darkModeLogos = [
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KA6jqkc5pxyu8GInpsUPTbA9VQLadzgFMNjv3H',
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KAcCOn1henoQDleYaSW4Ed5jfFwC3b9Zv8AUgm',
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KAchGkgdenoQDleYaSW4Ed5jfFwC3b9Zv8AUgm',
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KAEoTIh0wkKTGRcI7a4lQPHgx6pu23OzUvD1NW',
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KAy8rnMa7cSDweR1k8p4jOfn7W6IsK5rUNGuZi',
  'https://35z23d3vth.ufs.sh/f/S5pa1AZTQ5KAUUsx5IdUZohctfVvlu70X4mRGxDHbg6PrCIi'
]

export default function Companies() {
  const { mode, systemMode } = useColorScheme()

  const [logos, setLogos] = useState<string[]>([])

  useEffect(() => {
    if (mode === 'system') {
      if (systemMode === 'light') {
        setLogos(lightModeLogos)
      } else {
        setLogos(darkModeLogos)
      }
    } else if (mode === 'light') {
      setLogos(lightModeLogos)
    } else {
      setLogos(darkModeLogos)
    }
  }, [mode, systemMode])

  return (
    <Box component='section' sx={{ py: 4 }}>
      <Typography variant='subtitle2' component='p' align='center' sx={{ color: 'text.secondary' }}>
        Trusted by our newest creators
      </Typography>

      <Grid container sx={{ mt: 0.5, opacity: 0.6, justifyContent: 'center' }}>
        {logos.map((logo, index) => (
          <Grid key={index}>
            <img
              src={logo}
              alt={`${index + 1} company logo`}
              style={{ width: '100px', height: '80px', margin: '0 32px', opacity: 0.7 }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
