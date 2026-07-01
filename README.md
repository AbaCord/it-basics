# Intro Course

## Getting Started

### Prerequisites

- [Bun](https://bun.com/)
- [PostgreSQL](https://www.postgresql.org/download/)

### Setup

1. Clone the repository:

   ```sh
   git clone git@github.com:AbaCord/intro-course.git
   cd intro-course
   ```

2. Install dependencies:

   ```sh
   bun install
   ```

3. Create your environment file:

   ```sh
   cp .env.example .env
   ```

4. Install and set up PostgreSQL.

   If you don't already have PostgreSQL installed, download it from:
   https://www.postgresql.org/download/

   Once PostgreSQL is running, create a database.

   ```sh
   createdb intro_course
   ```

5. Update the values in `.env`:

   - `BETTER_AUTH_SECRET`
     - Generate a random secret with at least 32 characters.
     - You can use:
       ```sh
       openssl rand -base64 32
       ```
       or use the **Generate Secret** button in the [Better Auth installation guide](https://better-auth.com/docs/installation#set-environment-variables).

   - `BETTER_AUTH_URL`
     - Leave as `http://localhost:3000` for local development.

   - `DATABASE_URL`
     - Create a connection string for the database you created.
     - The format looks like this:

       ```text
       postgres://<username>:<password>@localhost:5432/intro_course
       ```

     - Replace `<username>` with your postgres username.
     - Replace `<password>` with the password you chose during installation (or remove `:<password>` if you didn't set one).
     - Put the result in `DATABASE_URL`.

   - `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`
     - Create a [GitHub OAuth App](https://github.com/settings/developers).
     - Set the Authorization callback URL to:
       ```
       http://localhost:3000/api/auth/callback/github
       ```
     - Copy the Client ID and Client Secret into `.env`.

6. Run the database migrations:

   ```sh
   bunx drizzle-kit migrate
   ```

7. Start the development server:

   ```sh
   bun run dev
   ```
