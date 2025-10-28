import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined'
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined'
import ViewWeekOutlinedIcon from '@mui/icons-material/ViewWeekOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import MuiChip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { styled } from '@mui/material/styles'
import { CSSProperties } from 'react'
import BoardsFeature from '~/assets/landing/boards-feature.png'
import ColumnsFeature from '~/assets/landing/columns-feature.png'
import CardsFeature from '~/assets/landing/cards-feature.png'

const features = [
  {
    icon: <DashboardCustomizeOutlinedIcon />,
    title: 'Boards',
    description:
      'Tackle any project with a single view. Trellone boards are the canvas where you can organize tasks, track progress, and see the big picture at a glance.',
    image: `url(${BoardsFeature})`
  },
  {
    icon: <ViewWeekOutlinedIcon />,
    title: 'Columns',
    description:
      'Build a workflow that fits your team. Create custom stages and move cards from "To Do" to "Done" to track progress visually.',
    image: `url(${ColumnsFeature})`
  },
  {
    icon: <StyleOutlinedIcon />,
    title: 'Cards',
    description:
      'Cards hold all the details to get work done. Add descriptions, checklists, due dates, and attachments to keep tasks clear and actionable.',
    image: `url(${CardsFeature})`
  }
]

interface ChipProps {
  selected?: boolean
}

const Chip = styled(MuiChip)<ChipProps>(({ theme }) => ({
  variants: [
    {
      props: ({ selected }) => !!selected,
      style: {
        background: 'linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))',
        color: 'hsl(0, 0%, 100%)',
        borderColor: theme.palette.primary.light,
        '& .MuiChip-label': {
          color: 'hsl(0, 0%, 100%)'
        },
        ...theme.applyStyles('dark', {
          borderColor: theme.palette.primary.dark
        })
      }
    }
  ]
}))

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0)

  const handleItemClick = (index: number) => {
    setSelectedItemIndex(index)
  }

  const selectedFeature = features[selectedItemIndex]

  return (
    <Box id='features' component='section' sx={{ py: { xs: 8, sm: 16 } }}>
      <Container maxWidth='lg'>
        <Box sx={{ width: { sm: '100%', md: '60%' } }}>
          <Typography variant='h4' component='h2' gutterBottom sx={{ color: 'text.primary' }}>
            Product features
          </Typography>
          <Typography variant='body1' sx={{ color: 'text.secondary', mb: { xs: 2, sm: 4 } }}>
            Visual kanban boards, flexible workflows, and detailed cards help teams organize work, collaborate in
            real-time, and deliver results faster.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row-reverse' }, gap: 2 }}>
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                flexDirection: 'column',
                gap: 2,
                height: '100%'
              }}
            >
              {features.map((feature, index) => {
                return (
                  <Box
                    key={index}
                    component={Button}
                    onClick={() => handleItemClick(index)}
                    sx={[
                      (theme) => ({
                        p: 2,
                        height: '100%',
                        width: '100%',
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover
                        }
                      }),
                      selectedItemIndex === index && {
                        backgroundColor: 'action.selected'
                      }
                    ]}
                  >
                    <Box
                      sx={[
                        {
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'left',
                          gap: 1,
                          textAlign: 'left',
                          textTransform: 'none',
                          color: 'text.secondary'
                        },
                        selectedItemIndex === index && {
                          color: 'text.primary'
                        }
                      ]}
                    >
                      {feature.icon}
                      <Typography variant='h6'>{feature.title}</Typography>
                      <Typography variant='body2'>{feature.description}</Typography>
                    </Box>
                  </Box>
                )
              })}
            </Box>

            <Box
              sx={{
                display: { xs: 'flex', sm: 'none' },
                flexDirection: 'column',
                gap: 2
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, overflow: 'auto' }}>
                {features.map((feature, index) => (
                  <Chip
                    size='medium'
                    key={index}
                    label={feature.title}
                    onClick={() => handleItemClick(index)}
                    selected={selectedItemIndex === index}
                  />
                ))}
              </Box>
              <Card variant='outlined'>
                <Box
                  sx={(theme) => ({
                    mb: 2,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top center',
                    backgroundRepeat: 'no-repeat',
                    minHeight: 250,
                    backgroundImage: 'var(--items-image)',
                    ...theme.applyStyles('dark', {
                      backgroundImage: 'var(--items-image)'
                    })
                  })}
                  style={
                    features[selectedItemIndex]
                      ? ({
                          '--items-image': features[selectedItemIndex].image
                        } as CSSProperties)
                      : {}
                  }
                />
                <Box sx={{ px: 2, pb: 2 }}>
                  <Typography gutterBottom sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                    {selectedFeature.title}
                  </Typography>
                  <Typography variant='body2' sx={{ color: 'text.secondary', mb: 1.5 }}>
                    {selectedFeature.description}
                  </Typography>
                </Box>
              </Card>
            </Box>
          </Box>

          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              width: { xs: '100%', md: '50%' },
              height: 'var(--items-image-height)'
            }}
          >
            <Card
              variant='outlined'
              sx={{
                height: '100%',
                width: '100%',
                display: { xs: 'none', sm: 'flex' },
                pointerEvents: 'none'
              }}
            >
              <Box
                sx={(theme) => ({
                  m: 'auto',
                  width: '100%',
                  height: { xs: 300, sm: 500 },
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  backgroundImage: 'var(--items-image)',
                  ...theme.applyStyles('dark', {
                    backgroundImage: 'var(--items-image)'
                  })
                })}
                style={
                  features[selectedItemIndex]
                    ? ({
                        '--items-image': features[selectedItemIndex].image
                      } as CSSProperties)
                    : {}
                }
              />
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
