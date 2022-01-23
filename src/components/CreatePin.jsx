import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { client } from '../client';
import Spinner from './Spinner';

// importing categories from Sanity.
// categories [{name: 'Games', image: ''}]
import { categories } from '../utils/data';

const CreatePin = ({ user }) => {
	const navigate = useNavigate();

	// all required states declarations
	const [title, setTitle] = useState('');
	const [about, setAbout] = useState('');
	const [destination, setDestination] = useState('');
	const [category, setCategory] = useState(null);

	const [loading, setLoading] = useState(false);
	const [fields, setFields] = useState(false); // error state to check if all fields have been entered. true -> incomplete fields exist
	const [imageAsset, setImageAsset] = useState(null);
	const [wrongImageType, setWrongImageType] = useState(false);

	const uploadImage = (e) => {
		const selectedFile = e.target.files[0];
		// check the typeof selectedFile
		if (
			selectedFile.type === 'image/png' ||
			selectedFile.type === 'image/svg' ||
			selectedFile.type === 'image/jpeg' ||
			selectedFile.type === 'image/gif' ||
			selectedFile.type === 'image/tiff'
		) {
			// add video feat later
			setWrongImageType(false);
			setLoading(true);

			// upload the file to Sanity
			client.assets
				.upload('image', selectedFile, {
					contentType: selectedFile.type,
					filename: selectedFile.name,
				})
				.then((document) => {
					setImageAsset(document);
					setLoading(false);
				})
				.catch((error) => {
					console.log(`Image upload error - ${error}`);
				});
		} else {
			setWrongImageType(true);
		}
	};

	const savePin = () => {
		if (!title || !about || !destination || !category || !imageAsset?._id) {
			setFields(true);
			setTimeout(() => {
				setFields(false); // after 2 sec, make it false so that the "Please fill in all fields" message will disappear
			}, 2000);
		} else {
			const doc = {
				_type: 'pin',
				title,
				about,
				destination,
				image: {
					_type: 'image',
					asset: {
						_type: 'reference',
						_ref: imageAsset?._id,
					},
				},
				userId: user?._id,
				postedBy: {
					_type: 'postedBy',
					_ref: user?._id,
				},
				category,
			};

			client.create(doc)
				.then(() => {
					navigate('/');
				})
		}
	};

	return (
		<div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
			{fields && (
				<p className="mb-5 font-bold transition-all duration-150 ease-in">
					Please fill in all the required fields 🤗
				</p>
			)}
			<div className="flex lg:flex-row flex-col justify-center items-center lg:p-3 p-3 lg:w-4/5 w-full">
				<div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
					<div className="flex justify-center items-center flex-col border-2 border-dotted cursor-pointer border-gray-300 p-3 w-full h-420">
						{loading && <Spinner />}
						{wrongImageType && (
							<p className="font-bold mb-5">Invalid image type 👀</p>
						)}
						{/* no image asset added yet */}
						{!imageAsset ? (
							<label>
								<div className="flex flex-col items-center justify-center h-full cursor-pointer">
									<div className="flex flex-col items-center justify-center">
										<p className="font-bold text-2xl">
											<AiOutlineCloudUpload />
										</p>
										<p className="text-lg mt-5">Click to upload</p>
									</div>
									<p className="mt-32 text-gray-400">
										Use high quality JPEG, JPG, PNG, SVG, GIF or MP4 less than
										20 MB
									</p>
								</div>
								<input
									type="file"
									name="upload-image"
									onChange={uploadImage}
									className="w-0 h-0"></input>
							</label>
						) : (
							// if asset already uploaded, then show the uploaded image
							<div className="relative h-full">
								<img
									src={imageAsset?.url}
									alt="uploaded-pic"
									className="w-full h-full object-cover"
								/>
								<button
									type="button"
									onClick={() => {
										setImageAsset(null);
									}}
									className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl font-bold cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in">
									<MdDelete />
								</button>
							</div>
						)}
					</div>
				</div>
				{/* Rest of the post details as form*/}
				<div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Title"
						className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2 w-full"
					/>
					<input
						type="text"
						value={about}
						onChange={(e) => setAbout(e.target.value)}
						placeholder="Description"
						className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2 w-full"
					/>
					<input
						type="text"
						value={destination}
						onChange={(e) => setDestination(e.target.value)}
						placeholder="Destination URL"
						className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2 w-full"
					/>
					<div className="flex flex-col">
						<div>
							<p className="mb-2 font-semibold text-lg sm:text-xl ">
								Choose a pin category
							</p>
							<select
								onChange={(e) => setCategory(e.target.value)}
								classname="outline-none w-4/5 text-base border-b-2 border-gray-700 p-2 rounded-md cursor-pointer">
								<option value="Others" className="bg-white">
									Select a category
								</option>
								{categories.map((category) => (
									<option
										className="text-base border-0 outline-none capitalize bg-white text-black"
										value={category.name}>
										{category.name}
									</option>
								))}
							</select>
						</div>
						<div className="flex justify-end items-end mt-5">
							<button
									type="button"
									onClick={savePin}
									className="px-5 py-1 text-base font-bold text-white bg-red-500 outline-none opacity-100 rounded-3xl hover:shadow-md">
									Create Pin
								</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreatePin;
