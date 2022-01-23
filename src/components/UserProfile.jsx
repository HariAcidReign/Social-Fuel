// rafce
import React, { useState, useEffect } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';

import {
	userCreatedPinsQuery,
	userQuery,
	userSavedPinsQuery,
} from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

// random cover image from unsplash
const randomImage =
	'https://source.unsplash.com/1600x900/?wallpapers,experimental,spirituality,history';

const activeBtnStyles =
	'bg-red-500 text-white mx-2 font-bold p-2 rounded-full w-20 shadow-md outline-none';
const notActiveBtnStyles =
	'bg-primary mx-2 text-black font-bold p-2 rounded-full w-20 shadow-md outline-none';

const UserProfile = () => {
	const navigate = useNavigate();
	const { userId } = useParams();

	const [user, setUser] = useState(null);
	const [pins, setPins] = useState(null);
	const [text, setText] = useState('Created'); // 2 states -> created & Saved
	const [activeBtn, setActiveBtn] = useState('created');

	// called whenever userId changes
	useEffect(() => {
		const query = userQuery(userId);

		client.fetch(query).then((data) => {
			setUser(data[0]);
		});
	}, [userId]);

	// created and saved
	useEffect(() => {
		if (text === 'Created') {
			const createdPinsQuery = userCreatedPinsQuery(userId);

			client.fetch(createdPinsQuery).then((data) => {
				setPins(data);
			});
		} else {
			// Saved Pins
			const savedPinsQuery = userSavedPinsQuery(userId);

			client.fetch(savedPinsQuery).then((data) => {
				setPins(data);
			});
		}
	}, [text, userId]);

	const logout = () => {
		localStorage.clear();
		navigate('/login');
	};

	if (!user) {
		return <Spinner message="Loading user profile..." />;
	}

	return (
		<div className="relative pb-2 h-full justify-center items-center">
			<div className="flex flex-col pb-5">
				<div className="relative flex flex-col mb-7">
					<div className="flex flex-col justify-center items-center">
						{/* banner */}
						<img
							src={randomImage}
							alt="cover-banner"
							className="w-full h-370 2xl:h-510 shadow-lg object-cover"
						/>
						{/* user pic */}
						<img
							src={user?.image}
							alt="profile-pic"
							className="w-32 h-32 -mt-10 rounded-full shadow-xl object-cover"
						/>
						<h1 className="font-bold text-3xl text-center mt-5 ">
							{user?.userName}
						</h1>
						<div className="absolute top-0 z-1 right-0 p-2">
							{/* logout when userId in params === current user's googleId */}
							{userId === user?._id && (
								<GoogleLogout
									clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
									render={(renderProps) => (
										<button
											type="button"
											className="bg-red-400 hover:bg-red-600 p-4 rounded-full cursor-pointer shadow-md outline-none"
											onClick={renderProps.onClick}
											disabled={renderProps.disabled}>
											<AiOutlineLogout color="white" fontSize={23} />
										</button>
									)}
									onLogoutSuccess={logout}
									cookiePolicy="single_host_origin"
								/>
							)}
						</div>
					</div>

					<div className="text-center mb-7 mt-5 flex justify-center">
						{/* Our 2 buttons -> Created and Saved */}
						<button
							type="button"
							onClick={(e) => {
								setText(e.target.textContent);
								setActiveBtn('created');
							}}
							className={`${
								activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles
							}`}>
							Created
						</button>
						<button
							type="button"
							onClick={(e) => {
								setText(e.target.textContent);
								setActiveBtn('saved');
							}}
							className={`${
								activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles
							}`}>
							Saved
						</button>
					</div>
					{/* Pins */}
					{pins?.length ? (
						<div className="px-2">
							<MasonryLayout pins={pins} />
						</div>
					) : (
						<Spinner message="No pins available ☹️" />
					)}
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
