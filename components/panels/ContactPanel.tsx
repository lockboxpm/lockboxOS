import React from 'react';
import Panel from '../Panel';

const ContactItem: React.FC<{label: string, value: string, href?: string}> = ({label, value, href}) => (
    <div className="flex flex-col sm:flex-row sm:items-center">
        <dt className="w-full sm:w-1/4 font-mono text-cyan-400">{label}:</dt>
        <dd className="w-full sm:w-3/4 text-slate-300">
            {href ? <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline">{value}</a> : value}
        </dd>
    </div>
);


const ContactPanel: React.FC = () => {
  return (
    <Panel title="~/contact_identity">
        <div className="space-y-8 max-w-3xl">
            <div>
                <h2 className="text-2xl font-bold text-slate-100">Contact & Identity</h2>
                <p className="mt-2 text-slate-400">
                    The best way to reach me is via email. Messages sent to the web alias are routed directly to my primary inbox.
                </p>
            </div>
            <dl className="space-y-4 p-6 bg-slate-800/70 border border-slate-700 rounded-lg">
                <ContactItem label="Email" value="nick+web@lockboxpm.com" href="mailto:nick+web@lockboxpm.com" />
                <ContactItem label="Phone" value="702-720-4750" href="tel:+17027204750" />
                <ContactItem label="LinkedIn" value="linkedin.com/in/njkraemer" href="http://linkedin.com/in/njkraemer/" />
                <ContactItem label="GitHub" value="github.com/lockboxpm" href="https://github.com/lockboxpm" />
            </dl>
            <div>
                <h3 className="text-lg font-bold text-slate-200">Confidentiality & Security</h3>
                <p className="mt-2 text-slate-400">
                    I prioritize client confidentiality and the secure handling of all data. All communications and shared documents are treated with the highest level of discretion and protected using industry-best practices.
                </p>
            </div>
        </div>
    </Panel>
  );
};

export default ContactPanel;