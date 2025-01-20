import { PrismaClient } from "@prisma/client"
import * as tf from "@tensorflow/tfjs"
import * as tfvis from "@tensorflow/tfjs-vis"

const prisma = new PrismaClient()

interface UserTrackInteraction {
  userId: string
  trackId: string
  interactionStrength: number
}

export async function trainRecommendationModel() {
  const interactions = await getUserTrackInteractions()
  const { userIndex, trackIndex } = createIndices(interactions)

  const model = tf.sequential()
  model.add(tf.layers.embedding({ inputDim: userIndex.size, outputDim: 50, inputLength: 1 }))
  model.add(tf.layers.flatten())
  model.add(tf.layers.dense({ units: trackIndex.size, activation: "sigmoid" }))

  model.compile({ optimizer: "adam", loss: "binaryCrossentropy" })

  const userTensor = tf.tensor1d(interactions.map((i) => userIndex.get(i.userId)!))
  const trackTensor = tf.tensor1d(interactions.map((i) => trackIndex.get(i.trackId)!))
  const labelTensor = tf.tensor1d(interactions.map((i) => i.interactionStrength))

  await model.fit(userTensor, labelTensor, {
    epochs: 10,
    callbacks: tfvis.show.fitCallbacks({ name: "Training Performance" }, ["loss", "val_loss"], {
      height: 200,
      callbacks: ["onEpochEnd"],
    }),
  })

  return { model, userIndex, trackIndex }
}

export async function getRecommendations(
  userId: string,
  model: tf.Sequential,
  userIndex: Map<string, number>,
  trackIndex: Map<string, number>,
) {
  const userTensor = tf.tensor1d([userIndex.get(userId)!])
  const predictions = model.predict(userTensor) as tf.Tensor

  const trackScores = Array.from(trackIndex.entries()).map(([trackId, index]) => ({
    trackId,
    score: predictions.dataSync()[index],
  }))

  return trackScores.sort((a, b) => b.score - a.score).slice(0, 10)
}

async function getUserTrackInteractions(): Promise<UserTrackInteraction[]> {
  const listeningHistory = await prisma.listeningHistory.findMany({
    select: { userId: true, trackId: true, duration: true },
  })

  const purchases = await prisma.purchase.findMany({
    select: { userId: true, trackId: true },
  })

  const ratings = await prisma.trackRating.findMany({
    select: { userId: true, trackId: true, rating: true },
  })

  const interactions: UserTrackInteraction[] = [
    ...listeningHistory.map((h) => ({ userId: h.userId, trackId: h.trackId, interactionStrength: h.duration / 3600 })),
    ...purchases.map((p) => ({ userId: p.userId, trackId: p.trackId, interactionStrength: 1 })),
    ...ratings.map((r) => ({ userId: r.userId, trackId: r.trackId, interactionStrength: r.rating / 5 })),
  ]

  return interactions
}

function createIndices(interactions: UserTrackInteraction[]) {
  const userIndex = new Map<string, number>()
  const trackIndex = new Map<string, number>()

  interactions.forEach((i) => {
    if (!userIndex.has(i.userId)) userIndex.set(i.userId, userIndex.size)
    if (!trackIndex.has(i.trackId)) trackIndex.set(i.trackId, trackIndex.size)
  })

  return { userIndex, trackIndex }
}

