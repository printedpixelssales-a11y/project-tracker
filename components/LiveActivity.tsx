'use client';

import { useEffect, useState } from 'react';

interface Agent {
  id: string;
  name: string;
  status: 'working' | 'idle' | 'offline';
  currentActivity: string;
  lastUpdated: string;
  sessionKey: string;
  recentWork: string[];
}

interface ActivityData {
  agents: Agent[];
  lastUpdated: string;
  timestamp: number;
}

export default function LiveActivity() {
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch('/api/agents');
        const data = await res.json();
        setActivity(data);
      } catch (err) {
        console.error('Failed to fetch activity:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
    const interval = setInterval(fetchActivity, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'offline': return 'bg-slate-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'working': return '🟢 Working';
      case 'idle': return '🟡 Idle';
      case 'offline': return '⚪ Offline';
      default: return '⚪ Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading activity...</div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Failed to load activity</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Activity Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Live Agent Activity</h2>
            <p className="text-slate-400 text-sm">
              Real-time tracking of all agents working on projects
            </p>
          </div>
          <div className="text-right">
            <div className="text-slate-400 text-sm">Last updated</div>
            <div className="text-white font-mono text-sm">
              {new Date(activity.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Agents */}
      <div className="space-y-4">
        {activity.agents.map(agent => (
          <div key={agent.id} className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            {/* Agent Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`}></div>
                <div>
                  <h3 className="text-lg font-bold text-white">{agent.name}</h3>
                  <p className="text-slate-400 text-sm">{getStatusLabel(agent.status)}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-slate-400 text-sm">Last active</div>
                <div className="text-white font-mono text-sm">
                  {formatTimeAgo(new Date(agent.lastUpdated))}
                </div>
              </div>
            </div>

            {/* Current Activity */}
            {agent.status === 'working' && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                <div className="text-sm text-blue-400 font-medium mb-1">Currently Working On</div>
                <div className="text-white">{agent.currentActivity}</div>
              </div>
            )}

            {/* Recent Work */}
            {agent.recentWork.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-400 mb-3">Recent Work</h4>
                <ul className="space-y-2">
                  {agent.recentWork.map((work, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-slate-300">
                      <span className="text-slate-500">→</span>
                      <span>{work}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Status Legend */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h3 className="text-sm font-bold text-slate-400 mb-4">Status Legend</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-slate-400">Working - Agent is actively processing tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-slate-400">Idle - Agent is online but not working</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-500"></div>
            <span className="text-slate-400">Offline - Agent is not connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
