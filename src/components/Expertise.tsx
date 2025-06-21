import React from "react";
import '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReact, faJs, faHtml5 } from '@fortawesome/free-brands-svg-icons';
import Chip from '@mui/material/Chip';
import '../assets/styles/Expertise.scss';

const labelsFirst = [
    "React",
    "TypeScript",
    "JavaScript",
    "HTML5",
    "CSS3",
    "SCSS/Sass",
    "Redux",
    "Zustand",
    "Context API",
    "REST API",
    "Responsive Design"
];

const labelsSecond = [
    "Git",
    "Webpack",
    "Cypress",
    "Postman",
    "Node.js",
    "Micro Frontend",
    "Voltran",
    "Material-UI",
    "Bootstrap",
];

const labelsThird = [
    "E-commerce",
    "Checkout Flow",
    "Payment Integration",
    "Shopping Cart",
    "User Experience",
    "Cross-browser",
    "Performance",
];

function Expertise() {
    return (
    <div className="container" id="expertise">
        <div className="skills-container">
            <h1>Expertise</h1>
            <div className="skills-grid">
                <div className="skill">
                    <FontAwesomeIcon icon={faReact} size="3x"/>
                    <h3>Frontend Development</h3>
                    <p>I specialize in building complex web applications with React, TypeScript, and modern JavaScript. I focus on creating seamless user experiences and enjoy collaborating with UX designers to deliver high-quality frontend solutions.</p>
                    <div className="flex-chips">
                        <span className="chip-title">Tech stack:</span>
                        {labelsFirst.map((label, index) => (
                            <Chip key={index} className='chip' label={label} />
                        ))}
                    </div>
                </div>

                <div className="skill">
                    <FontAwesomeIcon icon={faJs} size="3x"/>
                    <h3>Development Tools & Testing</h3>
                    <p>Experienced in modern development workflows including version control, build tools, testing frameworks, and deployment processes to ensure code quality and maintainability.</p>
                    <div className="flex-chips">
                        <span className="chip-title">Tech stack:</span>
                        {labelsSecond.map((label, index) => (
                            <Chip key={index} className='chip' label={label} />
                        ))}
                    </div>
                </div>

                <div className="skill">
                    <FontAwesomeIcon icon={faHtml5} size="3x"/>
                    <h3>E-commerce & User Experience</h3>
                    <p>Specialized in e-commerce frontend development with expertise in checkout flows, payment integration, and micro frontend architecture. Focus on optimizing user experience and performance for large-scale applications.</p>
                    <div className="flex-chips">
                        <span className="chip-title">Tech stack:</span>
                        {labelsThird.map((label, index) => (
                            <Chip key={index} className='chip' label={label} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Expertise;