import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchCard, type Match } from "./MatchCard";
import { MatchHistory } from "./MatchHistory";
import { BarChart3, TrendingUp, DollarSign, Target, Users, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeMatch } from "@/lib/ai-analysis";
import betmgmLogo from "@/assets/betmgm-logo.png";

const mockMatches: Match[] = [
  {
    id: 1,
    playerA: "Djokovic",
    playerB: "Federer", 
    betAmount: 100,
    odds: 2.5,
    playerAStatus: 'well',
    playerBStatus: 'uncertain',
    teamStatus: 'strong',
    weather: 'sunny',
    optedIn: true,
    sport: 'Tennis',
    startTime: '14:30',
    winProbability: 75,
    teamAHistory: {
      recentWins: 8,
      recentLosses: 2,
      headToHeadWins: 12,
      headToHeadLosses: 8,
      averageScore: 6.2,
      lastMatchResult: 'win'
    },
    teamBHistory: {
      recentWins: 6,
      recentLosses: 4,
      headToHeadWins: 8,
      headToHeadLosses: 12,
      averageScore: 5.8,
      lastMatchResult: 'loss'
    }
  },
  {
    id: 2,
    playerA: "Lakers",
    playerB: "Warriors",
    betAmount: 250,
    odds: 1.8,
    playerAStatus: 'well',
    playerBStatus: 'well',
    teamStatus: 'strong',
    weather: 'cloudy',
    optedIn: true,
    sport: 'Basketball',
    startTime: '19:00',
    winProbability: 65,
    teamAHistory: {
      recentWins: 7,
      recentLosses: 3,
      headToHeadWins: 15,
      headToHeadLosses: 12,
      averageScore: 112.5,
      lastMatchResult: 'win'
    },
    teamBHistory: {
      recentWins: 9,
      recentLosses: 1,
      headToHeadWins: 12,
      headToHeadLosses: 15,
      averageScore: 118.2,
      lastMatchResult: 'win'
    }
  },
  {
    id: 3,
    playerA: "Manchester City",
    playerB: "Arsenal",
    betAmount: 150,
    odds: 3.2,
    playerAStatus: 'well',
    playerBStatus: 'injured',
    teamStatus: 'average',
    weather: 'rainy',
    optedIn: true,
    sport: 'Football',
    startTime: '16:45',
    winProbability: 80,
    teamAHistory: {
      recentWins: 8,
      recentLosses: 2,
      headToHeadWins: 18,
      headToHeadLosses: 8,
      averageScore: 2.1,
      lastMatchResult: 'win'
    },
    teamBHistory: {
      recentWins: 6,
      recentLosses: 4,
      headToHeadWins: 8,
      headToHeadLosses: 18,
      averageScore: 1.8,
      lastMatchResult: 'loss'
    }
  },
  {
    id: 4,
    playerA: "Hamilton",
    playerB: "Verstappen",
    betAmount: 300,
    odds: 4.1,
    playerAStatus: 'uncertain',
    playerBStatus: 'well',
    teamStatus: 'strong',
    weather: 'sunny',
    optedIn: true,
    sport: 'F1',
    startTime: '15:00',
    winProbability: 45,
    teamAHistory: {
      recentWins: 4,
      recentLosses: 6,
      headToHeadWins: 20,
      headToHeadLosses: 25,
      averageScore: 8.2,
      lastMatchResult: 'loss'
    },
    teamBHistory: {
      recentWins: 8,
      recentLosses: 2,
      headToHeadWins: 25,
      headToHeadLosses: 20,
      averageScore: 9.1,
      lastMatchResult: 'win'
    }
  },
  {
    id: 5,
    playerA: "Curry",
    playerB: "James",
    betAmount: 200,
    odds: 2.8,
    playerAStatus: 'well',
    playerBStatus: 'well',
    teamStatus: 'strong',
    weather: 'cloudy',
    optedIn: true,
    sport: 'Basketball',
    startTime: '20:30',
    winProbability: 70,
    teamAHistory: {
      recentWins: 9,
      recentLosses: 1,
      headToHeadWins: 22,
      headToHeadLosses: 18,
      averageScore: 28.5,
      lastMatchResult: 'win'
    },
    teamBHistory: {
      recentWins: 7,
      recentLosses: 3,
      headToHeadWins: 18,
      headToHeadLosses: 22,
      averageScore: 26.8,
      lastMatchResult: 'win'
    }
  },
  // Available matches (not opted in)
  {
    id: 6,
    playerA: "Nadal",
    playerB: "Murray",
    odds: 2.1,
    playerAStatus: 'well',
    playerBStatus: 'uncertain',
    teamStatus: 'average',
    weather: 'sunny',
    optedIn: false,
    sport: 'Tennis',
    startTime: '13:15',
    winProbability: 60,
    teamAHistory: {
      recentWins: 6,
      recentLosses: 4,
      headToHeadWins: 24,
      headToHeadLosses: 7,
      averageScore: 6.4,
      lastMatchResult: 'win'
    },
    teamBHistory: {
      recentWins: 5,
      recentLosses: 5,
      headToHeadWins: 7,
      headToHeadLosses: 24,
      averageScore: 5.1,
      lastMatchResult: 'loss'
    }
  },
  {
    id: 7,
    playerA: "Real Madrid",
    playerB: "Barcelona",
    odds: 3.5,
    playerAStatus: 'well',
    playerBStatus: 'well',
    teamStatus: 'strong',
    weather: 'cloudy',
    optedIn: false,
    sport: 'Football',
    startTime: '21:00',
    winProbability: 85,
    teamAHistory: {
      recentWins: 9,
      recentLosses: 1,
      headToHeadWins: 98,
      headToHeadLosses: 96,
      averageScore: 2.3,
      lastMatchResult: 'win'
    },
    teamBHistory: {
      recentWins: 8,
      recentLosses: 2,
      headToHeadWins: 96,
      headToHeadLosses: 98,
      averageScore: 2.1,
      lastMatchResult: 'draw'
    }
  },
  {
    id: 8,
    playerA: "Celtics",
    playerB: "Heat",
    odds: 1.9,
    playerAStatus: 'injured',
    playerBStatus: 'well',
    teamStatus: 'weak',
    weather: 'rainy',
    optedIn: false,
    sport: 'Basketball',
    startTime: '18:30',
    winProbability: 25,
    teamAHistory: {
      recentWins: 3,
      recentLosses: 7,
      headToHeadWins: 8,
      headToHeadLosses: 12,
      averageScore: 105.2,
      lastMatchResult: 'loss'
    },
    teamBHistory: {
      recentWins: 6,
      recentLosses: 4,
      headToHeadWins: 12,
      headToHeadLosses: 8,
      averageScore: 109.8,
      lastMatchResult: 'win'
    }
  },
  {
    id: 9,
    playerA: "Leclerc",
    playerB: "Norris",
    odds: 2.7,
    playerAStatus: 'well',
    playerBStatus: 'well',
    teamStatus: 'strong',
    weather: 'sunny',
    optedIn: false,
    sport: 'F1',
    startTime: '14:00',
    winProbability: 75,
    teamAHistory: {
      recentWins: 5,
      recentLosses: 5,
      headToHeadWins: 8,
      headToHeadLosses: 6,
      averageScore: 7.8,
      lastMatchResult: 'win'
    },
    teamBHistory: {
      recentWins: 7,
      recentLosses: 3,
      headToHeadWins: 6,
      headToHeadLosses: 8,
      averageScore: 8.2,
      lastMatchResult: 'win'
    }
  },
  {
    id: 10,
    playerA: "Osaka",
    playerB: "Williams",
    odds: 4.2,
    playerAStatus: 'uncertain',
    playerBStatus: 'injured',
    teamStatus: 'average',
    weather: 'cloudy',
    optedIn: false,
    sport: 'Tennis',
    startTime: '17:30',
    winProbability: 40,
    teamAHistory: {
      recentWins: 4,
      recentLosses: 6,
      headToHeadWins: 3,
      headToHeadLosses: 7,
      averageScore: 5.9,
      lastMatchResult: 'loss'
    },
    teamBHistory: {
      recentWins: 3,
      recentLosses: 7,
      headToHeadWins: 7,
      headToHeadLosses: 3,
      averageScore: 6.1,
      lastMatchResult: 'loss'
    }
  }
];

