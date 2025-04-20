import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import path from '~/constants/path'
import { useAppSelector } from '~/lib/redux/hooks'
import NotFound from '~/pages/404/NotFound'
import AccountVerification from '~/pages/Auth/AccountVerification'
import ForgotPassword from '~/pages/Auth/ForgotPassword'
import ForgotPasswordVerification from '~/pages/Auth/ForgotPasswordVerification'
import AuthLayout from '~/pages/Auth/layouts/AuthLayout'
import Login from '~/pages/Auth/Login'
import OAuth from '~/pages/Auth/OAuth'
import Register from '~/pages/Auth/Register'
import ResetPassword from '~/pages/Auth/ResetPassword'
import BoardDetails from '~/pages/Boards/BoardDetails'
import BoardInvitationVerification from '~/pages/Boards/BoardInvitationVerification'
import Settings from '~/pages/Settings'
import BoardsList from '~/pages/Workspaces/BoardsList'
import Home from '~/pages/Workspaces/Home'
import HomeLayout from '~/pages/Workspaces/layouts/HomeLayout'
import { UserType } from '~/schemas/user.schema'

const ProtectedRoute = ({ profile, isAuthenticated }: { profile: UserType | null; isAuthenticated: boolean }) => {
  return profile && isAuthenticated ? <Outlet /> : <Navigate to={path.login} replace={true} />
}

const RejectedRoute = ({ profile, isAuthenticated }: { profile: UserType | null; isAuthenticated: boolean }) => {
  const location = useLocation()

  const isVerificationPath =
    location.pathname === path.accountVerification ||
    location.pathname === path.forgotPasswordVerification ||
    location.pathname === path.boardInvitationVerification

  if (isVerificationPath) {
    return <Outlet />
  }

  return !isAuthenticated && !profile ? <Outlet /> : <Navigate to={path.home} />
}

function App() {
  const { isAuthenticated, profile } = useAppSelector((state) => state.auth)

  return (
    <Routes>
      {/* Redirect Route */}
      <Route path={path.home} element={<Navigate to='/boards/67e4444eb85fdbf3be814557' replace={true} />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} profile={profile} />}>
        {/* Workspaces */}
        <Route path={path.home} element={<HomeLayout />}>
          <Route index element={<Home />} />
          <Route path={path.boardsList} element={<BoardsList />} />
        </Route>

        {/* Board Details */}
        <Route path={path.boardDetails} element={<BoardDetails />} />

        {/* User Settings */}
        <Route path={path.accountSettings} element={<Settings />} />
        <Route path={path.securitySettings} element={<Settings />} />
      </Route>

      {/* Authentication */}
      <Route element={<RejectedRoute isAuthenticated={isAuthenticated} profile={profile} />}>
        <Route element={<AuthLayout />}>
          <Route path={path.login} element={<Login />} />
          <Route path={path.register} element={<Register />} />
          <Route path={path.forgotPassword} element={<ForgotPassword />} />
          <Route path={path.resetPassword} element={<ResetPassword />} />
        </Route>
        <Route path={path.accountVerification} element={<AccountVerification />} />
        <Route path={path.forgotPasswordVerification} element={<ForgotPasswordVerification />} />
        <Route path={path.boardInvitationVerification} element={<BoardInvitationVerification />} />
      </Route>

      {/* OAuth */}
      <Route path={path.oauth} element={<OAuth />} />

      {/* 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
