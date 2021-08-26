import buildClient from "../api/build-client";

const Home = ({ currentUser }) => {
  return currentUser ? (
    <div className="container">You are Signed In</div>
  ) : (
    <div className="container">You are not Signed In</div>
  );
};

Home.getInitialProps = async (context) => {
  /* This Home.getInitialProps won't work as we have called getInitialProps() in _app.js file, this is an issue with NextJS, If you call getInitialProps() inside _app.js, we can't use that function anymore with other pages. So we have to add following lines: 
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  inside our _app.js files getInitialProps function */

  const client = buildClient(context);
  const { data } = await client.get("/api/users/currentuser");

  return data;
};

export default Home;
