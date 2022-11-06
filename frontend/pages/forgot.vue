<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col cols="8">
        <v-toolbar color="pink">
          <v-toolbar-title class="white--text">
            UEFA Euro 2021 - National Teams
          </v-toolbar-title>
        </v-toolbar>
        <v-card>
          <v-form
            ref="form"
            lazy-validation
            @submit="login"
            @keyup.native.enter="login"
          >
            <v-container>
              <v-layout column>
                <v-text-field
                  v-model="user"
                  label="Email"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="pass"
                  label="Password"
                  type="password"
                  required
                ></v-text-field>
              </v-layout>
            </v-container>
          </v-form>
          <v-container>
            <v-alert
              v-if="errorMessages.length > 0"
              dense
              outlined
              type="error"
            >
              <ul v-for="(err, index) in errorMessages" :key="index">
                <li v-for="msg in err.messages" :key="msg.id">
                  {{ msg.message }}
                </li>
              </ul>
            </v-alert>
            <v-row>
              <v-col>
                <v-flex>
                  <v-btn href="/register">Register</v-btn>
                  <v-btn color="primary" @click="login">Sign In</v-btn>
                </v-flex>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
function lsTest() {
  const test = 'test'
  try {
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}
export default {
  layout: 'auth',
  data() {
    return {
      user: '',
      pass: '',
      errorMessages: [],
    }
  },
  mounted() {
    if (lsTest() === true) {
      const localStorageUser = localStorage.getItem('username-euro21')
      if (localStorageUser) {
        this.user = localStorageUser
      }
    }
  },
  methods: {
    async login() {
      this.errorMessages = []
      try {
        if (lsTest() === true) {
          localStorage.setItem('username-euro21', this.user)
        }
        await this.$strapi
          .login({ identifier: this.user, password: this.pass })
          .catch((e) => {
            this.errorMessages = e.response.data.message
            return console.error(`Error authenticating: ${e.response}`)
          })
          .then((res) => {
            if (this.errorMessages.length <= 0) {
              if (res.user.id) {
                this.$router.push('/')
              }
            }
          })
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>
