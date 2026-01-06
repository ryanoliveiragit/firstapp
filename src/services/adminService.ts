// Admin API Service - CRUD operations for license keys
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface LicenseKey {
  id: string;
  key: string;
  isValid: boolean;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  lastUsedAt: string | null;
  maxUses: number;
  usedCount: number;
  usedBy: string | null;
}

export interface CreateKeyDto {
  key?: string;
  isValid?: boolean;
  userId?: string;
  expiresAt?: string;
  maxUses?: number;
}

export interface UpdateKeyDto {
  key?: string;
  isValid?: boolean;
  userId?: string;
  expiresAt?: string;
  maxUses?: number;
  usedCount?: number;
  usedBy?: string;
}

class AdminService {
  // Get all license keys
  async getAllKeys(): Promise<LicenseKey[]> {
    const response = await fetch(`${API_URL}/admin/keys`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch license keys');
    }

    return response.json();
  }

  // Get license key by ID
  async getKeyById(id: string): Promise<LicenseKey> {
    const response = await fetch(`${API_URL}/admin/keys/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch license key');
    }

    return response.json();
  }

  // Get license key by key value
  async getKeyByValue(key: string): Promise<LicenseKey> {
    const response = await fetch(`${API_URL}/admin/keys/key/${key}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch license key');
    }

    return response.json();
  }

  // Create new license key
  async createKey(data: CreateKeyDto): Promise<LicenseKey> {
    const response = await fetch(`${API_URL}/admin/keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create license key');
    }

    return response.json();
  }

  // Update license key
  async updateKey(id: string, data: UpdateKeyDto): Promise<LicenseKey> {
    const response = await fetch(`${API_URL}/admin/keys/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update license key');
    }

    return response.json();
  }

  // Delete license key
  async deleteKey(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/admin/keys/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete license key');
    }
  }

  // Reset key usage
  async resetKeyUsage(id: string): Promise<LicenseKey> {
    const response = await fetch(`${API_URL}/admin/keys/${id}/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to reset key usage');
    }

    return response.json();
  }
}

export const adminService = new AdminService();
