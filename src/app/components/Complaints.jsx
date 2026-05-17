import { useState } from 'react';
import { Mail, Hash, DoorOpen, Check, MessageSquareWarning, MessageSquare, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { AnimatedCard } from './AnimatedCard';
import confetti from 'canvas-confetti';

const complaintCategories = ['Maintenance Issue','Cleanliness','Noise Disturbance','Water / Electricity','Food Quality','Security Concern','Room Allocation','Other'];
const feedbackCategories = ['Hostel Facilities','Food & Menu','Staff & Management','Events & Activities','Room & Amenities','General Suggestion','Appreciation','Other'];

export function Complaints() {
  const [submissionType, setSubmissionType] = useState('complaint');
  const [formData, setFormData] = useState({ roomNo: '', usn: '', email: '', category: '', context: '' });
  const [submitted, setSubmitted] = useState(false);

  const categories = submissionType === 'complaint' ? complaintCategories : feedbackCategories;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors: submissionType === 'complaint' ? ['#ef4444','#f97316','#eab308'] : ['#22c55e','#3b82f6','#8b5cf6'] });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({ roomNo: '', usn: '', email: '', category: '', context: '' });
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
        <GlassCard className="p-8 text-center space-y-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-xl ${submissionType === 'complaint' ? 'bg-gradient-to-br from-orange-400 to-red-600' : 'bg-gradient-to-br from-green-400 to-emerald-600'}`}>
            <Check className="w-10 h-10 text-white" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="mb-2">{submissionType === 'complaint' ? 'Complaint Submitted!' : 'Feedback Submitted!'}</h2>
            <p className="text-muted-foreground">{submissionType === 'complaint' ? 'Your complaint has been registered. Our team will look into it and get back to you shortly.' : 'Thank you for your feedback! It helps us improve the hostel experience for everyone.'}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <GlassCard className="p-6 space-y-3 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <div className="flex justify-between"><span className="text-muted-foreground">Reference ID</span><span className="font-semibold">{submissionType === 'complaint' ? 'CMP' : 'FBK'}{Math.floor(Math.random() * 1000000)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-semibold capitalize">{submissionType}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">USN</span><span className="font-semibold">{formData.usn}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Room No.</span><span className="font-semibold">{formData.roomNo}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span className="font-semibold">{formData.category}</span></div>
            </GlassCard>
          </motion.div>
          <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} onClick={resetForm} className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground px-8 py-3 rounded-xl shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Submit Another</motion.button>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Complaints & Feedback</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We value your voice. Share your complaints or feedback to help us improve your hostel experience.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex justify-center">
        <div className="inline-flex rounded-xl overflow-hidden border border-border bg-card">
          <motion.button onClick={() => { setSubmissionType('complaint'); setFormData({ ...formData, category: '' }); }} className={`flex items-center gap-2 px-6 py-3 transition-all font-medium ${submissionType === 'complaint' ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`} whileTap={{ scale: 0.95 }}>
            <MessageSquareWarning className="w-5 h-5" />Complaint
          </motion.button>
          <motion.button onClick={() => { setSubmissionType('feedback'); setFormData({ ...formData, category: '' }); }} className={`flex items-center gap-2 px-6 py-3 transition-all font-medium ${submissionType === 'feedback' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`} whileTap={{ scale: 0.95 }}>
            <MessageSquare className="w-5 h-5" />Feedback
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div key={submissionType} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <GlassCard className="p-6">
                <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">{submissionType === 'complaint' ? 'File a Complaint' : 'Share Feedback'}</motion.h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="block mb-2"><DoorOpen className="inline w-4 h-4 mr-2" />Room Number</label><input type="text" name="roomNo" required value={formData.roomNo} onChange={handleChange} placeholder="e.g. A-204" className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" /></div>
                    <div><label className="block mb-2"><Hash className="inline w-4 h-4 mr-2" />USN</label><input type="text" name="usn" required value={formData.usn} onChange={handleChange} placeholder="e.g. 1NT24CS001" className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" /></div>
                  </div>
                  <div><label className="block mb-2"><Mail className="inline w-4 h-4 mr-2" />Email Address</label><input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="your.email@nst.edu" className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" /></div>
                  <div>
                    <label className="block mb-2">{submissionType === 'complaint' ? (<><MessageSquareWarning className="inline w-4 h-4 mr-2" />Type of Complaint</>) : (<><MessageSquare className="inline w-4 h-4 mr-2" />Type of Feedback</>)}</label>
                    <select name="category" required value={formData.category} onChange={handleChange} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all">
                      <option value="" disabled>Select a category...</option>
                      {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2">{submissionType === 'complaint' ? 'Describe Your Complaint' : 'Share Your Feedback'}</label>
                    <textarea name="context" required value={formData.context} onChange={handleChange} rows={5} className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder={submissionType === 'complaint' ? 'Please describe the issue in detail...' : 'Tell us what you liked or what can be improved...'} />
                  </div>
                  <motion.button type="submit" className={`w-full py-4 rounded-xl shadow-lg relative overflow-hidden group text-white ${submissionType === 'complaint' ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`} whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }} whileTap={{ scale: 0.98 }}>
                    <span className="relative z-10 flex items-center justify-center gap-2"><Send className="w-5 h-5" />{submissionType === 'complaint' ? 'Submit Complaint' : 'Submit Feedback'}</span>
                    <motion.div className="absolute inset-0 bg-white/20" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.5 }} />
                  </motion.button>
                </form>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <AnimatedCard delay={0.2}>
            <GlassCard className="p-6 sticky top-20">
              <h3 className="mb-4">{submissionType === 'complaint' ? '⚠️ Complaint Guidelines' : '💡 Feedback Tips'}</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {submissionType === 'complaint' ? (
                  <>
                    <li className="flex gap-2"><span className="text-red-500 font-bold">•</span>Provide your correct room number and USN for verification.</li>
                    <li className="flex gap-2"><span className="text-red-500 font-bold">•</span>Be specific about the issue — include dates, times, and locations if possible.</li>
                    <li className="flex gap-2"><span className="text-red-500 font-bold">•</span>Select the most relevant complaint category.</li>
                    <li className="flex gap-2"><span className="text-red-500 font-bold">•</span>Complaints are typically addressed within 24–48 hours.</li>
                    <li className="flex gap-2"><span className="text-red-500 font-bold">•</span>For urgent issues, contact the hostel warden directly.</li>
                  </>
                ) : (
                  <>
                    <li className="flex gap-2"><span className="text-green-500 font-bold">•</span>Your feedback is anonymous to the hostel committee.</li>
                    <li className="flex gap-2"><span className="text-green-500 font-bold">•</span>Share what's working well — appreciation motivates staff!</li>
                    <li className="flex gap-2"><span className="text-green-500 font-bold">•</span>Suggest improvements with constructive details.</li>
                    <li className="flex gap-2"><span className="text-green-500 font-bold">•</span>Feedback is reviewed weekly by the hostel management.</li>
                    <li className="flex gap-2"><span className="text-green-500 font-bold">•</span>Your input directly shapes hostel policies and services.</li>
                  </>
                )}
              </ul>
            </GlassCard>
          </AnimatedCard>
        </div>
      </div>
    </motion.div>
  );
}
