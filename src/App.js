// rafce
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './containers/Home';
// rr-dom deprecated Switch and remodelled it into Routes

const App = () => {
	return (
		<Routes>
			<Route path="login" element={<Login />} />
			<Route path="/*" element={<Home />} />
		</Routes>
	);
};

export default App;
