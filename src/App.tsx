import { Route, Routes } from 'react-router-dom'
import path from '~/constants/path'
import BoardDetails from '~/pages/Boards/BoardDetails'

function App() {
  return (
    <Routes>
      <Route path={path.boardDetails} element={<BoardDetails />} />
    </Routes>
  )
}

export default App
