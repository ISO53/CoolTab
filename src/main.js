import "./assets/base.css";
import "./assets/satoshi.css";
import 'material-icons/iconfont/material-icons.css';
import 'qweather-icons/font/qweather-icons.css';

import {createApp} from "vue";
import {createPinia} from "pinia";
import App from "./App.vue";
import Svg from "./components/ui/Svg.vue";
import {clickOutside} from "./utils/clickOutside";

const app = createApp(App);
const pinia = createPinia();
app.component('Svg', Svg);

app.directive("click-outside", clickOutside);
app.use(pinia);
app.mount("#app");
