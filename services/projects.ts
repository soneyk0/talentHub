import { useApolloClient } from '@vue/apollo-composable';
import type { Project } from 'cv-graphql';
import { GetAllProjects } from '~/graphql/queries/projects.graphql';

export const getAllProjects = async () => {
	const apolloClient = useApolloClient().client;
	try {
		const { data } = await apolloClient.query<{ projects: Project[] }>({
			query: GetAllProjects,
			fetchPolicy: 'network-only',
		});

		return data.projects;
	} catch (error) {
		console.error('Error fetching projects:', error);
		return [];
	}
};
