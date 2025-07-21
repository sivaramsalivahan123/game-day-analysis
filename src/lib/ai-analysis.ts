import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

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
  betAmount?: number;
  teamAHistory?: TeamHistory;
  teamBHistory?: TeamHistory;
  socialSentiment?: {
    teamA: SocialSentiment;
    teamB: SocialSentiment;
  };
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

// Generate mock social media sentiment data
const generateSocialSentiment = async (teamName: string): Promise<SocialSentiment> => {
  try {
    await initializeAI();
    
    if (!classifier) {
      // Fallback to random sentiment if AI fails
      const positive = Math.floor(Math.random() * 1000) + 500;
      const negative = Math.floor(Math.random() * 500) + 100;
      const neutral = Math.floor(Math.random() * 300) + 200;
      const total = positive + negative + neutral;
      
      return {
        positive: Math.round((positive / total) * 100),
        negative: Math.round((negative / total) * 100),
        neutral: Math.round((neutral / total) * 100),
        overallScore: (positive - negative) / total,
        totalMentions: total,
        trending: Math.random() > 0.7
      };
    }

    // Simulate social media posts about the team
    const mockPosts = [
      `${teamName} is looking strong this season! Great performance lately.`,
      `Not sure about ${teamName}'s chances after their recent struggles.`,
      `${teamName} fans are excited for the upcoming match!`,
      `${teamName} has been disappointing lately, hope they turn it around.`,
      `Love watching ${teamName} play, they're so entertaining!`
    ];

    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    // Analyze each mock post
    for (const post of mockPosts) {
      const result = await classifier(post);
      if (result[0].label === 'POSITIVE' && result[0].score > 0.6) {
        positiveCount++;
      } else if (result[0].label === 'NEGATIVE' && result[0].score > 0.6) {
        negativeCount++;
      } else {
        neutralCount++;
      }
    }

    const totalMentions = Math.floor(Math.random() * 2000) + 1000;
    const total = positiveCount + negativeCount + neutralCount;
    
    return {
      positive: Math.round((positiveCount / total) * 100),
      negative: Math.round((negativeCount / total) * 100),
      neutral: Math.round((neutralCount / total) * 100),
      overallScore: (positiveCount - negativeCount) / total,
      totalMentions,
      trending: Math.random() > 0.6
    };
  } catch (error) {
    console.error('Failed to generate social sentiment:', error);
    // Fallback sentiment
    return {
      positive: 60,
      negative: 25,
      neutral: 15,
      overallScore: 0.35,
      totalMentions: 1500,
      trending: false
    };
  }
};

const formatHistoryInsight = (history: TeamHistory, teamName: string): string => {
  const winRate = (history.recentWins / (history.recentWins + history.recentLosses)) * 100;
  const headToHeadRate = (history.headToHeadWins / (history.headToHeadWins + history.headToHeadLosses)) * 100;
  
  let insight = `${teamName} has won ${history.recentWins}/${history.recentWins + history.recentLosses} recent matches (${winRate.toFixed(0)}% win rate)`;
  
  if (headToHeadRate > 60) {
    insight += ` and dominates head-to-head with ${headToHeadRate.toFixed(0)}% wins`;
  } else if (headToHeadRate < 40) {
    insight += ` but struggles in head-to-head with only ${headToHeadRate.toFixed(0)}% wins`;
  }
  
  if (history.lastMatchResult === 'win') {
    insight += `. Coming off a victory`;
  } else if (history.lastMatchResult === 'loss') {
    insight += `. Coming off a defeat`;
  }
  
  return insight + '.';
};

const formatSentimentInsight = (sentiment: SocialSentiment, teamName: string): string => {
  const trending = sentiment.trending ? ' and trending' : '';
  
  if (sentiment.overallScore > 0.3) {
    return `Social media buzz for ${teamName} is ${sentiment.positive}% positive with ${sentiment.totalMentions} mentions${trending}.`;
  } else if (sentiment.overallScore < -0.3) {
    return `Social media sentiment for ${teamName} is ${sentiment.negative}% negative with ${sentiment.totalMentions} mentions${trending}.`;
  } else {
    return `Social media sentiment for ${teamName} is mixed (${sentiment.positive}% positive, ${sentiment.negative}% negative) with ${sentiment.totalMentions} mentions${trending}.`;
  }
};

