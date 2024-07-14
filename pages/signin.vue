<template>
    <button @click="signin()">signin</button>
</template>

<script setup>
import { onMounted } from 'vue';
import { GoogleAuthProvider, signInWithRedirect, signInWithPopup,  onAuthStateChanged } from "firebase/auth";
const { $auth } = useNuxtApp();
definePageMeta({
    middleware: ['auth'],
});
const user_data = useCookie('user_data');
const token  = useCookie('token');
onMounted(() => {
    onAuthStateChanged($auth, async (user) => {
        if (user) {
            user_data.value = user.reloadUserInfo;
            token.value =  user.accessToken;
            await navigateTo("/");
            console.log("Signin success")
        }
    });
})
const signin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup($auth, provider).then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        localStorage.setItem("user", JSON.stringify(user.reloadUserInfo));
        localStorage.setItem("user-token", user.accessToken);
        console.log("login success")
        await navigateTo("/");
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });
}
</script>