import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/env';
import { ApiError } from './error';

export const ALLOWED_AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const;
const MAX_SIZE = config.storage.avatarMaxSizeMb * 1024 * 1024;

/** Multer middleware: single "avatar" field, memory storage, type + size guard. */
export const uploadAvatarMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_AVATAR_TYPES.includes(file.mimetype as (typeof ALLOWED_AVATAR_TYPES)[number])) {
      return cb(
        new ApiError(422, 'Unsupported image type. Allowed: PNG, JPEG, WEBP.', {
          code: 'AVATAR_INVALID_TYPE',
        }),
      );
    }
    cb(null, true);
  },
}).single('avatar');

const extensionFor = (mimetype: string): string => {
  switch (mimetype) {
    case 'image/png':
      return 'png';
    case 'image/jpeg':
      return 'jpg';
    case 'image/webp':
      return 'webp';
    default:
      return 'bin';
  }
};

const randomName = (mimetype: string): string =>
  `${crypto.randomBytes(16).toString('hex')}.${extensionFor(mimetype)}`;

const getSupabase = (): SupabaseClient | null => {
  if (!config.storage.supabaseUrl || !config.storage.supabaseKey) return null;
  return createClient(config.storage.supabaseUrl, config.storage.supabaseKey, {
    auth: { persistSession: false },
  });
};

/**
 * Persist an avatar buffer. Uses Supabase Storage when configured, otherwise
 * falls back to the local filesystem (served statically at /uploads).
 * Returns the publicly reachable URL.
 */
export const saveAvatar = async (buffer: Buffer, mimetype: string): Promise<string> => {
  const supabase = getSupabase();
  const fileName = randomName(mimetype);

  if (supabase) {
    const { error } = await supabase.storage
      .from(config.storage.bucket)
      .upload(fileName, buffer, { contentType: mimetype, upsert: true });
    if (error) {
      throw ApiError.internal('Failed to persist avatar file.', 'AVATAR_UPLOAD_FAILED');
    }
    const { data } = supabase.storage.from(config.storage.bucket).getPublicUrl(fileName);
    return data.publicUrl;
  }

  // Local disk fallback
  const dir = path.resolve(process.cwd(), config.storage.localDir);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, fileName), buffer);
  return `/${config.storage.localDir}/${fileName}`;
};

/** Remove an avatar previously stored via saveAvatar. */
export const removeAvatar = async (url: string): Promise<void> => {
  if (!url) return;
  const supabase = getSupabase();
  if (supabase && url.includes(config.storage.bucket)) {
    const fileName = decodeURIComponent(url.split('/').pop() || '');
    if (fileName) await supabase.storage.from(config.storage.bucket).remove([fileName]);
    return;
  }

  if (url.startsWith(`/${config.storage.localDir}/`)) {
    const fileName = path.basename(url);
    const filePath = path.resolve(process.cwd(), config.storage.localDir, fileName);
    await fs.rm(filePath, { force: true });
  }
};
