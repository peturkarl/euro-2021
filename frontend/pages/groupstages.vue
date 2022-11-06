<template>
  <v-container>
    <v-row justify="center" align="start">
      <v-col xl="12" xs="12" sm="12" md="12">
        <GroupStage
          v-for="(groupGames, index) in games"
          :key="index"
          :group-games="groupGames"
        ></GroupStage>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GroupStage from '~/components/GroupStage.vue'
const _ = require('lodash')
export default {
  components: {
    GroupStage,
  },
  data() {
    return {
      games: [],
    }
  },
  async fetch() {
    const games = await this.$strapi.find('games')

    this.games = _.groupBy(games, 'GroupStage.GroupName')
  },
}
</script>
