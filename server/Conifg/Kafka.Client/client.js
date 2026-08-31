

import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['192.168.29.78:9092'], // Your Kafka broker address
  retry: { retries: 5 },
  connectionTimeout: 3000, // Optional: Adjust the timeout as needed
});



console.log("kafka client")


