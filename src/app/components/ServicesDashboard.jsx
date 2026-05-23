import { useState, useEffect } from 'react';
import { supabase, getMessMenu, getLaundryRequests, addLaundryRequest, getRoomServices, addRoomService } from '../../supabase';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { AnimatedCard } from './AnimatedCard';
import { Complaints } from './Complaints';
import {
  WashingMachine, UtensilsCrossed, Sparkle, CreditCard, Wifi, Headphones,
  LayoutDashboard, Bell, User, LogOut, Clock, CheckCircle, AlertCircle,
  ChevronRight, Calendar, MessageSquareWarning, Bed, Home
} from 'lucide-react';

const serviceDetails = {
  laundry: {
    title: 'Laundry Service',
    icon: WashingMachine,
    color: 'from-blue-500 to-cyan-500',
    description: 'Schedule your laundry pickups and track the status of your clothes.',
    items: [
      { label: 'Wash & Fold', price: '₹50/kg', time: '24 hrs' },
      { label: 'Dry Clean', price: '₹150/item', time: '48 hrs' },
      { label: 'Iron Only', price: '₹20/item', time: '12 hrs' },
      { label: 'Express Wash', price: '₹80/kg', time: '6 hrs' },
    ]
  },
  menu: {
    title: 'Mess Menu',
    icon: UtensilsCrossed,
    color: 'from-amber-500 to-orange-500',
    description: 'Check today\'s menu and meal timings for the hostel mess.',
    schedule: [
      { meal: 'Breakfast', time: '7:30 AM – 9:00 AM', items: 'Idli, Dosa, Poha, Bread & Eggs, Tea/Coffee' },
      { meal: 'Lunch', time: '12:30 PM – 2:00 PM', items: 'Rice, Dal, Sabzi, Roti, Curd, Salad' },
      { meal: 'Snacks', time: '4:30 PM – 5:30 PM', items: 'Samosa, Tea, Biscuits' },
      { meal: 'Dinner', time: '7:30 PM – 9:00 PM', items: 'Rice, Dal, Paneer/Chicken, Roti, Sweet' },
    ]
  },
  housekeeping: {
    title: 'Housekeeping',
    icon: Sparkle,
    color: 'from-purple-500 to-pink-500',
    description: 'Request room cleaning, linen change, or report maintenance issues.',
    requests: [
      { type: 'Room Cleaning', eta: '2 hrs', icon: '🧹' },
      { type: 'Linen Change', eta: '4 hrs', icon: '🛏️' },
      { type: 'Bathroom Clean', eta: '1 hr', icon: '🚿' },
      { type: 'Pest Control', eta: '24 hrs', icon: '🐛' },
    ]
  },
  payments: {
    title: 'Payments',
    icon: CreditCard,
    color: 'from-green-500 to-emerald-500',
    description: 'View your hostel fee status, pending dues, and make payments.',
    transactions: [
      { label: 'Hostel Fee – Sem 1', amount: '₹75,000', status: 'paid', date: 'Aug 2025' },
      { label: 'Hostel Fee – Sem 2', amount: '₹75,000', status: 'paid', date: 'Jan 2026' },
      { label: 'Mess Fee – May', amount: '₹4,500', status: 'pending', date: 'May 2026' },
      { label: 'Laundry Charges', amount: '₹350', status: 'pending', date: 'May 2026' },
    ]
  },
  wifi: {
    title: 'Wifi Access',
    icon: Wifi,
    color: 'from-indigo-500 to-blue-500',
    description: 'Manage your hostel wifi connection and check usage.',
    info: [
      { label: 'Network Name', value: 'NST-Hostel-5G' },
      { label: 'Speed', value: '100 Mbps' },
      { label: 'Data Used', value: '45.2 GB / Unlimited' },
      { label: 'Connected Devices', value: '2 / 3 allowed' },
      { label: 'Status', value: '🟢 Connected' },
    ]
  },
  support: {
    title: 'Support',
    icon: Headphones,
    color: 'from-red-500 to-rose-500',
    description: 'Get help from the hostel team for any issue or emergency.',
    contacts: [
      { role: 'Hostel Warden', name: 'Dr. Ramesh Kumar', phone: '+91 98765 43210', available: '24/7' },
      { role: 'Maintenance Head', name: 'Suresh Patel', phone: '+91 98765 43211', available: '8 AM – 8 PM' },
      { role: 'Mess Supervisor', name: 'Anita Sharma', phone: '+91 98765 43212', available: '7 AM – 10 PM' },
      { role: 'Security Office', name: 'Main Gate', phone: '+91 98765 43213', available: '24/7' },
    ]
  }
};

const sidebarItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'laundry', label: 'Laundry', icon: WashingMachine },
  { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
  { id: 'housekeeping', label: 'Housekeeping', icon: Sparkle },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'wifi', label: 'Wifi', icon: Wifi },
  { id: 'support', label: 'Support', icon: Headphones },
  { id: 'complaints', label: 'Complaints', icon: MessageSquareWarning },
];

export function ServicesDashboard({ user, bookingsData, bookingData, onLogout, onBackToWebsite }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeBookingIndex, setActiveBookingIndex] = useState(0);

  // Dynamic state hooks
  const [menuSchedule, setMenuSchedule] = useState([]);
  const [myLaundries, setMyLaundries] = useState([]);
  const [myRoomServices, setMyRoomServices] = useState([]);
  const [isSubmittingService, setIsSubmittingService] = useState(false);

  const handleAddComplaint = async (complaint) => {
    const { data, error } = await supabase
      .from('complaints')
      .insert([{
        date: complaint.date,
        type: complaint.type,
        room_no: complaint.roomNo,
        usn: complaint.usn,
        category: complaint.category,
        context: complaint.context,
        email: complaint.email
      }])
      .select();
      
    if (error) {
      console.error('Error saving complaint:', error);
    }
  };

  const bookings = bookingsData || (bookingData ? [bookingData] : []);
  const activeBooking = bookings[activeBookingIndex] || bookings[0];

  const studentName = activeBooking?.firstName || 'Student';
  const roomName = activeBooking?.roomName || 'Room';

  const fetchStudentData = async () => {
    const menu = await getMessMenu();
    setMenuSchedule(menu);

    const laundries = await getLaundryRequests();
    setMyLaundries(laundries.filter(l => l.user_email === user?.email));

    const services = await getRoomServices();
    setMyRoomServices(services.filter(s => s.user_email === user?.email));
  };

  useEffect(() => {
    if (user) {
      fetchStudentData();
      const interval = setInterval(fetchStudentData, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const renderServiceContent = (key) => {
    const service = serviceDetails[key];
    if (!service) return null;
    const ServiceIcon = service.icon;

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center`}>
            <ServiceIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{service.title}</h2>
            <p className="text-muted-foreground">{service.description}</p>
          </div>
        </div>

        {/* Laundry */}
        {key === 'laundry' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.items.map((item, i) => (
                <AnimatedCard key={i} delay={i * 0.1}>
                  <GlassCard className="p-5 hover:border-blue-500/50 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold group-hover:text-blue-500 transition-colors">{item.label}</h3>
                      <span className="text-lg font-bold text-blue-500">{item.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Delivery in {item.time}</span>
                    </div>
                    <motion.button 
                      onClick={async () => {
                        setIsSubmittingService(true);
                        await addLaundryRequest({ user_email: user?.email, room_name: roomName, type: item.label });
                        fetchStudentData();
                        setIsSubmittingService(false);
                      }}
                      disabled={isSubmittingService}
                      className="mt-3 w-full py-2 rounded-lg bg-blue-500/10 text-blue-500 text-sm font-medium hover:bg-blue-500/20 transition-colors disabled:opacity-50" 
                      whileTap={{ scale: 0.95 }}
                    >
                      Request Pickup
                    </motion.button>
                  </GlassCard>
                </AnimatedCard>
              ))}
            </div>

            {myLaundries.length > 0 && (
              <GlassCard className="p-5 mt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                  <WashingMachine className="w-5 h-5 text-blue-500" /> My Laundry History
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-foreground">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="text-left py-2 font-semibold">Service Type</th>
                        <th className="text-left py-2 font-semibold">Requested At</th>
                        <th className="text-left py-2 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myLaundries.map((req) => (
                        <tr key={req.id} className="border-b border-border/40 last:border-0">
                          <td className="py-2.5 font-medium">{req.type}</td>
                          <td className="py-2.5 text-xs text-muted-foreground">
                            {req.created_at ? new Date(req.created_at).toLocaleDateString() : 'Today'}
                          </td>
                          <td className="py-2.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              req.status === 'booked' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700 animate-pulse'
                            }`}>
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}
          </div>
        )}

        {/* Menu */}
        {key === 'menu' && (
          <div className="space-y-4">
            {(menuSchedule.length > 0 ? menuSchedule : service.schedule).map((meal, i) => (
              <AnimatedCard key={i} delay={i * 0.1}>
                <GlassCard className="p-5">
                  <div className="flex items-center justify-between mb-2 text-foreground">
                    <h3 className="font-semibold text-lg">{meal.meal}</h3>
                    <span className="text-sm px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 font-medium">{meal.time}</span>
                  </div>
                  <p className="text-muted-foreground">{meal.items}</p>
                </GlassCard>
              </AnimatedCard>
            ))}
          </div>
        )}

        {/* Housekeeping */}
        {key === 'housekeeping' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.requests.map((req, i) => (
                <AnimatedCard key={i} delay={i * 0.1}>
                  <GlassCard className="p-5 hover:border-purple-500/50 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{req.icon}</span>
                      <div>
                        <h3 className="font-semibold group-hover:text-purple-500 transition-colors text-foreground">{req.type}</h3>
                        <p className="text-sm text-muted-foreground">ETA: {req.eta}</p>
                      </div>
                    </div>
                    <motion.button 
                      onClick={async () => {
                        setIsSubmittingService(true);
                        await addRoomService({ user_email: user?.email, room_name: roomName, type: req.type });
                        fetchStudentData();
                        setIsSubmittingService(false);
                      }}
                      disabled={isSubmittingService}
                      className="w-full py-2 rounded-lg bg-purple-500/10 text-purple-500 text-sm font-medium hover:bg-purple-500/20 transition-colors disabled:opacity-50" 
                      whileTap={{ scale: 0.95 }}
                    >
                      Request Now
                    </motion.button>
                  </GlassCard>
                </AnimatedCard>
              ))}
            </div>

            {myRoomServices.length > 0 && (
              <GlassCard className="p-5 mt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                  <Sparkle className="w-5 h-5 text-purple-500" /> My Room Services History
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-foreground">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="text-left py-2 font-semibold">Service Type</th>
                        <th className="text-left py-2 font-semibold">Requested At</th>
                        <th className="text-left py-2 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myRoomServices.map((req) => (
                        <tr key={req.id} className="border-b border-border/40 last:border-0">
                          <td className="py-2.5 font-medium">{req.type}</td>
                          <td className="py-2.5 text-xs text-muted-foreground">
                            {req.created_at ? new Date(req.created_at).toLocaleDateString() : 'Today'}
                          </td>
                          <td className="py-2.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              req.status === 'done' 
                                ? 'bg-green-100 text-green-700' 
                                : req.status === 'under process' 
                                ? 'bg-yellow-100 text-yellow-700 animate-pulse' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            )}
          </div>
        )}

        {/* Payments */}
        {key === 'payments' && (
          <div className="space-y-4">
            {service.transactions.map((txn, i) => (
              <AnimatedCard key={i} delay={i * 0.1}>
                <GlassCard className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {txn.status === 'paid' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                      )}
                      <div>
                        <h3 className="font-semibold">{txn.label}</h3>
                        <p className="text-sm text-muted-foreground">{txn.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{txn.amount}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${txn.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {txn.status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </AnimatedCard>
            ))}
            <GlassCard className="p-5 border-dashed">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total Pending</span>
                <span className="text-xl font-bold text-amber-500">₹4,850</span>
              </div>
              <motion.button className="mt-3 w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium shadow-lg" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Pay Now
              </motion.button>
            </GlassCard>
          </div>
        )}

        {/* Wifi */}
        {key === 'wifi' && (
          <GlassCard className="p-6">
            <div className="space-y-4">
              {service.info.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-semibold">{item.value}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Support */}
        {key === 'support' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {service.contacts.map((contact, i) => (
              <AnimatedCard key={i} delay={i * 0.1}>
                <GlassCard className="p-5 hover:border-red-500/50 transition-all">
                  <p className="text-sm text-muted-foreground mb-1">{contact.role}</p>
                  <h3 className="font-semibold text-lg mb-2">{contact.name}</h3>
                  <div className="space-y-1 text-sm">
                    <p>📞 {contact.phone}</p>
                    <p>🕐 {contact.available}</p>
                  </div>
                  <motion.a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="mt-3 block w-full py-2 rounded-lg bg-red-500/10 text-red-500 text-sm font-medium hover:bg-red-500/20 transition-colors text-center" whileTap={{ scale: 0.95 }}>
                    Call Now
                  </motion.a>
                </GlassCard>
              </AnimatedCard>
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  const renderOverview = () => {
    const combinedHistory = [
      ...myLaundries.map(l => ({ ...l, category: 'laundry' })),
      ...myRoomServices.map(s => ({ ...s, category: 'housekeeping' }))
    ].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
     .slice(0, 5);

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        {/* Welcome Banner */}
        <GlassCard className="p-8 bg-gradient-to-br from-primary/5 to-purple-500/5 relative overflow-hidden">
          <motion.div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity }} />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {studentName}! 👋</h1>
            <p className="text-muted-foreground text-lg">Here's your hostel dashboard at a glance.</p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm">
                <Bed className="w-4 h-4 text-primary" />
                <span>{roomName}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Booking Confirmed</span>
              </div>
            </div>
            {bookings.length > 1 && (
              <div className="mt-6 pt-4 border-t border-primary/10">
                <p className="text-xs font-semibold text-muted-foreground/80 mb-2.5">Switch Room View:</p>
                <div className="flex flex-wrap gap-2">
                  {bookings.map((booking, idx) => {
                    const isSelected = activeBookingIndex === idx;
                    return (
                      <motion.button
                        key={booking.bookingRef}
                        type="button"
                        onClick={() => setActiveBookingIndex(idx)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-primary to-purple-600 text-white border-transparent shadow-md'
                            : 'bg-background hover:bg-muted text-muted-foreground border-border'
                        }`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        🛏️ {booking.roomName} ({booking.bookingRef})
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Pending Dues', value: '₹4,850', color: 'from-amber-500 to-orange-500', icon: CreditCard, target: 'payments' },
            { label: 'Wifi Status', value: 'Connected', color: 'from-green-500 to-emerald-500', icon: Wifi, target: 'wifi' },
            { label: 'Notifications', value: '3 New', color: 'from-blue-500 to-cyan-500', icon: Bell, target: 'overview' },
            { label: 'Next Meal', value: 'Lunch', color: 'from-purple-500 to-pink-500', icon: UtensilsCrossed, target: 'menu' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
              <div onClick={() => stat.target && setActiveSection(stat.target)} className="cursor-pointer">
                <GlassCard className="p-4 hover:shadow-lg transition-shadow">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </GlassCard>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Service Quick Access */}
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(serviceDetails).map(([key, service], i) => {
              const ServiceIcon = service.icon;
              return (
                <AnimatedCard key={key} delay={i * 0.05}>
                  <motion.div
                    onClick={() => setActiveSection(key)}
                    className="cursor-pointer"
                    whileTap={{ scale: 0.95 }}
                  >
                    <GlassCard className="p-4 text-center hover:border-primary/50 transition-all group">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                        <ServiceIcon className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">{service.title.replace(' Service', '').replace(' Access', '')}</p>
                    </GlassCard>
                  </motion.div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Notices */}
          <div>
            <h2 className="text-xl font-bold mb-4">Recent Notices</h2>
            <div className="space-y-3">
              {[
                { title: 'Water tank cleaning scheduled', time: '2 hours ago', type: 'info' },
                { title: 'Mess menu updated for this week', time: '5 hours ago', type: 'update' },
                { title: 'Hostel fee deadline: May 31, 2026', time: '1 day ago', type: 'important' },
              ].map((notice, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <GlassCard className="p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${notice.type === 'important' ? 'bg-red-500' : notice.type === 'update' ? 'bg-blue-500' : 'bg-green-500'}`} />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">{notice.title}</p>
                        <p className="text-sm text-muted-foreground">{notice.time}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Service Bookings & History */}
          <div>
            <h2 className="text-xl font-bold mb-4">My Service History</h2>
            <div className="space-y-3">
              {combinedHistory.length === 0 ? (
                <GlassCard className="p-8 text-center text-muted-foreground text-sm">
                  No recent laundry or housekeeping bookings found.
                </GlassCard>
              ) : (
                combinedHistory.map((item, i) => {
                  const isLaundry = item.category === 'laundry';
                  return (
                    <motion.div key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                      <GlassCard 
                        onClick={() => setActiveSection(item.category)}
                        className="p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted flex items-center justify-center">
                            {isLaundry ? (
                              <WashingMachine className="w-4 h-4 text-blue-500" />
                            ) : (
                              <Sparkle className="w-4 h-4 text-purple-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium group-hover:text-primary transition-colors">{item.type}</p>
                            <p className="text-xs text-muted-foreground">
                              {isLaundry ? 'Laundry Service' : 'Housekeeping'} • {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Today'}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          item.status === 'done' || item.status === 'booked' 
                            ? 'bg-green-100 text-green-700' 
                            : item.status === 'under process' 
                            ? 'bg-yellow-100 text-yellow-700 animate-pulse' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {item.status}
                        </span>
                      </GlassCard>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border fixed h-full z-40">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Bed className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">DormDesk</h3>
              <p className="text-xs text-muted-foreground">Student Portal</p>
            </div>
          </div>
        </div>
        {bookings.length > 1 && (
          <div className="px-6 py-3 border-b border-border bg-muted/10">
            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/80 block mb-1">Active Room</label>
            <select
              value={activeBookingIndex}
              onChange={(e) => setActiveBookingIndex(Number(e.target.value))}
              className="w-full text-xs font-semibold bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
            >
              {bookings.map((booking, idx) => (
                <option key={booking.bookingRef} value={idx}>
                  {booking.roomName} ({booking.bookingRef})
                </option>
              ))}
            </select>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                activeSection === item.id
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
          {onBackToWebsite && (
            <motion.button
              onClick={onBackToWebsite}
              className="w-full mb-3 flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              whileTap={{ scale: 0.97 }}
            >
              <Home className="w-4 h-4" />
              <span className="font-medium">Main Website</span>
            </motion.button>
          )}
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{studentName}</p>
              <p className="text-xs text-muted-foreground truncate">{roomName}</p>
            </div>
            {onLogout && (
              <button onClick={onLogout} title="Log Out" className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Bed className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">DormDesk</span>
          </div>
          <div className="flex items-center gap-1.5">
            {onLogout && (
              <button onClick={onLogout} title="Log Out" className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            )}
            {onBackToWebsite && (
              <button onClick={onBackToWebsite} title="Main Website" className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                <Home className="w-5 h-5" />
              </button>
            )}
            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-muted"
              whileTap={{ scale: 0.9 }}
            >
              <LayoutDashboard className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-border"
            >
              <div className="p-3 border-b border-border bg-muted/10">
                {bookings.length > 1 && (
                  <div className="mb-2">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/80 block mb-1">Active Room</label>
                    <select
                      value={activeBookingIndex}
                      onChange={(e) => setActiveBookingIndex(Number(e.target.value))}
                      className="w-full text-xs font-semibold bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    >
                      {bookings.map((booking, idx) => (
                        <option key={booking.bookingRef} value={idx}>
                          {booking.roomName} ({booking.bookingRef})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="p-3 grid grid-cols-4 gap-2">
                {sidebarItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl text-xs transition-all ${
                      activeSection === item.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-20 lg:pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === 'overview' && renderOverview()}
              {activeSection === 'complaints' && <Complaints />}
              {activeSection !== 'overview' && activeSection !== 'complaints' && renderServiceContent(activeSection)}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
