# Backend Setup

1. Create folders auth, expiration, orders, payments, tickets and infa
2. Inside each folder create package.json file using command: npm init -y, then install required packages using command: npm i typescript ts-node-dev express @types/express, and then create a tsconfig.json file using command: tsc --init
3. Create Dockerfile and .dockerignore files
4. Build an image using command: docker build -t <dockerId>/auth .
5. Create a new folder named k8s inside infra folder, within this k8s folder create respective depl.yaml files like: auth-depl.yaml, orders-depl.yaml etc.
6. Create a new file in Root directory called skaffold.yaml
7. Run the following command in the root folder: skaffold dev
8. Now skaffold will look for any changes and if there is any change, it will restart by itself, if it didn't restart by itself on change in some file, change the start script in package.json to: ts-node-dev --poll src/index.ts
9. Visit site https://kubernetes.github.io/ingress-nginx/ to deploy ingress-nginx in your system
10. Create a new file named ingress-srv.yaml inside k8s folder
11. Open Host file in your machine: Open following file from the location:
    Windows --> C:\Windows\System32\Drivers\etc\hosts
    MacOS/Linux --> /etc/hosts
    and add the following line at the end of the file: 127.0.0.1 ticketing.dev
12. If you try to open this URL in the browser, you will come across a warning, when that warning is displayed, simply type "thisisunsafe", this will solve the problem.

# Remote Development using Google Cloud (Optional - Requires Credit Card to create free account)

## How Skaffold works in Google Cloud:

### Scenario 1: We change a 'Synced' file:

    Your Computer(Change to file listed in 'sync' section --> skaffold) -->corresponding file in appropriate pod --> Google Cloud VM(Update  in Google Cloud VM).

### Scenario 2: We change a 'Unsynced' file

    Your Computer(Change to file not listed in 'sync' section --> skaffold) --> Rebuild image --> Google Cloud Build(Source code + Dockerfile ==> Docker Build ==> Updated Image) --> Update Deployment --> Google Cloud VM(Deployment --> Pod)

## Starting with Google Cloud

