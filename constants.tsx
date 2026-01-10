import React from 'react';
import type { Panel, Project, Service, Client, Product, Venture, CvExperience, CvEducation, CvSkillCategory, IntegrationCategory } from './types';

const HomeIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.9l7-7.2 7 7.2" /><path d="M5 11v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /><path d="M10 18v-4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4" /></svg>;
const CvIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>;
const ProjectsIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12v-4Z" /><path d="M20 12h-6a2 2 0 0 1-2-2V4" /><path d="m14 18 3 3 3-3" /></svg>;
const ConsultingIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /><path d="M5 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /><line x1="17" x2="22" y1="8" y2="8" /><line x1="19.5" x2="19.5" y1="5.5" y2="10.5" /></svg>;
const TaxIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M16 13h-3.5a.5.5 0 0 0 0 1h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 0 0 1h3.5" /><path d="M12 13v4" /></svg>;
const ScheduleIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M10 14h4" /><path d="M7 14h.01" /><path d="M7 18h.01" /><path d="M10 18h4" /><path d="M13 18h.01" /></svg>;
const ContactIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
const ConsoleIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>;
const IntegrationsIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8L22 12L18 16" /><path d="M6 8L2 12L6 16" /><path d="M14.5 4L9.5 20" /></svg>;
const ClientsIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>;
const IntakeIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const StoreIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>;
const RetreatsIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const LendingIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
const ProfileIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const MyProjectsIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /><line x1="12" y1="11" x2="12" y2="17" /><line x1="9" y1="14" x2="15" y2="14" /></svg>;
const AdminIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>;

const AppIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg>;
const LinkIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" /></svg>;

export const PANELS: Panel[] = [
    { id: 'home', title: 'System Overview', icon: HomeIcon },
    { id: 'intake', title: 'Project Intake', icon: IntakeIcon },
    { id: 'store', title: 'Merch Store', icon: StoreIcon },
    { id: 'cv', title: 'Profile / CV', icon: CvIcon },
    { id: 'clients', title: 'Clients & Projects', icon: ClientsIcon },
    { id: 'tech-consulting', title: 'Tech Consulting', icon: ConsultingIcon },
    { id: 'realestate-consulting', title: 'Real Estate Services', icon: RetreatsIcon },
    { id: 'tax', title: 'Accounting Services', icon: TaxIcon },
    { id: 'retreats', title: 'Corporate Retreats', icon: RetreatsIcon },
    { id: 'lending', title: 'Lending Partners', icon: LendingIcon },
    { id: 'communicate', title: 'Communicate', icon: ContactIcon },
    // Client Portal
    { id: 'profile', title: 'My Profile', icon: ProfileIcon },
    { id: 'myprojects', title: 'My Projects', icon: MyProjectsIcon },
    // Admin Only
    { id: 'admin', title: 'Admin Dashboard', icon: AdminIcon },
];

export const PROJECTS: Project[] = [
    {
        icon: AppIcon,
        title: 'Financial/Accounting Automation',
        description: 'AI-driven reconciliation and reporting tools for AppFolio and QuickBooks.',
        stack: ['Playwright', 'Python', 'N8N', 'Docker'],
        url: '#'
    },
    {
        icon: AppIcon,
        title: 'AI & Agentic Workflows',
        description: 'Custom AI agents for automating complex business processes and data analysis.',
        stack: ['LangChain', 'OpenAI API', 'Gemini API', 'VectorDBs'],
        url: '#'
    },
    {
        icon: AppIcon,
        title: 'Inspection / Compliance Tools',
        description: 'Mobile-first inspection tools with automated compliance report generation.',
        stack: ['React Native', 'Firebase', 'Google Cloud'],
        url: '#'
    },
    {
        icon: AppIcon,
        title: 'Data & Infrastructure Projects',
        description: 'Secure data pipelines and infrastructure management for regulated industries.',
        stack: ['Heroku', 'GitHub Actions', 'Terraform', 'AWS'],
        url: '#'
    },
];

