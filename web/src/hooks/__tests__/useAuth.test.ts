import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn()
}));

// Mock fetch
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.Mock;

describe('useAuth', () => {
    const mockNavigate = jest.fn();
    
    beforeEach(() => {
        jest.clearAllMocks();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        localStorage.clear();
    });

    describe('login', () => {
        it('should successfully login and store token', async () => {
            const mockResponse = {
                error: false,
                token: 'test-token',
                user: {
                    id: '1',
                    email: 'test@example.com',
                    firstName: 'Test',
                    lastName: 'User',
                    role: 'user'
                }
            };

            mockFetch.mockResolvedValueOnce({
                json: () => Promise.resolve(mockResponse)
            });

            const { result } = renderHook(() => useAuth());

            await act(async () => {
                await result.current.login({
                    email: 'test@example.com',
                    password: 'password123'
                });
            });

            expect(localStorage.getItem('token')).toBe('test-token');
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
            expect(result.current.user).toEqual(mockResponse.user);
        });

        it('should handle login error', async () => {
            const mockError = {
                error: true,
                message: 'Invalid credentials'
            };

            mockFetch.mockResolvedValueOnce({
                json: () => Promise.resolve(mockError)
            });

            const { result } = renderHook(() => useAuth());

            await act(async () => {
                try {
                    await result.current.login({
                        email: 'test@example.com',
                        password: 'wrong'
                    });
                } catch (error) {
                    expect(error).toBeInstanceOf(Error);
                    expect(error.message).toBe('Invalid credentials');
                }
            });

            expect(localStorage.getItem('token')).toBeNull();
            expect(result.current.error).toBe('Invalid credentials');
        });
    });

    describe('logout', () => {
        it('should clear token and navigate to login', () => {
            localStorage.setItem('token', 'test-token');

            const { result } = renderHook(() => useAuth());

            act(() => {
                result.current.logout();
            });

            expect(localStorage.getItem('token')).toBeNull();
            expect(mockNavigate).toHaveBeenCalledWith('/login');
            expect(result.current.user).toBeNull();
        });
    });

    describe('verifyToken', () => {
        it('should return false if no token exists', async () => {
            const { result } = renderHook(() => useAuth());

            await act(async () => {
                const isValid = await result.current.verifyToken();
                expect(isValid).toBe(false);
            });
        });

        it('should verify valid token and update user', async () => {
            localStorage.setItem('token', 'test-token');

            const mockResponse = {
                error: false,
                user: {
                    id: '1',
                    email: 'test@example.com',
                    firstName: 'Test',
                    lastName: 'User',
                    role: 'user'
                }
            };

            mockFetch.mockResolvedValueOnce({
                json: () => Promise.resolve(mockResponse)
            });

            const { result } = renderHook(() => useAuth());

            await act(async () => {
                const isValid = await result.current.verifyToken();
                expect(isValid).toBe(true);
                expect(result.current.user).toEqual(mockResponse.user);
            });
        });
    });
}); 