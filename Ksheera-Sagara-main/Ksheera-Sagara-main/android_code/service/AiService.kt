package com.ksheerasagara.service

import com.google.ai.client.generativeai.GenerativeModel
import com.ksheerasagara.data.entities.Expense

class AiService(private val apiKey: String) {
    private val model = GenerativeModel(
        modelName = "gemini-3-flash-preview",
        apiKey = apiKey
    )

    suspend fun getOptimizationSuggestions(totalIncome: Double, expenses: List<Expense>): String {
        val expenseSummary = expenses.groupBy { it.category }
            .mapValues { it.value.sumOf { exp -> exp.amount } }

        val prompt = """
            Dairy Farm Analysis:
            Total Income: ₹$totalIncome
            Expenses Breakdown: $expenseSummary
            
            Provide 3 concise, actionable tips to increase net profit for this farmer.
        """.trimIndent()

        return try {
            val response = model.generateContent(prompt)
            response.text ?: "No suggestions available."
        } catch (e: Exception) {
            "Error: ${e.localizedMessage}"
        }
    }
}
