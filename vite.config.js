import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)), // 设置 @ 指向 src 目录
        }
    },
    server: {
      proxy: {
          '/api':{
              target: "http://localhost:8080", // 本地服务器的地址
              changeOrigin: true, // 是否跨域
                rewrite: (path) => path.replace(/^\/api/, '') // 重写路径，将 /api 替换为空
          }
      }
    }
})
