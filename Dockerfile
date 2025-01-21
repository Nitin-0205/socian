FROM node:22.13.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --only=production

# Install @nestjs/cli globally
RUN npm install -g @nestjs/cli

# Copy the rest of the application code to the working directory
COPY . .

ENV DATABASE_URL="postgresql://nitin:test@my_pg/momento"
# ENV DATABASE_URL="postgresql://momento_owner:dhr7AqwMF3ln@ep-restless-king-a58abduj.us-east-2.aws.neon.tech/momento?sslmode=require"

# Generate Prisma Client
RUN npx prisma generate

# migrate the database
RUN npx prisma migrate dev 

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/src/main.js"]



# docker buildx build -t socialapplocal:latest .
# docker run --network nitin_default -p 3000:3000 socialapplocal
# docker exec -it <container_name> npx prisma migrate dev --name init


# docker run --name my_pg -e POSTGRES_USER=nitin -e POSTGRES_PASSWORD=test -e POSTGRES_DB=momento -p 5432:5432 -d postgres
# docker run --name my_pg --network nitin_default -e POSTGRES_USER=nitin -e POSTGRES_PASSWORD=test -e POSTGRES_DB=momento -p 5432:5432 -d postgres


# docker run --network nitin_default --name jenkins -p 8080:8080 -p 50000:50000 jenkins/jenkins