1. Open https://console.cloud.google.com/ link, sign in if you are not signed in
2. Create a new project and go to Dashboard
3. Kubernetes cluster creation:

   - Open the burger menu in top left corner and go to Kubernetes Engine > Clusters
   - Enable Kuberenetes engine API and wait for new UI to appear on screen
   - Now click on create button under Kubernetes clusters card
   - New page appears, it consists of settings, change settings as shown in the image below

   ![1](https://user-images.githubusercontent.com/58284442/130213589-4ff6b72a-2575-418e-9bd2-ddd341b92501.PNG)
   ![2](https://user-images.githubusercontent.com/58284442/130213611-04b7209a-88ee-41f8-937f-fbe2a8090988.PNG)

   - Click on create button

4. Kubectl contexts:
   - Run the following command: kubectl get pods:
     - Type 1: Your Computer(Kubectl) ---> Your Computer(Context for C #1) --> Cluster #1
       |-> Your Computer(Context for C #1) --> Cluster #1
     - Type 2: Install Google Cloud SDK. It is easiest way
       Visit https://cloud.google.com/sdk/docs/quickstart to learn more about how to install
       Install GCloud SDK and follow the steps: - Login to gcloud: gcloud auth login - Initialize GCloud: gcloud init and follow the steps
5. Installing the GCloud Context:
   - There are two ways:
     - Don't want to run Docker at all?
       - Close Docker Desktop
       - Run in Powershell as Administrator: gcloud components install kubectl
       - Run in Powershell as Administrator: gcloud container clusters get-credentials <clusterName>
     - OK still running Docker?
       - Run in Powershell as Administrator: gcloud container clusters get-credentials <clusterName>
6. Right click on docker icon in bottom right corner of your screen, click on kubernetes. You will see different contexts, you can select whichever you like, whether docker desktop or our new google cloud context we created few minutes back
7. Updating the Skaffold configuration:

   - Enable Google Cloud Build
     - Open the burger menu in top left corner and go to Cloud Build > Enable it
   - Update the skaffold.yaml file to use Google Cloud Build and update image in auth-depl.yaml to us.gcr.io/<yourCloudCusterId>/auth
   - Setup ingress-nginx on your google cloud cluster (Load Balancer): https://kubernetes.github.io/ingress-nginx

     - Run in the root directory: kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.30.0/deploy/static/mandatory.yaml
     - Visit https://kubernetes.github.io/ingress-nginx/deploy/#gce-gke --> For Google Cloud. Run in the root directory: kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.30.0/deploy/static/provider/cloud-generic.yaml

     Load Balancer:
     Outside World --> Load Balancer --|
     Cloud Provider[ingress controller --> Pods]
     Config file containing router rules --|

   - Update our hosts file again to point to the remote cluster:
     - Open the burger menu in top left corner and go to Network services > Load balancing
     - Click on the load balancer name generated
     - Copy the IP address from the TCP label
     - Open Hosts file from C:\Windows\System32\Drivers\etc\hosts
     - Update the IP address present in front of ticketing.dev URL to new IP address you copied from Google Cloud
   - Restart Skaffold:
     - Run in the root directory: skaffold dev
   - Open https://ticketing.dev/api/users/currentuser in your browser now to check whether everything is working fine

# DB management and modeling

## Creating DB in Kubernetes

1. Create a new file named auth-mongo-depl.yaml in k8s folder
2. Restart Skaffold
3. Run: kubectl get pods

   If we delete or restart the pod running mongoDB, we will lose all of the data in it.

## Connecting to MongoDB

1. Install mongoose and connect to DB using Host and Port you added in auth-mongo-depl.yaml

# Authentication Strategies

There are two ways:

1. Individual service rely on the auth service
   - Changes to auth state are immediately reflected
   - Auth service goes down? Entire app is broken
2. Individual services know how to authenticate a user

   - Auth service down? Who cares!
   - Changes to auth state are not immediately reflected. We can fix it, but it's bit complicated

   We follow 2nd type of authentication strategy in this application.

# Difference between Cookie and JWT

## Cookie:

A cookie is a small piece of data created by a server and sent to your browser when you visit a website. Browsers often need to store and send it back to the server to tell that the request is coming from the same browser, to keep the user authenticated. We read the browser cookies as “key-value” pairs.
A Cookie-based authentication uses the HTTP cookies to authenticate the client requests and maintain session information on the server over the stateless HTTP protocol.

    - Transport mechanism
    - Moves any kind of data between browser and server
    - Automatically managed by the browser

## JWT:

In token-based authentication, we store the user’s state on the client. JSON Web Token (JWT) is an open standard that defines a way of securely transmitting information between a client and a server as a JSON object.
The anatomy of a JWT token comprises three parts separated by dots(.). The three parts include the JWT header, the JWT payload, and its signature respectively (header.payload.signature).
The JWT Header is a Base64 URL-encoded JSON object. It contains information describing the type of token and the signing algorithm used, such as HMAC, SHA256, or RSA.
The JWT Payload contains claims that are pieces of information asserted about a subject. The claims will contain the statements about the user and any other additional data. The claims in a JWT are encoded as a JSON object that is used as the payload of a JSON Web Signature. Claims will either be registered, public or private.
Creating the JWT signature involves taking the encoded header, the encoded payload, a secret key, and applying the algorithm specified.
Authentication via tokens is a stateless mechanism, as no information about the user is ever stored in the server memory or databases.

    - Authentication/Authorization mechanism
    - Stores any data we want
    - We have to manage it manually

You can debug your cookie in https://www.base64decode.org/ website
You can debug your jwt in https://jwt.io/ website

# Creating a secret in kubernetes

1. Run command in root folder: kubectl create secret generic jwt-secret --from-literal=JWT_KEY=your_base64_key
   generic --> general purpose
   jwt-secret --> secret key name
   JWT_KEY=your_base64_key --> key-value pairs of secret, you can generate your_base64_key from https://generate.plus/en/base64 website

2. Run command: kubectl get secrets --> to get list of all secret keys you have created
3. Update depl.yaml file to include these secret keys under env

# Testing with Microservices

## Scope of Our Tests:

- Test a single piece of code in isolation --> Single middleware
- Test how different pieces of code work together --> Request following through multiple middlewares to a request handler
- Test how different components work together --> Make a request to service, ensure write to database was completed
- Test how different services work together --> Creating a 'payment' at the 'payments' service should affect the 'orders' service

We will run these tests using our terminal. We will use Jest for testing

## Basic Request Handling Testing

1. We create app.ts file inside auth folder's src folder for testing, which won't listen to any set PORT
2. Install the following dependencies as development dependencies: npm i --save-dev @types/jest @types/supertest jest ts-jest supertest mongodb-memory-server
3. Add a new script in package.json file of auth: "test": "jest --watchAll --no-cache"
4. Add another block just for 'jest' inside package.json file of auth:
   "jest": {
   "preset": "ts-jest",
   "testEnvironment": "node",
   "setupFilesAfterEnv": [
   "./src/test/setup.ts"
   ]
   },
5. Create a new folder within src folder of auth named as "test", within test folder, create a new file named "setup.ts" and add code as shown in that file
6. To test 'signup handler' we will create a new folder inside routes folder (parent folder of the file we are planning to test) of auth named as "_test_". Inside this folder create a new file named "signup.test.ts" and add code as shown in that file. We follow the same convention in testing all files.
7. Now run the command: npm run test

# Creating a Front End

1. Create a new folder named "client" and in terminal get inside to Client directory
2. run npm init -y
3. Install following dependencies using command: npm i react react-dom next
4. Create Dockerfile and .dockerignore files
5. Create a new file in k8s folder named "client-depl.yaml"
6. Edit skaffold.yaml file to add client image under artifacts section and also edit ingress-srv.yaml file to add new path
7. Run: skaffold dev
8. Add next.config.js file in client folder
9. Kill the client kubectl pod using following commands:

- kubectl get pods
- kubectl delete pod <podName>
- kubectl get pods

10. To see all namespaces type command: kubectl get namespace
11. To see all services within different namespaces type command: kubectl get services -n <namespaceName>

getInitialProps executed on Server in these cases:

- Hard refresh of the page
- Clicking link from different domain
- Typing URL into address bar

getInitialProps executed on Client in these cases:

- Navigating from one page to another while in the appropriate

# Code Sharing and Reuse Between Services

Options for Sharing common code:

- Copy Paste common code in all required directories
- Sharing common codes using Git Submodule
- Publishing all the common code as a NPM package

##### We will follow third method here. So to publish a NPM package, follow these steps:

- Open https://npmjs.com website
- Create an account
- Click on your Image > select Add Organization
- Add organization name and click on create button
- Go to root directory and create a new folder named "common" and change terminal directory to "common"
- Run: npm init -y
- Change name inside the package.json file to "@<yourOrganizationNameAsPerInNM>/common"
- Run commands:
  - git init
  - git add .
  - git commit -m "initial commit"
- Run: npm login
- Run: npm publish --access public
- Run: tsc --init
- Run: npm i typescript del-cli --save-dev
- Edit tsconfig.json file and package.json file
- Create index.js file inside src folder
- Run: npm run build --> This will create build folder
- Run commands:
  - git add .
  - git commit -m "second commit"
  - npm version patch --> To update the version number
  - npm run build
  - npm publish
- Don't use pub script which is inside package.json in real applications
- Move errors and middlewares folders from auth folder to common folder
- Stop Skaffold
- Run: npm i express-validator jsonwebtoken express cookie-session @types/cookie-session @types/express @types/jsonwebtoken
- Run: tsc
- Run: npm run pub
- Run: npm i @ashwin-ma/common --> In auth folder
- Rewrite errors and middlwares imports in auth folder
- Re-run skaffold to test is everything is working
- You can find Common folder and its code in: https://github.com/ashwin-magalu/common-npm-package

# Create-Read-Update-Destroy Server Setup

- Copy package.json, Dockerfile, .dockerignore, app.ts, index.ts, .gitignore and tsconfig.json files and test folder from auth folder to tickets folder
- Run: npm i --> inside tickets folder
- Remove redundant imports and codes related to them, update name in package.json
- Create tickets-depl.yaml and tickets-mongo-depl.yaml files in k8s folder and add the configuration
- Update the skaffold.yaml file
- Update the ingress-srv.yaml file inside the k8s folder
- Add code and test the URL's

# NATS Streaming Server - An event bus implementation - https://docs.nats.io

NATS is a connective technology that powers modern distributed systems. A connective technology is responsible for addressing and discovery and exchanging of messages that drive the common patterns in distributed systems; asking and answering questions, aka services/microservices, and making and processing statements, or stream processing.

- NATS and NATS Streaming Server are two different things
- NATS Streaming implements some extraordinary important design decisions that will affect our application
- We are going to run the official "nats-streaming" docker image in kubernetes. Need to read the image's docs
- Check out https://docs.nats.io/nats-streaming-concepts/intro , https://docs.nats.io/nats-streaming-server/changes and https://hub.docker.com/_/nats-streaming
- Focus on "Commandline Options" in https://hub.docker.com/_/nats-streaming website

- Create a file named "nats-depl.yaml" inside k8s folder
- Run: skaffold dev
- Run: kubectl get pods

# Building a NATS test project

- Create a new folder named "nats-test" in the root directory
- Run following commands:
  - cd nats-test
  - npm init -y
  - npm i node-nats-streaming ts-node-dev typescript @types/node
  - tsc --init
- Create src folder within nats-test folder
- Create two files named publisher.ts and listener.ts inside the src folder
- Add scripts in package.json file
- Edit publisher.ts file
- Run following commands:
  - kubectl get pods
  - kubectl port-forward <nats-depl-pod-name> 4222:4222
- Run: npm run publish --> in another terminal
- Edit listener.ts file
- Run: npm run listen --> in another terminal
- Run: rs --> to restart the publisher or listener files
- Run: kubectl port-forward <nats-depl-pod-name> 8222:8222
- Open http://localhost:8222/streaming and http://localhost:8222/streaming/channelsz?subs=1 in the browser to see data
- Copy paste base-listener, base-publisher, subjects and ticket-created-event files from nats-test folder to events folder in common directory and modify as required
- Run: npm run pub --> in common directory
- Run: kubectl delete pod <nats-depl-pod-name>

# Managing a NATS client

- Move to tickets folder
- Create a new folder called "events" within src folder of tickets. Within "events" folder, create one more folder named "publishers"
- Create a new file within src folder of tickets, called "nats-wrapper.ts"

# Cross-Service Data Replication In Action

- Create files inside orders folder
- Create orders-depl.yaml and orders-mongo-depl.yaml files within k8s directory
- Add orders image to skaffold.yaml file
- Add orders path in ingress-srv.yaml file

# Listening for Events and Handling Concurrency Issues

- Create Listeners in orders directory to listen to ticket creation event
- Create Listeners in orders directory to listen to ticket updation event
- Create instances of these listeners in index.ts file
- Run: npm i mongoose-update-if-current --> In tickets directory

When should we increment or include the 'version' number of a record with an event?
Increment the 'version' number whenever the primary service responsible for a record emits an event to describe a create/update/destroy to a record.

# Worker Services

- Create expiration folder within root directory
- Install required dependencies
- Create expiration-redis-depl.yaml and expiration-depl.yaml files in k8s directory
- Edit skaffold.yaml file to add paths

# Handling Payments

- Create Payments folder in the root directory
- Install required dependencies
- Create payments-depl.yaml and payments-mongo-depl.yaml files in k8s directory
- Edit skaffold.yaml file to add paths
- Run: npm i stripe --> in payments directory
- Visit: https://stripe.com/en-in
- Create account and get Publish key and Secret Key from stripe
- Run command: kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=<yourStripeSecretKey>
- Run: kubectl get secrets
- Add env to payments-depl.yaml file in k8s folder
- Create a new file called stripe.ts inside src folder of payments directory

# Deploying

While pushing code to git repository, we can follow two approaches:

- Mono repo approach (we are following this approach)
- Repo per service approach
- Run a github action, this will call this action every time there is a changes made to our main branch, for more information visit https://docs.github.com/en/actions/reference/events-that-trigger-workflows
- Go to actions section in your git repository
- Select simple workflow or setup a workflow yourself
- Rename yml file to tests-auth.yml and remove all code inside that
- Add code as shown in the following file: https://github.com/ashwin-magalu/MERN-microservices-advanced/blob/main/.github/workflows/tests.yml
- Click on Start Commit button in top-right and click on commit new file
- Now we have created a github action
- Add following script in auth folder's package.json file: "test:ci": "jest"
- Create a new branch
- Make some changes in auth folder
- Commit changes to this new branch and push it to remote repository
- Create a PR
- Github action is activated in your PR, confirm that this action check is passed before merging
- Merge this branch onto master branch
- Create multiple .yml files in workflow directory inside git repository for multiple tests
- Add "test:ci": "jest" script in all those directories

# Deployment using Digital Ocean

- Visit: https://www.digitalocean.com/ and sign up
- Click on Create > Cluster
- Rename your cluster and click on create cluster button
- Follow the steps, if you don't see the steps to be followed pop up, visit: https://github.com/digitalocean/doctl
- Install doctl
- Run: doctl --> in terminal to check whether it is installed properly
- Go back to digitalocean dashboard > click on API and generate new token > copy the newly genrated token
- Run: doctl auth init <copiedToken>
- Run: doctl kubernetes cluster kubeconfig save <clusterName> --> To get connection info for our new cluster
- Run: kubectl config view --> List all contexts
- Run: kubectl config use-context <contextName> --> To use a different context
- Create a new workflow in github repository's action section
- Create deploy actions .yml files for all clusters we need
- Add Code as shown in this file: https://github.com/ashwin-magalu/MERN-microservices-advanced/blob/main/.github/workflows/deploy-auth.yml
- Add DOCKER_USERNAME and DOCKER_PASSWORD secrets in settings > secrets section
- Change ingress-srv to act based on development mode or production mode

- Adding secrets to Digital Ocean:

  - Run: kubectl config use-context <contextName>
  - Run: kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<yourJWTKey>
  - Run: kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<yourStripeKey>

- Visit: https://kubernetes.github.io/ingress-nginx/deploy/#digital-ocean
- Run: kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.0.0/deploy/static/provider/do/deploy.yaml
- 
