import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

interface Match {
  id: number;
  playerA: string;
  playerB: string;
  odds: number;
  playerAStatus: string;
  playerBStatus: string;
  teamStatus: string;
  weather: string;
  optedIn: boolean;
  sport: string;
  startTime: string;
  winProbability?: number;
}

let classifier: any = null;

export const initializeAI = async () => {
  if (!classifier) {
    try {
      // Use a lightweight sentiment analysis model for quick analysis
      classifier = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
      console.log('AI model loaded successfully');
    } catch (error) {
      console.error('Failed to load AI model:', error);
    }
  }
  return classifier;
};

export const analyzeMatch = async (match: Match): Promise<string> => {
  try {
    await initializeAI();
    
    if (!classifier) {
      return getStaticAnalysis(match);
    }

    // Create analysis text from match data
    const analysisText = `Player ${match.playerA} status ${match.playerAStatus} versus ${match.playerB} status ${match.playerBStatus}. Team overall ${match.teamStatus}. Weather conditions ${match.weather}. Win probability ${match.winProbability || 50}%.`;
    
    // Get AI sentiment analysis
    const result = await classifier(analysisText);
    const sentiment = result[0];
    
    // Generate analysis based on AI sentiment and match data
    const winProb = match.winProbability || 50;
    if (match.optedIn) {
      if (sentiment.label === 'POSITIVE' && sentiment.score > 0.7) {
        return `🎯 AI Analysis: Strong positive indicators detected! Your bet on ${match.playerA} vs ${match.playerB} shows excellent potential with ${winProb}% win probability. Current conditions favor your position.`;
      } else if (sentiment.label === 'POSITIVE') {
        return `📊 AI Analysis: Moderate positive signals for ${match.playerA} vs ${match.playerB}. With ${winProb}% win probability, this remains a solid choice despite some mixed indicators.`;
      } else {
        return `⚠️ AI Analysis: Mixed signals detected for ${match.playerA} vs ${match.playerB}. While challenges exist, your ${winProb}% win probability still offers reasonable potential.`;
      }
    } else {
      if (sentiment.label === 'POSITIVE' && sentiment.score > 0.7) {
        return `🚀 AI Opportunity: Exceptional betting opportunity detected! ${match.playerA} vs ${match.playerB} showing strong positive indicators. ${winProb}% win probability with favorable conditions.`;
      } else if (sentiment.label === 'POSITIVE') {
        return `💡 AI Insight: Promising opportunity for ${match.playerA} vs ${match.playerB}. Current analysis suggests good potential with ${winProb}% win probability.`;
      } else {
        return `🔍 AI Alert: ${match.playerA} vs ${match.playerB} presents an interesting challenge. With ${winProb}% win probability, consider the current conditions carefully.`;
      }
    }
  } catch (error) {
    console.error('AI analysis failed:', error);
    return getStaticAnalysis(match);
  }
};

const getStaticAnalysis = (match: Match): string => {
  // Fallback static analysis
  const winProb = match.winProbability || 50;
  if (match.optedIn) {
    if (winProb > 70) {
      return `🎯 Strong Position: Your bet on ${match.playerA} vs ${match.playerB} looks excellent with ${winProb}% win probability!`;
    }
    return `📊 Solid Choice: ${match.playerA} vs ${match.playerB} shows good potential with ${winProb}% win probability.`;
  } else {
    return `💡 Opportunity: ${match.playerA} vs ${match.playerB} presents interesting potential with ${winProb}% win probability.`;
  }
};