export const SERVICES: Service[] = [
    {
        title: "Financial Systems Audit & Cleanup",
        forWho: "Founders & operators with messy books or complex transaction histories.",
        problems: ["Inaccurate financial reporting", "Compliance risks", "Wasted time on manual reconciliation"],
        includes: ["Full audit of current financial stack (QBO, Xero, etc.)", "Systematized cleanup plan", "Automation recommendations"],
        engagement: "2-4 Weeks Project"
    },
    {
        title: "AI & Agentic Workflow Design",
        forWho: "Businesses looking to leverage LLMs for operational efficiency.",
        problems: ["Repetitive manual tasks", "Data silos", "Slow decision-making"],
        includes: ["Process analysis and opportunity mapping", "Custom AI agent design and proof-of-concept", "Integration with existing systems (CRM, ERP)"],
        engagement: "4-8 Weeks Project"
    },
    {
        title: "Playwright Automation for Operations",
        forWho: "Companies relying on web-based platforms without robust APIs.",
        problems: ["Manual data entry and extraction", "Inconsistent reporting from third-party dashboards", "Compliance checks"],
        includes: ["Development of robust browser automation scripts", "Deployment in a secure, containerized environment", "Ongoing maintenance and support"],
        engagement: "Ongoing Retainer or Project-based"
    },
    {
        title: "Fractional C-Suite & Interim Leadership",
        forWho: "Organizations needing executive direction during transitions, crises, or scaling.",
        problems: ["Leadership vacuums", "Strategic drift", "Operational bottlenecks", "Lack of financial oversight"],
        includes: ["Fractional CFO (Finance/Tax/Audit)", "Interim COO (Operations/Systems)", "Interim CEO (Crisis Management/Vision)"],
        engagement: "Monthly Retainer or Interim Contract"
    }
];

export const CLIENTS: Client[] = [
    {
        name: 'Structure Properties',
        description: 'A leading property management and real estate services firm.',
        url: 'https://www.structureproperties.com',
        role: 'Workflow & Financial Consultant',
        scannedData: { logoUrl: 'https://www.google.com/s2/favicons?domain=structureproperties.com&sz=128', status: 'Online' }
    },
    {
        name: 'Sierra Morena Tower',
        description: 'Luxury high-rise residential development in Costa Rica.',
        url: 'https://www.sierramorenatower.com',
        role: 'Director of Infrastructure & Finance',
        scannedData: { logoUrl: 'https://www.google.com/s2/favicons?domain=sierramorenatower.com&sz=128', status: 'Online' }
    },
    {
        name: 'ShellCatch',
        description: 'Ocean sustainability technology and seafood traceability solutions.',
        url: 'https://www.shellcatch.org',
        role: 'Systems & Automation Consultant',
        scannedData: { logoUrl: 'https://www.google.com/s2/favicons?domain=shellcatch.org&sz=128', status: 'Online' }
    },
    {
        name: 'GivePower',
        description: 'Nonprofit providing solar energy and clean water solutions globally.',
        url: 'https://www.givepower.org',
        role: 'Technology & Operations Advisor',
        scannedData: { logoUrl: 'https://www.google.com/s2/favicons?domain=givepower.org&sz=128', status: 'Online' }
    },
    {
        name: 'Rapido',
        description: 'Latin American last-mile delivery and logistics platform.',
        url: 'https://www.rapido.com',
        role: 'Systems Architecture Consultant',
        scannedData: { logoUrl: 'https://www.google.com/s2/favicons?domain=rapido.com&sz=128', status: 'Online' }
    },
    {
        name: 'The Adult Card Game',
        description: 'Party card game brand and entertainment products.',
        url: 'https://www.theadultcardgame.com',
        role: 'E-commerce & Operations Consultant',
        scannedData: { logoUrl: 'https://www.google.com/s2/favicons?domain=theadultcardgame.com&sz=128', status: 'Online' }
    },
    {
        name: 'Federal Aviation Administration',
        description: 'US government agency regulating civil aviation and air safety.',
        url: 'https://www.faa.gov',
        role: 'Systems Integration Contractor',
        scannedData: { logoUrl: 'https://www.google.com/s2/favicons?domain=faa.gov&sz=128', status: 'Online' }
    },
    {
        name: 'Etheric Networks',
        description: 'Wireless internet service provider and network infrastructure.',
        url: 'https://www.ethericnetworks.com',
        role: 'Operations & Technology Consultant',
        scannedData: { logoUrl: 'https://www.google.com/s2/favicons?domain=ethericnetworks.com&sz=128', status: 'Online' }
    },
    {
        name: 'Flagstone Roofing',
        description: 'Premium roofing solutions and construction services.',
        url: 'https://flagstoneroofing.com',
        role: 'Systems & Operations Consultant',
        scannedData: { logoUrl: 'https://www.google.com/s2/favicons?domain=flagstoneroofing.com&sz=128', status: 'Online' }
    },
    {
        name: 'L3Harris Technologies',
        description: 'Global aerospace and defense technology company.',
        url: 'https://www.l3harris.com',
        role: 'Systems Integration Contractor',
        scannedData: { logoUrl: 'https://www.google.com/s2/favicons?domain=l3harris.com&sz=128', status: 'Online' }
    }
];

