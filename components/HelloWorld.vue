<template>
  <div class="attractions-container">
    <ul class="park-list">
      <li class="park-link" v-for="p in parks" :selected="p == selectedPark" :class="{'selected' : p == selectedPark}" @click="selectedPark = p">{{p}}</li>
    </ul>
    <div class="park-selectors">
      <div class="attraction-categories">
        <ul>
          <li>Ride <input type="checkbox" v-model="selectors.category.ride" /></li>
          <li>Scheduled Show <input type="checkbox" v-model="selectors.category.scheduled_show" /></li>
          <li>Continuous Show <input type="checkbox" v-model="selectors.category.continuous_show" /></li>
          <li>Play Area <input type="checkbox" v-model="selectors.category.play_area" /></li>
          <li>Character Meet and Greet<input type="checkbox" v-model="selectors.category.character_greeting" /></li>
          <li>Arcade <input type="checkbox" v-model="selectors.category.arcade" /></li>
          <li>Walkthrough <input type="checkbox" v-model="selectors.category.walkthrough" /></li>
          <li>Other <input type="checkbox" v-model="selectors.category.other" /></li>
        </ul>
      </div>
      <div class="other-categories">
        <ul>
          <li>Has Parent Swap <input type="checkbox" v-model="selectors.rider_swap" /></li>
          <li>Must See Attraction <input type="checkbox" v-model="selectors.not_to_be_missed" /></li>
        </ul>
      </div>
    </div>
    <div>
      <h1>{{selectedPark}}</h1>
      <div class="loading" v-show="loading"><img src="../assets/load.gif" /></div>
      <ul>
        <li v-for="attr in currentAttractions" v-show="attrFilter(attr)">{{attr.name}}</li>
      </ul>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data: () => ({
    parks : [
      "magic-kingdom",
      "epcot",
      "hollywood-studios",
      "animal-kingdom"
    ],
    selectedPark : "magic-kingdom",
    selectors : {
      "category" :  {"ride":true, "scheduled_show":true, "play_area":true, "continuous_show":true, "character_greeting":true, "arcade":true, "walkthrough":true, "other":true},
      "not_to_be_missed" : false,
      "rider_swap" : false,

    }
  }),
  methods : {
   // ...mapActions(['init'])
    getAttractionDetails(park, attraction) {
      this.$store.dispatch('getAttractionDetail', {
        park : park,
        attraction : attraction
      })
    },
    getParkAttractions(p) {
      this.$store.dispatch('getParkAttractions', {
        park :  this.selectedPark
      })
    },
     attrFilter(attr) {
      var flag = true;
      if(this.selectors.not_to_be_missed && !attr.not_to_be_missed && flag) flag = false; 
      if(!this.selectors.category[attr.category_code] && flag) flag = false;
      if(this.selectors.rider_swap && !attr.rider_swap && flag) flag = false;

      if(flag) return attr
    }
  },
  computed : {
    ...mapState(['attractions']),
    currentAttractions : function(){
      let scope = this
      if(scope.attractions[scope.selectedPark])  
        return Object.values(scope.attractions[scope.selectedPark]).sort((a, b) => a.sort_name > b.sort_name ? 1 : -1)
      return []
    },
    attractionTypes :  function(){
      let types = {
        category_code : [],
        operator_type : [],
        scope_and_scale_code : []
      }
      if(!this.currentAttractions.length) return types

      for(let a in this.currentAttractions) {
        let attr = this.currentAttractions[a];
        if(attr.category_code && types.category_code.indexOf(attr.category_code) < 0) {
          types.category_code.push(attr.category_code)
        }
        if(attr.operator_type && types.operator_type.indexOf(attr.operator_type) < 0) {
          types.operator_type.push(attr.operator_type)
        }
        if(attr.scope_and_scale_code && types.scope_and_scale_code.indexOf(attr.scope_and_scale_code) < 0) {
          types.scope_and_scale_code.push(attr.scope_and_scale_code)
        }
      }

      return types


    },
    loading : function() {
      return !(this.selectedPark && Object.keys(this.currentAttractions).length > 0);
    } 
  },
  mounted : function() {
    this.getParkAttractions(this.selectedPark)
  },
  watch : {
    selectedPark : function() {
      let scope = this;
      if(scope.attractions[scope.selectedPark] == null) {
        scope.getParkAttractions(scope.selectedPark)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  /*display: inline-block;*/
  cursor: pointer;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
