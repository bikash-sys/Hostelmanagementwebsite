import { useState } from 'react';
import { Calendar, User, Mail, Phone, Check, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import confetti from 'canvas-confetti';
import emailjs from '@emailjs/browser';

export function BookingForm({ selectedRoom, onBack }) {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    checkIn: '', checkOut: '', guests: 1, specialRequests: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateNights = () => {
    if (formData.checkIn && formData.checkOut) {
      const start = new Date(formData.checkIn);
      const end = new Date(formData.checkOut);
      const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return nights > 0 ? nights : 0;
    }
    return 0;
  };

  const nights = calculateNights();
  const totalPrice = selectedRoom ? nights * selectedRoom.price : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newBookingRef = `BK${Math.floor(Math.random() * 1000000)}`;
    setBookingRef(newBookingRef);

    const templateParams = {
      to_name: formData.firstName + ' ' + formData.lastName,
      to_email: formData.email,
      booking_id: newBookingRef,
      room_name: selectedRoom?.name || 'Room',
      check_in: formData.checkIn,
      check_out: formData.checkOut,
      total_price: `$${totalPrice + Math.round(totalPrice * 0.1)}`
    };

    // console.log("Sending email with params:", templateParams);
  
    emailjs.send(
      'service_lduq7np',
      'template_6w6ox5i',
      templateParams,
      'WBEyamB5OZk4Fvh55'
    ).then((response) => {
      console.log('Email sent successfully!', response.status, response.text);
      setIsSubmitting(false);
      setSubmitted(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }).catch((error) => {
      console.error('Failed to send email', error);
      // We still complete the booking locally even if the email fails during testing.
      setIsSubmitting(false);
      setSubmitted(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    });
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
        <GlassCard className="p-8 text-center space-y-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
            <Check className="w-10 h-10 text-white" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="mb-2">Booking Confirmed!</h2>
            <p className="text-muted-foreground">Thank you for your reservation. A confirmation email has been sent to {formData.email}.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <GlassCard className="p-6 space-y-3 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <div className="flex justify-between"><span className="text-muted-foreground">Booking Reference</span><span className="font-semibold">{bookingRef}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Room</span><span className="font-semibold">{selectedRoom?.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Check-in</span><span className="font-semibold">{new Date(formData.checkIn).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Check-out</span><span className="font-semibold">{new Date(formData.checkOut).toLocaleDateString()}</span></div>
              <div className="flex justify-between pt-3 border-t border-border"><span>Total</span><span className="text-xl font-semibold text-primary">${totalPrice + Math.round(totalPrice * 0.1)}</span></div>
            </GlassCard>
          </motion.div>
          <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} onClick={() => { setSubmitted(false); const data = { firstName: formData.firstName, lastName: formData.lastName, email: formData.email, roomName: selectedRoom?.name || 'Room', checkIn: formData.checkIn, bookingRef: bookingRef }; setFormData({ firstName: '', lastName: '', email: '', phone: '', checkIn: '', checkOut: '', guests: 1, specialRequests: '' }); onBack(data); }} className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground px-8 py-3 rounded-xl shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Explore Services
          </motion.button>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
      <motion.button onClick={onBack} className="mb-6 flex items-center gap-2 text-primary hover:gap-3 transition-all" whileHover={{ x: -5 }}>
        <ArrowLeft className="w-5 h-5" />Back to Services
      </motion.button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">Booking Details</motion.h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block mb-2">First Name</label><input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" /></div>
                <div><label className="block mb-2">Last Name</label><input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" /></div>
              </div>
              <div><label className="block mb-2"><Mail className="inline w-4 h-4 mr-2" />Email Address</label><input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" /></div>
              <div><label className="block mb-2"><Phone className="inline w-4 h-4 mr-2" />Phone Number</label><input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block mb-2"><Calendar className="inline w-4 h-4 mr-2" />Check-in Date</label><input type="date" name="checkIn" required value={formData.checkIn} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" /></div>
                <div><label className="block mb-2"><Calendar className="inline w-4 h-4 mr-2" />Check-out Date</label><input type="date" name="checkOut" required value={formData.checkOut} onChange={handleChange} min={formData.checkIn || new Date().toISOString().split('T')[0]} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" /></div>
              </div>
              <div><label className="block mb-2"><User className="inline w-4 h-4 mr-2" />Number of Guests</label>
                <select name="guests" value={formData.guests} onChange={handleChange} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (<option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>))}
                </select>
              </div>
              <div><label className="block mb-2">Special Requests (Optional)</label><textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} rows={4} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" placeholder="Any special requirements or requests..." /></div>
              <motion.button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-primary to-purple-600 text-primary-foreground py-4 rounded-xl shadow-lg relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed" whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" } : {}} whileTap={!isSubmitting ? { scale: 0.98 } : {}}>
                <span className="relative z-10">{isSubmitting ? 'Processing...' : 'Confirm Booking'}</span>
                {!isSubmitting && <motion.div className="absolute inset-0 bg-white/20" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.5 }} />}
              </motion.button>
            </form>
          </GlassCard>
        </div>
        <div className="lg:col-span-1">
          <GlassCard className="p-6 sticky top-20">
            <h3 className="mb-4">Booking Summary</h3>
            <div className="space-y-4">
              <div><p className="text-muted-foreground">Room</p><p>{selectedRoom?.name}</p></div>
              {nights > 0 && (
                <>
                  <div className="border-t border-border pt-4"><p className="text-muted-foreground">Dates</p><p className="text-sm">{formData.checkIn && new Date(formData.checkIn).toLocaleDateString()} - {formData.checkOut && new Date(formData.checkOut).toLocaleDateString()}</p><p className="text-sm text-muted-foreground mt-1">{nights} {nights === 1 ? 'night' : 'nights'}</p></div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between mb-2"><span className="text-muted-foreground">${selectedRoom?.price} × {nights} nights</span><span>${totalPrice}</span></div>
                    <div className="flex justify-between mb-2"><span className="text-muted-foreground">Service Fee</span><span>${Math.round(totalPrice * 0.1)}</span></div>
                    <motion.div className="flex justify-between pt-2 border-t border-border" whileHover={{ scale: 1.02 }}><span>Total</span><span className="text-2xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">${totalPrice + Math.round(totalPrice * 0.1)}</span></motion.div>
                  </div>
                </>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
