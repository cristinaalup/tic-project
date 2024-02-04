<template>
  <v-container class="container-styling">
    <h2 align="center">Create your project</h2>
    <v-form v-model="valid" @submit.prevent="handleSubmit">
      <v-text-field
        v-model="projectName"
        label="Project name"
        :rules="projectRules"
        prepend-inner-icon="mdi-text-box-outline"
      ></v-text-field>
      <v-alert v-if="error" type="error" class="error-message">
        {{ error }}
      </v-alert>
      <v-btn type="submit" class="button" :disabled="!valid"
        >Create Project</v-btn
      >
    </v-form>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    valid: false,
    error: "",
    projectName: "",
    projectRules: [
      (value) => {
        if (!value) return "Project name is required.";
        if (value.length < 3)
          return "Project name must be at least 3 characters.";
        return true;
      },
    ],
  }),
  methods: {
    updateValidation() {
      this.valid = this.projectRules.every((rule) => rule(this.email));
    },
    async handleSubmit() {
      try {
        await this.$store.dispatch("fetchUser");
        await this.$store.dispatch("createProject", {
          name: this.projectName,
          owner: this.$store.state.user,
        });
         this.projectName = "";
        // this.valid=false
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.error = "A project with the same name already exists";
        } else {
          this.error = error.message || "An error occurred.";
        }
        console.error("Error in handleSubmit:", error);
      }
    },
  },
};
</script>

<style scoped>
.container-styling {
  width: 400px;
  height: 300px;
  margin: 20px;
  background: #7986cb; /* Gri transparent cu blur */
  backdrop-filter: blur(5px); /* Efect de blur */
  border-radius: 10px; /* Rotunjire colțuri */
  border-color: #7986cb;
}

.button {
  margin-top: 20px;
  border-radius: 20px;
  color: #5c6bc0;
  background: #c5cae9;
}
</style>
