import axios from "axios";

const buildClient = ({ req }) => {
  /* Checking whether it is executing in the server or the client */
  if (typeof window === "undefined") {
    /* http://namespaceName.serviceInThatNamespace.svc.cluster.local/api/users/currentuser */

    return axios.create({
      //baseURL: "http://ingress-nginx.ingress-nginx.svc.cluster.local",
      baseURL: "whatever_your_purchased_domain_is",
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: "/",
    });
  }
};

export default buildClient;
