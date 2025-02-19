import { useApolloClient, useMutation, useQuery } from '@vue/apollo-composable';
import { CreateCV, DeleteCV, UpdateCV } from '~/graphql/mutations/cv.graphql';
import {
	GetAllCvs,
	GetCvById,
	GetCvFullName,
} from '~/graphql/queries/cv.graphql';

interface CreateCV {
	description: string;
	education: string;
	name: string;
	userId: string;
}

interface UpdateCvInput {
	cvId: string;
	name: string;
	education: string;
	description: string;
}

export const getCvFullname = (cvId: string) => {
	const { result, loading, error } = useQuery<{
		cv: { name: string };
	}>(GetCvFullName, { cvId });

	let fullname = '';

	if (result.value) {
		fullname = result.value.cv.name || '';
	}

	return { fullname, loading, error };
};

export const getCvById = async (cvId: string, force = false) => {
	const apolloClient = useApolloClient().client;

	try {
		const { data } = await apolloClient.query({
			query: GetCvById,
			variables: { cvId },
			fetchPolicy: 'no-cache',
		});

		return {
			cv: data.cv,
			error: null,
		};
	} catch (error) {
		console.error('Error fetching cv by ID:', error);
		return {
			cv: null,
			error,
		};
	}
};

export const getAllCvs = async () => {
	const apolloClient = useApolloClient().client;
	try {
		const { data } = await apolloClient.query({
			query: GetAllCvs,
			fetchPolicy: 'network-only',
		});

		return data.cvs ?? [];
	} catch (error) {
		console.error('Error fetching CVs:', error);
		return [];
	}
};

export const createCv = async (cv: CreateCV) => {
	const { mutate: addCVMutation, loading, error } = useMutation(CreateCV);

	try {
		const response = await addCVMutation({ cv });
		return response!.data?.createCv;
	} catch (err) {
		console.error('Error adding skill:', err);
		throw err;
	}
};

export const deleteCv = async (cvId: string) => {
	const { mutate } = useMutation(DeleteCV);
	await mutate({
		cv: { cvId },
	});
};

export const updateСv = (cv: UpdateCvInput) => {
	const { mutate: updateCvMutation, loading, error } = useMutation(UpdateCV);

	const executeUpdate = async () => {
		try {
			const response = await updateCvMutation({ cv });
			return response!.data?.cvs;
		} catch (err) {
			console.error('Error updating CV:', err);
			throw err;
		}
	};

	return { executeUpdate, loading, error };
};
