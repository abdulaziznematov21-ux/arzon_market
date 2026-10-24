import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sendSmsHandler, verifySmsHandler } from './api/smsService.js'

function smsApiPlugin() {
  return {
    name: 'sms-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/send-sms' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}')
              const result = await sendSmsHandler(data)
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = result.ok ? 200 : 400
              res.end(JSON.stringify(result))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: false, error: err.message }))
            }
          })
          return
        }

        if (req.url === '/api/verify-sms' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}')
              const result = await verifySmsHandler(data)
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = result.ok ? 200 : 400
              res.end(JSON.stringify(result))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: false, error: err.message }))
            }
          })
          return
        }

        next()
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), smsApiPlugin()]
})
