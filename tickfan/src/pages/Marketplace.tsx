import { useGetMarketplaceListings } from "@workspace/api-client-react";
import { Ticket, ShieldCheck, AlertTriangle, ArrowRight } from "lucide-react";
import { formatSAR, cn } from "@/lib/utils";
import { format } from "date-fns";

export default function Marketplace() {
  const { data: listings, isLoading } = useGetMarketplaceListings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="mb-12">
        <h1 className="font-display font-black text-4xl text-foreground mb-4">Fan Marketplace</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">Buy and sell authentic tickets securely. Every listing is verified against our Fan ID database to ensure fair pricing and prevent scalping.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-card rounded-2xl animate-pulse border border-border" />
          ))}
        </div>
      ) : (
        <div className="bg-card border-2 border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground font-semibold uppercase tracking-wider text-xs border-b border-border">
                <tr>
                  <th className="px-6 py-4">Match</th>
                  <th className="px-6 py-4">Seat Section</th>
                  <th className="px-6 py-4">Seller</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {listings?.map(listing => (
                  <tr key={listing.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground">{listing.matchName}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(listing.matchDate), 'MMM do, yyyy')} • {listing.stadium}</p>
                    </td>
                    <td className="px-6 py-4 font-medium">{listing.seatSection}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{listing.sellerName}</p>
                      <p className="text-xs text-accent flex items-center gap-1">★ {listing.sellerRating.toFixed(1)} Rating</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-lg text-primary">{formatSAR(listing.price)}</p>
                      {listing.price > listing.originalPrice && (
                         <p className="text-[10px] text-muted-foreground">Original: {formatSAR(listing.originalPrice)}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold",
                        listing.verificationStatus === 'Verified' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      )}>
                        {listing.verificationStatus === 'Verified' ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {listing.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center justify-center px-4 py-2 bg-foreground text-background font-bold rounded-lg hover:bg-primary hover:text-white transition-colors">
                        Buy Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
