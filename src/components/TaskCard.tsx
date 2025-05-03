
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit, ArrowUp, ArrowRight, ArrowDown, Calendar } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  user_id?: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);
    
    if (taskDate.getTime() === today.getTime()) return 'Today';
    if (taskDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
    if (taskDate.getTime() === yesterday.getTime()) return 'Yesterday';
    
    return date.toLocaleDateString();
  };
  
  const isOverdue = () => {
    if (!task.due_date || task.completed) return false;
    
    const dueDate = new Date(task.due_date);
    const now = new Date();
    
    return dueDate < now;
  };
  
  const getPriorityIcon = () => {
    switch (task.priority) {
      case 'high':
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <ArrowRight className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };
  
  return (
    <Card 
      className={`mb-3 border-l-4 ${
        task.completed
          ? 'border-l-green-500 bg-green-50'
          : isOverdue()
            ? 'border-l-red-500 bg-red-50'
            : 'border-l-blue-500'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Checkbox 
              checked={task.completed}
              onCheckedChange={() => onToggleComplete(task.id)}
              className="mt-1"
            />
            
            <div className="flex-1">
              <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center mt-2 space-x-4 text-xs">
                <div className={`flex items-center ${
                  isOverdue() && !task.completed ? 'text-red-600 font-medium' : 'text-gray-500'
                }`}>
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{formatDate(task.due_date)}</span>
                </div>
                
                <div className="flex items-center text-gray-500">
                  {getPriorityIcon()}
                  <span className="ml-1 capitalize">{task.priority}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(task)}
              className={isHovered ? 'opacity-100' : 'opacity-0 sm:opacity-100'}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDelete(task.id)}
              className={`text-red-600 border-red-200 hover:bg-red-50 ${isHovered ? 'opacity-100' : 'opacity-0 sm:opacity-100'}`}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
