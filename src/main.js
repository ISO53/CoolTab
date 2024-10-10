import "./assets/base.css";
import "./assets/satoshi.css";

import {createApp} from "vue";
import {createPinia} from "pinia";
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();
const clickOutside = {
    beforeMount: (el, binding) => {
        el.clickOutsideEvent = (event) => {
            if (!(el == event.target || el.contains(event.target))) {
                binding.value();
            }
        };
        document.addEventListener("click", el.clickOutsideEvent);
    },
    unmounted: (el) => {
        document.removeEventListener("click", el.clickOutsideEvent);
    },
};

app.directive("click-outside", clickOutside);
app.use(pinia);
app.mount("#app");
