import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cywccfxglanhketofhyw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Bvk4aCHwE4V_LAaauYbEcg_OpxMh973';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- FAIL-SAFE DATABASE HELPERS WITH LOCALSTORAGE FALLBACKS ---

// Helper to safely get profile
export async function getProfile(email) {
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('email', email).maybeSingle();
    if (error) throw error;
    if (data) {
      // Sync local cache
      const localProfiles = JSON.parse(localStorage.getItem('dormdesk_profiles') || '[]');
      const index = localProfiles.findIndex(p => p.email === email);
      if (index >= 0) {
        localProfiles[index] = data;
      } else {
        localProfiles.push(data);
      }
      localStorage.setItem('dormdesk_profiles', JSON.stringify(localProfiles));
      return data;
    }
  } catch (err) {
    console.warn("Profiles DB read failed, falling back to localStorage:", err.message);
  }
  
  // Local storage fallback
  const localProfiles = JSON.parse(localStorage.getItem('dormdesk_profiles') || '[]');
  return localProfiles.find(p => p.email === email) || null;
}

// Helper to save profile
export async function saveProfile(email, role, status = 'approved') {
  const profile = { email, role, status };
  try {
    const { data, error } = await supabase.from('profiles').upsert(profile).select();
    if (error) throw error;
    if (data && data.length > 0) {
      const localProfiles = JSON.parse(localStorage.getItem('dormdesk_profiles') || '[]');
      const index = localProfiles.findIndex(p => p.email === email);
      if (index >= 0) {
        localProfiles[index] = data[0];
      } else {
        localProfiles.push(data[0]);
      }
      localStorage.setItem('dormdesk_profiles', JSON.stringify(localProfiles));
      return data[0];
    }
  } catch (err) {
    console.warn("Profiles DB write failed, falling back to localStorage:", err.message);
  }
  
  const localProfiles = JSON.parse(localStorage.getItem('dormdesk_profiles') || '[]');
  const index = localProfiles.findIndex(p => p.email === email);
  if (index >= 0) {
    localProfiles[index] = profile;
  } else {
    localProfiles.push(profile);
  }
  localStorage.setItem('dormdesk_profiles', JSON.stringify(localProfiles));
  return profile;
}

