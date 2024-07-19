<template>
    <div class="w-screen bg-black">
        <div class="fixed top-0 left-0 h-screen w-full opacity-10 z-10">
            <Gridlines />
        </div>
        <div class="flex items-center justify-center min-h-screen flex-col mx-5 relative z-50">
            <div
                class="mt-2 p-2 md:px-[40px] md:py-[20px] border border-cyan-50/10 border-solid relative text-center flex content-center justify-center flex-col">
                <div class="absolute top-[-15px] left-[-5px]">+</div>
                <div class="absolute top-[-15px] right-[-5px]">+</div>
                <div class="absolute bottom-[-10px] left-[-5px]">+</div>
                <div class="absolute bottom-[-10px] right-[-5px]">+</div>
                <h1 class="text-4xl font-bold text-white p-0 py-4">Meet Your AI-Powered Expense Tracker</h1>
                <p class="text-lg text-slate-400 p-0 py-2">Tired of manually logging expenses and losing track?</p>
                <p class="text-lg text-slate-400 p-0">Say hello to seamless tracking with our voice-activated, AI-driven
                    tool!</p>
                <div class="w-full mt-5">
                    <button @click="signin()"
                        class="mx-auto px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
                        <img class="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy"
                            alt="google logo">
                        <span>Login with Google</span>
                    </button>
                </div>
            </div>
            <Footer/>
        </div>
    </div>
</template>

<script setup>
import { GoogleAuthProvider, signInWithRedirect, signInWithPopup, onAuthStateChanged } from "firebase/auth";
const { $auth } = useNuxtApp();
definePageMeta({
    middleware: ['auth'],
});

const signin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup($auth, provider).then(async (result) => {
        await navigateTo("/");
    }).catch((error) => {
        console.log(error)
    });
}
</script>

<style scoped></style>