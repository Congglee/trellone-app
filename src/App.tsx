import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import path from '~/constants/path'
import { useAppSelector } from '~/lib/redux/hooks'
import NotFound from '~/pages/404/NotFound'
import AuthLayout from '~/pages/Auth/layouts/AuthLayout'
import Login from '~/pages/Auth/Login'
import Register from '~/pages/Auth/Register'
import BoardDetails from '~/pages/Boards/BoardDetails'
import { UserType } from '~/schemas/user.schema'

const ProtectedRoute = ({ profile, isAuthenticated }: { profile: UserType | null; isAuthenticated: boolean }) => {
  return profile && isAuthenticated ? <Outlet /> : <Navigate to='/login' replace={true} />
}

const RejectedRoute = ({ profile, isAuthenticated }: { profile: UserType | null; isAuthenticated: boolean }) => {
  return !isAuthenticated && !profile ? <Outlet /> : <Navigate to='/' />
}

function App() {
  const { isAuthenticated, profile } = useAppSelector((state) => state.auth)

  return (
    <Routes>
      {/* Redirect Route */}
      <Route path='/' element={<Navigate to='/boards/67e2e902157d1f8cceb3f70c' replace={true} />} />

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
      </Route>

      {/* 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
