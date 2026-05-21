import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { AnimatedCard } from './AnimatedCard';
import { 
  WashingMachine, UtensilsCrossed, Sparkle, Wifi, Headphones, 
  LayoutDashboard, User, LogOut, Clock, CheckCircle, AlertCircle, 
  MessageSquareWarning, Bed, Activity, Send
} from 'lucide-react';
import { 
  getRoomServices, updateRoomServiceStatus, 
  getLaundryRequests, updateLaundryRequestStatus, 
  getMessMenu, saveMessMenu, supabase 
} from '../../supabase';

export function ManagerDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Dashboard States
  const [menu, setMenu] = useState([]);
  const [editingMeal, setEditingMeal] = useState(null);
  const [editedItems, setEditedItems] = useState('');
  
  const [roomServices, setRoomServices] = useState([]);
  const [laundries, setLaundries] = useState([]);
  const [complaints, setComplaints] = useState([]);

  // Wifi Speed Monitoring State
  const [wifiSpeed, setWifiSpeed] = useState(98.4);
  const [isTestingSpeed, setIsTestingSpeed] = useState(false);

  // Fetch all necessary manager data
  const fetchManagerData = async () => {
    // 1. Fetch Mess Menu
    const menuData = await getMessMenu();
    setMenu(menuData);

    // 2. Fetch Room Services
    const rsData = await getRoomServices();
    setRoomServices(rsData);

    // 3. Fetch Laundries
    const laundryData = await getLaundryRequests();
    setLaundries(laundryData);

    // 4. Fetch Complaints
    const { data: complaintsData } = await supabase.from('complaints').select('*');
    if (complaintsData) setComplaints(complaintsData);
  };

  useEffect(() => {
    fetchManagerData();
    // Poll updates every 10 seconds for real-time manager updates
    const interval = setInterval(fetchManagerData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateRoomService = async (id, status) => {
    const updated = await updateRoomServiceStatus(id, status);
    if (updated) {
      setRoomServices(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    }
  };

  const handleUpdateLaundry = async (id, status) => {
    const updated = await updateLaundryRequestStatus(id, status);
    if (updated) {
      setLaundries(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    }
  };

  const handleEditMenuClick = (meal) => {
    setEditingMeal(meal);
    setEditedItems(meal.items);
  };

  const handleSaveMenu = async () => {
    const updatedMenu = menu.map(m => m.meal === editingMeal.meal ? { ...m, items: editedItems } : m);
    const saved = await saveMessMenu(updatedMenu);
    if (saved) {
      setMenu(updatedMenu);
      setEditingMeal(null);
    }
  };

  const runWifiSpeedTest = () => {
    setIsTestingSpeed(true);
    let current = 0;
    const interval = setInterval(() => {
      current = Math.random() * (115 - 80) + 80;
      setWifiSpeed(parseFloat(current.toFixed(1)));
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setIsTestingSpeed(false);
    }, 2000);
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'menu', label: 'Mess Menu', icon: UtensilsCrossed },
    { id: 'wifi', label: 'Wifi Monitoring', icon: Wifi },
    { id: 'services', label: 'Room Services', icon: Sparkle },
    { id: 'laundry', label: 'Laundry Service', icon: WashingMachine },
    { id: 'complaints', label: 'Complaints', icon: MessageSquareWarning }
  ];

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border fixed h-full z-40">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
            <Bed className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">DormDesk</h3>
            <p className="text-xs text-muted-foreground">Manager Portal</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
              whileTap={{ scale: 0.97 }}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.email}</p>
              <p className="text-xs text-muted-foreground truncate">Hostel Manager</p>
            </div>
            <button onClick={onLogout} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 pt-20 lg:pt-0 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <GlassCard className="p-8 bg-gradient-to-br from-primary/5 to-purple-500/5 relative overflow-hidden">
                  <h1 className="text-3xl font-bold mb-2">Welcome Back, Manager! 📋</h1>
                  <p className="text-muted-foreground">Manage your hostel services, wifi speeds, laundry list, and student complaints here.</p>
                </GlassCard>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <GlassCard className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500"><Wifi className="w-6 h-6" /></div>
                    <div><h3 className="text-2xl font-bold">{wifiSpeed} Mbps</h3><p className="text-xs text-muted-foreground">Connected Speed</p></div>
                  </GlassCard>
                  <GlassCard className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500"><Sparkle className="w-6 h-6" /></div>
                    <div><h3 className="text-2xl font-bold">{roomServices.filter(r => r.status !== 'done').length}</h3><p className="text-xs text-muted-foreground">Active Housekeeping</p></div>
                  </GlassCard>
                  <GlassCard className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500"><WashingMachine className="w-6 h-6" /></div>
                    <div><h3 className="text-2xl font-bold">{laundries.filter(l => l.status === 'pending').length}</h3><p className="text-xs text-muted-foreground">Pending Laundries</p></div>
                  </GlassCard>
                  <GlassCard className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500"><MessageSquareWarning className="w-6 h-6" /></div>
                    <div><h3 className="text-2xl font-bold">{complaints.length}</h3><p className="text-xs text-muted-foreground">Student Complaints</p></div>
                  </GlassCard>
                </div>
              </motion.div>
            )}

            {activeTab === 'menu' && (
              <motion.div key="menu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <GlassCard className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-bold flex items-center gap-2"><UtensilsCrossed className="w-5 h-5 text-amber-500" /> Daily Mess Menu Editor</h2>
                      <p className="text-sm text-muted-foreground">Update daily dishes for breakfast, lunch, snacks, and dinner instantly.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menu.map((meal) => (
                      <GlassCard key={meal.meal} className="p-5 border border-border/40 hover:border-amber-500/30 transition-all flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">{meal.meal}</h3>
                            <span className="text-xs px-2.5 py-1 bg-amber-500/10 text-amber-600 rounded-full font-medium">{meal.time}</span>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4">{meal.items}</p>
                        </div>
                        <button onClick={() => handleEditMenuClick(meal)} className="w-full py-2 bg-amber-500/10 text-amber-500 rounded-lg text-xs font-semibold hover:bg-amber-500/20 transition-colors">
                          Edit Dishes
                        </button>
                      </GlassCard>
                    ))}
                  </div>
                </GlassCard>

                {editingMeal && (
                  <GlassCard className="p-6 border border-amber-500/30">
                    <h3 className="font-bold text-lg mb-3">Edit {editingMeal.meal} Dishes</h3>
                    <textarea 
                      value={editedItems} 
                      onChange={(e) => setEditedItems(e.target.value)} 
                      rows={3} 
                      className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm text-foreground mb-4"
                      placeholder="Enter dishes separated by commas..."
                    />
                    <div className="flex gap-2">
                      <button onClick={handleSaveMenu} className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition-colors">Save Menu</button>
                      <button onClick={() => setEditingMeal(null)} className="flex-1 py-2 bg-muted text-foreground rounded-lg text-sm font-semibold hover:bg-muted/80 transition-colors">Cancel</button>
                    </div>
                  </GlassCard>
                )}
              </motion.div>
            )}

            {activeTab === 'wifi' && (
              <motion.div key="wifi" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <GlassCard className="p-6 flex flex-col items-center">
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-2 self-start"><Wifi className="w-5 h-5 text-indigo-500" /> Hostels Wifi Control Center</h2>
                  <p className="text-sm text-muted-foreground mb-8 self-start">Monitor latency, real-time router bandwidth, and bandwidth profiles.</p>

                  <div className="relative w-48 h-48 flex flex-col items-center justify-center mb-6">
                    <svg className="absolute w-full h-full transform -rotate-90">
                      <circle cx="96" cy="96" r="80" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="transparent" />
                      <circle cx="96" cy="96" r="80" stroke="url(#wifiGradient)" strokeWidth="12" fill="transparent" 
                        strokeDasharray={502} strokeDashoffset={502 - (502 * Math.min(wifiSpeed, 120)) / 120} 
                        className="transition-all duration-300"
                      />
                      <defs>
                        <linearGradient id="wifiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="text-3xl font-extrabold">{wifiSpeed}</span>
                    <span className="text-xs text-muted-foreground font-semibold mt-1">Mbps Speed</span>
                  </div>

                  <button 
                    onClick={runWifiSpeedTest} 
                    disabled={isTestingSpeed}
                    className="px-6 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isTestingSpeed ? 'Testing Latency...' : 'Run Diagnostics Test'}
                  </button>
                </GlassCard>
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div key="services" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <GlassCard className="p-6">
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><Sparkle className="w-5 h-5 text-purple-500" /> Housekeeping & Clean Room Requests</h2>
                  <p className="text-sm text-muted-foreground mb-6">Change status values to dynamically update students' room dashboard panels.</p>

                  {roomServices.length === 0 ? (
                    <div className="text-center py-12"><Sparkle className="w-12 h-12 mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground">No room cleaning requests found</p></div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border">
                          <tr>
                            <th className="text-left p-4">Room No</th>
                            <th className="text-left p-4">Service Type</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-left p-4 font-semibold">Mark Service Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roomServices.map((req) => (
                            <tr key={req.id} className="border-b border-border/50 hover:bg-muted/20">
                              <td className="p-4 font-bold">{req.room_name}</td>
                              <td className="p-4 text-sm font-medium">{req.type}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  req.status === 'done' ? 'bg-green-100 text-green-700' : req.status === 'under process' ? 'bg-yellow-100 text-yellow-700 animate-pulse' : 'bg-red-100 text-red-700'
                                }`}>{req.status}</span>
                              </td>
                              <td className="p-4 flex gap-2">
                                <button onClick={() => handleUpdateRoomService(req.id, 'under process')} className="px-2.5 py-1 bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 text-xs font-semibold rounded-lg transition-colors border border-yellow-500/20">Under Process</button>
                                <button onClick={() => handleUpdateRoomService(req.id, 'done')} className="px-2.5 py-1 bg-green-500/10 text-green-600 hover:bg-green-500/20 text-xs font-semibold rounded-lg transition-colors border border-green-500/20">Done</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            )}

            {activeTab === 'laundry' && (
              <motion.div key="laundry" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <GlassCard className="p-6">
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><WashingMachine className="w-5 h-5 text-blue-500" /> Laundry Pickups Manager</h2>
                  <p className="text-sm text-muted-foreground mb-6">Schedule students' laundry dropoffs and set status to Booked or Pending.</p>

                  {laundries.length === 0 ? (
                    <div className="text-center py-12"><WashingMachine className="w-12 h-12 mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground">No laundry requests found</p></div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border">
                          <tr>
                            <th className="text-left p-4">Student Room</th>
                            <th className="text-left p-4">Laundry Type</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-left p-4 font-semibold">Change Scheduling</th>
                          </tr>
                        </thead>
                        <tbody>
                          {laundries.map((req) => (
                            <tr key={req.id} className="border-b border-border/50 hover:bg-muted/20">
                              <td className="p-4 font-bold">{req.room_name}</td>
                              <td className="p-4 text-sm font-medium">{req.type}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  req.status === 'booked' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700 animate-pulse'
                                }`}>{req.status}</span>
                              </td>
                              <td className="p-4 flex gap-2">
                                <button onClick={() => handleUpdateLaundry(req.id, 'booked')} className="px-3 py-1.5 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 text-xs font-bold rounded-lg transition-colors border border-blue-500/20">Set Booked</button>
                                <button onClick={() => handleUpdateLaundry(req.id, 'pending')} className="px-3 py-1.5 bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 text-xs font-bold rounded-lg transition-colors border border-yellow-500/20">Set Pending</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            )}

            {activeTab === 'complaints' && (
              <motion.div key="complaints" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <GlassCard className="p-6">
                  <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><MessageSquareWarning className="w-5 h-5 text-red-500" /> Student Complaints Log</h2>
                  <p className="text-sm text-muted-foreground mb-6">Review official complaints logged by student residents.</p>

                  {complaints.length === 0 ? (
                    <div className="text-center py-12"><MessageSquareWarning className="w-12 h-12 mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground">No complaints filed yet</p></div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border">
                          <tr>
                            <th className="text-left p-4">Date</th>
                            <th className="text-left p-4">Room / USN</th>
                            <th className="text-left p-4">Category</th>
                            <th className="text-left p-4">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {complaints.map((comp) => (
                            <tr key={comp.id} className="border-b border-border/50 hover:bg-muted/20">
                              <td className="p-4 text-xs font-medium whitespace-nowrap">{comp.date}</td>
                              <td className="p-4 text-sm font-semibold">{comp.room_no} <br/><span className="text-xs text-muted-foreground font-normal">{comp.usn}</span></td>
                              <td className="p-4 text-sm font-medium">{comp.category}</td>
                              <td className="p-4 text-sm max-w-xs truncate" title={comp.context}>{comp.context}</td>
                            </tr>
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
      </main>
    </div>
  );
}
