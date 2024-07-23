<template>
    <div class="cards flex p-0">
        <div class="card is-loading my-2 bg-white w-full rounded-lg">
            <div class="image rounded-lg" :class="card_height"></div>
        </div>
    </div>
</template>

<script setup>
    defineProps({
        card_height:{
            type : String,
            default: "h-[250px]",
        }
    })
</script>

<style scoped>

.card {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}
 
.card.is-loading .image{
    background: #eee;
    background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
    background-size: 200% 100%;
    -webkit-animation: 1.5s shine linear infinite;
    animation: 1.5s shine linear infinite;
}


@-webkit-keyframes shine {
    to {
        background-position-x: -200%;
    }
}

@keyframes shine {
    to {
        background-position-x: -200%;
    }
}
</style>