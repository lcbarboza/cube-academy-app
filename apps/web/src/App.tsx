import { ScrambleProvider, SessionProvider, SolveHistoryProvider } from '@/contexts'
import {
  CubingWorldPage,
  HubPage,
  NotFoundPage,
  ProTimerPage,
  TimerPage,
  TutorialsPage,
} from '@/pages'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <ScrambleProvider>
          <SolveHistoryProvider>
            <Routes>
              <Route path="/" element={<HubPage />} />
              <Route path="/scramble" element={<CubingWorldPage />} />
              <Route path="/timer" element={<TimerPage />} />
              <Route path="/timer-pro" element={<ProTimerPage />} />
              <Route path="/tutorials" element={<TutorialsPage />} />
              {/* Redirect legacy /home to hub */}
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </SolveHistoryProvider>
        </ScrambleProvider>
      </SessionProvider>
    </BrowserRouter>
  )
}

export default App
