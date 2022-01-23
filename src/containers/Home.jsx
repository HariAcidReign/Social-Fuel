// components folder has all the smaller components and containers folder has all the bigger components which are
// made up of smaller components

import React, { useState, useEffect, useRef } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Routes, Route, Link } from 'react-router-dom';

// Instead of doing "import UserProfile from '../components/UserProfile';" for every component, we call the required components from index.js (cleaner code)
import { UserProfile, Sidebar } from '../components';
import Pins from './Pins';
import { client } from '../client';
import { userQuery } from '../utils/data';
import logo from '../assets/socialfuel-white.png';
import { fetchUser } from '../utils/fetchUser';

const Home = () => {
	// all hooks are functions that return a value
	const [toggleSidebar, setToggleSidebar] = useState(false);
	const [user, setUser] = useState(null);
	const scrollRef = useRef(null);

	const userInfo = fetchUser();

	useEffect(() => {
		const query = userQuery(userInfo?.googleId);

		client.fetch(query).then((data) => {
			setUser(data[0]);
		});
	}, []);
	// input [] is empty because we are not passing any dependencies to useEffect, hence its a 'componentDidMount'

	useEffect(() => {
		scrollRef.current.scrollTo(0, 0);
	}, []);

	return (
		<div className="flex flex-col h-screen duration-75 ease-out bg-gray-50 md:flex-row transition-height">
			<div className="flex-initial hidden h-screen md:flex">
				{/* sidebar is displayed in flex only for medium screens and is hidden for all other sizes */}
				{/* mobile sidebar */}
				<Sidebar user={user && user} />
				{/* user && user returns the user iff it exists */}
			</div>
			<div className="flex flex-row md:hidden">
				<div className="flex flex-row items-center justify-between w-full p-2 shadow-md">
					<HiMenu
						fontSize={40}
						className="cursor-pointer"
						onClick={() => setToggleSidebar(true)}
					/>
					<Link to="/">
						<img src={logo} alt="Logo" className="w-28" />
					</Link>
					<Link to={`user-profile/${user?._id}`}>
						<img src={user?.image} alt="Logo" className="w-28" />
					</Link>
				</div>

				{toggleSidebar && (
					<div className="fixed z-10 w-4/5 h-screen overflow-y-auto bg-white shadow-md animate-slide-in">
						<div className="absolute flex items-center justify-end w-full p-2">
							<AiFillCloseCircle
								fontSize={30}
								className="cursor-pointer"
								onClick={() => setToggleSidebar(false)}
							/>
						</div>
						{/* desktop sidebar */}
						<Sidebar user={user && user} closeToggle={setToggleSidebar} />
					</div>
				)}
			</div>

			<div className="flex-1 h-screen pb-2 overflow-y-scroll" ref={scrollRef}>
				<Routes>
					<Route path="/user-profile/:userId" element={<UserProfile />} />
					<Route path="/*" element={<Pins user={user && user} />} />
				</Routes>
			</div>
		</div>
	);
};

export default Home;
