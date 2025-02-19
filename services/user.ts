import { useApolloClient, useMutation } from '@vue/apollo-composable';
import type { Language, Skill } from '~/global';
import {
	AddProfileLanguage,
	AddProfileSkill,
	DeleteAvatar,
	DeleteProfileLanguage,
	DeleteProfileSkill,
	UpdateProfile,
	UpdateProfileLanguage,
	UpdateProfileSkill,
	UpdateUser,
	UploadAvatar,
} from '~/graphql/mutations/user.graphql';
import {
	GetAllDepartments,
	GetAllLanguages,
	GetAllPositions,
	GetAllSkills,
	GetAllUsers,
	GetProfileLanguages,
	GetProfileSkills,
	GetSkillCategories,
	GetUserById,
	GetUserFullName,
} from '~/graphql/queries/user.graphql';

interface UpdateUserInput {
	userId: string;
	departmentId?: string;
	positionId?: string;
	role?: string;
}

interface UpdateProfileInput {
	userId: string;
	first_name: string;
	last_name: string;
}

interface UpdateProfileSkillInput {
	userId: string;
	name: string;
	categoryId: string;
	mastery: Skill['mastery'];
}

interface UpdateProfileLanguageInput {
	userId: string;
	name: string;
	proficiency: Language['proficiency'];
}

interface UploadAvatarInput {
	userId: string;
	base64: string;
	size: number;
	type: string;
}

export const getUserById = async (userId: string, skipCache = false) => {
	const apolloClient = useApolloClient().client;

	try {
		const { data } = await apolloClient.query({
			query: GetUserById,
			variables: { userId },
			fetchPolicy: skipCache ? 'network-only' : 'cache-first',
		});

		return {
			user: data.user,
			error: null,
		};
	} catch (error) {
		console.error('Error fetching user by ID:', error);
		return {
			user: null,
			error,
		};
	}
};

export const getAllDepartments = async () => {
	const apolloClient = useApolloClient().client;

	try {
		const { data } = await apolloClient.query({
			query: GetAllDepartments,
		});

		return {
			departments: data.departments,
			error: null,
		};
	} catch (error) {
		console.error('Error fetching departments:', error);
		return {
			departments: [],
			error,
		};
	}
};

export const getAllPositions = async () => {
	const apolloClient = useApolloClient().client;

	try {
		const { data } = await apolloClient.query({
			query: GetAllPositions,
		});

		return {
			positions: data.positions,
			error: null,
		};
	} catch (error) {
		console.error('Error fetching positions:', error);
		return {
			positions: [],
			error,
		};
	}
};

export const updateUser = (user: UpdateUserInput) => {
	const {
		mutate: updateUserMutation,
		loading,
		error,
	} = useMutation(UpdateUser);

	const executeUpdate = async () => {
		try {
			const response = await updateUserMutation({ user });
			return response!.data?.updateUser;
		} catch (err) {
			console.error('Error updating user:', err);
			throw err;
		}
	};

	return { executeUpdate, loading, error };
};

export const updateProfile = (profile: UpdateProfileInput) => {
	const {
		mutate: updateProfileMutation,
		loading,
		error,
	} = useMutation(UpdateProfile);

	const executeUpdate = async () => {
		try {
			const response = await updateProfileMutation({ profile });
			return response!.data?.updateProfile;
		} catch (err) {
			console.error('Error updating profile:', err);
			throw err;
		}
	};

	return { executeUpdate, loading, error };
};

export const uploadAvatar = (avatar: UploadAvatarInput) => {
	const { mutate: executeUpload, loading, error } = useMutation(UploadAvatar);

	return {
		executeUpload: () => executeUpload({ avatar }),
		loading,
		error,
	};
};

export const deleteAvatar = (userId: string) => {
	const { mutate: executeDelete, loading, error } = useMutation(DeleteAvatar);

	return {
		executeDelete: () =>
			executeDelete({
				avatar: { userId },
			}),
		loading,
		error,
	};
};

