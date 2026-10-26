import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient, type SupabaseClient } from '@supabase/supabase-js';
import { config } from '@/lib/config';

type AdminClient = Pick<SupabaseClient, 'storage'>;

const BUCKET = 'cv-files';
const PAGE = 1000;

/** Every file path under `prefix` in the bucket. Storage lists one folder level at a time. */
async function listFilesUnder(admin: AdminClient, prefix: string): Promise<string[]> {
  const files: string[] = [];
  for (let offset = 0; ; offset += PAGE) {
    const { data, error } = await admin.storage.from(BUCKET).list(prefix, { limit: PAGE, offset });
    if (error) throw error;
    for (const entry of data) {
      const path = `${prefix}/${entry.name}`;
      // Folders come back without an id.
      if (entry.id === null) files.push(...(await listFilesUnder(admin, path)));
      else files.push(path);
    }
    if (data.length < PAGE) return files;
  }
}

/** Remove the user's uploaded resumes, photos and generated PDFs (all stored under `<userId>/`). */
async function deleteUserFiles(admin: AdminClient, userId: string): Promise<number> {
  const paths = await listFilesUnder(admin, userId);
  for (let i = 0; i < paths.length; i += PAGE) {
    const { error } = await admin.storage.from(BUCKET).remove(paths.slice(i, i + PAGE));
    if (error) throw error;
  }
  return paths.length;
}

export async function DELETE(request: NextRequest) {
  try {
    // 1. Kullanıcının kimliğini doğrula
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('❌ Auth failed:', authError);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔍 Deleting user:', user.id);

    // 2. Admin client oluştur (Service Role Key ile)
    const supabaseAdmin = createAdminClient(
      config.supabase.url,
      config.supabase.serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // 3. Delete the user's files first: the database rows go with the user
    // (ON DELETE CASCADE), but storage objects don't. If this fails we stop,
    // so the account is never removed while its resumes stay behind.
    try {
      const removed = await deleteUserFiles(supabaseAdmin, user.id);
      console.log(`🗑️ Removed ${removed} stored files for user ${user.id}`);
    } catch (storageError) {
      console.error('❌ Failed to delete user files:', storageError);
      return NextResponse.json(
        { error: 'Failed to delete your files. Please try again.' },
        { status: 500 }
      );
    }

    // 4. Kullanıcıyı sil (Admin API ile)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
      user.id
    );

    if (deleteError) {
      console.error('❌ Delete user error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete account' },
        { status: 500 }
      );
    }

    console.log('✅ User deleted successfully:', user.id);

    // 5. Kullanıcıyı çıkış yaptır
    await supabase.auth.signOut();

    return NextResponse.json(
      { message: 'Account deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Delete account error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}