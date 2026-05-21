import { createClient } from '@supabase/supabase-js';

// ─── Supabase Client ─────────────────────────────────────────────────────────
// Get these values from: Supabase Dashboard → Project Settings → API
const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     || 'https://cywccfxglanhketofhyw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Bvk4aCHwE4V_LAaauYbEcg_OpxMh973';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Debug: log connection errors to console so you can see them
supabase.from('rooms').select('count', { count: 'exact', head: true }).then(({ error }) => {
  if (error) {
    console.error('⚠️ Supabase connection issue:', error.message);
    console.error('   Check your URL and anon key in supabase.js or .env file');
    console.error('   Tables might not exist — run supabase_setup.sql in your SQL editor');
  } else {
    console.log('✅ Supabase connected successfully');
  }
});

// ─── Generic localStorage helpers ────────────────────────────────────────────
const ls = {
  get: (key, fallback = []) => {
    try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
    catch { return fallback; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  update: (key, id, updates, fallback = []) => {
    const items = ls.get(key, fallback);
    const idx = items.findIndex(i => i.id === id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], ...updates };
      ls.set(key, items);
      return items[idx];
    }
    return null;
  },
  upsert: (key, item, matchField = 'email', fallback = []) => {
    const items = ls.get(key, fallback);
    const idx = items.findIndex(i => i[matchField] === item[matchField]);
    if (idx >= 0) items[idx] = { ...items[idx], ...item };
    else items.push(item);
    ls.set(key, items);
    return item;
  },
};

// ─── PROFILES ────────────────────────────────────────────────────────────────
export async function getProfile(email) {
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('email', email).maybeSingle();
    if (error) throw error;
    if (data) { ls.upsert('dormdesk_profiles', data); return data; }
  } catch (e) {
    console.warn('getProfile DB failed:', e.message);
  }
  return ls.get('dormdesk_profiles', []).find(p => p.email === email) || null;
}

export async function saveProfile(email, role, status = 'approved') {
  const profile = { email, role, status };
  // Always write to localStorage immediately
  ls.upsert('dormdesk_profiles', profile);
  try {
    const { data, error } = await supabase.from('profiles').upsert(profile, { onConflict: 'email' }).select();
    if (error) throw error;
    if (data?.[0]) { ls.upsert('dormdesk_profiles', data[0]); return data[0]; }
  } catch (e) {
    console.warn('saveProfile DB failed:', e.message);
  }
  return profile;
}

export async function getProfiles() {
  try {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) throw error;
    if (data) { ls.set('dormdesk_profiles', data); return data; }
  } catch (e) {
    console.warn('getProfiles DB failed:', e.message);
  }
  return ls.get('dormdesk_profiles', []);
}

export async function updateProfileStatus(email, status) {
  // Optimistic local update first
  const local = ls.update('dormdesk_profiles', undefined, { status }, []);
  const localProfiles = ls.get('dormdesk_profiles', []);
  const idx = localProfiles.findIndex(p => p.email === email);
  if (idx >= 0) { localProfiles[idx].status = status; ls.set('dormdesk_profiles', localProfiles); }
  
  try {
    const { data, error } = await supabase.from('profiles').update({ status }).eq('email', email).select();
    if (error) throw error;
    if (data?.[0]) {
      const lp = ls.get('dormdesk_profiles', []);
      const i = lp.findIndex(p => p.email === email);
      if (i >= 0) { lp[i] = data[0]; ls.set('dormdesk_profiles', lp); }
      return data[0];
    }
  } catch (e) {
    console.warn('updateProfileStatus DB failed:', e.message);
  }
  return localProfiles[idx] || null;
}

// ─── LAUNDRY REQUESTS ────────────────────────────────────────────────────────
export async function getLaundryRequests() {
  try {
    const { data, error } = await supabase.from('laundry_requests').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    if (data) { ls.set('dormdesk_laundries', data); return data; }
  } catch (e) {
    console.warn('getLaundryRequests DB failed:', e.message);
  }
  return ls.get('dormdesk_laundries', []);
}

