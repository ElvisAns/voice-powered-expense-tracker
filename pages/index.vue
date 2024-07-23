<template>
  <div class="px-5">
    <div class="flex justify-between">
        <h1 class="text-left text-2xl pl-0 font-bold">Hello <span class="text-green-100">{{ userInfos.displayName }}!</span>
        </h1>
        <div class="p-3 min-w-[120px]">
            <USelect v-model="language" :options="languages" />
        </div>
    </div>
    <p class="pl-0 text-left">Last 7days summary</p>
    <p v-if="feedback_message" class="bg-yellow-200 text-black">{{ feedback_message }}</p>
    <SkeletonLoading v-if="!feedback_message.length && !Object.keys(accounts_status).length" />
    <HomeCards v-if="Object.keys(accounts_status).length" :accounts_status="accounts_status" />
    <div class="mb-1 flex flex-col gap-2 mt-10">
        <p v-show="speech_error">{{ speech_error }}</p>
        <p v-show="hints" class="hints">{{ hints }}</p>
        <p v-show="feedback" class="feedback">{{ feedback }}</p>
        <UTextarea v-model="output"></UTextarea>
        <UButton size="xl" class="mr-auto mt-5" @click="submit_entry()" :loading="fetching_in_progress"
            loading-icon="i-heroicons-sparkles">Save</UButton>
    </div>
    <div>
        <h2 class="py-4 text-slate-200">Recent transactions</h2>
        <TransactionsList :transactions="expenses" />
    </div>
    <div class="flex justify-center fixed right-0 bottom-20 bg-slate-900 rounded-xl p-5 mx-5">
        <UButton :class="micAnimated ? 'relative mic-talking' : ''" @mousedown="startSpeechRecognition" color="black"
            @mouseup="stopSpeechRecognition" variant="outline" icon="i-heroicons-microphone" size="xl" />
    </div>
  </div>
</template>

<script setup>
import Ajv from 'ajv';
import { onMounted, ref, onBeforeUnmount, watch } from 'vue';
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp, orderBy, addDoc, Timestamp, limit, onSnapshot } from "firebase/firestore";
const userUid = useCookie("userId");
const { $db } = useNuxtApp();
const accounts_status = ref({});
const feedback_message = ref("");
const fetching_in_progress = ref(false);

definePageMeta({
  middleware: ['auth'],
  layout: 'home-users'
});
useHead({
  link: {
    rel: "manifest",
    href: "/manifest.json"
  }
})
const ajv = new Ajv();

const userInfos = useState("userInfos", () => { return { photoURL: "", displayName: "", email: "" } });
const expenses = ref([]);

const languages = ref([
    {
        name: "English",
        value: "en-US"
    },
    {
        name: "Francais",
        value: "fr-FR"
    }
])

const language = useCookie('language-choice', { default: () => "en-US" });
const speech_error = ref('');
const output = ref('If you can\'t use the microphone please describe your expense/income here');
const hints = ref('');
const micAnimated = ref(false);
const feedback = ref('');

var recognition = null;
var expensesCollection = null;

const startSpeechRecognition = () => {
    micAnimated.value = true;
    recognition.start();
    console.log('Ready to start speech recognition');
}
const stopSpeechRecognition = () => {
    micAnimated.value = false;
    recognition.stop();
}

watch(language, (newlanguage) => {
    recognition.lang = newlanguage
    hints.value = 'Speech Language changed to ' + newlanguage;
})


var date_format_options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

async function update_last_7days() {
    let oneWeekExpenses = [];
    const oneWeekAgo = Timestamp.now();
    oneWeekAgo.seconds -= 7 * 24 * 60 * 60;
    const weekQuery = query(expensesCollection, where("user", "==", userUid.value), where("date", ">", oneWeekAgo));
    onSnapshot(weekQuery, async (weekquerySnapshot) => {
        weekquerySnapshot.forEach((doc) => {
            const entry = doc.data();
            const { amount, type, account, currency } = entry;
            oneWeekExpenses.push({ amount, type, account, currency });
        });
        if (oneWeekExpenses.length) {
            const response = await $fetch('/api/accounts-summary', {
                method: "POST",
                body: { prompt: JSON.stringify(oneWeekExpenses) }
            })
            try {
                accounts_status.value = JSON.parse(response);
                feedback_message.value = "";
            }
            catch (error) {
                console.log(response)
                console.log(error);
            }
        }
        else {
            feedback_message.value = "You did not record any transaction within the last 7 days!"
        }
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
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
    recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = language.value;
    recognition.interimResults = false;
    //recognition.maxAlternatives = 1;

    recognition.onresult = async function (event) {
        output.value = event.results[0][0].transcript;
        //console.log('Confidence: ' + event.results[0][0].confidence);
    }

    recognition.onspeechend = function () {
        recognition.stop();
    }

    recognition.onerror = function (event) {
        output.value = 'Error occurred in recognition: ' + event.error;
        if (event.error == 'no-speech') {
            speech_error.value = 'info_no_speech';
        }
        if (event.error == 'audio-capture') {
            speech_error.value = 'info_no_microphone';
            ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
                speech_error.value = 'info_blocked';
            } else {
                speech_error.value = 'info_denied';
            }
            ignore_onend = true;
        }
    }
})

const submit_entry = async () => {
    fetching_in_progress.value = true;
    let request_body = output.value;
    if (language.value == "fr-FR") {
        const data = await $fetch('/api/french-to-english', {
            method: "POST",
            body: { prompt: request_body }
        })
        request_body = data.response;
    }
    const { data, pending, error, refresh } = await $fetch('/api/chatbot', {
        method: "POST",
        body: { prompt: request_body },
        async onResponse({ request, response, options }) {
            const api_response = response._data.response;
            if (api_response.error) {
                feedback.value = `${api_response.error}`
                fetching_in_progress.value = false;
            }
            else {
                const schema = {
                    type: "object",
                    properties: {
                        currency: { type: "string" },
                        amount: { type: "integer" },
                        item: { type: "string" },
                        account: { type: "string" },
                        type: { type: "string" },
                        category: { type: "string" }
                    },
                    required: ["currency", "amount", "item", "account", "type", "category"],
                    additionalProperties: false
                }
                const validate = ajv.compile(schema);
                const valid = validate(api_response);
                if (valid) {
                    const docData = { user: userUid.value, ...api_response, date: Timestamp.now() };
                    await addDoc(expensesCollection, docData);
                    expenses.value = [{ ...docData, date: new Date(docData.date.seconds * 1000).toLocaleDateString("en-US", date_format_options) }, ...expenses.value]
                    feedback.value = "Done! 🚀"
                    fetching_in_progress.value = false;
                }
                else {
                    feedback.value = "😒 Please try again, the problem may be ours."
                    fetching_in_progress.value = false;
                }
            }
        },
    })
}

onBeforeUnmount(() => {
    if (recognition) recognition.stop();
})
</script>

<style scoped>
h1,
p {
    font-family: sans-serif;
    text-align: center;
    padding: 20px;
}

ul {
    margin: 0;
}

.hints span {
    text-shadow: 0px 0px 6px rgba(255, 255, 255, 0.7);
}

.mic-talking * {
    position: relative;
    z-index: 1;
}

.mic-talking::before {
    content: '';
    display: block;
    height: 10px;
    width: 10px;
    background-color: red;
    position: absolute;
    top: calc(50% - 5px);
    left: calc(50% - 5px);
    border-radius: 50%;
    animation: talking 1s ease 0s infinite;
}

@keyframes talking {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.5);
    }

    100% {
        transform: scale(0.8);
    }
}
</style>