import { Building, Eye, Lightbulb, LayoutDashboard, Shield, BellRing, MessagesSquare, Server } from 'lucide-react';
import { motion } from 'motion/react';
import { AnimatedCard } from './AnimatedCard';
import { GlassCard } from './GlassCard';

export function About() {
  const offerings = [
    { icon: LayoutDashboard, title: 'Smart Room Allocation', description: 'Efficient room allocation and comprehensive hostel records management for every student.', color: 'text-blue-500' },
    { icon: Server, title: 'Complaint & Maintenance', description: 'Digital complaint and maintenance management system for quick resolution of issues.', color: 'text-pink-500' },
    { icon: Shield, title: 'Secure Student Data', description: 'Secure student data handling and hostel access tracking to ensure safety at all times.', color: 'text-green-500' },
    { icon: BellRing, title: 'Real-Time Updates', description: 'Instant announcements and updates to keep students informed about hostel activities.', color: 'text-yellow-500' },
    { icon: MessagesSquare, title: 'Warden Communication', description: 'Easy and direct communication channel between wardens and students.', color: 'text-purple-500' },
    { icon: Lightbulb, title: 'Modern Dashboard', description: 'A sleek, modern dashboard for efficient hostel administration and oversight.', color: 'text-cyan-500' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">About DormDesk</h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-4">NST BLR Hostel Management System</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <GlassCard className="p-8 md:p-12">
          <div className="space-y-6 text-muted-foreground text-base leading-relaxed">
            <p>DormDesk is the official Hostel Management System designed for the students of{' '}<span className="text-foreground font-semibold">Newton School of Technology</span>. Built for a modern tech-driven campus, DormDesk simplifies hostel operations and improves the residential experience for B.Tech students through a smart, secure, and efficient digital platform.</p>
            <p>At NST BLR, where innovation and technology are part of everyday learning, DormDesk serves as a centralized system for managing hostel accommodations, room allocations, maintenance requests, attendance, notices, and student services. The platform is designed to reduce manual work, improve communication between hostel administration and students, and create a seamless living environment within the campus.</p>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <GlassCard className="p-8 md:p-12 text-center relative overflow-hidden">
          <motion.div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }} />
          <div className="relative z-10">
            <motion.div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center text-primary" whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.6 }}>
              <Eye className="w-10 h-10" />
            </motion.div>
            <h2 className="mb-4">Our Vision</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">To create a smart and connected hostel ecosystem that matches the fast-paced and innovative culture of a leading technology college.</p>
          </div>
        </GlassCard>
      </motion.div>

      <div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="mb-3">What DormDesk Offers</h2>
          <p className="text-muted-foreground">Smart tools for a smarter campus life</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offerings.map((item, index) => (
            <AnimatedCard key={index} delay={index * 0.1}>
              <GlassCard className="p-6 group hover:border-primary/50 transition-all duration-300 h-full">
                <motion.div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center mb-4 ${item.color}`} whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.6 }}>
                  <item.icon className="w-8 h-8" />
                </motion.div>
                <h3 className="mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </GlassCard>
            </AnimatedCard>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <GlassCard className="p-8 md:p-12">
          <h2 className="mb-6 text-center">Why DormDesk?</h2>
          <p className="text-muted-foreground text-base leading-relaxed text-center max-w-3xl mx-auto mb-8">DormDesk is more than just a hostel management system — it is a platform built to enhance campus living for future engineers and innovators. By combining technology with convenience, DormDesk helps NST BLR provide a safe, organized, and student-friendly hostel experience.</p>
          <motion.p className="text-center text-xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent" whileHover={{ scale: 1.05 }}>DormDesk – Smart Living for Future Engineers.</motion.p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
