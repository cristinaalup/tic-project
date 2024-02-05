<template>
  <v-container>
    <v-row justify="center" class="mx-auto container-styling">
      <v-col >
        <v-form v-model="valid" class="form-flex login-container">
          <h2 class="text-center">LOG IN FORM</h2>
          <v-text-field
            v-model="email"
            label="Email"
            :rules="emailRules"
            prepend-inner-icon="mdi-email"
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
            @click="signInWithEmail"
            block
            class="login-button"
            :disabled="!valid"
            >Login</v-btn
          >
          <v-row>
            <v-col>
              <p text>
                Don't have an account?
                <span @click="showRegisterForm" class="register-link"
                  >REGISTER</span
                >
              </p></v-col
            ></v-row
          >
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-configuration";
export default {
  data: () => ({
    valid: false,
    error: "",
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
    showRegisterForm() {
      this.$emit("showLoginForm");
    },
    updateValidation() {
      this.valid =
        this.emailRules.every((rule) => rule(this.email)) &&
        this.passwordRules.every((rule) => rule(this.password));
    },
    async signInWithEmail() {
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = auth.currentUser;
        this.$emit("userAuthenticated", user);
      } catch (error) {
        console.error(
          "Error signing in with email and password:",
          error.code,
          error.message
        );
        if (error.code === "auth/invalid-credential") {
          this.error = "Invalid credentials";
        } else {
          this.error = "An error occurred during sign-in.";
        }
      }
    },
  },
};
</script>

<style scoped>
.container-styling {
  width:450px;
  height: 450px;
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
.login-button {
  margin-top: 20px;
  border-radius: 20px;
  color: #5c6bc0;
  background: #c5cae9;
}
.text-center {
  text-align: center;
  margin-bottom: 15px;
}

.register-link {
  cursor: pointer; 
  text-decoration: underline;
  user-select: none; 
}
@media only screen and (max-width: 600px) {
  .login-container {
    padding: 15px; 
  }
  .container-styling{
    width:100%;
  }
}

</style>
