
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('token');
  if (to.path == "/" && !token.value) {
    return navigateTo("/signin");
  }
  if (to.path == "/signin" && token.value) {
    return navigateTo("/");
  }
})