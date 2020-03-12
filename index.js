const express = require("express")
const http = require("http").createServer(app)
const app = express()
const io = require("socket.io")(http)

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

io.on("connection", () => {
    console.log("yeet!")
})

http.listen(process.env.PORT, () => {
    console.log("Whoo-hoo!")
})