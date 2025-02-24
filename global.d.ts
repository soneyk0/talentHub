export interface Option {
	value: string;
	label: string;
	isSeparator?: boolean;
	disabled?: boolean;
}

export interface Language {
	name: string;
	proficiency: LanguageLevel;
}

export interface Skill {
	name: string;
	categoryId: string;
	mastery: SkillLevel;
}

export interface Row {
	id: number;
	name?: string;
	education?: string;
	description?: string;
	email?: string;
	link?: string;
	photo?: string;
	firstName?: string;
	lastName?: string;
	department?: string;
	position?: string;
	domain?: string;
	start_date?: string;
	end_date?: string;
	responsibilities?: string[];
}

export interface Cv {
	id: string | number;
	name: string;
	education: string;
	description: string;
	user: {
		id: string | number;
		email: string;
	};
}

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Native';
export type SkillLevel =
	| 'Novice'
	| 'Advanced'
	| 'Competent'
	| 'Proficient'
	| 'Expert';

// in case we need it later
export interface User {
	id: string;
	created_at: string;
	email: string;
	is_verified: boolean;
	profile: {
		id: string;
		first_name: string;
		last_name: string;
		full_name: string;
		avatar: string;
	};
	department: Department | null;
	position: Position | null;
	role: string;
}

export type UserProfileInfo = Pick<User, 'email'> & {
	profile: Omit<User['profile'], 'full_name' | 'id'>;
};

interface Department {
	id: string;
	name: string;
}

interface Position {
	id: string;
	name: string;
}
