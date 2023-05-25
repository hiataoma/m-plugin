<template>
  <div id="app">
    <router-view></router-view>
    <!-- <mTest/> -->
  </div>
</template>

<script>
// import mhtPlugin from 'mht-plugin'
// let { mTest } = mhtPlugin
export default {
  name: 'app',
  data () {
    return {
    }
  },
  components: {
    mTest
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>