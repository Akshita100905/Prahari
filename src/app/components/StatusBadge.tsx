import { Check, Loader2, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'loading' | 'error';
  text: string;
  description?: string;
  icon?: React.ReactNode;
}

export function StatusBadge({ status, text, description, icon }: StatusBadgeProps) {
  const styles = {
    active: 'bg-green-50 text-green-700 border-green-200',
    inactive: 'bg-gray-50 text-gray-700 border-gray-200',
    loading: 'bg-blue-50 text-blue-700 border-blue-200',
    error: 'bg-red-50 text-red-700 border-red-200',
  };

  const icons = {
    active: <Check className="w-4 h-4" />,
    inactive: <div className="w-2 h-2 bg-gray-400 rounded-full" />,
    loading: <Loader2 className="w-4 h-4 animate-spin" />,
    error: <AlertCircle className="w-4 h-4" />,
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-medium text-sm ${styles[status]}`}>
      {icon || icons[status]}
      <span>{text}</span>
      {description && <span className="text-xs opacity-75">• {description}</span>}
    </div>
  );
}
