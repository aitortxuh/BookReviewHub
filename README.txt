## 0) Software necesario

Antes de comenzar, asegúrate de tener instalado en tu sistema:
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (para pruebas locales de los microservicios)
- [Python 3.9+](https://www.python.org/downloads/) (opcional para pruebas locales de FastAPI)
- [MySQL](https://www.mysql.com/) (opcional para pruebas locales sin Docker)


0) Para iniciar los contenedores que forman la aplicación (reviews-microservice, express-auth-api, fastapi-gateway y la base de datos):

docker-compose up

Si necesitas reconstruir los contenedores, ejecuta el siguiente comando:
docker-compose up --build --force-recreate --no-deps

También puedes reiniciar un contenedor específico (por ejemplo, el gateway):
docker-compose up -d --no-deps --build main-app

Los siguientes pasos se llevarían a cabo en caso de que desees iniciar los servicios manualmente sin usar Docker:

1) Iniciar el microservicio de reseñas:
cd reviews-microservice
pip install -r requirements.txt (dentro: fastapi==0.75.0, uvicorn[standard]==0.17.6, sqlalchemy==1.4.27, mysql-connector-python==8.0.29, pydantic==1.9.0)
uvicorn app:app --reload --port 8001

Ruta del microservicio: `http://localhost:8001`

2) Iniciar el microservicio de autenticación:
cd express-auth-api
npm install (dentro: express, bcryptjs, jsonwebtoken, mysql2, dotenv, swagger-ui-express,yamljs)
node server.js

Ruta del microservicio: `http://localhost:8002`

3) Iniciar el API Gateway:
cd fastapi-gateway
pip install -r requirements.txt (dentro: fastapi, uvicorn[standard], httpx)
uvicorn main:app --reload --port 8080

Ruta del API Gateway: `http://localhost:8080`

4) Cómo acceder a la parte cliente:

La parte cliente está integrada en el API Gateway. Una vez que el servicio esté corriendo, puedes acceder al frontend en:

Ruta del frontend: `http://localhost:8080`

Desde el frontend puedes:
- **Registrar un nuevo usuario**.
- **Iniciar sesión**.
- **Crear, ver y eliminar reseñas**.
- **Buscar reseñas por usuario o título de libro**.

También puedes acceder a las rutas de la API:
- Documentación del microservicio de autenticación: `http://localhost:8002/docs`
- Documentación del microservicio de reseñas: `http://localhost:8001/docs`


