import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Read projects.json from public folder
    const projectsData = await import('@/public/projects.json');
    
    return NextResponse.json(projectsData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error loading projects:', error);
    
    // Fallback to empty projects
    return NextResponse.json({
      lastUpdated: new Date().toISOString(),
      projects: [],
      metadata: {
        totalHoursSpent: 0,
        totalEstimatedHours: 0,
        estimatedTotalMonthlyRevenue: 0,
        criticalProjects: [],
        nextMilestones: [],
      },
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
