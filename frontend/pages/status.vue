<template>
  <v-container>
    <v-row justify="center" align="start">
      <v-col xl="12" xs="12" sm="12" md="12">
        <StatusTable></StatusTable>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import StatusTable from '~/components/StatusTable.vue'

export default {
  components: {
    StatusTable,
  },
}
</script>
