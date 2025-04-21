import { lazy, Suspense } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import path from '~/constants/path'
import { useAppSelector } from '~/lib/redux/hooks'
import AccountVerification from '~/pages/Auth/AccountVerification'
import ForgotPasswordVerification from '~/pages/Auth/ForgotPasswordVerification'
import AuthLayout from '~/pages/Auth/layouts/AuthLayout'
import OAuth from '~/pages/Auth/OAuth'
import BoardInvitationVerification from '~/pages/Boards/BoardInvitationVerification'
import HomeLayout from '~/pages/Workspaces/layouts/HomeLayout'
import { UserType } from '~/schemas/user.schema'

const Login = lazy(() => import('~/pages/Auth/Login'))
const Register = lazy(() => import('~/pages/Auth/Register'))
const ForgotPassword = lazy(() => import('~/pages/Auth/ForgotPassword'))
const ResetPassword = lazy(() => import('~/pages/Auth/ResetPassword'))
const Home = lazy(() => import('~/pages/Workspaces/Home'))
const BoardsList = lazy(() => import('~/pages/Workspaces/BoardsList'))
const BoardDetails = lazy(() => import('~/pages/Boards/BoardDetails'))
const Settings = lazy(() => import('~/pages/Settings'))
const NotFound = lazy(() => import('~/pages/404/NotFound'))

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
      {/* Protected Routes */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} profile={profile} />}>
        {/* Home */}
        <Route
          path={path.home}
          element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <HomeLayout />
            </Suspense>
          }
        >
          <Route index element={<Home />} />
          <Route path={path.boardsList} element={<BoardsList />} />
        </Route>

        {/* Board Details */}
        <Route
          path={path.boardDetails}
          element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <BoardDetails />
            </Suspense>
          }
        />

        {/* User Settings */}
        <Route
          path={path.accountSettings}
          element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <Settings />
            </Suspense>
          }
        />
        <Route
          path={path.securitySettings}
          element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <Settings />
            </Suspense>
          }
        />
      </Route>

      {/* Rejected Routes */}
      <Route element={<RejectedRoute isAuthenticated={isAuthenticated} profile={profile} />}>
        {/* Authentication */}
        <Route
          element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <AuthLayout />
            </Suspense>
          }
        >
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
      <Route
        path='*'
        element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <NotFound />
          </Suspense>
        }
      />
    </Routes>
  )
}

export default App
