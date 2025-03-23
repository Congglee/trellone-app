import { Navigate, Route, Routes } from 'react-router-dom'
import path from '~/constants/path'
import NotFound from '~/pages/404/NotFound'
import AuthLayout from '~/pages/Auth/layouts/AuthLayout'
import Login from '~/pages/Auth/Login'
import Register from '~/pages/Auth/Register'
import BoardDetails from '~/pages/Boards/BoardDetails'

function App() {
  return (
    <Routes>
      {/* Redirect Route */}
      <Route path='/' element={<Navigate to='/boards/67dcfe028020577bb00a7048' replace={true} />} />

      {/* Board Details */}
      <Route path={path.boardDetails} element={<BoardDetails />} />

      {/* Authentication */}
      <Route element={<AuthLayout />}>
        <Route path={path.login} element={<Login />} />
        <Route path={path.register} element={<Register />} />
      </Route>

      {/* 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
