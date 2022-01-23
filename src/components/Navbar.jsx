import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
	const navigate = useNavigate(); // navigate hook

	if (!user) return null;
	// show the navbar iff user is logged in
	return (
		<div className="flex w-full gap-2 mt-5 md:gap-5 pb-7">
			<div className="flex items-center justify-start w-full px-2 bg-white border-none rounded-lg outline-none drop-shadow-md focus-within:shadow-lg">
				<IoMdSearch fontSize={21} className="ml-1" />
				<input
					type="text"
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="Search"
					value={searchTerm}
					onFocus={() => navigate('/search')}
					className="w-full p-2 bg-white outline-none"
				/>
			</div>
			<div className="flex gap-3 ">
				<Link
					to="/create-pin"
					className="flex items-center justify-center w-12 h-12 text-white bg-black rounded-lg md:w-14 md:h-12">
					<IoMdAdd fontSize={21} />
				</Link>
			</div>
		</div>
	);
};

export default Navbar;
