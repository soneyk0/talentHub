import { ApolloLink, HttpLink } from '@apollo/client/core';

export const authMiddleware = new ApolloLink((operation, forward) => {
	// let token;
	// if (import.meta.client) {
	// 	token = useCookie('access_token').value;
	// } else {
	// 	console.log('die');
	// 	const { getAccessToken } = useTokens();
	// 	token = getAccessToken.value;
	// }

	const token = useCookie('access_token').value;

	if (operation.operationName !== 'ResetPassword') {
		operation.setContext({
			headers: {
				authorization: token ? `Bearer ${token}` : '',
			},
		});
	}
	// console.log(operation.getContext().headers);
	return forward(operation);
});

export const httpLink = new HttpLink({
	uri: import.meta.env.VITE_GRAPHQL_URI,
});
