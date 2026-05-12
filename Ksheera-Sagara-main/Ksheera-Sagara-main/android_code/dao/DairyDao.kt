package com.ksheerasagara.data.dao

import androidx.room.*
import com.ksheerasagara.data.entities.*
import kotlinx.coroutines.flow.Flow

@Dao
interface DairyDao {
    // Milk Production
    @Query("SELECT * FROM milk_production ORDER BY date DESC")
    fun getAllProduction(): Flow<List<MilkProduction>>

    @Insert
    suspend fun insertProduction(production: MilkProduction)

    // Expenses
    @Query("SELECT * FROM expenses ORDER BY date DESC")
    fun getAllExpenses(): Flow<List<Expense>>

    @Insert
    suspend fun insertExpense(expense: Expense)

    // Cows
    @Query("SELECT * FROM cows")
    fun getAllCows(): Flow<List<Cow>>

    @Insert
    suspend fun insertCow(cow: Cow)

    @Query("SELECT SUM(totalIncome) FROM milk_production")
    fun getTotalIncome(): Flow<Double?>

    @Query("SELECT SUM(amount) FROM expenses")
    fun getTotalExpenses(): Flow<Double?>
}
