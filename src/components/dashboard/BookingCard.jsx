import React from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  XCircle, 
  ChevronRight, 
  Calendar, 
  Clock, 
  User, 
  Package 
} from "lucide-react";
import { cn } from "@/utils/cn";

const BookingCard = ({ booking, onCancel, onArchive }) => {
  const isCompleted = booking.status === "completed";
  const isCancelled = booking.status === "cancelled" || booking.status === "cancel";
  
  const statusConfig = {
    pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500", icon: Clock },
    accept: { label: "Accepted", bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500", icon: User },
    completed: { label: "Completed", bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500", icon: CheckCircle2 },
    cancelled: { label: "Cancelled", bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500", icon: XCircle },
    cancel: { label: "Cancelled", bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500", icon: XCircle },
  };

  const status = statusConfig[booking.status] || { 
    label: booking.status, 
    bg: "bg-gray-100", 
    text: "text-gray-700", 
    dot: "bg-gray-500",
    icon: Package 
  };

  const StatusIcon = status.icon;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="group bg-white border border-gray-100 rounded-[2.5rem] p-6 md:p-8 hover:shadow-2xl hover:shadow-primary/5 transition-all relative overflow-hidden"
    >
      <div className={cn("absolute -right-20 -top-20 w-40 h-40 blur-[120px] opacity-10 rounded-full", status.dot)} />

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Main Details */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[11px] font-black px-4 py-1.5 bg-gray-900 text-white rounded-full tracking-wider shadow-lg shadow-gray-900/10">
              #{booking.id?.slice(-8).toUpperCase()}
            </span>
            <div className={cn("flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest", status.bg, status.text)}>
              <div className={cn("w-2 h-2 rounded-full animate-pulse", status.dot)} />
              {status.label}
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold bg-gray-50 px-3 py-1.5 rounded-full">
              <Calendar size={14} />
              {new Date(booking.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            {/* Route Visualizer */}
            <div className="absolute left-[7px] top-6 bottom-6 w-0.5 bg-gray-100 border-l border-dashed border-gray-300 hidden md:block" />
            
            <div className="flex gap-4">
              <div className="w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm flex-shrink-0 mt-1 z-10" />
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pickup Address</p>
                <p className="text-sm font-bold text-gray-800 leading-relaxed max-w-sm">
                  {booking.pickupdetails?.pickupaddress || booking.pickupdetails?.address}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <MapPin size={18} className="text-red-500 flex-shrink-0 mt-1 z-10" />
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Destination</p>
                <p className="text-sm font-bold text-gray-800 leading-relaxed max-w-sm">
                  {booking.destinationdetails?.destination || booking.destinationdetails?.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="xl:w-64 flex flex-col justify-between items-end border-t xl:border-t-0 xl:border-l border-gray-100 pt-6 xl:pt-0 xl:pl-8">
          <div className="text-right w-full flex xl:flex-col justify-between xl:justify-start items-center xl:items-end">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Charges</p>
              <div className="flex items-baseline gap-1 text-primary">
                <span className="text-lg font-bold">$</span>
                <span className="text-3xl font-black">{Number(booking.deliverydetails?.totalcharges || 0).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="xl:mt-4 text-right">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Time</p>
               <p className="text-sm font-bold text-gray-800">{new Date(booking.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-3 mt-8">
            {!isCompleted && !isCancelled && (
              <button 
                onClick={() => onCancel(booking.id)}
                className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-black text-red-600 bg-red-50 hover:bg-red-100 rounded-2xl transition-all active:scale-95"
              >
                <XCircle size={14} /> Cancel
              </button>
            )}
            <button className={cn(
              "flex items-center justify-center gap-2 px-4 py-3 text-xs font-black rounded-2xl transition-all active:scale-95 shadow-sm",
              isCompleted || isCancelled ? "col-span-2 bg-gray-50 text-gray-400" : "bg-primary text-white hover:bg-primary/90"
            )}>
               Details <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCard;
