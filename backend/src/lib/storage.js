import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import env from '../config/env.js';
import logger from './logger.js';

let s3ClientInstance = null;

export function getR2Client() {
  if (!s3ClientInstance) {
    const endpoint =
      env.R2_ENDPOINT ||
      (env.R2_ACCOUNT_ID ? `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : undefined);

    const hasCredentials =
      Boolean(env.R2_ACCESS_KEY_ID) && Boolean(env.R2_SECRET_ACCESS_KEY) && Boolean(endpoint);

    if (!hasCredentials) {
      logger.info(
        'Cloudflare R2 storage credentials not fully populated (running in stub/local mode)'
      );
      return null;
    }

    s3ClientInstance = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    });

    logger.info('Cloudflare R2 S3-compatible storage client initialized');
  }

  return s3ClientInstance;
}

/**
 * Diagnostics for Cloudflare R2 setup without exposing credentials
 */
export function testR2Configuration() {
  const isConfigured = Boolean(
    env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY && (env.R2_ENDPOINT || env.R2_ACCOUNT_ID)
  );

  return {
    success: true,
    status: isConfigured ? 'configured' : 'unconfigured',
    bucket: env.R2_BUCKET_NAME || 'unspecified',
  };
}

/**
 * Upload an object buffer to Cloudflare R2
 */
export async function uploadToR2({ key, buffer, contentType }) {
  const client = getR2Client();
  const bucket = env.R2_BUCKET_NAME || 'krishisetu-media';

  if (!client) {
    // Local / stub development mode
    const publicUrl = env.R2_PUBLIC_URL
      ? `${env.R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`
      : `https://pub-r2.krishisetu.in/${bucket}/${key}`;
    logger.info(`[R2-Stub] Uploaded virtual file [${key}] with mime [${contentType}] -> ${publicUrl}`);
    return {
      key,
      url: publicUrl,
      bucket,
      mode: 'stub',
    };
  }

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await client.send(command);

  const publicUrl = env.R2_PUBLIC_URL
    ? `${env.R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`
    : `${env.R2_ENDPOINT || `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`}/${bucket}/${key}`;

  logger.info(`[R2] Uploaded object [${key}] to bucket [${bucket}]`);

  return {
    key,
    url: publicUrl,
    bucket,
    mode: 'r2',
  };
}

/**
 * Delete an object from Cloudflare R2
 */
export async function deleteFromR2(key) {
  const client = getR2Client();
  const bucket = env.R2_BUCKET_NAME || 'krishisetu-media';

  if (!client) {
    logger.info(`[R2-Stub] Deleted virtual object [${key}] from bucket [${bucket}]`);
    return { success: true, mode: 'stub' };
  }

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await client.send(command);
  logger.info(`[R2] Deleted object [${key}] from bucket [${bucket}]`);

  return { success: true, mode: 'r2' };
}

export default {
  getR2Client,
  testR2Configuration,
  uploadToR2,
  deleteFromR2,
};
