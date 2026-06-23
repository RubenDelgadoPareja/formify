import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import FormBuilderPage from '@/modules/form-builder/presentation/pages/FormBuilderPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormBuilderPage />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  )
}

export default App
