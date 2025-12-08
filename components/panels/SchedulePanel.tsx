import React from 'react';
import Panel from '../Panel';

const SchedulePanel: React.FC = () => {
  return (
    <Panel title="~/schedule_call">
        <div className="space-y-6 max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-100">Schedule a Discovery Call</h2>
            <p className="text-slate-400">
                Use the calendar below to book a complimentary 15-minute discovery call. We can discuss your challenges, goals, and determine if my services are the right fit for your business.
            </p>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 aspect-video w-full">
                {/* 
                    Placeholder for embedded Google Calendar / Calendly iframe.
                    Replace the content of this div with your actual iframe code.
                    Example: <iframe src="https://calendly.com/your-link" style={{ width: '100%', height: '100%', border: '0' }}></iframe>
                */}
                <div className="flex items-center justify-center h-full text-slate-500">
                    <p>Embedded Calendar Placeholder</p>
                </div>
            </div>
            <div className="text-slate-400">
                <p>My current time zone is <span className="font-semibold text-cyan-400">[America/Costa_Rica]</span>.</p>
                <p className="mt-2">
                    If you can't find a suitable time or have a specific inquiry, feel free to email me directly at <a href="mailto:nick+web@lockboxpm.com" className="text-cyan-400 hover:underline">nick+web@lockboxpm.com</a>.
                </p>
            </div>
        </div>
    </Panel>
  );
};

export default SchedulePanel;
