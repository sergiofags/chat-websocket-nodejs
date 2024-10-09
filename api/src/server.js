const { WebSocketServer } = require("../node_modules/ws")

const wss = new WebSocketServer({ port: 8080 })

wss.on("connection", (ws) => {
    ws.on("error", console.error)

    ws.on("message", (data) => {
        wss.clients.forEach((client) => client.send(data.toString()))
    })

    console.log("client connected")
})
