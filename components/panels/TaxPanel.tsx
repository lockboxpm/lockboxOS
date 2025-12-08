import React from 'react';
import Panel from '../Panel';

const TaxPanel: React.FC = () => {
  return (
    <Panel title="~/tax_and_compliance">
        <div className="space-y-6 max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-100">Tax & Compliance Strategy</h2>
            <p className="text-slate-400">
                While I do not offer tax preparation services, I provide strategic consulting to ensure your financial systems are optimized for tax efficiency and compliance. My goal is to structure your operations and documentation for audit readiness and long-term financial health.
            </p>
            <div className="bg-slate-800/70 border border-slate-700 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-bold text-cyan-400 font-mono">Focus Areas</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-300">
                    <li>
                        <strong>US Expat & FEIE Strategy:</strong> Navigating the complexities of the Foreign Earned Income Exclusion and other tax considerations for Americans abroad. (Placeholder)
                    </li>
                    <li>
                        <strong>Business Structuring:</strong> Guidance on S-corps, LLCs, and cross-border entity structures to optimize tax outcomes. (Placeholder)
                    </li>
                    <li>
                        <strong>Systemizing Documentation:</strong> Implementing automated workflows to ensure meticulous record-keeping and audit readiness.
                    </li>
                    <li>
                        <strong>Compliance Frameworks:</strong> Designing and implementing systems to meet regulatory requirements in real estate and finance.
                    </li>
                </ul>
            </div>
             <p className="text-slate-400">
                Holding an active IRS Preparer Tax Identification Number (PTIN), I am equipped to offer informed strategic guidance. For detailed questions, please use the AI agent or book a discovery call.
            </p>
        </div>
    </Panel>
  );
};

export default TaxPanel;
