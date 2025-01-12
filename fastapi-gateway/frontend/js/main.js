document.addEventListener("DOMContentLoaded", () => {
    // Manejar formulario de login
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            try {
                const response = await login(username, password);

                if (response.token) {
                    alert("Login exitoso");
                    window.location.href = "/reviews.html";
                } else {
                    throw new Error(response.message || "Error inesperado");
                }
            } catch (error) {
                alert(`Error al iniciar sesión: ${error.message}`);
            }
        });
    }

    // Manejar formulario de registro
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            try {
                const response = await register(username, password);
                console.log("Respuesta del servidor:", response);

                if (response.message === "Usuario registrado exitosamente") {
                    alert("Registro exitoso. Redirigiendo al login...");
                    window.location.href = "/login.html"; // Redirige al login.html
                } else {
                    throw new Error(response.message || "Error inesperado");
                }
            } catch (error) {
                alert(`Error al registrar: ${error.message}`);
                console.error("Error en el registro:", error);
            }
        });
    }

    // Manejar reseñas
    const reviewsContainer = document.getElementById("reviewsContainer");
    const createReviewBtn = document.getElementById("createReviewBtn");
    const reviewForm = document.getElementById("reviewForm");
    const filterUserButton = document.getElementById("filterUserButton");
    const filterBookButton = document.getElementById("filterBookButton");
    const resetFiltersButton = document.getElementById("resetFiltersButton");

    // Función para cargar todas las reseñas
    async function loadAllReviews() {
        try {
            const reviews = await fetchReviews();
            renderReviews(reviews);
        } catch (error) {
            console.error("Error al cargar las reseñas:", error);
            reviewsContainer.innerHTML = "<p>Error al cargar las reseñas.</p>";
        }
    }

    function renderReviews(reviews) {
        if (reviews.length === 0) {
            reviewsContainer.innerHTML = "<p>No se encontraron reseñas.</p>";
            return;
        }
        reviewsContainer.innerHTML = reviews
            .map(
                (review) => `
                    <div class="card my-3">
                        <div class="card-body">
                            <h5 class="card-title">${review.book_title} (${review.rating}/5)</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${review.author} - ${review.username}</h6>
                            <p class="card-text">${review.review_content}</p>
                            ${
                                review.username === "Aitor123"
                                    ? `<button class="btn btn-danger btn-sm delete-btn" data-id="${review.id}">Eliminar</button>`
                                    : ""
                            }
                        </div>
                    </div>`
            )
            .join("");

        // Agregar eventos de clic a los botones de eliminar
        document.querySelectorAll(".delete-btn").forEach((button) => {
            button.addEventListener("click", async (e) => {
                const reviewId = e.target.getAttribute("data-id");
                try {
                    await deleteReview(reviewId);
                    alert("Reseña eliminada exitosamente");
                    loadAllReviews(); // Recargar las reseñas
                } catch (error) {
                    alert(`Error al eliminar reseña: ${error.message}`);
                }
            });
        });
    }

    // Función para eliminar una reseña
    async function deleteReview(id) {
        try {
            const response = await fetch(`${API_URL}/reviews/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al eliminar la reseña");
            }
        } catch (error) {
            console.error("Error en deleteReview:", error);
            throw error;
        }
    }

    // Filtrar reseñas por usuario
    filterUserButton.addEventListener("click", async () => {
        const username = document.getElementById("filterUsername").value.trim();

        if (!username) {
            alert("Por favor, introduce un nombre de usuario para filtrar.");
            return;
        }

        try {
            const reviews = await fetchReviews();
            const filteredReviews = reviews.filter((review) =>
                review.username.toLowerCase().includes(username.toLowerCase())
            );
            renderReviews(filteredReviews);
        } catch (error) {
            console.error("Error al filtrar reseñas por usuario:", error);
            alert("No se pudieron filtrar las reseñas. Intenta de nuevo.");
        }
    });

    // Filtrar reseñas por título del libro
    filterBookButton.addEventListener("click", async () => {
        const bookTitle = document.getElementById("filterBookTitle").value.trim();

        if (!bookTitle) {
            alert("Por favor, introduce un título de libro para filtrar.");
            return;
        }

        try {
            const reviews = await fetchReviews();
            const filteredReviews = reviews.filter((review) =>
                review.book_title.toLowerCase().includes(bookTitle.toLowerCase())
            );
            renderReviews(filteredReviews);
        } catch (error) {
            console.error("Error al filtrar reseñas por título de libro:", error);
            alert("No se pudieron filtrar las reseñas. Intenta de nuevo.");
        }
    });

    // Quitar todos los filtros
    resetFiltersButton.addEventListener("click", async () => {
        await loadAllReviews();
    });

    // Mostrar todas las reseñas al cargar la página
    loadAllReviews();

    // Mostrar modal para crear reseña
    if (createReviewBtn) {
        createReviewBtn.addEventListener("click", () => {
            const createReviewModal = new bootstrap.Modal(document.getElementById("createReviewModal"));
            createReviewModal.show();
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const bookId = document.getElementById("bookId").value || 0;
            const bookTitle = document.getElementById("bookTitle").value || "Título desconocido";
            const author = document.getElementById("author").value || "Autor desconocido";
            const reviewContent = document.getElementById("reviewContent").value || "Sin contenido";
            const rating = parseFloat(document.getElementById("rating").value) || 1;

            console.log("Datos del formulario:", { bookId, bookTitle, author, reviewContent, rating });

            const reviewData = {
                book_id: parseInt(bookId, 10),
                book_title: bookTitle,
                author: author,
                review_content: reviewContent,
                rating: rating,
                username: "Aitor123",
            };

            try {
                await createReview(reviewData);
                alert("Reseña creada exitosamente");
                loadAllReviews();
            } catch (error) {
                alert(`Error al crear reseña: ${error.message}`);
            }
        });
    }
});
