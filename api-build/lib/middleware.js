import { supabase, dbOperations } from './db.js';
// CORS configuration
const ALLOWED_ORIGINS = [
    'https://sat-rspo.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173' // Vite dev server
];
// Set CORS headers
export const setCorsHeaders = (res, origin) => {
    const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin)
        ? origin
        : 'https://sat-rspo.vercel.app';
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
};
// Handle CORS preflight requests
export const handleCors = (req, res) => {
    const origin = req.headers.origin;
    setCorsHeaders(res, origin);
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return true; // Request handled
    }
    return false; // Continue processing
};
// Extract JWT token from Authorization header
const extractToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return null;
    // Support both \"Bearer token\" and \"token\" formats
    if (authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    return authHeader;
};
// Create standardized error response
const createErrorResponse = (error, message, code, status = 400) => {
    return {
        error,
        message: message || error,
        code,
        timestamp: new Date().toISOString()
    };
};
// Verify JWT token with Supabase
const verifyToken = async (token) => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error) {
            console.error('Token verification error:', error);
            return { user: null, error: 'Invalid or expired token' };
        }
        if (!user) {
            return { user: null, error: 'User not found' };
        }
        return { user: user };
    }
    catch (error) {
        console.error('Token verification failed:', error);
        return { user: null, error: 'Authentication failed' };
    }
};
// Authentication middleware
export const authenticate = async (req, res) => {
    try {
        const token = extractToken(req);
        if (!token) {
            const error = createErrorResponse('Authentication required', 'Please provide a valid access token', 'MISSING_TOKEN', 401);
            return { success: false, error };
        }
        const { user, error: authError } = await verifyToken(token);
        if (authError || !user) {
            const error = createErrorResponse(authError || 'Authentication failed', 'Invalid or expired access token', 'INVALID_TOKEN', 401);
            return { success: false, error };
        }
        // Attach user to request
        req.user = user;
        // Try to get user profile
        try {
            const profile = await dbOperations.getUserProfile(user.id);
            if (profile) {
                req.profile = profile;
            }
        }
        catch (profileError) {
            console.warn('Could not fetch user profile:', profileError);
            // Don't fail authentication if profile fetch fails
        }
        return { success: true };
    }
    catch (error) {
        console.error('Authentication middleware error:', error);
        const apiError = createErrorResponse('Authentication error', 'An error occurred during authentication', 'AUTH_ERROR', 500);
        return { success: false, error: apiError };
    }
};
// Authorization middleware for role-based access (petani/manajer)
export const authorize = (allowedRoles = []) => {
    return (req, res) => {
        if (!req.user) {
            const error = createErrorResponse('Authentication required', 'Please authenticate before accessing this resource', 'NOT_AUTHENTICATED', 401);
            return { success: false, error };
        }
        if (allowedRoles.length === 0) {
            return { success: true }; // No role restriction
        }
        if (!req.profile) {
            const error = createErrorResponse('Profile not found', 'User profile is required for authorization', 'PROFILE_MISSING', 403);
            return { success: false, error };
        }
        if (!allowedRoles.includes(req.profile.role)) {
            const error = createErrorResponse('Insufficient permissions', `Access denied. Required roles: ${allowedRoles.join(', ')}`, 'INSUFFICIENT_PERMISSIONS', 403);
            return { success: false, error };
        }
        return { success: true };
    };
};
// Validate request method
export const validateMethod = (req, res, allowedMethods) => {
    if (!req.method || !allowedMethods.includes(req.method)) {
        const error = createErrorResponse('Method not allowed', `Allowed methods: ${allowedMethods.join(', ')}`, 'METHOD_NOT_ALLOWED', 405);
        res.status(405).json(error);
        return false;
    }
    return true;
};
// Validate request body
export const validateBody = (req, res, requiredFields = []) => {
    if (!req.body || typeof req.body !== 'object') {
        const error = createErrorResponse('Invalid request body', 'Request body must be a valid JSON object', 'INVALID_BODY', 400);
        res.status(400).json(error);
        return false;
    }
    const missingFields = requiredFields.filter(field => req.body[field] === undefined ||
        req.body[field] === null ||
        (typeof req.body[field] === 'string' && req.body[field].trim() === ''));
    if (missingFields.length > 0) {
        const error = createErrorResponse('Validation error', `Missing required fields: ${missingFields.join(', ')}`, 'MISSING_FIELDS', 400);
        res.status(400).json(error);
        return false;
    }
    return true;
};
// Validate email format
export const isValidEmail = (email) => {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return emailRegex.test(email);
};
// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map();
export const rateLimit = (req, res, maxRequests = 10, windowMs = 60000 // 1 minute
) => {
    const clientIp = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();
    const clientData = rateLimitMap.get(clientIp);
    if (!clientData || now > clientData.resetTime) {
        // Reset or initialize
        rateLimitMap.set(clientIp, { count: 1, resetTime: now + windowMs });
        return true;
    }
    if (clientData.count >= maxRequests) {
        const error = createErrorResponse('Rate limit exceeded', `Too many requests. Try again in ${Math.ceil((clientData.resetTime - now) / 1000)} seconds`, 'RATE_LIMIT_EXCEEDED', 429);
        res.status(429).json(error);
        return false;
    }
    clientData.count += 1;
    return true;
};
// Combined middleware wrapper
export const withMiddleware = (handler, options = {}) => {
    return async (req, res) => {
        try {
            // Handle CORS
            if (handleCors(req, res))
                return;
            // Validate method
            if (options.allowedMethods && !validateMethod(req, res, options.allowedMethods)) {
                return;
            }
            // Rate limiting
            if (options.rateLimit) {
                const { maxRequests, windowMs } = options.rateLimit;
                if (!rateLimit(req, res, maxRequests, windowMs)) {
                    return;
                }
            }
            // Validate body for non-GET requests
            if (req.method !== 'GET' && options.requiredFields) {
                if (!validateBody(req, res, options.requiredFields)) {
                    return;
                }
            }
            // Authentication
            if (options.requireAuth) {
                const authResult = await authenticate(req, res);
                if (!authResult.success) {
                    res.status(authResult.error?.code === 'MISSING_TOKEN' ? 401 : 401).json(authResult.error);
                    return;
                }
                // Authorization
                if (options.allowedRoles) {
                    const authzResult = authorize(options.allowedRoles)(req, res);
                    if (!authzResult.success) {
                        res.status(403).json(authzResult.error);
                        return;
                    }
                }
            }
            // Call the actual handler
            await handler(req, res);
        }
        catch (error) {
            console.error('Middleware error:', error);
            const apiError = createErrorResponse('Internal server error', 'An unexpected error occurred', 'INTERNAL_ERROR', 500);
            res.status(500).json(apiError);
        }
    };
};
