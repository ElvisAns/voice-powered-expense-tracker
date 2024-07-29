<template>
    <div class="px-5 pt-5">
        <h1 class="text-left text-2xl pl-0 font-bold pb-4">All your transactions</h1>
        <SkeletonLoading v-if="!Object.keys(expenses).length" card_height="h-[60px]"/>
    </div>
    <div v-for="(data,date) in expenses" class="px-5 pb-3">
        <div class="bg-gray-600 pl-2 py-5 text-lg">{{ date }} ({{data.length}})</div>
        <div v-for="expense in data" class="flex justify-start gap-3 content-center border-blue-50 border-b-2 text-slate-200 px-5 py-5 min-h-[60px]">
            <div class="mt-2">
                <div v-show="expense.type == 'expense'">
                    <UIcon name="i-heroicons-arrow-down" />
                </div>
                <div v-show="expense.type == 'income'">
                    <UIcon name="i-heroicons-arrow-up" />
                </div>
            </div>
            <div>
                <span class="block">{{ expense.item }}</span>
                <span class="block text-slate-400 text-sm">{{ expense.date }}</span>
                <span class="block text-slate-400 text-sm capitalize">{{ expense.account }}</span>
                <span class="block text-slate-400 text-sm">{{ expense.category }}</span>
            </div>
            <div class="grow text-right">
                <span class="text-xl">{{ expense.currency }}{{ expense.amount }}</span>
            </div>
        </div>
    </div>
</template>


<script setup>

import { onMounted, ref, onBeforeUnmount, watch } from 'vue';
import { marked } from 'marked';
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp, orderBy, addDoc, Timestamp, limit, onSnapshot } from "firebase/firestore";
const userUid = useCookie("userId");
const { $db } = useNuxtApp();

definePageMeta({
    middleware: ['auth'],
    layout: 'home-users'
});
const userInfos = useState("userInfos", () => { return { photoURL: "", displayName: "", email: "" } });
const expenses = ref({});
const hints = ref('');
const insights = useState("insights");
var expensesCollection = null;


var date_format_options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

onMounted(async () => {
    expensesCollection = collection($db, "userExpenses");
    const q = query(expensesCollection, where("user", "==", userUid.value), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const entry = doc.data();
        entry.date = new Date(entry.date.seconds * 1000).toLocaleDateString("en-US", date_format_options);
        if(!expenses.value.hasOwnProperty(entry.date)){
            expenses.value[entry.date] = [];
        }
        expenses.value[entry.date].push(entry);
        console.log(expenses.value)
    });
})
</script>

<style>
.insights p {
    padding: 20px 0px;
}
</style>