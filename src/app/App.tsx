import { useState } from 'react';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { Rooms, Room } from './components/Rooms';
import { BookingForm } from './components/BookingForm';
import { About } from './components/About';
import { Admin } from './components/Admin';

interface Booking {
  id: string;
  guest: string;
  room: string;
  checkIn: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    setSelectedRoom(null);
  };

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    setCurrentView('bookings');
  };

  const handleAddRoom = (room: Room) => {
    setRooms([...rooms, room]);
  };

  const handleDeleteRoom = (id: number) => {
    setRooms(rooms.filter(room => room.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentView={currentView} onViewChange={handleViewChange} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && <Home onBookNow={() => setCurrentView('rooms')} />}
        {currentView === 'rooms' && (
          <Rooms
            rooms={rooms}
            onBookRoom={handleBookRoom}
            onAddRoom={() => setCurrentView('admin')}
          />
        )}
        {currentView === 'bookings' && (
          <BookingForm
            selectedRoom={selectedRoom}
            onBack={() => setCurrentView('rooms')}
          />
        )}
        {currentView === 'about' && <About />}
        {currentView === 'admin' && (
          <Admin
            rooms={rooms}
            bookings={bookings}
            onAddRoom={handleAddRoom}
            onDeleteRoom={handleDeleteRoom}
          />
        )}
      </main>

      <footer className="bg-primary text-primary-foreground mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="mb-4">HostelHub</h4>
              <p className="text-sm opacity-80">
                Your home away from home. Comfortable, affordable accommodation
                in the heart of the city.
              </p>
            </div>
            <div>
              <h4 className="mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => handleViewChange('home')} className="hover:underline opacity-80">Home</button></li>
                <li><button onClick={() => handleViewChange('rooms')} className="hover:underline opacity-80">Rooms</button></li>
                <li><button onClick={() => handleViewChange('bookings')} className="hover:underline opacity-80">Book Now</button></li>
                <li><button onClick={() => handleViewChange('about')} className="hover:underline opacity-80">About Us</button></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Contact</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>📍 123 Main Street, Downtown</li>
                <li>📞 +1 (555) 123-4567</li>
                <li>✉️ info@hostelhub.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-80">
            <p>© 2026 HostelHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}