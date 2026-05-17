import { motion } from 'motion/react';
import { AnimatedCard } from './AnimatedCard';
import { GlassCard } from './GlassCard';
import { FloatingShapes } from './FloatingShapes';
import {
  WashingMachine, UtensilsCrossed, Sparkle, CreditCard, Wifi, Headphones,
  Clock, Shield, Zap, Star, ArrowRight, Sparkles, CheckCircle2
} from 'lucide-react';

const services = [
  {
    icon: WashingMachine,
    title: 'Laundry Service',
    description: 'Hassle-free laundry with scheduled pickups and deliveries right to your door.',
    gradient: 'from-blue-500 to-cyan-400',
    shadowColor: 'shadow-blue-500/20',
    hoverBorder: 'hover:border-blue-500/50',
    accentBg: 'bg-blue-500/10',
    accentText: 'text-blue-500',
    highlights: ['Wash & Fold – ₹50/kg', 'Dry Clean – ₹150/item', 'Express 6hr delivery'],
  },
  {
    icon: UtensilsCrossed,
    title: 'Mess & Dining',
    description: 'Nutritious and delicious meals served daily with a rotating weekly menu.',
    gradient: 'from-amber-500 to-orange-400',
    shadowColor: 'shadow-amber-500/20',
    hoverBorder: 'hover:border-amber-500/50',
    accentBg: 'bg-amber-500/10',
    accentText: 'text-amber-500',
    highlights: ['4 meals/day', 'Weekly rotating menu', 'Special diet options'],
  },
  {
    icon: Sparkle,
    title: 'Housekeeping',
    description: 'Professional cleaning, linen changes, and maintenance — just a tap away.',
    gradient: 'from-purple-500 to-pink-400',
    shadowColor: 'shadow-purple-500/20',
    hoverBorder: 'hover:border-purple-500/50',
    accentBg: 'bg-purple-500/10',
    accentText: 'text-purple-500',
    highlights: ['Daily room cleaning', 'Linen & towel change', 'Pest control on request'],
  },
  {
    icon: CreditCard,
    title: 'Payments & Billing',
    description: 'Transparent billing with easy online payments and real-time fee tracking.',
    gradient: 'from-green-500 to-emerald-400',
    shadowColor: 'shadow-green-500/20',
    hoverBorder: 'hover:border-green-500/50',
    accentBg: 'bg-green-500/10',
    accentText: 'text-green-500',
    highlights: ['Online fee payment', 'Auto-generated receipts', 'Payment reminders'],
  },
  {
    icon: Wifi,
    title: 'High-Speed Wifi',
    description: 'Blazing-fast 100 Mbps internet across all hostel floors and common areas.',
    gradient: 'from-indigo-500 to-blue-400',
    shadowColor: 'shadow-indigo-500/20',
    hoverBorder: 'hover:border-indigo-500/50',
    accentBg: 'bg-indigo-500/10',
    accentText: 'text-indigo-500',
    highlights: ['100 Mbps speed', 'Unlimited data', 'Up to 3 devices'],
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Round-the-clock assistance from the hostel team for any issue or emergency.',
    gradient: 'from-red-500 to-rose-400',
    shadowColor: 'shadow-red-500/20',
    hoverBorder: 'hover:border-red-500/50',
    accentBg: 'bg-red-500/10',
    accentText: 'text-red-500',
    highlights: ['24/7 helpline', 'Warden on call', 'Emergency response'],
  },
];

const highlights = [
  { icon: Clock, label: 'Available 24/7', description: 'All services round the clock' },
  { icon: Shield, label: 'Secure & Trusted', description: 'Your safety is our priority' },
  { icon: Zap, label: 'Instant Access', description: 'One click from your dashboard' },
  { icon: Star, label: 'Student Rated', description: '4.9★ average satisfaction' },
];

export function Services({ onBookNow }) {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl">
        <FloatingShapes />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <GlassCard className="px-8 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  <span className="text-sm font-semibold uppercase tracking-widest text-primary/70">
                    Everything You Need
                  </span>
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent mb-4">
                  Our Services
                </h1>
              </motion.div>

              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
              >
                From laundry to wifi, dining to support — DormDesk brings every
                hostel service to your fingertips. Book a room to unlock your
                personalized dashboard.
              </motion.p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  onClick={onBookNow}
                  className="relative bg-gradient-to-r from-primary to-purple-600 text-primary-foreground px-8 py-3.5 rounded-xl shadow-xl overflow-hidden group"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Book a Room to Get Started
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.button>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* Highlights Strip */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="px-4"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {highlights.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring' }}
            >
              <GlassCard className="p-5 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center text-primary">
                  <item.icon className="w-6 h-6" />
                </div>
                <p className="font-semibold text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Service Cards Grid */}
      <section className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-bold mb-3">What We Offer</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Comprehensive services designed to make your hostel experience
            seamless, comfortable, and worry-free.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <AnimatedCard key={index} delay={index * 0.1}>
              <GlassCard
                className={`p-6 group ${service.hoverBorder} transition-all duration-300 hover:shadow-2xl ${service.shadowColor} h-full flex flex-col`}
              >
                {/* Icon */}
                <motion.div
                  className={`w-14 h-14 mb-5 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg ${service.shadowColor}`}
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <service.icon className="w-7 h-7 text-white" />
                </motion.div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                  {service.description}
                </p>

                {/* Highlights */}
                <div className="space-y-2.5 mb-6 flex-1">
                  {service.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${service.accentText}`} />
                      <span className="text-sm text-foreground/80">{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <motion.button
                  onClick={onBookNow}
                  className={`w-full py-2.5 rounded-xl ${service.accentBg} ${service.accentText} text-sm font-semibold transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2 group/btn`}
                  whileTap={{ scale: 0.97 }}
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </motion.button>
              </GlassCard>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="px-4"
      >
        <GlassCard className="p-12 text-center max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-purple-500/5 relative overflow-hidden">
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-3">Ready to Experience Premium Living?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Book your room today and get instant access to all these services
              through your personal DormDesk dashboard.
            </p>
            <motion.button
              onClick={onBookNow}
              className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground px-10 py-4 rounded-xl shadow-xl overflow-hidden"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                Book Your Stay Now
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </div>
        </GlassCard>
      </motion.section>
    </div>
  );
}
