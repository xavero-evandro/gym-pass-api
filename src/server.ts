import { app } from './app'
import { env } from './env'

app.listen({
    host: env.API_HOST,
    port: env.PORT,
}).then(() => {
    console.log(`✅ Server running at http://${env.API_HOST}:${env.PORT}/`)
})