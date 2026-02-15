import { ScrambleProvider, SolveHistoryProvider } from '@/contexts'
import { CubingWorldPage, HomePage, NotFoundPage, ProTimerPage, TimerPage } from '@/pages'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <ScrambleProvider>
        <SolveHistoryProvider>
          <Routes>
            <Route path="/" element={<CubingWorldPage />} />
            <Route path="/scramble" element={<CubingWorldPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/timer" element={<TimerPage />} />
            <Route path="/timer-pro" element={<ProTimerPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </SolveHistoryProvider>
      </ScrambleProvider>
    </BrowserRouter>
  )
}

export default App
