package com.ksheerasagara.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ksheerasagara.viewmodel.DairyViewModel
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun MilkLogScreen(viewModel: DairyViewModel, onAddClick: () -> Unit) {
    val productions by viewModel.productions.collectAsState()
    val cows by viewModel.cows.collectAsState()
    val dateFormat = SimpleDateFormat("MMM dd, yyyy", Locale.getDefault())

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(onClick = onAddClick, containerColor = Color(0xFF10B981)) {
                Icon(Icons.Default.Add, contentDescription = "Add", tint = Color.White)
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier.padding(padding).fillMaxSize().padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(productions) { p ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(2.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text("${p.quantity}L Milk", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Text(dateFormat.format(Date(p.date)), color = Color.Gray, fontSize = 12.sp)
                            p.cowId?.let { id ->
                                val cowName = cows.find { it.id == id }?.name ?: "Unknown"
                                Text(cowName, color = Color(0xFF10B981), fontWeight = FontWeight.Medium, fontSize = 12.sp)
                            }
                        }
                        Column(horizontalAlignment = Alignment.End) {
                            Text("₹${p.totalIncome}", fontWeight = FontWeight.Bold, color = Color(0xFF10B981))
                            Text("INCOME", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.LightGray)
                        }
                    }
                }
            }
        }
    }
}
