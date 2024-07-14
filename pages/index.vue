<template>
  <div>
    <Home />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
});
useHead({
  link: {
    rel: "manifest",
    href: "/manifest.json"
  }
})
</script>