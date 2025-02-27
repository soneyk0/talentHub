import { describe } from 'vitest';

describe('useCurrentUser composable', () => {
	beforeEach(() => {
		vi.clearAllMocks();

		const { clearUserData } = useCurrentUser();
		clearUserData();
	});

	test('initial state is empty', () => {
		const { getCurrentUserId, userData } = useCurrentUser();

		expect(getCurrentUserId.value).toBeNull();
		expect(userData).toEqual({
			photo: '',
			firstName: '',
			lastName: '',
			email: '',
			profileLink: '',
			department: '',
			position: '',
		});
	});

	test('setCurrentUserId sets the user id', () => {
		const { getCurrentUserId, setCurrentUserId } = useCurrentUser();

		setCurrentUserId('123');
		expect(getCurrentUserId.value).toBe('123');
	});

	test('updateCurrentUserData updates the fields of the user', () => {
		const { updateCurrentUserData, userData, setCurrentUserId } =
			useCurrentUser();

		setCurrentUserId('100');

		const mockUser = {
			profile: {
				avatar: 'aboba.png',
				first_name: 'John',
				last_name: 'Doe',
			},
			email: 'testing@example.com',
			department: { id: '20', name: 'Fronted' },
			position: { id: '30', name: 'Angular' },
		};

		updateCurrentUserData(mockUser);

		expect(userData).toEqual({
			photo: 'aboba.png',
			firstName: 'John',
			lastName: 'Doe',
			email: 'testing@example.com',
			profileLink: '/users/100/profile',
			department: 'Fronted',
			position: 'Angular',
		});
	});
});
