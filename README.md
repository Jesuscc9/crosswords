### **README.md**

# Proyecto SPA con React, TypeScript y Vite

Este es un proyecto de una **Single Page Application (SPA)** utilizando **React**, **TypeScript**, y **Vite** como nuestro compilador. El gestor de paquetes que utilizamos es **pnpm** para una instalación más rápida y eficiente. A continuación, les explico cómo instalar y configurar el proyecto para empezar a trabajar en él :)

## Requisitos previos

Asegúrate de tener instaladas las siguientes herramientas en tu sistema antes de comenzar:

### 1. **Node.js**

- Puedes descargarlo desde [aquí](https://nodejs.org/).
- Asegúrate de que tienes al menos la versión 14.x o superior.
- Verifica tu instalación con el siguiente comando en la terminal o consola:

  ```bash
  node -v
  ```

### 2. **pnpm**

- Instalamos **pnpm** como nuestro gestor de paquetes:

  ```bash
  npm install -g pnpm
  ```

- Verifica la instalación:

  ```bash
  pnpm -v
  ```

### 3. **Git**

- Git es necesario para clonar el repositorio y realizar seguimiento de cambios. Si aún no tienes Git instalado, sigue los pasos a continuación según tu sistema operativo:

  - **Windows**:

    - Descarga Git desde [git-scm.com](https://git-scm.com/).
    - Durante la instalación, selecciona las opciones predeterminadas.
    - Verifica la instalación:
      ```bash
      git --version
      ```

  - **Mac**:
    - Abre la terminal y ejecuta el siguiente comando:
      ```bash
      git --version
      ```
    - Si Git no está instalado, se te pedirá que lo instales automáticamente. Sigue las instrucciones que aparecen en la pantalla.

### 4. **Editor de código recomendado**

- Se recomienda usar **Visual Studio Code (VSCode)** para este proyecto. Puedes descargarlo [aquí](https://code.visualstudio.com/).

## Pasos para instalar y configurar el proyecto

### 1. Clonar el repositorio

Primero, clona el repositorio a tu máquina local. Abre una terminal o consola y ejecuta el siguiente comando:

```bash
git clone https://github.com/Jesuscc9/crosswords.git
```

Luego, entra en el directorio del proyecto:

```bash
cd crosswords
```

### 2. Instalar dependencias

Una vez dentro del directorio del proyecto, ejecuta el siguiente comando para instalar todas las dependencias necesarias:

```bash
pnpm install
```

Este comando descargará e instalará todas las bibliotecas que el proyecto necesita para funcionar correctamente.

### 3. Configurar Git (solo la primera vez)

- Si es tu primera vez usando Git en este proyecto o en tu compu, asegúrate de configurarlo con tu nombre y correo electrónico (se recomienda usar el mismo que en github, pero puede ser cualquiera). Esto es necesario para que puedas realizar commits correctamente.

  ```bash
  git config --global user.name "Tu Nombre"
  git config --global user.email "tu.email@ejemplo.com"
  ```

### 4. Iniciar el servidor de desarrollo

Para iniciar el servidor de desarrollo, ejecuta:

```bash
pnpm dev
```

Esto iniciará el proyecto localmente, y podrás acceder a la aplicación en tu navegador en la siguiente URL:

```
http://localhost:5173
```

### 5. Comandos útiles

- **Compilar para producción**: Para generar una compilación optimizada lista para producción, ejecuta:

  ```bash
  pnpm build
  ```

  Los archivos generados estarán en la carpeta `dist`.

- **Previsualizar la compilación de producción**: Para ver cómo se verá el proyecto en producción:

  ```bash
  pnpm preview
  ```

- **Linter y formato de código**: Este proyecto utiliza `eslint` y `prettier` para asegurar la calidad del código. Puedes verificar errores de linting y formatear tu código con los siguientes comandos:
  ```bash
  pnpm lint
  pnpm format
  ```

### 6. Contribuir al proyecto

Para contribuir al proyecto, sigue estos pasos:

1. **Crear una nueva rama**: Crea una rama nueva para tu feature o corrección de errores:

   ```bash
   git checkout -b mi-nueva-rama
   ```

2. **Hacer tus cambios**: Realiza los cambios necesarios en el código.

3. **Commit y push**: Haz commit de tus cambios y envía la rama a GitHub.

   ```bash
   git add .
   git commit -m "Descripción de mis cambios"
   git push origin mi-nueva-rama
   ```

4. **Crear un Pull Request (PR)**: Desde GitHub, crea un PR para que podamos revisar tus cambios antes de integrarlos en la rama principal.

### 7. Estructura del proyecto

- **src/**: Contiene todo el código fuente de la aplicación.
  - **components/**: Componentes reutilizables de la UI.
  - **pages/**: Páginas principales de la aplicación.
  - **assets/**: Imágenes, íconos, y otros recursos estáticos.
  - **App.tsx**: Componente raíz de la aplicación.

### 8. Soporte

Si tienes alguna duda o problema al configurar el proyecto, no dudes en preguntar.
