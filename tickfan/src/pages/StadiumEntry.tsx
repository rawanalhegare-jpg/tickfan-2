import { useState } from "react";
import { useSimulateStadiumEntry } from "@workspace/api-client-react";
import { QrCode, ShieldCheck, ShieldAlert, ArrowRight, ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function StadiumEntry() {
  const [ticketId, setTicketId] = useState("");
  const [fanId, setFanId] = useState("");
  
  const { mutate: simulateEntry, data: result, isPending, reset } = useSimulateStadiumEntry();

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId || !fanId) return;
    simulateEntry({ data: { ticketId, fanId } });
  };

  const handleReset = () => {
    setTicketId("");
    setFanId("");
    reset();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-center mb-10">
        <h1 className="font-display font-black text-3xl md:text-4xl mb-4">Stadium Entry Simulator</h1>
        <p className="text-muted-foreground">Test the TickFan biometric and QR entry system. Scan a ticket and Fan ID to verify access.</p>
      </div>

      <div className="w-full bg-card rounded-3xl border-2 border-border shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary" />
        
        <div className="p-8">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleScan} 
                className="space-y-6"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 relative">
                    <ScanLine className="w-10 h-10 text-primary" />
                    {isPending && <div className="absolute inset-0 rounded-full border-b-2 border-primary animate-spin" />}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Ticket QR Code (ID)</label>
                    <input 
                      type="text" 
                      required
                      value={ticketId}
                      onChange={e => setTicketId(e.target.value)}
                      placeholder="e.g. TKT-89231"
                      className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Fan ID Number</label>
                    <input 
                      type="text" 
                      required
                      value={fanId}
                      onChange={e => setFanId(e.target.value)}
                      placeholder="e.g. FAN-10293"
                      className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary font-mono"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isPending || !ticketId || !fanId}
                  className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isPending ? "Verifying..." : "Simulate Scan"}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className={cn(
                  "w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-xl",
                  result.allowed ? "bg-green-500 text-white shadow-green-500/30" : "bg-destructive text-white shadow-destructive/30"
                )}>
                  {result.allowed ? <ShieldCheck className="w-12 h-12" /> : <ShieldAlert className="w-12 h-12" />}
                </div>
                
                <h2 className={cn("font-display font-black text-3xl mb-2", result.allowed ? "text-green-600" : "text-destructive")}>
                  {result.allowed ? "ACCESS GRANTED" : "ACCESS DENIED"}
                </h2>
                <p className="text-muted-foreground text-lg mb-8">{result.message}</p>
                
                {result.allowed && (
                  <div className="bg-muted rounded-2xl p-6 text-left space-y-4 mb-8">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase">Fan Name</p>
                        <p className="font-bold text-foreground">{result.fanName}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase">Assigned Gate</p>
                        <p className="font-display font-black text-2xl text-primary">{result.gate}</p>
                      </div>
                      <div className="col-span-2 border-t border-border pt-4">
                        <p className="text-xs font-bold text-muted-foreground uppercase">Seat</p>
                        <p className="font-bold text-foreground">{result.seat}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={handleReset}
                  className="bg-muted text-foreground font-bold px-8 py-3 rounded-xl hover:bg-border transition-colors"
                >
                  Scan Next Person
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
