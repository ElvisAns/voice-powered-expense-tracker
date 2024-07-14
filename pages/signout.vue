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


const user_data = useCookie('user_data');
const token  = useCookie('token');

onMounted(() => {
    signOut($auth).then(async () => {
        user_data.value = null;
        token.value = null;
        await navigateTo("signin")
    }).catch((error) => {
        console.log("failed to signout")
    });
})
</script>