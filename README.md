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


