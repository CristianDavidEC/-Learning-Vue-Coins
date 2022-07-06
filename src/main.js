import { createApp } from "vue";
import App from "@/App.vue";
import "@/index.css";
import router from "@/router/router";
import { dollarFilter, percentFilter } from "@/filter";
import VueChartkick from "vue-chartkick";
import "chartkick/chart.js";

const app = createApp(App);
app.use(router);
app.use(VueChartkick);
app.mount("#app");

//Implements global filters.
//For filters locals the componenes is recomeded use computed properties.
app.config.globalProperties.$filters = { dollarFilter, percentFilter };
