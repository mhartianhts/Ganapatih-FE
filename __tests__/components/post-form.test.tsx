/**
 * Post Form Component - Automated Tests
 * 
 * Test File untuk komponen PostForm
 * Menggunakan React Testing Library dan Jest
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PostForm } from '@/components/dashboard/post-form';
import '@testing-library/jest-dom';

// Mock useToast hook
jest.mock('@/components/ui/toast', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

describe('PostForm Component', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  // TC-POST-001: Render component correctly
  test('should render post form with all elements', () => {
    render(<PostForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByText('Buat Postingan')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Apa yang sedang Anda pikirkan?')).toBeInTheDocument();
    expect(screen.getByText('Bersihkan')).toBeInTheDocument();
    expect(screen.getByText('Kirim')).toBeInTheDocument();
    expect(screen.getByText('0 / 200')).toBeInTheDocument();
  });

  // TC-POST-002: Character counter updates correctly
  test('should update character counter when typing', () => {
    render(<PostForm onSubmit={mockOnSubmit} />);
    
    const textarea = screen.getByPlaceholderText('Apa yang sedang Anda pikirkan?');
    
    fireEvent.change(textarea, { target: { value: 'Hello World' } });
    
    expect(screen.getByText('11 / 200')).toBeInTheDocument();
  });

  // TC-POST-003: Character limit validation
  test('should have maxLength attribute set to 200', () => {
    render(<PostForm onSubmit={mockOnSubmit} />);
    
    const textarea = screen.getByPlaceholderText('Apa yang sedang Anda pikirkan?') as HTMLTextAreaElement;
    
    // Check that textarea has maxLength attribute
    expect(textarea).toHaveAttribute('maxLength', '200');
  });

  // TC-POST-004: Submit valid post
  test('should call onSubmit when valid content is submitted', async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined);
    
    render(<PostForm onSubmit={mockOnSubmit} />);
    
    const textarea = screen.getByPlaceholderText('Apa yang sedang Anda pikirkan?');
    const submitButton = screen.getByText('Kirim');
    
    fireEvent.change(textarea, { target: { value: 'Test post content' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('Test post content');
    });
  });

  // TC-POST-005: Prevent empty post submission
  test('should not submit empty post', () => {
    render(<PostForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /kirim/i });
    
    // Button should be disabled when content is empty
    expect(submitButton).toBeDisabled();
  });

  // TC-POST-006: Clear button functionality
  test('should clear textarea when clear button is clicked', () => {
    render(<PostForm onSubmit={mockOnSubmit} />);
    
    const textarea = screen.getByPlaceholderText('Apa yang sedang Anda pikirkan?') as HTMLTextAreaElement;
    const clearButton = screen.getByText('Bersihkan');
    
    fireEvent.change(textarea, { target: { value: 'Some content' } });
    expect(textarea.value).toBe('Some content');
    
    fireEvent.click(clearButton);
    expect(textarea.value).toBe('');
  });

  // TC-POST-007: Loading state
  test('should show loading state when submitting', async () => {
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    render(<PostForm onSubmit={mockOnSubmit} loading={true} />);
    
    expect(screen.getByText('Mengirim...')).toBeInTheDocument();
    
    const textarea = screen.getByPlaceholderText('Apa yang sedang Anda pikirkan?');
    expect(textarea).toBeDisabled();
  });

  // TC-POST-008: Character counter color changes
  test('should change character counter color based on length', () => {
    render(<PostForm onSubmit={mockOnSubmit} />);
    
    const textarea = screen.getByPlaceholderText('Apa yang sedang Anda pikirkan?');
    
    // Less than 150 - should be gray/slate
    fireEvent.change(textarea, { target: { value: 'a'.repeat(100) } });
    let counter = screen.getByText('100 / 200');
    expect(counter.className).toContain('slate');
    
    // Between 151-180 - should be amber
    fireEvent.change(textarea, { target: { value: 'a'.repeat(160) } });
    counter = screen.getByText('160 / 200');
    expect(counter.className).toContain('amber');
    
    // More than 180 - should be red
    fireEvent.change(textarea, { target: { value: 'a'.repeat(190) } });
    counter = screen.getByText('190 / 200');
    expect(counter.className).toContain('red');
  });

  // TC-POST-009: Trim whitespace before submit
  test('should trim whitespace before submitting', async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined);
    
    render(<PostForm onSubmit={mockOnSubmit} />);
    
    const textarea = screen.getByPlaceholderText('Apa yang sedang Anda pikirkan?');
    const submitButton = screen.getByText('Kirim');
    
    fireEvent.change(textarea, { target: { value: '  Test content  ' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('Test content');
    });
  });

  // TC-POST-010: Clear form after successful submit
  test('should clear form after successful submission', async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined);
    
    render(<PostForm onSubmit={mockOnSubmit} />);
    
    const textarea = screen.getByPlaceholderText('Apa yang sedang Anda pikirkan?') as HTMLTextAreaElement;
    const submitButton = screen.getByText('Kirim');
    
    fireEvent.change(textarea, { target: { value: 'Test content' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(textarea.value).toBe('');
      expect(screen.getByText('0 / 200')).toBeInTheDocument();
    });
  });
});

