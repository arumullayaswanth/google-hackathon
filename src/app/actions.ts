
'use server';
import { suggestAnswer } from '@/ai/flows/suggest-answer';
import { askAnalyticsBot } from '@/ai/flows/analytics-bot';
import type { AnalyticsData } from '@/types';

export async function getAiSuggestion(question: string) {
  try {
    const result = await suggestAnswer({ question });
    return result.suggestedAnswer;
  } catch (error) {
    console.error('Error getting AI suggestion:', error);
    return 'Sorry, I could not generate a suggestion at this time.';
  }
}

export async function getAnalyticsBotAnswer(question: string, analyticsData: AnalyticsData) {
    if (!question || !analyticsData) {
        return "I need a question and data to work with.";
    }
    try {
        const result = await askAnalyticsBot({ question, analyticsData });
        return result.answer;
    } catch (error) {
        console.error('Error getting AI analytics answer:', error);
        return 'Sorry, I could not generate an answer at this time.';
    }
}
