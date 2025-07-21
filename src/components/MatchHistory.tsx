import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Minus, DollarSign, TrendingUp, TrendingDown, Clock } from "lucide-react";

interface HistoryMatch {
  id: number;
  playerA: string;
  playerB: string;
  betAmount: number;
  odds: number;
  result: 'win' | 'loss' | 'push';
  actualOdds: number;
  sport: string;
  date: string;
  payout: number;
  winnerA: boolean;
}

const mockHistoryMatches: HistoryMatch[] = [
  {
    id: 1,
    playerA: "Djokovic",
    playerB: "Alcaraz",
    betAmount: 150,
    odds: 2.3,
    result: 'win',
    actualOdds: 2.3,
    sport: 'Tennis',
    date: '2024-07-19',
    payout: 345,
    winnerA: true
  },
  {
    id: 2,
    playerA: "Warriors",
    playerB: "Lakers",
    betAmount: 200,
    odds: 1.8,
    result: 'loss',
    actualOdds: 1.8,
    sport: 'Basketball',
    date: '2024-07-18',
    payout: 0,
    winnerA: false
  },
  {
    id: 3,
    playerA: "Liverpool",
    playerB: "Chelsea",
    betAmount: 100,
    odds: 2.1,
    result: 'win',
    actualOdds: 2.1,
    sport: 'Football',
    date: '2024-07-17',
    payout: 210,
    winnerA: true
  },
  {
    id: 4,
    playerA: "Verstappen",
    playerB: "Leclerc",
    betAmount: 300,
    odds: 1.6,
    result: 'loss',
    actualOdds: 1.6,
    sport: 'F1',
    date: '2024-07-16',
    payout: 0,
    winnerA: false
  },
  {
    id: 5,
    playerA: "Federer",
    playerB: "Nadal",
    betAmount: 250,
    odds: 3.2,
    result: 'win',
    actualOdds: 3.2,
    sport: 'Tennis',
    date: '2024-07-15',
    payout: 800,
    winnerA: true
  }
];

const resultColors = {
  win: 'success',
  loss: 'destructive',
  push: 'warning'
} as const;

const resultIcons = {
  win: CheckCircle,
  loss: XCircle,
  push: Minus
};

export function MatchHistory() {
  const totalBet = mockHistoryMatches.reduce((sum, match) => sum + match.betAmount, 0);
  const totalPayout = mockHistoryMatches.reduce((sum, match) => sum + match.payout, 0);
  const netProfit = totalPayout - totalBet;
  const winRate = (mockHistoryMatches.filter(match => match.result === 'win').length / mockHistoryMatches.length) * 100;

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-semibold text-foreground">Match History</h2>
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Last 5 matches
        </Badge>
      </div>

      {/* History Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-card shadow-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Total Bet</p>
                <p className="text-lg font-bold text-foreground">${totalBet}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Total Payout</p>
                <p className="text-lg font-bold text-foreground">${totalPayout}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {netProfit >= 0 ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <div>
                <p className="text-xs text-muted-foreground">Net P&L</p>
                <p className={`text-lg font-bold ${netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {netProfit >= 0 ? '+' : ''}${netProfit}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Win Rate</p>
                <p className="text-lg font-bold text-foreground">{winRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {mockHistoryMatches.map((match) => {
          const ResultIcon = resultIcons[match.result];
          
          return (
            <Card key={match.id} className="bg-gradient-card shadow-card border-border hover:shadow-primary/20 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <ResultIcon className={`h-5 w-5 ${
                        match.result === 'win' ? 'text-success' : 
                        match.result === 'loss' ? 'text-destructive' : 'text-warning'
                      }`} />
                      <Badge variant={resultColors[match.result]} className="text-xs">
                        {match.result.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium ${match.winnerA ? 'text-success' : 'text-muted-foreground'}`}>
                          {match.playerA}
                        </span>
                        <span className="text-muted-foreground text-sm">vs</span>
                        <span className={`font-medium ${!match.winnerA ? 'text-success' : 'text-muted-foreground'}`}>
                          {match.playerB}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="outline" className="bg-muted/50">
                          {match.sport}
                        </Badge>
                        <span>{match.date}</span>
                        <span>{match.odds}x odds</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-muted-foreground">Bet:</span>
                      <span className="font-medium">${match.betAmount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Payout:</span>
                      <span className={`font-bold ${
                        match.result === 'win' ? 'text-success' : 
                        match.result === 'loss' ? 'text-destructive' : 'text-warning'
                      }`}>
                        ${match.payout}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}