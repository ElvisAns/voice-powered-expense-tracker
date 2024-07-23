<template>
    <div
        class="flex w-full justify-around content-center gap-2 fixed bottom-0 left-0 py-5 bg-[#3b3b3b] text-stone-50 text-2xl">
        <NuxtLink to="/">
            <UIcon name="i-heroicons-home" />
        </NuxtLink>
        <NuxtLink to="/statistics">
            <UIcon name="i-heroicons-chart-bar" />
        </NuxtLink>
        <NuxtLink to="/transactions">
            <UIcon name="i-heroicons-arrows-right-left" />
        </NuxtLink>
        <NuxtLink to="/user"><img :src="userInfos.photoURL" class="rounded-full h-[20px]"></NuxtLink>
    </div>
</template>

<script setup>
const userInfos = useState("userInfos", () => { return { photoURL: "", displayName: "", email: "" } });
</script>