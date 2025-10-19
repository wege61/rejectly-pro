import { createClient } from "@/lib/supabase/client";

const BUCKET_NAME = "cv-files";

export async function uploadCV(file: File, userId: string): Promise<string> {
  const supabase = createClient();

  // Unique filename: userId/timestamp-originalname
  const timestamp = Date.now();
  const fileName = `${userId}/${timestamp}-${file.name}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  return data.path;
}

export async function deleteCV(filePath: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

export function getPublicUrl(filePath: string): string {
  const supabase = createClient();

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return data.publicUrl;
}
