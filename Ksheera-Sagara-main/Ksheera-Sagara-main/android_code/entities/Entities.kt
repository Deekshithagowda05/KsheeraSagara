package com.ksheerasagara.data.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "milk_production")
data class MilkProduction(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val date: Long, // Epoch timestamp
    val quantity: Double,
    val fatPercentage: Double,
    val snfPercentage: Double,
    val ratePerLiter: Double,
    val totalIncome: Double,
    val cowId: Long? = null
)

@Entity(tableName = "expenses")
data class Expense(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val date: Long,
    val category: String, // Fodder, Medical, Labor, Electricity, Other
    val amount: Double,
    val description: String
)

@Entity(tableName = "cows")
data class Cow(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val breed: String?,
    val tagId: String?
)
