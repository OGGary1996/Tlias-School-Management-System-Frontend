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

// 引入 vue-echarts 组件
import Echarts from 'vue-echarts'
import { use } from 'echarts/core'

// 按需引入 Echarts 模块（避免打包体积过大）
import {CanvasRenderer} from "echarts/renderers";
import {LineChart, BarChart, PieChart} from "echarts/charts";
import {TitleComponent, TooltipComponent, LegendComponent,GridComponent} from "echarts/components";
// 注册以上引入的核心模块
use([
    CanvasRenderer,
    LineChart,
    BarChart,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
]);


const app = createApp(App);
// Use Element Plus
app.use(ElementPlus);
// Register Element Plus icons globally
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// Use Vue Router
app.use(router);

// Register Echarts component globally
app.component('v-chart', Echarts);

// Mount the app
app.mount('#app');