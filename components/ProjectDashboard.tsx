'use client';

import { useEffect, useState } from 'react';

interface Project {
  id: string;
  name: string;
  status: 'in-progress' | 'dormant' | 'planning' | 'complete';
  description: string;
  progress: number;
  hoursSpent: number;
  estimatedHoursRemaining: number;
  revenueModel: string;
  estimatedMonthlyRevenue: number;
  actualMonthlyRevenue: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  blockers: string[];
  nextSteps: string[];
}

export default function ProjectDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch projects.json from public directory
    fetch('/projects.json')
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load projects:', err);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-blue-500';
      case 'complete': return 'bg-green-500';
      case 'planning': return 'bg-yellow-500';
      case 'dormant': return 'bg-slate-500';
      default: return 'bg-slate-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-500/10';
      case 'high': return 'text-orange-400 bg-orange-500/10';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'low': return 'text-green-400 bg-green-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading projects...</div>
      </div>
    );
  }

  // Calculate totals
  const totalHours = projects.reduce((sum, p) => sum + p.hoursSpent, 0);
  const totalProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length);
  const estimatedRevenue = projects.reduce((sum, p) => sum + p.estimatedMonthlyRevenue, 0);
  const inProgressCount = projects.filter(p => p.status === 'in-progress').length;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="text-slate-400 text-sm mb-2">Total Hours</div>
          <div className="text-3xl font-bold text-white">{totalHours.toFixed(1)}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="text-slate-400 text-sm mb-2">Avg Progress</div>
          <div className="text-3xl font-bold text-white">{totalProgress}%</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="text-slate-400 text-sm mb-2">Est. Monthly Revenue</div>
          <div className="text-3xl font-bold text-green-400">${estimatedRevenue}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="text-slate-400 text-sm mb-2">Active Projects</div>
          <div className="text-3xl font-bold text-blue-400">{inProgressCount}</div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        {projects.map(project => (
          <div key={project.id} className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{project.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(project.priority)}`}>
                    {project.priority.toUpperCase()}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded text-white ${getStatusColor(project.status)}`}>
                    {project.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">{project.description}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-slate-400 text-sm">Progress</span>
                <span className="text-white font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
              <div>
                <div className="text-slate-400 mb-1">Time Investment</div>
                <div className="text-white font-medium">
                  {project.hoursSpent}h spent / {project.estimatedHoursRemaining}h remaining
                </div>
              </div>
              <div>
                <div className="text-slate-400 mb-1">Revenue Model</div>
                <div className="text-white font-medium">{project.revenueModel}</div>
              </div>
              <div>
                <div className="text-slate-400 mb-1">Est. Monthly</div>
                <div className="text-green-400 font-medium">${project.estimatedMonthlyRevenue}</div>
              </div>
            </div>

            {/* Blockers & Next Steps */}
            <div className="grid md:grid-cols-2 gap-4 border-t border-slate-800 pt-4">
              {project.blockers.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-red-400 mb-2">Blockers</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    {project.blockers.map((blocker, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span>•</span>
                        <span>{blocker}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {project.nextSteps.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-green-400 mb-2">Next Steps</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    {project.nextSteps.slice(0, 3).map((step, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span>→</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
