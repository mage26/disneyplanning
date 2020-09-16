<template>
	<div class="park-selectors">
      <ul class="park-list">
        <li class="park-link" v-for="p in parks" :selected="p == selectedPark" :class="[p == selectedPark ? 'selected' : '', p]" @click="selectedPark = p">{{parkName(p)}}</li>
      </ul>
      <div class="filters-container">
	      <dropdown v-model="selectors.locations" title="Lands" :items="allLocations" :defaultChecked="false"></dropdown>
	      <dropdown v-model="selectors.category" title="Categories" :items="selectCategories" :defaultChecked="true"></dropdown>
	      <dropdown v-model="selectors.options" title="Options" :items="optionCategories" :defaultChecked="false"></dropdown>
	  </div>
    </div>
   
</template>

<script>
	import { mapState, mapGetters } from 'vuex'
	import dropdown from './dropdown.vue';

	export default {
		name: 'DisneyFilters',
		props : ['value'],
		data: () => ({
			 parks : [
		      "magic-kingdom",
		      "epcot",
		      "hollywood-studios",
		      "animal-kingdom"
		    ],
		    selectedPark : "magic-kingdom",
		    selectors : {
		      "category" :  ["ride", "scheduled_show", "play_area", "continuous_show", "character_greeting", "arcade", "walkthrough", "other"],
		      "locations" : [],
		      "options" : ["not_to_be_missed", "rider_swap", "fastpass"],
		      maxHeight : 100,
		    },
		    selectCategories : [
		    	{name:"Ride", value:"ride"},
		    	{name:"Scheduled Show", value:"scheduled_show"},
		    	{name:"Continuous Show", value:"continuous_show"},
		    	{name:"Play Area", value:"play_area"},
		    	{name:"Meet and Greet", value:"character_greeting"},
		    	{name:"Arcade", value:"arcade"},
		    	{name:"Walkthrough", value:"walkthrough"},
		    	{name:"Other", value:"other"},
		    ],
		    optionCategories : [
		    	{name: "Has Fastpass+", value:"fastpass"},
		    	{name: "Has Parent Swap", value:"rider_swap"},
		    	{name: "Must See Attraction", value:"not_to_be_missed"},
		    ],
		}),
		methods : {
			attrFilter(attr) {
		      let flag = true;
		      /*let maxHeight = 100;
		      this.selectors.options.forEach((opt) => {
		      	if(opt.includes('height')) {
		      		const h = parseInt(opt.split('_')[1], 10);
		      		if(h < maxHeight) maxHeight = h;
		      	}
		      })*/

		      if(this.selectors.options.indexOf("fastpass") >= 0 && !attr.fastpass) flag = false; 
		      if(this.selectors.options.indexOf("not_to_be_missed") >= 0 && !attr.not_to_be_missed && flag) flag = false; 
		      if(this.selectors.options.indexOf("rider_swap") >= 0 && !attr.rider_swap && flag) flag = false;
		      //if(attr['height_restriction'] && attr['height_restriction'] >= maxHeight && flag) flag = false; 
		      if(this.selectors.category.indexOf(attr.category_code) < 0 && flag) flag = false;
		      if(this.selectors.locations.length > 0 && attr.location && this.selectors.locations.indexOf(attr.location) < 0 && flag) flag = false;
		      if(attr.hide_app && flag) flag = false;

		      return flag;
		    },
		    
		    
		},
		computed : {
			...mapState(['attractions']),
			...mapGetters(['parkName']),
			allAttractions(scope) {
				return scope.attractions[scope.selectedPark];
			},
			currentAttractions(scope){
		      if(scope.allAttractions)  
		        return Object.values(scope.allAttractions).filter((a) => scope.attrFilter(a)).sort((a, b) => a.sort_name > b.sort_name ? 1 : -1)
		      return []
		    },
		    allLocations(scope) {
		      const locs = [];
		      const locChecks = [];
		      for(let a in scope.allAttractions) {
		        const attr = scope.allAttractions[a];
		        const l = attr.location;
		        if(l && locChecks.indexOf(l) < 0){
		          locs.push({name:l, value:l});
		          locChecks.push(l);
		        }
		      }
		      
		      return locs;
		    },
		    currentHeights(scope) {
		    	const heights = [];
		    	const attractions = Object.values(scope.allAttractions);
		    	for(let a = 0; a < attractions.length; a++){
		    		const attr = attractions[a];
		    		if(attr['height_restriction'] && !heights.includes(attr['height_restriction'])) {
		    		 	heights.push(attr['height_restriction']);
		    		}
		    	}
		    	heights.sort((a,b) => a - b);
		    	return heights;
		    },
		    optionsWithHeights(scope) {
		    	const ops = scope.optionCategories;
		    	scope.currentHeights.forEach((h) => {
		    		ops.push({
		    			name : `Max Height ${h}"`,
		    			value: `height_${h}`,
		    			type: 'radio',
		    			typeGroup: 'heights',
		    		})
		    	});
		    	return ops;
		    }
		},
		 mounted : function() {
		    //this.getParkAttractions(this.selectedPark)
		    this.$emit('input', this.currentAttractions);
		  },
		watch : {
			currentAttractions() {
				this.$emit('input', this.currentAttractions);
			},
			selectedPark : function() {
		      let scope = this;
		      if(scope.attractions[scope.selectedPark] == null) {
		        scope.getParkAttractions(scope.selectedPark)
		      }
		    },
		},
		components : {
			dropdown
		},
	}
</script>

<style lang="less" scoped>
	@import '../styles/mixins.less';

	.filters-container {
		display: flex;
		justify-content: space-evenly;
		width: 80%;
		margin: 0 auto;

		.tablet({
			display: block;
			width: 50%;
		})
	}

	.park-list {
		margin: 10px 0;
		display: flex;
		justify-content: center;
		.tablet({
			display: block;
		})
	}
	.park-link {
		padding: 10px 15px 10px 60px;
		border: 1px solid #000;
		position: relative;
		border-radius: 5px;
		transition: all .5s;
		margin: 0 10px;
		cursor: pointer;
		&:before {
			content: "";
			position: absolute;
			left: 5px;
			top: 2px;
			width: 50px;
			height: 35px;
			background-size: contain;
			background-position: center bottom;
			background-repeat: no-repeat;
		}
		&.magic-kingdom:before{
			.magic-kingdom();
		}
		&.epcot:before{
			.epcot();
		}
		&.hollywood-studios:before{
			.hollywood-studios();
		}
		&.animal-kingdom:before{
			.animal-kingdom();
		}
		&:hover {
			color: @red;
			border: 1px solid @red;
		}

		&.selected {
			border: 1px solid @red;
			background-color: @red;
			color: #fff;
			&.magic-kingdom:before{
				.magic-kingdom-white();
			}
			&.epcot:before{
				.epcot-white();
			}
			&.hollywood-studios:before{
				.hollywood-studios-white();
			}
			&.animal-kingdom:before{
				.animal-kingdom-white();
			}
			&:hover {
				color: #fff;
			}
		}

		.tablet({
			margin: 10px;
		});
	}
</style>