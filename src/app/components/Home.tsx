import { Wifi, Coffee, MapPin, Users, Clock, Shield, Sparkles, Utensils, CarTaxiFront, ShowerHead } from 'lucide-react';
import { motion } from 'motion/react';
import { AnimatedCard } from './AnimatedCard';
import { FloatingShapes } from './FloatingShapes';
import { GlassCard } from './GlassCard';

interface HomeProps {
  onBookNow: () => void;
}

export function Home({ onBookNow }: HomeProps) {
  const features = [
    { icon: Wifi, title: 'Free WiFi', description: 'High-speed internet throughout', color: 'text-blue-500' },
    { icon: Coffee, title: 'Free Breakfast', description: 'Continental breakfast daily', color: 'text-amber-500' },
    { icon: Users, title: 'Common Areas', description: 'Socialize with other travelers', color: 'text-purple-500' },
    { icon: Clock, title: '24/7 Reception', description: 'Always here to help', color: 'text-green-500' },
    { icon: Shield, title: 'Secure Storage', description: 'Personal lockers available', color: 'text-red-500' },
    { icon: CarTaxiFront, title: 'Airport Shuttle', description: 'Easy transfers available', color: 'text-indigo-500' },
    { icon: Utensils, title: 'Full Kitchen', description: 'Cook your own meals', color: 'text-orange-500' },
    { icon: ShowerHead, title: 'Hot Showers', description: 'Clean facilities 24/7', color: 'text-cyan-500' },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl">
        <FloatingShapes />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <GlassCard className="px-8 py-20 md:py-32">
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                  <h1 className="bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                    Welcome to HostelHub
                  </h1>
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                </div>
              </motion.div>

              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
              >
                Your home away from home. Experience comfortable, affordable accommodation
                in the heart of the city with a vibrant community of travelers.
              </motion.p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  onClick={onBookNow}
                  className="relative bg-gradient-to-r from-primary to-purple-600 text-primary-foreground px-10 py-4 rounded-xl shadow-xl overflow-hidden group"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Book Your Stay
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
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

      {/* Features Section */}
      <section className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="mb-3">Why Choose Us</h2>
          <p className="text-muted-foreground">Everything you need for a comfortable stay</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <AnimatedCard key={index} delay={index * 0.1}>
              <GlassCard className="p-6 text-center group hover:border-primary/50 transition-all duration-300">
                <motion.div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center ${feature.color}`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="w-8 h-8" />
                </motion.div>
                <h3 className="mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </GlassCard>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl"
      >
        <GlassCard className="p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10+', label: 'Years Experience' },
              { value: '50K+', label: 'Happy Guests' },
              { value: '4.9', label: 'Rating' },
              { value: '100+', label: 'Rooms Available' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: 'spring' }}
              >
                <motion.div
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2"
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.section>

      {/* Location Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="px-4"
      >
        <GlassCard className="p-12 text-center max-w-3xl mx-auto">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <MapPin className="w-16 h-16 mx-auto mb-6 text-primary" />
          </motion.div>
          <h2 className="mb-4">Prime Location</h2>
          <p className="text-muted-foreground text-lg mb-6">
            Located in the city center, within walking distance to major attractions,
            restaurants, and public transportation. Perfect for exploring the city!
          </p>
          <motion.button
            className="text-primary hover:underline flex items-center gap-2 mx-auto"
            whileHover={{ x: 5 }}
          >
            View on Map →
          </motion.button>
        </GlassCard>
      </motion.section>
    </div>
  );
}
