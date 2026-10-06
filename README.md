# Project Task Manager

Aplicación web para la gestión de tareas de proyectos de software, desarrollada con React, Node.js, Express y PostgreSQL.

El sistema permite registrar y administrar tareas asociadas a proyectos de software.

## Funcionalidades

- Crear tareas.
- Listar tareas.
- Editar tareas.
- Finalizar tareas.
- Eliminar tareas.
- Persistir la información en PostgreSQL.

Cada tarea contiene:

- Nombre del proyecto
- Tipo de actividad
- Estado
- Resumen
- Descripción
- Prioridad
- Informador
- Persona asignada
- Precondición
- Fecha de creación
- Fecha de cierre
- Sprint

## Tecnologías utilizadas

### Frontend
- React
- TypeScript
- Vite

### Backend
- Node.js
- Express

### Base de datos
- PostgreSQL

### Contenedores
- Docker
- Docker Compose

## Arquitectura

La aplicación está compuesta por tres servicios:

Frontend (React + Vite)
        |
        | HTTP / REST
        v
Backend (Node.js + Express)
        |
        | SQL
        v
PostgreSQL

Los tres servicios se ejecutan mediante Docker Compose.

## Endpoints

### Crear tarea

POST /tasks

### Listar tareas

GET /tasks

### Editar tarea

PUT /tasks/:id

### Finalizar tarea

PATCH /tasks/:id/finalizar

### Eliminar tarea

DELETE /tasks/:id

## Ejecución

Desde la raíz del proyecto ejecutar:

docker compose up --build

Luego acceder a:

Frontend:
http://localhost:5173

Backend:
http://localhost:3001

## Persistencia

PostgreSQL utiliza un volumen de Docker para mantener los datos aunque los contenedores sean detenidos o reiniciados.