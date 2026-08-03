import React from 'react';
import { Calendar, Clock, BookOpen, User, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Homework } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/StatCard';
import { Button } from '../ui/Button';

export const HomeworkCard: React.FC<{ homework: Homework }> = ({ homework }) => {
  const navigate = useNavigate();

  const formattedDue = new Date(homework.dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card hoverElevate glow className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="indigo" icon={<BookOpen className="w-3 h-3" />}>
            {homework.batchName}
          </Badge>
          <Badge
            variant={
              homework.status === 'graded'
                ? 'emerald'
                : homework.status === 'overdue'
                ? 'rose'
                : 'amber'
            }
          >
            {homework.status === 'graded' ? `Graded (${homework.myGrade}/100)` : homework.status.replace('_', ' ')}
          </Badge>
        </div>

        <h3 className="text-base font-bold text-slate-100 mb-2 light:text-slate-900">{homework.title}</h3>
        <p className="text-xs text-slate-400 mb-4 line-clamp-2 light:text-slate-600">{homework.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              {homework.mentorName}
            </span>
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              Due: {formattedDue}
            </span>
          </div>

          <ProgressBar
            value={homework.submittedCount}
            max={homework.totalStudents}
            label={`Batch Progress (${homework.submittedCount}/${homework.totalStudents} submitted)`}
          />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between light:border-slate-200">
        <span className="text-xs text-slate-400">{homework.totalQuestions} Questions</span>
        <Button
          size="sm"
          variant="primary"
          onClick={() => navigate(`/workspace/${homework.questions[0]?.id || 'q-101'}`)}
        >
          {homework.status === 'graded' ? 'View Feedback' : 'Start Homework'}
        </Button>
      </div>
    </Card>
  );
};
