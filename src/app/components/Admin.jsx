import { useState, useEffect } from 'react';
import { getProfiles, updateProfileStatus } from '../../supabase';
import { Calendar, Users, IndianRupee, Bed, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';

export function Admin({ rooms, bookings, complaints = [], onAddRoom, onDeleteRoom, onCancelBooking }) {
  const [activeTab, setActiveTab] = useState('rooms');
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const profs = await getProfiles();
      setProfiles(profs);
    };
    fetchProfiles();
  }, []);

  const handleApproveManager = async (email) => {
    const updated = await updateProfileStatus(email, 'approved');
    if (updated) {
      setProfiles(profiles.map(p => p.email === email ? { ...p, status: 'approved' } : p));
    }
  };

  const handleRejectManager = async (email) => {
    const updated = await updateProfileStatus(email, 'rejected');
    if (updated) {
      setProfiles(profiles.map(p => p.email === email ? { ...p, status: 'rejected' } : p));
    }
  };

  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: '', type: 'Shared', capacity: 1, beds: 1, price: 0, amenities: '' });

  const totalRevenue = bookings.reduce((sum, booking) => {
    const room = rooms.find(r => r.name === (booking.room || booking.room_name));
    const period = booking.checkIn || booking.check_in || '';
    const monthsCount = period.includes(',') ? period.split(',').length : 1;
    const roomPrice = room ? room.price : 0;
    return sum + (roomPrice * monthsCount);
  }, 0);

  const activeGuests = bookings.filter(b => b.status === 'confirmed').length;

  const stats = [
    { label: 'Total Bookings', value: bookings.length.toString(), icon: Calendar, color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Rooms', value: rooms.length.toString(), icon: Bed, color: 'from-purple-500 to-pink-500' },
    { label: 'Revenue (Total)', value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: 'from-green-500 to-emerald-500' },
    { label: 'Active Guests', value: activeGuests.toString(), icon: Users, color: 'from-orange-500 to-amber-500' },
  ];

  const handleAddRoom = () => {
    if (!newRoom.name || newRoom.price <= 0) return;
    const room = {
      id: Date.now(), name: newRoom.name, type: newRoom.type,
      capacity: newRoom.capacity, beds: newRoom.beds, price: newRoom.price,
      amenities: newRoom.amenities.split(',').map(a => a.trim()).filter(a => a),
    };
    onAddRoom(room);
    setShowAddRoom(false);
    setNewRoom({ name: '', type: 'Shared', capacity: 1, beds: 1, price: 0, amenities: '' });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Admin Dashboard</h1>
        <div className="flex gap-2 bg-muted/50 backdrop-blur-lg rounded-xl p-1 overflow-x-auto max-w-full">
          {['dashboard', 'bookings', 'rooms', 'complaints'].map((tab) => (
            <motion.button key={tab} onClick={() => setActiveTab(tab)} className={`relative px-4 py-2 rounded-lg capitalize transition-colors flex-shrink-0 ${activeTab === tab ? '' : 'hover:bg-background/50'}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {activeTab === tab && (<motion.div layoutId="activeTab" className="absolute inset-0 bg-background shadow-lg rounded-lg" transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />)}
              <span className="relative z-10">{tab}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
                  <GlassCard className="p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`} whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.6 }}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </motion.div>
                    </div>
                    <motion.p className="text-3xl font-semibold mb-1" whileHover={{ scale: 1.05 }}>{stat.value}</motion.p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
            {bookings.length === 0 && rooms.length === 0 ? (
              <GlassCard className="p-12 text-center"><Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" /><h3 className="mb-2">No Data Yet</h3><p className="text-muted-foreground">Add rooms and start accepting bookings to see your dashboard stats.</p></GlassCard>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard className="p-6"><h3 className="mb-4">Recent Bookings</h3>
                  {bookings.length === 0 ? (<div className="text-center py-8"><Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground" /><p className="text-muted-foreground">No bookings yet</p></div>) : (
                    <div className="space-y-3">{bookings.slice(0, 5).map((booking, index) => (
                      <motion.div key={booking.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div><p className="font-medium">{booking.guest || booking.guest_name}</p><p className="text-sm text-muted-foreground">{booking.room || booking.room_name} - {booking.checkIn || booking.check_in}</p></div>
                        <span className={`px-3 py-1 rounded-full text-sm ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{booking.status}</span>
                      </motion.div>
                    ))}</div>
                  )}
                </GlassCard>
                <GlassCard className="p-6"><h3 className="mb-4">Room Overview</h3>
                  {rooms.length === 0 ? (<div className="text-center py-8"><Bed className="w-12 h-12 mx-auto mb-3 text-muted-foreground" /><p className="text-muted-foreground">No rooms added yet</p></div>) : (
                    <div className="space-y-4">{rooms.map((room, index) => (
                      <motion.div key={room.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                        <div className="flex justify-between mb-2"><span className="text-sm font-medium">{room.name}</span><span className="text-sm text-muted-foreground">₹{room.price.toLocaleString()}/month</span></div>
                        <div className="w-full bg-muted rounded-full h-2"><motion.div className="bg-gradient-to-r from-primary to-purple-600 h-2 rounded-full" initial={{ width: 0 }} animate={{ width: '0%' }} transition={{ duration: 1, delay: index * 0.1 }} /></div>
                      </motion.div>
                    ))}</div>
                  )}
                </GlassCard>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'bookings' && (
          <motion.div key="bookings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <GlassCard className="overflow-hidden">
              {bookings.length === 0 ? (
                <div className="p-12 text-center"><Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" /><h3 className="mb-2">No Bookings Yet</h3><p className="text-muted-foreground">Bookings will appear here once guests start making reservations.</p></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4">Booking ID</th>
                        <th className="text-left p-4">Guest</th>
                        <th className="text-left p-4">Room</th>
                        <th className="text-left p-4">Check-in</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking, index) => (
                        <motion.tr key={booking.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="border-b border-border hover:bg-muted/30 transition-colors">
                          <td className="p-4 font-mono text-xs max-w-[120px] truncate" title={booking.id}>{booking.id}</td>
                          <td className="p-4">{booking.guest || booking.guest_name}</td>
                          <td className="p-4">{booking.room || booking.room_name}</td>
                          <td className="p-4">{booking.checkIn || booking.check_in}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="p-4">
                            {booking.status === 'confirmed' && onCancelBooking && (
                              <motion.button
                                onClick={() => onCancelBooking(booking.id)}
                                className="bg-destructive/15 hover:bg-destructive/25 text-destructive px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Cancel Booking
                              </motion.button>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}

        {activeTab === 'rooms' && (
          <motion.div key="rooms" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="flex justify-end">
              <motion.button onClick={() => setShowAddRoom(!showAddRoom)} className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground px-6 py-3 rounded-xl shadow-lg flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Plus className="w-5 h-5" />Add New Room</motion.button>
            </div>
            <AnimatePresence>
              {showAddRoom && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <GlassCard className="p-6"><h3 className="mb-4">Add New Room</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-muted-foreground">Room Name</label>
                        <input type="text" placeholder="e.g. Room 101" value={newRoom.name} onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })} className="px-4 py-2 bg-input-background border border-border rounded-lg" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-muted-foreground">Room Type</label>
                        <select value={newRoom.type} onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })} className="px-4 py-2 bg-input-background border border-border rounded-lg"><option value="Shared">Shared</option><option value="Private">Private</option></select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-muted-foreground">Capacity</label>
                        <input type="number" placeholder="Capacity" value={newRoom.capacity} onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) || 1 })} className="px-4 py-2 bg-input-background border border-border rounded-lg" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-muted-foreground">Number of Beds</label>
                        <input type="number" placeholder="Number of Beds" value={newRoom.beds} onChange={(e) => setNewRoom({ ...newRoom, beds: parseInt(e.target.value) || 1 })} className="px-4 py-2 bg-input-background border border-border rounded-lg" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-muted-foreground">Price per Month (₹)</label>
                        <input type="number" placeholder="Price per Month" value={newRoom.price || ''} onChange={(e) => setNewRoom({ ...newRoom, price: parseFloat(e.target.value) || 0 })} className="px-4 py-2 bg-input-background border border-border rounded-lg" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-muted-foreground">Amenities (comma separated)</label>
                        <input type="text" placeholder="e.g. AC, Wifi, Attached Bathroom" value={newRoom.amenities} onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })} className="px-4 py-2 bg-input-background border border-border rounded-lg" />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <motion.button onClick={handleAddRoom} className="flex-1 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground py-3 rounded-lg" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Add Room</motion.button>
                      <motion.button onClick={() => setShowAddRoom(false)} className="flex-1 bg-muted text-foreground py-3 rounded-lg" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Cancel</motion.button>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
            {rooms.length === 0 ? (
              <GlassCard className="p-12 text-center"><Bed className="w-16 h-16 mx-auto mb-4 text-muted-foreground" /><h3 className="mb-2">No Rooms Yet</h3><p className="text-muted-foreground">Click the "Add New Room" button above to create your first room.</p></GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room, index) => (
                  <motion.div key={room.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }}>
                    <GlassCard className="p-6 group hover:shadow-xl transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div><h3 className="mb-1">{room.name}</h3><p className="text-sm text-muted-foreground">{room.type} Room</p></div>
                        <motion.button onClick={() => onDeleteRoom(room.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg" whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}><Trash2 className="w-4 h-4" /></motion.button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div><p className="text-2xl font-semibold">{room.capacity}</p><p className="text-xs text-muted-foreground">Capacity</p></div>
                        <div><p className="text-2xl font-semibold">{room.beds}</p><p className="text-xs text-muted-foreground">Beds</p></div>
                        <div><p className="text-2xl font-semibold text-primary">₹{room.price.toLocaleString()}</p><p className="text-xs text-muted-foreground">Per Month</p></div>
                      </div>
                      <div className="text-sm text-muted-foreground"><p className="mb-1">Amenities:</p>
                        <div className="flex flex-wrap gap-1">
                          {room.amenities.slice(0, 3).map((amenity, i) => (<span key={i} className="px-2 py-1 bg-muted rounded text-xs">{amenity}</span>))}
                          {room.amenities.length > 3 && (<span className="px-2 py-1 bg-muted rounded text-xs">+{room.amenities.length - 3}</span>)}
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'complaints' && (
          <motion.div key="complaints" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <GlassCard className="overflow-hidden">
              {complaints.length === 0 ? (
                <div className="p-12 text-center">
                  <h3 className="mb-2">No Complaints or Feedback</h3>
                  <p className="text-muted-foreground">Everything seems to be running smoothly.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4">Date</th>
                        <th className="text-left p-4">Type</th>
                        <th className="text-left p-4">Room / USN</th>
                        <th className="text-left p-4">Category</th>
                        <th className="text-left p-4">Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map((comp, index) => (
                        <motion.tr key={comp.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="border-b border-border hover:bg-muted/30 transition-colors">
                          <td className="p-4 whitespace-nowrap">{comp.date}</td>
                          <td className="p-4 capitalize">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${comp.type === 'complaint' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              {comp.type}
                            </span>
                          </td>
                          <td className="p-4">{comp.roomNo} <br/><span className="text-xs text-muted-foreground">{comp.usn}</span></td>
                          <td className="p-4">{comp.category}</td>
                          <td className="p-4 max-w-xs truncate" title={comp.context}>{comp.context}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
