# Stage 1: Build frontend assets
FROM node:18-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
# Build the frontend with empty VITE_API_URL so it defaults to relative paths in production
ENV VITE_API_URL=""
RUN npm run build

# Stage 2: Set up production server
FROM node:18-alpine
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ ./

# Copy built frontend assets to the location expected by server.js (../client/dist relative to /app/server)
COPY --from=client-builder /app/client/dist /app/client/dist

# Create uploads directory and expose port
RUN mkdir -p uploads
EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
