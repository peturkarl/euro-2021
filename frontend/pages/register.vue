<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col cols="8">
        <v-toolbar color="blue">
          <v-toolbar-title v-if="companyName" class="white--text">
            EM 2021 keppnin hjá <strong>{{ companyName }}</strong>
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
                  :rules="[rules.required]"
                  hint="Þú mátt kalla þig hvað sem er"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="email"
                  :rules="[rules.required]"
                  label="Netfang"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="password"
                  label="Lykilorð"
                  :rules="[rules.required, rules.min]"
                  hint="Að minnsta kosti 8 stafir og einn hástafur"
                  counter
                  type="password"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="confirmPassword"
                  label="Staðfestu lykilorð"
                  :rules="[rules.required, rules.passwordMatch]"
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
                  :click="validateAndRegister"
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
      rules: {
        required: (value) => !!value || 'Nauðsynlegt.',
        min: (v) => v.length >= 8 || 'Amk. 8 stafir',
        passwordMatch: (v) => v !== this.password || 'Lykilorð passa ekki',
      },
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
      console.log(companies)
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
    formIsValid() {
      return (
        this.fullName !== '' &&
        this.password !== '' &&
        this.email !== '' &&
        this.ableToSend
      )
    },
  },
  methods: {
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
