import { BrowserRouter, Routes, Route } from 'react-router-dom';

import DH_LoginForm from './user/DH_LoginForm';
import DH_JoinForm from './user/DH_JoinForm';
import DH_PwSearch from './user/DH_PwSearch';
import DH_PwAlter from './user/DH_PwAlter';

import DH_PointStoreMain from './pointstore/DH_PointStoreMain';


import './css/reset.css';

function App() {
	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route path='/user/loginform' element={<DH_LoginForm />} />
					<Route path='/user/joinform' element={<DH_JoinForm />} />
					<Route path='/user/pwsearch' element={<DH_PwSearch />} />
					<Route path='/user/pwalter' element={<DH_PwAlter />} />

					<Route path='/pointstore/pointstoremain' element={<DH_PointStoreMain />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;