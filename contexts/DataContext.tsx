import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    CLIENTS as INITIAL_CLIENTS, 
    PRODUCTS as INITIAL_PRODUCTS,
    PROJECTS as INITIAL_PROJECTS,
    SERVICES as INITIAL_SERVICES,
    INITIAL_CV_EXPERIENCE,
    INITIAL_CV_EDUCATION,
    INITIAL_CV_SKILLS,
    INITIAL_INTEGRATIONS,
    INITIAL_VENTURES
} from '../constants';
import type { 
    Client, ClientScannedData, DataContextType, CartItem, Product, User, Project, Service,
    Venture, CvExperience, CvEducation, CvSkillCategory, IntegrationCategory
} from '../types';

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper to safely parse JSON from localStorage
const safeParse = (key: string, fallback: any) => {
    try {
        const item = localStorage.getItem(key);
        if (!item) return fallback;
        
        const parsed = JSON.parse(item);
        
        // Ensure we don't return null if the fallback is not null
        if (parsed === null || parsed === undefined) {
            return fallback;
        }

        // Type safety check: if fallback is an array, parsed must be an array
        if (Array.isArray(fallback) && !Array.isArray(parsed)) {
            console.warn(`Data mismatch for key "${key}". Expected array, got ${typeof parsed}. Reverting to fallback.`);
            return fallback;
        }

        return parsed;
    } catch (error) {
        console.warn(`Error parsing localStorage key "${key}":`, error);
        return fallback;
    }
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Auth State
    const [user, setUser] = useState<User | null>(() => safeParse('lbpm_user', null));
    const isAdmin = user?.role === 'admin';

    // Content State - Initialize with safeParse to prevent crashes
    const [clients, setClients] = useState<Client[]>(() => safeParse('lbpm_clients', INITIAL_CLIENTS));
    const [projects, setProjects] = useState<Project[]>(() => safeParse('lbpm_projects', INITIAL_PROJECTS));
    const [services, setServices] = useState<Service[]>(() => safeParse('lbpm_services', INITIAL_SERVICES));
    const [cart, setCart] = useState<CartItem[]>(() => safeParse('lbpm_cart', []));
    const [products, setProducts] = useState<Product[]>(() => safeParse('lbpm_products', INITIAL_PRODUCTS));
    
    // New Dynamic State
    const [ventures, setVentures] = useState<Venture[]>(() => safeParse('lbpm_ventures', INITIAL_VENTURES));
    const [cvExperiences, setCvExperiences] = useState<CvExperience[]>(() => safeParse('lbpm_cv_exp', INITIAL_CV_EXPERIENCE));
    const [cvEducation, setCvEducation] = useState<CvEducation[]>(() => safeParse('lbpm_cv_edu', INITIAL_CV_EDUCATION));
    const [cvSkills, setCvSkills] = useState<CvSkillCategory[]>(() => safeParse('lbpm_cv_skills', INITIAL_CV_SKILLS));
    const [integrationCategories, setIntegrationCategories] = useState<IntegrationCategory[]>(() => safeParse('lbpm_integrations', INITIAL_INTEGRATIONS));

    // Persist state changes
    useEffect(() => { 
        try {
            if (user) localStorage.setItem('lbpm_user', JSON.stringify(user)); 
            else localStorage.removeItem('lbpm_user'); 
        } catch (e) { console.error("Storage error", e); }
    }, [user]);

    useEffect(() => { localStorage.setItem('lbpm_clients', JSON.stringify(clients)); }, [clients]);
    useEffect(() => { localStorage.setItem('lbpm_projects', JSON.stringify(projects)); }, [projects]);
    useEffect(() => { localStorage.setItem('lbpm_services', JSON.stringify(services)); }, [services]);
    useEffect(() => { localStorage.setItem('lbpm_cart', JSON.stringify(cart)); }, [cart]);
    useEffect(() => { localStorage.setItem('lbpm_products', JSON.stringify(products)); }, [products]);
    
    // Persist new data
    useEffect(() => { localStorage.setItem('lbpm_ventures', JSON.stringify(ventures)); }, [ventures]);
    useEffect(() => { localStorage.setItem('lbpm_cv_exp', JSON.stringify(cvExperiences)); }, [cvExperiences]);
    useEffect(() => { localStorage.setItem('lbpm_cv_edu', JSON.stringify(cvEducation)); }, [cvEducation]);
    useEffect(() => { localStorage.setItem('lbpm_cv_skills', JSON.stringify(cvSkills)); }, [cvSkills]);
    useEffect(() => { localStorage.setItem('lbpm_integrations', JSON.stringify(integrationCategories)); }, [integrationCategories]);


    // Auth Methods
    const login = (username: string, role: 'admin' | 'user') => {
        setUser({ username, role, token: 'mock-jwt-token' });
    };
    const logout = () => setUser(null);

    // Existing Entity Methods
    const addClient = (client: Client) => setClients(prev => [...prev, client]);
    const updateClient = (index: number, updatedClient: Client) => {
        setClients(prev => {
            const newClients = [...prev];
            newClients[index] = updatedClient;
            return newClients;
        });
    };
    const updateClientScan = (index: number, data: ClientScannedData) => {
        setClients(prev => {
            const newClients = [...prev];
            newClients[index] = { ...newClients[index], scannedData: data };
            return newClients;
        });
    };
    const deleteClient = (index: number) => setClients(prev => prev.filter((_, i) => i !== index));

    const addProject = (project: Project) => setProjects(prev => [project, ...prev]);
    const deleteProject = (index: number) => setProjects(prev => prev.filter((_, i) => i !== index));

    const addService = (service: Service) => setServices(prev => [...prev, service]);
    const deleteService = (index: number) => setServices(prev => prev.filter((_, i) => i !== index));

    // Cart
    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            return [...prev, { ...product, quantity: 1 }];
        });
    };
    const removeFromCart = (productId: string) => setCart(prev => prev.filter(item => item.id !== productId));
    const updateCartQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };
    const clearCart = () => setCart([]);
    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Store
    const addProduct = (product: Product) => setProducts(prev => [...prev, product]);
    const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

    // New Data Handlers
    
    // Ventures
    const addVenture = (v: Venture) => setVentures(prev => [...prev, v]);
    const deleteVenture = (id: string) => setVentures(prev => prev.filter(v => v.id !== id));
    const updateVenture = (id: string, v: Venture) => setVentures(prev => prev.map(item => item.id === id ? v : item));

    // CV
    const addCvExperience = (e: CvExperience) => setCvExperiences(prev => [e, ...prev]);
    const deleteCvExperience = (id: string) => setCvExperiences(prev => prev.filter(e => e.id !== id));

    const addCvEducation = (e: CvEducation) => setCvEducation(prev => [e, ...prev]);
    const deleteCvEducation = (id: string) => setCvEducation(prev => prev.filter(e => e.id !== id));

    const addCvSkillCategory = (s: CvSkillCategory) => setCvSkills(prev => [...prev, s]);
    const deleteCvSkillCategory = (id: string) => setCvSkills(prev => prev.filter(s => s.id !== id));

    // Integrations
    const addIntegrationCategory = (c: IntegrationCategory) => setIntegrationCategories(prev => [...prev, c]);
    const deleteIntegrationCategory = (id: string) => setIntegrationCategories(prev => prev.filter(c => c.id !== id));

    return (
        <DataContext.Provider value={{ 
            user, login, logout, isAdmin, 
            clients, addClient, updateClient, deleteClient, updateClientScan,
            projects, addProject, deleteProject,
            services, addService, deleteService,
            cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal,
            products, addProduct, deleteProduct,
            ventures, addVenture, updateVenture, deleteVenture,
            cvExperiences, addCvExperience, deleteCvExperience,
            cvEducation, addCvEducation, deleteCvEducation,
            cvSkills, addCvSkillCategory, deleteCvSkillCategory,
            integrationCategories, addIntegrationCategory, deleteIntegrationCategory
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};