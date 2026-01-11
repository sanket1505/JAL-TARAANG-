import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Check, Clock, Droplets, Info, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'alert' | 'success';
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Water Tank Full',
    message: 'Your 5000L tank has reached 95% capacity. Great job on harvesting!',
    time: '2 hours ago',
    type: 'success',
    read: false,
  },
  {
    id: '2',
    title: 'Maintenance Reminder',
    message: 'It\'s time to clean your first-flush filter to ensure water quality.',
    time: '5 hours ago',
    type: 'alert',
    read: false,
  },
  {
    id: '3',
    title: 'Rain Forecast',
    message: 'Heavy rain expected tomorrow. Ensure your diversion valves are open.',
    time: '1 day ago',
    type: 'info',
    read: true,
  },
  {
    id: '4',
    title: 'Weekly Report',
    message: 'You saved 2,400 liters of water this week. See your detailed report.',
    time: '2 days ago',
    type: 'info',
    read: true,
  },
  {
    id: '5',
    title: 'New Feature Alert',
    message: 'Try our new AR simulation for placing recharging wells!',
    time: '3 days ago',
    type: 'info',
    read: true,
  },
];

export function NotificationPage({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <Droplets size={20} className="text-blue-500" />;
      case 'alert': return <AlertTriangle size={20} className="text-orange-500" />;
      default: return <Info size={20} className="text-primary" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-blue-500/10';
      case 'alert': return 'bg-orange-500/10';
      default: return 'bg-primary/10';
    }
  };

  return (
    <div className="min-h-[90vh] pb-20 relative overflow-hidden bg-gradient-to-br from-slate-50 to-orange-50/50">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none" />
      </div>

      <div className="max-w-md mx-auto p-4 relative z-10 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pt-4 mb-2">
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs text-primary hover:text-orange-600 hover:bg-orange-50">
                Mark all as read
            </Button>
        </div>

        {/* Filter Tabs */}
        <div className="p-1 bg-white/40 backdrop-blur-sm rounded-xl inline-flex shadow-sm border border-white/40 mb-4 w-full">
            <button
                onClick={() => setFilter('all')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    filter === 'all' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-muted-foreground hover:bg-white/40'
                }`}
            >
                All
            </button>
            <button
                onClick={() => setFilter('unread')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    filter === 'unread' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-muted-foreground hover:bg-white/40'
                }`}
            >
                Unread
                {notifications.some(n => !n.read) && (
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                )}
            </button>
        </div>

        {/* Notifications List */}
        <AnimatePresence mode="popLayout">
            {filteredNotifications.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20 text-muted-foreground"
                >
                        <Bell size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No notifications found</p>
                        </motion.div>
                      ) : (
                <div className="space-y-3">
                    {filteredNotifications.map((notification, i) => (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => markAsRead(notification.id)}
                            className="group"
                        >
                            <Card className={`border-white/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden ${notification.read ? 'bg-white/40 opacity-70' : 'bg-white/80'}`}>
                                <CardContent className="p-4 flex gap-4">
                                    <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getBgColor(notification.type)}`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h3 className={`font-semibold text-sm truncate ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {notification.title}
                                            </h3>
                                            {!notification.read && (
                                                <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60 font-medium">
                                            <Clock size={10} />
                                            {notification.time}
                                        </div>
                                    </div>
                                </CardContent>
                                {!notification.read && (
                                    <div className="absolute inset-y-0 left-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}