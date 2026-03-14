import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Components
import { Layout } from "@/components/Layout";

// Pages
import Home from "@/pages/Home";
import Matches from "@/pages/Matches";
import MatchDetails from "@/pages/MatchDetails";
import Teams from "@/pages/Teams";
import Dashboard from "@/pages/Dashboard";
import Marketplace from "@/pages/Marketplace";
import Intelligence from "@/pages/Intelligence";
import FanId from "@/pages/FanId";
import StadiumEntry from "@/pages/StadiumEntry";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/matches" component={Matches} />
        <Route path="/matches/:id" component={MatchDetails} />
        <Route path="/teams" component={Teams} />
        <Route path="/marketplace" component={Marketplace} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/intelligence" component={Intelligence} />
        <Route path="/fan-id" component={FanId} />
        <Route path="/stadium-entry" component={StadiumEntry} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
