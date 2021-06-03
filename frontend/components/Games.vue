<template>
  <v-container>
    <v-card v-for="(obj, date) in gamesByDate" :key="date">
      <v-card-title class="d-flex justify-center" inset>{{
        date
      }}</v-card-title>
      <v-list two-line>
        <v-list-item-group>
          <template v-for="(game, index) in gamesByDate[date]">
            <v-list-item :key="game.id" class="d-flex justify-center" ripple>
              <v-list-item-avatar tile size="20">
                <v-img :src="game.HomeTeam.TeamFlag.url | img"></v-img>
              </v-list-item-avatar>
              {{ game.HomeTeam.TeamName }}
              <v-btn
                v-if="selectedGame !== index"
                class="ml-3 mr-3"
                small
                @click="setSelectedGame(index)"
                >Smelltu til að kjósa</v-btn
              >
              <v-btn
                v-if="selectedGame === index"
                class="ml-3 mr-3"
                small
                @click="vote(game.HomeTeamScore, game.AwayTeamScore)"
                >Vista</v-btn
              >
              {{ game.AwayTeam.TeamName }}
              <v-list-item-avatar tile size="20">
                <v-img :src="game.AwayTeam.TeamFlag.url | img"></v-img>
              </v-list-item-avatar>
            </v-list-item>
            <v-hover
              v-if="selectedGame === index"
              :key="game.id + '-show'"
              disabled
            >
              <v-list-item-action-text class="d-flex justify-center">
                <v-text-field
                  v-model="game.HomeTeamScore"
                  dense
                  outlined
                  :label="game.HomeTeam.TeamName"
                ></v-text-field>
                Sigurvegari
                <v-text-field
                  v-model="game.AwayTeamScore"
                  dense
                  outlined
                  :label="game.AwayTeam.TeamName"
                ></v-text-field>
              </v-list-item-action-text>
            </v-hover>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
const _ = require('lodash')
const moment = require('moment')
export default {
  filters: {
    img(v) {
      return 'http://localhost:1337' + v
    },
  },
  data() {
    return {
      no: false,
      games: [],
      selectedGame: -1,
    }
  },
  async fetch() {
    this.games = await this.$strapi.find('games')
  },
  computed: {
    gamesByDate() {
      const g = _.groupBy(this.games, (game) => {
        return moment(game.DateOfGame).format('DD-MM-YYYY')
      })
      return g
    },
  },
  methods: {
    vote(hts, ats) {
      this.selectedGame = -1
      console.log(hts, ats)
    },
    setSelectedGame(index) {
      if (index === this.selectedGame) {
        this.selectedGame = -1
      } else {
        this.selectedGame = index
      }
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
