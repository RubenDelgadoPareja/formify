import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FormBuilderPage from '@/modules/form-builder/presentation/pages/FormBuilderPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormBuilderPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
