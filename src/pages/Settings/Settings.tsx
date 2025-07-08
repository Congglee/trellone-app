import PersonIcon from '@mui/icons-material/Person'
import SecurityIcon from '@mui/icons-material/Security'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Tab from '@mui/material/Tab'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation } from 'react-router-dom'
import NavBar from '~/components/NavBar'
import path from '~/constants/path'
import AccountTab from '~/pages/Settings/components/AccountTab'
import SecurityTab from '~/pages/Settings/components/SecurityTab'

const SETTINGS_TABS = {
  ACCOUNT: 'account',
  SECURITY: 'security'
}

export default function Settings() {
  const location = useLocation()

  const defaultSettingsTab = location.pathname.includes(SETTINGS_TABS.SECURITY)
    ? SETTINGS_TABS.SECURITY
    : SETTINGS_TABS.ACCOUNT

  const [activeSettingsTab, setActiveSettingsTab] = useState(defaultSettingsTab)

  const handleSettingsTabChange = (_event: React.SyntheticEvent, selectedSettingsTab: string) => {
    setActiveSettingsTab(selectedSettingsTab)
  }

  return (
    <Container disableGutters maxWidth={false}>
      <Helmet>
        <title>Settings | Trellone</title>
        <meta
          name='description'
          content="Organize anything, together. Trellone is a collaboration tool that organizes your projects into boards. In one glance, know what's being worked on, who's working on what, and where something is in a process"
        />
      </Helmet>

      <NavBar />

      <TabContext value={activeSettingsTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleSettingsTabChange}>
            <Tab
              label='Account'
              value={SETTINGS_TABS.ACCOUNT}
              icon={<PersonIcon />}
              iconPosition='start'
              component={Link}
              to={path.accountSettings}
            />
            <Tab
              label='Security'
              value={SETTINGS_TABS.SECURITY}
              icon={<SecurityIcon />}
              iconPosition='start'
              component={Link}
              to={path.securitySettings}
            />
          </TabList>
        </Box>

        <TabPanel value={SETTINGS_TABS.ACCOUNT}>
          <AccountTab />
        </TabPanel>

        <TabPanel value={SETTINGS_TABS.SECURITY}>
          <SecurityTab />
        </TabPanel>
      </TabContext>
    </Container>
  )
}
