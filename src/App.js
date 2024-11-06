import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DH_Header from './include/DH_Header';
import DH_Footer from './include/DH_Footer';

import './css/reset.css';

function App() {
	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route path='/include/header' element={<DH_Header />} />
					<Route path='/include/footer' element={<DH_Footer />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;