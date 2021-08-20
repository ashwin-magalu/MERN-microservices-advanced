# Backend Setup
1. Create folders auth, expiration, orders, payments and tickets
2. Inside each folder create package.json file using command npm init -y, then install required packages using command npm i typescript ts-node-dev express @types/express, and then create a tsconfig.json file using command tsc --init
3. Create Dockerfile and .dockerignore files
4. Build an image using command docker build -t <dockerId>/auth .
