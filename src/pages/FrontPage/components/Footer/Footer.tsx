import LanguageIcon from '@mui/icons-material/Language'
import { Link as MuiLink } from '@mui/material'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import TrelloIcon from '~/assets/trello.svg?react'
import { footerSections, languages, socialLinks } from '~/constants/front-page'
import path from '~/constants/path'
import { siteConfig } from '~/constants/site'

const FooterLink = styled(MuiLink)(() => ({
  color: '#b3bac5',
  textDecoration: 'none',
  fontSize: '14px',
  lineHeight: '20px',
  transition: 'color 0.2s ease-in-out',
  '&:hover': {
    color: '#ffffff',
    textDecoration: 'none'
  },
  '&:focus': {
    color: '#ffffff',
    outline: '2px solid #0052cc',
    outlineOffset: '2px'
  }
}))

export default function Footer() {
  const [language, setLanguage] = useState('en')

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    setLanguage(event.target.value)
  }

  return (
    <Box
      sx={{
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1a202c' : '#091e42'),
        color: '#ffffff',
        py: 8
      }}
    >
      <Container maxWidth='lg'>
        <Grid container spacing={6}>
          <Grid xs={12} md={3}>
            <MuiLink
              component={NavLink}
              to={path.frontPage}
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '32px',
                gap: '12px'
              }}
            >
              <TrelloIcon
                style={{
                  height: '40px',
                  width: '40px',
                  color: '#0079bf',
                  flexShrink: 0
                }}
              />
              <Typography
                variant='h5'
                sx={{
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '28px',
                  lineHeight: '40px',
                  letterSpacing: '-0.5px'
                }}
              >
                {siteConfig.name}
              </Typography>
            </MuiLink>
          </Grid>

          {footerSections.map((section) => (
            <Grid xs={12} sm={6} md={3} key={section.title}>
              <Typography
                sx={{
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 600,
                  marginBottom: '16px',
                  lineHeight: '24px'
                }}
                variant='h6'
              >
                {section.title}
              </Typography>
              <Stack spacing={2}>
                {section.links.map((link) => (
                  <FooterLink key={link.label} href={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={(theme) => ({
            borderTop: '1px solid #344563',
            marginTop: theme.spacing(6),
            paddingTop: theme.spacing(4),
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(3),
            [theme.breakpoints.up('md')]: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }
          })}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}
          >
            <Stack direction='row' spacing={1} sx={{ alignItems: 'center' }}>
              <LanguageIcon sx={{ color: '#b3bac5', fontSize: '20px' }} />
              <Select
                value={language}
                onChange={handleLanguageChange}
                size='small'
                sx={{
                  color: '#b3bac5',
                  fontSize: '14px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#344563'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#b3bac5'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0052cc'
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#b3bac5'
                  },
                  minWidth: '120px'
                }}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </Stack>

            <Stack direction='row' spacing={3}>
              <FooterLink href='#'>Privacy Policy</FooterLink>
              <FooterLink href='#'>Terms</FooterLink>
              <FooterLink href='#'>Copyright © 2025 {siteConfig.name}</FooterLink>
            </Stack>
          </Stack>

          <Stack
            direction='row'
            spacing={2}
            sx={{
              alignSelf: { xs: 'flex-start', md: 'flex-end' },
              marginTop: { xs: '8px', md: 0 }
            }}
          >
            {socialLinks.map((social) => (
              <IconButton
                key={social.label}
                sx={{
                  color: '#b3bac5',
                  padding: '10px',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    color: '#0079bf',
                    backgroundColor: 'rgba(0, 121, 191, 0.08)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 121, 191, 0.15)'
                  },
                  '&:focus': {
                    color: '#0079bf',
                    outline: '2px solid #0052cc',
                    outlineOffset: '2px'
                  }
                }}
              >
                <social.icon fontSize='medium' />
              </IconButton>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
