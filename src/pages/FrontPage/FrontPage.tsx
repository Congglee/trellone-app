import Container from '@mui/material/Container'
import SEO from '~/components/SEO'
import Companies from '~/pages/FrontPage/components/Companies'
import Features from '~/pages/FrontPage/components/Features'
import FrontPageNavBar from '~/pages/FrontPage/components/FrontPageNavBar'
import Hero from '~/pages/FrontPage/components/Hero'
import Productivity from '~/pages/FrontPage/components/Productivity'
import Views from '~/pages/FrontPage/components/Views'
import Workflows from '~/pages/FrontPage/components/Workflows'
import CTA from '~/pages/FrontPage/components/CTA'
import Footer from '~/pages/FrontPage/components/Footer'

export default function FrontPage() {
  return (
    <>
      <SEO />
      <Container disableGutters maxWidth={false}>
        <FrontPageNavBar />
        <Hero />
        <Productivity />
        <Workflows />
        <Views />
        <Features />
        <Companies />
        <CTA />
        <Footer />
      </Container>
    </>
  )
}
