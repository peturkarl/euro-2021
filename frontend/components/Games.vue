<template>
  <v-container>
    <v-snackbar
      v-model="snackbar.show"
      multi-line
      top
      right
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.msg }}
      <template #action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="snackbar.show = false">
          Loka
        </v-btn>
      </template>
    </v-snackbar>
    <v-card class="mx-auto" elevation="3">
      <v-card-title inset>Síur</v-card-title>
      <v-card-text>
        <v-chip label :outlined="gameView !== 'All'" @click="toggleAllView">
          <v-icon left> mdi-table </v-icon>
          Allir leikir
        </v-chip>
        <v-chip
          label
          :outlined="gameView !== 'Knockout'"
          @click="toggleKnockoutView"
        >
          <v-icon left> mdi-trophy </v-icon>
          Úrslitakeppni
        </v-chip>
        <v-chip
          label
          :outlined="gameView !== 'GroupStage'"
          @click="toggleGroupView"
        >
          <v-icon left> mdi-blinds </v-icon>
          Riðlakeppni
        </v-chip>
      </v-card-text>
    </v-card>
    <v-card
      v-for="(obj, date) in gamesByDate"
      :key="date"
      elevation="3"
      class="mx-auto mt-4"
    >
      <v-card-title inset>{{ date | dateFormat('DD. MMM YYYY') }}</v-card-title>
      <v-list>
        <v-list-item-group>
          <template v-for="(game, index) in gamesByDate[date]">
            <v-list-item
              :key="game.id"
              :disabled="isTooLateToVote(game.DateOfGame)"
              @click="setSelectedGame(game.id)"
            >
              <v-list-item-content class="ml-5">
                <v-list-item-title>
                  <v-row>
                    <v-col cols="6" class="d-flex justify-start">
                      <v-tooltip top>
                        <template #activator="{ on, attrs }">
                          <v-subheader v-bind="attrs" v-on="on"
                            >{{ game.Venue.Stadium }},
                            {{ game.Venue.City }}</v-subheader
                          >
                        </template>
                        <span
                          >Stadium capacity: {{ game.Venue.Capacity }} /
                          {{ game.Venue.Country }}
                        </span>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="6" class="d-flex justify-end">
                      <v-subheader
                        >Group {{ game.GroupStage.GroupName }}</v-subheader
                      >
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col v-if="game.HomeTeam" xs="3" sm="3">
                      {{ game.HomeTeam.TeamName }}
                      <v-list-item-avatar
                        v-if="game.HomeTeam.TeamFlag.url"
                        size="20"
                        class="ml-3"
                      >
                        <v-img
                          :src="$config.API_URL + game.HomeTeam.TeamFlag.url"
                        ></v-img>
                      </v-list-item-avatar>
                    </v-col>
                    <v-col v-if="!game.HomeTeam" xs="3" sm="3">TBD</v-col>
                    <v-col xs="3" sm="3">
                      <v-chip outlined pill class="ml-3">{{
                        getTimeOfGame(
                          game.DateOfGame,
                          game.HomeTeamScore,
                          game.AwayTeamScore
                        )
                      }}</v-chip>
                    </v-col>
                    <v-col v-if="game.AwayTeam" xs="3" sm="3">
                      {{ game.AwayTeam.TeamName }}
                      <v-list-item-avatar
                        v-if="game.HomeTeam.TeamFlag.url"
                        class="ml-3"
                        size="20"
                      >
                        <v-img
                          :src="$config.API_URL + game.AwayTeam.TeamFlag.url"
                        ></v-img>
                      </v-list-item-avatar>
                    </v-col>
                    <v-col v-if="!game.AwayTeam" xs="3" sm="3">TBD</v-col>
                    <v-col v-if="game.HomeTeam" xs="3" sm="3">
                      <v-chip
                        v-if="
                          selectedGame !== game.id &&
                          typeof game.myPrediction.id === 'undefined'
                        "
                        class="ml-3 mr-3"
                        >Kjósa</v-chip
                      >
                      <!-- TODO: Set color after game is finished and show points.  -->
                      <v-chip
                        v-if="
                          selectedGameComp !== game.id &&
                          typeof game.myPrediction.id !== 'undefined'
                        "
                        dark
                        :color="
                          getPointsColor(
                            game.HomeTeamScore,
                            game.AwayTeamScore,
                            game.myPrediction.HomeTeamScore,
                            game.myPrediction.AwayTeamScore
                          )
                        "
                        >Þitt gisk: {{ game.myPrediction.HomeTeamScore }} -
                        {{ game.myPrediction.AwayTeamScore }}
                        <small
                          v-if="
                            gameIsFinished(
                              game.HomeTeamScore,
                              game.AwayTeamScore
                            )
                          "
                          class="ml-1"
                          >({{
                            getPoints(
                              game.HomeTeamScore,
                              game.AwayTeamScore,
                              game.myPrediction.HomeTeamScore,
                              game.myPrediction.AwayTeamScore
                            )
                          }}
                          stig)</small
                        ></v-chip
                      >
                      <v-btn
                        v-if="selectedGame === game.id"
                        class="ml-3 mr-3"
                        small
                        @click="
                          vote(
                            game.myPrediction.HomeTeamScore,
                            game.myPrediction.AwayTeamScore,
                            game.id,
                            game.HomeTeam.TeamName,
                            game.AwayTeam.TeamName,
                            game
                          )
                        "
                        >Vista</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-list-item-title>
              </v-list-item-content>
              <!-- <v-list-item-action align-end>
                
              </v-list-item-action> -->
            </v-list-item>
            <v-hover
              v-if="selectedGame === game.id"
              :key="game.id + '-show'"
              disabled
            >
              <v-list-item-action-text
                v-if="game.HomeTeam"
                class="d-flex justify-center mt-5"
              >
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="game.myPrediction.HomeTeamScore"
                      class="ml-3"
                      dense
                      placeholder="0"
                      outlined
                      label="mörk"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-list-item-subtitle
                      class="d-flex justify-center"
                      v-text="
                        'Sigurvegari: ' +
                        getWinner(
                          game.myPrediction.HomeTeamScore,
                          game.myPrediction.AwayTeamScore,
                          game.HomeTeam.TeamName,
                          game.AwayTeam.TeamName
                        )
                      "
                    ></v-list-item-subtitle>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="game.myPrediction.AwayTeamScore"
                      class="mr-3"
                      dense
                      placeholder="0"
                      outlined
                      label="mörk"
                      @keydown.enter="
                        vote(
                          game.myPrediction.HomeTeamScore,
                          game.myPrediction.AwayTeamScore,
                          game.id,
                          game.HomeTeam.TeamName,
                          game.AwayTeam.TeamName,
                          game
                        )
                      "
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-list-item-action-text>
            </v-hover>
            <v-divider v-if="obj.length - 1 !== index" :key="index"></v-divider>
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
    img(v) {},
    dateFormat(v, fmt) {
      if (v) {
        return moment(v, 'DD-MM-YYYY').locale('is').format(fmt)
      }
    },
  },
  data() {
    return {
      snackbar: {
        timeout: 5000,
        msg: '',
        show: false,
        color: '',
      },
      gameView: 'All',
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
      const prediction = _.find(myPredictions, (p) => {
        return p.Game.id === game.id
      })
      if (prediction) {
        game.myPrediction = prediction
      } else {
        game.myPrediction = {
          HomeTeamScore: '',
          AwayTeamScore: '',
        }
      }
    }

    this.games = _.orderBy(games, 'DateOfGame')
    this.myPredictions = myPredictions
  },
  computed: {
    gamesByDate() {
      let filteredGames = []
      if (this.gameView === 'All') {
        filteredGames = this.games
      } else {
        filteredGames = _.filter(this.games, (game) => {
          return game.GroupStage.GroupType === this.gameView
        })
      }

      const g = _.groupBy(filteredGames, (game) => {
        return moment(game.DateOfGame).format('DD-MM-YYYY')
      })
      return g
    },
    user() {
      return this.$strapi.user
    },
    selectedGameComp() {
      return this.selectedGame
    },
  },
  methods: {
    toggleAllView() {
      this.gameView = 'All'
    },
    toggleKnockoutView() {
      this.gameView = 'Knockout'
    },
    toggleGroupView() {
      this.gameView = 'GroupStage'
    },
    gameIsFinished(hts, ats) {
      return hts !== null && ats !== null
    },
    getPointsColor(hts, ats, mhts, mats) {
      const pts = this.getPoints(hts, ats, mhts, mats)
      if (pts === '') {
        return ''
      }
      if (pts < 1) {
        return 'red accent-4'
      }
      if (pts === 1) {
        return 'amber darken-2'
      }
      if (pts === 3) {
        return 'green darken-1'
      }
    },
    getPoints(hts, ats, mhts, mats) {
      let points = 0
      // One point for correct game results
      if (hts === null || ats === null) {
        return ''
      }
      hts = parseInt(hts)
      ats = parseInt(ats)
      mhts = parseInt(mhts)
      mats = parseInt(mats)
      const actualResults = this.getWinner1x2(hts, ats)
      const myPredictedResults = this.getWinner1x2(mhts, mats)
      if (actualResults === myPredictedResults) {
        points += 1
      }

      // Three points for correct score
      if (hts === mhts && ats === mats) {
        points += 2
      }
      return points
    },
    getWinner1x2(hts, ats) {
      const h = parseInt(hts)
      const a = parseInt(ats)
      if (h > a) {
        return '1'
      } else if (h < a) {
        return '2'
      } else {
        return 'X'
      }
    },
    getTimeOfGame(dateOfGame, hts, ats) {
      const gameTime = moment(dateOfGame, 'YYYY-MM-DD[T]HH:mm:sss.sss[Z]')
      const now = moment()
      if (gameTime.isBefore(now)) {
        let diff = now.diff(gameTime, 'minutes')
        if (diff > 90) {
          // diff = `90" (leik lokið)`
          diff = `${hts} - ${ats} (lokið)`
        } else {
          diff += '"'
        }
        return diff
      } else {
        return gameTime.format('HH:mm')
      }
    },
    isTooLateToVote(dateOfGame) {
      const gameTime = moment(dateOfGame, 'YYYY-MM-DD[T]HH:mm:sss.sss[Z]')
      const now = moment().add(5, 'minutes')
      return gameTime.isBefore(now)
    },
    showMsg(msg, color) {
      this.snackbar.msg = msg
      this.snackbar.color = color
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
    async vote(hts, ats, gameId, homeTeamName, awayTeamName, game) {
      const tooLate = this.isTooLateToVote(game.DateOfGame)
      if (tooLate) {
        return this.showMsg(
          `Því miður en kosningu lýkur 5 mínútum fyrir leik, við getum ekki tekið við atkvæði þínu.`,
          'red'
        )
      }
      console.log('TOO LATE?: ' + tooLate)
      let companyId = ''
      if (typeof this.user.company.id !== 'undefined') {
        companyId = this.user.company.id
      }
      if (this.user.company > 0) {
        companyId = this.user.company
      }
      const hasVotedBefore = await this.$strapi.find('user-predictions', {
        Game: gameId,
        User: this.user.id,
        Company: companyId,
      })
      if (hasVotedBefore.length <= 0) {
        try {
          const createdVoted = await this.$strapi.create('user-predictions', {
            HomeTeamScore: hts,
            AwayTeamScore: ats,
            Game: gameId,
            User: this.user.id,
            Company: companyId,
          })
          if (createdVoted) {
            game.myPrediction = createdVoted
            this.showMsg(
              `Takk fyrir kosninguna ( ${homeTeamName} ${hts} - ${ats} ${awayTeamName})`,
              'green'
            )
          } else {
            this.showMsg(
              `ATH: Villa kom upp við kosningu, prufaðu að endurhlaða síðunni. `,
              'red'
            )
          }
        } catch (e) {
          console.error(e)
          this.showMsg(
            `ATH: Villa kom upp við kosningu, prufaðu að endurhlaða síðunni. `,
            'red'
          )
        }
      } else {
        try {
          const updatedVote = await this.$strapi.update(
            'user-predictions',
            _.first(hasVotedBefore).id,
            {
              HomeTeamScore: hts,
              AwayTeamScore: ats,
              Game: gameId,
              Company: this.company,
            }
          )
          if (updatedVote) {
            this.showMsg(
              `Uppfærði kosninguna ( ${homeTeamName} ${hts} - ${ats} ${awayTeamName})`,
              'green'
            )
          } else {
            this.showMsg(
              `ATH: Villa kom upp við kosningu, prufaðu að endurhlaða síðunni. `,
              'red'
            )
          }
        } catch (e) {
          console.error(e)
          this.showMsg(
            `ATH: Villa kom upp við uppfærslur á kosningu, prufaðu að endurhlaða síðunni. `,
            'red'
          )
        }
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
