import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import '../assets/styles/Main.scss';

function Main() {

  return (
    <div className="container">
      <div className="about-section">
        <div className="image-wrapper">
          <img src="https://media.licdn.com/dms/image/v2/D4D03AQE-86K6mEGlbA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1700936321651?e=1755734400&v=beta&t=x8Fy9C1Ai1LHsHu_PNzqWAVHp9keYppChS0evRM6G1A" alt="Avatar" />
        </div>
        <div className="content">
          <div className="social_icons">
            <a href="https://github.com/YavuzGuloglu" target="_blank" rel="noreferrer"><GitHubIcon/></a>
            <a href="https://www.linkedin.com/in/yavuzguloglu/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
          </div>
          <h1>Yavuz Güloğlu</h1>
          <p>Front-End Engineer</p>

          <div className="mobile_social_icons">
            <a href="https://github.com/YavuzGuloglu" target="_blank" rel="noreferrer"><GitHubIcon/></a>
            <a href="https://www.linkedin.com/in/yavuzguloglu/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;