const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)

app.get("/", (req, res) => {
    res.send("0_0")
})

server.listen(process.env.PORT, () => {
    console.log("Whoo-hoo!")
})