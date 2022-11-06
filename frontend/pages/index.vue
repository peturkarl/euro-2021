<template>
  <v-row justify="center" align="start">
    <v-col xl="8" xs="12" sm="12" md="8">
      <Games></Games>
    </v-col>
    <v-col xl="4" xs="12" sm="12" md="4">
      <v-row class="mt-4">
        <v-col cols="12">
          <CompanyMessages></CompanyMessages>
        </v-col>
        <v-col cols="12">
          <StatusTable></StatusTable>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import Games from '~/components/Games.vue'
import StatusTable from '~/components/StatusTable.vue'
import CompanyMessages from '~/components/CompanyMessages.vue'

export default {
  components: {
    Games,
    StatusTable,
    CompanyMessages,
  },
}
</script>
