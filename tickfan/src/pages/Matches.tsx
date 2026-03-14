import { useState } from "react";
import { useGetMatches } from "@workspace/api-client-react";
import { MatchCard } from "@/components/MatchCard";
import { Search, Filter, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const LEAGUES = ["All", "Saudi Pro League", "King Cup", "AFC Champions League"];

export default function Matches() {
  const [activeLeague, setActiveLeague] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: matches, isLoading } = useGetMatches();

  const filteredMatches = matches?.filter(match => {
    const matchesLeague = activeLeague === "All" || match.league === activeLeague;
    const matchesSearch = match.team1Name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          match.team2Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          match.stadium.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLeague && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="font-display font-black text-4xl text-foreground mb-2">Find Matches</h1>
          <p className="text-muted-foreground text-lg">Discover and book tickets for upcoming games.</p>
        </div>
        
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search teams, stadiums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 pl-12 pr-4 py-3 bg-card border-2 border-border rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-card border-2 border-border px-6 py-3 rounded-xl font-bold hover:bg-muted transition-colors">
            <Filter className="w-5 h-5" /> Filters
          </button>
        </div>
      </div>

      {/* League Tabs */}
      <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar">
        {LEAGUES.map(league => (
          <button
            key={league}
            onClick={() => setActiveLeague(league)}
            className={cn(
              "whitespace-nowrap px-6 py-3 rounded-full font-bold transition-all duration-200 border-2",
              activeLeague === league 
                ? "bg-foreground text-background border-foreground shadow-lg" 
                : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            )}
          >
            {league}
          </button>
        ))}
      </div>

      {/* Matches Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-96 bg-card border-2 border-border rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredMatches?.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border-2 border-dashed border-border">
          <CalendarIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="font-display text-2xl font-bold mb-2">No matches found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          <button 
            onClick={() => { setSearchQuery(""); setActiveLeague("All"); }}
            className="mt-6 px-6 py-2 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary/20 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches?.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
