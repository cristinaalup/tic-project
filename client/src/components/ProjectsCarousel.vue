<template>
  <div>
    <div>
      <v-row
        justify="center"
        class="mx-auto container-styling"
        :class="{ 'flex-column': isMobileOrTablet }"
      >
        <v-text-field
          v-model="ownerFilter"
          label="Search by owner"
          prepend-inner-icon="mdi-filter"
        />

        <v-text-field
          v-model="projectNameFilter"
          label="Search by project name"
          prepend-inner-icon="mdi-filter"
        />
      </v-row>
    </div>
    <v-carousel
      hide-delimiters
      v-if="getFilteredAndChunkedProjects().length > 0"
    >
      <v-carousel-item
        v-for="(chunk, index) in getFilteredAndChunkedProjects()"
        :key="index"
      >
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
  </div>
</template>

<script>
import ProjectCard from "./ProjectCard.vue";

export default {
  data() {
    return {
      ownerFilter: "",
      projectNameFilter: "",
      isMobileOrTablet: window.innerWidth <= 600,
    };
  },
  components: {
    ProjectCard,
  },
  computed: {
    projects() {
      return this.$store.state.projects;
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleWindowResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  async created() {
    await this.$store.dispatch("fetchUser");
    await this.$store.dispatch("fetchProjects");
  },
  methods: {
    getFilteredAndChunkedProjects() {
      const filteredProjects = this.projects.filter((project) => {
        const ownerMatch = project.owner.displayName
          .toLowerCase()
          .includes(this.ownerFilter.toLowerCase());
        const projectNameMatch = project.name
          .toLowerCase()
          .includes(this.projectNameFilter.toLowerCase());

        return ownerMatch && projectNameMatch;
      });

      const chunkSize = this.calculateChunkSize();
      const resultArray = [];

      for (let i = 0; i < filteredProjects.length; i += chunkSize) {
        resultArray.push(filteredProjects.slice(i, i + chunkSize));
      }

      return resultArray;
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
    handleWindowResize() {
      this.isMobileOrTablet = window.innerWidth <= 600;
      this.$forceUpdate();
    },
  },
};
</script>

<style scoped>
.container-styling {
  width: 90%;
  margin: 20px;
  padding: 15px;
  background: #7986cb;
  backdrop-filter: blur(5px);
  border-radius: 10px;
  border-color: #7986cb;
  color: aliceblue;
  gap: 10px;
}

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
    width: 90%;
    height: 400px;
  }
  .flex-column {
    flex-direction: column;
  }
}
</style>
