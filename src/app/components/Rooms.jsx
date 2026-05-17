import { Users, Bed, CheckCircle, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { AnimatedCard } from './AnimatedCard';
import { GlassCard } from './GlassCard';
import { useState } from 'react';

export function Rooms({ rooms, onBookRoom, onAddRoom }) {
  const [filter, setFilter] = useState('all');

  const filteredRooms = rooms.filter(room => {
    if (filter === 'all') return true;
    return room.type.toLowerCase() === filter;
  });

  const getGradient = (index) => {
    const gradients = [
      'from-blue-500/20 to-purple-500/20',
      'from-purple-500/20 to-pink-500/20',
      'from-pink-500/20 to-red-500/20',
      'from-orange-500/20 to-yellow-500/20',
      'from-green-500/20 to-emerald-500/20',
      'from-cyan-500/20 to-blue-500/20',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Our Rooms</h1>
        <p className="text-muted-foreground text-lg">
          {rooms.length === 0 ? 'No rooms available yet. Add your first room!' : 'Choose from our range of comfortable accommodations'}
        </p>
      </motion.div>

      {rooms.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex justify-center gap-3">
          {['all', 'shared', 'private'].map((filterType) => (
            <motion.button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-6 py-2 rounded-full capitalize transition-all ${
                filter === filterType
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filterType}
            </motion.button>
          ))}
        </motion.div>
      )}

      {filteredRooms.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
          <GlassCard className="p-12 max-w-md mx-auto">
            <Bed className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">No Rooms Available</h3>
            <p className="text-muted-foreground mb-6">
              {rooms.length === 0 ? 'Start by adding your first room to the system.' : 'No rooms match your filter. Try a different category.'}
            </p>
            {onAddRoom && rooms.length === 0 && (
              <motion.button onClick={onAddRoom} className="bg-primary text-primary-foreground px-6 py-3 rounded-lg flex items-center gap-2 mx-auto" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Plus className="w-5 h-5" />Add First Room
              </motion.button>
            )}
          </GlassCard>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room, index) => (
            <AnimatedCard key={room.id} delay={index * 0.1}>
              <GlassCard className="overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                <motion.div className={`bg-gradient-to-br ${getGradient(index)} p-16 text-center relative overflow-hidden`} whileHover={{ scale: 1.05 }}>
                  <motion.div className="text-7xl" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}>
                    {room.type.toLowerCase() === 'shared' ? '🛏️' : '🏠'}
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="mb-1 group-hover:text-primary transition-colors">{room.name}</h3>
                    <p className="text-sm text-muted-foreground">{room.type} Room</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <motion.div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full" whileHover={{ scale: 1.05 }}>
                      <Users className="w-4 h-4 text-primary" />
                      <span>{room.capacity} {room.capacity === 1 ? 'person' : 'people'}</span>
                    </motion.div>
                    <motion.div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full" whileHover={{ scale: 1.05 }}>
                      <Bed className="w-4 h-4 text-primary" />
                      <span>{room.beds} {room.beds === 1 ? 'bed' : 'beds'}</span>
                    </motion.div>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {room.amenities.slice(0, 4).map((amenity, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{amenity}</span>
                      </motion.div>
                    ))}
                    {room.amenities.length > 4 && (
                      <p className="text-sm text-muted-foreground pl-6">+{room.amenities.length - 4} more</p>
                    )}
                  </div>
                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">From</p>
                      <motion.p className="text-2xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent" whileHover={{ scale: 1.1 }}>
                        ${room.price}<span className="text-sm text-muted-foreground">/night</span>
                      </motion.p>
                    </div>
                    <motion.button onClick={() => onBookRoom(room)} className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground px-6 py-3 rounded-xl shadow-lg relative overflow-hidden group" whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }} whileTap={{ scale: 0.95 }}>
                      <span className="relative z-10">Book Now</span>
                      <motion.div className="absolute inset-0 bg-white/20" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.5 }} />
                    </motion.button>
                  </div>
                </div>
              </GlassCard>
            </AnimatedCard>
          ))}
        </div>
      )}
    </div>
  );
}
