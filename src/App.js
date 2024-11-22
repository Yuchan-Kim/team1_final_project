import { BrowserRouter, Routes, Route } from 'react-router-dom';
import YCChallengeStatistics from './yc_pages/YC_challenge_statistics';
import YcChallengeBoard from './yc_pages/YC_challenge_board';
import YCStep02 from './yc_pages/YC_Step02.jsx';
import YCStep03 from './yc_pages/YC_Step03.jsx';
import YCStep04 from './yc_pages/YC_Step04.jsx';
import YCStep05 from './yc_pages/YC_Step05.jsx';
import YCStep06 from './yc_pages/YC_Step06.jsx';
import YCStep07 from './yc_pages/YC_Step07.jsx';
import YCStep10 from './yc_pages/YC_Step10.jsx';
import YCStep11 from './yc_pages/YC_Step11.jsx';

import MissionInfo from './pages/challenge/Missioninfo.jsx';
import Challengemain from './pages/challenge/JMYC_Challengemain.jsx';
import Mission from './pages/challenge/mission.jsx';
import Mypage from './ham_pages/ham_mypage';
import Pointpage from './ham_pages/ham_mypage_point';
import Cargo from './ham_pages/ham_mypage_cargo';
import Rank from './ham_pages/ham_mypage_ranking';

import Step0 from './pages/genebang/Genebang01';
import Step1 from './pages/genebang/Step01';
import Step2 from './pages/genebang/Step02';
import Step3 from './pages/genebang/Step03';
import Step4 from './pages/genebang/Step04';
import Step5 from './pages/genebang/Step05';
import Step6 from './pages/genebang/Step06';
import Step7 from './pages/genebang/Step07';
import Step8 from './pages/genebang/Step08';
import Step9 from './pages/genebang/Step09';
import Step10 from './pages/genebang/Step10';
import Step11 from './pages/genebang/Step11';
import DHLoginForm from './user/DH_LoginForm.jsx';
import DHJoinForm from './user/DH_JoinForm.jsx';
import DHPwSearch from './user/DH_PwSearch.jsx';
import DHPwAlter from './user/DH_PwAlter.jsx';

import DHPointStoreMain from './pointstore/DH_PointStoreMain.jsx';

import Main from './pages/main/Main';
import Mainlist from './pages/main/Mainlist';

import Uk from './user/UserKakaoLogin.jsx';
import NaverLogin from './ham_pages/NaverLogin.jsx';
import NaverLoginCallback from './ham_pages/NaverLoginCallback.jsx';

function App() {
  return (
    <BrowserRouter> 
        <Routes>
          <Route path='/ycstep02' element = {<YCStep02/>} />
          <Route path='/ycstep03' element = {<YCStep03/>} />
          <Route path='/ycstep04' element = {<YCStep04/>} />
          <Route path='/ycstep05' element = {<YCStep05/>} />
          <Route path='/ycstep06' element = {<YCStep06/>} />
          <Route path='/ycstep07' element = {<YCStep07/>} />
          <Route path='/ycstep10' element = {<YCStep10/>} />
          <Route path='/ycstep11' element = {<YCStep11/>} />

          <Route path='/stat/:roomNum' element={<YCChallengeStatistics/>} />
          <Route path='/board/:roomNum' element={<YcChallengeBoard/>} />
          <Route path='/mission/:roomNum' element={<Mission />} />
          <Route path='/missioninfo/:roomNum' element={<MissionInfo />} />
          <Route path='/cmain/:roomNum' element={<Challengemain />} />


          <Route path='/user/mypage' element={<Mypage />} />
          <Route path='/user/mypoint' element={<Pointpage />} />
          <Route path='/user/cargo' element={<Cargo />} />
          <Route path='/user/rank' element={<Rank />} />

          
          <Route path='/genebang/genebang01' element={<Step0 />} />
          <Route path='/genebang/step1' element={<Step1 />} />
          <Route path='/genebang/step2' element={<Step2 />} />
          <Route path='/genebang/step3' element={<Step3 />} />
          <Route path='/genebang/step4' element={<Step4 />} />
          <Route path='/genebang/step5' element={<Step5 />} />
          <Route path='/genebang/step6' element={<Step6 />} />
          <Route path='/genebang/step7' element={<Step7 />} />
          <Route path='/genebang/step8' element={<Step8 />} />
          <Route path='/genebang/step9' element={<Step9 />} />
          <Route path='/genebang/step10' element={<Step10 />} />
          <Route path='/genebang/step11' element={<Step11 />} />
          <Route path='/user/loginform' element={<DHLoginForm/>} />
					<Route path='/user/joinform' element={<DHJoinForm/>} />
					<Route path='/user/pwsearch' element={<DHPwSearch/>} />
					<Route path='/user/pwalter' element={<DHPwAlter/>} />
					<Route path='/pointstore/pointstoremain' element={<DHPointStoreMain />} />
          <Route path='/' element={<Main />} />
          <Route path='/mainlist' element={<Mainlist />} />

          <Route path='/user/uk' element={<Uk />} />
          <Route path="/naver/login" element={<NaverLogin />} />
          <Route path="/naver/callback" element={<NaverLoginCallback  />} />
    
        </Routes>
    </BrowserRouter>

      );
}

export default App;

