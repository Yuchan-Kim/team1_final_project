import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Mypage from './ham_pages/ham_mypage';
import Pointpage from './ham_pages/ham_mypage_point';
import Cargo from './ham_pages/ham_mypage_cargo';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/user/mypage' element={<Mypage />} />
          <Route path='/user/mypoint' element={<Pointpage />} />
          <Route path='/user/cargo' element={<Cargo />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;