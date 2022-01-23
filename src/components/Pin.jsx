// rafce
// This is how one inidividual Pin is defined. Feed contains MasonryLayout which contains Pins.

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // for generating unique resource identifiers ie. IDs for each post
import { MdDownloadForOffline } from 'react-icons/md'; // https://react-icons.github.io/react-icons/icons?name=md [material design]
import { AiTwotoneDelete } from 'react-icons/ai'; // https://react-icons.github.io/react-icons/icons?name=ai [ant design]
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'; // https://react-icons.github.io/react-icons/icons?name=bs [bootstrap design]

import { client, urlFor } from '../client';
import { fetchUser } from '../utils/fetchUser';

// de-structuring props based on pins.js schema
const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
	const [postHovered, setPostHovered] = useState(false);
	const navigate = useNavigate();
	const user = fetchUser();

	// check if user has already saved a post
	let alreadySaved = save?.filter(
		(item) => item?.postedBy?._id === user?.googleId
	);
	// filter returns an array of objects that match the condition.
	// Here alreadySaved is an array of 1 object (if user has already saved the post), or an empty array (if user has not saved the post)

	alreadySaved = alreadySaved?.length > 0 ? alreadySaved : []; // if alreadySaved is an array of 1 object, it will be true, else it will be false
	// alreadySaved array initially contains list of users who have saved this item/post. Filter returns [<userId>] if user has already saved the post, and [] if user has not saved the post.

	const savePin = (id) => {
		if (!alreadySaved) {
			// update doc in sanity DB
			client
				.patch(id)
				.setIfMissing({ save: [] })
				.insert('after', 'save[-1]', [
					{
						_key: uuidv4(),
						userId: user.googleId,
						postedBy: {
							_type: 'postedBy',
							_ref: user.googleId,
						},
					},
				])
				.commit()
				.then(() => {
					window.location.reload();
				});
		}
	};

	const deletePin = (id) => {
		client // delete doc in sanity DB
			.delete(id)
			.then(() => {
				// add alert component here after deleting post
				window.location.reload();
			});
	};

	return (
		<div className="m-2">
			<div
				onMouseEnter={() => setPostHovered(true)}
				onMouseLeave={() => setPostHovered(false)}
				onClick={() => navigate(`/pin-detail/${_id}`)}
				className="relative w-auto overflow-hidden transition-all duration-500 ease-in-out rounded-lg cursor-zoom-in hover:shadow-lg">
				{/* renders iff user image exists. Kinda taken care of by "alt" but error handling, good */}
				{image && (
					<img
						src={urlFor(image).width(1000).url()}
						className="w-full rounded-lg"
						alt="user-post"
					/>
				)}
				{postHovered && (
					<div
						className="absolute top-0 z-50 flex flex-col justify-between w-full h-full p-1 pt-2 pb-2 pr-2"
						style={{ height: '100%' }}>
						<div className="flex items-center justify-between">
							{/* Download Pin Functionality */}
							<div className="flex gap-2">
								{/* stopPropagation doesn't allow a click on icon to download and THEN go to PinDetails. It STOPS propagation with download */}
								<a
									href={`${image?.asset?.url}?dl=`}
									download
									onClick={(e) => e.stopPropagation()}
									className="flex items-center justify-center text-xl bg-white rounded-full outline-none opacity-75 w-7 h-7 text-dark hover:opacity-100 hover:shadow-md">
									<MdDownloadForOffline />
								</a>
							</div>
							{/* Save Pin Functionality */}
							{alreadySaved?.length !== 0 ? (
								<button
									type="button"
									className="px-5 py-1 text-base font-bold text-white bg-gray-900 outline-none opacity-100 rounded-3xl hover:shadow-md">
									Saved
								</button>
							) : (
								<button
									onClick={(e) => {
										e.stopPropagation();
										savePin(_id);
									}}
									type="button"
									className="px-5 py-1 text-base font-bold text-white bg-red-500 outline-none opacity-70 hover:opacity-100 rounded-3xl hover:shadow-md">
									Save
								</button>
							)}
						</div>
						{/* Link to image site that user provides */}
						<div className="flex justify-between items-center gap-2 w-full">
							{/* iff destination exists then render it */}
							{destination && (
								<a
									href={destination}
									target="_blank"
									rel="noreferrer"
									className="flex bg-white gap-2 items-center text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-75 hover:opacity-100 hover:shadow-md">
									<BsFillArrowUpRightCircleFill /> {destination.slice(8, 19)}
								</a>
							)}
							{postedBy?._id === user?.googleId && (
								// if post author is current user, then delete button is rendered
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										deletePin(_id);
									}}
									className="text-base font-bold p-2 bg-white outline-none opacity-70 hover:opacity-100 rounded-3xl hover:shadow-md">
									<AiTwotoneDelete />
								</button>
							)}
						</div>
					</div>
				)}
			</div>
			{/* link to user profile */}
			<Link
				to={`user-profile/${postedBy?._id}`}
				className="flex gap-2 mt-2 items-center">
				<img
					className="w-8 h-8 rounded-full object-cover"
					src={postedBy?.image}
					alt="user-profile"
				/>
				<p className="text-sm font-bold text-gray-700">{postedBy?.userName}</p>
			</Link>
		</div>
	);
};

export default Pin;
