import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DH_Header from './include/DH_Header';

import './css/reset.css';

function App() {
	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route path='/include/header' element={<DH_Header />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;