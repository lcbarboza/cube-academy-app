import { ScrambleProvider, SolveHistoryProvider } from '@/contexts'
import { CubingWorldPage, HomePage, NotFoundPage, TimerPage } from '@/pages'
import { DebugScramblePage } from '@/pages/DebugScramblePage'
import { ScramblePage } from '@/pages/ScramblePage'
import { TestMovesPage } from '@/pages/TestMovesPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <ScrambleProvider>
        <SolveHistoryProvider>
          <Routes>
            <Route path="/" element={<CubingWorldPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/timer" element={<TimerPage />} />
            <Route path="/scramble" element={<ScramblePage />} />
            <Route path="/test-moves" element={<TestMovesPage />} />
            <Route path="/debug" element={<DebugScramblePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </SolveHistoryProvider>
      </ScrambleProvider>
    </BrowserRouter>
  )
}

export default App
