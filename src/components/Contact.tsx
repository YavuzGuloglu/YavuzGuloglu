import React from 'react';
import '../assets/styles/Contact.scss';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import Box from '@mui/material/Box';

function Contact() {
  return (
    <div id="contact">
      <div className="items-container">
        <div className="contact_wrapper">
          <h1>Contact Me</h1>
          <p>Let's connect! Feel free to reach out through any of the channels below.</p>
          
          <Box className='contact-info'>
            <a href="mailto:yavuzguloglu@outlook.com" className="contact-item">
              <EmailIcon className="contact-icon" />
              <span className="contact-link">
                yavuzguloglu@outlook.com
              </span>
            </a>
            
            <a href="https://www.linkedin.com/in/yavuzguloglu/" target="_blank" rel="noreferrer" className="contact-item">
              <LinkedInIcon className="contact-icon" />
              <span className="contact-link">
                linkedin.com/in/yavuzguloglu/
              </span>
            </a>
            
            <a href="https://github.com/YavuzGuloglu" target="_blank" rel="noreferrer" className="contact-item">
              <GitHubIcon className="contact-icon" />
              <span className="contact-link">
                github.com/YavuzGuloglu
              </span>
            </a>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Contact;