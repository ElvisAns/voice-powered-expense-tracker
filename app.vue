<template>
  <NuxtLoadingIndicator :throttle="0" />
  <NuxtPage />
  <UNotifications />
</template>

<style>
@font-face {
  font-family: 'GeistVF';
  src: url('/GeistVF.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

body * {
  font-family: 'GeistVF', sans-serif !important;
}
</style>

<script setup>
import { onAuthStateChanged } from 'firebase/auth';
const { $auth } = useNuxtApp();
const userUid = useState("userUid");
const userInfos = useState("userInfos", () => { return { photoURL: "", displayName: "", email: "" } });
const userIdCookie = useCookie('userId');

onMounted(() => {
  onAuthStateChanged($auth, (user) => {
    if (user) {
      const uid = user.uid;
      userUid.value = uid;
      userIdCookie.value = uid;
      const { photoURL, displayName, email } = user;
      userInfos.value = { photoURL, displayName, email };
    }
    else {
      userIdCookie.value = null;
      userUid.value = "";
      userInfos.value = { photoURL: "", displayName: "", email: "" };
    }
  });
})
</script>