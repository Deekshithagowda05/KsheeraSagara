import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function getOptimizationSuggestions(
  totalIncome: number,
  expenses: { category: string; amount: number }[]
) {
  if (!process.env.GEMINI_API_KEY) {
    return "Please set your Gemini API key in the secrets panel to get AI suggestions.";
  }

  const expenseSummary = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const prompt = `As a dairy farming expert, analyze these monthly financials for a farmer:
Total Income: ${totalIncome}
Expenses: ${JSON.stringify(expenseSummary)}

Provide 3 specific, actionable suggestions to optimize costs and improve net profit. Keep suggestions concise and relevant for a small-to-medium scale dairy farmer.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "No suggestions available at this time.";
  } catch (error) {
    console.error("AI suggestion error:", error);
    return "Failed to get suggestions. Please try again later.";
  }
}
