import React, { useState, useRef } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import geminiImage from '../images/gemini.png';
import pokemonImage from '../images/pokemon.png';
import loanImage from '../images/loan calculator.png';
import tunexImage from '../images/tunex.png'; // Assuming you have a Tunex image


const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });
  
  const categories = ['All', 'Web Development', 'UI/UX Design',];
  
  const projects = [
    {
      id: 1,
      title: 'Tunex - Full Stack Music Player',
      category: 'Web Development',
      image: tunexImage,
      description: 'Built a full-stack music streaming platform using the MERN stack, featuring user authentication, music playback, playlists, and responsive UI. Integrated real-time audio control and dynamic content rendering for a seamless listening experience.',
      technologies: ['React', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB'],
      demoLink: 'https://tunex.onrender.com',
      codeLink: 'https://github.com/AbhishekSinhaa17/Tunex'
    },
    {
      id: 2,
      title: 'AI-powered chatbot GeminiClone',
      category: 'Web Development',
      image: geminiImage,
      description: 'Built an AI-powered chatbot using Natural Language Processing (NLP).Enabled advanced contextual search and automated code assistance, improving developer efficiency.',
      technologies: ['React', 'Node.js', 'Hooks', 'Gemini API'],
      demoLink: 'https://gemini-clone-one-sand.vercel.app',
      codeLink: 'https://github.com/AbhishekSinhaa17/Gemini-Clone'
    },
    {
      id: 3,
      title: 'Pokemon Web App',
      category: 'Web Development',
      image: pokemonImage,
      description: 'Created an interactive Pokémon comparison platform with React.js and TypeScript.Used Firebase Authentication Firestore Database for backend services.',
      technologies: ['Redux', 'TypeScript', 'Firebase', 'SCSS'],
      demoLink: 'https://pokemon-webapp-main.vercel.app',
      codeLink: 'https://github.com/AbhishekSinhaa17/pokemon_webapp-main'
    },
    {
      id: 4,
      title: ' Movie Recommender System',
      category: 'Web Development',
      image: 'https://user-images.githubusercontent.com/86877457/132905471-3ef27af4-ecc6-44bf-a47c-5ccf2250410c.jpg',
      description: 'Built an intelligent movie recommendation system using Python and Jupyter Notebook. Implemented content-based and collaborative filtering techniques to suggest personalized movie recommendations. ',
      technologies: ['Python', 'Jupyter Notebook', 'Redux'],
      codeLink: 'https://github.com/AbhishekSinhaa17/Movie-Recommender-System-master?tab=readme-ov-file'
    },
    {
      id: 5,
      title: 'Loan Calculator App',
      category: 'UI/UX Design',
      image: loanImage,
      description: 'A responsive React + Vite Loan EMI Calculator with real-time currency conversion using ExchangeRate API, amortization schedule, light/dark mode, and error handling. Built with Material UI.',
      technologies: ['React+vite', 'Exchange Rate API', 'Material UI'],
      demoLink: 'https://loan-calculator-92qor3bk7-abhishek-sinhas-projects-67ef53a1.vercel.app/',
      codeLink: 'https://github.com/AbhishekSinhaa17/Loan-Calculator-App/tree/main/loan-calculator'
    },

    // {
    //   id: 6,
    //   title: 'Task Management App',
    //   category: 'Mobile App',
    //   image: 'https://images.pexels.com/photos/7014337/pexels-photo-7014337.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    //   description: 'A productivity app for managing tasks, projects, and team collaboration. Features include drag-and-drop organization and time tracking.',
    //   technologies: ['Flutter', 'Firebase', 'BLoC Pattern'],
    //   demoLink: '#',
    //   codeLink: '#'
    // }
  ];

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      className="py-20 md:py-28 bg-white dark:bg-gray-800 transition-colors"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            My <span className="text-blue-600 dark:text-blue-400">Projects</span>
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-10">
            Explore a selection of my recent work across web development, UI/UX design, and mobile applications.
            Each project represents unique challenges and creative solutions.
          </p>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div 
              key={project.id}
              className={`transform transition-all duration-700 ease-out group bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl ${
                isInView 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden h-56">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-600/90 text-white rounded-full">
                      {project.category}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  <a 
                    href={project.demoLink} 
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    Live Demo <ExternalLink size={16} />
                  </a>
                  <a 
                    href={project.codeLink} 
                    className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Code <Github size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;