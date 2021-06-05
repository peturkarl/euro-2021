<template>
  <v-container>
    <v-snackbar v-model="snackbar.show" multi-line :timeout="snackbar.timeout">
      {{ snackbar.msg }}
      <template #action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-card v-for="(obj, date) in gamesByDate" :key="date" class="mx-auto">
      <v-card-title inset>{{ date | dateFormat('DD. MMM YYYY') }}</v-card-title>
      <v-list two-line>
        <v-list-item-group>
          <template v-for="game in gamesByDate[date]">
            <v-list-item :key="game.id" ripple>
              <v-list-item-content class="ml-5">
                <v-list-item-title>
                  <v-list-item-avatar
                    v-if="game.HomeTeam.TeamFlag.url"
                    tile
                    size="20"
                  >
                    <v-img :src="game.HomeTeam.TeamFlag.url | img"></v-img>
                  </v-list-item-avatar>
                  {{ game.HomeTeam.TeamName }}
                  <v-chip outlined pill class="ml-3">{{
                    game.DateOfGame | timeFormat('HH:mm')
                  }}</v-chip>
                  <span class="ml-3">
                    {{ game.AwayTeam.TeamName }}
                  </span>
                  <v-list-item-avatar
                    v-if="game.HomeTeam.TeamFlag.url"
                    tile
                    class="ml-3"
                    size="20"
                  >
                    <v-img :src="game.AwayTeam.TeamFlag.url | img"></v-img>
                  </v-list-item-avatar>
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action align-end>
                <v-btn
                  v-if="selectedGame !== game.id"
                  class="ml-3 mr-3"
                  small
                  @click="setSelectedGame(game.id)"
                  >Kjósa</v-btn
                >
                <v-btn
                  v-if="selectedGame === game.id"
                  class="ml-3 mr-3"
                  small
                  @click="
                    vote(
                      game.HomeTeamScore,
                      game.AwayTeamScore,
                      game.id,
                      game.HomeTeam.TeamName,
                      game.AwayTeam.TeamName
                    )
                  "
                  >Vista</v-btn
                >
              </v-list-item-action>
            </v-list-item>
            <v-hover
              v-if="selectedGame === game.id"
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
    timeFormat(v, fmt) {
      if (v) {
        return moment(v, 'YYYY-MM-DD[T]HH:mm:sss.sss[Z]')
          .locale('is')
          .format(fmt)
      }
    },
  },
  data() {
    return {
      snackbar: {
        timeout: 5000,
        msg: '',
        show: false,
      },
      games: [],
      myPredictions: [],
      selectedGame: -1,
    }
  },
  async fetch() {
    const games = await this.$strapi.find('games')
    const myPredictions = await this.$strapi.find('user-predictions', {
      User: this.user.id,
    })
    for (const game of games) {
      const prediction = myPredictions.find(({ User }) => User === this.user.id)
      if (prediction) {
        game.myPrediction = prediction
        console.log(`Prediction for ${game.id} - ${prediction}`)
      } else {
        console.log(`No Prediction for ${game.id}`)
      }
    }

    this.games = games
  },
  computed: {
    gamesByDate() {
      const g = _.groupBy(this.games, (game) => {
        return moment(game.DateOfGame).format('DD-MM-YYYY')
      })
      return g
    },
    user() {
      return this.$strapi.user
    },
  },
  methods: {
    showMsg(msg) {
      this.snackbar.msg = msg
      this.snackbar.show = true
    },
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
    async vote(hts, ats, gameId, homeTeamName, awayTeamName) {
      this.selectedGame = -1
      const res = await this.$strapi.create('user-predictions', {
        HomeTeamScore: hts,
        AwayTeamScore: ats,
        Game: gameId,
        User: this.user.id,
      })
      if (res) {
        this.showMsg(
          `Takk fyrir kosninguna ( ${homeTeamName} ${hts} - ${ats} ${awayTeamName})`
        )
      }
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
