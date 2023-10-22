import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
	const location = useLocation();
	const token = location.state.token;
	const teller_id = location.state.teller_id;

	const url = "http://localhost:5000/auth/account";

	const [customerForm, setCustomerForm] = useState({
		customer_id: "",
	});
	const [customer, setCustomer] = useState({});

	const handleCustomerChange = (e) => {
		const { name, value } = e.target;
		setCustomerForm({
			...customerForm,
			[name]: value,
		});
	};

	const handleCustomerSubmit = async (e) => {
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

			setCustomerForm({ customer_id: "" });
		} catch (error) {
			console.log(error);
		}
	};

	const [paymentForm, setPaymentForm] = useState({
		amount: "",
		account_number: "",
	});

	const [paymentSuccess, setPaymentSuccess] = useState("");

	const handlePaymentChange = (e) => {
		const { name, value } = e.target;
		setPaymentForm({
			...paymentForm,
			[name]: value,
		});
	};

	const handlePaymentSubmit = async (e) => {
		e.preventDefault();
		try {
			const { amount, account_number } = paymentForm;
			const paymentURL = `${url}/payment`;

			const res = await axios.post(
				paymentURL,
				{ amount, account_number, teller_id },
				{
					headers: {
						token: `${token}`,
					},
				}
			);
			setPaymentSuccess(res.data.message);
			hideSuccessMessage(setPaymentSuccess);
		} catch (error) {
			console.log(error);
		}
	};

	const [withdrawalForm, setWithdrawalForm] = useState({
		amount: "",
		account_number: "",
	});

	const [withdrawalSuccess, setWithdrawalSuccess] = useState("");

	const handleWithdrawalChange = (e) => {
		const { name, value } = e.target;
		setWithdrawalForm({
			...withdrawalForm,
			[name]: value,
		});
	};

	const handleWithdrawalSubmit = async (e) => {
		e.preventDefault();
		try {
			const { amount, account_number } = withdrawalForm;
			const withdrawalURL = `${url}/withdrawal`;

			const res = await axios.post(
				withdrawalURL,
				{ amount, account_number, teller_id },
				{
					headers: {
						token: `${token}`,
					},
				}
			);
			setWithdrawalSuccess(res.data.message);
			hideSuccessMessage(setWithdrawalSuccess);
		} catch (error) {
			console.log(error);
		}
	};

	const [report, setReport] = useState([]);

	const fetchReport = async () => {
		const reportURL = `${url}/teller-report/${teller_id}`;

		const res = await axios.get(reportURL, {
			headers: {
				token: `${token}`,
			},
		});
		const data = res.data;

		console.log(data);
		setReport(data);
	};

	function formatTransactionDate(dateString) {
		const options = {
			year: "numeric",
			month: "long",
			day: "numeric",
		};

		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", options);
	}

	const hideSuccessMessage = (func) => {
		setTimeout(() => {
			func("");
		}, 2000);
	};

	function formatTransactionTime(timeString) {
		return timeString.split(".")[0]; // Remove milliseconds
	}

	return (
		<div className="bg-gray-100 min-h-screen p-8 auto">
			<h1 className="text-2xl font-bold mb-4">Dashboard</h1>

			<div className="bg-white rounded-md p-4 mb-4">
				<h2 className="text-xl font-semibold mb-2 ">Customers</h2>
				<form action="" onSubmit={handleCustomerSubmit}>
					<div className="mb-4">
						<label htmlFor="customer_id">Customer ID</label>
						<input
							required
							type="text"
							id="customer_id"
							name="customer_id"
							value={customerForm.customer_id}
							onChange={handleCustomerChange}
							className="w-52 block border border-gray-300 rounded p-2"
						/>
						<button
							onClick={handleCustomerSubmit}
							className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
							Submit
						</button>
					</div>
				</form>
				<div>
					{customer && (
						<div className="bg-gray-200 p-2 rounded mb-2 w-1/2">
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

			<div className="bg-white rounded-md p-4 mb-4">
				<h2 className="text-2xl underline font-semibold mb-2">Transactions</h2>
				<div className="my-6">
					<h1 className="text-xl mb-2">Payment:</h1>
					<form action="" onSubmit={handlePaymentSubmit}>
						<div className="mb-4">
							<label htmlFor="account_number">Account Number</label>
							<input
								required
								type="text"
								id="account_number"
								name="account_number"
								value={paymentForm.account_number}
								onChange={handlePaymentChange}
								className="w-52 block border border-gray-300 rounded p-2"
							/>

							<label htmlFor="amount">Amount</label>
							<input
								required
								type="text"
								id="amount"
								name="amount"
								value={paymentForm.amount}
								onChange={handlePaymentChange}
								className="w-52 block border border-gray-300 rounded p-2"
							/>
							<button
								onClick={handlePaymentSubmit}
								className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
								Submit
							</button>
						</div>
						{paymentSuccess && (
							<p className="text-green-500">{paymentSuccess}</p>
						)}
					</form>
				</div>

				{/* Widthrawal section */}
				<div className="my-6">
					<h1 className="text-xl mb-2">Withdrawal:</h1>
					<form action="" onSubmit={handleWithdrawalSubmit}>
						<div className="mb-4">
							<label htmlFor="account_number">Account Number</label>
							<input
								required
								type="text"
								id="account_number"
								name="account_number"
								value={withdrawalForm.account_number}
								onChange={handleWithdrawalChange}
								className="w-52 block border border-gray-300 rounded p-2"
							/>

							<label htmlFor="amount">Amount</label>
							<input
								required
								type="text"
								id="amount"
								name="amount"
								value={withdrawalForm.amount}
								onChange={handleWithdrawalChange}
								className="w-52 block border border-gray-300 rounded p-2"
							/>
							<button
								onClick={handleWithdrawalSubmit}
								className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
								Submit
							</button>
						</div>
						{withdrawalSuccess && (
							<p className="text-green-500">{withdrawalSuccess}</p>
						)}
					</form>
				</div>
			</div>

			<div className="bg-white rounded-md p-4">
				<h2 className="text-xl font-semibold mb-2">Reports</h2>
				<button
					className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
					onClick={fetchReport}>
					Fetch Report
				</button>

				<h2 className="text-xl font-semibold my-2 ">Transaction Report</h2>
				<ul className="w-1/2">
					{report.map((item) => (
						<li
							key={item.transaction_id}
							className="mb-4 bg-gray-200 p-2 rounded">
							<p className="font-semibold">
								Transaction ID: {item.transaction_id}
							</p>
							<p>Account Number: {item.account_number}</p>
							<p>Transaction Type: {item.transaction_type}</p>
							<p>Amount: {item.amount}</p>
							<p>
								Transaction Date: {formatTransactionDate(item.transaction_date)}
							</p>
							<p>
								Transaction Time: {formatTransactionTime(item.transaction_time)}
							</p>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Dashboard;
