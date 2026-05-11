import { Building, Heart, Shield, Award, MapPin, Mail, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { AnimatedCard } from './AnimatedCard';
import { GlassCard } from './GlassCard';

export function About() {
  const values = [
    {
      icon: Building,
      title: 'Our Story',
      description: 'Founded in 2015, HostelHub started with a simple mission: to provide comfortable, affordable accommodation that brings people together. Today, we host thousands of travelers every year.',
      color: 'text-blue-500'
    },
    {
      icon: Heart,
      title: 'Our Values',
      description: 'We believe in creating a welcoming environment where everyone feels at home. Our staff is dedicated to making your stay memorable, safe, and fun.',
      color: 'text-pink-500'
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Your safety is our priority. We have 24/7 security, CCTV cameras, secure lockers, and a night reception to ensure you feel safe at all times.',
      color: 'text-green-500'
    },
    {
      icon: Award,
      title: 'Award Winning',
      description: 'Recognized as one of the best hostels in the city for 3 years running. Rated 4.8/5 by thousands of guests on major booking platforms.',
      color: 'text-yellow-500'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          About HostelHub
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          More than just a place to stay - we're a community of travelers,
          adventurers, and friends from around the world.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {values.map((value, index) => (
          <AnimatedCard key={index} delay={index * 0.1}>
            <GlassCard className="p-6 group hover:border-primary/50 transition-all duration-300">
              <motion.div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center mb-4 ${value.color}`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <value.icon className="w-8 h-8" />
              </motion.div>
              <h3 className="mb-2 group-hover:text-primary transition-colors">{value.title}</h3>
              <p className="text-muted-foreground">
                {value.description}
              </p>
            </GlassCard>
          </AnimatedCard>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <GlassCard className="p-8">
          <h2 className="mb-8 text-center">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4>Accommodation</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Comfortable beds with quality linens</li>
              <li>• Individual reading lights and power outlets</li>
              <li>• Secure lockers in every room</li>
              <li>• Air conditioning and heating</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4>Facilities</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Fully equipped kitchen</li>
              <li>• Common lounge and TV room</li>
              <li>• Outdoor terrace</li>
              <li>• Laundry facilities</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4>Services</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Free WiFi throughout</li>
              <li>• Free breakfast daily</li>
              <li>• Free city maps and travel advice</li>
              <li>• Luggage storage</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4>Activities</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Weekly social events</li>
              <li>• Walking tours</li>
              <li>• Pub crawls</li>
              <li>• Game nights</li>
            </ul>
          </div>
        </div>
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <GlassCard className="p-8 text-center space-y-6">
          <h2>Get in Touch</h2>
          <p className="text-muted-foreground text-lg">
            Have questions? We'd love to hear from you!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <motion.div
              className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-purple-500/5"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Phone className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">+1 (555) 123-4567</p>
              </div>
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-purple-500/5"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Mail className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">info@hostelhub.com</p>
              </div>
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-purple-500/5"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <MapPin className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">City Center</p>
              </div>
            </motion.div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
