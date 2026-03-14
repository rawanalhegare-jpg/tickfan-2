import { useGetMatches, useGetTeams, useGetNews } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ArrowRight, Trophy, TrendingUp, ShieldCheck, Newspaper, ShieldAlert, Calendar } from "lucide-react";
import { MatchCard } from "@/components/MatchCard";
import { motion } from "framer-motion";
import { formatSAR } from "@/lib/utils";

export default function Home() {
  const { data: matches, isLoading: matchesLoading } = useGetMatches();
  const { data: teams, isLoading: teamsLoading } = useGetTeams();
  const { data: news, isLoading: newsLoading } = useGetNews();

  const featuredMatch = matches?.find(m => m.isFeatured) || matches?.[0];
  const upcomingMatches = matches?.filter(m => !m.isFeatured).slice(0, 3);
  const trendingMatches = matches?.filter(m => m.isTrending).slice(0, 2);

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-foreground">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Saudi stadium abstract background" 
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/50 to-background" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm mb-6">
              <Trophy className="w-4 h-4 text-accent" /> Official Saudi Football Fan Platform
            </span>
            <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-6 uppercase drop-shadow-2xl">
              Your Gateway to the <br/>
              <span className="text-gradient-gold">Saudi Football</span> Experience
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-medium">
              Secure authentic tickets, track match demand, and join the kingdom's largest verified fan community.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/matches" 
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300"
              >
                Find Tickets Now
              </Link>
              <Link 
                href="/fan-id" 
                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5 text-accent" /> Register Fan ID
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Match */}
      {featuredMatch && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <MatchCard match={featuredMatch} featured />
          </motion.div>
        </section>
      )}

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Upcoming Matches */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-3xl font-bold flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" /> Upcoming Matches
            </h2>
            <Link href="/matches" className="text-primary font-bold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {matchesLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded-3xl animate-pulse" />
              ))
            ) : upcomingMatches?.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>

          {/* Marketplace Teaser */}
          <div className="mt-12 bg-gradient-to-br from-primary to-emerald-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-primary/20">
            <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern-bg.png')] bg-cover mix-blend-screen" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block border border-white/30">Verified Resale</span>
                <h3 className="font-display text-3xl font-black mb-2">Fan Marketplace</h3>
                <p className="text-white/80 max-w-md">Can't make it to the game? Securely resell your tickets to verified fans or find last-minute seats to sold-out matches.</p>
              </div>
              <Link href="/marketplace" className="shrink-0 bg-white text-primary px-8 py-4 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform duration-200">
                Explore Marketplace
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Trending & Intelligence */}
        <div className="space-y-12">
          {/* Trending Demand */}
          <div>
            <h2 className="font-display text-2xl font-bold flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-accent" /> High Demand
            </h2>
            <div className="space-y-4">
              {trendingMatches?.map(match => (
                <Link key={match.id} href={`/matches/${match.id}`} className="block group">
                  <div className="bg-card border-2 border-border p-4 rounded-2xl group-hover:border-accent group-hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold bg-accent/10 text-accent px-2 py-1 rounded-md">Selling Fast</span>
                      <span className="font-bold text-sm">{formatSAR(match.priceFrom)}</span>
                    </div>
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors">{match.team1Name} vs {match.team2Name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{match.date} • {match.stadium}</p>
                  </div>
                </Link>
              ))}
              <Link href="/intelligence" className="block text-center py-3 rounded-xl border-2 border-dashed border-border text-muted-foreground font-bold hover:bg-muted transition-colors">
                View Fan Intelligence Map
              </Link>
            </div>
          </div>

          {/* Popular Teams */}
          <div>
            <h2 className="font-display text-2xl font-bold flex items-center gap-3 mb-6">
              <ShieldCheck className="w-6 h-6 text-primary" /> Popular Teams
            </h2>
            <div className="flex flex-col gap-3">
              {teamsLoading ? (
                Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)
              ) : teams?.slice(0, 4).map((team) => (
                <Link key={team.id} href={`/teams/${team.id}`} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border hover:border-primary hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center p-1">
                      {team.logo ? <img src={team.logo} alt={team.name} className="w-full h-full object-contain" /> : <div className="w-full h-full bg-primary rounded-full" />}
                    </div>
                    <span className="font-bold group-hover:text-primary transition-colors">{team.name}</span>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">{team.fanCount.toLocaleString()} Fans</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sports News Section */}
      <section className="bg-muted py-16 mt-8 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl font-bold flex items-center gap-3">
              <Newspaper className="w-8 h-8 text-primary" /> Latest News
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsLoading ? (
              Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-64 bg-card rounded-2xl animate-pulse" />)
            ) : news?.slice(0, 3).map((article) => (
              <a key={article.id} href="#" className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col">
                <div className="h-40 bg-gray-300 relative overflow-hidden">
                   {/* Unsplash fallback for news images since they aren't generated artifacts */}
                   {/* saudi football match fans stadium */}
                   <img src="https://pixabay.com/get/gd8ff63a9debb333012e841e949144214de3c7a2c7e557d21d95a7cc9b3a04badbeb6d94f85192acbe22a647c74172feefea697cf71e7f0f520d5b9bb9d7c56f1_1280.jpg" alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                     {article.category}
                   </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-xs text-muted-foreground mb-2">{new Date(article.publishedAt).toLocaleDateString()} • {article.source}</p>
                  <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-auto">{article.summary}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
