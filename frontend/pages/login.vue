<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col xl="6" lg="6" md="6" sm="12" xs="12">
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
                  label="Netfang"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="pass"
                  label="Lykilorð"
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
                  <v-btn
                    class="ma-2"
                    :loading="loading"
                    :disabled="loading"
                    color="primary"
                    @click="login"
                  >
                    Skrá inn
                    <template #loader>
                      <span class="custom-loader">
                        <v-icon light>mdi-cached</v-icon>
                      </span>
                    </template>
                  </v-btn>
                  <!-- <v-btn @click="forgot">Gleymt lykilorð</v-btn> -->
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
      loading: false,
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
    async forgot() {
      const res = await this.$strapi
        .forgotPassword({ email: this.user })
        .catch((e) => {
          console.log(e)
        })
      console.log(res.response)
    },
    async login() {
      this.loading = true
      this.errorMessages = []
      try {
        if (lsTest() === true) {
          localStorage.setItem('username-euro21', this.user)
        }
        await this.$strapi
          .login({ identifier: this.user, password: this.pass })
          .catch((e) => {
            this.errorMessages = e.response.data.message
            this.loading = false
            return console.error(`Error authenticating: ${e.response}`)
          })
          .then((res) => {
            this.loading = false
            if (this.errorMessages.length <= 0) {
              if (res.user.id) {
                this.$router.push('/')
              }
            }
          })
      } catch (e) {
        this.loading = false
        console.error(e)
      }
    },
  },
}
</script>
