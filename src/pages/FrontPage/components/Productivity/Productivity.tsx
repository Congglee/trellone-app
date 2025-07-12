import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { useState, useEffect } from 'react'
import { fadeInUp, rotateIn, slideInLeft, slideInRight, slideOutLeft, slideOutRight } from '~/constants/animations'
import { productivityTabs } from '~/constants/front-page'
import { siteConfig } from '~/constants/site'

const ProductivityImage = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '20px',
  boxShadow: theme.palette.mode === 'dark' ? '0 25px 50px rgba(0, 0, 0, 0.5)' : '0 25px 50px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: 'rotateY(0deg) scale(1)',
  opacity: 1,
  transformStyle: 'preserve-3d',
  '&.entering': {
    animation: `${rotateIn} 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards`
  },
  '&.exiting': {
    transform: 'rotateY(90deg) scale(0.8)',
    opacity: 0
  },
  '&:hover': {
    transform: 'rotateY(0deg) scale(1.02) translateZ(20px)',
    boxShadow: theme.palette.mode === 'dark' ? '0 35px 70px rgba(0, 0, 0, 0.6)' : '0 35px 70px rgba(0, 0, 0, 0.2)'
  }
}))

export default function Productivity() {
  const [value, setValue] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [previousValue, setPreviousValue] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)

  const handleTabsChange = (_event: React.SyntheticEvent, newValue: number) => {
    if (newValue === value || isTransitioning) return

    setIsTransitioning(true)
    setPreviousValue(value)

    // Start exit animation
    setTimeout(() => {
      setValue(newValue)
      setAnimationKey((prev) => prev + 1)

      // Start enter animation
      setTimeout(() => {
        setIsTransitioning(false)
      }, 100)
    }, 300)
  }

  // Reset animation classes when component mounts or value changes
  useEffect(() => {
    setAnimationKey((prev) => prev + 1)
  }, [value])

  const getAnimationClass = (index: number) => {
    if (index === value && !isTransitioning) {
      return value > previousValue ? 'slide-enter' : 'slide-enter-reverse'
    }
    if (index === previousValue && isTransitioning) {
      return value > previousValue ? 'slide-exit' : 'slide-exit-reverse'
    }
    return ''
  }

  return (
    <Box
      sx={{
        pt: 8,
        position: 'relative',
        overflow: 'hidden',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, #0f1419 0%, #1a202c 100%)'
            : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
      }}
    >
      <Container maxWidth='lg' sx={{ position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            textAlign: 'center',
            marginBottom: (theme) => theme.spacing(8),
            position: 'relative',
            zIndex: 2
          }}
        >
          <Typography
            variant='overline'
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '2px',
              color: (theme) => (theme.palette.mode === 'dark' ? '#a0aec0' : '#718096'),
              mb: 2,
              marginBottom: 2,
              display: 'block'
            }}
          >
            TRELLONE 101
          </Typography>

          <Typography
            variant='h2'
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 700,
              lineHeight: 1.2,
              color: 'text.primary',
              marginBottom: 3
            }}
          >
            A productivity powerhouse
          </Typography>

          <Typography
            variant='body1'
            sx={{
              fontSize: '18px',
              lineHeight: 1.6,
              color: 'text.secondary',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Simple, powerful, and surprisingly flexible. Boards, columns, and cards are the building blocks of getting
            work done in {siteConfig.name}, giving you a clear view of your entire project.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: (theme) => theme.spacing(6),
            position: 'relative',
            zIndex: 2
          }}
        >
          <Tabs
            sx={(theme) => ({
              background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
              borderRadius: '12px',
              padding: '8px',
              boxShadow:
                theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              border:
                theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
              '& .MuiTabs-indicator': {
                display: 'none'
              }
            })}
            value={value}
            onChange={handleTabsChange}
            aria-label='productivity features tabs'
          >
            {productivityTabs.map((tab, index) => (
              <Tab
                key={tab.label}
                label={tab.label}
                id={`productivity-tab-${index}`}
                aria-controls={`productivity-tabpanel-${index}`}
                disabled={isTransitioning}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '16px',
                  minHeight: '48px',
                  padding: '12px 32px',
                  margin: '0 4px',
                  color: (theme) => (theme.palette.mode === 'dark' ? '#a0a9ba' : '#64748b'),
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    transition: 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                  },
                  '&.Mui-selected': {
                    color: '#ffffff',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                    '&::before': {
                      left: '100%'
                    }
                  },
                  '&:hover': {
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                    '&::before': {
                      left: '100%'
                    }
                  },
                  '&:active': {
                    transform: 'translateY(0px) scale(0.98)'
                  }
                }}
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ width: '100%', position: 'relative', minHeight: '600px' }}>
          {productivityTabs.map((tab, index) => (
            <Box
              key={`${tab.label}-${animationKey}`}
              role='tabpanel'
              className={getAnimationClass(index)}
              sx={{
                display: value === index ? 'block' : 'none',
                position: value === index ? 'relative' : 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                opacity: value === index ? 1 : 0,
                '&.slide-enter': {
                  animation: `${slideInRight} 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards`
                },
                '&.slide-exit': {
                  animation: `${slideOutLeft} 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards`
                },
                '&.slide-enter-reverse': {
                  animation: `${slideInLeft} 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards`
                },
                '&.slide-exit-reverse': {
                  animation: `${slideOutRight} 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards`
                }
              }}
              id={`productivity-tabpanel-${index}`}
              aria-labelledby={`productivity-tab-${index}`}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', lg: 'row' },
                  alignItems: 'center',
                  gap: { xs: 4, lg: 8 }
                }}
              >
                <Box
                  sx={{
                    flex: { lg: '0 0 300px' },
                    textAlign: { xs: 'center', lg: 'left' },
                    order: { xs: 2, lg: 1 }
                  }}
                >
                  <Typography
                    variant='h3'
                    className={value === index ? 'text-enter' : ''}
                    sx={{
                      fontSize: { xs: '1.5rem', sm: '1.75rem' },
                      fontWeight: 600,
                      color: 'primary.main',
                      marginBottom: 2,
                      borderLeft: '4px solid',
                      borderColor: 'primary.main',
                      paddingLeft: 2,
                      '&.text-enter': {
                        animation: `${fadeInUp} 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards`
                      },
                      '&.text-enter-delay-1': {
                        animation: `${fadeInUp} 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards`,
                        opacity: 0
                      },
                      '&.text-enter-delay-2': {
                        animation: `${fadeInUp} 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards`,
                        opacity: 0
                      }
                    }}
                  >
                    {tab.label}
                  </Typography>

                  <Typography
                    variant='body1'
                    className={value === index ? 'text-enter-delay-1' : ''}
                    sx={{
                      fontSize: '16px',
                      lineHeight: 1.6,
                      color: 'text.secondary',
                      '&.text-enter': {
                        animation: `${fadeInUp} 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards`
                      },
                      '&.text-enter-delay-1': {
                        animation: `${fadeInUp} 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards`,
                        opacity: 0
                      },
                      '&.text-enter-delay-2': {
                        animation: `${fadeInUp} 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards`,
                        opacity: 0
                      }
                    }}
                  >
                    {tab.description}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    order: { xs: 1, lg: 2 }
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: '500px',
                      perspective: '1000px'
                    }}
                  >
                    <ProductivityImage
                      key={`${tab.label}-image-${animationKey}`}
                      src={tab.image}
                      alt={`${tab.label} feature illustration`}
                      className={value === index && !isTransitioning ? 'entering' : isTransitioning ? 'exiting' : ''}
                      sx={{
                        maxHeight: '500px',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}
