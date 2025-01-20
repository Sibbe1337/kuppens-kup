import request from "supertest"
import app from "../../app" // Assuming your Express app is exported from app.ts
import { connectDB, closeDB } from "../../db"

beforeAll(async () => {
  await connectDB()
})

afterAll(async () => {
  await closeDB()
})

describe("Tracks API", () => {
  it("GET /api/tracks returns a list of tracks", async () => {
    const response = await request(app).get("/api/tracks")
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBeTruthy()
    expect(response.body.length).toBeGreaterThan(0)
  })

  it("GET /api/tracks/:id returns a single track", async () => {
    const tracksResponse = await request(app).get("/api/tracks")
    const firstTrackId = tracksResponse.body[0].id

    const response = await request(app).get(`/api/tracks/${firstTrackId}`)
    expect(response.status).toBe(200)
    expect(response.body.id).toBe(firstTrackId)
  })

  it("POST /api/tracks creates a new track", async () => {
    const newTrack = {
      title: "Test Track",
      artist: "Test Artist",
      duration: 180,
      price: 9.99,
    }

    const response = await request(app).post("/api/tracks").send(newTrack).set("Accept", "application/json")

    expect(response.status).toBe(201)
    expect(response.body.title).toBe(newTrack.title)
    expect(response.body.artist).toBe(newTrack.artist)
  })
})

