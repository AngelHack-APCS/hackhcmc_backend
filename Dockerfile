# Use the desired base image
FROM node:22.3.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists) to the container
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the entire project directory to the container (including .env)
COPY . .

RUN npx prisma init

RUN npx prisma db pull

# Run necessary Prisma commands that rely on .env
RUN npx prisma generate

# Build the application
RUN npm run build

# Specify the command to run your application
CMD ["npm", "run", "start:dev"]
