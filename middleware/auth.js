
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
export default defineNuxtRouteMiddleware((to, from) => {
  const userId = useCookie('userId');
  if (to.path == "/" && !userId.value) {
    return navigateTo("/signin");
  }
  if (to.path == "/signin" && userId.value) {
    return navigateTo("/");
  }
})