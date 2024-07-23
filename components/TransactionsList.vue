<template>
    <div class="flex gap-3 flex-col" :class="full?'w-full':'mr-[90px]'">
        <SkeletonLoading v-if="!transactions.length" card_height="h-[60px]"/>
        <div v-for="entry in transactions"
            class="flex justify-start gap-3 content-center bg-slate-200 rounded-lg text-black px-5 py-5 min-h-[60px]">
            <div class="mt-2">
                <div v-show="entry.type == 'expense'">
                    <UIcon name="i-heroicons-arrow-down" />
                </div>
                <div v-show="entry.type == 'income'">
                    <UIcon name="i-heroicons-arrow-up" />
                </div>
            </div>
            <div>
                <span class="block">{{ entry.item }}</span>
                <span class="block text-slate-400 text-sm">{{ entry.date }}</span>
            </div>
            <div class="grow text-right">
                <span class="text-2xl">{{ entry.currency }}{{ entry.amount }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    transactions: Array,
    full : {
        type : Boolean,
        default : false
    }
})
</script>