export const getProfileSkills = async (userId: string) => {
	const apolloClient = useApolloClient().client;

	try {
		const { data } = await apolloClient.query({
			query: GetProfileSkills,
			variables: { userId },
			fetchPolicy: 'no-cache',
		});
		return {
			skills: data.profile.skills,
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

export const getSkillCategories = async () => {
	const apolloClient = useApolloClient().client;

	try {
		const { data } = await apolloClient.query({
			query: GetSkillCategories,
		});
		return {
			categories: data.skillCategories,
			error: null,
		};
	} catch (error) {
		console.error('Error fetching skill categories:', error);
		return {
			categories: [],
			error,
		};
	}
};

export const getAllSkills = async () => {
	const apolloClient = useApolloClient().client;

	try {
		const { data } = await apolloClient.query({
			query: GetAllSkills,
		});
		return {
			skills: data.skills,
			error: null,
		};
	} catch (error) {
		console.error('Error fetching skills:', error);
		return {
			skills: [],
			error,
		};
	}
};

export const updateProfileSkill = (skill: UpdateProfileSkillInput) => {
	const {
		mutate: updateSkillMutation,
		loading,
		error,
	} = useMutation(UpdateProfileSkill);

	const executeUpdate = async () => {
		try {
			const response = await updateSkillMutation({ skill });
			return response!.data?.updateProfileSkill;
		} catch (err) {
			console.error('Error updating skill:', err);
			throw err;
		}
	};

	return { executeUpdate, loading, error };
};

export const addProfileSkill = (skill: UpdateProfileSkillInput) => {
	const {
		mutate: addSkillMutation,
		loading,
		error,
	} = useMutation(AddProfileSkill);

	const executeAdd = async () => {
		try {
			const response = await addSkillMutation({ skill });
			return response!.data?.addProfileSkill;
		} catch (err) {
			console.error('Error adding skill:', err);
			throw err;
		}
	};

	return { executeAdd, loading, error };
};

export const deleteProfileSkill = (userId: string, skillNames: string[]) => {
	const {
		mutate: deleteSkillMutation,
		loading,
		error,
	} = useMutation(DeleteProfileSkill);

	const executeDelete = async () => {
		try {
			const response = await deleteSkillMutation({
				skill: {
					userId,
					name: skillNames,
				},
			});
			return response!.data?.deleteProfileSkill;
		} catch (err) {
			console.error('Error deleting skills:', err);
			throw err;
		}
	};

	return { executeDelete, loading, error };
};

export const getProfileLanguages = async (userId: string) => {
	const apolloClient = useApolloClient().client;

	try {
		const { data } = await apolloClient.query({
			query: GetProfileLanguages,
			variables: { userId },
			fetchPolicy: 'no-cache',
		});
		return {
			languages: data.profile.languages,
			error: null,
		};
	} catch (error) {
		console.error('Error fetching profile languages:', error);
		return {
			languages: [],
			error,
		};
	}
};

export const getAllLanguages = async () => {
	const apolloClient = useApolloClient().client;

	try {
		const { data } = await apolloClient.query({
			query: GetAllLanguages,
		});
		return {
			languages: data.languages,
			error: null,
		};
	} catch (error) {
		console.error('Error fetching languages:', error);
		return {
			languages: [],
			error,
		};
	}
};

export const updateProfileLanguage = (language: UpdateProfileLanguageInput) => {
	const {
		mutate: updateLanguageMutation,
		loading,
		error,
	} = useMutation(UpdateProfileLanguage);

	const executeUpdate = async () => {
		try {
			const response = await updateLanguageMutation({ language });
			return response!.data?.updateProfileLanguage;
		} catch (err) {
			console.error('Error updating language:', err);
			throw err;
		}
	};

	return { executeUpdate, loading, error };
};

export const addProfileLanguage = (language: UpdateProfileLanguageInput) => {
	const {
		mutate: addLanguageMutation,
		loading,
		error,
	} = useMutation(AddProfileLanguage);

	const executeAdd = async () => {
		try {
			const response = await addLanguageMutation({ language });
			return response!.data?.addProfileLanguage;
		} catch (err) {
			console.error('Error adding language:', err);
			throw err;
		}
	};

	return { executeAdd, loading, error };
};

export const deleteProfileLanguage = (
	userId: string,
	languageNames: string[]
) => {
	const {
		mutate: deleteLanguageMutation,
		loading,
		error,
	} = useMutation(DeleteProfileLanguage);

	const executeDelete = async () => {
		try {
			const response = await deleteLanguageMutation({
				language: {
					userId,
					name: languageNames,
				},
			});
			return response!.data?.deleteProfileLanguage;
		} catch (err) {
			console.error('Error deleting languages:', err);
			throw err;
		}
	};

	return { executeDelete, loading, error };
};

export const getUserFullname = async (userId: string) => {
	const apolloClient = useApolloClient().client;

	try {
		const { data } = await apolloClient.query({
			query: GetUserFullName,
			variables: { userId },
			fetchPolicy: 'no-cache',
		});
		return {
			fullname: data.user.profile.full_name,
			email: data.user.email,
			error: null,
		};
	} catch (error) {
		console.error('Error fetching user details:', error);
		return {
			fullname: '',
			email: '',
			error,
		};
	}
};

export const getAllUsers = async () => {
	const apolloClient = useApolloClient().client;

	try {
		const { data } = await apolloClient.query({
			query: GetAllUsers,
		});
		return {
			users: data.users,
			error: null,
		};
	} catch (error) {
		console.error('Error fetching users:', error);
		return {
			users: [],
			error,
		};
	}
};
