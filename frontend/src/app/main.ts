import 'bootstrap/dist/css/bootstrap.min.css'
import { createApp } from 'vue'
import App from '@/app/App.vue'
import router from '@/app/router'
import store from '@/app/store'

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
