import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../lib/prisma"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { title, artist, duration, price, coverImage } = req.body
      const track = await prisma.track.create({
        data: {
          title,
          artist,
          duration,
          price,
          coverImage,
        },
      })
      res.status(201).json(track)
    } catch (error) {
      res.status(500).json({ error: "Error creating track" })
    }
  } else if (req.method === "GET") {
    try {
      const tracks = await prisma.track.findMany()
      res.status(200).json(tracks)
    } catch (error) {
      res.status(500).json({ error: "Error fetching tracks" })
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

