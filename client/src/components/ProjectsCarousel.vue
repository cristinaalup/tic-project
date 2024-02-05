<template>
  <v-carousel hide-delimiters v-if="chunkedProjects.length > 0" >
    <v-carousel-item v-for="(chunk, index) in chunkedProjects" :key="index">
      <v-row class="carousel-row">
        <v-col
          v-for="project in chunk"
          :key="project.id"
          cols="12"
          sm="6"
          md="4"
          lg="4"
        > 
          <template v-if="project && project.id !== undefined">
            <ProjectCard :project="project"/>
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
      const chunkSize = 3;
      const resultArray = [];
      for (let i = 0; i < this.projects?.length; i += chunkSize) {
        resultArray.push(this.projects.slice(i, i + chunkSize));
      }
      return resultArray;
    },
  },
  async created() {
    await this.$store.dispatch("fetchProjects");
  },
};
</script>
<style scoped>
.carousel-row {
  justify-content: space-around;
  margin: 10px 60px;
}
.v-carousel {
  max-width: 1500px;
  margin: 0 auto;
}
.v-carousel .v-carousel__controls .v-icon {
  backdrop-filter: blur(5px); /* Efect de blur */
  opacity: 0.7; /* Opacitatea pentru a face săgețile transparente */
}
</style>