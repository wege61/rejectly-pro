import { createClient } from './client';

const BUCKET_NAME = 'cv-files';

export async function uploadCV(file: File, userId: string): Promise<string> {
  const supabase = createClient();
  
  // Generate unique file name
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload file');
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return publicUrl;
}

export async function deleteCV(filePath: string): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    console.error('Delete error:', error);
    throw new Error('Failed to delete file');
  }
}

export async function uploadCVPhoto(photoBlob: Blob, userId: string): Promise<string> {
  const supabase = createClient();

  const ext = photoBlob.type === 'image/png' ? 'png' : 'jpg';
  const fileName = `${userId}/photos/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, photoBlob, {
      cacheControl: '3600',
      upsert: false,
      contentType: photoBlob.type,
    });

  if (error) {
    console.error('Photo upload error:', error);
    throw new Error('Failed to upload photo');
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return publicUrl;
}

export async function getCV(filePath: string): Promise<Blob | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .download(filePath);

  if (error) {
    console.error('Download error:', error);
    return null;
  }

  return data;
}