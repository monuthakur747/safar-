# Safar Travelling App

Welcome to the Safar Travelling App! This application allows users to explore beautiful travel destinations across India and book travel packages.

## Project Structure

The project is divided into two main parts: the client and the server.

### Client

The client is built using React and Vite. It contains the following structure:

- `src/`: Contains the source code for the React application.
  - `index.jsx`: The entry point of the React application.
  - `App.jsx`: The main application component.
  - `components/`: Contains reusable UI components.
    - `ui/`: Contains UI components like Card and Button.
    - `PackageCard.jsx`: A component to display travel packages.
  - `pages/`: Contains different pages of the application.
    - `Home.jsx`: The home page of the application.
  - `styles/`: Contains global styles.
    - `globals.css`: Global CSS styles for the application.
- `package.json`: Contains dependencies and scripts for the client.
- `vite.config.js`: Configuration file for Vite.
- `.env`: Environment variables for the client.

### Server

The server is built using TypeScript and handles the backend logic. It contains the following structure:

- `src/`: Contains the source code for the server.
  - `index.ts`: The entry point of the server application.
  - `routes/`: Contains route definitions.
    - `packages.route.ts`: Routes related to travel packages.
  - `controllers/`: Contains the logic for handling requests.
    - `packages.controller.ts`: Controller for travel package operations.
  - `services/`: Contains business logic and data handling.
    - `packages.service.ts`: Service for managing travel packages.
  - `db/`: Contains database connection logic.
    - `client.ts`: Database client setup.
- `prisma/`: Contains Prisma schema for database modeling.
  - `schema.prisma`: Defines the database schema.
- `package.json`: Contains dependencies and scripts for the server.
- `tsconfig.json`: TypeScript configuration file.
- `.env`: Environment variables for the server.

## Getting Started

To get started with the Safar Travelling App, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the client directory and install dependencies:
   ```
   cd client
   npm install
   ```

3. Navigate to the server directory and install dependencies:
   ```
   cd ../server
   npm install
   ```

4. Set up your environment variables in the `.env` files for both client and server.

5. Start the server:
   ```
   npm run start
   ```

6. Start the client:
   ```
   cd ../client
   npm run dev
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License. See the LICENSE file for details.