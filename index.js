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
        let setID = () => {
            id = Math.round(Math.random() * 8999) + 1000
            if (races[id] != undefined) {
                setID()
            }
        }
        setID()
        races[id] = {
            name: data.name,
            txt: data.txt,
            racers: {}
        }
        races[id].racers[socket.id] = { username: data.username, score: 0 }
        total_online[socket.id] = String(id)
        socket.emit("join_response", { value: "IDCREATED", data: { ...races[id], id } })
        socket.broadcast.emit("join", data.username)
        console.log("Races: " + JSON.stringify(races))
    })
    
    socket.on("disconnect", () => {
        if (total_online[socket.id]) {
            delete races[total_online[socket.id]].racers[socket.id]
            if (Object.keys(races[total_online[socket.id]].racers).length == 0) {
                delete races[total_online[socket.id]]
                console.log("Races: " + JSON.stringify(races))
            }
            delete total_online[socket.id]
        }
    })

    socket.on("win", () => {
        let race = races[total_online[socket.id]]
        delete races[total_online[socket.id]]
        Object.keys(race.racers).forEach(racer => {
            delete total_online[racer]
        })
        console.log("Races: " + JSON.stringify(races))
        socket.broadcast.emit("lose")
    })
})

http.listen(process.env.PORT, () => {
    console.log("Whoo-hoo!")
})