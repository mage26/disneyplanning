import Vue from 'vue'
import VueResource from 'vue-resource'
import Vuex from 'vuex'

import magic_kingdom from './models/magic-kingdom.json';
import epcot from './models/epcot.json';
import hollywood_studios from './models/hollywood-studios.json';
import animal_kingdom from './models/animal-kingdom.json' 

Vue.use(Vuex)
Vue.use(VueResource)

const base = "http://localhost:3000/"
//http://localhost:3000/disney/attractions/magic-kingdom
export default new Vuex.Store({
  state: {
  	attractions : {},
    trips : []
  },
  mutations: {
  	ADDATTRACTIONS(state, payload) {
     // Vue.set(state.attractions, payload.id, payload.attractions)
     state.attractions = payload.attractions;
  	},
    SETDETAILS(state, payload) {
      state.attractions[payload.park][payload.attraction].details = payload.details
    },
    SETTRIPS(state, payload) {
      state.trips = payload.trips
    },
    ADDTRIP(state, payload) {
      state.trips.push(payload.trip)
      saveLocal(state.trips);
    },
    MODIFYTRIP(state, payload) {
      state.trips[payload.id] = payload.trip
      saveLocal(state.trips);
    },
    ADDLIKE(state, payload) {
      state.trips[payload.tripId].likes[payload.memberId].push(payload.attraction);
      saveLocal(state.trips);
    },
    REMOVELIKE(state, payload) {
      state.trips[payload.tripId].likes[payload.memberId].splice(payload.attractionIndex, 1);
      saveLocal(state.trips);
    },
    ADDDAY(state, payload) {
      state.trips[payload.tripId].days[payload.dateId] = {
        park : payload.park,
        fp : ["", "", ""]
      }
      saveLocal(state.trips);
    },
    ADDDAYCHOICE(state, payload) {
      state.trips[payload.tripId].days[payload.dateId].fp[payload.fpId] = payload.attrId;
      saveLocal(state.trips);
    }
  },
  getters : {
    getTrip : (state) => (id) => {
      if(state.trips[id]) return state.trips[id];
      return null;
    },
    checkLiked : (state) => (tripId, memberId, attraction) => {
      if(state.trips[tripId]) {
        return state.trips[tripId].likes[memberId].indexOf(attraction) >= 0;
      }
      return false;
    },
    parkName : (state) => (park) => {
      return {
        "magic-kingdom" : "Magic Kingdom",
        "epcot" : "Epcot",
        "hollywood-studios" : "Hollywood Studios",
        "animal-kingdom" : "Animal Kingdom",
      }[park];
    },
    attractionsByShortname : (state) => {
      const shortAttrs = {};
      const attrs = state.attractions;
      
      Object.keys(attrs).forEach((park) => {
        //shortAttrs[park] = {};
        Object.values(attrs[park]).forEach((attr) => {
          attr.park = park;
          shortAttrs[attr.match_name] = attr;
        })
      });
      return shortAttrs;
    },
    fastpassAttractions : (state) => {
      const fps = {};
      fps['magic-kingdom'] = { "1" : [], "2" : Object.values(state.attractions['magic-kingdom']).filter((attr) => attr.fastpass).sort((a,b) => { if(a.sort_name < b.sort_name) return -1; if(a.sort_name > b.sort_name) return 1; return 0;}).map((attr) => attr.match_name)};
      fps['epcot'] = {
        "1" : Object.values(state.attractions['epcot']).filter((attr) => attr.fastpass && attr.tier == 1).sort((a,b) => { if(a.sort_name < b.sort_name) return -1; if(a.sort_name > b.sort_name) return 1; return 0;}).map((attr) => attr.match_name),
        "2" : Object.values(state.attractions['epcot']).filter((attr) => attr.fastpass && attr.tier == 2).sort((a,b) => { if(a.sort_name < b.sort_name) return -1; if(a.sort_name > b.sort_name) return 1; return 0;}).map((attr) => attr.match_name),
      }
      fps['hollywood-studios'] = {
        "1" : Object.values(state.attractions['hollywood-studios']).filter((attr) => attr.fastpass && attr.tier == 1).sort((a,b) => { if(a.sort_name < b.sort_name) return -1; if(a.sort_name > b.sort_name) return 1; return 0;}).map((attr) => attr.match_name),
        "2" : Object.values(state.attractions['hollywood-studios']).filter((attr) => attr.fastpass && attr.tier == 2).sort((a,b) => { if(a.sort_name < b.sort_name) return -1; if(a.sort_name > b.sort_name) return 1; return 0;}).map((attr) => attr.match_name),
      }
      fps['animal-kingdom'] = {
        "1" : Object.values(state.attractions['animal-kingdom']).filter((attr) => attr.fastpass && attr.tier == 1).sort((a,b) => { if(a.sort_name < b.sort_name) return -1; if(a.sort_name > b.sort_name) return 1; return 0;}).map((attr) => attr.match_name),
        "2" : Object.values(state.attractions['animal-kingdom']).filter((attr) => attr.fastpass && attr.tier == 2).sort((a,b) => { if(a.sort_name < b.sort_name) return -1; if(a.sort_name > b.sort_name) return 1; return 0;}).map((attr) => attr.match_name),
      }
      return fps;
    },
  },
  actions: {
  	init() {
      console.log("store init")
      if(localStorage.trips) {
        const trips = JSON.parse(localStorage.trips);
        for(let t = 0; t < trips.length; t++) {
          const trip = trips[t];
          trip.startDate = new Date(trip.startDate);
          trip.endDate = new Date(trip.endDate);
          if(!trip.days) trip.days = {};
          trips[t] = trip;
        }
        this.commit('SETTRIPS', { trips });
      }
      this.dispatch('getParkAttractions', {});
  	},
     getParkAttractions(store, payload) {
      return new Promise((resolve) => {
       /* Vue.http.get(`${base}disney/allattractions/${payload.park}`, {'responseType' : 'json'}).then((response) => {
          this.commit('ADDATTRACTIONS', {'id': payload.park, 'attractions' : response.body})
        })*/
        let attractions = {
          'magic-kingdom' : magic_kingdom,
          'epcot' : epcot,
          'hollywood-studios' : hollywood_studios,
          'animal-kingdom' : animal_kingdom,
        }
        this.commit('ADDATTRACTIONS', {'id': payload.park, 'attractions' : attractions});
      })
    },
    getAttractionDetail(store, payload) {
      //console.log("HERE", payload.park, payload.attraction)
      return new Promise((resolve) => {
        Vue.http.get(`${base}disney/attractions/${payload.park}/${payload.attraction}`, {'responseType' : 'json'}).then((response) => {
          console.log(response)
          this.commit("SETDETAILS", {'park':payload.park, 'attraction' : payload.attraction, 'details' : response.body})
        })
      })
    },
    addTrip(store, payload) {
      return new Promise((resolve) => {
        console.log(payload)
        const trip = payload;
        trip.likes = {};
        trip.members.forEach((member)=> {
          trip.likes[member] = [];
        });
        trip.days = {};
        this.commit("ADDTRIP", {trip});
        resolve();
      })
    },
    editTrip(store, payload) {
      return new Promise((resolve) => {
        const trip = payload.trip;
        const likes = {};
        trip.members.forEach((member) => {
          likes[member] = trip.likes[member] || [];
        });
        console.log(likes);
        trip.likes = likes;
        this.commit("MODIFYTRIP", {id: payload.id, trip});
        resolve();
      })
    },

    addLike(store, payload) {
      return new Promise((resolve) => {
        
        const {tripId, memberId, attraction} = payload;
        if(store.getters['checkLiked'](tripId, memberId, attraction)) {
          this.commit("REMOVELIKE", {...payload, attractionIndex : store.state.trips[tripId].likes[memberId].indexOf(attraction)})
        } else {
          this.commit("ADDLIKE", payload);
        }
        resolve();
      })
    },
    addDay(store, payload) {
      return new Promise((resolve) => {

      });
    },
  }
})

function checkAllAttractions(state) { return !!(state.attractions["magic-kingdom"] && state.attractions["epcot"]) }
function saveLocal(trips) {
localStorage.trips = JSON.stringify(trips); 
}