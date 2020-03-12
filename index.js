const express = require("express")
const app = express()
const http = require("http").createServer(app)
const io = require("socket.io")(http)

let races = {
    2031: {
        name: "TEST RACE",
        txt: "Typing Racers",
        racers: []
    }
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

io.on("connection", (socket) => {
    socket.on("join", (data) => {
        if (!races[data.raceid]) {
            socket.emit("join_response", { value: "IDNOTFOUND" })
        }
        races[data.raceid].racers[data.username] = 0
        socket.emit("join_response", { value: "JOINED", data: races[data.raceid] })
        socket.broadcast.emit("join", data.username)
    })
})

http.listen(process.env.PORT, () => {
    console.log("Whoo-hoo!")
})