// utils contains functions we will use across our entire codebase, but we keep them separate from our components
// https://www.sanity.io/docs/groq-syntax

// in this file, we will fetch data from Sanity and store it in our local storage
export const categories = [
	{
		name: 'Cars',
		image: 'https://bit.ly/3Ig2Rye',
	},
	{
		name: 'Food',
		image: 'https://bit.ly/3fvDo7T',
	},
	{
		name: 'Wallpapers',
		image: 'https://bit.ly/32c2Wnq',
	},
	{
		name: 'Music',
		image: 'https://bit.ly/3Ievv2L',
	},
	{
		name: 'Gadgets',
		image: 'https://bit.ly/3KnYsvh',
	},
	{
		name: 'Travel',
		image: 'https://bit.ly/3rm71ha',
	},
	{
		name: 'Others',
		image: 'https://bit.ly/3FD5EQv',
	},
];

export const userQuery = (userId) => {
	const query = `*[_type == "user" && _id == "${userId}"]`;
	// sanity query to return user with matching id
	return query;
};

export const searchQuery = (searchTerm) => {
	const query = `*[_type == "pin" && title match "${searchTerm}*" || category match "${searchTerm}*" || about match "${searchTerm}*"]{
		image {
			asset->{
				url
			}
		}, 
		_id, 
		destination,
		postedBy -> {
			_id, 
			userName,
			image
		}, 
		save[] {
			_key,
			postedBy -> {
				_id, 
				userName,
				image
			}, 
		}, 
	}`;
	// refer pin.js for pin schema
	// we need to get back an image asset which contains the url we need to display
	// sanity query to return posts with matching searchTerm in title, category or about
	// the * after {searchTerm} means that it will start matching terms even before user finishes typing the searchTerm
	return query;
};

// for querying all posts (not considering searchTerm). As no params, we don't need a function and we just directly type the query
// the projection part is same as for searchQuery
export const feedQuery = `*[_type == "pin"] | order(_createdAt desc) {
	image {
		asset->{
			url
		}
	}, 
	_id, 
	destination,
	postedBy -> {
		_id, 
		userName,
		image
	}, 
	save[] {
		_key,
		postedBy -> {
			_id, 
			userName,
			image
		}, 
	}, 
}`;

export const pinDetailQuery = (pinId) => {
	const query = `*[_type == "pin" && _id == '${pinId}']{
	  image{
		asset->{
		  url
		}
	  },
	  _id,
	  title, 
	  about,
	  category,
	  destination,
	  postedBy->{
		_id,
		userName,
		image
	  },
	 save[]{
		postedBy->{
		  _id,
		  userName,
		  image
		},
	  },
	  comments[]{
		comment,
		_key,
		postedBy->{
		  _id,
		  userName,
		  image
		},
	  }
	}`;
	return query;
};

export const pinDetailMorePinQuery = (pin) => {
	const query = `*[_type == "pin" && category == '${pin.category}' && _id != '${pin._id}' ]{
	  image{
		asset->{
		  url
		}
	  },
	  _id,
	  destination,
	  postedBy->{
		_id,
		userName,
		image
	  },
	  save[]{
		_key,
		postedBy->{
		  _id,
		  userName,
		  image
		},
	  },
	}`;
	return query;
};

export const userSavedPinsQuery = (userId) => {
	const query = `*[_type == 'pin' && '${userId}' in save[].userId ] | order(_createdAt desc) {
	  image{
		asset->{
		  url
		}
	  },
	  _id,
	  destination,
	  postedBy->{
		_id,
		userName,
		image
	  },
	  save[]{
		postedBy->{
		  _id,
		  userName,
		  image
		},
	  },
	}`;
	return query;
};
export const userCreatedPinsQuery = (userId) => {
	const query = `*[_type == 'pin' && userId == '${userId}'] | order(_createdAt desc) {
	  image{
		asset->{
		  url
		}
	  },
	  _id,
	  destination,
	  postedBy->{
		_id,
		userName,
		image
	  },
	  save[]{
		postedBy->{
		  _id,
		  userName,
		  image
		},
	  },
	}`;
	return query;
};
