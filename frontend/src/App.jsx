import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { FormProvider } from './context/FormContext';
import Toast from './components/Toast';
import Home from './pages/Home';
import Form from './pages/Form';
import Output from './pages/Output';
import Upload from './pages/Upload';
import Loading from './pages/Loading';
import Result from './pages/Result';

export default function App() {
  return (
    <ThemeProvider>
      <FormProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/form" element={<Form />} />
            <Route path="/output" element={<Output />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/result" element={<Result />} />
          </Routes>
          <Toast />
        </BrowserRouter>
      </FormProvider>
    </ThemeProvider>
  );
}
