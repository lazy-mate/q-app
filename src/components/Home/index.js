import "./home.css"
import { Link } from "react-router-dom";

function Home() {
    return (
        <div>
            <div className="main">
                <h1>Q-App</h1>
                <h2>Home</h2>
                <Link to={`/company`}><button className="home-btn">Are You Company ?</button></Link>
                <Link to={`/user`}><button className="home-btn">Are you Waiting For Tokens ?</button></Link>
            </div>
        </div>
    );
}

export default Home;