<template>
	<div class="flex flex-col gap-8">
		<BaseDropdown
			id="theme"
			v-model="selectedTheme"
			:label="$t('Appearance')"
			:options="themeOptions"
		/>
		<BaseDropdown
			id="language"
			v-model="selectedLocale"
			:label="$t('Language')"
			:options="localeOptions"
		/>
	</div>
</template>

<script setup lang="ts">
	const colorMode = useColorMode();
	const { locale, locales, setLocale, t } = useI18n();

	const themeOptions = computed(() => [
		{ value: 'system', label: t('Device settings') },
		{ value: 'light', label: t('Light') },
		{ value: 'dark', label: t('Dark') },
	]);

	const localeOptions = computed(() => {
		return (locales.value as any[]).map((locale) => ({
			value: locale.code,
			label: locale.name,
		}));
	});

	const selectedLocale = computed({
		get: () => ({
			value: locale.value,
			label: locale.value,
		}),
		set: (option) => {
			setLocale(option.value);
		},
	});

	const selectedTheme = computed({
		get: () => ({
			value: colorMode.preference,
			label: getThemeLabel(colorMode.preference),
		}),
		set: (option) => {
			colorMode.preference = option.value;
		},
	});
	function getThemeLabel(theme: string) {
		switch (theme) {
			case 'system':
				return `System (${colorMode.value === 'dark' ? 'Dark' : 'Light'})`;
			case 'dark':
				return 'Dark';
			case 'light':
				return 'Light';
			default:
				return 'Unknown';
		}
	}
</script>
