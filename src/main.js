import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// Import Element Plus
import ElementPlus from 'element-plus'
// Import Element Plus styles
import 'element-plus/dist/index.css'
// Import Element Plus icons
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// Import Vue Router
import router from './router'

const app = createApp(App);
// Use Element Plus
app.use(ElementPlus);
// Register Element Plus icons globally
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// Use Vue Router
app.use(router);

// Mount the app
app.mount('#app');