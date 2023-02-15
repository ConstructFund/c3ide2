import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import SplitButton from "primevue/splitbutton";
import Toolbar from "primevue/toolbar";
import Tooltip from "primevue/tooltip";
import Sidebar from "primevue/sidebar";
import Menubar from "primevue/menubar";
import Menu from "primevue/menu";
import Divider from "primevue/divider";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";

import VueRouter from "./plugins/router";

import "primevue/resources/themes/md-dark-indigo/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

const app = createApp(App);
const pinia = createPinia();

app.use(PrimeVue, { ripple: true });
app.use(VueRouter);
app.use(pinia);
app.component("Dialog", Dialog);
app.component("Button", Button);
app.component("SplitButton", SplitButton);
app.component("Toolbar", Toolbar);
app.directive("tooltip", Tooltip);
app.component("Sidebar", Sidebar);
app.component("Menubar", Menubar);
app.component("Menu", Menu);
app.component("Divider", Divider);
app.component("Splitter", Splitter);
app.component("SplitterPanel", SplitterPanel);

app.mount("#app");
