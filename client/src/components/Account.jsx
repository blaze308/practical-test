import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Account = () => {
	const location = useLocation();
	var token = location.state.token;
	const url = "http://localhost:5000/auth/customer/profile";

	// const fetchAccountDetails = () => {
	// 	return fetch(url, {
	// 		method: "GET",
	// 		headers: {
	// 			Authorization: `${token}`,
	// 		},
	// 	})
	// 		.then((response) => {
	// 			if (!response.ok) {
	// 				throw new Error("Network response was not ok");
	// 			}

	// 			return response.json();
	// 		})
	// 		.then((data) => {
	// 			console.log("Account Details:", data);
	// 			return data;
	// 		})
	// 		.catch((error) => {
	// 			console.error("Error fetching account details:", error);
	// 		});
	// };

	// useEffect(() => {
	// 	fetchAccountDetails();
	// }, []);

	return (
		<div>
			<div></div>
		</div>
	);
};

export default Account;
