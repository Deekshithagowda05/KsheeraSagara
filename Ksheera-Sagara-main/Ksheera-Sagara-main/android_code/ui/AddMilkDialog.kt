package com.ksheerasagara.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.ksheerasagara.data.entities.MilkProduction
import java.util.*

@Composable
fun AddMilkDialog(onDismiss: () -> Unit, onSave: (MilkProduction) -> Unit) {
    var quantity by remember { mutableStateOf("") }
    var rate by remember { mutableStateOf("") }
    var fat by remember { mutableStateOf("") }
    var snf by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Add Milk Entry") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(value = quantity, onValueChange = { quantity = it }, label = { Text("Quantity (L)") })
                OutlinedTextField(value = rate, onValueChange = { rate = it }, label = { Text("Rate (₹/L)") })
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(value = fat, onValueChange = { fat = it }, label = { Text("Fat %"), }, modifier = Modifier.weight(1f))
                    OutlinedTextField(value = snf, onValueChange = { snf = it }, label = { Text("SNF %") }, modifier = Modifier.weight(1f))
                }
            }
        },
        confirmButton = {
            Button(onClick = {
                val qtyVal = quantity.toDoubleOrNull() ?: 0.0
                val rateVal = rate.toDoubleOrNull() ?: 0.0
                onSave(MilkProduction(
                    date = System.currentTimeMillis(),
                    quantity = qtyVal,
                    ratePerLiter = rateVal,
                    fatPercentage = fat.toDoubleOrNull() ?: 0.0,
                    snfPercentage = snf.toDoubleOrNull() ?: 0.0,
                    totalIncome = qtyVal * rateVal
                ))
            }) { Text("Save") }
        }
    )
}
