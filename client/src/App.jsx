import React from "react";
import Auth from "./components/Auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Account from "./components/Account";
import Dashboard from "./components/Dashboard";
const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Auth />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/account" element={<Account />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
