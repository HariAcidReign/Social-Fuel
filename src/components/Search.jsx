import React, { useState, useEffect } from 'react';

import MasonryLayout from './MasonryLayout';
import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import Spinner from './Spinner';

const Search = ({ searchTerm }) => {
	const [pins, setPins] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (searchTerm) {
			setLoading(true);

			const query = searchQuery(searchTerm.toLowerCase());
			// fetch pins pertaining to searchTerm
			client.fetch(query).then((data) => {
				setPins(data);
				setLoading(false);
			});
		} else {
			// fetch pins of all categories
			client.fetch(feedQuery).then((data) => {
				setPins(data);
				setLoading(false);
			});
		}
	}, [searchTerm]);

	return (
		<div>
			{/* whenever loading */}
			{loading && <Spinner message="Searching for pins 🤖" />}
			{/* if pins exist, then render the MasonryLayout */}
			{pins?.length !== 0 && <MasonryLayout pins={pins} />}
			{/* If not loading, no searchTerm typed and no pins available */}
			{pins?.length === 0 && searchTerm !== '' && !loading && (
				<Spinner message="Nothing to see here 🥱" />
			)}
		</div>
	);
};

export default Search;
