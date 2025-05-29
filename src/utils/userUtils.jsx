// src/utils/userUtils.js - User Management Utilities

// Default permissions for different user roles
export const USER_ROLES = {
  viewer: {
    "Intake form": { "Create": false, "View": true, "Edit": false },
    "Supplier Onboarding": { "Create": false, "View": true, "Approve": false },
    "PO": { "View": true, "Approve": false, "Edit": false },
    "CONTRACT": { "View": true, "Create": false },
    "RFX": { "View": true, "Create": false, "Approve": false },
    "E-Auction": { "View": true, "Create": false, "Edit": false }
  },
  
  procurement_officer: {
    "Intake form": { "Create": true, "View": true, "Edit": true },
    "Supplier Onboarding": { "Create": true, "View": true, "Approve": false },
    "PO": { "View": true, "Approve": false, "Edit": true },
    "CONTRACT": { "View": true, "Create": true },
    "RFX": { "View": true, "Create": true, "Approve": false },
    "E-Auction": { "View": true, "Create": true, "Edit": true }
  },
  
  procurement_manager: {
    "Intake form": { "Create": true, "View": true, "Edit": true },
    "Supplier Onboarding": { "Create": true, "View": true, "Approve": true },
    "PO": { "View": true, "Approve": true, "Edit": true },
    "CONTRACT": { "View": true, "Create": true },
    "RFX": { "View": true, "Create": true, "Approve": true },
    "E-Auction": { "View": true, "Create": true, "Edit": true }
  },
  
  admin: {
    "Intake form": { "Create": true, "View": true, "Edit": true },
    "Supplier Onboarding": { "Create": true, "View": true, "Approve": true },
    "PO": { "View": true, "Approve": true, "Edit": true },
    "CONTRACT": { "View": true, "Create": true },
    "RFX": { "View": true, "Create": true, "Approve": true },
    "E-Auction": { "View": true, "Create": true, "Edit": true }
  }
};

// User management functions
export const getUserName = () => {
  return localStorage.getItem('userName') || 'User';
};

export const setUserName = (name) => {
  localStorage.setItem('userName', name);
};

export const getUserRole = () => {
  return localStorage.getItem('userRole') || 'viewer';
};

export const setUserRole = (role) => {
  if (USER_ROLES[role]) {
    localStorage.setItem('userRole', role);
    // Update permissions when role changes
    setUserPermissions(USER_ROLES[role]);
  }
};

export const getUserPermissions = () => {
  const stored = localStorage.getItem('userPermissions');
  if (stored) {
    return JSON.parse(stored);
  }
  // Default to viewer permissions
  return USER_ROLES.viewer;
};

export const setUserPermissions = (permissions) => {
  localStorage.setItem('userPermissions', JSON.stringify(permissions));
};

// Initialize user with role
export const initializeUser = (name = 'User', role = 'viewer') => {
  setUserName(name);
  setUserRole(role);
  return {
    name: getUserName(),
    role: getUserRole(),
    permissions: getUserPermissions()
  };
};

// Check if user has specific permission
export const hasPermission = (module, action) => {
  const permissions = getUserPermissions();
  return permissions[module]?.[action] || false;
};

// Get user's allowed actions for a module
export const getAllowedActions = (module) => {
  const permissions = getUserPermissions();
  const modulePermissions = permissions[module] || {};
  return Object.keys(modulePermissions).filter(action => modulePermissions[action]);
};

// Role-based suggested queries
export const getRoleBasedSuggestions = (role) => {
  const suggestions = {
    viewer: [
      "Hi there!",
      "Dashboard overview",
      "Check PO status",
      "Search for suppliers",
      "View active contracts"
    ],
    
    procurement_officer: [
      "Hi there!",
      "How to raise a PR?",
      "Submit intake form", 
      "Vendor onboarding process",
      "Create RFX",
      "Check PO status"
    ],
    
    procurement_manager: [
      "Hi there!",
      "Approve pending request",
      "Approve new supplier",
      "Dashboard overview",
      "Contract renewal process",
      "Manage auction bids"
    ],
    
    admin: [
      "Hi there!",
      "Dashboard overview",
      "Approve pending request",
      "Vendor onboarding process",
      "Budget management",
      "Create RFX"
    ]
  };
  
  return suggestions[role] || suggestions.viewer;
};