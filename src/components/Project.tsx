import React from "react";
import mock01 from '../assets/images/mock01.png';
import mock02 from '../assets/images/mock02.png';
import mock03 from '../assets/images/mock03.png';
import mock04 from '../assets/images/mock04.png';
import mock05 from '../assets/images/mock05.png';
import mock06 from '../assets/images/mock06.png';
import mock07 from '../assets/images/mock07.png';
import mock08 from '../assets/images/mock08.png';
import mock09 from '../assets/images/mock09.png';
import mock10 from '../assets/images/mock10.png';
import '../assets/styles/Project.scss';

function Project() {
    return(
    <div className="projects-container" id="projects">
        <h1>Personal Projects</h1>
        <div className="projects-grid">
            <div className="project">
                <a href="https://github.com/YavuzGuloglu/frontend-task" target="_blank" rel="noreferrer"><img src={mock10} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/YavuzGuloglu/frontend-task" target="_blank" rel="noreferrer"><h2>Frontend Task</h2></a>
                <p>A frontend development project showcasing modern web development skills with JavaScript and responsive design principles.</p>
            </div>
            <div className="project">
                <a href="https://github.com/YavuzGuloglu/component_training" target="_blank" rel="noreferrer"><img src={mock09} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/YavuzGuloglu/component_training" target="_blank" rel="noreferrer"><h2>Component Training</h2></a>
                <p>Component-based development training project focusing on reusable UI components and modern JavaScript practices.</p>
            </div>
            <div className="project">
                <a href="https://github.com/YavuzGuloglu/country-search" target="_blank" rel="noreferrer"><img src={mock08} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/YavuzGuloglu/country-search" target="_blank" rel="noreferrer"><h2>Country Search</h2></a>
                <p>Interactive country search application with real-time filtering and country information display using modern web technologies.</p>
            </div>
            <div className="project">
                <a href="https://github.com/YavuzGuloglu/SanOto" target="_blank" rel="noreferrer"><img src={mock07} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/YavuzGuloglu/SanOto" target="_blank" rel="noreferrer"><h2>SanOto</h2></a>
                <p>JavaScript-based project demonstrating advanced frontend development techniques and user interface design.</p>
            </div>
            <div className="project">
                <a href="https://github.com/YavuzGuloglu/Django_blog" target="_blank" rel="noreferrer"><img src={mock06} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/YavuzGuloglu/Django_blog" target="_blank" rel="noreferrer"><h2>Django Blog</h2></a>
                <p>Full-stack blog application built with Django and Python, featuring content management and user authentication.</p>
            </div>
            <div className="project">
                <a href="https://github.com/YavuzGuloglu/GYM" target="_blank" rel="noreferrer"><img src={mock05} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/YavuzGuloglu/GYM" target="_blank" rel="noreferrer"><h2>GYM Desktop Application</h2></a>
                <p>Desktop application developed with C#, providing gym management functionality and user interface design.</p>
            </div>
            <div className="project">
                <a href="https://github.com/YavuzGuloglu/react-portfolio-template" target="_blank" rel="noreferrer"><img src={mock04} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/YavuzGuloglu/react-portfolio-template" target="_blank" rel="noreferrer"><h2>React Portfolio Template</h2></a>
                <p>A modern, responsive portfolio template built with React, TypeScript, and Material-UI. Features dark/light mode and smooth animations.</p>
            </div>
            <div className="project">
                <a href="https://github.com/YavuzGuloglu" target="_blank" rel="noreferrer"><img src={mock03} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/YavuzGuloglu" target="_blank" rel="noreferrer"><h2>Frontend Components</h2></a>
                <p>Collection of reusable React components and frontend utilities for modern web applications.</p>
            </div>
            <div className="project">
                <a href="https://github.com/YavuzGuloglu" target="_blank" rel="noreferrer"><img src={mock02} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/YavuzGuloglu" target="_blank" rel="noreferrer"><h2>Web Development Tools</h2></a>
                <p>Various web development tools and utilities for improving development workflow and code quality.</p>
            </div>
            <div className="project">
                <a href="https://github.com/YavuzGuloglu" target="_blank" rel="noreferrer"><img src={mock01} className="zoom" alt="thumbnail" width="100%"/></a>
                <a href="https://github.com/YavuzGuloglu" target="_blank" rel="noreferrer"><h2>JavaScript Projects</h2></a>
                <p>Collection of JavaScript projects demonstrating modern ES6+ features and frontend development best practices.</p>
            </div>
        </div>
    </div>
    );
}

export default Project;