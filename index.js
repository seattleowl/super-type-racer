const express = require("express")
const http = require("http").createServer(app)
const app = express()
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
        races[data.raceid].racers[data.username] = 0
        io.emit("join")
    })
})

http.listen(process.env.PORT, () => {
    console.log("Whoo-hoo!")
})