export const analyzeMatch = async (match: Match): Promise<string> => {
  try {
    await initializeAI();
    
    if (!classifier) {
      return getStaticAnalysis(match);
    }

    // Generate social sentiment if not provided
    let sentimentA = match.socialSentiment?.teamA;
    let sentimentB = match.socialSentiment?.teamB;
    
    if (!sentimentA) {
      sentimentA = await generateSocialSentiment(match.playerA);
    }
    if (!sentimentB) {
      sentimentB = await generateSocialSentiment(match.playerB);
    }

    // Create comprehensive analysis text
    let analysisText = `Player ${match.playerA} status ${match.playerAStatus} versus ${match.playerB} status ${match.playerBStatus}. Team overall ${match.teamStatus}. Weather conditions ${match.weather}. Win probability ${match.winProbability || 50}%.`;
    
    // Add team history context
    if (match.teamAHistory) {
      analysisText += ` ${formatHistoryInsight(match.teamAHistory, match.playerA)}`;
    }
    if (match.teamBHistory) {
      analysisText += ` ${formatHistoryInsight(match.teamBHistory, match.playerB)}`;
    }
    
    // Add social sentiment context
    analysisText += ` ${formatSentimentInsight(sentimentA, match.playerA)} ${formatSentimentInsight(sentimentB, match.playerB)}`;
    
    // Get AI sentiment analysis
    const result = await classifier(analysisText);
    const sentiment = result[0];
    
    // Generate enhanced analysis based on all factors
    const winProb = match.winProbability || 50;
    const teamAPositive = sentimentA.overallScore > 0.2;
    const teamBPositive = sentimentB.overallScore > 0.2;
    
    let baseAnalysis = '';
    let sentimentSuffix = '';
    
    // Add sentiment insights
    if (teamAPositive && !teamBPositive) {
      sentimentSuffix = ` Social media strongly favors ${match.playerA} with ${sentimentA.positive}% positive sentiment vs ${sentimentB.positive}% for ${match.playerB}.`;
    } else if (!teamAPositive && teamBPositive) {
      sentimentSuffix = ` Social media momentum is with ${match.playerB} (${sentimentB.positive}% positive) over ${match.playerA} (${sentimentA.positive}% positive).`;
    } else if (sentimentA.trending || sentimentB.trending) {
      const trendingTeam = sentimentA.trending ? match.playerA : match.playerB;
      sentimentSuffix = ` ${trendingTeam} is trending on social media, indicating high public interest.`;
    }
    
    if (match.optedIn) {
      if (sentiment.label === 'POSITIVE' && sentiment.score > 0.7) {
        baseAnalysis = `🎯 AI Analysis: Strong positive indicators detected! Your bet on ${match.playerA} vs ${match.playerB} shows excellent potential with ${winProb}% win probability.`;
      } else if (sentiment.label === 'POSITIVE') {
        baseAnalysis = `📊 AI Analysis: Moderate positive signals for ${match.playerA} vs ${match.playerB}. With ${winProb}% win probability, this remains a solid choice.`;
      } else {
        baseAnalysis = `⚠️ AI Analysis: Mixed signals detected for ${match.playerA} vs ${match.playerB}. With ${winProb}% win probability, consider all factors carefully.`;
      }
    } else {
      if (sentiment.label === 'POSITIVE' && sentiment.score > 0.7) {
        baseAnalysis = `🚀 AI Opportunity: Exceptional betting opportunity detected! ${match.playerA} vs ${match.playerB} showing strong positive indicators with ${winProb}% win probability.`;
      } else if (sentiment.label === 'POSITIVE') {
        baseAnalysis = `💡 AI Insight: Promising opportunity for ${match.playerA} vs ${match.playerB}. Current analysis suggests good potential with ${winProb}% win probability.`;
      } else {
        baseAnalysis = `🔍 AI Alert: ${match.playerA} vs ${match.playerB} presents an interesting challenge with ${winProb}% win probability.`;
      }
    }
    
    return baseAnalysis + sentimentSuffix;
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