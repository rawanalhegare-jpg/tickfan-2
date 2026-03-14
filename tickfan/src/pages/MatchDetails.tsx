import { useParams } from "wouter";
import { useGetMatch, useGetMatchPrediction, usePurchaseTicket } from "@workspace/api-client-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, ShieldCheck, Ticket, BrainCircuit, Check, X } from "lucide-react";
import { cn, formatSAR } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { getGetTicketsQueryKey } from "@workspace/api-client-react";

export default function MatchDetails() {
  const { id } = useParams();
  const matchId = parseInt(id || "0", 10);
  
  const { data: match, isLoading } = useGetMatch(matchId);
  const { data: prediction } = useGetMatchPrediction(matchId);
  const { mutate: purchaseTicket, isPending: isPurchasing } = usePurchaseTicket();
  
  const queryClient = useQueryClient();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // Countdown logic (simplified)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    if (!match?.date || !match?.time) return;
    const matchDate = new Date(`${match.date}T${match.time}`).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = matchDate - now;
      
      if (distance < 0) {
        clearInterval(interval);
        return;
      }
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [match]);

  if (isLoading) return <div className="h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!match) return <div className="text-center py-20">Match not found.</div>;

  const matchDateTime = new Date(`${match.date}T${match.time}`);
  const activeTierObj = match.ticketTiers.find(t => t.name === selectedTier);

  const handlePurchase = () => {
    if (!selectedTier) return;
    purchaseTicket({
      data: { matchId, tier: selectedTier, quantity }
    }, {
      onSuccess: () => {
        setPurchaseSuccess(true);
        queryClient.invalidateQueries({ queryKey: getGetTicketsQueryKey() });
        setTimeout(() => {
          setShowPurchaseDialog(false);
          setPurchaseSuccess(false);
          setSelectedTier(null);
        }, 2000);
      }
    });
  };

  return (
    <div className="flex flex-col bg-background pb-20">
      {/* Match Header Hero */}
      <div className="relative bg-foreground pt-12 pb-24 overflow-hidden border-b-8 border-primary">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/pattern-bg.png')] bg-cover mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* League Badge */}
          <div className="flex justify-center mb-8">
            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase shadow-xl">
              {match.league}
            </span>
          </div>

          {/* Scoreboard / Teams */}
          <div className="flex items-center justify-between lg:justify-center lg:gap-16">
            <div className="flex flex-col items-center gap-4 w-1/3 lg:w-48">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-3xl bg-white flex items-center justify-center shadow-2xl p-4 transform transition-transform hover:scale-105">
                {match.team1Logo ? <img src={match.team1Logo} alt={match.team1Name} className="w-full h-full object-contain" /> : <div className="font-display font-black text-3xl text-primary">{match.team1Name.substring(0,3)}</div>}
              </div>
              <h2 className="font-display font-black text-xl lg:text-3xl text-white text-center">{match.team1Name}</h2>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="text-white/50 font-bold text-sm lg:text-base mb-2">VS</div>
              <div className="flex gap-2 lg:gap-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl p-3 lg:p-4 text-center min-w-[60px] lg:min-w-[80px]">
                  <div className="font-display font-black text-2xl lg:text-4xl">{timeLeft.days}</div>
                  <div className="text-[10px] lg:text-xs uppercase tracking-wider text-white/70">Days</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl p-3 lg:p-4 text-center min-w-[60px] lg:min-w-[80px]">
                  <div className="font-display font-black text-2xl lg:text-4xl">{timeLeft.hours}</div>
                  <div className="text-[10px] lg:text-xs uppercase tracking-wider text-white/70">Hrs</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl p-3 lg:p-4 text-center min-w-[60px] lg:min-w-[80px] hidden sm:block">
                  <div className="font-display font-black text-2xl lg:text-4xl">{timeLeft.mins}</div>
                  <div className="text-[10px] lg:text-xs uppercase tracking-wider text-white/70">Min</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 w-1/3 lg:w-48">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-3xl bg-white flex items-center justify-center shadow-2xl p-4 transform transition-transform hover:scale-105">
                {match.team2Logo ? <img src={match.team2Logo} alt={match.team2Name} className="w-full h-full object-contain" /> : <div className="font-display font-black text-3xl text-primary">{match.team2Name.substring(0,3)}</div>}
              </div>
              <h2 className="font-display font-black text-xl lg:text-3xl text-white text-center">{match.team2Name}</h2>
            </div>
          </div>

          {/* Match Info Bar */}
          <div className="mt-12 flex flex-wrap justify-center gap-4 lg:gap-8 bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-white font-medium">
              <Calendar className="w-5 h-5 text-accent" />
              {format(matchDateTime, 'EEEE, MMMM do, yyyy')}
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/20" />
            <div className="flex items-center gap-2 text-white font-medium">
              <Clock className="w-5 h-5 text-accent" />
              {format(matchDateTime, 'h:mm a')}
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/20" />
            <div className="flex items-center gap-2 text-white font-medium">
              <MapPin className="w-5 h-5 text-accent" />
              {match.stadium}, {match.city}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        {/* Left Column - Tickets */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h3 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
              <Ticket className="w-6 h-6 text-primary" /> Select Tickets
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {match.ticketTiers.map((tier) => {
                const isSelected = selectedTier === tier.name;
                const isSoldOut = tier.available === 0;
                
                return (
                  <button
                    key={tier.name}
                    disabled={isSoldOut}
                    onClick={() => setSelectedTier(tier.name)}
                    className={cn(
                      "text-left p-6 rounded-2xl border-2 transition-all relative overflow-hidden",
                      isSelected ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-border bg-card hover:border-primary/40",
                      isSoldOut && "opacity-50 cursor-not-allowed grayscale"
                    )}
                  >
                    {isSoldOut && (
                      <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
                        SOLD OUT
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    <h4 className="font-display font-bold text-xl mb-1">{tier.name}</h4>
                    <p className="font-black text-2xl text-primary mb-4">{formatSAR(tier.price)}</p>
                    
                    <ul className="space-y-2 mb-4">
                      {tier.perks.map((perk, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> {perk}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="w-full bg-muted rounded-full h-2 mt-auto">
                      <div 
                        className={cn("h-full rounded-full", isSoldOut ? "bg-destructive" : "bg-primary")} 
                        style={{ width: `${(tier.available / tier.total) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-right mt-1 text-muted-foreground font-medium">
                      {tier.available} left
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Checkout Card */}
          <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-xl sticky top-24">
            <h3 className="font-display text-xl font-bold mb-4 border-b border-border pb-4">Order Summary</h3>
            
            {selectedTier && activeTierObj ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold">{activeTierObj.name} Ticket</span>
                  <span className="font-bold">{formatSAR(activeTierObj.price)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Quantity</span>
                  <div className="flex items-center gap-3 bg-muted rounded-lg p-1">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center bg-card rounded shadow-sm hover:text-primary disabled:opacity-50"
                      disabled={quantity <= 1}
                    >-</button>
                    <span className="font-bold w-4 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="w-8 h-8 flex items-center justify-center bg-card rounded shadow-sm hover:text-primary disabled:opacity-50"
                      disabled={quantity >= activeTierObj.available}
                    >+</button>
                  </div>
                </div>
                
                <div className="border-t border-border pt-4 mt-4 flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-display font-black text-2xl text-primary">{formatSAR(activeTierObj.price * quantity)}</span>
                </div>
                
                <button 
                  onClick={() => setShowPurchaseDialog(true)}
                  className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl mt-4 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2"
                >
                  <Ticket className="w-5 h-5" /> Buy Now
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                <Ticket className="w-12 h-12 opacity-20 mb-2" />
                <p>Select a ticket tier to continue</p>
              </div>
            )}
            
            <div className="mt-6 bg-muted/50 p-4 rounded-xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
              <p className="text-xs text-muted-foreground">All tickets are secured by TickFan verified Fan ID protocol. Scalping is strictly prohibited.</p>
            </div>
          </div>

          {/* AI Prediction */}
          {prediction && (
            <div className="bg-gradient-to-br from-foreground to-foreground/90 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <BrainCircuit className="w-24 h-24" />
              </div>
              <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2 text-accent">
                <BrainCircuit className="w-5 h-5" /> AI Prediction
              </h3>
              
              <div className="flex h-3 rounded-full overflow-hidden mb-2">
                <div className="bg-primary" style={{ width: `${prediction.team1Win}%` }} />
                <div className="bg-muted" style={{ width: `${prediction.draw}%` }} />
                <div className="bg-accent" style={{ width: `${prediction.team2Win}%` }} />
              </div>
              <div className="flex justify-between text-xs font-bold mb-4 opacity-80">
                <span>{match.team1Name.substring(0,3)} {prediction.team1Win}%</span>
                <span>Draw {prediction.draw}%</span>
                <span>{match.team2Name.substring(0,3)} {prediction.team2Win}%</span>
              </div>
              
              <p className="text-sm leading-relaxed text-white/90 italic mb-4">"{prediction.insight}"</p>
              
              <div className="space-y-2">
                {prediction.keyFactors.map((factor, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-white/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1 shrink-0" /> {factor}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Purchase Dialog */}
      <AnimatePresence>
        {showPurchaseDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-border"
            >
              {purchaseSuccess ? (
                <div className="p-8 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2">Purchase Successful!</h3>
                  <p className="text-muted-foreground mb-6">Your tickets have been added to your Fan Dashboard.</p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                    <h3 className="font-display text-xl font-bold">Confirm Purchase</h3>
                    <button onClick={() => setShowPurchaseDialog(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl bg-muted border border-border flex items-center justify-center">
                        <Ticket className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{match.team1Name} vs {match.team2Name}</p>
                        <p className="text-muted-foreground text-sm">{format(matchDateTime, 'MMM do')} • {selectedTier} Tier</p>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-xl space-y-2 mt-4">
                      <div className="flex justify-between text-sm">
                        <span>Price per ticket</span>
                        <span>{formatSAR(activeTierObj?.price || 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Quantity</span>
                        <span>x{quantity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Fees (5%)</span>
                        <span>{formatSAR((activeTierObj?.price || 0) * quantity * 0.05)}</span>
                      </div>
                      <div className="border-t border-border pt-2 mt-2 flex justify-between font-bold text-lg">
                        <span>Total Pay</span>
                        <span className="text-primary">{formatSAR((activeTierObj?.price || 0) * quantity * 1.05)}</span>
                      </div>
                    </div>

                    <button 
                      onClick={handlePurchase}
                      disabled={isPurchasing}
                      className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl mt-4 hover:bg-primary/90 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isPurchasing ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        `Pay ${formatSAR((activeTierObj?.price || 0) * quantity * 1.05)}`
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
