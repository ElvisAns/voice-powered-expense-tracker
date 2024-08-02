<template>
    <div class="flex gap-3 px-2 pt-5  bg-gradient-to-r from-slate-100 to-slate-100">
        <img src="/android-icon-96x96.png" class="h-full w-auto">
        <div>
            <h1 class="text-left text-2xl pl-0 font-bold text-black">Welcome to your insights board</h1>
            <p class="pb-5 text-slate-400 text-sm">Using AI, we will try to give you useful informations about your
                spending</p>
        </div>
    </div>
    <div v-html="insights" class="insights px-5"></div>
    <hr class="my-5">
    <div class="pt-2 px-5">
        <h2 class="py-4 text-slate-200">Last 7days transactions</h2>
        <TransactionsList :transactions="expenses" :full.boolean="true" />
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
const expenses = ref([]);
const hints = ref('');
const insights = useState("insights");
var expensesCollection = null;


var date_format_options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

async function update_last_7days() {
    let oneWeekExpenses = [];
    let oneWeekExpensesPlain = [];
    const oneWeekAgo = Timestamp.now();
    oneWeekAgo.seconds -= 7 * 24 * 60 * 60;
    const weekQuery = query(expensesCollection, where("user", "==", userUid.value), where("date", ">", oneWeekAgo), orderBy("date", "desc"));
    onSnapshot(weekQuery, async (weekquerySnapshot) => {
        weekquerySnapshot.forEach((doc) => {
            const entry = doc.data();
            entry.date = new Date(entry.date.seconds * 1000).toLocaleDateString("en-US", date_format_options);
            oneWeekExpensesPlain.push(entry);
            const { amount, type, account, currency, category, date, item } = entry;
            oneWeekExpenses.push({ amount, type, account, currency, category, date, item });
        });
        expenses.value = oneWeekExpensesPlain;
        if (oneWeekExpenses.length) {
            const response = await $fetch('/api/get-insights', {
                method: "POST",
                body: { prompt: JSON.stringify(oneWeekExpenses) }
            })
            try {
                insights.value = marked.parse(response);
            }
            catch (error) {
                console.log(response)
                console.log(error);
            }
        }
        else {
            hints.value = "You did not record any transaction within the last 7 days!"
        }
        oneWeekExpenses = [];
    });
}

onMounted(async () => {
    expensesCollection = collection($db, "userExpenses");
    const q = query(expensesCollection, where("user", "==", userUid.value), orderBy("date", "desc"), limit(5));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const entry = doc.data();
        entry.date = new Date(entry.date.seconds * 1000).toLocaleDateString("en-US", date_format_options);
        expenses.value.push(entry);
    });
    update_last_7days();
})
</script>

<style>
.insights p {
    padding: 20px 0px;
}
</style>