package com.ksheerasagara.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ksheerasagara.data.dao.DairyDao
import com.ksheerasagara.data.entities.*
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class DairyViewModel(private val dao: DairyDao) : ViewModel() {

    val productions: StateFlow<List<MilkProduction>> = dao.getAllProduction()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val expenses: StateFlow<List<Expense>> = dao.getAllExpenses()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val cows: StateFlow<List<Cow>> = dao.getAllCows()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val totalIncome = dao.getTotalIncome()
    val totalExpenses = dao.getTotalExpenses()

    fun addProduction(p: MilkProduction) = viewModelScope.launch { dao.insertProduction(p) }
    fun addExpense(e: Expense) = viewModelScope.launch { dao.insertExpense(e) }
    fun addCow(c: Cow) = viewModelScope.launch { dao.insertCow(c) }
}
