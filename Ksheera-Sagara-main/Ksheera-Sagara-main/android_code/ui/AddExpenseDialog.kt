package com.ksheerasagara.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.ksheerasagara.data.entities.Expense

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddExpenseDialog(onDismiss: () -> Unit, onSave: (Expense) -> Unit) {
    var category by remember { mutableStateOf("Fodder") }
    var amount by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    val categories = listOf("Fodder", "Medical", "Labor", "Electricity", "Other")
    var expanded by remember { mutableStateOf(false) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Add Expense") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                ExposedDropdownMenuBox(expanded = expanded, onExpandedChange = { expanded = !expanded }) {
                    OutlinedTextField(
                        value = category,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Category") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                        modifier = Modifier.menuAnchor()
                    )
                    ExposedDropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
                        categories.forEach { cat ->
                            DropdownMenuItem(text = { Text(cat) }, onClick = { category = cat; expanded = false })
                        }
                    }
                }
                OutlinedTextField(value = amount, onValueChange = { amount = it }, label = { Text("Amount (₹)") })
                OutlinedTextField(value = description, onValueChange = { description = it }, label = { Text("Description") })
            }
        },
        confirmButton = {
            Button(onClick = {
                onSave(Expense(
                    date = System.currentTimeMillis(),
                    category = category,
                    amount = amount.toDoubleOrNull() ?: 0.0,
                    description = description
                ))
            }) { Text("Save") }
        }
    )
}
