// components folder has all the smaller components and containers folder has all the bigger components which are
// made up of smaller components

//rafce
import React from 'react';
import GoogleLogin from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { client } from '../client';

import coverVideo from '../assets/cover-video.mp4';
import logo from '../assets/socialfuel.png';

const Login = () => {
	const navigate = useNavigate(); // hook to navigate to different routes
	const responseGoogle = (response) => {
		// console.log(response);
		localStorage.setItem('user', JSON.stringify(response.profileObj));
		// response contains profileObj object in it, from which we will pick metadata (name, imageUrl, googleId)
		const { name, imageUrl, googleId } = response.profileObj;
		// make a saniy doc with metadata to represent user profile (schema is as per user.js in backend)
		const doc = {
			_id: googleId,
			_type: 'user',
			userName: name,
			image: imageUrl,
		};
		// _type tell sanity what type of doc we are making. Since user schema takes in userName and image, they are passed here
		// now we should send this data to sanity backend database
		client.createIfNotExists(doc).then(() => {
			navigate('/', { replace: true }); // on creation, we are redirected to home page
		});
	};

	return (
		<div className="flex flex-col items-center justify-start h-screen">
			<div className="relative w-full h-full">
				<video
					className="absolute top-0 left-0 object-cover w-full h-full"
					src={coverVideo}
					type="video/mp4"
					autoPlay
					loop
					controls={false}
					muted
				/>

				<div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
					<div className="p-5">
						<img src={logo} alt={logo} className="w-64 rounded" />
					</div>

					<div className="shadow-2xl">
						<GoogleLogin
							clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
							render={(renderProps) => (
								<button
									type="button"
									className="flex items-center justify-center p-3 rounded-full outline-none bg-mainColor"
									onClick={renderProps.onClick}
									disabled={renderProps.disabled}>
									<FcGoogle className="mr-4" /> Continue with Google
								</button>
							)}
							onSuccess={responseGoogle}
							onFailure={responseGoogle}
							cookiePolicy="single_host_origin"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
