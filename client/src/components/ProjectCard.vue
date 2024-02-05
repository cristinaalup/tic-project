<template>
  <v-container>
    <v-row justify="center" class="mx-auto container-styling">
      <v-col>
        <v-row>
          <v-col class="text-left text-h5 margin-l-10" cols="7">
            <template v-if="!editing">
              {{ project.name }}
            </template>
            <template v-else>
              <v-text-field
                v-model="updatedProject.name"
                label="Project name"
              ></v-text-field>
            </template>
          </v-col>

          <v-col cols="4" class="text-right">
            <template v-if="!editing && isOwner(project)">
              <v-icon @click="toggleEditing(project)">mdi-pencil</v-icon>
              <v-icon @click="deleteProject(project.id)">mdi-delete</v-icon>
            </template>

            <template v-if="editing && isOwner(project)">
              <v-icon @click="saveProject" class="ma-1" color="grey" plain
                >mdi-floppy</v-icon
              >
              <v-icon @click="cancelEditing" class="ma-1" color="error" plain
                >mdi-cancel</v-icon
              >
            </template>

            <template v-if="!isOwner(project)">
              <v-icon v-if="canAddParticipant" @click="addParticipant"
                >mdi-plus</v-icon
              >
              <v-icon v-if="canRemoveParticipant" @click="removeParticipant"
                >mdi-minus</v-icon
              >
            </template>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card-subtitle
              ><v-icon>mdi-account</v-icon>
              {{ project.owner.displayName }}</v-card-subtitle
            >
          </v-col>
          <v-col class="test-right" cols="4">
            <v-icon>mdi-account-multiple</v-icon>
            {{ project.numParticipants }}
            <v-icon @click="toggleParticipants">mdi-eye-outline</v-icon>
          </v-col>
        </v-row>

        <v-row>
          <v-col v-if="showParticipants">
            <p>Participants at this project</p>
            <v-list class="list-styling">
              <v-list-item-group>
                <v-list-item
                  v-for="(participant, index) in project.participants"
                  :key="index"
                >
                  <v-list-item-content
                    ><v-icon>mdi-account</v-icon>
                    {{ participant.displayName }}</v-list-item-content
                  >
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showParticipants: false,
      editing: false,
      updatedProject: {
        id: "",
        name: "",
        numParticipants: 1,
        owner: null,
        participants: [],
      },
    };
  },
  mounted() {
    this.$store.dispatch("fetchUser");
  },
  computed: {
    canAddParticipant() {
      return (
        this.$store.state.user &&
        !this.project.participants.some(
          (participant) => participant.uid === this.$store.state.user.uid
        )
      );
    },
    canRemoveParticipant() {
      return (
        this.$store.state.user &&
        this.project.participants.some(
          (participant) => participant.uid === this.$store.state.user.uid
        ) &&
        !this.isOwner(this.project)
      );
    },
  },
  methods: {
    toggleParticipants() {
      this.showParticipants = !this.showParticipants;
    },
    toggleEditing(project) {
      this.updatedProject = { ...project };
      this.editing = !this.editing;
    },
    async saveProject() {
      try {
        await this.$store.dispatch("updateProject", this.updatedProject);
        this.editing = false;
        this.updatedProject = {
          id: "",
          name: "",
          numParticipants: 1,
          owner: null,
          participants: [],
        };
      } catch (error) {
        console.error(
          "Error on update project (vue component card): ".error.message
        );
      }
    },
    async deleteProject(projectId) {
      try {
        await this.$store.dispatch("deleteProject", projectId);
      } catch (error) {
        console.error("Error deleting project:", error.message);
      }
    },
    cancelEditing() {
      this.editing = false;
      this.editedProjectName = "";
    },
    isOwner(project) {
      return (
        this.$store.state.user &&
        project.owner.uid === this.$store.state.user.uid
      );
    },
    async addParticipant() {
      try {
        const newProject = { ...this.project };
        newProject.numParticipants++;
        console.log(this.$store.state.user);
        const participant = this.$store.state.user;
        console.log("new participant: ", participant);
        newProject.participants.push(participant);
        console.log(newProject);

        await this.$store.dispatch("updateProject", newProject);
      } catch (error) {
        console.error("Error adding participant:", error.message);
      }
    },
    async removeParticipant() {
      try {
        const newProject = { ...this.project };
        newProject.numParticipants--;
        console.log(this.$store.state.user);
        const participant = this.$store.state.user;
        console.log("new participant: ", participant);
        newProject.participants.pop(participant);
        console.log(newProject);

        await this.$store.dispatch("updateProject", newProject);
      } catch (error) {
        console.error("Error adding participant:", error.message);
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
  padding: 15px;
  background: #7986cb; 
  backdrop-filter: blur(5px); 
  border-radius: 10px; 
  border-color: #7986cb;
  color: aliceblue;
}

.margin-l-10 {
  margin-left: 10px;
}

.list-styling {
  max-height: 100px; 
  overflow-y: auto; 
  background: #7986cb; 
  backdrop-filter: blur(5px);
  border-radius: 10px; 
  border-color: #7986cb;
  color: aliceblue;
}

@media only screen and (max-width: 600px) {
  .login-container {
    padding: 15px; /* Adjust padding for smaller screens */
  }
  .container-styling{
    width:100%;
    height: 400px;
  }
}
</style>
