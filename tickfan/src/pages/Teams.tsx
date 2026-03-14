import { useGetTeams } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ShieldCheck, MapPin, Users } from "lucide-react";

export default function Teams() {
  const { data: teams, isLoading } = useGetTeams();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="font-display font-black text-4xl text-foreground mb-4">Saudi Pro League Teams</h1>
        <p className="text-muted-foreground text-lg">Follow your favorite clubs, track their performance, and never miss a match.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 bg-card rounded-3xl animate-pulse border border-border" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teams?.map(team => (
            <Link key={team.id} href={`/teams/${team.id}`} className="group relative overflow-hidden bg-card rounded-3xl border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block">
              <div 
                className="h-24 w-full opacity-20 transition-opacity group-hover:opacity-40" 
                style={{ backgroundColor: team.primaryColor || '#006C35' }}
              />
              
              <div className="px-6 pb-6 pt-0 relative flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-card shadow-lg flex items-center justify-center p-3 -mt-12 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {team.logo ? (
                    <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
                  ) : (
                    <ShieldCheck className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                
                <h3 className="font-display font-black text-xl mb-1 text-center">{team.name}</h3>
                <p className="flex items-center gap-1 text-sm text-muted-foreground mb-4"><MapPin className="w-3 h-3" /> {team.city}</p>
                
                <div className="w-full bg-muted rounded-xl p-3 flex justify-between items-center mt-auto">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <Users className="w-4 h-4 text-primary" /> Verified Fans
                  </div>
                  <span className="font-bold text-sm bg-background px-2 py-1 rounded-md border border-border">{team.fanCount.toLocaleString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
