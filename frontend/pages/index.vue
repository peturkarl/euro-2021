<template>
  <v-row justify="center" align="center">
    <v-col cols="8" sm="8" md="8">
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