export const PRODUCTS: Product[] = [
    {
        id: 'prod_001',
        name: 'LockboxPM // Cyber Deck Hoodie',
        price: 65.00,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600',
        category: 'Apparel',
        description: 'Premium heavyweight cotton hoodie. Embroidered Kali Linux inspired dragon on back. Terminal command font on chest.'
    },
    {
        id: 'prod_002',
        name: 'System Admin Mug [Black]',
        price: 24.00,
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=600',
        category: 'Accessories',
        description: 'Matte black ceramic mug. "sudo coffee" print. Microwave and dishwasher safe.'
    },
    {
        id: 'prod_003',
        name: 'Operator Snapback Cap',
        price: 35.00,
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600',
        category: 'Apparel',
        description: 'Flat brim snapback with 3D puff embroidery. Tactical style.'
    },
    {
        id: 'prod_004',
        name: 'Laptop Sticker Pack v1.0',
        price: 12.00,
        image: 'https://images.unsplash.com/photo-1572375992501-2b58fb4c7688?auto=format&fit=crop&q=80&w=600',
        category: 'Stickers',
        description: 'Vinyl die-cut stickers. Includes LockboxPM logo, Kali dragon, and "rm -rf /" warning label.'
    }
];

// --- NEW DYNAMIC CONSTANTS ---

export const INITIAL_VENTURES: Venture[] = [
    { id: 'v1', name: 'Puma Malas', url: 'https://www.pumamala.com', status: 'loaded', logoUrl: 'https://www.google.com/s2/favicons?domain=pumamala.com&sz=128' },
    { id: 'v2', name: 'Sierra Morena Tower', url: 'https://www.sierramorenatower.com', status: 'loaded', logoUrl: 'https://www.google.com/s2/favicons?domain=sierramorenatower.com&sz=128' },
    { id: 'v3', name: 'My Digital Security', url: 'https://mydigitalsecurity.pro', status: 'loaded', logoUrl: '/mydigitalsecurity-logo.png', summary: 'Digital and physical security solutions with remote monitoring and self-installation kits.', products: ['Remote Network Monitoring', 'Security Self-Installation Kits', 'Remote Tech Support'] }
];

