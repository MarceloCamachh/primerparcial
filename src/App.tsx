import { BrowserRouter, Routes, Route } from "react-router-dom";
import CanvasEditor from "./components/CanvasEditor";
import AuthCallback from "./pages/AuthCallback";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CanvasEditor />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/canvas/:roomId" element={<CanvasEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
