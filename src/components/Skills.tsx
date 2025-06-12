import React, { useRef } from 'react';
import { useInView } from '../hooks/useInView';

const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.2 });

  const skills = [
    { name: 'C++', level: 90 },
    { name: 'HTML', level: 95 },
    { name: 'CSS/Tailwind', level: 92 },
    { name: 'JavaScript', level: 90 },
    { name: 'React.js', level: 95 },
    { name: 'Node.js', level: 85 },   
    { name: 'Express.js', level: 85 },
    { name: 'DBMS', level: 80 },
    { name: 'Data Structures', level: 80 },
  ];

  const technologies = [
    'Redux', 'REST APIs', 'Git','Github', 'MongoDB', 
    'MYSQL', 'Visual Code Studio', 'Juypter Notebook','JWT','Firebase','Postman', 'Vercel', 'Render', 'Vite'
  ];

  return (
    <section 
      id="skills" 
      ref={sectionRef}
      className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900 transition-colors"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            My <span className="text-blue-600 dark:text-blue-400">Skills</span>
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            I've developed expertise in various technologies over the years, with a focus on
            front-end as well as back-end development and design. Here's a breakdown of my technical capabilities:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Main Skills with Progress Bars */}
          <div 
            className={`transform transition-all duration-1000 ${
              isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h3 className="text-xl font-semibold mb-8">Expertise</h3>
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <div key={index} className="skill-item">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-gray-600 dark:text-gray-400">{skill.level}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full transform-gpu transition-all duration-1000 ease-out"
                      style={{ 
                        width: isInView ? `${skill.level}%` : '0%',
                        transitionDelay: `${index * 100}ms`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Technologies */}
          <div 
            className={`transform transition-all duration-1000 delay-500 ${
              isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h3 className="text-xl font-semibold mb-8">Technologies</h3>
            <div className="flex flex-wrap gap-3">
              {technologies.map((tech, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-sm shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-default"
                  style={{ 
                    transitionDelay: `${(index % 8) * 100}ms`,
                    opacity: isInView ? 1 : 0,
                    transform: isInView ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s ease-out'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
            
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-4">Languages</h3>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p>English (Fluent)</p>
                <p>Hindi (Native)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;