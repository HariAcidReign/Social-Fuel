// we will get user from Sanity and not from Local storage..hence 'userInfo' and not 'user'

export const fetchUser = () => {
	const userInfo =
		localStorage.getItem('user') !== undefined
			? JSON.parse(localStorage.getItem('user'))
			: localStorage.clear();

	return userInfo;
};
