package com.ksheerasagara.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Receipt
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
fun ExpenseLogScreen(viewModel: DairyViewModel, onAddClick: () -> Unit) {
    val expenses by viewModel.expenses.collectAsState()
    val dateFormat = SimpleDateFormat("MMM dd, yyyy", Locale.getDefault())

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(onClick = onAddClick, containerColor = Color(0xFFEF4444)) {
                Icon(Icons.Default.Add, contentDescription = "Add", tint = Color.White)
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier.padding(padding).fillMaxSize().padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(expenses) { e ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(2.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = androidx.compose.foundation.shape.CircleShape,
                            color = Color(0xFFFEF2F2),
                            modifier = Modifier.size(40.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(Icons.Default.Receipt, contentDescription = null, tint = Color(0xFFEF4444), modifier = Modifier.size(20.dp))
                            }
                        }
                        Spacer(Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(e.category, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Text(dateFormat.format(Date(e.date)), color = Color.Gray, fontSize = 12.sp)
                            if (e.description.isNotEmpty()) {
                                Text(e.description, color = Color.LightGray, fontSize = 12.sp, fontStyle = androidx.compose.ui.text.font.FontStyle.Italic)
                            }
                        }
                        Column(horizontalAlignment = Alignment.End) {
                            Text("₹${e.amount}", fontWeight = FontWeight.Bold, color = Color(0xFFEF4444))
                            Text("COST", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.LightGray)
                        }
                    }
                }
            }
        }
    }
}
