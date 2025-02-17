export const SKILL_LEVELS = [
	{ value: 'Novice', label: 'Novice' },
	{ value: 'Advanced', label: 'Advanced' },
	{ value: 'Competent', label: 'Competent' },
	{ value: 'Proficient', label: 'Proficient' },
	{ value: 'Expert', label: 'Expert' },
];
export type SkillLevel =
	| 'Novice'
	| 'Advanced'
	| 'Competent'
	| 'Proficient'
	| 'Expert';

export const SKILL_LEVEL_TO_PROGRESS: Record<SkillLevel, number> = {
	Novice: 20,
	Advanced: 40,
	Competent: 60,
	Proficient: 80,
	Expert: 100,
};

export const LANGUAGE_LEVELS = [
	{ value: 'Native', label: 'Native' },
	{ value: 'C2', label: 'C2' },
	{ value: 'C1', label: 'C1' },
	{ value: 'B2', label: 'B2' },
	{ value: 'B1', label: 'B1' },
	{ value: 'A2', label: 'A2' },
	{ value: 'A1', label: 'A1' },
];
