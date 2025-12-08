import React, { useState } from 'react';
import Panel from '../Panel';
import type { Project } from '../../types';
import { useData } from '../../contexts/DataContext';

const ProjectCard: React.FC<{ project: Project, isAdmin: boolean, onDelete: () => void }> = ({ project, isAdmin, onDelete }) => (
    <div 
        className="relative flex flex-col p-3 bg-slate-800/50 border border-transparent hover:border-cyan-400/50 hover:bg-slate-700/50 rounded-lg transition-all duration-200 group h-full"
    >
        {isAdmin && (
            <button 
                onClick={(e) => { e.preventDefault(); onDelete(); }}
                className="absolute top-2 right-2 z-10 p-1 bg-red-900/50 text-red-200 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-800"
                title="Delete Project"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        )}
        <a 
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start h-full"
        >
            <div className="mr-4 text-cyan-400 mt-1">
                {/* Default icon if none provided */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg>
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-slate-200 group-hover:text-cyan-400">{project.title}</h3>
                <p className="text-sm text-slate-400 mb-3">{project.description}</p>
                {project.stack.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-2">
                        {project.stack.map(tech => (
                            <span key={tech} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">{tech}</span>
                        ))}
                    </div>
                )}
            </div>
        </a>
    </div>
);

const ProjectsPanel: React.FC = () => {
    const { projects, addProject, deleteProject, isAdmin, user } = useData();
    const [isAdding, setIsAdding] = useState(false);
    const [newProject, setNewProject] = useState<Project>({
        title: '', description: '', stack: [], url: '#'
    });
    const [stackInput, setStackInput] = useState('');

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addProject({
            ...newProject,
            stack: stackInput.split(',').map(s => s.trim()).filter(s => s !== '')
        });
        setIsAdding(false);
        setNewProject({ title: '', description: '', stack: [], url: '#' });
        setStackInput('');
    };

  return (
    <Panel title="~/apps_and_projects">
        <div className="space-y-8 relative">
            <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                <div>
                     <h2 className="text-xl font-bold text-slate-100">Apps, Projects & Ventures</h2>
                     {user && <p className="text-sm text-cyan-400">Curated for: {user.username}</p>}
                </div>
                {isAdmin && (
                    <button 
                        onClick={() => setIsAdding(!isAdding)}
                        className="bg-slate-800 hover:bg-cyan-900/50 text-cyan-400 border border-slate-600 px-3 py-1 rounded text-sm flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Add Project
                    </button>
                )}
            </div>

            {/* Admin Add Form */}
            {isAdding && (
                <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-500/30 mb-6 animate-fade-in">
                    <h3 className="text-cyan-400 font-mono text-sm mb-3">New Project Entry</h3>
                    <form onSubmit={handleAddSubmit} className="space-y-3">
                        <input 
                            placeholder="Project Title" 
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm"
                            value={newProject.title}
                            onChange={e => setNewProject({...newProject, title: e.target.value})}
                            required
                        />
                         <input 
                            placeholder="Description" 
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm"
                            value={newProject.description}
                            onChange={e => setNewProject({...newProject, description: e.target.value})}
                            required
                        />
                        <input 
                            placeholder="Tech Stack (comma separated)" 
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm"
                            value={stackInput}
                            onChange={e => setStackInput(e.target.value)}
                        />
                         <input 
                            placeholder="URL" 
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm"
                            value={newProject.url}
                            onChange={e => setNewProject({...newProject, url: e.target.value})}
                        />
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setIsAdding(false)} className="text-xs text-slate-400 hover:text-white">Cancel</button>
                            <button type="submit" className="bg-cyan-600 text-white px-3 py-1 rounded text-sm">Save</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project, index) => (
                    <ProjectCard 
                        key={index} 
                        project={project} 
                        isAdmin={isAdmin}
                        onDelete={() => deleteProject(index)}
                    />
                ))}
            </div>
            
            {projects.length === 0 && (
                <p className="text-slate-500 italic text-center py-8">No active projects listed.</p>
            )}
        </div>
    </Panel>
  );
};

export default ProjectsPanel;