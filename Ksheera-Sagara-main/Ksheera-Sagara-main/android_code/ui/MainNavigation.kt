package com.ksheerasagara.ui

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import com.ksheerasagara.service.AiService
import com.ksheerasagara.viewmodel.DairyViewModel

sealed class Screen(val route: String, val icon: ImageVector, val label: String) {
    object Dashboard : Screen("dash", Icons.Default.Dashboard, "Dash")
    object Milk : Screen("milk", Icons.Default.WaterDrop, "Milk")
    object Expenses : Screen("exp", Icons.Default.Payments, "Exp")
    object Cows : Screen("cows", Icons.Default.Pets, "Cows")
    object Reports : Screen("reps", Icons.Default.Assessment, "Reps")
}

@Composable
fun MainNavigation(viewModel: DairyViewModel, aiService: AiService) {
    var currentScreen by remember { mutableStateOf<Screen>(Screen.Dashboard) }
    var showMilkDialog by remember { mutableStateOf(false) }
    var showExpenseDialog by remember { mutableStateOf(false) }
    var showCowDialog by remember { mutableStateOf(false) }

    Scaffold(
        bottomBar = {
            NavigationBar(containerColor = Color.White) {
                val items = listOf(Screen.Dashboard, Screen.Milk, Screen.Expenses, Screen.Cows, Screen.Reports)
                items.forEach { screen ->
                    NavigationBarItem(
                        selected = currentScreen == screen,
                        onClick = { currentScreen = screen },
                        icon = { Icon(screen.icon, contentDescription = null) },
                        label = { Text(screen.label) },
                        colors = NavigationBarItemDefaults.colors(selectedIconColor = Color(0xFF10B981))
                    )
                }
            }
        }
    ) { padding ->
        Surface(modifier = androidx.compose.foundation.layout.Modifier.padding(padding)) {
            when (currentScreen) {
                is Screen.Dashboard -> DashboardScreen(viewModel)
                is Screen.Milk -> MilkLogScreen(viewModel) { showMilkDialog = true }
                is Screen.Expenses -> ExpenseLogScreen(viewModel) { showExpenseDialog = true }
                is Screen.Cows -> CowManagementScreen(viewModel) { showCowDialog = true }
                is Screen.Reports -> ReportsScreen(viewModel, aiService)
            }
        }

        if (showMilkDialog) AddMilkDialog(onDismiss = { showMilkDialog = false }) { viewModel.addProduction(it); showMilkDialog = false }
        if (showExpenseDialog) AddExpenseDialog(onDismiss = { showExpenseDialog = false }) { viewModel.addExpense(it); showExpenseDialog = false }
        if (showCowDialog) AddCowDialog(onDismiss = { showCowDialog = false }) { viewModel.addCow(it); showCowDialog = false }
    }
}
