const express = require("express")
const app = express()
const http = require("http").createServer(app)
const io = require("socket.io")(http)

let races = {
    2031: {
        name: "TEST RACE",
        txt: "Typing Racers",
        racers: {}
    }
}
let total_online = {}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

io.on("connection", (socket) => {
    socket.on("join", (data) => {
        if (!races[data.raceid]) {
            socket.emit("join_response", { value: "IDNOTFOUND" })
            return
        }
        races[data.raceid].racers[socket.id] = { username: data.username, score: 0 }
        total_online[socket.id] = data.raceid
        socket.emit("join_response", { value: "JOINED", data: races[data.raceid] })
        socket.broadcast.emit("join", data.username)
    })
    socket.on("create", (data) => {
        let id
        do {
            id = Math.round(Math.random() * 8999) + 1000
        } while (!races[id]);
        races[id] = {
            name: data.race.name,
            name: data.race.name,
            racers: {}
        }
        races[id].racers[socket.id] = { username: data.username, score: 0 }
        total_online[socket.id] = data.raceid
        socket.emit("join_response", { value: "IDCREATED", data: { ...races[id], id } })
        socket.broadcast.emit("join", data.username)
    })
    
    socket.on("disconnect", () => {
        if (total_online[socket.id]) {
            delete races[total_online[socket.id]].racers[socket.id]
            delete total_online[socket.id]
        }
    })

    socket.on("win", () => {
        Object.keys(races[total_online[socket.id]].racers).forEach(racer => {
            delete total_online[racer]
        })
        delete races[total_online[socket.id]]
        socket.broadcast.emit("lose")
    })
})

http.listen(process.env.PORT, () => {
    console.log("Whoo-hoo!")
})