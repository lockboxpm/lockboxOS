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
    Venture, CvExperience, CvEducation, CvSkillCategory, IntegrationCategory, Business, ProjectRequest, ProjectStatus
} from '../types';

const DataContext = createContext<DataContextType | undefined>(undefined);

// Cache version - increment this when constants change to force refresh
const CACHE_VERSION = '1.6';

// Helper to safely parse JSON from localStorage
const safeParse = (key: string, fallback: any) => {
    try {
        const item = localStorage.getItem(key);
        if (!item) return fallback;

        const parsed = JSON.parse(item);

        if (parsed === null || parsed === undefined) {
            return fallback;
        }

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

// Generate unique ID
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Check and handle cache invalidation
const checkCacheVersion = () => {
    const storedVersion = localStorage.getItem('lbpm_cache_version');
    if (storedVersion !== CACHE_VERSION) {
        console.log(`Cache version mismatch (${storedVersion} -> ${CACHE_VERSION}), clearing stale data...`);
        localStorage.removeItem('lbpm_ventures');
        localStorage.removeItem('lbpm_clients');
        localStorage.setItem('lbpm_cache_version', CACHE_VERSION);
    }
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    checkCacheVersion();

    // Auth State - Now with full user profiles
    const [user, setUser] = useState<User | null>(() => safeParse('lbpm_user', null));
    const [allUsers, setAllUsers] = useState<User[]>(() => safeParse('lbpm_all_users', []));
    const isAdmin = user?.role === 'admin';

    // Content State
    const [clients, setClients] = useState<Client[]>(() => safeParse('lbpm_clients', INITIAL_CLIENTS));
    const [projects, setProjects] = useState<Project[]>(() => safeParse('lbpm_projects', INITIAL_PROJECTS));
    const [services, setServices] = useState<Service[]>(() => safeParse('lbpm_services', INITIAL_SERVICES));
    const [cart, setCart] = useState<CartItem[]>(() => safeParse('lbpm_cart', []));
    const [products, setProducts] = useState<Product[]>(() => safeParse('lbpm_products', INITIAL_PRODUCTS));

    // Dynamic State
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

    useEffect(() => { localStorage.setItem('lbpm_all_users', JSON.stringify(allUsers)); }, [allUsers]);
    useEffect(() => { localStorage.setItem('lbpm_clients', JSON.stringify(clients)); }, [clients]);
    useEffect(() => { localStorage.setItem('lbpm_projects', JSON.stringify(projects)); }, [projects]);
    useEffect(() => { localStorage.setItem('lbpm_services', JSON.stringify(services)); }, [services]);
    useEffect(() => { localStorage.setItem('lbpm_cart', JSON.stringify(cart)); }, [cart]);
    useEffect(() => { localStorage.setItem('lbpm_products', JSON.stringify(products)); }, [products]);
    useEffect(() => { localStorage.setItem('lbpm_ventures', JSON.stringify(ventures)); }, [ventures]);
    useEffect(() => { localStorage.setItem('lbpm_cv_exp', JSON.stringify(cvExperiences)); }, [cvExperiences]);
    useEffect(() => { localStorage.setItem('lbpm_cv_edu', JSON.stringify(cvEducation)); }, [cvEducation]);
    useEffect(() => { localStorage.setItem('lbpm_cv_skills', JSON.stringify(cvSkills)); }, [cvSkills]);
    useEffect(() => { localStorage.setItem('lbpm_integrations', JSON.stringify(integrationCategories)); }, [integrationCategories]);

    // ==========================================
    // AUTH & USER MANAGEMENT
    // ==========================================

    // Legacy login (for backwards compatibility and admin quick login)
    const login = (username: string, role: 'admin' | 'user') => {
        const existingUser = allUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (existingUser) {
            setUser({ ...existingUser, role, token: 'mock-jwt-token' });
        } else {
            // Create minimal user for legacy login
            const newUser: User = {
                id: generateId(),
                username,
                email: '',
                role,
                token: 'mock-jwt-token',
                createdAt: new Date().toISOString(),
                businesses: [],
                projectRequests: []
            };
            setUser(newUser);
            if (role !== 'admin') {
                setAllUsers(prev => [...prev, newUser]);
            }
        }
    };

    // Login with full profile
    const loginWithProfile = (userData: Omit<User, 'token'>) => {
        setUser({ ...userData, token: 'mock-jwt-token' });
    };

    // Admin credentials (hardcoded for now)
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'lockbox2024';

    // Check admin login
    const checkAdminLogin = (username: string, password: string): boolean => {
        return username.toLowerCase() === ADMIN_USERNAME && password === ADMIN_PASSWORD;
    };

    // Register new user
    const registerUser = (email: string, username: string, password: string, phone?: string): User | null => {
        // Check if trying to register with admin username
        if (username.toLowerCase() === ADMIN_USERNAME) {
            // Verify admin password
            if (password === ADMIN_PASSWORD) {
                const adminUser: User = {
                    id: 'admin_001',
                    username: 'admin',
                    email: email || 'admin@lockboxpm.com',
                    phone,
                    role: 'admin',
                    token: 'mock-jwt-token',
                    createdAt: new Date().toISOString(),
                    businesses: [],
                    projectRequests: []
                };
                setUser(adminUser);
                return adminUser;
            }
            return null; // Wrong admin password
        }

        const newUser: User = {
            id: generateId(),
            username,
            email,
            phone,
            role: 'user',
            token: 'mock-jwt-token',
            createdAt: new Date().toISOString(),
            businesses: [],
            projectRequests: []
        };
        setAllUsers(prev => [...prev, newUser]);
        setUser(newUser);
        return newUser;
    };

    const logout = () => setUser(null);

    // Update current user's profile
    const updateUserProfile = (updates: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        // Also update in allUsers
        setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    };

    // ==========================================
    // BUSINESS MANAGEMENT (for current user)
    // ==========================================

    const addBusiness = (business: Business) => {
        if (!user) return;
        const updatedUser = { ...user, businesses: [...user.businesses, business] };
        setUser(updatedUser);
        setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    };

    const updateBusiness = (businessId: string, updates: Partial<Business>) => {
        if (!user) return;
        const updatedBusinesses = user.businesses.map(b =>
            b.id === businessId ? { ...b, ...updates } : b
        );
        const updatedUser = { ...user, businesses: updatedBusinesses };
        setUser(updatedUser);
        setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    };

    const deleteBusiness = (businessId: string) => {
        if (!user) return;
        const updatedUser = { ...user, businesses: user.businesses.filter(b => b.id !== businessId) };
        setUser(updatedUser);
        setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    };

    // ==========================================
    // PROJECT REQUEST MANAGEMENT
    // ==========================================

    const addProjectRequest = (project: Omit<ProjectRequest, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
        if (!user) return;
        const now = new Date().toISOString();
        const newProject: ProjectRequest = {
            ...project,
            id: generateId(),
            userId: user.id,
            createdAt: now,
            updatedAt: now
        };
        const updatedUser = { ...user, projectRequests: [...user.projectRequests, newProject] };
        setUser(updatedUser);
        setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    };

    const updateProjectRequest = (projectId: string, updates: Partial<ProjectRequest>) => {
        if (!user) return;
        const updatedProjects = user.projectRequests.map(p =>
            p.id === projectId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
        );
        const updatedUser = { ...user, projectRequests: updatedProjects };
        setUser(updatedUser);
        setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    };

    const deleteProjectRequest = (projectId: string) => {
        if (!user) return;
        const updatedUser = { ...user, projectRequests: user.projectRequests.filter(p => p.id !== projectId) };
        setUser(updatedUser);
        setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    };

    // ==========================================
    // ADMIN FUNCTIONS
    // ==========================================

    // Get all project requests from all users
    const allProjectRequests: ProjectRequest[] = allUsers.flatMap(u => u.projectRequests || []);

    const updateUserRole = (userId: string, role: 'admin' | 'user') => {
        setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
        if (user?.id === userId) {
            setUser(prev => prev ? { ...prev, role } : null);
        }
    };

    const updateProjectStatus = (projectId: string, status: ProjectStatus) => {
        setAllUsers(prev => prev.map(u => ({
            ...u,
            projectRequests: (u.projectRequests || []).map(p =>
                p.id === projectId ? { ...p, status, updatedAt: new Date().toISOString() } : p
            )
        })));
        // Update current user if they own the project
        if (user) {
            const hasProject = user.projectRequests.some(p => p.id === projectId);
            if (hasProject) {
                setUser(prev => prev ? {
                    ...prev,
                    projectRequests: prev.projectRequests.map(p =>
                        p.id === projectId ? { ...p, status, updatedAt: new Date().toISOString() } : p
                    )
                } : null);
            }
        }
    };

    // ==========================================
    // EXISTING ENTITY METHODS
    // ==========================================

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
            // Auth
            user, login, loginWithProfile, registerUser, logout, updateUserProfile, isAdmin,
            // Businesses
            addBusiness, updateBusiness, deleteBusiness,
            // Project Requests
            addProjectRequest, updateProjectRequest, deleteProjectRequest,
            // Admin
            allUsers, allProjectRequests, updateUserRole, updateProjectStatus,
            // Existing
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