<template>
    <div class="splide home-cards">
        <div class="splide__track">
            <div class="splide__list">
                <div v-for="(account_data, account_name) in accounts_status"
                    class="min-h-[250px] bg-gradient-to-r from-slate-100 to-slate-100 text-black rounded-lg splide__slide p-5 flex flex-col gap-10 justify-between" :class="Object.keys(accounts_status).length==1?'w-full':'w-[90%] md:w-[70%] '">
                    <span class="capitalize"><UIcon name="i-heroicons-building-library" /> {{ account_name }}</span>
                    <div v-for="(data, currency) in account_data" class="text-xl">
                        <div>{{ currency }} {{ new Intl.NumberFormat().format(data.income) }} <UIcon name="i-heroicons-arrow-trending-up" /> <sup class="text-xs bg-green-100 rounded-lg text-black px-2 py-1">income</sup></div>
                        <div>{{ currency }} {{ new Intl.NumberFormat().format(data.expense) }} <UIcon name="i-heroicons-arrow-trending-down"/> <sub class="text-xs bg-black rounded-lg text-white px-2 py-1">expense</sub></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    accounts_status: Object
})
onMounted(()=>{
    new Splide( '.splide',{
        rewind      : true,
        rewindByDrag: true,
        perPage : 1,
        arrows : false,
        gap : '20px',
        autoWidth : true,
    }).mount();
})
</script>

<script>
    import '@splidejs/splide/css';
    import Splide from '@splidejs/splide';
</script>