// Helper to get all profiles (used by Admin)
export async function getProfiles() {
  try {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) throw error;
    if (data) {
      localStorage.setItem('dormdesk_profiles', JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn("Profiles DB read failed, falling back to localStorage:", err.message);
  }
  return JSON.parse(localStorage.getItem('dormdesk_profiles') || '[]');
}

// Helper to update a profile status (used by Admin to approve manager)
export async function updateProfileStatus(email, status) {
  try {
    const { data, error } = await supabase.from('profiles').update({ status }).eq('email', email).select();
    if (error) throw error;
    if (data && data.length > 0) {
      const localProfiles = JSON.parse(localStorage.getItem('dormdesk_profiles') || '[]');
      const index = localProfiles.findIndex(p => p.email === email);
      if (index >= 0) {
        localProfiles[index] = data[0];
      } else {
        localProfiles.push(data[0]);
      }
      localStorage.setItem('dormdesk_profiles', JSON.stringify(localProfiles));
      return data[0];
    }
  } catch (err) {
    console.warn("Profiles DB update failed, falling back to localStorage:", err.message);
  }
  
  const localProfiles = JSON.parse(localStorage.getItem('dormdesk_profiles') || '[]');
  const index = localProfiles.findIndex(p => p.email === email);
  if (index >= 0) {
    localProfiles[index].status = status;
    localStorage.setItem('dormdesk_profiles', JSON.stringify(localProfiles));
    return localProfiles[index];
  }
  return null;
}

// Laundry Requests Helpers
export async function getLaundryRequests() {
  try {
    const { data, error } = await supabase.from('laundry_requests').select('*');
    if (error) throw error;
    if (data) {
      localStorage.setItem('dormdesk_laundries', JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn("Laundry DB read failed, falling back to localStorage:", err.message);
  }
  return JSON.parse(localStorage.getItem('dormdesk_laundries') || '[]');
}

export async function addLaundryRequest(request) {
  const newReq = { 
    id: Math.random().toString(36).substring(2, 9), 
    status: 'pending', 
    ...request, 
    created_at: new Date().toISOString() 
  };
  try {
    const { data, error } = await supabase.from('laundry_requests').insert([newReq]).select();
    if (error) throw error;
    if (data && data.length > 0) {
      const localReqs = JSON.parse(localStorage.getItem('dormdesk_laundries') || '[]');
      localReqs.push(data[0]);
      localStorage.setItem('dormdesk_laundries', JSON.stringify(localReqs));
      return data[0];
    }
  } catch (err) {
    console.warn("Laundry DB insert failed, falling back to localStorage:", err.message);
  }
  
  const localReqs = JSON.parse(localStorage.getItem('dormdesk_laundries') || '[]');
  localReqs.push(newReq);
  localStorage.setItem('dormdesk_laundries', JSON.stringify(localReqs));
  return newReq;
}

export async function updateLaundryRequestStatus(id, status) {
  try {
    const { data, error } = await supabase.from('laundry_requests').update({ status }).eq('id', id).select();
    if (error) throw error;
    if (data && data.length > 0) {
      const localReqs = JSON.parse(localStorage.getItem('dormdesk_laundries') || '[]');
      const index = localReqs.findIndex(r => r.id === id);
      if (index >= 0) {
        localReqs[index] = data[0];
      } else {
        localReqs.push(data[0]);
      }
      localStorage.setItem('dormdesk_laundries', JSON.stringify(localReqs));
      return data[0];
    }
  } catch (err) {
    console.warn("Laundry DB update failed, falling back to localStorage:", err.message);
  }
  
  const localReqs = JSON.parse(localStorage.getItem('dormdesk_laundries') || '[]');
  const index = localReqs.findIndex(r => r.id === id);
  if (index >= 0) {
    localReqs[index].status = status;
    localStorage.setItem('dormdesk_laundries', JSON.stringify(localReqs));
    return localReqs[index];
  }
  return null;
}

// Room Service Requests Helpers
export async function getRoomServices() {
  try {
    const { data, error } = await supabase.from('room_services').select('*');
    if (error) throw error;
    if (data) {
      localStorage.setItem('dormdesk_room_services', JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn("Room services DB read failed, falling back to localStorage:", err.message);
  }
  return JSON.parse(localStorage.getItem('dormdesk_room_services') || '[]');
}

export async function addRoomService(request) {
  const newReq = { 
    id: Math.random().toString(36).substring(2, 9), 
    status: 'pending', 
    ...request, 
    created_at: new Date().toISOString() 
  };
  try {
    const { data, error } = await supabase.from('room_services').insert([newReq]).select();
    if (error) throw error;
    if (data && data.length > 0) {
      const localReqs = JSON.parse(localStorage.getItem('dormdesk_room_services') || '[]');
      localReqs.push(data[0]);
      localStorage.setItem('dormdesk_room_services', JSON.stringify(localReqs));
      return data[0];
    }
  } catch (err) {
    console.warn("Room services DB insert failed, falling back to localStorage:", err.message);
  }
  
  const localReqs = JSON.parse(localStorage.getItem('dormdesk_room_services') || '[]');
  localReqs.push(newReq);
  localStorage.setItem('dormdesk_room_services', JSON.stringify(localReqs));
  return newReq;
}

export async function updateRoomServiceStatus(id, status) {
  try {
    const { data, error } = await supabase.from('room_services').update({ status }).eq('id', id).select();
    if (error) throw error;
    if (data && data.length > 0) {
      const localReqs = JSON.parse(localStorage.getItem('dormdesk_room_services') || '[]');
      const index = localReqs.findIndex(r => r.id === id);
      if (index >= 0) {
        localReqs[index] = data[0];
      } else {
        localReqs.push(data[0]);
      }
      localStorage.setItem('dormdesk_room_services', JSON.stringify(localReqs));
      return data[0];
    }
  } catch (err) {
    console.warn("Room services DB update failed, falling back to localStorage:", err.message);
  }
  
  const localReqs = JSON.parse(localStorage.getItem('dormdesk_room_services') || '[]');
  const index = localReqs.findIndex(r => r.id === id);
  if (index >= 0) {
    localReqs[index].status = status;
    localStorage.setItem('dormdesk_room_services', JSON.stringify(localReqs));
    return localReqs[index];
  }
  return null;
}

// Mess Menu Helpers
export async function getMessMenu() {
  try {
    const { data, error } = await supabase.from('mess_menu').select('*');
    if (error) throw error;
    if (data && data.length > 0) {
      localStorage.setItem('dormdesk_mess_menu', JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn("Mess menu DB read failed, falling back to localStorage:", err.message);
  }
  const localMenu = localStorage.getItem('dormdesk_mess_menu');
  if (localMenu) return JSON.parse(localMenu);
  
  // Default menu
  return [
    { meal: 'Breakfast', time: '7:30 AM – 9:00 AM', items: 'Idli, Dosa, Poha, Bread & Eggs, Tea/Coffee' },
    { meal: 'Lunch', time: '12:30 PM – 2:00 PM', items: 'Rice, Dal, Sabzi, Roti, Curd, Salad' },
    { meal: 'Snacks', time: '4:30 PM – 5:30 PM', items: 'Samosa, Tea, Biscuits' },
    { meal: 'Dinner', time: '7:30 PM – 9:00 PM', items: 'Rice, Dal, Paneer/Chicken, Roti, Sweet' },
  ];
}

export async function saveMessMenu(schedule) {
  try {
    const { error } = await supabase.from('mess_menu').upsert(schedule);
    if (error) throw error;
    localStorage.setItem('dormdesk_mess_menu', JSON.stringify(schedule));
    return schedule;
  } catch (err) {
    console.warn("Mess menu DB write failed, falling back to localStorage:", err.message);
  }
  localStorage.setItem('dormdesk_mess_menu', JSON.stringify(schedule));
  return schedule;
}
