import { Server } from "socket.io"
import { createServer } from "http"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const httpServer = createServer()
const io = new Server(httpServer)

let activeSessions = 0
let currentPlays = 0

io.on("connection", (socket) => {
  activeSessions++
  io.emit("updateActiveSessions", activeSessions)

  socket.on("startPlay", () => {
    currentPlays++
    io.emit("updateCurrentPlays", currentPlays)
  })

  socket.on("endPlay", () => {
    currentPlays--
    io.emit("updateCurrentPlays", currentPlays)
  })

  socket.on("disconnect", () => {
    activeSessions--
    io.emit("updateActiveSessions", activeSessions)
  })
})

export async function getActiveUserSessions() {
  return activeSessions
}

export async function getCurrentTrackPlays() {
  return currentPlays
}

httpServer.listen(3001)

