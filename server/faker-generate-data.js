const {faker} = require('@faker-js/faker');
const generateProject = (owner) => ({
  name: faker.commerce.product(),
  owner: { ...owner },
  participants: [{ ...owner }],
  numParticipants: 1,
});

const generateFakerProjects = (owner, numProjects) => {
    const projects = Array.from({length: numProjects}, () => generateProject(owner));
    return projects
}

module.exports = generateFakerProjects;