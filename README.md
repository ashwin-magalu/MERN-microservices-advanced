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
    a. Open the burger menu in top left corner and go to Kubernetes Engine > Clusters
    b. Enable Kuberenetes engine API and wait for new UI to appear on screen
    c. Now click on create button under Kubernetes clusters card
    d. New page appears, it consists of settings, change settings as shown in the image below
    ![1](https://user-images.githubusercontent.com/58284442/130213589-4ff6b72a-2575-418e-9bd2-ddd341b92501.PNG)
    ![2](https://user-images.githubusercontent.com/58284442/130213611-04b7209a-88ee-41f8-937f-fbe2a8090988.PNG)
    e. Click o create then
    
