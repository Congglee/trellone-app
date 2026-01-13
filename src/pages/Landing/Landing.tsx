import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import SEO from '~/components/SEO'
import Header from '~/pages/Landing/components/Header'
import Hero from '~/pages/Landing/components/Hero'
import Companies from '~/pages/Landing/components/Companies'
import Features from '~/pages/Landing/components/Features'
import Testimonials from '~/pages/Landing/components/Testimonials'
import Highlights from '~/pages/Landing/components/Highlights'
import Pricing from '~/pages/Landing/components/Pricing'
import FAQ from '~/pages/Landing/components/FAQ'
import Footer from '~/pages/Landing/components/Footer'

export default function Landing() {
  return (
    <>
      <SEO description='Trellone is a modern Trello-style project management app with real-time collaboration, workspaces, and drag-and-drop boards.' />
      <Box component='main'>
        <Header />
        <Hero />
        <Companies />
        <Features />
        <Divider />
        <Testimonials />
        <Divider />
        <Highlights />
        <Divider />
        <Pricing />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </Box>
    </>
  )
}
