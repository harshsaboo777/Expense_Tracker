import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../componentsStyles/modal.css";
import axios from "axios";
let members = [];

function Add_Group_expense({ setOpenModal, state, setState }) {
	useEffect(() => {
		console.log(group_id);
		const fetchMembers = async (e) => {
			await axios
				.get("http://localhost:5000/groups/members/" + group_id)
				.then((res) => {
					members = res.data;
				});
		};
		fetchMembers();
	}, []);
	const getCurrentDate = (separator = "/") => {
		let newDate = new Date();
		let date = newDate.getDate();
		let month = newDate.getMonth() + 1;
		let year = newDate.getFullYear();

		return `${year}${separator}${
			month < 10 ? `0${month}` : `${month}`
		}${separator}${date}`;
	};
	const [memberExpenses, setmemberExpenses] = useState({
		involved: [],
		fname: "nobody",
		paid_by: 0,
		remarks: "",
		amount: 0,
		date: getCurrentDate(),
	});
	const [membersArr, setMembersArr] = useState(members);
	const handleInput = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setmemberExpenses({ ...memberExpenses, [name]: value });
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		setmemberExpenses({ ...memberExpenses, date: getCurrentDate() });
		let newState = [...state, memberExpenses];
		let temp = membersArr.filter((member) => member.isChecked);
		memberExpenses.involved = temp;
		axios
			.post("http://localhost:5000/groups/" + group_id, memberExpenses)
			.then((res) => {
				members = res.data;
			});
		setState(newState);
		setOpenModal(false);
	};
	const handleChange = (e) => {
		const { name, checked } = e.target;
		let temp = membersArr.map((member) =>
			member.mem_id === name ? { ...member, isChecked: checked } : member
		);
		setMembersArr(temp);
	};
	const handleDropdown = (e) => {
		const { value } = e.target;
		let name = "";
		memberExpenses.paid_by = value;
		membersArr.forEach((member) => {
			if (member.mem_id == value) {
				name = member.fname;
			}
		});
		memberExpenses.fname = name;
	};
	let group_id = useParams().id;

	return (
		<div className="modalBackground">
			<div className="modalContainer">
				<div className="titleCloseBtn">
					<button
						onClick={() => {
							setOpenModal(false);
						}}
					>
						X
					</button>
				</div>
				<div className="title">
					<h1>Add New Group Expense</h1>
				</div>
				<div className="body">
					<p>
						<div className="card">
							<form action="">
								<select
									class="custom-select mr-sm-2"
									id="inlineFormCustomSelect"
									required
									onChange={handleDropdown}
								>
									<option selected>Paid By </option>
									{membersArr.map((member) => (
										<option
											value={member.mem_id}
											name={member.fname}
										>
											{member.fname + " " + member.lname}
										</option>
									))}
								</select>
								{membersArr.map((member) => (
									<div
										className="form-check"
										key={member.mem_id}
									>
										<input
											type="checkbox"
											className="form-check-input"
											name={member.mem_id}
											checked={member?.isChecked || false}
											onChange={handleChange}
										/>
										<label className="form-check-label ms-2">
											{member.fname + " " + member.lname}
										</label>
									</div>
								))}
								<input
									type="text"
									class="form-control"
									name="remarks"
									value={memberExpenses.remarks}
									onChange={handleInput}
									placeholder="Expense Type"
								/>
								<input
									type="text"
									class="form-control"
									name="amount"
									value={memberExpenses.amount}
									onChange={handleInput}
									placeholder="Amount"
								/>
							</form>
						</div>
					</p>
				</div>
				<div className="footer">
					<button
						onClick={() => {
							setOpenModal(false);
						}}
						id="cancelBtn"
					>
						Cancel
					</button>
					<button type="submit" onClick={handleSubmit}>
						Add
					</button>
				</div>
			</div>
		</div>
	);
}

export default Add_Group_expense;
export { members };
