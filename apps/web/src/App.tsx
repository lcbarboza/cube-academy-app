import { HomePage, ScramblePage } from '@/pages'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scramble" element={<ScramblePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
