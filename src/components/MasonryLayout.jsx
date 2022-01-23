// rafce
import React from 'react';
import Masonry from 'react-masonry-css';
import Pin from './Pin';

// for each screen size width, we define no. of columns in 1 row in the Masonry Layout
const breakpointObj = {
	default: 4,
	3000: 6,
	2000: 5,
	1200: 3,
	1000: 2,
	500: 1,
};

const MasonryLayout = ({ pins }) => {
	return (
		<Masonry className="flex animate-slide-fwd" breakpointCols={breakpointObj}>
			{/* loop through pins and render as Pin components */}
			{pins?.map((pin) => (
				<Pin key={pin._id} pin={pin} className="w-max" />
			))}
		</Masonry>
	);
};

export default MasonryLayout;
