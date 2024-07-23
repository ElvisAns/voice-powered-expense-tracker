<template>
    <div class="w-full bg-black">
        <div class="flex items-center justify-center min-h-screen flex-col mx-5 relative text-center">
            <div
                class="mt-2 p-2 md:px-[40px] md:py-[20px] border border-cyan-50/10 border-solid relative text-center flex content-center justify-center flex-col">
                <div class="absolute top-[-15px] left-[-5px]">+</div>
                <div class="absolute top-[-15px] right-[-5px]">+</div>
                <div class="absolute bottom-[-10px] left-[-5px]">+</div>
                <div class="absolute bottom-[-10px] right-[-5px]">+</div>
                <h1 class="text-4xl font-bold text-white p-0 py-4">Thanks for using Trakker App</h1>
                <div class="text-center flex content-center justify-center"><img :src="userInfos.photoURL" class="rounded-lg" style="height: 80px; width: auto;"></div>
                <p>{{ userInfos.displayName }}</p>
                <div class="py-5"><UButton color="black" variant="solid" to="/signout">Signout</UButton></div>
            </div>
        </div>
    </div>
</template>

<script setup>
const userInfos = useState("userInfos", () => { return { photoURL: "", displayName: "", email: "" } });
definePageMeta({
    middleware: ['auth'],
    layout: 'home-users'
});
</script>

<style scoped></style>