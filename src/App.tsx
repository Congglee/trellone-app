import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import path from '~/constants/path'
import { useAppSelector } from '~/lib/redux/hooks'
import NotFound from '~/pages/404/NotFound'
import AccountVerification from '~/pages/Auth/AccountVerification'
import AuthLayout from '~/pages/Auth/layouts/AuthLayout'
import Login from '~/pages/Auth/Login'
import Register from '~/pages/Auth/Register'
import BoardDetails from '~/pages/Boards/BoardDetails'
import { UserType } from '~/schemas/user.schema'

const ProtectedRoute = ({ profile, isAuthenticated }: { profile: UserType | null; isAuthenticated: boolean }) => {
  return profile && isAuthenticated ? <Outlet /> : <Navigate to='/login' replace={true} />
}

const RejectedRoute = ({ profile, isAuthenticated }: { profile: UserType | null; isAuthenticated: boolean }) => {
  const location = useLocation()
  const isVerificationAccountPath = location.pathname === path.accountVerification

  if (isVerificationAccountPath) {
    return <Outlet />
  }

  return !isAuthenticated && !profile ? <Outlet /> : <Navigate to='/' />
}

function App() {
  const { isAuthenticated, profile } = useAppSelector((state) => state.auth)

  return (
    <Routes>
      {/* Redirect Route */}
      <Route path='/' element={<Navigate to='/boards/67e4444eb85fdbf3be814557' replace={true} />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} profile={profile} />}>
        {/* Board Details */}
        <Route path={path.boardDetails} element={<BoardDetails />} />
      </Route>

      {/* Authentication */}
      <Route element={<RejectedRoute isAuthenticated={isAuthenticated} profile={profile} />}>
        <Route element={<AuthLayout />}>
          <Route path={path.login} element={<Login />} />
          <Route path={path.register} element={<Register />} />
        </Route>
        <Route path={path.accountVerification} element={<AccountVerification />} />
      </Route>

      {/* 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
