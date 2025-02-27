import { useApolloClient, useMutation, useQuery } from '@vue/apollo-composable';
import type { AddCvProjectInput, UpdateCvProjectInput } from 'cv-graphql';
import type { Skill } from '~/global';
import {
	AddCvProject,
	AddCvSkill,
	CreateCV,
	DeleteCV,
	DeleteCvSkill,
	ExportPdfCv,
	RemoveCvProject,
	UpdateCV,
	UpdateCvProject,
	UpdateCvSkill,
} from '~/graphql/mutations/cv.graphql';
import {
	GetAllCvs,
	GetCvById,
	GetCvFullName,
	GetCvProjects,
	GetCvSkills,
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

interface UpdateCvSkillInput {
	cvId: string;
	name: string;
	categoryId: string;
	mastery: Skill['mastery'];
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
		console.error('Error adding CV:', err);
		throw err;
	}
};

export const deleteCv = async (cvId: string) => {
	const { mutate } = useMutation(DeleteCV);
	const response = await mutate({
		cv: { cvId },
	});
	return response?.data?.deleteCv;
};

export const updateCv = (cv: UpdateCvInput) => {
	const { mutate: updateCvMutation, loading, error } = useMutation(UpdateCV);

	const executeUpdate = async () => {
		try {
			const response = await updateCvMutation({ cv });
			return response!.data?.updateCv;
		} catch (err) {
			console.error('Error updating CV:', err);
			throw err;
		}
	};

	return { executeUpdate, loading, error };
};

export const getCvProjects = async (cvId: string) => {
	const apolloClient = useApolloClient().client;
	try {
		const { data } = await apolloClient.query({
			query: GetCvProjects,
			variables: { cvId },
			fetchPolicy: 'network-only',
		});
		return data.cv.projects ?? [];
	} catch (error) {
		console.error('Error fetching Cv projects:', error);
		return [];
	}
};

export const removeCvProject = async (cvId: string, projectId: string) => {
	const { mutate } = useMutation(RemoveCvProject);
	const res = await mutate({
		project: { cvId, projectId },
	});
	return res?.data?.removeCvProject;
};

export const createCvProjects = async (project: AddCvProjectInput) => {
	const { mutate: addCvProjectMutation } = useMutation(AddCvProject);

	try {
		const response = await addCvProjectMutation({ project });
		return response!.data?.addCvProject;
	} catch (err) {
		console.error('Error adding project:', err);
		throw err;
	}
};

export const updateCvProject = async (project: UpdateCvProjectInput) => {
	const { mutate: updateCvProjectMutation } = useMutation(UpdateCvProject);

	try {
		const response = await updateCvProjectMutation({ project });
		return response!.data?.updateCvProject;
	} catch (err) {
		console.error('Error updating CV project:', err);
		throw err;
	}
};

export const addCvSkill = (skill: UpdateCvSkillInput) => {
	const { mutate: addSkillMutation, loading, error } = useMutation(AddCvSkill);

	const executeAdd = async () => {
		try {
			const response = await addSkillMutation({ skill });
			return response!.data?.addCvSkill;
		} catch (err) {
			console.error('Error adding skill:', err);
			throw err;
		}
	};

	return { executeAdd, loading, error };
};

export const updateCvSkill = (skill: UpdateCvSkillInput) => {
	const {
		mutate: updateSkillMutation,
		loading,
		error,
	} = useMutation(UpdateCvSkill);

	const executeUpdate = async () => {
		try {
			const response = await updateSkillMutation({ skill });
			return response!.data?.updateCvSkill;
		} catch (err) {
			console.error('Error updating skill:', err);
			throw err;
		}
	};

	return { executeUpdate, loading, error };
};

export const deleteCvSkill = (cvId: string, skillNames: string[]) => {
	const {
		mutate: deleteSkillMutation,
		loading,
		error,
	} = useMutation(DeleteCvSkill);

	const executeDelete = async () => {
		try {
			const response = await deleteSkillMutation({
				skill: {
					cvId,
					name: skillNames,
				},
			});
			return response!.data?.deleteCvSkill;
		} catch (err) {
			console.error('Error deleting skills:', err);
			throw err;
		}
	};

	return { executeDelete, loading, error };
};

export const getCvSkills = async (cvId: string) => {
	const apolloClient = useApolloClient().client;

	try {
		const { data } = await apolloClient.query({
			query: GetCvSkills,
			variables: { cvId },
			fetchPolicy: 'no-cache',
		});
		return {
			skills: data.cv.skills,
			error: null,
		};
	} catch (error) {
		console.error('Error fetching profile skills:', error);
		return {
			skills: [],
			error,
		};
	}
};

export const exportCvToPdf = async (htmlContent: string) => {
	const margin = {
		top: '20',
		left: '20',
		bottom: '20',
		right: '20',
	};
	const { mutate } = useMutation(ExportPdfCv);
	try {
		const data = await mutate({
			pdf: { html: htmlContent, margin },
		});

		if (data) {
			const linkSource = `data:application/pdf;base64,${data.data.exportPdf}`;

			const downloadLink = document.createElement('a');
			const fileName = 'cv.pdf';
			downloadLink.href = linkSource;
			downloadLink.download = fileName;

			downloadLink.click();
		}
	} catch (error) {
		console.error('Error when exporting PDF:', error);
	}
};
