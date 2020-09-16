<template>
  <div class="attractions-container">
      <h1 v-if="currentTrip && currentTrip.name">{{currentTrip.name}}</h1>

      <router-link class="trip-summary-link" :to="'/vacation/'+tripId" v-show="hasAttractionLikes">Go to This Trip's Summary -&gt;</router-link>
      <disney-filters v-model="currentAttractions"></disney-filters>
      <!--<h1>{{selectedPark}}</h1>-->
     <div class="attractions-details-container" :class="{hasDetails : selectedAttr}">
        <div class="attraction-list">
          <ul v-for="(attrs, attrType) in currentAttractionsByType" v-show="attrs.length > 0">
            <li class="attraction-header">{{translateAttractionType(attrType)}}</li>
            <li v-for="attr in attrs" :class="{selected : selectedAttr == attr.match_name}" v-if="attr && attr.name">
               
              <div class="attraction-name" @click="selectedAttr == attr.match_name ? selectedAttr = '' : selectedAttr = attr.match_name">
                {{attr.name}}
                <div class="attraction-likes">
                  <span class="attr-like mickey" :style="{backgroundColor: currentTrip.colors[person]}" v-for="person in attractionLikes[attr.match_name]" v-tooltip="currentTrip.members[person]">
                    <span class="mickey-ear left-ear" :style="{backgroundColor: currentTrip.colors[person]}"></span>
                    <span class="mickey-ear right-ear" :style="{backgroundColor: currentTrip.colors[person]}"></span>
                  </span>
                </div>

                
              </div>
             
            </li>
          </ul>
        </div>
        <div class="attractions-details-parent">
          <div class="close-attraction-details"  v-show="selectedAttr" @click="selectedAttr = null">X</div>
           <AttractionDetails v-if="selectedAttr" :attraction="attractionsByShortname[selectedAttr]" :currentTrip="currentTrip"></AttractionDetails>
        </div> 
     </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import AttractionDetails from '@/components/AttractionDetails.vue'
import DisneyFilters from '@/components/DisneyFilters.vue'

export default {
  name: 'DisneyPlanning',
  
  components : {
    AttractionDetails,
    DisneyFilters
  },
  data: () => ({
    currentAttractions : [],
    selectedAttr : "",
    
  }),
  methods : {
     translateAttractionType(type) {
        return {
          "ride":"Rides",
          "scheduled_show":"Scheduled Shows", 
          "continuous_show":"Continuous Shows", 
          "play_area":"Play Areas", 
          "character_greeting":"Meet and Greets", 
          "arcade":"Arcades", 
          "walkthrough":"Walkthroughs", 
          "other":"Other", 
        }[type];
     }
  },
  computed : {
    ...mapState(['attractions']),
    ...mapGetters(['getTrip', 'attractionsByShortname']),
    
    currentTrip(scope) {
      return scope.getTrip(scope.tripId);
    },
    tripId(scope) {
      return scope.$route.params.tripId;
    },
    currentAttractionsByType(scope) {
      const attrs = {
        "ride":[],
        "scheduled_show":[], 
        "continuous_show":[], 
        "play_area":[], 
        "character_greeting":[], 
        "arcade":[], 
        "walkthrough":[], 
        "other":[], 
      };
      scope.currentAttractions.forEach((attr) => {
       
        attrs[attr.category_code].push(attr);
      });
      return attrs;
    },
    hasAttractionLikes(scope) {
      return Object.keys(scope.attractionLikes).length > 0;
    },
    attractionLikes(scope) {
      const likes = {};
      if(scope.currentTrip) {
        Object.keys(scope.currentTrip.likes).forEach((key, num) => {
          Object.values(scope.currentTrip.likes[key]).forEach((like) => {
            if(!likes[like]) {
              likes[like] = [];
            } 
            likes[like].push(num); 
          });
        });
      }
      return likes;
    },
  },
  watch: {
    currentAttractionsByType(){
      this.selectedAttr = "";
    },
    attractionLikes : {
      deep: true,
      handler() {
        this.$forceUpdate();
      }
    }
  }
 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../styles/mixins.less';

h3 {
  margin: 40px 0 0;
}

li {
  cursor: pointer;
  margin: 0 10px;
}
.park-selectors{

  background: #fff;
  padding: 10px 0;
  z-index: 100;
  
}
.trip-summary-link {
  margin-top: 15px;
  display: inline-block;
}

.attractions-details-container {
  display: flex;
  padding: 30px 0 0;
  align-items: flex-start;
  align-content: flex-start;
  position: relative;
  .tablet({
    width: 200%;
    left: 0;
    transition: left .5s;
    &.hasDetails {
      left: -98%;
    }
  })
}
.attractions-details-parent {
  width: 40%;
  position: relative;
  .close-attraction-details {
    position: absolute;
    right: 0;
    top: -15px;
    font-size: 14px;
    cursor: pointer;
  }
  .tablet({
    width: 90%;
    margin: 0 5%;
  })
}
.attraction-list {
  
  width: 40%;
  margin: 0 5%;
  max-height: 550px;
  overflow-y: scroll;
  padding-bottom: 20px;
  .tablet({
    width: 100%;
    margin: 0;
  });
  ul {
    margin-bottom: 40px;

  }
  li {
    margin-bottom: 15px;
    text-align: left;
    &.selected {
      color: #9f0007;
    }
    &.attraction-header {
      font-weight: bold;
      text-transform: uppercase;
      text-decoration: underline;
      font-size: 22px;
      text-align: center;
    }

    .attraction-name {
      position: relative;
      display: flex;
    }
    .attraction-likes {
      display: flex;
      justify-content: flex-end;
      margin-left: 10px;
    }
  }
  .mickey {
    width: 18px;
    height: 18px;
    margin-right: 13px;
    position: relative;
    border-radius: 10px;
    .mickey-ear {
      width: 11px;
      height: 10px;
      position: absolute;
      top: -5px;
      border-radius: 10px;
    }
    .left-ear {
      left: -5px;
      transform: rotate(-35deg);
    }
    .right-ear {
      right: -5px;
      transform: rotate(35deg);
    }
  }
}



</style>
