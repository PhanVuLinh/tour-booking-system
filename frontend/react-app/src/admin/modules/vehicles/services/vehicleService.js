const API_URL = 'http://localhost:8080/api/vehicle';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || `Lỗi HTTP: ${response.status}`);
  }
  
  if (response.status === 204) {
    return null; 
  }
  
  return response.json();
};

export const vehicleService = {
  getAll: async () => {
    const response = await fetch(API_URL);
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    return handleResponse(response);
  },

  create: async (data) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-User-Id': '1' 
      },
      body: JSON.stringify(data) 
    });
    return handleResponse(response);
  },

  update: async (id, data) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'X-User-Id': '1' 
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 
        'X-User-Id': '1' 
      }
    });
    return handleResponse(response);
  },

  getTrash: async () => {
    const response = await fetch(`${API_URL}/trash`);
    return handleResponse(response);
  },

  restore: async (id) => {
    const response = await fetch(`${API_URL}/${id}/restore`, { 
      method: 'PUT',
      headers: { 'X-User-Id': '1' }
    });
    return handleResponse(response);
  },

  hardDelete: async (id) => {
    const response = await fetch(`${API_URL}/${id}/force`, { 
      method: 'DELETE',
      headers: { 'X-User-Id': '1' }
    });
    return handleResponse(response);
  }
};