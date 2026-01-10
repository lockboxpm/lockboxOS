import type React from 'react';

export type PanelType = 'home' | 'cv' | 'tech-consulting' | 'realestate-consulting' | 'tax' | 'communicate' | 'integrations' | 'clients' | 'intake' | 'store' | 'retreats' | 'lending' | 'profile' | 'myprojects' | 'admin';

export interface Panel {
    id: PanelType;
    title: string;
    icon: React.ReactNode;
}

export interface User {
    id: string;
    username: string;
    email: string;
    phone?: string;
    role: 'admin' | 'user';
    token?: string;
    createdAt: string;
    profilePhoto?: string;
    // Linked data
    businesses: Business[];
    projectRequests: ProjectRequest[];
}

export interface Business {
    id: string;
    name: string;
    type: 'LLC' | 'Corporation' | 'Sole Proprietorship' | 'Partnership' | 'Non-Profit' | 'Other';
    industry?: string;
    website?: string;
    address?: string;
    contacts: ContactInfo[];
    createdAt: string;
}

export interface ContactInfo {
    id: string;
    type: 'email' | 'phone' | 'website' | 'linkedin' | 'other';
    label: string;
    value: string;
}

export type ProjectStatus = 'draft' | 'submitted' | 'in_review' | 'approved' | 'in_progress' | 'completed' | 'cancelled';

export interface ProjectRequest {
    id: string;
    title: string;
    description: string;
    type: 'consulting' | 'development' | 'integration' | 'automation' | 'support' | 'other';
    status: ProjectStatus;
    businessId?: string;
    userId: string;
    budget?: string;
    timeline?: string;
    createdAt: string;
    updatedAt: string;
    notes?: string;
    assignedTo?: string;
}

export interface Project {
    id?: string;
    icon?: React.ReactNode;
    title: string;
    description: string;
    stack: string[];
    url: string;
}

export interface Service {
    id?: string;
    title: string;
    forWho: string;
    problems: string[];
    includes: string[];
    engagement: string;
}

export interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
}

export interface ClientScannedData {
    summary?: string;
    logoUrl?: string;
    contacts?: string;
    status?: 'Online' | 'Reported Down' | 'Unknown';
    branding?: string;
    lastScanned?: string;
}

export interface Client {
    name: string;
    description: string;
    url: string;
    role: string;
    scannedData?: ClientScannedData;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
}

export interface CartItem extends Product {
    quantity: number;
}

// --- NEW DYNAMIC TYPES ---

export interface Venture {
    id: string;
    name: string;
    url: string;
    summary?: string;
    products?: string[];
    contact?: string;
    location?: string;
    logoUrl?: string;
    status: 'idle' | 'loading' | 'loaded' | 'error';
}

export interface CvExperience {
    id: string;
    role: string;
    company: string;
    period: string;
    location?: string;
    responsibilities: string[];
}

export interface CvEducation {
    id: string;
    degree: string;
    school: string;
    year: string;
    details?: string;
}

export interface CvSkillCategory {
    id: string;
    title: string;
    skills: string[];
}

export interface IntegrationCategory {
    id: string;
    title: string;
    tools: string[];
}

export interface DataContextType {
    // Auth
    user: User | null;
    login: (username: string, role: 'admin' | 'user') => void;
    loginWithProfile: (userData: Omit<User, 'token'>) => void;
    registerUser: (email: string, username: string, password: string, phone?: string) => User;
    logout: () => void;
    updateUserProfile: (updates: Partial<User>) => void;

    // State
    isAdmin: boolean;

    // User's Businesses
    addBusiness: (business: Business) => void;
    updateBusiness: (businessId: string, updates: Partial<Business>) => void;
    deleteBusiness: (businessId: string) => void;

    // User's Project Requests
    addProjectRequest: (project: Omit<ProjectRequest, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
    updateProjectRequest: (projectId: string, updates: Partial<ProjectRequest>) => void;
    deleteProjectRequest: (projectId: string) => void;

    // Admin: All Users & Projects
    allUsers: User[];
    allProjectRequests: ProjectRequest[];
    updateUserRole: (userId: string, role: 'admin' | 'user') => void;
    updateProjectStatus: (projectId: string, status: ProjectStatus) => void;

    // Dynamic Data Management
    clients: Client[];
    addClient: (client: Client) => void;
    updateClient: (index: number, client: Client) => void;
    deleteClient: (index: number) => void;
    updateClientScan: (index: number, data: ClientScannedData) => void;

    projects: Project[];
    addProject: (project: Project) => void;
    deleteProject: (index: number) => void;

    services: Service[];
    addService: (service: Service) => void;
    deleteService: (index: number) => void;

    // Cart & Store
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateCartQuantity: (productId: string, delta: number) => void;
    clearCart: () => void;
    cartTotal: number;
    products: Product[];
    addProduct: (product: Product) => void;
    deleteProduct: (id: string) => void;

    // Home Ventures
    ventures: Venture[];
    addVenture: (v: Venture) => void;
    updateVenture: (id: string, v: Venture) => void;
    deleteVenture: (id: string) => void;

    // CV Data
    cvExperiences: CvExperience[];
    addCvExperience: (e: CvExperience) => void;
    deleteCvExperience: (id: string) => void;

    cvEducation: CvEducation[];
    addCvEducation: (e: CvEducation) => void;
    deleteCvEducation: (id: string) => void;

    cvSkills: CvSkillCategory[];
    addCvSkillCategory: (s: CvSkillCategory) => void;
    deleteCvSkillCategory: (id: string) => void;

    // Integrations
    integrationCategories: IntegrationCategory[];
    addIntegrationCategory: (c: IntegrationCategory) => void;
    deleteIntegrationCategory: (id: string) => void;
}