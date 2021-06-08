<template>
  <v-container>
    <v-row justify="center" align="start">
      <v-col xl="12" xs="12" sm="12" md="12">
        <CompanyMessages></CompanyMessages>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CompanyMessages from '~/components/CompanyMessages.vue'

export default {
  components: {
    CompanyMessages,
  },
}
</script>
