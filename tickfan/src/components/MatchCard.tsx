import { Link } from "wouter";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Trophy, ArrowRight } from "lucide-react";
import { cn, formatSAR } from "@/lib/utils";
import type { Match } from "@workspace/api-client-react";

export function MatchCard({ match, featured = false }: { match: Match; featured?: boolean }) {
  const matchDate = new Date(`${match.date}T${match.time}`);

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-3xl bg-card border-2 transition-all duration-300",
      featured ? "border-primary shadow-xl shadow-primary/20 md:flex" : "border-border hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 flex flex-col"
    )}>
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 left-4 z-10 bg-accent text-accent-foreground text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
          <Trophy className="w-3 h-3" /> Featured Match
        </div>
      )}

      {/* Stadium/Location Image Area (Abstracted to pattern for now) */}
      <div className={cn(
        "relative bg-muted overflow-hidden",
        featured ? "w-full md:w-2/5 md:min-h-full min-h-[200px]" : "h-32 w-full"
      )}>
        <div className="absolute inset-0 opacity-20 bg-[url('/images/pattern-bg.png')] bg-cover mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
          <div>
            <p className="font-semibold flex items-center gap-1 text-sm"><MapPin className="w-3 h-3" /> {match.stadium}</p>
            <p className="text-white/80 text-xs">{match.city}</p>
          </div>
          <span className="bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold">{match.league}</span>
        </div>
      </div>

      {/* Content */}
      <div className={cn("p-6 flex flex-col flex-1", featured ? "md:w-3/5" : "")}>
        {/* Teams Matchup */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col items-center gap-2 w-2/5">
            <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center shadow-inner overflow-hidden">
              {match.team1Logo ? (
                <img src={match.team1Logo} alt={match.team1Name} className="w-10 h-10 object-contain" />
              ) : (
                <span className="font-display font-black text-xl text-muted-foreground">{match.team1Name.substring(0, 3)}</span>
              )}
            </div>
            <span className="font-bold text-center text-sm">{match.team1Name}</span>
          </div>

          <div className="flex flex-col items-center justify-center w-1/5">
            <div className="bg-muted px-3 py-1 rounded-full text-xs font-bold text-muted-foreground mb-1">VS</div>
          </div>

          <div className="flex flex-col items-center gap-2 w-2/5">
            <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center shadow-inner overflow-hidden">
              {match.team2Logo ? (
                <img src={match.team2Logo} alt={match.team2Name} className="w-10 h-10 object-contain" />
              ) : (
                <span className="font-display font-black text-xl text-muted-foreground">{match.team2Name.substring(0, 3)}</span>
              )}
            </div>
            <span className="font-bold text-center text-sm">{match.team2Name}</span>
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-4 bg-muted/50 p-3 rounded-xl mb-6">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Calendar className="w-4 h-4 text-primary" />
            {format(matchDate, 'MMM do, yyyy')}
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Clock className="w-4 h-4 text-primary" />
            {format(matchDate, 'h:mm a')}
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Tickets from</p>
            <p className="font-display font-black text-xl text-foreground">{formatSAR(match.priceFrom)}</p>
          </div>
          <Link
            href={`/matches/${match.id}`}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Tickets <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
