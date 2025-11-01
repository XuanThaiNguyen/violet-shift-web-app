# Build stage
FROM node:22-alpine AS build

# Set the working directory
WORKDIR /app

# Copy only necessary files to leverage Docker caching and reduce build time
COPY package*.json ./

# Copy lockfile
COPY pnpm-lock.yaml ./

# Copy npmrc
COPY .npmrc ./

# Install pnpm
RUN npm install --global corepack@latest | corepack enable | corepack prepare pnpm@10.0.0 --activate

# Install dependencies (cached if package.json hasn't changed)
RUN pnpm install --frozen-lockfile

# Copy only necessary files for building the application
COPY . .
COPY .env.build .env

# # Create a directory for source maps
# RUN mkdir -p out

# Build the app
RUN pnpm run build

# Production stage
FROM node:22-alpine AS production

# Set the working directory
WORKDIR /app

# Copy the built app from the build stage
COPY --from=build /app/dist /app

# Install a simple HTTP server for serving static content
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Copy scripts from build stage
COPY --from=build /app/scripts ./scripts/

# Make the script executable
RUN chmod +x ./scripts/replace_env.sh

# Run the HTTP server on port 3000
ENTRYPOINT ["./scripts/replace_env.sh"]