export const INITIAL_CV_EXPERIENCE: CvExperience[] = [
    {
        id: 'exp-scuba',
        role: 'SSI Open Water Scuba Instructor',
        company: 'Private Instructor | Worldwide',
        period: '2014 - Present',
        responsibilities: [
            'Diving since February 1996 with over 1000 dives.',
            'Commercial diving and underwater archeology experience.',
            'Certified instructor training students worldwide.'
        ]
    },
    {
        id: 'exp2',
        role: 'Technical Director & President',
        company: 'Selva Oculta de Sueños, SRL | Costa Rica',
        period: '2020 - Present',
        responsibilities: [
            'Lead technological development and research initiatives for nature-inspired products.',
            'Spearheaded development of Puma Mala wellness center in Ojochal.',
            'Commercial infrastructure planning for resort style adventure park.',
            'Corporate Operations, HR & Bookkeeping.'
        ]
    },
    {
        id: 'exp3',
        role: 'CEO',
        company: 'My Digital Security Pro, LLC | NV & CA',
        period: '2019 - Present',
        responsibilities: [
            'Product & Business Development, Operations, HR & Bookkeeping.',
            'Managing and driving product development and sales phases.'
        ]
    },
    {
        id: 'exp1',
        role: 'Brokerage Director & VP',
        company: 'Martello Group | California',
        period: '2022 - 2024',
        responsibilities: [
            'Optimized project profitability by implementing SAP advanced financial analysis tools.',
            'Utilized statistical forecasting models (ARIMA) for financial performance.',
            'Implemented Kyriba treasury management system to optimize cash flow.',
            'Developed comprehensive financial risk models (VaR, stress testing).'
        ]
    },
    {
        id: 'exp4',
        role: 'CEO',
        company: 'Onsite Property Systems | California',
        period: '2010 - 2022',
        responsibilities: [
            'Orchestrated company growth by applying advanced financial modeling (150% revenue increase).',
            'Implemented sophisticated financial planning using Adaptive Insights.',
            'Utilized Tableau for advanced financial data visualization.'
        ]
    },
    {
        id: 'exp-doorman',
        role: 'Partner',
        company: 'Doorman Property Management | San Francisco, CA',
        period: '2010 - Present',
        responsibilities: [
            'Ascertain, negotiate and execute management and construction contracts.',
            'Maintain relationships with real estate professionals and property owners.',
            'Oversee all accounting and financing, including budgeting and payroll.',
            'Plan, manage, implement and supervise construction and maintenance projects.'
        ]
    },
    {
        id: 'exp5',
        role: 'CTO',
        company: 'PRISM PROJECTS | Worldwide',
        period: '2014 - 2019',
        responsibilities: [
            'Digital Application and Web Engineering and Development.',
            'Implementation of Artificially Intelligent Business Automation.',
            'Primary technician, supervising small team of programmers.'
        ]
    },
    {
        id: 'exp-ggb',
        role: 'Operator / First Responder',
        company: 'Golden Gate Bridge | San Rafael & San Francisco, CA',
        period: '2005 - Present',
        responsibilities: [
            'First responder/EMT to Medical and all other Roadway Emergencies in the Golden Gate Corridor.',
            'Suicide Negotiator and crisis intervention specialist.',
            'Contract (MOU) negotiations between Unions and bridge management (Union Shop Steward).',
            'Daily Management of traffic diversion personnel (Crews of 3-4) and safety supervision.',
            'Firefighting suppression (Automotive, Structural and Wild Lands) and vehicle extrication.'
        ]
    },
    {
        id: 'exp-emt',
        role: 'Emergency Medical Technician Basic / BLS Instructor',
        company: 'San Francisco Paramedic Association | San Francisco, CA',
        period: '2008',
        responsibilities: [
            'Emergency Medical Technician Basic certification.',
            'BLS Instructor Certification.',
            'Emergency medical response and patient care.'
        ]
    },
    {
        id: 'exp-sierra',
        role: 'Owner',
        company: 'Sierra Moreno Management | San Francisco & Woodside, CA',
        period: '2002 - 2011',
        responsibilities: [
            'Ascertain, negotiate and execute leases and construction contracts.',
            'Maintain relationships with large organizations in the communication & wireless business.',
            'Plan, manage, implement and supervise industrial construction and maintenance projects.',
            'Handle all accounting and financing, including budgeting, payroll and monthly/annual reporting.'
        ]
    },
    {
        id: 'exp-biofuels',
        role: 'President',
        company: 'Bay Born Biofuels, LLC | Pacifica & San Francisco, CA',
        period: '2008 - 2009',
        responsibilities: [
            'Handle all accounting & financing, including budgeting, payroll, monthly and annual reporting.',
            'Coordinate with government organizations for permitting, project bids and regulation adherence.',
            'Develop and oversee partnership and partial merger with Whole Energy Fuels, Inc.',
            'Assist in coordination of industrial construction planning for a coastal Biodiesel Refinery.',
            'Manage sales crew of 17 with territories throughout the bay area.'
        ]
    },
    {
        id: 'exp-teacher',
        role: 'Math Teacher',
        company: 'California Education | Los Altos, CA',
        period: '2006 - 2007',
        responsibilities: [
            'Take students through semester length mathematical courses (Algebra, Calculus, Geometry).',
            'Evaluate, grade and guide learning, while developing daily learning plans.',
            'Work with special needs students and develop individualized learning plans.'
        ]
    },
    {
        id: 'exp-nps',
        role: 'Interpreter',
        company: 'National Park Service, US Interior | Alcatraz, San Francisco, CA',
        period: '2005',
        responsibilities: [
            'Public speaking to groups of 300-500 people, 3-5 times daily.',
            'Hosting public tours while ensuring guest safety.',
            'Computer support and technical advising to park rangers.'
        ]
    },
    {
        id: 'exp-pm',
        role: 'Project Manager',
        company: 'Self-Employed | Santa Barbara & San Carlos, CA',
        period: '2001 - 2005',
        responsibilities: [
            'Component and materials sourcing for construction and complex fabrication projects.',
            'Compile complicated estimations for direct and indirect project related costs.',
            'Budgeting, payroll, contract negotiations and finance management.',
            'Project design including engineering and architecture.'
        ]
    },
    {
        id: 'exp-kraemer',
        role: 'Apprentice',
        company: 'Kraemer Construction | San Mateo, CA',
        period: '1996 - 2005',
        responsibilities: [
            'Materials sourcing for various construction and fabrication projects.',
            'Full construction experience: Demolition, Framing, Electrical, Plumbing, Tiling, Masonry.'
        ]
    },
    {
        id: 'exp-superstuff',
        role: 'Owner',
        company: 'Super Stuff Productions | Burlingame, CA',
        period: '1997 - 2000',
        responsibilities: [
            'Building an online retail outlet from the ground up.',
            'Build and maintain the website and shopping cart system.',
            'Managing a small part-time team of warehouse employees.'
        ]
    },
    {
        id: 'exp-tech',
        role: 'Computer Technician/Specialist',
        company: 'Self-Employed | Burlingame, CA',
        period: '1995 - 2000',
        responsibilities: [
            'LAN and WAN consultation, installation and repair.',
            'Diagnose and repair software and hardware issues on PC and MAC platforms.',
            'Project consultation and web development using FLASH, HTML and JAVA.',
            'Building and maintaining online databases and e-commerce systems.'
        ]
    }
];

