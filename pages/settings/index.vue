<template>
	<div>
		<ClientOnly>
			<BaseDropdown
				id="theme"
				v-model="selectedTheme"
				label="Theme"
				:options="themeOptions"
			/>
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
	const colorMode = useColorMode();

	const themeOptions = [
		{ value: 'system', label: 'System' },
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' },
	];

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
