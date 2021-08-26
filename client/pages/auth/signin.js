import { useState } from "react";
import Router from "next/router";

import useRequest from "../../hooks/use-request";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: { email, password },
    onSuccess: () => Router.push("/"),
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <div className="container">
      <form onSubmit={submitHandler}>
        <h1>Sign In</h1>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="text"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errors}
        <button type="submit" className="btn btn-primary mt-3">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
