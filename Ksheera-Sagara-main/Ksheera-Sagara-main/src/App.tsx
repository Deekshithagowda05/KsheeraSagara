/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  LayoutDashboard, 
  Milk, 
  ReceiptIndianRupee, 
  Beef, 
  FileText, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Info,
  ChevronRight,
  BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from './db';
import { getOptimizationSuggestions } from './ai';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tab = 'dashboard' | 'milk' | 'expenses' | 'cows' | 'reports';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showAddMilk, setShowAddMilk] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddCow, setShowAddCow] = useState(false);

  // Queries
  const productions = useLiveQuery(() => db.productions.toArray());
  const expenses = useLiveQuery(() => db.expenses.toArray());
  const cows = useLiveQuery(() => db.cows.toArray());

  // Calculations
  const stats = useMemo(() => {
    const totalIncome = (productions || []).reduce((acc, p) => acc + p.totalIncome, 0);
    const totalExpenses = (expenses || []).reduce((acc, e) => acc + e.amount, 0);
    const totalProduction = (productions || []).reduce((acc, p) => acc + p.quantity, 0);
    const netProfit = totalIncome - totalExpenses;

    const expenseByCategory = (expenses || []).reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

    // Chart data for last 7 days
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = format(d, 'yyyy-MM-dd');
      
      const dayIncome = (productions || [])
        .filter(p => p.date === dateStr)
        .reduce((sum, p) => sum + p.totalIncome, 0);
      
      const dayExpense = (expenses || [])
        .filter(e => e.date === dateStr)
        .reduce((sum, e) => sum + e.amount, 0);

      return {
        name: format(d, 'MMM dd'),
        income: dayIncome,
        expenses: dayExpense,
        profit: dayIncome - dayExpense
      };
    });

    return {
      totalIncome,
      totalExpenses,
      totalProduction,
      netProfit,
      pieData,
      last7Days
    };
  }, [productions, expenses]);

  const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center p-0 sm:p-4">
      {/* Mobile Frame / Portrait Container */}
      <div className="w-full max-w-[450px] h-full sm:h-[840px] bg-slate-50 flex flex-col font-sans select-none overflow-hidden sm:rounded-[3rem] sm:border-[10px] sm:border-slate-800 sm:shadow-2xl relative">
        
        {/* Notch for frame */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-30" />

        {/* Header */}
        <header className="bg-emerald-600 text-white p-4 pt-6 sm:pt-8 sticky top-0 z-10 shadow-md">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Milk className="w-6 h-6" />
              Ksheera-Sagara
            </h1>
            <button className="p-2 rounded-full hover:bg-white/10">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 w-full scrollbar-hide pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Summary Cards */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <p className="text-slate-500 text-sm font-medium">Net Profit/Loss</p>
                  <div className="flex items-end justify-between mt-1">
                    <h2 className={cn(
                      "text-3xl font-bold",
                      stats.netProfit >= 0 ? "text-emerald-600" : "text-rose-600"
                    )}>
                      ₹{Math.abs(stats.netProfit).toLocaleString()}
                    </h2>
                    <div className={cn(
                      "flex items-center gap-1 text-sm px-2 py-1 rounded-full",
                      stats.netProfit >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {stats.netProfit >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      {stats.netProfit >= 0 ? "Profit" : "Loss"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-slate-500 text-xs font-medium">Total Income</p>
                    <p className="text-xl font-bold text-slate-800 mt-1">₹{stats.totalIncome.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-slate-500 text-xs font-medium">Total Expenses</p>
                    <p className="text-xl font-bold text-slate-800 mt-1">₹{stats.totalExpenses.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Performance Chart */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">Last 7 Days Performance</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.last7Days}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                      <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Expense Distribution */}
              {stats.pieData.length > 0 && (
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-4">Expense Distribution</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {stats.pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {stats.pieData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="truncate">{entry.name}: ₹{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'milk' && (
            <MilkLog 
              productions={productions || []} 
              cows={cows || []}
              onAdd={() => setShowAddMilk(true)} 
            />
          )}

          {activeTab === 'expenses' && (
            <ExpenseLog 
              expenses={expenses || []} 
              onAdd={() => setShowAddExpense(true)} 
            />
          )}

          {activeTab === 'cows' && (
            <CowManagement 
              cows={cows || []} 
              onAdd={() => setShowAddCow(true)} 
            />
          )}

          {activeTab === 'reports' && (
            <Reports 
              productions={productions || []} 
              expenses={expenses || []} 
            />
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AddMilkModal 
        isOpen={showAddMilk} 
        onClose={() => setShowAddMilk(false)} 
        cows={cows || []}
      />
      <AddExpenseModal 
        isOpen={showAddExpense} 
        onClose={() => setShowAddExpense(false)} 
      />
      <AddCowModal 
        isOpen={showAddCow} 
        onClose={() => setShowAddCow(false)} 
      />

      {/* Bottom Nav */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 pt-3 pb-6 flex justify-between items-center z-20">
        {[
          { id: 'dashboard', icon: LayoutDashboard, label: 'Dash' },
          { id: 'milk', icon: Milk, label: 'Milk' },
          { id: 'expenses', icon: ReceiptIndianRupee, label: 'Exp' },
          { id: 'cows', icon: Beef, label: 'Cows' },
          { id: 'reports', icon: FileText, label: 'Reps' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as Tab)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300",
              activeTab === item.id ? "text-emerald-600 bg-emerald-50 scale-105" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <item.icon size={22} />
            <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>
      </div>
    </div>
  );
}

// Sub-components
function MilkLog({ productions, cows, onAdd }: { productions: any[], cows: any[], onAdd: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Production Log</h2>
        <button 
          onClick={onAdd}
          className="bg-emerald-600 text-white p-2 rounded-full shadow-lg"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-3">
        {productions.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center border-2 border-dashed border-slate-200">
            <Milk className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500">No milk entries yet</p>
          </div>
        ) : (
          productions.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800">{p.quantity}L Milk</p>
                <p className="text-xs text-slate-500">{format(new Date(p.date), 'MMM dd, yyyy')}</p>
                {p.cowId && (
                  <p className="text-xs text-emerald-600 font-medium">
                    {cows.find(c => c.id === p.cowId)?.name || 'Unknown Cow'}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-600">₹{p.totalIncome}</p>
                <p className="text-[10px] uppercase text-slate-400 font-bold">Income</p>
              </div>
            </div>
          )).reverse()
        )}
      </div>
    </motion.div>
  );
}

function ExpenseLog({ expenses, onAdd }: { expenses: any[], onAdd: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Expenses</h2>
        <button 
          onClick={onAdd}
          className="bg-rose-600 text-white p-2 rounded-full shadow-lg"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-3">
        {expenses.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center border-2 border-dashed border-slate-200">
            <ReceiptIndianRupee className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500">No expenses recorded</p>
          </div>
        ) : (
          expenses.map((e) => (
            <div key={e.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                  <ReceiptIndianRupee size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{e.category}</p>
                  <p className="text-xs text-slate-500">{format(new Date(e.date), 'MMM dd, yyyy')}</p>
                  <p className="text-xs text-slate-400 italic truncate max-w-[150px]">{e.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-rose-600">₹{e.amount}</p>
                <p className="text-[10px] uppercase text-slate-400 font-bold">Cost</p>
              </div>
            </div>
          )).reverse()
        )}
      </div>
    </motion.div>
  );
}

function CowManagement({ cows, onAdd }: { cows: any[], onAdd: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">My Farm (Cows)</h2>
        <button 
          onClick={onAdd}
          className="bg-blue-600 text-white p-2 rounded-full shadow-lg"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {cows.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center border-2 border-dashed border-slate-200">
            <Beef className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500">Add your first cow to track performance</p>
          </div>
        ) : (
          cows.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                <Beef size={28} className="text-slate-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-lg">{c.name}</h3>
                <div className="flex gap-4">
                  <p className="text-xs text-slate-500 font-medium">Breed: <span className="text-slate-700">{c.breed || 'N/A'}</span></p>
                  <p className="text-xs text-slate-500 font-medium">Tag ID: <span className="text-slate-700">{c.tagId || 'N/A'}</span></p>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function Reports({ productions, expenses }: { productions: any[], expenses: any[] }) {
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const totalIncome = productions.reduce((acc, p) => acc + p.totalIncome, 0);
  const totalExpense = expenses.reduce((acc, e) => acc + e.amount, 0);
  const profit = totalIncome - totalExpense;

  const handleAiSuggestions = async () => {
    setIsAiLoading(true);
    try {
      const tip = await getOptimizationSuggestions(totalIncome, expenses);
      setAiTip(tip);
    } catch (e) {
      setAiTip("Failed to connect to AI. Please check your internet connection.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-bold text-slate-800">Financial Reports</h2>

      <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-emerald-100 font-medium mb-1">Current Period Balance</p>
          <h2 className="text-4xl font-black">₹{profit.toLocaleString()}</h2>
          <div className="mt-4 flex gap-6">
            <div>
              <p className="text-emerald-200 text-xs font-bold uppercase tracking-wider">Total Income</p>
              <p className="text-lg font-bold">₹{totalIncome.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-emerald-200 text-xs font-bold uppercase tracking-wider">Total Expenses</p>
              <p className="text-lg font-bold">₹{totalExpense.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <BrainCircuit className="text-emerald-600 w-6 h-6" />
          <h3 className="font-bold text-slate-800">AI Optimization Advice</h3>
        </div>
        
        {aiTip ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-sm text-slate-600 bg-slate-50 p-4 rounded-xl whitespace-pre-wrap"
          >
            {aiTip}
          </motion.div>
        ) : (
          <p className="text-slate-500 text-sm mb-4">
            Get personalized suggestions to increase your dairy farm profit based on your data.
          </p>
        )}

        <button 
          onClick={handleAiSuggestions}
          disabled={isAiLoading || productions.length === 0}
          className="w-full mt-2 bg-emerald-600 disabled:bg-emerald-300 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2"
        >
          {isAiLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing patterns...
            </>
          ) : (
            <>
              <BrainCircuit size={20} />
              Get AI Suggestions
            </>
          )}
        </button>
      </div>

    </motion.div>
  );
}

// Modal Components
function AddMilkModal({ isOpen, onClose, cows }: { isOpen: boolean; onClose: () => void; cows: any[] }) {
  const [qty, setQty] = useState('');
  const [fat, setFat] = useState('');
  const [snf, setSnf] = useState('');
  const [rate, setRate] = useState('');
  const [cowId, setCowId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const income = Number(qty) * Number(rate);
    await db.productions.add({
      date: format(new Date(), 'yyyy-MM-dd'),
      quantity: Number(qty),
      fat: Number(fat),
      snf: Number(snf),
      ratePerLiter: Number(rate),
      totalIncome: income,
      cowId: cowId ? Number(cowId) : undefined
    });
    onClose();
    setQty(''); setFat(''); setSnf(''); setRate(''); setCowId('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-4"
      >
        <h3 className="text-xl font-bold text-slate-800">Add Milk Production</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Quantity (L)</label>
              <input 
                type="number" step="0.1" required value={qty} onChange={e => setQty(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Rate (₹/L)</label>
              <input 
                type="number" step="0.1" required value={rate} onChange={e => setRate(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Fat %</label>
              <input 
                type="number" step="0.1" value={fat} onChange={e => setFat(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">SNF %</label>
              <input 
                type="number" step="0.1" value={snf} onChange={e => setSnf(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Select Cow (Optional)</label>
            <select 
              value={cowId} onChange={e => setCowId(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 text-slate-800"
            >
              <option value="">General Production</option>
              {cows.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-500 font-bold">Cancel</button>
            <button type="submit" className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg">Save Entry</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function AddExpenseModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [cat, setCat] = useState('Fodder');
  const [amt, setAmt] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.expenses.add({
      date: format(new Date(), 'yyyy-MM-dd'),
      category: cat as any,
      amount: Number(amt),
      description: desc
    });
    onClose();
    setAmt(''); setDesc('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-sm rounded-3xl p-6 space-y-4"
      >
        <h3 className="text-xl font-bold text-slate-800">Add Expense</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
            <select 
              value={cat} onChange={e => setCat(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-rose-500 text-slate-800"
            >
              <option>Fodder</option>
              <option>Medical</option>
              <option>Labor</option>
              <option>Electricity</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Amount (₹)</label>
            <input 
              type="number" required value={amt} onChange={e => setAmt(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-rose-500 text-slate-800"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
            <textarea 
              value={desc} onChange={e => setDesc(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-rose-500 min-h-[80px] text-slate-800"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-500 font-bold">Cancel</button>
            <button type="submit" className="flex-1 bg-rose-600 text-white font-bold py-3 rounded-xl shadow-lg">Save Expense</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function AddCowModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [tag, setTag] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.cows.add({ name, breed, tagId: tag });
    onClose();
    setName(''); setBreed(''); setTag('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-sm rounded-3xl p-6 space-y-4"
      >
        <h3 className="text-xl font-bold text-slate-800">Add New Cow</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Name/Identifier</label>
            <input 
              required value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Ganga"
              className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Breed</label>
            <input 
              value={breed} onChange={e => setBreed(e.target.value)}
              placeholder="e.g. Holstien"
              className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Tag ID</label>
            <input 
              value={tag} onChange={e => setTag(e.target.value)}
              placeholder="e.g. KA-123"
              className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-500 font-bold">Cancel</button>
            <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg">Add Cow</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