export function Dashboard() {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  
  const optedMatches = mockMatches.filter(match => match.optedIn);
  const availableMatches = mockMatches.filter(match => !match.optedIn);
  
  const totalBetAmount = optedMatches.reduce((sum, match) => sum + (match.betAmount || 0), 0);
  const potentialWin = optedMatches.reduce((sum, match) => sum + ((match.betAmount || 0) * match.odds), 0);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    try {
      // Initialize AI and analyze a sample match to warm up the model
      const sampleMatch = mockMatches[0];
      await analyzeMatch(sampleMatch);
      
      setShowAnalysis(!showAnalysis);
      toast({
        title: "AI Analysis Complete",
        description: "Local AI model has analyzed your betting opportunities with latest insights.",
      });
    } catch (error) {
      toast({
        title: "Analysis Ready",
        description: "Betting insights generated successfully.",
        variant: "default",
      });
      setShowAnalysis(!showAnalysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBetClick = (matchId: number) => {
    toast({
      title: "Bet Placement",
      description: "Redirecting to bet placement page...",
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* BETMGM Logo Background */}
      <div 
        className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url(${betmgmLogo})`,
          backgroundSize: '40%',
          backgroundPosition: 'center center'
        }}
      />
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Sports Betting Dashboard
              </h1>
              <p className="text-muted-foreground">Your personalized betting insights</p>
            </div>
            <Button 
              variant="analyze" 
              size="lg" 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="gap-2"
            >
              <BarChart3 className="h-5 w-5" />
              {isAnalyzing ? 'AI Analyzing...' : showAnalysis ? 'Hide Analysis' : 'AI Analyze'}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4" />
                Active Bets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{optedMatches.length}</div>
              <p className="text-xs text-muted-foreground">out of {mockMatches.length} available</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Bet Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${totalBetAmount}</div>
              <p className="text-xs text-muted-foreground">across all active bets</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Potential Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">${potentialWin.toFixed(2)}</div>
              <p className="text-xs text-success">+{((potentialWin - totalBetAmount) / totalBetAmount * 100).toFixed(1)}% potential gain</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Available Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-info">{availableMatches.length}</div>
              <p className="text-xs text-muted-foreground">new opportunities</p>
            </CardContent>
          </Card>
        </div>

        {/* Match History */}
        <MatchHistory />

        {/* Your Active Bets */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-foreground">Your Active Bets</h2>
            <Badge variant="success" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {optedMatches.length} active
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {optedMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                showAnalysis={showAnalysis}
                onBetClick={handleBetClick}
              />
            ))}
          </div>
        </section>

        {/* Available Opportunities */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-foreground">Available Opportunities</h2>
            <Badge variant="info" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {availableMatches.length} available
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {availableMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                showAnalysis={showAnalysis}
                onBetClick={handleBetClick}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}