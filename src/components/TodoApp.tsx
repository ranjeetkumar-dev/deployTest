import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Check,
  CreditCard as Edit2,
  Trash2,
  Sun,
  Moon,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

type FilterType = "all" | "active" | "completed";

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    const savedTheme = localStorage.getItem("darkMode");

    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }

    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setTodos([todo, ...todos]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEditing = (id: string, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = () => {
    if (editingText.trim() && editingId) {
      setTodos(
        todos.map((todo) =>
          todo.id === editingId ? { ...todo, text: editingText.trim() } : todo
        )
      );
      setEditingId(null);
      setEditingText("");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1
            className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r ${
              darkMode
                ? "from-purple-400 via-pink-400 to-indigo-400"
                : "from-purple-600 via-pink-600 to-indigo-600"
            } bg-clip-text text-transparent`}
          >
            0_0 ~_- Todo App 0_0 ~_-
          </h1>
          <p
            className={`text-lg ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Organize your tasks beautifully
          </p>
        </motion.div>

        {/* Theme Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-end mb-6"
        >
          <Button
            onClick={() => setDarkMode(!darkMode)}
            variant="outline"
            size="sm"
            className={`backdrop-blur-sm border-opacity-20 ${
              darkMode
                ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                : "bg-white/60 border-gray-200/50 text-gray-700 hover:bg-white/80"
            }`}
          >
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </motion.div>

        {/* Main Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl border ${
            darkMode
              ? "bg-white/10 border-white/20"
              : "bg-white/70 border-white/50"
          }`}
        >
          {/* Progress Bar */}
          {totalCount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Progress
                </span>
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {completedCount}/{totalCount} tasks
                </span>
              </div>
              <div
                className={`h-2 rounded-full overflow-hidden ${
                  darkMode ? "bg-gray-800/50" : "bg-gray-200"
                }`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full rounded-full ${
                    darkMode
                      ? "bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400"
                      : "bg-gradient-to-r from-purple-500 to-pink-500"
                  }`}
                />
              </div>
            </motion.div>
          )}

          {/* Add Todo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 mb-6"
          >
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new task..."
              className={`flex-1 rounded-xl border-opacity-30 backdrop-blur-sm ${
                darkMode
                  ? "bg-white/10 border-white/30 text-white placeholder-gray-400"
                  : "bg-white/80 border-gray-200/50 text-gray-900 placeholder-gray-500"
              }`}
            />
            <Button
              onClick={addTodo}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl px-6 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center gap-2 mb-6"
          >
            {(["all", "active", "completed"] as FilterType[]).map(
              (filterType) => (
                <Button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  variant={filter === filterType ? "default" : "outline"}
                  size="sm"
                  className={`capitalize rounded-xl transition-all duration-200 ${
                    filter === filterType
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : darkMode
                      ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                      : "bg-white/60 border-gray-200/50 text-gray-700 hover:bg-white/80"
                  }`}
                >
                  <Filter className="h-3 w-3 mr-1" />
                  {filterType}
                </Button>
              )
            )}
          </motion.div>

          {/* Todo List */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredTodos.map((todo) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`flex items-center gap-3 p-4 rounded-xl backdrop-blur-sm border transition-all duration-200 hover:scale-[1.02] ${
                    darkMode
                      ? "bg-white/5 border-white/10 hover:bg-white/10"
                      : "bg-white/60 border-white/40 hover:bg-white/80"
                  }`}
                >
                  <motion.button
                    onClick={() => toggleTodo(todo.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-lg ${
                      todo.completed
                        ? darkMode
                          ? "bg-gradient-to-r from-emerald-400 to-teal-500 border-emerald-400 text-white shadow-emerald-400/50"
                          : "bg-gradient-to-r from-green-400 to-emerald-500 border-green-400 text-white shadow-green-400/50"
                        : darkMode
                        ? "border-gray-500 hover:border-emerald-400 hover:bg-emerald-400/20 hover:shadow-emerald-400/30"
                        : "border-gray-300 hover:border-green-400 hover:bg-green-50 hover:shadow-green-400/30"
                    }`}
                  >
                    <motion.div
                      initial={false}
                      animate={{
                        scale: todo.completed ? 1 : 0,
                        rotate: todo.completed ? 0 : 180,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    >
                      <Check className="w-4 h-4 font-bold" />
                    </motion.div>
                  </motion.button>

                  {editingId === todo.id ? (
                    <Input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyPress={handleEditKeyPress}
                      onBlur={saveEdit}
                      autoFocus
                      className={`flex-1 rounded-lg ${
                        darkMode
                          ? "bg-white/10 border-white/30 text-white"
                          : "bg-white/80 border-gray-200/50 text-gray-900"
                      }`}
                    />
                  ) : (
                    <span
                      className={`flex-1 transition-all duration-200 ${
                        todo.completed
                          ? `line-through ${
                              darkMode
                                ? "text-gray-300 opacity-75"
                                : "text-gray-500 opacity-75"
                            }`
                          : darkMode
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {todo.text}
                    </span>
                  )}

                  <div className="flex gap-2">
                    {editingId === todo.id ? (
                      <Button
                        onClick={saveEdit}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white rounded-lg h-8 w-8 p-0 transition-all duration-200 hover:scale-110"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => startEditing(todo.id, todo.text)}
                        variant="outline"
                        size="sm"
                        className={`rounded-lg h-8 w-8 p-0 transition-all duration-200 hover:scale-110 ${
                          darkMode
                            ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                            : "bg-white/60 border-gray-200/50 text-gray-700 hover:bg-white/80"
                        }`}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    )}

                    <Button
                      onClick={() => deleteTodo(todo.id)}
                      variant="outline"
                      size="sm"
                      className={`rounded-lg h-8 w-8 p-0 transition-all duration-200 hover:scale-110 hover:bg-red-500 hover:text-white hover:border-red-500 ${
                        darkMode
                          ? "bg-white/10 border-white/20 text-white"
                          : "bg-white/60 border-gray-200/50 text-gray-700"
                      }`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredTodos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div
                className={`text-6xl mb-4 ${
                  darkMode ? "text-gray-600" : "text-gray-300"
                }`}
              >
                📝
              </div>
              <p
                className={`text-lg ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {filter === "completed"
                  ? "No completed tasks yet!"
                  : filter === "active"
                  ? "No active tasks!"
                  : "No tasks yet. Add one above!"}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-8"
        >
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Made with ❤️ using React, Tailwind & Framer Motion
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TodoApp;
