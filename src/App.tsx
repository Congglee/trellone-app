import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import path from '~/constants/path'
import { useAppDispatch, useAppSelector } from '~/lib/redux/hooks'
import { generateSocketInstace } from '~/lib/socket'
import AccountVerification from '~/pages/Auth/AccountVerification'
import ForgotPasswordVerification from '~/pages/Auth/ForgotPasswordVerification'
import AuthLayout from '~/pages/Auth/layouts/AuthLayout'
import OAuth from '~/pages/Auth/OAuth'
import BoardInvitationVerification from '~/pages/Boards/BoardInvitationVerification'
import HomeLayout from '~/pages/Workspaces/layouts/HomeLayout'
import WorkspaceCollaboratorsLayout from '~/pages/Workspaces/layouts/WorkspaceCollaboratorsLayout'
import WorkspaceDetailsLayout from '~/pages/Workspaces/layouts/WorkspaceDetailsLayout'
import WorkspaceInvitationVerification from '~/pages/Workspaces/pages/WorkspaceInvitationVerification'
import { UserType } from '~/schemas/user.schema'
import { disconnectSocket, setSocket } from '~/store/slices/app.slice'
import { reset } from '~/store/slices/auth.slice'
import { getAccessTokenFromLS, LocalStorageEventTarget } from '~/utils/storage'

const Landing = lazy(() => import('~/pages/Landing'))
const Login = lazy(() => import('~/pages/Auth/Login'))
const Register = lazy(() => import('~/pages/Auth/Register'))
const ForgotPassword = lazy(() => import('~/pages/Auth/ForgotPassword'))
const ResetPassword = lazy(() => import('~/pages/Auth/ResetPassword'))
const Home = lazy(() => import('~/pages/Workspaces/pages/Home'))
const BoardsList = lazy(() => import('~/pages/Workspaces/pages/BoardsList'))
const WorkspaceHome = lazy(() => import('~/pages/Workspaces/pages/WorkspaceHome'))
const WorkspaceBoards = lazy(() => import('~/pages/Workspaces/pages/WorkspaceBoards'))
const WorkspaceMembers = lazy(() => import('~/pages/Workspaces/pages/WorkspaceMembers'))
const WorkspaceGuests = lazy(() => import('~/pages/Workspaces/pages/WorkspaceGuests'))
const WorkspaceSettings = lazy(() => import('~/pages/Workspaces/pages/WorkspaceSettings'))
const BoardDetails = lazy(() => import('~/pages/Boards/BoardDetails'))
const Settings = lazy(() => import('~/pages/Settings'))
const AccessDenied = lazy(() => import('~/pages/AccessDenied'))
const NotFound = lazy(() => import('~/pages/404/NotFound'))

const ProtectedRoute = ({ profile, isAuthenticated }: { profile: UserType | null; isAuthenticated: boolean }) => {
  return profile && isAuthenticated ? <Outlet /> : <Navigate to={path.login} replace={true} />
}

const RejectedRoute = ({ profile, isAuthenticated }: { profile: UserType | null; isAuthenticated: boolean }) => {
  const location = useLocation()

  const isVerificationPath =
    location.pathname === path.accountVerification ||
    location.pathname === path.forgotPasswordVerification ||
    location.pathname === path.boardInvitationVerification ||
    location.pathname === path.workspaceInvitationVerification

  if (isVerificationPath) {
    return <Outlet />
  }

  return !isAuthenticated && !profile ? <Outlet /> : <Navigate to={path.home} />
}

const VerifiedRoute = ({ profile }: { profile: UserType | null }) => {
  const isAccountVerified = profile?.verify === 1

  useEffect(() => {
    if (!isAccountVerified) {
      toast.error('Please verify your account to access this page')
    }
  }, [isAccountVerified])

  return !isAccountVerified ? <Navigate to={path.accountSettings} /> : <Outlet />
}

function App() {
  const { isAuthenticated, profile } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const accessToken = getAccessTokenFromLS()

    if (isAuthenticated && profile) {
      dispatch(setSocket(generateSocketInstace(accessToken)))
    }
  }, [isAuthenticated, profile, dispatch])

  useEffect(() => {
    const onReset = () => {
      dispatch(reset())
      dispatch(disconnectSocket())
    }

    LocalStorageEventTarget.addEventListener('clearLS', onReset)

    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', onReset)
    }
  }, [dispatch])

  return (
    <Routes>
      {/* Front Landing Page */}
      <Route
        path={path.landing}
        element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <Landing />
          </Suspense>
        }
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} profile={profile} />}>
        <Route
          path=''
          element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <HomeLayout />
            </Suspense>
          }
        >
          {/* Home */}
          <Route path={path.home} element={<Home />} />

          {/* Boards List */}
          <Route path={path.boardsList} element={<BoardsList />} />

          {/* Workspace Home */}
          <Route path={path.workspaceHome} element={<WorkspaceHome />} />
        </Route>

        <Route
          path=''
          element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <WorkspaceDetailsLayout />
            </Suspense>
          }
        >
          {/* Workspace Boards */}
          <Route path={path.workspaceBoards} element={<WorkspaceBoards />} />

          {/* Workspace Settings */}
          <Route path={path.workspaceSettings} element={<WorkspaceSettings />} />

          <Route path='' element={<WorkspaceCollaboratorsLayout />}>
            {/* Workspace Members */}
            <Route path={path.workspaceMembers} element={<WorkspaceMembers />} />

            {/* Workspace Guests */}
            <Route path={path.workspaceGuests} element={<WorkspaceGuests />} />
          </Route>
        </Route>

        {/* Board Details */}
        <Route element={<VerifiedRoute profile={profile} />}>
          <Route
            path={path.boardDetails}
            element={
              <Suspense fallback={<PageLoadingSpinner />}>
                <BoardDetails />
              </Suspense>
            }
          />
        </Route>

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
        <Route path={path.workspaceInvitationVerification} element={<WorkspaceInvitationVerification />} />
      </Route>

      {/* OAuth */}
      <Route path={path.oauth} element={<OAuth />} />

      {/* Access Denied Page */}
      <Route
        path={path.accessDenied}
        element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <AccessDenied />
          </Suspense>
        }
      />

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
