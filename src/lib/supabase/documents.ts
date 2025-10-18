import { createClient } from './client';

export interface Document {
  id: string;
  user_id: string;
  type: 'cv' | 'job';
  title: string;
  text: string;
  file_url?: string;
  lang: string;
  created_at: string;
  updated_at: string;
}

export async function createDocument(
  userId: string,
  type: 'cv' | 'job',
  title: string,
  text: string,
  fileUrl?: string,
  lang: string = 'en'
): Promise<Document> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('documents')
    .insert({
      user_id: userId,
      type,
      title,
      text,
      file_url: fileUrl,
      lang,
    })
    .select()
    .single();

  if (error) {
    console.error('Create document error:', error);
    throw new Error('Failed to create document');
  }

  return data;
}

export async function getUserDocuments(
  userId: string,
  type?: 'cv' | 'job'
): Promise<Document[]> {
  const supabase = createClient();

  let query = supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Get documents error:', error);
    throw new Error('Failed to fetch documents');
  }

  return data || [];
}

export async function getDocument(id: string): Promise<Document | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Get document error:', error);
    return null;
  }

  return data;
}

export async function deleteDocument(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Delete document error:', error);
    throw new Error('Failed to delete document');
  }
}

export async function updateDocument(
  id: string,
  updates: Partial<Pick<Document, 'title' | 'text' | 'lang'>>
): Promise<Document> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('documents')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Update document error:', error);
    throw new Error('Failed to update document');
  }

  return data;
}