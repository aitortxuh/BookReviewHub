const API_URL = "http://localhost:8080/api";

async function login(username, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error en el servidor");
    }

    return await response.json();
}



async function register(username, password) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en el registro:", errorData);  
        throw new Error(errorData.message || "Error en el servidor");
    }

    const data = await response.json();
    console.log("Respuesta del registro:", data);  
    return data;
}


async function fetchReviews() {
    const response = await fetch(`${API_URL}/reviews`);
    if (!response.ok) {
        throw new Error("Error al obtener reseñas");
    }
    return response.json();
}

async function createReview(data) {
    try {
        const response = await fetch(`${API_URL}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Error al crear la reseña");
        }

        return await response.json();
    } catch (error) {
        console.error("Error en createReview:", error);
        throw error;
    }
}



