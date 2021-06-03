<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <Games></Games>
    </v-col>
  </v-row>
</template>

<script>
import Games from '~/components/Games.vue'

export default {
  components: {
    Games,
  },
}
</script>
