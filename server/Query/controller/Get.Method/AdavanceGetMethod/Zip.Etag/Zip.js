
import zlib from "node:zlib";
export function sendResponse(res, data, etag) {
  const jsonData = JSON.stringify(data);
  const acceptEncoding = res.req.headers["accept-encoding"] || "";

  res.setHeader("ETag", etag);
  res.setHeader("Cache-Control", "public, max-age=60");

  if (acceptEncoding.includes("gzip")) {
    return zlib.gzip(jsonData, (err, compressed) => {
      if (err) return res.status(500).json({ error: "Compression failed" });
      res.setHeader("Content-Encoding", "gzip");
      res.setHeader("Content-Type", "application/json");
      return res.status(200).send(compressed);
    });
  }

  return res.status(200).json(data);
}