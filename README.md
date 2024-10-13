# Notion Clone

This is a Notion clone project built using Next.js, Postgres, Auth.js, and Hono. The database, authentication, and API are implemented from scratch.

## Demo

https://notion-clone.caru.live/

## Features

- User authentication using Auth.js
- Database powered by Postgres
- API built with Hono
- UI components and styling inspired by Notion

## Getting Started

1. Clone the repository:

   ```sh
   git clone https://github.com/caru-ini/notion-clone.git
   ```

   or

   ```sh
   gh repo clone caru-ini/notion-clone
   ```

2. Install the dependencies:

   ```sh
   cd notion-clone
   pnpm install
   ```

3. Set up authentication:

   ```sh
   pnpm dlx auth secret
   ```

   - Environment variable is automatically set in `.env` file.

   - Get GitHub OAuth credentials from [GitHub Developer Settings](https://github.com/settings/applications) and set them in `.env` file.

4. Set up the database:

   ```sh
   docker compose up -d
   ```

   - Copy the `.env.example` file to `.env` and update the database connection details.

   ```sh
   cp .env.example .env
   ```

   - Run Prisma migrations:

   ```sh
   pnpm prisma:migrate
   ```

5. Run the development server:

   ```sh
   pnpm dev
   ```

6. Open your browser and navigate to `http://localhost:3000` to see the application and enjoy!

## Acknowledgements

- This project was inspired by the tutorial video: [Build a Notion Clone with Next.js, Tailwind, and React](https://www.youtube.com/watch?v=0OaDyjB9Ib8)

- The project structure is based on the [caru-ini/next-authjs-template](https://github.com/caru-ini/next-authjs-template) template

## :warning: Disclaimer

This project is made for educational purposes. Content of this project is not affiliated with Notion.