export async function addLaundryRequest({ user_email, room_name, type }) {
  const newReq = {
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
    user_email, room_name, type,
    status: 'pending',
    created_at: new Date().toISOString(),
  };
  // Optimistic local insert
  const local = ls.get('dormdesk_laundries', []);
  local.unshift(newReq);
  ls.set('dormdesk_laundries', local);

  try {
    const { data, error } = await supabase.from('laundry_requests').insert([{
      user_email, room_name, type, status: 'pending'
    }]).select();
    if (error) throw error;
    if (data?.[0]) {
      // Replace temp record with real DB record
      const l = ls.get('dormdesk_laundries', []);
      const idx = l.findIndex(r => r.id === newReq.id);
      if (idx >= 0) l[idx] = data[0]; else l.unshift(data[0]);
      ls.set('dormdesk_laundries', l);
      return data[0];
    }
  } catch (e) {
    console.warn('addLaundryRequest DB failed:', e.message);
  }
  return newReq;
}

export async function updateLaundryRequestStatus(id, status) {
  // Optimistic update
  const localResult = ls.update('dormdesk_laundries', id, { status });
  
  try {
    const { data, error } = await supabase.from('laundry_requests').update({ status }).eq('id', id).select();
    if (error) throw error;
    if (data?.[0]) {
      ls.update('dormdesk_laundries', id, data[0]);
      return data[0];
    }
  } catch (e) {
    console.warn('updateLaundryRequestStatus DB failed:', e.message);
  }
  return localResult;
}

// ─── ROOM SERVICES ───────────────────────────────────────────────────────────
export async function getRoomServices() {
  try {
    const { data, error } = await supabase.from('room_services').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    if (data) { ls.set('dormdesk_room_services', data); return data; }
  } catch (e) {
    console.warn('getRoomServices DB failed:', e.message);
  }
  return ls.get('dormdesk_room_services', []);
}

export async function addRoomService({ user_email, room_name, type }) {
  const newReq = {
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
    user_email, room_name, type,
    status: 'pending',
    created_at: new Date().toISOString(),
  };
  // Optimistic local insert
  const local = ls.get('dormdesk_room_services', []);
  local.unshift(newReq);
  ls.set('dormdesk_room_services', local);

  try {
    const { data, error } = await supabase.from('room_services').insert([{
      user_email, room_name, type, status: 'pending'
    }]).select();
    if (error) throw error;
    if (data?.[0]) {
      const l = ls.get('dormdesk_room_services', []);
      const idx = l.findIndex(r => r.id === newReq.id);
      if (idx >= 0) l[idx] = data[0]; else l.unshift(data[0]);
      ls.set('dormdesk_room_services', l);
      return data[0];
    }
  } catch (e) {
    console.warn('addRoomService DB failed:', e.message);
  }
  return newReq;
}

export async function updateRoomServiceStatus(id, status) {
  // Optimistic update — works even without DB
  const localResult = ls.update('dormdesk_room_services', id, { status });

  try {
    const { data, error } = await supabase.from('room_services').update({ status }).eq('id', id).select();
    if (error) throw error;
    if (data?.[0]) {
      ls.update('dormdesk_room_services', id, data[0]);
      return data[0];
    }
  } catch (e) {
    console.warn('updateRoomServiceStatus DB failed:', e.message);
  }
  return localResult;
}

// ─── MESS MENU ────────────────────────────────────────────────────────────────
const DEFAULT_MENU = [
  { meal: 'Breakfast', time: '7:30 AM – 9:00 AM', items: 'Idli, Dosa, Poha, Bread & Eggs, Tea/Coffee' },
  { meal: 'Lunch',     time: '12:30 PM – 2:00 PM', items: 'Rice, Dal, Sabzi, Roti, Curd, Salad' },
  { meal: 'Snacks',    time: '4:30 PM – 5:30 PM',  items: 'Samosa, Tea, Biscuits' },
  { meal: 'Dinner',    time: '7:30 PM – 9:00 PM',  items: 'Rice, Dal, Paneer/Chicken, Roti, Sweet' },
];

export async function getMessMenu() {
  try {
    const { data, error } = await supabase.from('mess_menu').select('*').order('id');
    if (error) throw error;
    if (data?.length > 0) { ls.set('dormdesk_mess_menu', data); return data; }
  } catch (e) {
    console.warn('getMessMenu DB failed:', e.message);
  }
  return ls.get('dormdesk_mess_menu', DEFAULT_MENU);
}

export async function saveMessMenu(schedule) {
  // Save locally first
  ls.set('dormdesk_mess_menu', schedule);

  try {
    const { error } = await supabase.from('mess_menu').upsert(schedule, { onConflict: 'meal' });
    if (error) throw error;
  } catch (e) {
    console.warn('saveMessMenu DB failed:', e.message);
  }
  return schedule;
}
