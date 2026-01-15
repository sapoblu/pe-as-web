import { supabase } from './supabase';
import type { Database } from './supabase';

type Announcement = Database['public']['Tables']['announcements']['Row'];
type AnnouncementInsert = Database['public']['Tables']['announcements']['Insert'];
type Comment = Database['public']['Tables']['comments']['Row'];
type CommentInsert = Database['public']['Tables']['comments']['Insert'];
type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type Media = Database['public']['Tables']['media']['Row'];
type MediaInsert = Database['public']['Tables']['media']['Insert'];
type Purchase = Database['public']['Tables']['purchases']['Row'];
type PurchaseInsert = Database['public']['Tables']['purchases']['Insert'];

// ==================== USUÁRIOS ====================

export async function createUser(user: UserInsert) {
  const { data, error } = await supabase
    .from('users')
    .insert(user)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUser(userId: string, updates: Partial<UserInsert>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ==================== ANÚNCIOS ====================

export async function createAnnouncement(announcement: AnnouncementInsert) {
  const { data, error } = await supabase
    .from('announcements')
    .insert(announcement)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAnnouncements(filters?: {
  state?: string;
  city?: string;
  vehicleBrand?: string;
  searchTerm?: string;
}) {
  let query = supabase
    .from('announcements')
    .select(`
      *,
      seller:users!announcements_seller_id_fkey(id, name, email, avatar_url, rating),
      comments:comments(count)
    `);

  if (filters?.state && filters.state !== 'all') {
    query = query.eq('state', filters.state);
  }

  if (filters?.city && filters.city !== 'all') {
    query = query.eq('city', filters.city);
  }

  if (filters?.vehicleBrand && filters.vehicleBrand !== 'all') {
    query = query.eq('vehicle_brand', filters.vehicleBrand);
  }

  if (filters?.searchTerm) {
    query = query.ilike('title', `%${filters.searchTerm}%`);
  }

  // Ordenação: primeiro por comissão (12% primeiro), depois por preço (maior primeiro)
  query = query.order('commission', { ascending: false }).order('price', { ascending: false });

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getAnnouncementById(announcementId: string) {
  const { data, error } = await supabase
    .from('announcements')
    .select(`
      *,
      seller:users!announcements_seller_id_fkey(id, name, email, avatar_url, rating),
      comments:comments(
        *,
        user:users!comments_user_id_fkey(id, name, avatar_url)
      ),
      media:media(*)
    `)
    .eq('id', announcementId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateAnnouncement(announcementId: string, updates: Partial<AnnouncementInsert>) {
  const { data, error } = await supabase
    .from('announcements')
    .update(updates)
    .eq('id', announcementId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAnnouncement(announcementId: string) {
  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', announcementId);

  if (error) throw error;
}

export async function incrementAnnouncementViews(announcementId: string) {
  const { error } = await supabase.rpc('increment_views', {
    announcement_id: announcementId
  });

  if (error) throw error;
}

// ==================== COMENTÁRIOS ====================

export async function createComment(comment: CommentInsert) {
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
    .select(`
      *,
      user:users!comments_user_id_fkey(id, name, avatar_url)
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function getCommentsByAnnouncementId(announcementId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      user:users!comments_user_id_fkey(id, name, avatar_url)
    `)
    .eq('announcement_id', announcementId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function deleteComment(commentId: string) {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
}

// ==================== MÍDIA ====================

export async function createMedia(media: MediaInsert) {
  const { data, error } = await supabase
    .from('media')
    .insert(media)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMediaByAnnouncementId(announcementId: string) {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('announcement_id', announcementId)
    .order('order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function deleteMedia(mediaId: string) {
  const { error } = await supabase
    .from('media')
    .delete()
    .eq('id', mediaId);

  if (error) throw error;
}

// ==================== COMPRAS ====================

export async function createPurchase(purchase: PurchaseInsert) {
  const { data, error } = await supabase
    .from('purchases')
    .insert(purchase)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPurchasesByBuyerId(buyerId: string) {
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      *,
      announcement:announcements(*)
    `)
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPurchasesBySellerId(sellerId: string) {
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      *,
      announcement:announcements!inner(*)
    `)
    .eq('announcement.seller_id', sellerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updatePurchaseStatus(
  purchaseId: string,
  status: 'pending' | 'confirmed' | 'cancelled'
) {
  const { data, error } = await supabase
    .from('purchases')
    .update({ status })
    .eq('id', purchaseId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ==================== UPLOAD DE ARQUIVOS ====================

export async function uploadFile(
  bucket: 'videos' | 'images',
  path: string,
  file: File
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return urlData.publicUrl;
}

export async function deleteFile(bucket: 'videos' | 'images', path: string) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
}
