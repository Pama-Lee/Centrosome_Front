import { createApp, inject } from 'vue'
import Vant from 'vant';
import 'mdui/dist/css/mdui.css';
import App from './App.vue'
import router from "./router/index";

//import {ApiRequest} from "./units/api";
import { VueCookies } from 'vue-cookies'
import mdui from "mdui";


const app = createApp(App);
app.use(router)
app.use(Vant).mount('#app')
