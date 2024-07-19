<template>
    <div class="h-screen my-0 max-w-[800px] mx-auto overflow-hidden relative pb-20">
        <div>
            {{ expenses }}
            <USelect v-model="language" :options="languages" />
            <div>{{ speech_error }}</div>
            <h1>Speech to text</h1>
            <p class="hints">{{ hints }}</p>
            <p class="feedback">{{ feedback }}</p>
            <UTextarea v-model="output"></UTextarea>
        </div>
        <div class="flex justify-center fixed right-0 bottom-20 bg-slate-900 rounded-xl p-5 mx-5">
            <UButton :class="micAnimated ? 'relative mic-talking' : ''" @mousedown="startSpeechRecognition"
                color="black" @mouseup="stopSpeechRecognition" variant="outline" icon="i-heroicons-microphone"
                size="xl" />
        </div>
        <BottomBar />
    </div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount, watch } from 'vue';
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp, onSnapshot, addDoc } from "firebase/firestore";
const userUid = useCookie("userId");
const { $db } = useNuxtApp();

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

const language = ref('en-US');
const speech_error = ref('');
const output = ref('');
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
    hints.value = 'Language changed to' + newlanguage;
})

onMounted(async () => {
    expensesCollection = collection($db, "userExpenses");
    const q = query(expensesCollection, where("user", "==", userUid.value));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        expenses.value.push(doc.data());
    });


    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
    recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = language.value;
    recognition.interimResults = false;
    //recognition.maxAlternatives = 1;
    hints.value = 'Tap/click the button to start';

    recognition.onresult = async function (event) {
        output.value = event.results[0][0].transcript;
        //console.log('Confidence: ' + event.results[0][0].confidence);
        console.log(language.value)
        if (language.value == "fr-FR") {
            console.log("going to fetch")
            const data = await $fetch('/api/french-to-english', {
                method: "POST",
                body: { prompt: output.value }
            })
            output.value = data.response;
        }
        const { data, pending, error, refresh } = await $fetch('/api/chatbot', {
            method: "POST",
            body: { prompt: output.value },
            async onResponse({ request, response, options }) {
                const api_response = response._data.response;
                if (api_response.error) {
                    feedback.value = `error : ${api_response.error}`
                }
                else {
                    let data = "";
                    await addDoc(expensesCollection, { user: userUid.value, ...api_response });
                    expenses.value.push({ user: userUid.value, ...api_response })
                    for (const key in api_response) {
                        data += `${key}:${api_response[key]}`
                    }
                    feedback.value = data
                }
            },
        })
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

onBeforeUnmount(() => {
    if (recognition) recognition.stop();
})
</script>

<style>
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