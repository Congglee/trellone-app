import Container from '@mui/material/Container'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import NavBar from '~/components/NavBar'
import TabContext from '@mui/lab/TabContext'
import Box from '@mui/material/Box'
import TabList from '@mui/lab/TabList'
import Tab from '@mui/material/Tab'
import PersonIcon from '@mui/icons-material/Person'
import SecurityIcon from '@mui/icons-material/Security'
import path from '~/constants/path'
import TabPanel from '@mui/lab/TabPanel'
import AccountTab from '~/pages/Settings/components/AccountTab'
import SecurityTab from '~/pages/Settings/components/SecurityTab'

const TABS = {
  ACCOUNT: 'account',
  SECURITY: 'security'
}

export default function Settings() {
  const location = useLocation()

  const defaultTab = location.pathname.includes(TABS.SECURITY) ? TABS.SECURITY : TABS.ACCOUNT

  const [activeTab, setActiveTab] = useState(defaultTab)

  const handleChangeTab = (_event: React.SyntheticEvent, selectedTab: string) => {
    setActiveTab(selectedTab)
  }

  return (
    <Container disableGutters maxWidth={false}>
      <NavBar />
      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab}>
            <Tab
              label='Account'
              value={TABS.ACCOUNT}
              icon={<PersonIcon />}
              iconPosition='start'
              component={Link}
              to={path.accountSettings}
            />
            <Tab
              label='Security'
              value={TABS.SECURITY}
              icon={<SecurityIcon />}
              iconPosition='start'
              component={Link}
              to={path.securitySettings}
            />
          </TabList>
        </Box>
        <TabPanel value={TABS.ACCOUNT}>
          <AccountTab />
        </TabPanel>
        <TabPanel value={TABS.SECURITY}>
          <SecurityTab />
        </TabPanel>
      </TabContext>
    </Container>
  )
}
