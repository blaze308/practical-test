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
	const [customer, setCustomer] = useState({});

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
			const data = res.data[0];
			setCustomer(data);

			customerSetForm({ customer_id: "" });
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
					<div className="mb-4">
						<label htmlFor="customer_id">Customer ID</label>
						<input
							required
							type="text"
							id="customer_id"
							name="customer_id"
							value={customerForm.customer_id}
							onChange={customerHandleChange}
							className="w-full border border-gray-300 rounded p-2"
						/>
						<button
							onClick={customerHandleSubmit}
							className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
							Submit
						</button>
					</div>
				</form>
				<div>
					{customer && (
						<div className="bg-gray-200 p-2 rounded mb-2">
							<p className="font-semibold">Customer ID:</p>
							<p>{customer.customer_id}</p>

							<p className="font-semibold">First Name:</p>
							<p>{customer.firstname}</p>

							<p className="font-semibold">Last Name:</p>
							<p>{customer.lastname}</p>

							<p className="font-semibold">Balance:</p>
							<p>{customer.balance}</p>

							<p className="font-semibold">Phone Number:</p>
							<p>{customer.phone_number}</p>

							<p className="font-semibold">City:</p>
							<p>{customer.city}</p>
						</div>
					)}
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
