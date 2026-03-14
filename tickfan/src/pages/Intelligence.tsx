import { useGetDemandPredictions, useGetRivalryMeters, useGetFanHeatmap } from "@workspace/api-client-react";
import { TrendingUp, AlertCircle, ShieldCheck, Flame, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Intelligence() {
  const { data: demand, isLoading: isDemandLoading } = useGetDemandPredictions();
  const { data: rivalry, isLoading: isRivalryLoading } = useGetRivalryMeters();
  const { data: heatmap, isLoading: isHeatmapLoading } = useGetFanHeatmap();

  return (
    <div className="bg-background pb-20">
      <div className="bg-foreground py-16 text-white text-center border-b-4 border-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/pattern-bg.png')] bg-cover mix-blend-overlay" />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <TrendingUp className="w-12 h-12 text-accent mx-auto mb-4" />
          <h1 className="font-display font-black text-4xl mb-4">Fan Intelligence System</h1>
          <p className="text-white/80 text-lg">AI-powered insights predicting match demand, tracking fan sentiment, and analyzing rivalry intensity.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Demand Predictions */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-primary" /> Demand Predictions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isDemandLoading ? (
              Array.from({length:3}).map((_,i) => <div key={i} className="h-40 bg-card rounded-2xl animate-pulse" />)
            ) : demand?.map(d => (
              <div key={d.matchId} className="bg-card border-2 border-border rounded-2xl p-6 relative overflow-hidden group hover:border-accent transition-colors">
                <div className={cn(
                  "absolute top-0 right-0 w-24 h-24 -mt-12 -mr-12 rounded-full opacity-20",
                  d.demandLevel === 'High' || d.demandLevel === 'Extreme' ? 'bg-destructive' : 'bg-primary'
                )} />
                <h3 className="font-bold text-lg mb-4 pr-8 leading-tight">{d.matchName}</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1 font-semibold">
                      <span>Tickets Sold</span>
                      <span>{d.percentageSold}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={cn("h-full rounded-full", d.percentageSold > 85 ? "bg-destructive" : "bg-primary")} 
                        style={{ width: `${d.percentageSold}%` }} 
                      />
                    </div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg text-sm flex gap-2 items-start">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-accent" />
                    <span className="font-medium">{d.alert} (est. {d.predictedSellOutTime})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rivalry Meter */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
            <Flame className="w-6 h-6 text-destructive" /> Rivalry Intensity Meter
          </h2>
          <div className="bg-card border-2 border-border rounded-3xl p-6 md:p-10 shadow-sm">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {isRivalryLoading ? (
                 <div className="h-32 bg-muted rounded-xl animate-pulse col-span-full" />
               ) : rivalry?.map((r, i) => (
                 <div key={i} className="flex flex-col gap-4">
                   <div className="flex justify-between items-end mb-2">
                     <div className="font-display font-black text-xl">{r.team1} <span className="text-muted-foreground text-sm mx-2">vs</span> {r.team2}</div>
                     <div className={cn(
                       "px-3 py-1 rounded-md text-xs font-bold uppercase",
                       r.intensityScore > 80 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                     )}>{r.intensity}</div>
                   </div>
                   
                   <div className="relative w-full h-4 bg-muted rounded-full overflow-hidden">
                     <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded-full" style={{ width: `${r.intensityScore}%` }} />
                   </div>
                   
                   <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-xl border border-border">
                     <strong className="text-foreground">Historical:</strong> {r.historicalMeetings} meetings. Last result: {r.lastResult}
                   </p>
                 </div>
               ))}
             </div>
          </div>
        </section>

        {/* Heatmap Placeholder */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" /> Regional Demand Map
          </h2>
          <div className="bg-card border-2 border-border rounded-3xl p-8 relative overflow-hidden min-h-[400px] flex items-center justify-center bg-blue-50/50">
            {/* Map Grid Pattern background */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            {isHeatmapLoading ? (
               <div className="animate-pulse flex items-center justify-center">Loading map data...</div>
            ) : (
               <div className="relative w-full max-w-2xl aspect-video mx-auto">
                 {/* Decorative abstract Saudi map shape outline could go here. For now, nodes. */}
                 {heatmap?.map((city, i) => {
                   // Mock positions just for visual layout since real lat/long is tricky on relative div
                   const positions = [
                     { top: '30%', left: '50%' }, // Riyadh
                     { top: '50%', left: '20%' }, // Jeddah
                     { top: '25%', left: '80%' }, // Dammam
                     { top: '70%', left: '30%' }, // Abha
                     { top: '45%', left: '25%' }, // Makkah
                   ];
                   const pos = positions[i] || { top: '50%', left: '50%' };
                   const size = Math.max(40, (city.demandScore / 100) * 120);
                   
                   return (
                     <div 
                       key={city.city}
                       className="absolute flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 group"
                       style={{ top: pos.top, left: pos.left, width: size, height: size }}
                     >
                       <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                       <div className="absolute inset-2 bg-primary/40 rounded-full backdrop-blur-sm border border-primary/50 flex flex-col items-center justify-center">
                         <span className="font-bold text-[10px] text-primary-foreground hidden group-hover:block transition-opacity drop-shadow-md">{city.city}</span>
                       </div>
                       
                       {/* Hover Info Card */}
                       <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-foreground text-white p-3 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                         <p className="font-bold border-b border-white/20 pb-1 mb-2">{city.city}</p>
                         <p className="text-xs text-white/80 flex justify-between"><span>Demand:</span> <span className="font-bold text-accent">{city.demandScore}/100</span></p>
                         <p className="text-xs text-white/80 flex justify-between mt-1"><span>Top Team:</span> <span className="font-bold">{city.topTeam}</span></p>
                       </div>
                     </div>
                   );
                 })}
               </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
