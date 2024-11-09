import { BrowserRouter, Routes, Route } from 'react-router-dom';

import YCChallengeStatistics from './yc_pages/YC_challenge_statistics';
import YcChallengeBoard from './yc_pages/YC_challenge_board';
import MissionInfo from './pages/challenge/Missioninfo.jsx';
import Challengemain from './pages/challenge/Challengemain.jsx';
import Mission from './pages/challenge/mission.jsx';
function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/stat' element={<YCChallengeStatistics/>} />
          <Route path='/board' element={<YcChallengeBoard/>} />
          <Route path='/mission' element={<Mission />} />
          <Route path='/missioninfo' element={<MissionInfo />} />
          <Route path='/cmain' element={<Challengemain />} />
        </Routes>
    </BrowserRouter>

      );
}

export default App;
