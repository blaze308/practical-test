import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
	const location = useLocation();
	const token = location.state.token;
	const teller_id = location.state.teller_id;

	const url = "http://localhost:5000/auth/account";
	const customerURL = `${url}/customer-info`;

	return (
		<div className="bg-gray-100 min-h-screen p-4">
			<h1 className="text-2xl font-bold mb-4">Dashboard</h1>

			<div className="bg-white rounded-md p-4 mb-4">
				<h2 className="text-xl font-semibold mb-2">Customers</h2>
			</div>

			{/* Transactions Section */}
			<div className="bg-white rounded-md p-4 mb-4">
				<h2 className="text-xl font-semibold mb-2">Transactions</h2>
				{/* Add content for displaying transaction information here */}
			</div>

			{/* Reports Section */}
			<div className="bg-white rounded-md p-4">
				<h2 className="text-xl font-semibold mb-2">Reports</h2>
			</div>
		</div>
	);
};

export default Dashboard;
