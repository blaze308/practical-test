import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		username: "",
		password: "",
	});

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
			const url = "http://localhost:5000/auth/teller/login";

			const res = await axios.post(url, { username, password });

			var token = res.data["token"];
			var teller_id = res.data["teller_id"];

			const sendToken = () => {
				navigate("/dashboard", { state: { token, teller_id } });
			};

			sendToken();
			// console.log(token);
			// console.log(teller_id);

			console.log("Teller login submitted", res.data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="max-w-md w-full space-y-8 p-4 bg-white rounded-lg shadow-lg">
					<h2 className="text-center text-2xl font-extrabold">Login</h2>
					<form className="space-y-4" onSubmit={handleSubmit}>
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
							onClick={handleSubmit}
							type="submit"
							className="bg-green-500 text-white p-2 rounded-md w-full hover:bg-green-600">
							Login
						</button>
					</form>
				</div>
			</div>
		</>
	);
};

export default Auth;
