<template>
  <page-layout :avatar="currUser.avatar">
    <div slot="headerContent">
      <div class="title">你好，{{currUser.username}}</div>
      <div>{{currUser.introduction}}</div>
    </div>
    <template slot="extra">
      <head-info class="split-right" :title="$t('project')" content="56"/>
      <head-info class="split-right" :title="$t('ranking')" content="8/24"/>
      <head-info class="split-right" :title="$t('visit')" content="2,223"/>
    </template>
    <template>
    </template>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import HeadInfo from '@/components/tool/HeadInfo'
import { mapState, mapMutations } from 'vuex'
import {getinfo} from '@/services'


export default {
  name: 'WorkPlace',
  components: { HeadInfo, PageLayout},
  i18n: require('./i18n'),
  data () {
    return {
      projects: [],
      loading: true,
      activities: [],
      teams: [],
      welcome: {
        timeFix: '',
        message: ''
      }
    }
  },
  computed: {
    ...mapState('account', {currUser: 'user'}),
    ...mapState('setting', ['lang'])
  },
  created() {
    getinfo().then(res => {
      const userInfo = res.data.data
      this.setUser(userInfo)
      console.log(res.data.data)
    })
  },
  methods: {
    ...mapMutations('account',['setUser']),
  },
}
</script>

<style lang="less">
@import "index";
</style>
