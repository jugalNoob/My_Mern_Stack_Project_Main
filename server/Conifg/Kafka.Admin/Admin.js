
import {kafka  } from '../Kafka.Client/client.js'

export async function init() {
  const admin = kafka.admin();

  await admin.connect();

  await admin.createTopics({
    topics: [
      {
        topic: "signUp_user",
        numPartitions: 3,
        replicationFactor: 1, // FIXED (safe for 1 broker)
        config: {
          "retention.ms": "604800000",
        },
      },
    ],
  });

  console.log("✅ Topics created");

  await admin.disconnect();
}


