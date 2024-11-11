
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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


import Main from './pages/main/Main';
import Mainlist from './pages/main/Mainlist';







function App() {
  return (
    <div>

      <BrowserRouter>
        <Routes>

          {/* <Route path='' element={<Main />} /> */}
          
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

          <Route path='/' element={<Main />} />
          <Route path='/mainlist' element={<Mainlist />} />



        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
