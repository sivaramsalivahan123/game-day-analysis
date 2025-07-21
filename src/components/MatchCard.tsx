import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Cloud, Sun, CloudRain, Users, DollarSign, Clock, History } from "lucide-react";
import { analyzeMatch } from "@/lib/ai-analysis";
import { useState, useEffect } from "react";

interface TeamHistory {
  recentWins: number;
  recentLosses: number;
  headToHeadWins: number;
  headToHeadLosses: number;
  averageScore: number;
  lastMatchResult: 'win' | 'loss' | 'draw';
}

interface SocialSentiment {
  positive: number;
  negative: number;
  neutral: number;
  overallScore: number;
  totalMentions: number;
  trending: boolean;
}

export interface Match {
  id: number;
  playerA: string;
  playerB: string;
  betAmount?: number;
  odds: number;
  playerAStatus: 'well' | 'injured' | 'uncertain';
  playerBStatus: 'well' | 'injured' | 'uncertain';
  teamStatus: 'strong' | 'average' | 'weak';
  weather: 'sunny' | 'cloudy' | 'rainy';
  optedIn: boolean;
  sport: string;
  startTime: string;
  winProbability?: number;
  teamAHistory?: TeamHistory;
  teamBHistory?: TeamHistory;
  socialSentiment?: {
    teamA: SocialSentiment;
    teamB: SocialSentiment;
  };
}

interface MatchCardProps {
  match: Match;
  showAnalysis: boolean;
  onBetClick: (matchId: number) => void;
  onHistoryClick?: (matchId: number) => void;
}

const statusColors = {
  well: 'success',
  injured: 'destructive', 
  uncertain: 'warning'
} as const;

const teamColors = {
  strong: 'success',
  average: 'warning',
  weak: 'destructive'
} as const;

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain
};

const getAnalysisMessage = (match: Match) => {
  if (match.optedIn) {
    const positiveFactors = [];
    if (match.playerAStatus === 'well') positiveFactors.push(`${match.playerA} is in excellent form`);
    if (match.playerBStatus === 'injured') positiveFactors.push(`${match.playerB} has injury concerns`);
    if (match.teamStatus === 'strong') positiveFactors.push('team is performing strongly');
    if (match.weather === 'sunny') positiveFactors.push('perfect weather conditions');
    
    return `🎯 Looking great! ${positiveFactors.slice(0, 2).join(' and ')}. Your ${match.odds}x odds bet has strong potential!`;
  } else {
    const excitement = [
      `🔥 Hot match alert! ${match.playerA} vs ${match.playerB} has ${match.odds}x odds`,
      `⚡ Don't miss out! Perfect conditions for a ${match.odds}x return`,
      `🚀 Last chance! This ${match.sport} match could be your biggest win`,
      `💎 Premium opportunity with ${match.odds}x multiplier available`
    ];
    return excitement[Math.floor(Math.random() * excitement.length)];
  }
};

export function MatchCard({ match, showAnalysis, onBetClick, onHistoryClick }: MatchCardProps) {
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const WeatherIcon = weatherIcons[match.weather];

  useEffect(() => {
    if (showAnalysis) {
      setIsLoadingAI(true);
      analyzeMatch(match).then((analysis) => {
        setAiAnalysis(analysis);
        setIsLoadingAI(false);
      }).catch(() => {
        setAiAnalysis(getAnalysisMessage(match));
        setIsLoadingAI(false);
      });
    }
  }, [showAnalysis, match]);
  
  return (
    <Card className={`
      bg-gradient-card shadow-card hover:shadow-primary transition-all duration-300 hover:scale-[1.02] 
      border-border hover:border-primary/40 overflow-hidden relative group animate-fade-in
      ${match.optedIn ? '/20' : ''}
    `}>
      {match.optedIn && (
        <div className="absolute top-0 right-0 bg-gradient-primary text-primary-foreground px-3 py-1 text-xs font-medium">
          OPTED IN
        </div>
      )}
      
      {match.winProbability && match.winProbability > 75 && (
  <div className="absolute top-0 left-0 bg-accent text-accent-foreground px-3 py-1 text-xs font-medium z-10 rounded-br-md">
    High Win Probability
  </div>
)}
  <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-muted/50">
              {match.sport}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {match.startTime}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <WeatherIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs capitalize text-muted-foreground">{match.weather}</span>
          </div>
        </div>
        
        <div className="text-center py-2">
          <h3 className="text-lg font-bold text-foreground">
            {match.playerA} <span className="text-muted-foreground">vs</span> {match.playerB}
          </h3>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Player Status</h4>
            <div className="space-y-1">
              <Badge variant={statusColors[match.playerAStatus]} className="w-full justify-center text-xs">
                {match.playerA}: {match.playerAStatus}
              </Badge>
              <Badge variant={statusColors[match.playerBStatus]} className="w-full justify-center text-xs">
                {match.playerB}: {match.playerBStatus}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Match Info</h4>
            <div className="space-y-1">
              <Badge variant={teamColors[match.teamStatus]} className="w-full justify-center text-xs">
                <Users className="h-3 w-3 mr-1" />
                Team: {match.teamStatus}
              </Badge>
              <div className="flex items-center justify-center gap-1 text-odds font-bold">
                <TrendingUp className="h-3 w-3" />
                <span className="text-sm">{match.odds}x odds</span>
              </div>
            </div>
          </div>
        </div>

        {match.optedIn && match.betAmount && (
          <div className="bg-muted/20 rounded-lg p-3 border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Your Bet</span>
              <div className="flex items-center gap-1 text-primary font-semibold">
                <DollarSign className="h-4 w-4" />
                <span>${match.betAmount}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-muted-foreground">Potential Win</span>
              <span className="text-accent font-bold">${(match.betAmount * match.odds).toFixed(2)}</span>
            </div>
          </div>
        )}

        {showAnalysis && (
          <div className={`
            rounded-lg p-3 border-l-4 animate-scale-in
            ${match.optedIn 
              ? 'bg-success/10 border-l-success text-success-foreground' 
              : 'bg-accent/10 border-l-accent text-accent-foreground'
            }
          `}>
            {isLoadingAI ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                AI analyzing match data...
              </div>
            ) : (
              <p className="text-sm font-medium leading-relaxed">
                {aiAnalysis || getAnalysisMessage(match)}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onHistoryClick?.(match.id)}
            className="flex-1"
          >
            <History className="h-4 w-4" />
            View History
          </Button>
          
          {!match.optedIn && (
            <Button 
              variant="bet" 
              className="flex-1" 
              onClick={() => onBetClick(match.id)}
            >
              <TrendingUp className="h-4 w-4" />
              Place Bet ({match.odds}x)
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}