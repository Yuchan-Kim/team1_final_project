import { BrowserRouter, Routes, Route } from 'react-router-dom';

import YCChallengeStatistics from './yc_pages/YC_challenge_statistics';
import YcChallengeBoard from './yc_pages/YC_challenge_board';
import JMYCChallengeHeader from './yc_pages/JMYC_challenge_header';
function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/stat' element={<YCChallengeStatistics/>} />
          <Route path='/board' element={<YcChallengeBoard/>} />
          <Route path='/header' element={<JMYCChallengeHeader/>} />

        </Routes>
    </BrowserRouter>

      );
}

export default App;
