// src/services/api.ts
const API_BASE_URL = 'http://localhost:5001/api';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    token?: string;
    user?: any;
    error?: string;
    count?: number;
    pagination?: any;
}

class ApiService {
    private csrfToken: string | null = null;

    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }

    private async ensureCsrfToken(): Promise<string> {
        if (this.csrfToken) return this.csrfToken;
        const resp = await fetch(`${API_BASE_URL}/csrf-token`, { credentials: 'include' });
        const data = await resp.json();
        const token: string = (data && typeof data.csrfToken === 'string') ? data.csrfToken : '';
        this.csrfToken = token;
        return token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${API_BASE_URL}${endpoint}`;
        const config: RequestInit = {
            headers: { ...this.getAuthHeaders() },
            credentials: 'include',
            ...options,
        };

        // Attach CSRF token for state-changing requests
        const method = (config.method || 'GET').toUpperCase();
        if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
            const token = await this.ensureCsrfToken();
            (config.headers as Record<string, string>)['X-CSRF-Token'] = token || '';
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'An error occurred');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async createUser(userData: {
        name: string;
        email: string;
        password: string;
        role: string;
    }): Promise<ApiResponse<any>> {
        return this.request('/users/admin/create', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(credentials: {
        email: string;
        password: string;
        role: 'student' | 'instructor' | 'admin';
    }): Promise<ApiResponse<any>> {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async logout(): Promise<ApiResponse<any>> {
        return this.request('/users/logout', {
            method: 'GET',
        });
    }

    async getCurrentUser(): Promise<ApiResponse<any>> {
        return this.request('/auth/me');
    }

    // User endpoints
    async updateUserProfile(userData: any): Promise<ApiResponse<any>> {
        return this.request('/users/me', {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    // Course endpoints
    async getCourses(): Promise<ApiResponse<any>> {
        return this.request('/courses');
    }

    async getCourse(id: string): Promise<ApiResponse<any>> {
        return this.request(`/courses/${id}`);
    }

    async createCourse(courseData: any): Promise<ApiResponse<any>> {
        return this.request('/courses', {
            method: 'POST',
            body: JSON.stringify(courseData),
        });
    }

    async updateCourse(id: string, courseData: any): Promise<ApiResponse<any>> {
        return this.request(`/courses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(courseData),
        });
    }

    async deleteCourse(id: string): Promise<ApiResponse<any>> {
        return this.request(`/courses/${id}`, {
            method: 'DELETE',
        });
    }

    // Enrollment endpoints
    async getEnrollments(): Promise<ApiResponse<any>> {
        return this.request('/enrollments');
    }

    async enrollInCourse(courseId: string): Promise<ApiResponse<any>> {
        return this.request('/enrollments', {
            method: 'POST',
            body: JSON.stringify({ course: courseId }),
        });
    }

    // Assignment endpoints
    async getAssignments(): Promise<ApiResponse<any>> {
        return this.request('/assignments');
    }

    async createAssignment(assignmentData: any): Promise<ApiResponse<any>> {
        return this.request('/assignments', {
            method: 'POST',
            body: JSON.stringify(assignmentData),
        });
    }

    // Quiz endpoints
    async getQuizzes(): Promise<ApiResponse<any>> {
        return this.request('/quizzes');
    }

    async createQuiz(quizData: any): Promise<ApiResponse<any>> {
        return this.request('/quizzes', {
            method: 'POST',
            body: JSON.stringify(quizData),
        });
    }

    // Discussion endpoints
    async getDiscussionPosts(courseId?: string): Promise<ApiResponse<any>> {
        const endpoint = courseId ? `/forum?course=${courseId}` : '/forum';
        return this.request(endpoint);
    }

    async createDiscussionPost(postData: any): Promise<ApiResponse<any>> {
        return this.request('/forum', {
            method: 'POST',
            body: JSON.stringify(postData),
        });
    }

    // Notification endpoints
    async getNotifications(): Promise<ApiResponse<any>> {
        return this.request('/notifications');
    }

    async markNotificationAsRead(id: string): Promise<ApiResponse<any>> {
        return this.request(`/notifications/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ read: true }),
        });
    }

    // Admin endpoints
    async getUsers(): Promise<ApiResponse<any>> {
        return this.request('/users');
    }

    async getAdminUsers(): Promise<ApiResponse<any>> {
        return this.request('/admin/users');
    }

    async getAdminAnalytics(): Promise<ApiResponse<any>> {
        return this.request('/admin/analytics');
    }

    async getPendingApprovals(): Promise<ApiResponse<any>> {
        return this.request('/admin/approvals');
    }

    async getMyCourses(): Promise<ApiResponse<any>> {
        return this.request('/courses/my-courses');
    }

    async getEnrolledCourses(): Promise<ApiResponse<any>> {
        return this.request('/enrollments/my-courses');
    }

    async getRecentSubmissions(): Promise<ApiResponse<any>> {
        return this.request('/submissions/recent');
    }

    async getSubmissions(): Promise<ApiResponse<any>> {
        return this.request('/submissions');
    }

    // Settings endpoints
    async getUserSettings(): Promise<ApiResponse<any>> {
        return this.request('/user/settings');
    }

    async updateUserSettings(settings: any): Promise<ApiResponse<any>> {
        return this.request('/user/settings', {
            method: 'PUT',
            body: JSON.stringify(settings),
        });
    }

    async exportUserData(): Promise<ApiResponse<any>> {
        return this.request('/user/export-data', {
            method: 'POST',
        });
    }
}

export const apiService = new ApiService();
export default apiService; 