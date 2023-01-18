import { createApp } from 'vue'
import Vant from 'vant';
import 'vant/lib/index.css';
import 'mdui/dist/css/mdui.css';
import 'vant/es/toast/style';
import App from './App.vue'
import router from "./router/index";
//import {ApiRequest} from "./units/api";
import VueCookies from 'vue-cookies'
import mdui from "mdui";

const app = createApp(App);
app.use(router).mount('#app');
app.use(VueCookies);
app.use(Vant);
