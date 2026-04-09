# Keda
[![en](https://img.shields.io/badge/lang-en-red.svg)](README.md)

Una aplicación sencilla para finanzas familiares, que permite el seguimiento de gastos por categorías y la colaboración entre los miembros del hogar.

## Requisitos Previos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Inicio Rápido (Desarrollo)

La forma más rápida de comenzar es utilizando el `Makefile` incluido:

1.  **Configurar el Entorno**:
    ```bash
    cp .env.example .env
    # Edita .env con tus configuraciones (JWT_SECRET, Google Auth, etc.)
    ```

2.  **Iniciar el Entorno**:
    ```bash
    make dev-up
    ```

3.  **Acceder a los Servicios**:
    - **Frontend (Web):** [http://localhost:8080](http://localhost:8080)
    - **Backend (API):** [http://localhost:8090](http://localhost:8090)
    - **Mailpit:** [http://localhost:8025](http://localhost:8025)

## Automatización y Herramientas

Este proyecto utiliza un `Makefile` para centralizar todas las tareas comunes.

### Desarrollo Android

1.  **Configurar el Entorno**:
    Ejecuta el script de configuración para instalar Java y configurar el Android SDK:
    ```bash
    make android-setup
    ```

2.  **Ejecutar en Dispositivo/Emulador**:
    Conecta un dispositivo o inicia un emulador, luego ejecuta:
    ```bash
    make android-run
    ```

3.  **Compilar APK**:
    ```bash
    make android-build   # Debug
    make android-release # Release
    ```

### Pruebas (Testing)
Mantenemos una suite de pruebas exhaustiva que cubre todas las capas:
```bash
make test             # Ejecutar TODAS las pruebas (backend + client + e2e + security + lint)
make test-backend     # Pruebas unitarias de Go con cobertura
make test-client      # Pruebas unitarias de Flutter con cobertura
make test-e2e         # Pruebas de integración de extremo a extremo (Video Demo)
make test-quick       # Solo Backend + Client (omite las lentas E2E)
```

### Calidad de Código (Linting)
Asegúrate de que el código siga los estándares del proyecto:
```bash
make lint             # Ejecuta todos los linters
make lint-backend     # golangci-lint para el servidor Go
make lint-client      # flutter analyze para la aplicación móvil/web
```

### Seguridad
Escaneos de seguridad automatizados para todos los componentes:
```bash
make security-check         # Ejecuta TODOS los escaneos de seguridad
make security-check-gosec   # Análisis de seguridad Go
make security-check-client  # Escaneo Trivy para vulnerabilidades del cliente
make security-check-server  # Escaneo Trivy para vulnerabilidades del servidor
make security-check-mobsf   # Análisis estático MobSF (Seguridad móvil)
make security-check-landing # npm audit para la página de aterrizaje
```

### Página de Aterrizaje (Landing Page)
Herramientas para la página de aterrizaje localizada:
```bash
make landing-build    # Compilar la página de aterrizaje localizada
make landing-serve    # Servir la página de aterrizaje localmente en http://localhost:3000
```

### Mantenimiento
```bash
make help             # Mostrar todos los comandos disponibles
make dev-down         # Detener el entorno de desarrollo
make clean            # Eliminar artefactos de prueba y limpiar el espacio de trabajo
```

## Recomendaciones de Presupuesto

Al principio de cada mes (primeras dos semanas), la aplicación analiza tus gastos del mes anterior y proporciona sugerencias de ajuste de presupuesto:
- **Análisis Automático**: Compara el gasto real frente al presupuesto para cada categoría.
- **Sugerencias Dinámicas**: Recomienda aumentar o disminuir el presupuesto si la varianza es superior al 10%.
- **Integración Fluida**: Las sugerencias aparecen en un banner de notificación en el tablero, permitiéndote revisarlas y aplicarlas con un solo clic.
- **Control del Usuario**: Las sugerencias solo se aplican si el usuario las aprueba explícitamente.

## Documentación
- [Guía de Pruebas E2E](E2E_TESTING.md) - Cómo funcionan las pruebas E2E y la autenticación de prueba
- [Guía de Docker Compose](DOCKER_COMPOSE_GUIDE.md) - Diferencias entre los entornos de desarrollo y prueba
- [Guía de Estilo](STYLE_GUIDE.md) - Estándares de codificación y mejores prácticas

## Licencia

Este proyecto está bajo la Licencia Apache 2.0. Consulta el archivo [LICENSE](LICENSE) para más detalles.
