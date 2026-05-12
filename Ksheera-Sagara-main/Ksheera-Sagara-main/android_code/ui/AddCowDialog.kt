package com.ksheerasagara.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.unit.dp
import com.ksheerasagara.data.entities.Cow

@Composable
fun AddCowDialog(onDismiss: () -> Unit, onSave: (Cow) -> Unit) {
    var name by remember { mutableStateOf("") }
    var breed by remember { mutableStateOf("") }
    var tagId by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Add New Cow") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Name/ID") })
                OutlinedTextField(value = breed, onValueChange = { breed = it }, label = { Text("Breed") })
                OutlinedTextField(value = tagId, onValueChange = { tagId = it }, label = { Text("Tag ID") })
            }
        },
        confirmButton = {
            Button(onClick = {
                if (name.isNotEmpty()) {
                    onSave(Cow(name = name, breed = breed, tagId = tagId))
                }
            }) { Text("Add") }
        }
    )
}
