<template>
  <v-carousel hide-delimiters v-if="chunkedProjects.length > 0">
    <v-carousel-item v-for="(chunk, index) in chunkedProjects" :key="index">
      <v-row class="carousel-row">
        <v-col
          v-for="project in chunk"
          :key="project.id"
          :cols="getResponsiveColumns()"
        >
          <template v-if="project && project.id !== undefined">
            <ProjectCard :project="project" />
          </template>
        </v-col>
      </v-row>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
import ProjectCard from "./ProjectCard.vue";

export default {
  components: {
    ProjectCard,
  },
  computed: {
    projects() {
      return this.$store.state.projects;
    },
    
    chunkedProjects() {
      const chunkSize = this.calculateChunkSize();
      const resultArray = [];

      for (let i = 0; i < this.projects?.length; i += chunkSize) {
        resultArray.push(this.projects.slice(i, i + chunkSize));
      }

      return resultArray;
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleWindowResize);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  async created() {
    await this.$store.dispatch("fetchProjects");
  },
  methods: {
    handleWindowResize() {
      this.$forceUpdate();
    },
    calculateChunkSize() {
      const screenWidth = window.innerWidth;

      if (screenWidth < 790) {
        return 1;
      } else {
        return 3;
      }
    },
    getResponsiveColumns() {
      return {
        xs: 12,
        sm: 6,
        md: 4,
        lg: 3,
      };
    },
  },
};
</script>

<style scoped>
.carousel-row {
  justify-content: space-around;
  margin: 10px 10px;
}

.v-carousel {
  max-width: 100%;
  margin: 0 auto;
}

.v-carousel .v-carousel__controls .v-icon {
  backdrop-filter: blur(5px);
  opacity: 0.7;
}

@media only screen and (max-width: 600px) {
  .login-container {
    padding: 15px;
  }
  .container-styling {
    width: 100%;
    height: 400px;
  }
}
</style>
