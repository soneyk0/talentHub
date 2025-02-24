<template>
	<div class="relative select-none">
		<div
			v-if="isOpen"
			class="fixed inset-0 z-40 cursor-default"
			@click.stop="isOpen = false"
		></div>
		<div :class="linkClasses" @click="isOpen = !isOpen">
			<BaseUserPic
				:name="item.text"
				:photo="item.photo"
				class="bg-red-1 font-medium"
			/>

			<span :class="spanClasses">
				{{ item.text }}
			</span>
			<div
				v-if="isOpen"
				class="absolute bottom-16 z-50 w-[200px] cursor-default rounded bg-dark-1 py-1 drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)]"
			>
				<button
					class="flex w-full cursor-pointer items-center gap-3 bg-dark-1 px-4 py-2 font-normal text-white hover:bg-dark-4"
					@click.stop="handleProfile"
				>
					<IconsProfile color="var(--color-white)" width="24" />
					{{ $t('Profile') }}
				</button>
				<button
					class="flex w-full cursor-pointer items-center gap-3 bg-dark-1 px-4 py-2 font-normal text-white hover:bg-dark-4"
					@click.stop="handleSettings"
				>
					<IconsCogwheel color="var(--color-white)" width="24" />
					{{ $t('Settings') }}
				</button>
				<hr class="my-2 border-0 border-t border-gray-600 bg-dark-1" />
				<button
					class="flex w-full cursor-pointer items-center gap-3 bg-dark-1 px-4 py-2 font-normal text-white hover:bg-dark-4"
					@click.stop="handleLogout"
				>
					<IconsLogout color="var(--color-white)" width="24" />
					{{ $t('Logout') }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	interface SidebarUserItem {
		text: string;
		link: string;
		photo?: string;
	}

	const props = defineProps<{ item: SidebarUserItem; isCollapsed: boolean }>();
	const router = useRouter();
	const isOpen = ref(false);
	const emit = defineEmits(['logout']);

	const handleProfile = () => {
		isOpen.value = false;
		router.push(props.item.link);
	};

	const handleSettings = () => {
		isOpen.value = false;
		router.push('/settings');
	};

	const handleLogout = () => {
		isOpen.value = false;
		emit('logout');
	};

	const linkClasses = computed(() => [
		'flex items-center rounded-br-[31px] rounded-tr-[31px] py-2 pr-4 gap-2 pl-2 transition duration-300 ease-in-out cursor-pointer',
		props.isCollapsed ? 'text-transparent' : '',
		!isOpen.value ? 'hover:bg-dark-4' : '',
	]);

	const spanClasses = computed(() => [
		'text-sm transition-all duration-300 ease-in-out text-gray-1',
		props.isCollapsed
			? 'visibility-hidden opacity-0'
			: 'visibility-visible opacity-100',
		'truncate',
		'max-w-full',
	]);
</script>
