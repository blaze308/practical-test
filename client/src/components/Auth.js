import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		username: "",
		password: "",
	});

	const [showTellerForm, setShowTellerForm] = useState(false);
	const [showCustomerForm, setShowCustomerForm] = useState(true);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm({
			...form,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { username, password } = form;
			const customerURL = "http://localhost:5000/auth/customer/login";

			const res = await axios.post(customerURL, { username, password });

			var token = res.data["token"];
			// console.log(token);

			const sendToken = () => {
				navigate("/account", { state: { token } });
			};

			sendToken();

			console.log("Customer login submitted", res.data);
		} catch (error) {
			console.log(error);
		}
	};

	const handleTellerLogin = async (e) => {
		e.preventDefault();
		try {
			const { username, password } = form;
			const tellerURL = "http://localhost:5000/auth/teller/login";

			const res = await axios.post(tellerURL, { username, password });

			var token = res.data["token"];
			var teller_id = res.data["teller_id"];

			const sendToken = () => {
				navigate("/dashboard", { state: { token, teller_id } });
			};

			sendToken();

			console.log("Teller login submitted", res.data);
		} catch (error) {
			console.log(error);
		}
	};

	const handleShowTellerForm = () => {
		setShowTellerForm(true);
		setShowCustomerForm(false);
	};

	const handleShowCustomerForm = () => {
		setShowTellerForm(false);
		setShowCustomerForm(true);
	};

	return (
		<>
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="max-w-md w-full space-y-8 p-4 bg-white rounded-lg shadow-lg">
					<h2 className="text-center text-2xl font-extrabold">Login</h2>
					{showCustomerForm && (
						<form className="space-y-4" onSubmit={handleSubmit}>
							<div>
								<label
									htmlFor="username"
									className="block text-sm font-medium text-gray-700">
									Username
								</label>
								<input
									required
									type="text"
									id="username"
									name="username"
									value={form.username}
									onChange={handleChange}
									className="mt-1 p-2 w-full border rounded-md"
								/>
							</div>
							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-700">
									Password
								</label>
								<input
									required
									type="password"
									id="password"
									name="password"
									value={form.password}
									onChange={handleChange}
									className="mt-1 p-2 w-full border rounded-md"
								/>
							</div>
							<button
								onClick={handleSubmit}
								type="submit"
								className="bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600">
								Customer Submit
							</button>
						</form>
					)}
					{showTellerForm && (
						<form className="space-y-4" onSubmit={handleTellerLogin}>
							<div>
								<label
									htmlFor="usernameTeller"
									className="block text-sm font-medium text-gray-700">
									Teller Username
								</label>
								<input
									required
									type="text"
									id="usernameTeller"
									name="username"
									value={form.username}
									onChange={handleChange}
									className="mt-1 p-2 w-full border rounded-md"
								/>
							</div>
							<div>
								<label
									htmlFor="passwordTeller"
									className="block text-sm font-medium text-gray-700">
									Teller Password
								</label>
								<input
									required
									type="password"
									id="passwordTeller"
									name="password"
									value={form.password}
									onChange={handleChange}
									className="mt-1 p-2 w-full border rounded-md"
								/>
							</div>
							<button
								onClick={handleTellerLogin}
								type="submit"
								className="bg-green-500 text-white p-2 rounded-md w-full hover:bg-green-600">
								Teller Submit
							</button>
						</form>
					)}
					{showCustomerForm && (
						<p
							className="text-blue-500 cursor-pointer text-center"
							onClick={handleShowTellerForm}>
							Click here to login as a Teller
						</p>
					)}
					{showTellerForm && (
						<p
							className="text-blue-500 cursor-pointer text-center"
							onClick={handleShowCustomerForm}>
							Click here to switch back to Customer login
						</p>
					)}
				</div>
			</div>
		</>
	);
};

export default Auth;
