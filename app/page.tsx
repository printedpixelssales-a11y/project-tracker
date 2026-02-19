'use client';

import { useState, useEffect } from 'react';
import ProjectDashboard from '@/components/ProjectDashboard';
import LiveActivity from '@/components/LiveActivity';
import Navigation from '@/components/Navigation';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Project Tracker</h1>
          <p className="text-slate-400">Monitor projects, agent activity, and progress</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'activity'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Live Activity
          </button>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && <ProjectDashboard />}
        {activeTab === 'activity' && <LiveActivity />}
      </main>
    </div>
  );
}
