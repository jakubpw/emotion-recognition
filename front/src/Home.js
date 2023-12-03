import { Outlet, Link } from "react-router-dom";

const Home = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/RFC">Test the emotion recognition with the random forest classifier</Link>
                    </li>
                    <li>
                        <Link to="/LSTM">Test the emotion recognition with the LSTM</Link>
                    </li>
                </ul>
            </nav>

            <Outlet />
        </>
    )
};

export default Home;