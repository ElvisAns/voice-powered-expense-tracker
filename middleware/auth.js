
export default defineNuxtRouteMiddleware((to, from) => {
  const userId = useCookie('userId');
  if (["/","/statistics","/transactions","/user"].includes(to.path) && !userId.value) {
    return navigateTo("/signin");
  }
  if (to.path == "/signin" && userId.value) {
    return navigateTo("/");
  }
  if (to.path == "/signout" && !userId.value) {
    return navigateTo("/signin");
  }
})