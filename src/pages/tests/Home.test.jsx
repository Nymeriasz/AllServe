import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home'; // CORRIGIDO: ../
import { useAuth } from '../../context/AuthContext'; // CORRIGIDO: ../../

// --- MOCKS ---
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn()
}));

vi.mock('../../firebase/config', () => ({ db: {} }));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  limit: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: [], forEach: vi.fn() }))
}));

describe('Home Component', () => {
  it('renderiza corretamente para cliente', async () => {
    useAuth.mockReturnValue({
      userRole: 'cliente',
      currentUser: { uid: '123' }
    });

    render(<BrowserRouter><Home /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Ache o bartender/i })).toBeInTheDocument();
    });
  });
});