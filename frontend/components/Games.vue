<template>
  <v-container fluid>
    <v-card v-for="(obj, date) in gamesByDate" :key="date">
      <v-card-title class="d-flex justify-center" inset>{{
        date | dateFormat('DD. MMM YYYY')
      }}</v-card-title>
      <v-list two-line>
        <v-list-item-group>
          <template v-for="(game, index) in gamesByDate[date]">
            <v-list-item :key="game.id" class="d-flex justify-center" ripple>
              <v-list-item-avatar
                v-if="game.HomeTeam.TeamFlag.url"
                tile
                size="20"
              >
                <v-img :src="game.HomeTeam.TeamFlag.url | img"></v-img>
              </v-list-item-avatar>
              {{ game.HomeTeam.TeamName }} {{ game.id }} {{ index }}
              <v-btn
                v-if="selectedGame !== game.id"
                class="ml-3 mr-3"
                small
                @click="setSelectedGame(game.id)"
                >Smelltu til að kjósa</v-btn
              >
              <v-btn
                v-if="selectedGame === game.id"
                class="ml-3 mr-3"
                small
                @click="vote(game.HomeTeamScore, game.AwayTeamScore)"
                >Vista</v-btn
              >
              {{ game.AwayTeam.TeamName }}
              <v-list-item-avatar
                v-if="game.HomeTeam.TeamFlag.url"
                tile
                size="20"
              >
                <v-img :src="game.AwayTeam.TeamFlag.url | img"></v-img>
              </v-list-item-avatar>
            </v-list-item>
            <v-hover
              v-if="selectedGame === index"
              :key="game.id + '-show'"
              disabled
            >
              <v-list-item-action-text class="d-flex justify-center mt-5">
                <v-text-field
                  v-model="game.HomeTeamScore"
                  class="ml-3"
                  dense
                  outlined
                  :label="game.HomeTeam.TeamName"
                ></v-text-field>
                <v-list-item-subtitle
                  class="d-flex justify-center"
                  v-text="
                    'Sigurvegari: ' +
                    getWinner(
                      game.HomeTeamScore,
                      game.AwayTeamScore,
                      game.HomeTeam.TeamName,
                      game.AwayTeam.TeamName
                    )
                  "
                ></v-list-item-subtitle>
                <v-text-field
                  v-model="game.AwayTeamScore"
                  class="mr-3"
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
    getWinner(hts, ats, homeTeamName, awayTeamName) {
      const h = parseInt(hts)
      const a = parseInt(ats)
      if (h > a) {
        return `1 - ${homeTeamName}`
      } else if (h < a) {
        return `2 - ${awayTeamName}`
      } else {
        return 'Jafntefli'
      }
    },
    vote(hts, ats) {
      this.selectedGame = -1
      console.log(hts, ats)
    },
    setSelectedGame(index) {
      console.log(index)
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
