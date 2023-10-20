import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
	const location = useLocation();
	var token = location.state.token;
	var teller_id = location.state.teller_id;
	const url = `http://localhost:5000/auth/teller/report/${teller_id}`;

	const fetchAccountDetails = () => {
		return fetch(url, {
			method: "GET",
			headers: {
				Authorization: `${token}`,
			},
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				console.log("Received data:", data);
				setReports(data);
				return data;
			})
			.catch((error) => {
				console.error("Error fetching account details:", error);
			});
	};

	const [reports, setReports] = useState({});

	useEffect(() => {
		fetchAccountDetails();
	}, []);

	return (
		<div className="bg-gray-100 min-h-screen p-4">
			<h1 className="text-2xl font-bold mb-4">Dashboard</h1>

			{/* Customers Section */}
			<div className="bg-white rounded-md p-4 mb-4">
				<h2 className="text-xl font-semibold mb-2">Customers</h2>
				{/* Add content for displaying customer information here */}
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
