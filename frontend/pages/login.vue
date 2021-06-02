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
          <v-form ref="form" lazy-validation @keyup.native.enter="login">
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
          <v-card-actions>
            <v-flex>
              <v-btn href="/vuetify/register">Register</v-btn>
              <v-btn color="primary" @submit="login">Sign In</v-btn>
            </v-flex>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'auth',
  data() {
    return {
      user: '',
      pass: '',
    }
  },
  methods: {
    login() {
      this.$strapi
        .login({ identifier: this.user, password: this.pass })
        .then((res) => {
          if (res.user.id) {
            this.$router.push('/')
          }
        })
    },
  },
}
</script>
