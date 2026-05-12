package com.ksheerasagara.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ksheerasagara.viewmodel.DairyViewModel

@Composable
fun DashboardScreen(viewModel: DairyViewModel) {
    Scaffold(
        topBar = {
            SmallTopAppBar(
                title = { Text("Ksheera-Sagara", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.smallTopAppBarColors(
                    containerColor = Color(0xFF10B981),
                    titleContentColor = Color.White
                )
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                ProfitCard(profit = 15000.0) // Sample static data for illustration
            }
            
            item {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    SummaryCard(label = "Income", value = "₹45,000", modifier = Modifier.weight(1f))
                    SummaryCard(label = "Expenses", value = "₹30,000", modifier = Modifier.weight(1f))
                }
            }

            item {
                Text(
                    text = "Quick Actions",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }

            item {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(
                        onClick = { /* Navigate to Add Milk */ },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981))
                    ) {
                        Text("Add Milk")
                    }
                    Button(
                        onClick = { /* Navigate to Add Expense */ },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEF4444))
                    ) {
                        Text("Add Expense")
                    }
                }
            }
        }
    }
}

@Composable
fun ProfitCard(profit: Double) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = androidx.compose.foundation.shape.RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Net Profit/Loss", color = Color.Gray, fontSize = 14.sp)
            Text(
                "₹${String.format("%,.0f", profit)}",
                fontSize = 32.sp,
                fontWeight = FontWeight.Black,
                color = if (profit >= 0) Color(0xFF059669) else Color(0xFFDC2626)
            )
        }
    }
}

@Composable
fun SummaryCard(label: String, value: String, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        shape = androidx.compose.foundation.shape.RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(label, color = Color.Gray, fontSize = 12.sp)
            Text(value, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        }
    }
}
