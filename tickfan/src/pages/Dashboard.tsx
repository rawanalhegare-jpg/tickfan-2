import { useGetFanDashboard } from "@workspace/api-client-react";
import { format } from "date-fns";
import { User, ShieldCheck, Ticket, Calendar, Bell, Settings, Award, MapPin } from "lucide-react";
import { cn, formatSAR } from "@/lib/utils";

export default function Dashboard() {
  const { data: dashboard, isLoading } = useGetFanDashboard();

  if (isLoading) return <div className="h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!dashboard) return <div className="text-center py-20">Dashboard data unavailable.</div>;

  const { profile, purchasedTickets, notifications } = dashboard;

  return (
    <div className="bg-background pb-20">
      {/* Profile Header */}
      <div className="bg-foreground text-white py-12 border-b-4 border-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern-bg.png')] bg-cover mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full border-4 border-primary bg-muted overflow-hidden shrink-0 shadow-xl shadow-primary/20">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="font-display font-black text-3xl md:text-4xl mb-2">{profile.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm font-medium">
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full"><ShieldCheck className="w-4 h-4 text-primary" /> {profile.reputationStatus}</span>
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full"><Award className="w-4 h-4 text-accent" /> Score: {profile.reputationScore}/100</span>
              <span className="text-white/60">Member since {new Date(profile.memberSince).getFullYear()}</span>
            </div>
          </div>
          <div className="flex gap-4">
             <button className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors border border-white/20 relative">
               <Bell className="w-6 h-6" />
               <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border border-foreground" />
             </button>
             <button className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors border border-white/20">
               <Settings className="w-6 h-6" />
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col - Quick Stats & Badges */}
        <div className="space-y-8">
          <div className="bg-card rounded-3xl p-6 border-2 border-border shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-primary" /> Fan Badges</h3>
            <div className="flex flex-wrap gap-2">
              {profile.badges.map(badge => (
                <span key={badge} className="px-3 py-1.5 bg-muted text-foreground text-sm font-semibold rounded-lg border border-border">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-3xl p-6 border-2 border-border shadow-sm">
            <h3 className="font-bold text-lg mb-4">Recent Notifications</h3>
            <div className="space-y-4">
              {notifications.slice(0,4).map(notif => (
                <div key={notif.id} className="flex gap-3">
                  <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0", notif.read ? "bg-muted-foreground" : "bg-primary")} />
                  <div>
                    <p className={cn("text-sm", notif.read ? "text-muted-foreground" : "font-semibold text-foreground")}>{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{format(new Date(notif.time), 'MMM d, h:mm a')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col - My Tickets */}
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
            <Ticket className="w-6 h-6 text-primary" /> My Tickets
          </h2>
          
          <div className="space-y-4">
            {purchasedTickets.length === 0 ? (
              <div className="text-center py-16 bg-card border-2 border-dashed border-border rounded-3xl text-muted-foreground">
                <Ticket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-semibold text-lg">No tickets yet</p>
                <p className="text-sm">Find upcoming matches to book your spot.</p>
              </div>
            ) : (
              purchasedTickets.map(ticket => (
                <div key={ticket.id} className="flex flex-col sm:flex-row bg-card rounded-2xl border-2 border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                  <div className="bg-primary p-6 flex flex-col justify-center items-center text-white sm:w-40 border-r-2 border-dashed border-background relative">
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-background rounded-full" />
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-background rounded-full" />
                    <p className="text-xs uppercase font-bold tracking-widest opacity-80 mb-1">{format(new Date(ticket.matchDate), 'MMM')}</p>
                    <p className="font-display font-black text-4xl leading-none">{format(new Date(ticket.matchDate), 'dd')}</p>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <span className={cn(
                        "text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded mb-2 inline-block",
                        ticket.status === 'Active' ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                      )}>
                        {ticket.status}
                      </span>
                      <h4 className="font-bold text-lg mb-1">{ticket.matchName}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {ticket.stadium}</span>
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {ticket.seat}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                      <button className="flex-1 bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                        View QR
                      </button>
                      <button className="flex-1 bg-background border border-border hover:bg-muted text-foreground px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                        Resell
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
