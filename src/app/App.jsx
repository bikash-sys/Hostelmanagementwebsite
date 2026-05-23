import { useState } from 'react';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { Rooms } from './components/Rooms';
import { BookingForm } from './components/BookingForm';
import { About } from './components/About';
import { Services } from './components/Services';
import { Complaints } from './components/Complaints';
import { Admin } from './components/Admin';
import { ServicesDashboard } from './components/ServicesDashboard';
import { Auth } from './components/Auth';
import { useEffect } from 'react';
import { supabase, getProfile } from '../supabase';
import { ManagerDashboard } from './components/ManagerDashboard';
import { motion } from 'motion/react';
import { Bed, AlertCircle } from 'lucide-react';
import { GlassCard } from './components/GlassCard';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookedStudent, setBookedStudent] = useState(null);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('student');
  const [complaints, setComplaints] = useState([]);

  // Designate the admin account
  const isAdmin = user?.email === 'bikjha2007@gmail.com';
  const userBookings = bookings.filter(b => b.user_email === user?.email && b.status === 'confirmed');
  const hasExistingBooking = userBookings.length > 0;
  // Only show rooms that are not marked unavailable
  const availableRooms = rooms.filter(r => r.available !== false);

  useEffect(() => {
    const fetchDatabaseData = async () => {
      const { data: roomsData } = await supabase.from('rooms').select('*');
      if (roomsData) setRooms(roomsData);

      const { data: bookingsData } = await supabase.from('bookings').select('*');
      if (bookingsData) setBookings(bookingsData);

      const { data: complaintsData } = await supabase.from('complaints').select('*');
      if (complaintsData) setComplaints(complaintsData);
    };

    fetchDatabaseData();
    // Check active sessions and sets the user
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        if (u.email === 'bikjha2007@gmail.com') {
          setUserRole('admin');
        } else if (u.email === 'info.dormdesk@gmail.com') {
          setUserRole('manager');
        } else {
          const prof = await getProfile(u.email);
          const role = prof?.role || 'student';
          setUserRole(role === 'manger' ? 'manager' : role);
        }
      } else {
        setUserRole('student');
      }
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        if (u.email === 'bikjha2007@gmail.com') {
          setUserRole('admin');
        } else if (u.email === 'info.dormdesk@gmail.com') {
          setUserRole('manager');
        } else {
          const prof = await getProfile(u.email);
          const role = prof?.role || 'student';
          setUserRole(role === 'manger' ? 'manager' : role);
        }
      } else {
        setUserRole('student');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    // Reset state immediately so UI updates before async signOut
    setUser(null);
    setUserRole('student');
    setCurrentView('home');
    await supabase.auth.signOut();
  };

  const handleBookingComplete = async (studentData) => {
    // If studentData doesn't have bookingRef (e.g. back button click), go back to rooms
    if (!studentData || !studentData.bookingRef || typeof studentData.bookingRef !== 'string') {
      setCurrentView('rooms');
      return;
    }

    // ── OPTIMISTIC UPDATE ────────────────────────────────────────────────────
    // Build a synthetic booking object immediately from the form data so the
    // "Your Room" tab and dashboard appear INSTANTLY without waiting for the DB.
    const optimisticBooking = {
      id: studentData.bookingRef,
      guest_name: `${studentData.firstName} ${studentData.lastName}`,
      room_name: studentData.roomName,
      check_in: studentData.checkIn,
      status: 'confirmed',
      user_email: user?.email,
    };

    // Update state and navigate immediately — user sees dashboard right away
    setBookings(prev => [...prev, optimisticBooking]);
    setBookedStudent(studentData);

    // Mark room unavailable locally right away
    const bookedRoom = rooms.find(r => r.name === studentData.roomName);
    if (bookedRoom) {
      setRooms(prev => prev.map(r => r.id === bookedRoom.id ? { ...r, available: false } : r));
    }

    setCurrentView('your_room');

    // ── BACKGROUND DB WRITE ──────────────────────────────────────────────────
    // Attempt to persist to Supabase — silent if it fails (state is already updated)
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          id: studentData.bookingRef,
          guest_name: `${studentData.firstName} ${studentData.lastName}`,
          room_name: studentData.roomName,
          check_in: studentData.checkIn,
          status: 'confirmed',
          user_email: user?.email
        }])
        .select();

      if (data && data.length > 0) {
        // Replace the optimistic entry with the real DB record
        setBookings(prev => prev.map(b => b.id === studentData.bookingRef ? data[0] : b));
      }

      // Persist room unavailability to DB
      if (bookedRoom) {
        await supabase.from('rooms').update({ available: false }).eq('id', bookedRoom.id);
      }

      if (error) {
        console.warn('Background booking save failed (user already in dashboard):', error.message);
      }
    } catch (err) {
      console.warn('Network error during background booking save:', err.message);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const bookingToCancel = bookings.find(b => b.id === bookingId);
    if (!bookingToCancel) return;

    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (!error) {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
      
      const roomName = bookingToCancel.room_name || bookingToCancel.room;
      const bookedRoom = rooms.find(r => r.name === roomName);
      if (bookedRoom) {
        await supabase.from('rooms').update({ available: true }).eq('id', bookedRoom.id);
        setRooms(prev => prev.map(r => r.id === bookedRoom.id ? { ...r, available: true } : r));
      }
    } else {
      console.error('Error cancelling booking:', error);
    }
  };

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

    if (data && data.length > 0) {
      setComplaints([...complaints, data[0]]);
    } else if (error) {
      console.error('Error saving complaint:', error);
    }
  };

  const handleViewChange = (view) => {
    const publicViews = ['home', 'about', 'auth'];

    // Admin restriction
    if (view === 'admin' && !isAdmin) {
      setCurrentView('home');
      return;
    }

    if (!user && !publicViews.includes(view)) {
      setCurrentView('auth');
    } else {
      setCurrentView(view);
    }
    setSelectedRoom(null);
  };

  const handleBookRoom = (room) => {
    // Prevent booking a second room
    if (hasExistingBooking) {
      setCurrentView('your_room');
      return;
    }
    setSelectedRoom(room);
    setCurrentView('bookings');
  };

  const handleAddRoom = async (room) => {
    const { data, error } = await supabase
      .from('rooms')
      .insert([{
        name: room.name,
        type: room.type,
        capacity: parseInt(room.capacity),
        beds: parseInt(room.beds),
        price: parseFloat(room.price),
        amenities: room.amenities
      }])
      .select();

    if (data && data.length > 0) {
      setRooms([...rooms, data[0]]);
    } else if (error) {
      console.error('Error adding room:', error);
    }
  };

  const handleDeleteRoom = async (id) => {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);

    if (!error) {
      setRooms(rooms.filter(room => room.id !== id));
    } else {
      console.error('Error deleting room:', error);
    }
  };

  const formatBookingData = (booking) => {
    if (!booking) return null;
    return {
      firstName: booking.guest_name.split(' ')[0],
      lastName: booking.guest_name.split(' ').slice(1).join(' '),
      roomName: booking.room_name,
      checkIn: booking.check_in,
      bookingRef: booking.id
    };
  };

  if (user && (userRole === 'manager' || userRole === 'manger' || user.email === 'info.dormdesk@gmail.com')) {
    return <ManagerDashboard user={user} onLogout={handleLogout} />;
  }

  if (currentView === 'your_room' && userBookings.length > 0) {
    return (
      <ServicesDashboard
        user={user}
        bookingsData={userBookings.map(formatBookingData)}
        onLogout={handleLogout}
        onBackToWebsite={() => setCurrentView('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentView={currentView}
        onViewChange={handleViewChange}
        user={user}
        isAdmin={isAdmin}
        hasRoom={userBookings.length > 0}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user && currentView === 'home' && (
          <Home onBookNow={() => setCurrentView('auth')} />
        )}

        {!user && currentView === 'auth' && (
          <Auth onAuthSuccess={() => setCurrentView('home')} />
        )}

        {user && currentView === 'home' && (
          <Home onBookNow={() => setCurrentView('rooms')} />
        )}

        {user && currentView === 'rooms' && (
          <Rooms
            rooms={availableRooms}
            onBookRoom={handleBookRoom}
            onAddRoom={() => setCurrentView('admin')}
            isAdmin={isAdmin}
            hasExistingBooking={hasExistingBooking}
            onGoToRoom={() => setCurrentView('your_room')}
          />
        )}
        {user && currentView === 'bookings' && (
          <BookingForm
            selectedRoom={selectedRoom}
            onBack={handleBookingComplete}
          />
        )}
        {currentView === 'about' && <About />}
        {currentView === 'your_room' && userBookings.length === 0 && (
          bookedStudent ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
              <GlassCard className="p-12 max-w-md w-full border border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5 relative overflow-hidden shadow-2xl">
                <div className="relative z-10 space-y-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg animate-pulse">
                    <Bed className="w-8 h-8 text-white animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Setting Up Your Room...</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      We are finalizing your hostel dashboard. This will only take a moment.
                    </p>
                  </div>
                  <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-gradient-to-r from-primary to-purple-600 h-full rounded-full"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      style={{ width: '50%' }}
                    />
                  </div>
                </div>
              </GlassCard>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
              <GlassCard className="p-12 max-w-md w-full border border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5 relative overflow-hidden shadow-2xl">
                <div className="relative z-10 space-y-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-destructive/10 to-destructive/20 flex items-center justify-center shadow-sm">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">No Room Booked</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      You don't have an active room booking in our database. Book a room to access your student dashboard.
                    </p>
                  </div>
                  <motion.button 
                    onClick={() => setCurrentView('rooms')} 
                    className="w-full bg-gradient-to-r from-primary to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Browse Rooms
                  </motion.button>
                </div>
              </GlassCard>
            </div>
          )
        )}
        {user && currentView === 'services' && !bookedStudent && (
          <Services onBookNow={() => setCurrentView('rooms')} />
        )}
        {currentView === 'complaints' && <Complaints onAddComplaint={handleAddComplaint} />}
        {isAdmin && currentView === 'admin' && (
          <Admin
            rooms={rooms}
            bookings={bookings}
            complaints={complaints}
            onAddRoom={handleAddRoom}
            onDeleteRoom={handleDeleteRoom}
            onCancelBooking={handleCancelBooking}
          />
        )}
      </main>

      <footer className="bg-primary text-primary-foreground mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="mb-4">DormDesk</h4>
              <p className="text-sm opacity-80">
                Smart hostel management for Newton School of Technology.
                Efficient, secure, and student-friendly.
              </p>
            </div>
            <div>
              <h4 className="mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => handleViewChange('home')} className="hover:underline opacity-80">Home</button></li>
                <li><button onClick={() => handleViewChange('about')} className="hover:underline opacity-80">About Us</button></li>
                {user && (
                  <>
                    <li><button onClick={() => handleViewChange('rooms')} className="hover:underline opacity-80">Rooms</button></li>
                    <li><button onClick={() => handleViewChange('services')} className="hover:underline opacity-80">Services</button></li>
                    <li><button onClick={() => handleViewChange('complaints')} className="hover:underline opacity-80">Complaints</button></li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Contact</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>📍 123 Main Street, Downtown</li>
                <li>📞 +1 (555) 123-4567</li>
                <li>✉️ info@dormdesk.nst.edu</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-80">
            <p>© 2026 DormDesk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
