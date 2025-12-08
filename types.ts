import type React from 'react';

export type PanelType = 'home' | 'cv' | 'projects' | 'consulting' | 'tax' | 'schedule' | 'contact' | 'console' | 'integrations' | 'clients' | 'intake' | 'store';

export interface Panel {
    id: PanelType;
    title: string;
    icon: React.ReactNode;
}

export interface User {
    username: string;
    role: 'admin' | 'user';
    token?: string; // Mock token
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
    logout: () => void;
    
    // State
    isAdmin: boolean;
    
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