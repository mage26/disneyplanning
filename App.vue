<template>
  <div id="app">
    <div class="top-nav">
      <router-link to="/">Home</router-link>
      <router-link to="/create">Create a New Trip</router-link>
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
  
  export default {
    name : "App",
    mounted : function(){
      this.$store.dispatch('init')
    },
    computed: {
      tripId(scope) {
        return this.$route.params.tripId;
      },
      currentPage(scope) {
        return this.$route.name;
      }
    }
  }
</script>

<style lang="less">
@import './styles/reset.css';
@import './styles/mixins.less';

body {
  margin: 0;
  background: #f3f3f3;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #fff;
  max-width: 80%;
  margin: 0 auto;
  box-shadow: 0 0 5px rgba(0,0,0,0.5);
  min-height: 100vh;
  .tablet({
    max-width: 100%;
  })
}
.top-nav {
  padding: 15px 5%;
  text-align: left;
  font-size: 18px;
  a {
    margin-right: 25px;
  }
  .tablet({
    padding: 15px 5px;
    font-size: 14px;
    a {
      margin-right: 10px;
    }
  });
}


a {
  color: @red;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}

h3 {
  font-size: 18px;
  font-weight: bold;
}
h1 {
  font-size: 28px;
  font-weight: bold;
  .tablet({
    font-size: 22px;
  })
}

.tooltip {
  display: block !important;
  z-index: 10000;
  outline: none;
  //margin-bottom: 100px;
 
  .tooltip-inner {
    background: #fff;
    color: @red;
    border: 1px solid @red;
    border-radius: 6px;
    padding: 5px 8px 4px;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity .15s, visibility .15s;
  }

  &[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity .15s;
  }
}


</style>
