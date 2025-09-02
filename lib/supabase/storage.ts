'use server'

import { createAdminClient } from './admin';

/**
 * Create a short-lived signed URL for a report PDF stored in the private bucket.
 * Input should be a storage path (e.g., `${siswaId}/ganjil-2025-1735223.pdf`).
 * Returns null if signing fails.
 */
export async function createSignedRaporUrl(path: string, expiresInSec = 600): Promise<string | null> {
  if (!path) return null;
  const admin = await createAdminClient();
  const { data, error } = await admin.storage
    .from('dokumen-rapor')
    .createSignedUrl(path, expiresInSec);
  if (error) return null;
  return data?.signedUrl ?? null;
}
