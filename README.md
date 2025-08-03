
# Tlias School Management System - Frontend

This is the frontend for the Tlias School Management System, a Vue.js-based application designed to manage students, classes, and employees.

## Project Structure

The project follows a standard Vue.js structure:

-   `src/api`: Contains all API request definitions, neatly organized by module.
-   `src/assets`: Stores static assets like images and styles.
-   `src/router`: Defines the application's routing configuration.
-   `src/utils`: Includes utility functions, including an Axios wrapper for API requests.
-   `src/views`: Contains all Vue components for the different pages.
-   `src/main.js`: The main entry point of the application.

## Core Logic

-   **Authentication**: The application uses token-based authentication. The token is retrieved from `localStorage` and sent with each request via an Axios interceptor.
-   **Routing**: Vue Router is used for navigation. Routes are lazy-loaded for better performance. A navigation guard redirects unauthorized users to the login page.
-   **UI**: The UI is built with Element Plus, a popular Vue 3 component library.
-   **Data Visualization**: ECharts is integrated for data analysis and visualization.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v14 or later)
-   npm or yarn

### Installation

1.  Clone the repo
   
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Start the development server
    ```sh
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

---

# Tlias 智慧教学管理系统 - 前端

这是 Tlias 智慧教学管理系统的前端部分，一个基于 Vue.js 的应用程序，用于管理学生、班级和员工。

## 项目结构

该项目遵循标准的 Vue.js 结构：

-   `src/api`: 包含所有按模块整齐组织的 API 请求定义。
-   `src/assets`: 存放静态资源，如图片和样式。
-   `src/router`: 定义应用程序的路由配置。
-   `src/utils`: 包括工具函数，其中有一个用于 API 请求的 Axios 封装。
-   `src/views`: 包含所有用于不同页面的 Vue 组件。
-   `src/main.js`: 应用程序的主入口文件。

## 核心逻辑

-   **认证**: 应用程序使用基于 token 的认证。Token 从 `localStorage` 中获取，并通过 Axios 拦截器随每个请求发送。
-   **路由**: 使用 Vue Router 进行导航。为提高性能，路由是懒加载的。导航守卫会将未经授权的用户重定向到登录页面。
-   **UI**: UI 是用 Element Plus 构建的，这是一个流行的 Vue 3 组件库。
-   **数据可视化**: 集成了 ECharts 用于数据分析和可视化。

## 快速入门

要获取本地副本并运行，请按照以下简单步骤操作。

### 先决条件

-   Node.js (v14 或更高版本)
-   npm 或 yarn

### 安装

1.  克隆仓库
    ```sh
    git clone https://github.com/your-username/tlias-school-management-system-frontend.git
    ```
2.  安装 NPM 包
    ```sh
    npm install
    ```
3.  启动开发服务器
    ```sh
    npm run dev
    ```

应用程序将在 `http://localhost:5173` 上可用。
