<template>
  <v-app class="bg-indigo-darken-3">
    <v-app-bar app dark v-if="isAuthenticated" color="#1A237E" class="pl-5 pr-5">
     <p class="mr-auto"> My Project Management App</p>
     <v-icon v-if="isAuthenticated" @click="signOut" >mdi-logout</v-icon>
    </v-app-bar>
    <v-main v-if="!isAuthenticated" >
      <v-card-text v-if="showLoginForm" class="login-container">
        <LoginForm
          @showRegisterForm="showRegisterForm"
          @showLoginForm="toggleLoginForm"
          @userAuthenticated="userAuthenticated"
        />
      </v-card-text>

      <v-card-text v-else>
        <RegisterForm
          @showLoginForm="toggleLoginForm"
          @userAuthenticated="userAuthenticated"
        />
      </v-card-text>
    </v-main>
    <v-main v-if="isAuthenticated">
      
        <ProjectForm />
        <ProjectsCarousel />
      
    </v-main>
  </v-app>
</template>

<script>
import LoginForm from "./components/LoginForm.vue";
import RegisterForm from "./components/RegisterForm.vue";
import ProjectForm from "./components/ProjectForm.vue";
import ProjectsCarousel from "./components/ProjectsCarousel.vue";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase-configuration";

export default {
  name: "App",
  data() {
    return {
      showLoginForm: true,
      isAuthenticated: false,
      user: null,
      showProjectForm: false,
      projectsLoaded: false,
    };
  },
  created() {
    onAuthStateChanged(auth, (user) => {
      this.isAuthenticated = !!user;
      this.user = user;
    });
  },
  methods: {
    showRegisterForm() {
      this.showLoginForm = false;
    },
    toggleLoginForm() {
      this.showLoginForm = !this.showLoginForm;
    },
    onUserAuthenticated(user) {
      this.isAuthenticated = true;
      this.user = user;
      this.showLoginForm = false;
      this.toggleLoginForm();
      this.showProjectForm = true;
    },
    async handleProjectCreated() {
      this.showProjectForm = false;
    },

    signOut() {
      signOut(auth);
      this.isAuthenticated = false;
      this.user = null;
      this.showLoginForm = true;
      this.showProjectForm = false;
    },
  },
  components: {
    RegisterForm,
    LoginForm,
    ProjectForm,
    ProjectsCarousel,
  },
};
</script>

<style scoped>
.login-container {
  width: 100%;
}


@media only screen and (max-width: 600px) {
  .login-container {
    padding: 15px; 
  }
}
</style>
