import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div style={{ padding: 40 }}>
      <h1>401 – Unauthorized</h1>
      <Link to="/login">Go to login</Link>
    </div>
  );
};

export default Unauthorized;
