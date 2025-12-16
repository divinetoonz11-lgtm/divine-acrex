// pages/_error.jsx
function Error({ statusCode }) {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>{statusCode || 500}</h1>
      <p>Something went wrong</p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res
    ? res.statusCode
    : err
    ? err.statusCode
    : 404;
  return { statusCode };
};

export default Error;
