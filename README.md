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
    e. Click on create button
    
4. Kubectl contexts:
    Run the following command: kubectl get pods
        i. Type 1: Your Computer(Kubectl) ---> Your Computer(Context for C #1) --> Cluster #1
                                           |-> Your Computer(Context for C #1) --> Cluster #1
        ii. Type 2: Install Google Cloud SDK. It is easiest way
            Visit https://cloud.google.com/sdk/docs/quickstart to learn more about how to install
            Install GCloud SDK and follow the steps:
                a. Login to gcloud: gcloud auth login
                b. Initialize GCloud: gcloud init and follow the steps
5. Installing the GCloud Context:
    There are two ways:
        1. Don't want to run Docker at all?
            a. Close Docker Desktop
            b. Run in Powershell as Administrator: gcloud components install kubectl
            c. Run in Powershell as Administrator: gcloud container clusters get-credentials <clusterName>
        2. OK still running Docker?
            a. Run in Powershell as Administrator: gcloud container clusters get-credentials <clusterName>
6. Right click on docker icon in bottom right corner of your screen, click on kubernetes. You will see different contexts, you can select whichever you like, whether docker desktop or our new google cloud context we created few minutes back
7. Updating the Skaffold configuration:
    a. Enable Google Cloud Build
        i. Open the burger menu in top left corner and go to Cloud Build > Enable it
    b. Update the skaffold.yaml file to use Google Cloud Build and update image in auth-depl.yaml to us.gcr.io/<yourCloudCusterId>/auth
    c. Setup ingress-nginx on your google cloud cluster (Load Balancer): https://kubernetes.github.io/ingress-nginx
        i. Run in the root directory: kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.30.0/deploy/static/mandatory.yaml
        ii. Visit https://kubernetes.github.io/ingress-nginx/deploy/#gce-gke --> For Google Cloud. Run in the root directory: kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.30.0/deploy/static/provider/cloud-generic.yaml

        Load Balancer:
                Outside World --> Load Balancer --|
                            Cloud Provider[ingress controller --> Pods]
            Config file containing router rules --|

    d. Update our hosts file again to point to the remote cluster:
        i. Open the burger menu in top left corner and go to Network services > Load balancing
        ii. Click on the load balancer name generated
        iii. Copy the IP address from the TCP label
        iv. Open Hosts file from C:\Windows\System32\Drivers\etc\hosts
        v. Update the IP address present in front of ticketing.dev URL to new IP address you copied from Google Cloud
    e. Restart Skaffold: 
        i. Run in the root directory: skaffold dev
    f. Open https://ticketing.dev/api/users/currentuser in your browser now to check whether everything is working fine
