import { supabase } from './supabase';

export async function uploadFile(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  
  try {
    const bytes = await file.arrayBuffer();

    // Dateinamen sicher machen
    const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const filename = `${Date.now()}_${cleanName}`;
    
    // Upload to Supabase bucket
    const { data, error } = await supabase.storage
      .from('website_uploads')
      .upload(filename, bytes, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('website_uploads')
      .getPublicUrl(filename);
      
    return urlData.publicUrl;
  } catch (e) {
    console.error('File upload error:', e);
    return null;
  }
}
