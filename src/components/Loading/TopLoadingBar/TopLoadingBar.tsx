import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'

export default function TopLoadingBar() {
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()

  useEffect(() => {
    let timer: NodeJS.Timeout

    setIsLoading(true)
    setProgress(30) // Start with some progress already

    // Simulate progress
    timer = setTimeout(() => {
      setProgress(70)

      // Complete the progress and hide after a delay
      setTimeout(() => {
        setProgress(100)
        setTimeout(() => {
          setIsLoading(false)
        }, 200) // Small delay to allow animation to complete
      }, 200)
    }, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [location])

  if (!isLoading) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999
      }}
    >
      <LinearProgress variant='determinate' value={progress} sx={{ height: 3 }} />
    </Box>
  )
}
