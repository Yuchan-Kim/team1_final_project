import { BrowserRouter, Routes, Route } from 'react-router-dom';

import YCChallengeStatistics from './yc_pages/YC_challenge_statistics';
import YcChallengeBoard from './yc_pages/YC_challenge_board';
function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<YCChallengeStatistics/>} />
        </Routes>
    </BrowserRouter>

      );
}

export default App;
