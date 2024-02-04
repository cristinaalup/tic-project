import { createStore } from "vuex";
import axios from "axios";
import { auth } from "../../firebase-configuration";

const store = createStore({
  state: {
    user: null,
    projects: [],
    updatedProject: {
      id: "",
      name: "",
      numParticipants: 1,
      owner: null,
      participants: [],
    },
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_PROJECTS(state, projects) {
      state.projects = projects;
    },
    ADD_PROJECT(state, project) {
      state.projects.push(project);
    },
    SET_UPDATED_PROJECT(state, project) {
      state.updatedProject = project;
    },
    REMOVE_PROJECT(state, projectId) {
      state.projects = state.projects.filter((project) => project.id !== projectId);
    },
  },
  actions: {
    async fetchUser(context) {
      try {
        const user = auth.currentUser;
        context.commit("SET_USER", user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    },
    async fetchProjects(context) {
      try {
        const response = await axios.get("http://localhost:3000/getAllProjects");
        const projects = response.data;
        context.commit("SET_PROJECTS", projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    },
    async createProject(context, { name, owner }) {
      try {
        const response = await axios.post("http://localhost:3000/createProject", {
          name,
          owner,
        });

        const createdProject = response.data;
        context.commit("ADD_PROJECT", createdProject);
        await context.dispatch("fetchProjects");
      } catch (error) {
        console.error("Error creating project:", error.message);
        throw error;
      }
    },
    async updateProject({ commit, state, dispatch }, project) {
      try {
        await axios.put(`http://localhost:3000/projects/${project.id}`, project);
    
        const updatedProjects = state.projects.map((p) =>
          p.id === project.id ? { ...project } : p
        );
        commit("SET_PROJECTS", updatedProjects);
        dispatch("fetchProjects");
      } catch (error) {
        console.error("Error on project update (Vuex method):", error.message);
        
      }
    },
    async deleteProject({ commit, dispatch }, projectId) {
      try {
        await axios.delete(`http://localhost:3000/projects/${projectId}`);
        commit("REMOVE_PROJECT", projectId);
        await dispatch("fetchProjects");
      } catch (error) {
        console.error("Error deleting project:", error.message);
      }
    },
  },
});

export default store;
