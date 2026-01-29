export const TASK_STATUSES = [
    { id: 'todo', label: 'To Do' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'waiting-on-client', label: 'Waiting on Client' },
    { id: 'done', label: 'Done' },
];

export const INITIAL_TASKS = [
    {
        id: 't1',
        title: 'Finalize Q1 SEO Strategy',
        clientId: 'c1',
        clientName: 'TechFlow Systems',
        assignee: 'Sarah',
        dueDate: '2026-01-25',
        status: 'in-progress',
        priority: 'high',
        taskType: 'Ops',
        ownerRole: 'Agency',
        timelineDay: 1
    },
    {
        id: 't2',
        title: 'Set up Google Analytics',
        clientId: 'c1',
        clientName: 'TechFlow Systems',
        assignee: 'Mike',
        dueDate: '2026-01-28',
        status: 'todo',
        priority: 'medium',
        taskType: 'Ops',
        ownerRole: 'Agency',
        timelineDay: 3
    },
    {
        id: 't6',
        title: 'Upload Brand Assets',
        clientId: 'c1',
        clientName: 'TechFlow Systems',
        assignee: 'Client',
        dueDate: '2026-01-24',
        status: 'waiting-on-client',
        priority: 'high',
        taskType: 'Asset',
        ownerRole: 'Client',
        timelineDay: 2
    },
    {
        id: 't3',
        title: 'Draft blog post outlines',
        clientId: 'c2',
        clientName: 'GreenEarth Organics',
        assignee: 'Sarah',
        dueDate: '2026-01-30',
        status: 'todo',
        priority: 'low',
        taskType: 'Ops',
        ownerRole: 'Agency',
        timelineDay: 5
    },
    {
        id: 't4',
        title: 'Competitor analysis report',
        clientId: 'c3',
        clientName: 'Apex Consulting',
        assignee: 'Jasmine',
        dueDate: '2026-01-22',
        status: 'done',
        priority: 'high',
        taskType: 'Ops',
        ownerRole: 'Agency',
        timelineDay: 1
    },
    {
        id: 't5',
        title: 'Keyword research for landing pages',
        clientId: 'c4',
        clientName: 'BlueWave Logistics',
        assignee: 'Mike',
        dueDate: '2026-02-01',
        status: 'todo',
        priority: 'medium',
        taskType: 'Ops',
        ownerRole: 'Agency',
        timelineDay: 2
    },
];
