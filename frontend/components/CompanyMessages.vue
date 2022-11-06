<template>
  <div>
    <v-alert
      v-for="msg in companyMessages"
      :key="msg.id"
      color=""
      border="left"
      elevation="3"
    >
      <div class="ml-3">
        <div class="text-h6 pb-2">{{ msg.Title }}</div>
        <div v-html="markeds(msg.Content)"></div>
      </div>
    </v-alert>
  </div>
</template>

<script>
import marked from 'marked'
const moment = require('moment')
export default {
  filters: {
    dateFormat(v, fmt) {
      if (v) {
        return moment(v, 'DD-MM-YYYY').locale('is').format(fmt)
      }
    },
  },
  data() {
    return {
      company: [],
      statusTable: [],
    }
  },
  async fetch() {
    try {
      let companyId = ''
      if (typeof this.user.company.id !== 'undefined') {
        companyId = this.user.company.id
      }
      if (this.user.company > 0) {
        companyId = this.user.company
      }
      if (companyId !== '') {
        const company = await this.$strapi.findOne('companies', companyId)
        this.company = company
      }
    } catch (e) {
      console.error(e)
    }
  },
  computed: {
    user() {
      return this.$strapi.user
    },
    companyMessages() {
      return this.company.company_messages
    },
  },
  methods: {
    markeds(input) {
      return marked(input)
    },
    showMsg(msg, color) {
      this.snackbar.msg = msg
      this.snackbar.color = color
      this.snackbar.show = true
    },
  },
}
</script>
<style></style>
