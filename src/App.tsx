import { Navigate, Route, Routes } from 'react-router-dom'
import path from '~/constants/path'
import NotFound from '~/pages/404/NotFound'
import BoardDetails from '~/pages/Boards/BoardDetails'

function App() {
  return (
    <Routes>
      {/* Redirect Route */}
      <Route path='/' element={<Navigate to='/boards/67dcfe028020577bb00a7048' replace={true} />} />

      {/* Board Details */}
      <Route path={path.boardDetails} element={<BoardDetails />} />

      {/* 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
