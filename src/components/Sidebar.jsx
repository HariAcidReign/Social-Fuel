// rafce
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import logo from '../assets/socialfuel-white.png';
import { categories } from '../utils/data';

const isNotActiveStyle =
	'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle =
	'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';


const Sidebar = ({ user, closeToggle }) => {
	const handleCloseSidebar = () => {
		if (closeToggle) {
			closeToggle(false);
		}
	};
	return (
		<div className="flex flex-col justify-between h-full overflow-y-scroll bg-white min-w-210 hide-scrollbar">
			<div className="flex flex-col">
				<Link
					to="/"
					className="flex items-center gap-2 px-5 pt-1 my-6 w-190"
					onClick={handleCloseSidebar}>
					<img src={logo} alt="logo" className="w-full" />
				</Link>
				<div className="flex flex-col gap-5">
					{/* in below callback function, isActive prop is given by RR-Dom lib and we destructure it within the callback function */}
					<NavLink
						to="/"
						className={({ isActive }) =>
							isActive ? isActiveStyle : isNotActiveStyle
						}
						onClick={handleCloseSidebar}>
						<RiHomeFill />
						Home
					</NavLink>
					<h3 className="px-5 mt-2 text-base 2xl:text-xl">
						Discover Categories
					</h3>
					{categories.slice(0, categories.length - 1).map((category, index) => (
						<NavLink
							to={`/category/${category.name}`}
							className={({ isActive }) =>
								isActive ? isActiveStyle : isNotActiveStyle
							}
							onClick={handleCloseSidebar}
							key={category.name}>
								<img src={category.image} alt='category-icon' className="w-8 h-8 rounded-full shadow-md" />
							{category.name}
						</NavLink>
					))}
				</div>
			</div>
			{/* check if user exists */}
			{user && (
				// runs iff user exists
				<Link
					to={`user-profile/${user._id}`}
					onClick={handleCloseSidebar}
					className="flex items-center gap-2 p-4 mx-3 my-5 mb-3 bg-white rounded-lg drop-shadow-md hover:drop-shadow-xl">
					<img
						src={user.image}
						className="w-10 h-10 rounded-full"
						alt="user-profile"
					/>
					<p>{user.userName}</p>
				</Link>
			)}
		</div>
	);
};

export default Sidebar;
