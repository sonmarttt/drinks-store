// A module for implementing an HTTP client (AJAX and fetch API).

export async function fetchData(resourceUri) {
    try {
        const response = await fetch(resourceUri);
        if (!response.ok) {
            throw new Error(`An error occurred while processing the request ${response.status}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        throw error;
    }
}