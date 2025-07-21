import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Minus, Calendar, Trophy, Target } from "lucide-react";

interface HistoricalMatch {
  id: number;
  date: string;
  opponent: string;
  result: 'win' | 'loss' | 'draw';
  score: string;
  betAmount?: number;
  odds?: number;
  payout?: number;
  venue: string;
}

interface MatchHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  opponentName: string;
  sport: string;
}

const generateHistoryData = (playerName: string, opponentName: string): HistoricalMatch[] => {
  const venues = ['Stadium A', 'Arena B', 'Court C', 'Track D', 'Field E'];
  const results: ('win' | 'loss' | 'draw')[] = ['win', 'loss', 'draw'];
  
  return Array.from({ length: 8 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (i + 1) * 15);
    const result = results[Math.floor(Math.random() * results.length)];
    const hadBet = Math.random() > 0.4;
    const odds = hadBet ? Number((1.5 + Math.random() * 2).toFixed(1)) : undefined;
    const betAmount = hadBet ? Math.floor(Math.random() * 300) + 50 : undefined;
    
    return {
      id: i + 1,
      date: date.toISOString().split('T')[0],
      opponent: opponentName,
      result,
      score: generateScore(result),
      betAmount,
      odds,
      payout: hadBet && result === 'win' ? betAmount! * odds! : hadBet && result === 'loss' ? 0 : betAmount,
      venue: venues[Math.floor(Math.random() * venues.length)]
    };
  });
};

const generateScore = (result: 'win' | 'loss' | 'draw'): string => {
  const scores = {
    win: ['6-4, 6-3', '2-1', '112-108', '1st Place', '3-1'],
    loss: ['4-6, 3-6', '1-2', '108-112', '3rd Place', '1-3'],
    draw: ['6-6', '2-2', '110-110', 'Draw', '2-2']
  };
  const resultScores = scores[result];
  return resultScores[Math.floor(Math.random() * resultScores.length)];
};

const resultColors = {
  win: 'success',
  loss: 'destructive',
  draw: 'warning'
} as const;

const resultIcons = {
  win: CheckCircle,
  loss: XCircle,
  draw: Minus
};

export function MatchHistoryModal({ isOpen, onClose, playerName, opponentName, sport }: MatchHistoryModalProps) {
  const historyData = generateHistoryData(playerName, opponentName);
  const wins = historyData.filter(match => match.result === 'win').length;
  const losses = historyData.filter(match => match.result === 'loss').length;
  const draws = historyData.filter(match => match.result === 'draw').length;
  
  const totalBet = historyData.reduce((sum, match) => sum + (match.betAmount || 0), 0);
  const totalPayout = historyData.reduce((sum, match) => sum + (match.payout || 0), 0);
  const netProfit = totalPayout - totalBet;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            {playerName} vs {opponentName} - Match History
          </DialogTitle>
        </DialogHeader>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-success">{wins}</div>
              <div className="text-xs text-muted-foreground">Wins</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-destructive">{losses}</div>
              <div className="text-xs text-muted-foreground">Losses</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-warning">{draws}</div>
              <div className="text-xs text-muted-foreground">Draws</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card">
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                {netProfit >= 0 ? '+' : ''}${netProfit}
              </div>
              <div className="text-xs text-muted-foreground">Net P&L</div>
            </CardContent>
          </Card>
        </div>

        {/* Match History List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Recent Matches
          </h3>
          
          {historyData.map((match) => {
            const ResultIcon = resultIcons[match.result];
            
            return (
              <Card key={match.id} className="bg-gradient-card hover:shadow-primary/20 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <ResultIcon className={`h-4 w-4 ${
                          match.result === 'win' ? 'text-success' : 
                          match.result === 'loss' ? 'text-destructive' : 'text-warning'
                        }`} />
                        <Badge variant={resultColors[match.result]} className="text-xs">
                          {match.result.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div>
                        <div className="font-medium text-foreground">{match.score}</div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{match.date}</span>
                          <span>•</span>
                          <span>{match.venue}</span>
                          <span>•</span>
                          <Badge variant="outline" className="bg-muted/50">
                            {sport}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {match.betAmount && (
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <Target className="h-3 w-3" />
                          <span>Bet: ${match.betAmount} @ {match.odds}x</span>
                        </div>
                        <div className={`text-sm font-bold ${
                          match.result === 'win' ? 'text-success' : 
                          match.result === 'loss' ? 'text-destructive' : 'text-warning'
                        }`}>
                          Payout: ${match.payout}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}