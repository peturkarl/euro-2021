<template>
  <v-container>
    <v-card elevation="3" class="mx-auto mt-4">
      <v-card-title inset>GROUP</v-card-title>
      {{ teamGames }}
    </v-card>
  </v-container>
</template>

<script>
const _ = require('lodash')
const moment = require('moment')
export default {
  filters: {
    dateFormat(v, fmt) {
      if (v) {
        return moment(v, 'DD-MM-YYYY').locale('is').format(fmt)
      }
    },
  },
  props: {
    groupGames: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      games: [],
    }
  },
  computed: {
    teamGames() {
      const x = {}
      const awayGames = this.getAwayTeamState()
      const homeGames = this.getHomeTeamState()
      for (const country of Object.keys(homeGames)) {
        x[country] = homeGames[country]
      }
      for (const country of Object.keys(awayGames)) {
        x[country] = _.concat(x[country], awayGames[country])
      }
      return x
    },
    user() {
      return this.$strapi.user
    },
  },
  methods: {
    getHomeTeamState() {
      const teams = {}
      _.each(this.groupGames, (g) => {
        if (g.HomeTeamScore !== null) {
          const gameObj = {
            goalsScored: g.HomeTeamScore,
            goalsAgainst: g.AwayTeamScore,
            points:
              g.HomeTeamScore === g.AwayTeamScore
                ? 1
                : g.HomeTeamScore > g.AwayTeamScore
                ? 3
                : 0,
          }
          if (teams[g.HomeTeam.TeamName] === undefined) {
            teams[g.HomeTeam.TeamName] = []
            teams[g.HomeTeam.TeamName].push(gameObj)
          } else {
            teams[g.HomeTeam.TeamName].push(gameObj)
          }
        }
      })
      return teams
    },
    getAwayTeamState() {
      const teams = {}
      _.each(this.groupGames, (g) => {
        if (g.AwayTeamScore !== null) {
          const gameObj = {
            goalsScored: g.AwayTeamScore,
            goalsAgainst: g.HomeTeamScore,
            points:
              g.AwayTeamScore === g.HomeTeamScore
                ? 1
                : g.AwayTeamScore > g.HomeTeamScore
                ? 3
                : 0,
          }
          if (teams[g.AwayTeam.TeamName] === undefined) {
            teams[g.AwayTeam.TeamName] = []
            teams[g.AwayTeam.TeamName].push(gameObj)
          } else {
            teams[g.AwayTeam.TeamName].push(gameObj)
          }
        }
      })
      return teams
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
      if (pts === 4) {
        return 'green darken-4'
      }
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
  },
}
</script>
