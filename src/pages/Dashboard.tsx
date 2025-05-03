import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import TaskCard, { Task } from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Plus, Calendar, Check, List } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDueDate, setSelectedDueDate] = useState('');
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Check if user is logged in with Supabase
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      setUser(session.user);
      fetchTasks(session.user.id);
    };
    
    checkUser();
  }, [navigate]);
  
  const fetchTasks = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Convert priority to the expected type to ensure compatibility
        const typedTasks = data.map(task => ({
          ...task,
          priority: task.priority as 'low' | 'medium' | 'high'
        }));
        setTasks(typedTasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        variant: "destructive",
        title: "Failed to load tasks",
        description: "There was a problem loading your tasks.",
      });
    }
  };

  const handleAddTask = async (newTask: Omit<Task, 'id'> & { id?: string }) => {
    try {
      if (newTask.id) {
        // Update existing task
        const { error } = await supabase
          .from('tasks')
          .update({
            title: newTask.title,
            description: newTask.description,
            due_date: newTask.due_date,
            priority: newTask.priority,
            completed: newTask.completed
          })
          .eq('id', newTask.id);
        
        if (error) throw error;
        
        setTasks(prevTasks => 
          prevTasks.map(task => task.id === newTask.id ? { ...newTask as Task } : task)
        );
        toast({ title: "Task updated successfully!" });
      } else {
        // Add new task
        const { data, error } = await supabase
          .from('tasks')
          .insert({
            title: newTask.title,
            description: newTask.description,
            due_date: newTask.due_date,
            priority: newTask.priority,
            completed: newTask.completed,
            user_id: user.id
          })
          .select();
        
        if (error) throw error;
        
        if (data && data[0]) {
          // Convert priority to the expected type to ensure compatibility
          const typedTask = {
            ...data[0],
            priority: data[0].priority as 'low' | 'medium' | 'high'
          };
          setTasks(prevTasks => [...prevTasks, typedTask]);
          toast({ title: "Task added successfully!" });
        }
      }
    } catch (error: any) {
      console.error('Error saving task:', error);
      toast({ 
        variant: "destructive", 
        title: "Failed to save task",
        description: error.message || "There was a problem saving your task.",
      });
    } finally {
      setEditingTask(undefined);
      setShowForm(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      toast({ title: "Task deleted" });
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast({ 
        variant: "destructive", 
        title: "Failed to delete task",
        description: error.message || "There was a problem deleting your task.",
      });
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      // Find the task to toggle
      const taskToToggle = tasks.find(task => task.id === id);
      if (!taskToToggle) return;
      
      // Update the task in Supabase
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !taskToToggle.completed })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast({ 
        variant: "destructive", 
        title: "Failed to update task",
        description: error.message || "There was a problem updating your task.",
      });
    }
  };
  
  const cancelForm = () => {
    setEditingTask(undefined);
    setShowForm(false);
  };
  
  // Filter tasks based on activeFilter
  const getFilteredTasks = () => {
    let filtered = [...tasks];
    
    // Apply tab filter
    if (activeFilter === 'upcoming') {
      filtered = filtered.filter(task => !task.completed);
    } else if (activeFilter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }
    
    // Apply search filter if there's a query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) || 
        task.description?.toLowerCase().includes(query)
      );
    }
    
    // Apply due date filter if selected
    if (selectedDueDate) {
      const selected = new Date(selectedDueDate);
      selected.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(task => {
        if (!task.due_date) return false;
        const taskDate = new Date(task.due_date);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === selected.getTime();
      });
    }
    
    // Sort tasks: first by completion status, then by due date, then by priority
    return filtered.sort((a, b) => {
      // First sort by completion status (incomplete first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then by due date (earlier first)
      const dateA = a.due_date ? new Date(a.due_date).getTime() : 0;
      const dateB = b.due_date ? new Date(b.due_date).getTime() : 0;
      if (dateA !== dateB) {
        return dateA - dateB;
      }
      
      // Then by priority
      const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const filteredTasks = getFilteredTasks();

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDueDate('');
  };

  const getTaskSummary = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const overdue = tasks.filter(task => {
      const now = new Date();
      if (!task.due_date) return false;
      const due = new Date(task.due_date);
      return !task.completed && due < now;
    }).length;
    
    return { total, completed, overdue };
  };

  const summary = getTaskSummary();

  // Handle sign out
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message || "There was a problem signing you out.",
      });
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-4 sm:p-6 bg-focusflow-gray">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-focusflow-darkgray">Your Tasks Dashboard</h1>
              <p className="text-focusflow-mediumgray mt-1">
                Manage and track your assignments and projects
              </p>
            </div>
            
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
          
          {/* Task summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-focusflow-mediumgray text-sm">Total Tasks</p>
                  <p className="text-3xl font-bold">{summary.total}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <List className="h-6 w-6 text-focusflow-blue" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-focusflow-mediumgray text-sm">Completed</p>
                  <p className="text-3xl font-bold">{summary.completed}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-focusflow-mediumgray text-sm">Overdue</p>
                  <p className="text-3xl font-bold">{summary.overdue}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Action row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="w-full md:w-auto flex space-x-2">
              <Button 
                onClick={() => {
                  setEditingTask(undefined);
                  setShowForm(true);
                }}
                className="bg-focusflow-blue hover:bg-focusflow-blue/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
            
            <div className="w-full md:w-auto flex space-x-2">
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Filter Date
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Filter by Due Date</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Select Due Date</Label>
                      <Input 
                        id="dueDate" 
                        type="date" 
                        value={selectedDueDate}
                        onChange={(e) => setSelectedDueDate(e.target.value)} 
                      />
                    </div>
                    <div className="flex justify-between mt-4">
                      <Button 
                        variant="outline" 
                        onClick={clearFilters}
                      >
                        Clear Filters
                      </Button>
                      <Button 
                        onClick={() => document.querySelector<HTMLButtonElement>('[data-state="open"] button[aria-label="Close"]')?.click()}
                        className="bg-focusflow-blue hover:bg-focusflow-blue/90"
                      >
                        Apply Filter
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              {(searchQuery || selectedDueDate) && (
                <Button 
                  variant="ghost" 
                  onClick={clearFilters}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
          
          {/* Display form for adding/editing tasks */}
          {showForm && (
            <TaskForm
              initialTask={editingTask}
              onSubmit={handleAddTask}
              onCancel={cancelForm}
            />
          )}
          
          {/* Task listings */}
          <Card>
            <CardHeader className="px-6 py-4">
              <CardTitle>Your Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue="all" 
                value={activeFilter}
                onValueChange={(value) => setActiveFilter(value as 'all' | 'upcoming' | 'completed')}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All Tasks</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="p-2">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onToggleComplete={handleToggleComplete}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-focusflow-mediumgray">No tasks found.</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="upcoming" className="p-2">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onToggleComplete={handleToggleComplete}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-focusflow-mediumgray">No upcoming tasks found.</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="completed" className="p-2">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onToggleComplete={handleToggleComplete}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-focusflow-mediumgray">No completed tasks yet.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
