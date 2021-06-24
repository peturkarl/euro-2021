<template>
  <div>
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
      <v-card-title inset>Staðan</v-card-title>
      <v-card-text>
        <v-chip
          :color="gameView === 'All' ? 'primary' : 'secondary'"
          label
          @click="toggleAllView"
        >
          <v-icon left> mdi-table </v-icon>
          Allir leikir
        </v-chip>
        <v-chip
          :color="gameView === 'Knockout' ? 'primary' : 'secondary'"
          label
          @click="toggleKnockoutView"
        >
          <v-icon left> mdi-trophy </v-icon>
          Úrslitakeppni
        </v-chip>
        <v-chip
          :color="gameView === 'GroupStage' ? 'primary' : 'secondary'"
          label
          @click="toggleGroupView"
        >
          <v-icon left> mdi-blinds </v-icon>
          Riðlakeppni
        </v-chip>
      </v-card-text>
      <v-simple-table>
        <template #default>
          <thead>
            <tr>
              <th class="text-left">Sæti</th>
              <th class="text-left">Lið</th>
              <th class="text-left">Stig</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, index) in statusTableByPoints" :key="member.id">
              <td>{{ index + 1 }}</td>
              <td>{{ member.fullName }}</td>
              <td>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">
                      {{ member.points }}
                    </span>
                  </template>
                  <span> Gisk: {{ member.numberOfVotes }} </span>
                </v-tooltip>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </div>
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
      snackbar: {
        timeout: 5000,
        msg: '',
        show: false,
        color: '',
      },
      gameMap: {},
      gameView: 'Knockout',
      company: [],
      statusTable: [],
    }
  },
  async fetch() {
    try {
      let companyId = ''
      if (typeof this.user.company.id !== 'undefined') {
        companyId = this.user.company.id
      }
      if (this.user.company > 0) {
        companyId = this.user.company
      }
      if (companyId !== '') {
        const company = await this.$strapi.findOne('companies', companyId)
        this.company = company
        this.statusTable = await this.$strapi.$http.$get(
          `/company-status-table/${company.id}`
        )
      }
      const games = await this.$strapi.find('games')
      const gameMap = {}
      for (const g of games) {
        gameMap[g.id] = g.GroupStage.GroupType
      }
      this.gameMap = gameMap
    } catch (e) {
      console.error(e)
    }
  },
  computed: {
    user() {
      return this.$strapi.user
    },
    statusTableByPoints() {
      const users = _.map(this.company.Users, (u) => {
        return {
          id: u.id,
          fullName: u.fullName,
          points: this.getPoints(u.id),
          numberOfVotes: this.getVotes(u.id),
        }
      })
      return _.orderBy(users, 'points', 'desc')
    },
  },
  methods: {
    toggleAllView() {
      this.gameView = 'All'
    },
    toggleKnockoutView() {
      if (this.gameView === 'Knockout') {
        this.gameView = 'All'
      } else {
        this.gameView = 'Knockout'
      }
    },
    toggleGroupView() {
      if (this.gameView === 'GroupStage') {
        this.gameView = 'All'
      } else {
        this.gameView = 'GroupStage'
      }
    },
    getPoints(userId) {
      if (this.statusTable[userId] !== undefined) {
        const pts = this.statusTable[userId]
        for (const game of pts) {
          game.type = this.gameMap[game.game]
        }
        const filter = this.gameView
        let totalPts = 0
        if (filter === 'All') {
          totalPts = _.sumBy(pts, 'totalPoints')
        } else {
          totalPts = _.sumBy(
            _.filter(pts, (g) => {
              return g.type === filter
            }),
            'totalPoints'
          )
        }
        return totalPts
      } else {
        return 0
      }
    },
    getVotes(userId) {
      if (this.statusTable[userId] !== undefined) {
        const votes = this.statusTable[userId]
        for (const game of votes) {
          game.type = this.gameMap[game.game]
        }
        const filter = this.gameView
        if (filter === 'All') {
          return votes.length
        } else {
          return _.filter(votes, (g) => {
            return g.type === filter
          }).length
        }
      } else {
        return 0
      }
    },
    showMsg(msg, color) {
      this.snackbar.msg = msg
      this.snackbar.color = color
      this.snackbar.show = true
    },
  },
}
</script>
