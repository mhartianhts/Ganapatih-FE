/**
 * Follow Panel Component - Automated Tests
 * 
 * Test File untuk komponen FollowPanel
 * Menggunakan React Testing Library dan Jest
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FollowPanel } from '@/components/dashboard/follow-panel';
import '@testing-library/jest-dom';

// Mock useToast hook
jest.mock('@/components/ui/toast', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

describe('FollowPanel Component', () => {
  const mockOnFollow = jest.fn();
  const mockOnUnfollow = jest.fn();
  const mockOnSearch = jest.fn();

  const mockSearchResults = [
    { id: 1, username: 'testuser1' },
    { id: 2, username: 'testuser2' },
    { id: 3, username: 'testuser3' },
  ];

  beforeEach(() => {
    mockOnFollow.mockClear();
    mockOnUnfollow.mockClear();
    mockOnSearch.mockClear();
  });

  // TC-FOLLOW-001: Render component correctly
  test('should render follow panel with search input', () => {
    render(
      <FollowPanel
        onFollow={mockOnFollow}
        onUnfollow={mockOnUnfollow}
        onSearch={mockOnSearch}
      />
    );
    
    expect(screen.getByText('Cari Pengguna')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Cari berdasarkan username...')).toBeInTheDocument();
    expect(screen.getByText(/Ketik minimal dua karakter/i)).toBeInTheDocument();
  });

  // TC-FOLLOW-002: Minimum character validation
  test('should show info message when search query is less than 2 characters', () => {
    render(
      <FollowPanel
        onFollow={mockOnFollow}
        onUnfollow={mockOnUnfollow}
        onSearch={mockOnSearch}
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Cari berdasarkan username...');
    
    fireEvent.change(searchInput, { target: { value: 'a' } });
    
    expect(screen.getByText('Masukkan minimal 2 karakter untuk mencari.')).toBeInTheDocument();
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  // TC-FOLLOW-003: Search functionality
  test('should call onSearch when valid query is entered', async () => {
    mockOnSearch.mockResolvedValueOnce(mockSearchResults);
    
    render(
      <FollowPanel
        onFollow={mockOnFollow}
        onUnfollow={mockOnUnfollow}
        onSearch={mockOnSearch}
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Cari berdasarkan username...');
    
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test');
    });
  });

  // TC-FOLLOW-004: Display search results
  test('should display search results', async () => {
    mockOnSearch.mockResolvedValueOnce(mockSearchResults);
    
    render(
      <FollowPanel
        onFollow={mockOnFollow}
        onUnfollow={mockOnUnfollow}
        onSearch={mockOnSearch}
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Cari berdasarkan username...');
    
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(screen.getByText('testuser1')).toBeInTheDocument();
      expect(screen.getByText('testuser2')).toBeInTheDocument();
      expect(screen.getByText('testuser3')).toBeInTheDocument();
    });
  });

  // TC-FOLLOW-005: Follow button functionality
  test('should call onFollow when follow button is clicked', async () => {
    mockOnSearch.mockResolvedValueOnce(mockSearchResults);
    mockOnFollow.mockResolvedValueOnce(undefined);
    
    render(
      <FollowPanel
        onFollow={mockOnFollow}
        onUnfollow={mockOnUnfollow}
        onSearch={mockOnSearch}
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Cari berdasarkan username...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(screen.getByText('testuser1')).toBeInTheDocument();
    });
    
    const followButtons = screen.getAllByText('Ikuti');
    fireEvent.click(followButtons[0]);
    
    await waitFor(() => {
      expect(mockOnFollow).toHaveBeenCalledWith('1');
    });
  });

  // TC-FOLLOW-006: Unfollow button functionality
  test('should call onUnfollow when unfollow button is clicked', async () => {
    mockOnSearch.mockResolvedValueOnce(mockSearchResults);
    mockOnUnfollow.mockResolvedValueOnce(undefined);
    
    render(
      <FollowPanel
        onFollow={mockOnFollow}
        onUnfollow={mockOnUnfollow}
        onSearch={mockOnSearch}
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Cari berdasarkan username...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(screen.getByText('testuser1')).toBeInTheDocument();
    });
    
    const unfollowButtons = screen.getAllByText('Berhenti');
    fireEvent.click(unfollowButtons[0]);
    
    await waitFor(() => {
      expect(mockOnUnfollow).toHaveBeenCalledWith('1');
    });
  });

  // TC-FOLLOW-007: Empty search results
  test('should show empty message when no users found', async () => {
    mockOnSearch.mockResolvedValueOnce([]);
    
    render(
      <FollowPanel
        onFollow={mockOnFollow}
        onUnfollow={mockOnUnfollow}
        onSearch={mockOnSearch}
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Cari berdasarkan username...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    await waitFor(() => {
      expect(screen.getByText('Tidak ada pengguna ditemukan.')).toBeInTheDocument();
    });
  });

  // TC-FOLLOW-008: Search error handling
  test('should display error message when search fails', async () => {
    mockOnSearch.mockRejectedValueOnce(new Error('Search failed'));
    
    render(
      <FollowPanel
        onFollow={mockOnFollow}
        onUnfollow={mockOnUnfollow}
        onSearch={mockOnSearch}
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Cari berdasarkan username...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(screen.getByText('Search failed')).toBeInTheDocument();
    });
  });

  // TC-FOLLOW-009: Loading state during search
  test('should show loading skeleton while searching', async () => {
    mockOnSearch.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockSearchResults), 1000)));
    
    render(
      <FollowPanel
        onFollow={mockOnFollow}
        onUnfollow={mockOnUnfollow}
        onSearch={mockOnSearch}
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Cari berdasarkan username...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Should show loading spinner in input
    await waitFor(() => {
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  // TC-FOLLOW-010: Button disabled during action
  test('should disable buttons while follow/unfollow is processing', async () => {
    mockOnSearch.mockResolvedValueOnce(mockSearchResults);
    mockOnFollow.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    render(
      <FollowPanel
        onFollow={mockOnFollow}
        onUnfollow={mockOnUnfollow}
        onSearch={mockOnSearch}
        loading={true}
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Cari berdasarkan username...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      const followButtons = screen.getAllByRole('button', { name: /ikuti/i });
      expect(followButtons[0]).toBeDisabled();
    });
  });
});

