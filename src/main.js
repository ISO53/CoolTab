import "./assets/base.css";
import "./assets/satoshi.css";
import 'qweather-icons/font/qweather-icons.css';

import {createApp} from "vue";
import {createPinia} from "pinia";
import App from "./App.vue";
import Svg from "./components/ui/Svg.vue";
import Icon from "./components/ui/Icon.vue";
import {clickOutside} from "./utils/clickOutside";

const app = createApp(App);
const pinia = createPinia();
app.component('Svg', Svg);
app.component('Icon', Icon);

app.directive("click-outside", clickOutside);
app.use(pinia);
app.mount("#app");
