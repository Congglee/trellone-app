import { Route, Routes } from 'react-router-dom'
import BoardDetails from '~/pages/Boards/BoardDetails'

function App() {
  return (
    <Routes>
      <Route path='/' element={<BoardDetails />} />
    </Routes>
  )
}

export default App
