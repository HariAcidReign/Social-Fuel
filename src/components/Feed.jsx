import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // useParams hook for getting params from url to know which category user is at
import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';

import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = () => {
	const [loading, setLoading] = useState(false);
	const [pins, setPins] = useState(null);
	const { categoryId } = useParams(); // this hook gives us currently chosen category from url

	// useEffect (fetching feed from Sanity) runs on both componentDidMount and when user changes category (categoryId changes)
	useEffect(() => {
		setLoading(true);

		if (categoryId) {
			// returns posts from Sanity for specific category
			// similar to Line 28 in Home.jsx
			const query = searchQuery(categoryId);

			client.fetch(query).then((data) => {
				setPins(data);
				setLoading(false);
			});
		} else {
			// returns all posts from Sanity
			client.fetch(feedQuery).then((data) => {
				setPins(data);
				setLoading(false);
			});
		}
	}, [categoryId]);

	if (loading) return <Spinner message="Fuelling your feed ⛽" />;
	return (
		<div>
			{/* if Pins exist, then render the MasonryLayout */}
			{pins?.length ? (
				<MasonryLayout pins={pins} />
			) : (
				<Spinner message="Nothing to see here 🥱" />
			)}
		</div>
	);
};

export default Feed;
