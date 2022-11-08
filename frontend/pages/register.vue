<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col xl="6" lg="6" md="6" sm="12" xs="12">
        <v-toolbar color="blue">
          <v-toolbar-title v-if="companyName" class="white--text">
            HM 2022 keppnin hjá <strong>{{ companyName }}</strong>
          </v-toolbar-title>
        </v-toolbar>
        <v-card>
          <v-form
            ref="form"
            lazy-validation
            @submit="validateAndRegister"
            @keyup.native.enter="validateAndRegister"
          >
            <v-container>
              <v-layout column>
                <v-text-field
                  v-model="fullName"
                  label="Nafnið þitt"
                  :rules="nameRules"
                  hint="Þú mátt kalla þig hvað sem er"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="Netfang"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="password"
                  label="Lykilorð"
                  :rules="passwordRules"
                  hint="Að minnsta kosti 8 stafir og einn hástafur"
                  counter
                  type="password"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="confirmPassword"
                  label="Staðfestu lykilorð"
                  :rules="passwordRules"
                  counter
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
                <v-btn href="/login">Til baka</v-btn>
              </v-col>
              <v-col class="d-flex justify-end">
                <v-btn
                  class="ma-2"
                  :loading="loading"
                  :disabled="loading || !formIsValid"
                  color="primary"
                  type="submit"
                  @click="validateAndRegister"
                >
                  Nýskrá
                  <template #loader>
                    <span class="custom-loader">
                      <v-icon light>mdi-cached</v-icon>
                    </span>
                  </template>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
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
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      loading: false,
      registrationToken: '',
      errorMessages: [],
      ableToSend: true,
      company: '',
      companyName: '',
    }
  },
  async fetch() {
    const token = this.$route.query.token
    if (!token) {
      this.errorMessages.push({
        messages: [
          {
            id: 1,
            message: 'Þig vantar skráningarkóða til að geta tekið þátt',
          },
        ],
      })
      this.ableToSend = false
    } else if (token.length < 20) {
      this.registrationToken = token
      const companies = await this.$strapi.find('companies', {
        RegistrationCode: token,
      })
      if (companies.length > 0) {
        this.company = companies[0].id
        this.companyName = companies[0].CompanyName
      } else {
        this.errorMessages.push({
          messages: [
            {
              id: 1,
              message: 'Rangur skráningarkóði, reyndu aftur',
            },
          ],
        })
        this.ableToSend = false
      }
    }
  },
  computed: {
    nameRules() {
      const rules = []
      if (this.fullName) {
        const rule = (v) =>
          (v || '').length > 3 ||
          `Þessi reitur er nauðsynlegur (4 stafir lágmark)`
        rules.push(rule)
      }

      return rules
    },
    emailRules() {
      const rules = []
      if (this.email) {
        const rule = (v) =>
          (v || '').includes('@') || `Þú verður að vera með gilt netfang`
        rules.push(rule)
      }
      return rules
    },
    passwordRules() {
      const rules = []
      if (this.password) {
        const rule = (v) => (v || '').length > 6 || `Lágmark 6 stafa lykilorð`
        rules.push(rule)
      }
      return rules
    },
    confirmPasswordRules() {
      const rules = []
      if (this.password !== this.confirmPassword) {
        rules.push('Lykilorð stemma ekki')
      }
      return rules
    },

    formIsValid() {
      return (
        this.fullName !== '' &&
        this.password !== '' &&
        this.email !== '' &&
        this.ableToSend
      )
    },
  },
  watch: {
    fullName: 'validateField',
    email: 'validateField',
    password: 'validateField',
    confirmPassword: 'validateField',
  },

  methods: {
    validateField() {
      this.$refs.form.validate()
    },
    async validateAndRegister() {
      await console.log(this.fullName, this.email, this.password)

      const res = await this.$strapi
        .register({
          email: this.email,
          username: this.email,
          password: this.password,
          fullName: this.fullName,
          company: this.company,
        })
        .catch((e) => {
          console.error(e)
        })
        .then((res) => {
          this.loading = false
          if (this.errorMessages.length <= 0) {
            if (res.user.id) {
              this.$router.push('/')
            }
          }
        })

      console.log(res)
    },
  },
}
</script>
