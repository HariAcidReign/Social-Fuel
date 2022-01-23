// connecting frontend and sanity backend (middleware)
import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
	projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
	dataset: 'production',
	apiVersion: '2021-12-25',
	useCdn: true,
	token: process.env.REACT_APP_SANITY_TOKEN,
});

// directly from sanity docs
const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);
