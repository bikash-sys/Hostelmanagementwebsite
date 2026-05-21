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
  const userBookings = bookings.filter(b => b.user_email === user?.email);

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
        } else {
          const prof = await getProfile(u.email);
          setUserRole(prof?.role || 'student');
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
        } else {
          const prof = await getProfile(u.email);
          setUserRole(prof?.role || 'student');
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
    setBookedStudent(studentData);
    setCurrentView('your_room');

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
      setBookings([...bookings, data[0]]);
    } else if (error) {
      console.error('Error saving booking:', error);
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

  if (user && userRole === 'manager') {
    return <ManagerDashboard user={user} onLogout={handleLogout} />;
  }

  if (currentView === 'your_room' && userBookings.length > 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          currentView={currentView}
          onViewChange={handleViewChange}
          user={user}
          isAdmin={isAdmin}
          hasRoom={userBookings.length > 0}
          onLogout={handleLogout}
        />
        <div className="flex-1">
          <ServicesDashboard user={user} bookingsData={userBookings.map(formatBookingData)} />
        </div>
      </div>
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
            rooms={rooms}
            onBookRoom={handleBookRoom}
            onAddRoom={() => setCurrentView('admin')}
            isAdmin={isAdmin}
          />
        )}
        {user && currentView === 'bookings' && (
          <BookingForm
            selectedRoom={selectedRoom}
            onBack={handleBookingComplete}
          />
        )}
        {currentView === 'about' && <About />}
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
