import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
	const location = useLocation();
	const token = location.state.token;
	const teller_id = location.state.teller_id;

	const url = "http://localhost:5000/auth/account";

	const [customerForm, customerSetForm] = useState({
		customer_id: "",
	});
	const [customers, setCustomers] = useState([]);

	const customerHandleChange = (e) => {
		const { name, value } = e.target;
		customerSetForm({
			...customerForm,
			[name]: value,
		});
	};

	const customerHandleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { customer_id } = customerForm;
			const customerURL = `${url}/customer-info`;

			const res = await axios.post(
				customerURL,
				{ customer_id },
				{ headers: { token: `${token}` } }
			);
			// console.log(res.data[0]);
			var data = res.data[0];
			setCustomers(data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="bg-gray-100 min-h-screen p-4">
			<h1 className="text-2xl font-bold mb-4">Dashboard</h1>

			<div className="bg-white rounded-md p-4 mb-4">
				<h2 className="text-xl font-semibold mb-2">Customers</h2>
				<form action="" onSubmit={customerHandleSubmit}>
					<div>
						<label htmlFor="customer_id">CustomerID</label>
						<input
							required
							type="text"
							id="customer_id"
							name="customer_id"
							value={customerForm.customer_id}
							onChange={customerHandleChange}
						/>
						<button onClick={customerHandleSubmit}>Submit</button>
					</div>
				</form>
				<div>
					{customers.customer_id}
					{customers.firstname}
					{customers.lastname}
					{customers.balance}
					{customers.phone_number}
					{customers.city}
				</div>
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
