/* import buildClient from "../api/build-client"; */
import Link from "next/link";

const Home = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

Home.getInitialProps = async (context, client, currentUser) => {
  /* This Home.getInitialProps won't work as we have called getInitialProps() in _app.js file, this is an issue with NextJS, If you call getInitialProps() inside _app.js, we can't use that function anymore with other pages. So we have to add following lines: 
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  inside our _app.js files getInitialProps function */

  const { data } = await client.get("/api/tickets");

  //return data;
  return { tickets: data };
};

export default Home;
