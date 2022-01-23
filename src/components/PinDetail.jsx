import React, { useState, useEffect } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

const PinDetail = ({ user }) => {
	const [pins, setPins] = useState(null);
	const [pinDetail, setPinDetail] = useState(null);
	const [comment, setComment] = useState('');
	const [addingComment, setAddingComment] = useState(false); // is user adding Comments?

	// to access ID of current post
	const { pinId } = useParams(); // /:pin-id is a dynamic parameter found in the URL, and this is accessed by useParams()

	const postComment = () => {
		if (comment) {
			setAddingComment(true);
		}
		// add comment to Sanity
		client
			.patch(pinId)
			.setIfMissing({ comments: [] })
			// insert comment into comments array's end (-1)
			.insert('after', 'comments[-1]', [
				{
					comment,
					_key: uuidv4(),
					postedBy: {
						_type: 'postedBy',
						_ref: user._id,
					},
				},
			])
			.commit()
			.then(() => {
				fetchPinDetails();
				setComment('');
				setAddingComment(false);
			});
	};

	// function to fetch all pinDetails from Sanity DB
	const fetchPinDetails = () => {
		let query = pinDetailQuery(pinId);
		if (query) {
			client.fetch(query).then((data) => {
				setPinDetail(data[0]);
				// as data is an array of pins
				if (data[0]) {
					query = pinDetailMorePinQuery(data[0]);
					client.fetch(query).then((res) => {
						setPins(res);
					});
					// we get one individual pin first, and then get all related pins to that initial pin
				}
			});
		}
	};

	// when do we call fetchPinDetails function -> whenever the pinId changes (so ass it in componentDidMount)
	useEffect(() => {
		fetchPinDetails();
	}, [pinId]);

	// useEffect should be called above all if statements, otherwise it will not work
	if (!pinDetail) return <Spinner message="Still Loading" />;

	return (
		<>
			<div
				className="flex xl:flex-row flex-col m-auto bg-white"
				style={{ maxWidth: '1500px', borderRadius: '32px' }}>
				<div className="flex justify-center items-center md:items-start flex-start">
					<img
						src={urlFor(pinDetail?.image).width(400).url()}
						alt="User Pin"
						className="rounded-t-3xl rounded-b-sm"
					/>
				</div>
				{/* Image and URL */}
				<div className="w-full p-5 flex-1 xl:min-w-620">
					<div className="flex justify-between items-center ">
						{/* Download */}
						<div className="flex gap-2 items-center ">
							<a
								href={`${pinDetail?.image?.asset?.url}?dl=`}
								download
								onClick={(e) => e.stopPropagation()}
								className="flex bg-red-500 gap-2 items-center text-white font-bold p-2 pl-4 pr-4 rounded-full opacity-75 hover:opacity-100 hover:shadow-md">
								<MdDownloadForOffline /> Download Image
							</a>
						</div>
						{/* Destination URL */}
						<a
							href={pinDetail?.destination}
							target="_blank"
							rel="noreferrer"
							className="flex bg-white gap-2 items-center text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-75 hover:opacity-100 hover:shadow-md">
							<BsFillArrowUpRightCircleFill /> Visit Site
						</a>
					</div>
					{/* Title, Comments etc */}
					<div>
						<h1 className="text-4xl font-bold break-words mt-5">
							{pinDetail?.title}
						</h1>
						<p className="mt-3 text-gray-500">{pinDetail?.about}</p>
					</div>
					<Link
						to={`user-profile/${pinDetail?.postedBy?._id}`}
						className="flex gap-2 mt-5 items-center bg-white rounded-lg">
						<img
							className="w-8 h-8 rounded-full object-cover"
							src={pinDetail?.postedBy?.image}
							alt="user-profile"
						/>
						<p className="text-sm font-semibold capitalize text-gray-700">
							{pinDetail?.postedBy?.userName}
						</p>
					</Link>
					{/* Comments Section */}
					<h2 className="text-2xl mt-5 text-bold">Comments</h2>
					<p className="text-md font-style: italic text-gray-700 mt-4">
						Share feedback, ask a question or give a high five
					</p>

					<div className="max-h-370 overflow-y-auto">
						{pinDetail?.comments?.map((comment, index) => (
							// style of each comment
							<div
								className="flex gap-2 bg-white rounded-lg items-center mt-5"
								key={index}>
								<Link to={`user-profile/${pinDetail?.postedBy?._id}`}>
									<img
										src={comment?.postedBy?.image}
										alt="commenter-profile"
										className="w-10 h-10 rounded-full cursor-pointer"
									/>
								</Link>
								<div className="flex flex-col">
									<Link to={`user-profile/${pinDetail?.postedBy?._id}`}>
										<p className="font-bold cursor-pointer">
											{comment?.postedBy?.userName}
										</p>
									</Link>
									<p>{comment.comment}</p>
								</div>
							</div>
						))}
					</div>
					{/* Add your own comments section */}
					<div className="flex flex-wrap mt-6 gap-3 justify-center items-center">
						<Link to={`user-profile/${pinDetail?.postedBy?._id}`}>
							<img
								className="w-10 h-10 rounded-full cursor-pointer"
								src={pinDetail?.postedBy?.image}
								alt="user-profile"
							/>
						</Link>
						<input
							className="flex-1 border-gray-100 rounded-2xl outline-none border-2 p-2 focus:drop-shadow-lg focus:border-gray-300 ease-in duration-300"
							type="text"
							placeholder="Add a comment 😀"
							value={comment}
							onChange={(e) => setComment(e.target.value)}
						/>
						<button
							type="button"
							className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none hover:bg-red-700"
							onClick={postComment}>
							{addingComment ? 'Adding...' : 'Post'}
						</button>
					</div>
				</div>
			</div>
			{/* Show related pins, iff they exist*/}
			{pins?.length > 0 ? (
				// <> is a React fragment ie. <React.Fragment> -> substitute for <div>
				<>
					<h2 className="text-center font-bold text-2x mt-8 mb-4">
						More like this
					</h2>
					<MasonryLayout pins={pins} />
				</>
			) : (
				<Spinner message="Finding similar pins 🔍 If it's taking too long, then there isn't any 😂 " />
			)}
		</>
	);
};

export default PinDetail;
