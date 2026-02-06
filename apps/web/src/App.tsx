import { HomePage, ScramblePage } from '@/pages'
import { DebugScramblePage } from '@/pages/DebugScramblePage'
import { TestMovesPage } from '@/pages/TestMovesPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scramble" element={<ScramblePage />} />
        <Route path="/test-moves" element={<TestMovesPage />} />
        <Route path="/debug" element={<DebugScramblePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
