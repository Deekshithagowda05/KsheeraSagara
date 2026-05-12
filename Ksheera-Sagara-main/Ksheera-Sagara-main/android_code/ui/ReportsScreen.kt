package com.ksheerasagara.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ksheerasagara.service.AiService
import com.ksheerasagara.viewmodel.DairyViewModel
import kotlinx.coroutines.launch

@Composable
fun ReportsScreen(viewModel: DairyViewModel, aiService: AiService) {
    val totalIncome by viewModel.totalIncome.collectAsState(initial = 0.0)
    val totalExpenses by viewModel.totalExpenses.collectAsState(initial = 0.0)
    val expenses by viewModel.expenses.collectAsState()
    
    val netProfit = (totalIncome ?: 0.0) - (totalExpenses ?: 0.0)
    val scope = rememberCoroutineScope()
    var aiSuggestion by remember { mutableStateOf<String?>(null) }
    var isLoadingAi by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF10B981))
        ) {
            Column(modifier = Modifier.padding(24.dp)) {
                Text("Current Balance", color = Color.White.copy(alpha = 0.7f), fontWeight = FontWeight.Medium)
                Text("₹${String.format("%,.0f", netProfit)}", color = Color.White, fontSize = 36.sp, fontWeight = FontWeight.Black)
                Spacer(Modifier.height(16.dp))
                Row(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("TOTAL INCOME", color = Color.White.copy(alpha = 0.6f), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        Text("₹${String.format("%,.0f", totalIncome ?: 0.0)}", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text("TOTAL EXPENSES", color = Color.White.copy(alpha = 0.6f), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        Text("₹${String.format("%,.0f", totalExpenses ?: 0.0)}", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(2.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = Color(0xFF10B981))
                    Spacer(Modifier.width(8.dp))
                    Text("AI Optimization Tips", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                }
                
                Spacer(Modifier.height(12.dp))
                
                if (aiSuggestion != null) {
                    Text(
                        text = aiSuggestion!!,
                        color = Color.DarkGray,
                        fontSize = 14.sp,
                        modifier = Modifier.padding(8.dp)
                    )
                } else {
                    Text("Get personalized advice based on your logs.", color = Color.Gray, fontSize = 14.sp)
                }

                Spacer(Modifier.height(16.dp))

                Button(
                    onClick = {
                        scope.launch {
                            isLoadingAi = true
                            aiSuggestion = aiService.getOptimizationSuggestions(totalIncome ?: 0.0, expenses)
                            isLoadingAi = false
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981)),
                    enabled = !isLoadingAi
                ) {
                    if (isLoadingAi) {
                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp))
                    } else {
                        Text("Analyze Patterns", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