export const INITIAL_CV_SKILLS: CvSkillCategory[] = [
    {
        id: 'sk1',
        title: 'FINANCIAL & TECHNICAL',
        skills: ['Financial Modeling & Forecasting', 'Risk Assessment (VaR)', 'Optimization (Linear Programming)', 'Statistical Analysis (ARIMA)', 'SAP, Oracle, Adaptive Insights', 'Full Stack (PHP, Python, MySQL)']
    },
    {
        id: 'sk2',
        title: 'CONSTRUCTION & OPERATIONS',
        skills: ['Project Management (Merlin)', 'General B Contractor (CA)', 'Sustainable Building', 'Plumbing, Electrical, Masonry', 'Commercial Diving', 'Welding & Roofing']
    },
    {
        id: 'sk3',
        title: 'LANGUAGES',
        skills: ['Fluent English', 'Fluent Conversational Spanish', 'Construction Spanish', 'Beginners Portuguese']
    }
];

export const INITIAL_CV_EDUCATION: CvEducation[] = [
    {
        id: 'edu1',
        degree: 'BS Mathematics',
        school: 'University of San Francisco',
        year: '2002-2005',
        details: 'Specialized in advanced mathematical modeling, statistical analysis, and optimization techniques.'
    },
    {
        id: 'edu2',
        degree: 'AA Economics',
        school: 'Santa Barbara City College',
        year: '2000-2002',
        details: 'Developed a comprehensive understanding of microeconomics and macroeconomics principles.'
    }
];

export const INITIAL_INTEGRATIONS: IntegrationCategory[] = [
    { id: 'int1', title: "Property & Real Estate Systems", tools: ["Yardi Voyager/Breeze", "AppFolio", "Buildium", "MRI", "RealPage", "Rent Manager", "DoorLoop"] },
    { id: 'int2', title: "Service & Field Operations", tools: ["Spectora", "Jobber", "Housecall Pro", "ServiceTitan", "Buildertrend", "CoConstruct", "FieldPulse"] },
    { id: 'int3', title: "Legal & Professional Services", tools: ["Clio", "Lawmatics", "Litify", "PracticePanther", "Smokeball"] },
    { id: 'int4', title: "Enterprise CRM", tools: ["Salesforce", "Microsoft 365/Dynamics", "HubSpot", "Zoho One", "ClickUp CRM"] },
    { id: 'int5', title: "Accounting & Finance Ops", tools: ["QuickBooks Online/Desktop", "Xero", "Sage Intacct", "NetSuite"] },
    { id: 'int6', title: "Automation & Internal Tooling", tools: ["Make.com", "Zapier", "n8n", "AirTable", "Retool", "Python/Node", "Playwright"] }
];