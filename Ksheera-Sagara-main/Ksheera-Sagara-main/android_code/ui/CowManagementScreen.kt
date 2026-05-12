package com.ksheerasagara.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Pets
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

@Composable
fun CowManagementScreen(viewModel: DairyViewModel, onAddClick: () -> Unit) {
    val cows by viewModel.cows.collectAsState()

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(onClick = onAddClick, containerColor = Color(0xFF3B82F6)) {
                Icon(Icons.Default.Add, contentDescription = "Add", tint = Color.White)
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier.padding(padding).fillMaxSize().padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(cows) { cow ->
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
                            color = Color(0xFFF1F5F9),
                            modifier = Modifier.size(50.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(Icons.Default.Pets, contentDescription = null, tint = Color.Gray)
                            }
                        }
                        Spacer(Modifier.width(16.dp))
                        Column {
                            Text(cow.name, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                            Row {
                                Text("Breed: ${cow.breed ?: "N/A"}", fontSize = 12.sp, color = Color.Gray)
                                Spacer(Modifier.width(16.dp))
                                Text("Tag: ${cow.tagId ?: "N/A"}", fontSize = 12.sp, color = Color.Gray)
                            }
                        }
                    }
                }
            }
        }
    }
}
