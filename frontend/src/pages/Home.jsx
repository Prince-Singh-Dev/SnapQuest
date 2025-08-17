import {Link} from "react-router-dom";
import "./Home.css";

function Home(){
    return(
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero">
                <h1>Welcome to SnapQuest</h1>
                <p>Learn photography step by step , unlock challenges and climb the global leaderboard!</p>
                <Link to="/signup">
                    <button className="cta-btn">Get Started →</button>
                </Link>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="feature-card">
                    <h2>✍️ Lessons </h2>
                    <p>Complete Lessons to earn points , badges and unlock challenges.</p>
                    <Link to="/lessons">Explore Lessons →</Link>
                </div>

                <div className="feature-card">
                    <h2>🏆 Challenges</h2>
                    <p>Compete in photography challenges and rise in the rankings.</p>
                    <Link to="/challenges">Join Challenges →</Link>
                </div>

                <div className="feature-card">
                    <h2>👤 Profile</h2>
                    <p>Track your progress , Badges and world rankings.</p>
                    <Link to="/profile">View Profile →</Link>
                </div>
            </section>

            {/*Footer*/}
            <footer className ="footer">
                <p>© {new Date().getFullYear()} SnapQuest. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;