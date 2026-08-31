export const generateETag = async (redis) => {
  const version = (await redis.get("students:version")) || 1;
  return `"students-v-${version}"`;
};