const client = require('prom-client')
const http = require('http')

client.collectDefaultMetrics({ timeout: 5000 })

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, 'http://127.0.0.1/')
  switch ((req.method + reqUrl.pathname)) {
    case 'GET/metrics': {
      res.writeHead(200)
      res.write(client.register.metrics())
      return res.end()
    }
    default: {
      res.writeHead(404)
      return res.end()
    }
  }
})

if (process.env.ENABLE_METRICS) {
  server.listen(process.env.PROM_PORT || 9090, () => logger.log('METRICS', `Prometheus metrics listening on port ${process.env.PROM_PORT || 9090}`))
}

module.exports = {
  events: new client.Counter({
    name: 'websocket_events',
    help: 'Total amount of websocket events broken up per event type',
    labelNames: ['eventName']
  }),
  websocketDelay: new client.Gauge({
    name: 'websocket_delay',
    help: 'The delay in milliseconds for events to travel from Discord to WildBeast',
    labelNames: ['shardID']
  }),
  guildCount: new client.Gauge({
    name: 'guild_count',
    help: 'The total amount of guilds accessible by the shard',
    labelNames: ['shardID']
  }),
  commands: new client.Counter({
    name: 'commands_ran',
    help: 'Total amount of commands ran broken up per command name',
    labelNames: ['commandName']
  })
}
