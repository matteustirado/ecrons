const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const path = require('path');

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

exports.uploadBuffer = async (buffer, originalName, mimeType, folder) => {
  const ext = path.extname(originalName);
  const hash = crypto.randomBytes(16).toString('hex');
  const fileName = `${folder}/${hash}${ext}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: mimeType,
  });

  await s3Client.send(command);

  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.backblazeb2.com/${fileName}`;
};