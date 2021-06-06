<template>
  <v-container>
    <v-snackbar
      v-model="snackbar.show"
      multi-line
      top
      right
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.msg }}
      <template #action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="snackbar.show = false">
          Loka
        </v-btn>
      </template>
    </v-snackbar>
    <v-card class="mx-auto">
      <v-card-title inset>Staðan</v-card-title>
      <v-simple-table>
        <template #default>
          <thead>
            <tr>
              <th class="text-left">Sæti</th>
              <th class="text-left">Lið</th>
              <th class="text-left">Stig</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, index) in company.Users" :key="member.id">
              <td>{{ index + 1 }}</td>
              <td>{{ member.username }}</td>
              <td>{{ 41 }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </v-container>
</template>

<script>
// const _ = require('lodash')
const moment = require('moment')
export default {
  filters: {
    img(v) {
      return 'https://em.hviturhattur.is' + v
    },
    dateFormat(v, fmt) {
      if (v) {
        return moment(v, 'DD-MM-YYYY').locale('is').format(fmt)
      }
    },
  },
  data() {
    return {
      snackbar: {
        timeout: 5000,
        msg: '',
        show: false,
        color: '',
      },
      company: [],
    }
  },
  async fetch() {
    const company = await this.$strapi.findOne('companies', this.user.company)

    this.company = company
  },
  computed: {
    user() {
      return this.$strapi.user
    },
  },
  methods: {
    showMsg(msg, color) {
      this.snackbar.msg = msg
      this.snackbar.color = color
      this.snackbar.show = true
    },
  },
}
</script>
<style>
.score-input {
  width: 20px;
  padding-top: 25px !important;
}
</style>
