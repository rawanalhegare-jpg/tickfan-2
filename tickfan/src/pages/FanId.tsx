import { useGetFanProfile } from "@workspace/api-client-react";
import { ShieldCheck, QrCode, Award, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function FanId() {
  const { data: profile, isLoading } = useGetFanProfile();

  if (isLoading) return <div className="h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!profile) return <div className="text-center py-20">Fan ID not found.</div>;

  return (
    <div className="bg-background pb-20 pt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-[80vh] flex flex-col items-center justify-center">
      
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="font-display font-black text-4xl mb-4">Your Verified Fan ID</h1>
        <p className="text-muted-foreground">Present this secure digital ID at stadium entrances. Your reputation score grants you access to exclusive tiers and early ticket drops.</p>
      </div>

      <motion.div 
        initial={{ rotateY: 10, rotateX: 10, opacity: 0 }}
        animate={{ rotateY: 0, rotateX: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.4, duration: 1 }}
        className="relative w-full max-w-sm aspect-[3/4] rounded-3xl shadow-2xl p-1 overflow-hidden"
        style={{ perspective: "1000px" }}
      >
        {/* Animated gradient border */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary animate-[spin_4s_linear_infinite]" />
        
        {/* Card Body */}
        <div className="absolute inset-1 bg-foreground rounded-[22px] overflow-hidden">
           {/* Holographic background */}
           <img src={`${import.meta.env.BASE_URL}images/fan-id-bg.png`} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen" alt="" />
           
           <div className="relative z-10 p-6 h-full flex flex-col text-white">
             {/* Header */}
             <div className="flex justify-between items-start mb-8">
               <div className="font-display font-black text-xl">Tick<span className="text-primary">Fan</span></div>
               <ShieldCheck className="w-8 h-8 text-accent" />
             </div>

             {/* Photo & Name */}
             <div className="flex items-end gap-4 mb-8">
               <div className="w-24 h-24 bg-white/10 rounded-xl border-2 border-white/30 overflow-hidden shrink-0">
                  {profile.avatar && <img src={profile.avatar} alt="Fan" className="w-full h-full object-cover" />}
               </div>
               <div>
                 <p className="text-xs uppercase tracking-widest text-white/60 mb-1">Fan Name</p>
                 <h2 className="font-bold text-2xl leading-tight">{profile.name}</h2>
                 <p className="text-sm text-primary mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified Identity</p>
               </div>
             </div>

             {/* Stats Row */}
             <div className="grid grid-cols-2 gap-4 bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 mb-auto">
               <div>
                 <p className="text-[10px] uppercase text-white/50 mb-1">Reputation</p>
                 <p className="font-display font-black text-xl text-accent">{profile.reputationScore}<span className="text-sm font-normal text-white/60">/100</span></p>
               </div>
               <div>
                 <p className="text-[10px] uppercase text-white/50 mb-1">Matches Attended</p>
                 <p className="font-display font-black text-xl">{profile.attendanceCount}</p>
               </div>
             </div>

             {/* QR Section */}
             <div className="mt-8 flex items-center justify-between bg-white rounded-xl p-3 text-foreground">
               <div>
                 <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Fan ID Number</p>
                 <p className="font-mono font-bold tracking-widest">{profile.fanId}</p>
               </div>
               <QrCode className="w-10 h-10 text-primary" />
             </div>
           </div>
        </div>
      </motion.div>

      <div className="mt-12 flex gap-4">
        <button className="px-6 py-3 bg-card border-2 border-border font-bold rounded-xl hover:bg-muted transition-colors">Add to Apple Wallet</button>
        <button className="px-6 py-3 bg-card border-2 border-border font-bold rounded-xl hover:bg-muted transition-colors">Add to Google Pay</button>
      </div>
    </div>
  );
}
