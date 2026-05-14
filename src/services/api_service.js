const API_BASE_URL = 'http://localhost:8000/api/v1'; // Default

export async function fetchClaims() {
  try {
    const response = await fetch(`${API_BASE_URL}/claims`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Fetch claims failed:", error);
    return [];
  }
}

export async function uploadEvidence(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch(`${API_BASE_URL}/upload/`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Upload failed');
    return await response.json();
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}
