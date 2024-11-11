import { BrowserRouter, Routes, Route } from 'react-router-dom';
import YCChallengeStatistics from './yc_pages/YC_challenge_statistics';
import YcChallengeBoard from './yc_pages/YC_challenge_board';
import MissionInfo from './pages/challenge/Missioninfo.jsx';
import Challengemain from './pages/challenge/Challengemain.jsx';
import Mission from './pages/challenge/mission.jsx';
import Mypage from './ham_pages/ham_mypage';
import Pointpage from './ham_pages/ham_mypage_point';
import Cargo from './ham_pages/ham_mypage_cargo';
function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/stat' element={<YCChallengeStatistics/>} />
          <Route path='/board' element={<YcChallengeBoard/>} />
          <Route path='/mission' element={<Mission />} />
          <Route path='/missioninfo' element={<MissionInfo />} />
          <Route path='/cmain' element={<Challengemain />} />
            <Route path='/user/mypage' element={<Mypage />} />
          <Route path='/user/mypoint' element={<Pointpage />} />
          <Route path='/user/cargo' element={<Cargo />} />
        </Routes>
    </BrowserRouter>

      );
}

export default App;