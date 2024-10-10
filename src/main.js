import "./assets/base.css";
import "./assets/satoshi.css";

import {createApp} from "vue";
import {createPinia} from "pinia";
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount("#app");