import { BrowserRouter, Routes, Route } from 'react-router-dom';
import YCChallengeStatistics from './yc_pages/YC_challenge_statistics';
import YcChallengeBoard from './yc_pages/YC_challenge_board';
import AdminMain from './admin/adminpages/AdminMain.jsx';
import AdminEditItem from './admin/adminpages/AdminEditItem.jsx';
import AdminDataManagement from './admin/adminpages/AdminDataManagement.jsx';
import AdminNotification from './admin/adminpages/AdminNotification.jsx';

import AdminUsers from './admin/adminpages/AdminUsers.jsx';
import AddItem from './admin/adminpages/AdminAddItem.jsx';
import ViewItems from './admin/adminpages/AdminViewItems.jsx';

import MissionInfo from './pages/challenge/Missioninfo.jsx';
import Challengemain from './pages/challenge/JMYC_Challengemain.jsx';
import Mission from './pages/challenge/mission.jsx';
import Mypage from './ham_pages/ham_mypage';
import Pointpage from './ham_pages/ham_mypage_point';
import Cargo from './ham_pages/ham_mypage_cargo';
import Rank from './ham_pages/ham_mypage_ranking';
import Notice from './ham_pages/ham_mypage_notice';

import MobileAuth from './ham_pages/ham_mobile/Ham_MobileAuth';
import MobileDashboard from './ham_pages/ham_mobile/MobileDashboard';
import MobileMission from './ham_pages/ham_mobile/MobileMission';
import MobileCargo from './ham_pages/ham_mobile/MobileCargo';
import MobileRank from './ham_pages/ham_mobile/MobileRank';
import MobileNotice from './ham_pages/ham_mobile/MobileNotice';
import MobilePointStore from './ham_pages/ham_mobile/MobilePointStore';
import MobileRecruiting from './ham_pages/ham_mobile/MobileRecruiting.jsx';

import Step0 from './pages/genebang/Genebang01';
import Step1 from './pages/genebang/Step01';
import Step2 from './pages/genebang/Step02';
import Step3 from './pages/genebang/Step03';
import Step4 from './pages/genebang/Step04';
import Step5 from './pages/genebang/Step05';
import Step6 from './pages/genebang/Step07.jsx';
import Step7 from './pages/genebang/Step06.jsx';
import Step8 from './pages/genebang/Step08';
import Step9 from './pages/genebang/Step09';
import Step10 from './pages/genebang/Step10';
import Step11 from './pages/genebang/Step11';
import DHLoginForm from './user/DH_LoginForm.jsx';
import DHJoinForm from './user/DH_JoinForm.jsx';
import DHPwSearch from './user/DH_PwSearch.jsx';
import DHPwAlter from './user/DH_PwAlter.jsx';

import DHPointStoreMain from './pointstore/DH_PointStoreMain.jsx';
import CustomerService from './pages/customer/CustomerService';
import CSchatbot from './pages/customer/CSchatbot.jsx';

import Main from './pages/main/Main';
import Mainlist from './pages/main/Mainlist';

import Uk from './user/UserKakaoLogin.jsx';
import NaverLogin from './ham_pages/NaverLogin.jsx';
import NaverLoginCallback from './ham_pages/NaverLoginCallback.jsx';
import GoogleLogin from './ham_pages/GoogleLogin.jsx';
import GoogleCallback from './ham_pages/GoogleCallback.jsx'; // callback for Google components 추가
import Terms from './ham_pages/Terms.jsx';
import Privacy from './ham_pages/Privacy.jsx'


function App() {
  return (
    <BrowserRouter> 
        <Routes>

          <Route path='/admin/main' element={<AdminMain/>} />
          <Route path='/stat/:roomNum' element={<YCChallengeStatistics/>} />
          <Route path='/board/:roomNum' element={<YcChallengeBoard/>} />
          <Route path='/mission/:roomNum' element={<Mission />} />
          <Route path='/missioninfo/:roomNum' element={<MissionInfo />} />
          <Route path='/cmain/:roomNum' element={<Challengemain />} />

          <Route path='/admin/user' element={<AdminUsers/>} />
          <Route path='/admin/additems' element={<AddItem/>} />
          <Route path='/admin/viewitems' element={<ViewItems/>} />
          <Route path='/admin/editItem/:itemNum' element={<AdminEditItem/>} />
          <Route path='/admin/datamanagement' element={<AdminDataManagement/>} />
          <Route path='/admin/notifications' element={<AdminNotification/>} />


          <Route path='/my/mypage' element={<Mypage />} />
          <Route path='/my/mypoint' element={<Pointpage />} />
          <Route path='/my/cargo' element={<Cargo />} />
          <Route path='/my/rank' element={<Rank />} />
          <Route path='/my/notice' element={<Notice />} />

          
          <Route path='/genebang/genebang01' element={<Step0 />} />
          <Route path='/genebang/step1' element={<Step1 />} />
          <Route path='/genebang/step2/:roomNum' element={<Step2 />} />
          <Route path='/genebang/step3/:roomNum' element={<Step3 />} />
          <Route path='/genebang/step4/:roomNum' element={<Step4 />} />
          <Route path='/genebang/step5/:roomNum' element={<Step5 />} />
          <Route path='/genebang/step6/:roomNum' element={<Step7 />} />
          <Route path='/genebang/step7/:roomNum' element={<Step6 />} />
          <Route path='/genebang/step8/:roomNum' element={<Step8 />} />
          <Route path='/genebang/step9/:roomNum' element={<Step9 />} />
          <Route path='/genebang/step10/:roomNum' element={<Step10 />} />
          <Route path='/genebang/step11/:roomNum' element={<Step11 />} />
          <Route path='/user/loginform' element={<DHLoginForm/>} />
					<Route path='/user/joinform' element={<DHJoinForm/>} />
					<Route path='/user/pwsearch' element={<DHPwSearch/>} />
					<Route path='/user/pwalter' element={<DHPwAlter/>} />
					<Route path='/pointstore/pointstoremain' element={<DHPointStoreMain />} />
          <Route path='/customerservice' element={<CustomerService />} />
          <Route path='/cschatbot' element={<CSchatbot />} />
          <Route path='/' element={<Main />} />
          <Route path='/mainlist' element={<Mainlist />} />

          <Route path='/user/uk' element={<Uk />} />
          <Route path="/naver/login" element={<NaverLogin />} />
          <Route path="/naver/callback" element={<NaverLoginCallback  />} />
          <Route path="/google/login" element={<GoogleLogin  />} />
          <Route path="/google/callback" element={<GoogleCallback />} />



          <Route path="/mobile" element={<MobileAuth  />} />
          <Route path="/mobile/home" element={<MobileDashboard  />} />
          <Route path="/mobile/mission/:roomNum" element={<MobileMission  />} />
          <Route path="/mobile/cargo" element={<MobileCargo  />} />
          <Route path="/mobile/rank" element={<MobileRank  />} />
          <Route path="/mobile/notice" element={<MobileNotice  />} />
          <Route path="/mobile/store" element={<MobilePointStore  />} />
          <Route path="/mobile/recruiting" element={<MobileRecruiting  />} />
          <Route path="/terms" element={<Terms  />} />
          <Route path="/privacy" element={<Privacy  />} />

        </Routes>
    </BrowserRouter>

      );
}

export default App;

