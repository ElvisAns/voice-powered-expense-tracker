<template>
    <div id="#firebaseui-auth-container">
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { signOut } from "firebase/auth";
const { $auth } = useNuxtApp();
definePageMeta({
    middleware: ['auth'],
});

onMounted(() => {
    signOut($auth).then(async () => {
        await navigateTo("/signin")
    }).catch((error) => {
        console.log("failed to signout")
    });
})
</script>