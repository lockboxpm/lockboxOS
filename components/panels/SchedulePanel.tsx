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
                <div className="bg-white border border-slate-700 rounded-lg overflow-hidden w-full">
                    <iframe
                        src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0ne_A_zPFE3uOvIixVmfjkqeg7q7G1qy0DK1hb7DcZgrNloHeJYeoCdrRPoV_2uxPbfzscreti?gv=true"
                        style={{ border: 0, width: '100%', height: '600px' }}
                        title="Schedule an Appointment"
                    ></iframe>
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
