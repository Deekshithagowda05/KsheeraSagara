package com.ksheerasagara.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.ksheerasagara.data.dao.DairyDao
import com.ksheerasagara.data.entities.*

@Database(entities = [MilkProduction::class, Expense::class, Cow::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun dairyDao(): DairyDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseOf(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "ksheera_sagara_db"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
