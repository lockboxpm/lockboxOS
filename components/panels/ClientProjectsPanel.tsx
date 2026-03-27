import React, { useState } from 'react';
import Panel from '../Panel';
import { useData } from '../../contexts/DataContext';
import type { ProjectRequest, ProjectStatus, Business } from '../../types';

const PROJECT_TYPES = [
    { value: 'consulting', label: 'Consulting', icon: '💼' },
    { value: 'development', label: 'Development', icon: '💻' },
    { value: 'integration', label: 'Integration', icon: '🔗' },
    { value: 'automation', label: 'Automation', icon: '⚡' },
    { value: 'support', label: 'Support', icon: '🛠️' },
    { value: 'other', label: 'Other', icon: '📋' }
] as const;

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
    draft: { label: 'Draft', color: 'text-slate-400', bg: 'bg-slate-500/20' },
    submitted: { label: 'Submitted', color: 'text-blue-400', bg: 'bg-blue-500/20' },
    in_review: { label: 'In Review', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    approved: { label: 'Approved', color: 'text-green-400', bg: 'bg-green-500/20' },
    in_progress: { label: 'In Progress', color: 'text-purple-400', bg: 'bg-purple-500/20' },
    completed: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-500/20' }
};

const StatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
    const config = STATUS_CONFIG[status];
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color} ${config.bg}`}>
            {config.label}
        </span>
    );
};

const ProjectCard: React.FC<{
    project: ProjectRequest;
    businesses: Business[];
    onUpdate: (updates: Partial<ProjectRequest>) => void;
    onDelete: () => void;
}> = ({ project, businesses, onUpdate, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const linkedBusiness = businesses.find(b => b.id === project.businessId);
    const typeConfig = PROJECT_TYPES.find(t => t.value === project.type);

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-colors">
            <div
                className="p-4 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="text-2xl mt-0.5">{typeConfig?.icon || '📋'}</div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white truncate">{project.title}</h3>
                            <p className="text-sm text-slate-400 line-clamp-2">{project.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                {linkedBusiness && (
                                    <span className="flex items-center gap-1">
                                        <span>🏢</span> {linkedBusiness.name}
                                    </span>
                                )}
                                <span>📅 {new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <StatusBadge status={project.status} />
                </div>
            </div>

            {isExpanded && (
                <div className="px-4 pb-4 border-t border-slate-700 pt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-slate-500">Type:</span>
                            <span className="ml-2 text-slate-300">{typeConfig?.label}</span>
                        </div>
                        <div>
                            <span className="text-slate-500">Budget:</span>
                            <span className="ml-2 text-slate-300">{project.budget || 'Not specified'}</span>
                        </div>
                        <div>
                            <span className="text-slate-500">Timeline:</span>
                            <span className="ml-2 text-slate-300">{project.timeline || 'Flexible'}</span>
                        </div>
                        <div>
                            <span className="text-slate-500">Updated:</span>
                            <span className="ml-2 text-slate-300">{new Date(project.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {project.notes && (
                        <div className="p-3 bg-slate-900/50 rounded-lg">
                            <span className="text-xs text-slate-500 block mb-1">Notes</span>
                            <p className="text-sm text-slate-300">{project.notes}</p>
                        </div>
                    )}

                    {project.status === 'draft' && (
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); onUpdate({ status: 'submitted' }); }}
                                className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Submit Request
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                                className="px-4 py-2 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-lg text-sm transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const ClientProjectsPanel: React.FC = () => {
    const { user, addProjectRequest, updateProjectRequest, deleteProjectRequest } = useData();
    const [showNewForm, setShowNewForm] = useState(false);
    const [filter, setFilter] = useState<'all' | ProjectStatus>('all');
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        type: 'consulting' as ProjectRequest['type'],
        budget: '',
        timeline: '',
        businessId: ''
    });

    if (!user) {
        return (
            <Panel title="~/my_projects">
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="text-6xl mb-4">📋</div>
                    <h2 className="text-2xl font-bold text-slate-100 mb-2">Sign In Required</h2>
                    <p className="text-slate-400 max-w-md">
                        Please log in or create an account to view and manage your project requests.
                    </p>
                </div>
            </Panel>
        );
    }

    const filteredProjects = filter === 'all'
        ? user.projectRequests
        : user.projectRequests.filter(p => p.status === filter);

    const handleCreateProject = () => {
        if (!newProject.title.trim() || !newProject.description.trim()) return;

        addProjectRequest({
            title: newProject.title,
            description: newProject.description,
            type: newProject.type,
            status: 'draft',
            budget: newProject.budget || undefined,
            timeline: newProject.timeline || undefined,
            businessId: newProject.businessId || undefined
        });

        setNewProject({ title: '', description: '', type: 'consulting', budget: '', timeline: '', businessId: '' });
        setShowNewForm(false);
    };

    const statusCounts = {
        all: user.projectRequests.length,
        draft: user.projectRequests.filter(p => p.status === 'draft').length,
        submitted: user.projectRequests.filter(p => p.status === 'submitted').length,
        in_review: user.projectRequests.filter(p => p.status === 'in_review').length,
        approved: user.projectRequests.filter(p => p.status === 'approved').length,
        in_progress: user.projectRequests.filter(p => p.status === 'in_progress').length,
        completed: user.projectRequests.filter(p => p.status === 'completed').length,
        cancelled: user.projectRequests.filter(p => p.status === 'cancelled').length
    };

    return (
        <Panel title="~/my_projects">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">My Projects</h1>
                        <p className="text-slate-400 text-sm">Track and manage your project requests</p>
                    </div>
                    <button
                        onClick={() => setShowNewForm(!showNewForm)}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-cyan-500/20"
                    >
                        + New Request
                    </button>
                </div>

                {/* New Project Form */}
                {showNewForm && (
                    <div className="p-6 bg-slate-800/50 border border-cyan-500/30 rounded-xl space-y-4">
                        <h3 className="font-semibold text-white mb-4">Create New Project Request</h3>

                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Project Title *</label>
                            <input
                                type="text"
                                value={newProject.title}
                                onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="e.g., ERP Integration Project"
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white"
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Description *</label>
                            <textarea
                                value={newProject.description}
                                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe your project requirements..."
                                rows={3}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Project Type</label>
                                <select
                                    value={newProject.type}
                                    onChange={(e) => setNewProject(prev => ({ ...prev, type: e.target.value as ProjectRequest['type'] }))}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white"
                                >
                                    {PROJECT_TYPES.map(t => (
                                        <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Linked Business</label>
                                <select
                                    value={newProject.businessId}
                                    onChange={(e) => setNewProject(prev => ({ ...prev, businessId: e.target.value }))}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white"
                                >
                                    <option value="">-- None --</option>
                                    {user.businesses.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Budget Range</label>
                                <input
                                    type="text"
                                    value={newProject.budget}
                                    onChange={(e) => setNewProject(prev => ({ ...prev, budget: e.target.value }))}
                                    placeholder="e.g., $5,000 - $10,000"
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Timeline</label>
                                <input
                                    type="text"
                                    value={newProject.timeline}
                                    onChange={(e) => setNewProject(prev => ({ ...prev, timeline: e.target.value }))}
                                    placeholder="e.g., 2-3 weeks"
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleCreateProject}
                                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors"
                            >
                                Create Draft
                            </button>
                            <button
                                onClick={() => setShowNewForm(false)}
                                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Status Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                    {(['all', 'draft', 'submitted', 'in_review', 'in_progress', 'completed'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === status
                                    ? 'bg-cyan-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            {status === 'all' ? 'All' : STATUS_CONFIG[status].label}
                            <span className="ml-1.5 opacity-70">({statusCounts[status]})</span>
                        </button>
                    ))}
                </div>

                {/* Projects List */}
                <div className="space-y-3">
                    {filteredProjects.length === 0 ? (
                        <div className="p-12 text-center bg-slate-800/30 rounded-xl border border-dashed border-slate-600">
                            <div className="text-5xl mb-4">📭</div>
                            <p className="text-slate-400 text-lg">No projects found</p>
                            <p className="text-sm text-slate-500 mt-1">
                                {filter === 'all' ? 'Create your first project request to get started' : `No projects with status "${STATUS_CONFIG[filter]?.label || filter}"`}
                            </p>
                        </div>
                    ) : (
                        filteredProjects
                            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                            .map(project => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    businesses={user.businesses}
                                    onUpdate={(updates) => updateProjectRequest(project.id, updates)}
                                    onDelete={() => deleteProjectRequest(project.id)}
                                />
                            ))
                    )}
                </div>
            </div>
        </Panel>
    );
};

export default ClientProjectsPanel;
