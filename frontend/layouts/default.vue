<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <span v-if="getCompanyLogo !== ''"
        ><img
          class="mr-3"
          :src="$config.API_URL + getCompanyLogo"
          height="35"
        />
      </span>
      <v-toolbar-title v-text="getTitle" />
      <v-spacer />

      <div v-if="user">
        <v-menu bottom offset-y>
          <template #activator="{ on, attrs }">
            <v-btn dark v-bind="attrs" v-on="on">
              {{ user.fullName }}
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="logout">
              <v-list-item-title>Útskrá</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  middleware: ['auth'],
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      company: {
        CompanyName: '',
        Logo: {
          url: '',
        },
      },
      items: [
        {
          icon: 'mdi-apps',
          title: 'Heim',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Staðan',
          to: '/status',
        },
      ],
      miniVariant: false,
      right: false,
      rightDrawer: false,
      title: 'EURO 2021',
    }
  },
  async fetch() {
    let companyId = ''
    if (typeof this.user.company.id !== 'undefined') {
      companyId = this.user.company.id
    } else if (this.user.company > 0) {
      companyId = this.user.company
    }

    if (companyId !== '') {
      const company = await this.$strapi.findOne('companies', companyId)
      if (company) {
        this.company = company
      }
    }
  },
  computed: {
    user() {
      return this.$strapi.user
    },
    getTitle() {
      return `${this.company.CompanyName} ${this.title}`
    },
    getCompanyLogo() {
      if (this.company.Logo === null) {
        return ''
      }
      if (typeof this.company.Logo.url !== 'undefined') {
        return this.company.Logo.url
      } else {
        return ''
      }
    },
  },
  methods: {
    logout() {
      this.$strapi.logout()
      this.$router.push('/login')
    },
  },
}
</script>
