<template>
  <v-container>
    <v-row class="container-styling mx-auto">
      <v-col>
        <v-form v-model="valid" class="form-flex register-container">
          <h2 class="text-center">REGISTER FORM</h2>
          <v-text-field
            v-model="email"
            label="Email"
            :rules="emailRules"
            prepend-inner-icon="mdi-email"
          ></v-text-field>

          <v-text-field
            v-model="firstName"
            label="First name"
            :rules="firstNameRules"
            prepend-inner-icon="mdi-account"
          ></v-text-field>

          <v-text-field
            v-model="lastName"
            label="Last name"
            :rules="lastNameRules"
            prepend-inner-icon="mdi-account"
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Password"
            :rules="passwordRules"
            prepend-inner-icon="mdi-lock"
          ></v-text-field>
          
          <v-alert v-if="error" type="error" class="error-message">
            {{ error }}
          </v-alert>

          <v-btn
            @click="registerWithEmail"
            block
            class="register-button"
            :disabled="!valid"
          >
            Register
          </v-btn>

          <v-row>
            <v-col>
              <p text>
                Already have an account?
                <span @click="showLoginForm" class="login-link">LOGIN</span>
              </p>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase-configuration";
import axios from "axios";

export default {
  data: () => ({
    valid: false,
    error: "",
    firstName: "",
    firstNameRules: [
      (value) => {
        if (!value) return "First name is required.";
        if (value.length < 3)
          return "First name must be at least 3 characters.";
        if (/\d/.test(value)) return "First name can not contain digits.";
        return true;
      },
    ],
    lastName: "",
    lastNameRules: [
      (value) => {
        if (!value) return "Last name is required.";
        if (value.length < 3) return "Last name must be at least 3 characters.";
        if (/\d/.test(value)) return "Last name can not contain digits.";
        return true;
      },
    ],
    email: "",
    emailRules: [
      (value) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email format";

        return true;
      },
    ],
    password: "",
    passwordRules: [
      (value) => {
        if (value?.length < 6) return "Password must be at least 6 characters.";

        return true;
      },
    ],
    
  }),
  methods: {
    showLoginForm() {
      this.$emit("showLoginForm");
    },
    updateValidation() {
      this.valid =
        this.emailRules.every((rule) => rule(this.email)) &&
        this.firstNameRules.every((rule) => rule(this.firstName)) &&
        this.lastNameRules.every((rule) => rule(this.lastName)) &&
        this.passwordRules.every((rule) => rule(this.password));
    },
   
    async registerWithEmail() {
      try {
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password,
        );

        const user = userCredentials.user;

        await updateProfile(user, {
          displayName: `${this.firstName} ${this.lastName}`,
          
        });

        try {
          await axios
            .post("http://localhost:3000/generateData", {
              owner: user,
            })
            .then(() => {
              this.$store.dispatch("fetchProjects");
            });
        } catch (axiosError) {
          console.error("Error in axios request:", axiosError.message);
          this.error = axios.code;
        }
        this.$emit("userAuthenticated", user);
      } catch (error) {
        console.error(
          "Error registering with email and password:",
          error.code,
          error.message
        );

        if (error.code === "auth/email-already-in-use") {
          this.error = "Email is already in use.";
        } else {
          this.error = "An error occurred during registration.";
        }
      }
    },
  },
};
</script>

<style scoped>
.container-styling {
  width: 450px;
  height: 500px;
  margin: 20px;
  background: #7986cb;
  backdrop-filter: blur(5px);
  border-radius: 10px;
  border-color: #7986cb;
}

.form-flex {
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 30px;
  transform: translate(-50%, -50%);
  width: 100%;
}
.register-button {
  margin-top: 20px;
  border-radius: 20px;
  color: #5c6bc0;
  background: #c5cae9;
}
.text-center {
  text-align: center;
  margin-bottom: 15px;
}

.login-link {
  cursor: pointer;
  text-decoration: underline;
  user-select: none;
}

@media only screen and (max-width: 600px) {
  .login-container {
    padding: 15px;
  }
  .container-styling {
    width: 100%;
  }
}
</style>
