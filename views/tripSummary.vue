<template>
	<section class="trip-summary-container">
		<h3 class="trip-title" v-if="currentTrip">{{currentTrip.name}}</h3>

      	<router-link class="trip-plan-link" :to="'/attractions/'+tripId" >&lt;- Go to Plan this Trip</router-link>
		<div class="trip-dates" v-if="currentTrip && currentTrip.startDate">{{currentTrip.startDate.toDateString()}} to {{currentTrip.endDate.toDateString()}}</div>
		<ul class="reservation-dates">
			<li>You can begin making <em>dining</em> reservations on <em>{{diningDate.toDateString()}}</em></li>
			<li>If you're staying at a hotel on Disney property you can make <em>Fastpass+</em> reservations on <em>{{hotelFastpassDate.toDateString()}}</em></li>
			<li>If you're staying <em>off-site</em> you can make <em>Fastpass+</em> reservations on <em>{{offsiteFastpassDate.toDateString()}}</em></li>
		</ul>
		
		
		<div class="attractions-container">
			<div class="top-attractions-container" :class="park" v-for="(likes, park) in orderedAttractionLikes" v-if="orderedAttractionLikes && likes && likes.length > 0">
				<h3>Your Top {{parkName(park)}} Attractions</h3>
				<ul>
					<li v-for="attr in likes" :key="attr.id">
						<v-popover placement="bottom" popoverClass="attractionDetailsPop">
							<p class="tooltip-target">{{attractionsByShortname[attr.id].short_name}} </p>

							<template slot="popover">
								<div class="attraction-details-container">
									<span class="close-tooltip" v-close-popover>X</span>
									<AttractionDetails :attraction="attractionsByShortname[attr.id]" :currentTrip="currentTrip"></AttractionDetails>
								</div>
							</template>
						</v-popover>
					</li>
				</ul>
			</div>
		</div>

		<div class="date-picker-container">
			<div class="date" v-for="(thisdate, d) in myDates" :key="thisdate.id">
				<p class="date-title">{{getDateLabel(thisdate.id)}}</p>
				<!--<select class="park-select" v-model="thisdate.park" @change="pickDate(thisdate, d)">
					<option value="" selected hidden>Pick a park for today</option>
					<option v-for="park in parks" :value="park">{{parkName(park)}}</option>
					<option value="none">No Park Today</option>
				</select> -->
				<ParkPicker v-model="thisdate.park" @input="pickDate(thisdate, d)"></ParkPicker>
				<select class="fastpass-select" v-model="thisdate.fp[k]" v-for="(fps, k) in thisdate.fp" v-if="thisdate.fp && thisdate.park != '' && thisdate.park != 'none'" @change="pickFp(thisdate, k)">
					<option value="" selected hidden>Fastpass {{k + 1}} <span v-if="k == 0 && thisdate.park != 'magic-kingdom'">(Tier 1)</span></option>
					<option :value="fp" v-for="fp in fastpassAttractions[thisdate.park][1]" v-show="k == 0 && !hasFastpass(d, fp)">{{attractionsByShortname[fp].name}}</option>
					<option :value="fp" v-for="fp in fastpassAttractions[thisdate.park][2]" v-show="!hasFastpass(d, fp)">{{attractionsByShortname[fp].name}}</option>
				</select>
			</div>
		</div>
		
	</section>
</template> 

<script>
import { mapState, mapGetters } from 'vuex'
import AttractionDetails from '@/components/AttractionDetails.vue'
import ParkPicker from '@/components/park-picker.vue'

export default {
	name: 'trip-summary',
	components : {
	  AttractionDetails,
	  ParkPicker,
	},
	data: () =>({
		parks: [
			"magic-kingdom",
			"epcot",
			"hollywood-studios",
			"animal-kingdom",
		],
		myDates: [],
		viewedAttraction : null,
	}),
	methods : {
		init(){
			const scope = this;
			if(!scope.currentTrip) return;

			let startDate = new Date(scope.currentTrip.startDate);
			const endDate = scope.currentTrip.endDate;
			//console.log(startDate.toString(), endDate.toString());
			while(startDate.getTime() != endDate.getTime()) {
				const tm = startDate.getTime();
				if(scope.currentTrip.days[tm]) {
					scope.myDates.push({...scope.currentTrip.days[tm], id: tm});
				} else {
					scope.myDates.push({ park : "", fp: ["", "", ""], id: tm});
				}
				startDate.setDate(startDate.getDate() +1);
			}
			if(scope.currentTrip.days[startDate.getTime()]) {
				scope.myDates[startDate.getTime()] = scope.currentTrip.days[startDate.getTime()];
			} else {
				scope.myDates[startDate.getTime()] = { park : "", fp: []};
			}
		},
		getDateLabel(d){
			return new Date(parseInt(d, 10)).toDateString();
		},
		pickDate(thisdate, num) {
			console.log("pickdate");
			
			this.myDates[num].fp = ["", "", ""];
			this.$store.commit('ADDDAY', {
				'tripId': this.tripId, 
				'dateId' : thisdate.id,
				'park' : thisdate.park
			});
		},
		pickFp(thisdate, num) {
			//console.log(thisdate);
			//state.trips[payload.tripId].days[payload.dateId].fp[payload.fpId] = payload.attrId;
			this.$store.commit('ADDDAYCHOICE', {
				'tripId' : this.tripId,
				'dateId' : thisdate.id,
				'fpId' : num,
				'attrId' : thisdate.fp[num],
			})
      
		},
		hasFastpass(dateId, fp) {
			return this.myDates[dateId].fp.includes(fp);
		}
	},
	mounted() {
		this.init();
	},
	watch: {
		currentTrip() {
			this.init();
		}
	},
	computed: {
		...mapGetters(['getTrip', 'attractionsByShortname', 'parkName', 'fastpassAttractions']),
	    currentTrip(scope) {
	      return scope.getTrip(scope.tripId);
	    },
		tripId(scope) {
			return scope.$route.params.tripId;
		},
		attractionLikes(scope) {
			const likes = {};
			if(scope.currentTrip) {
				Object.keys(scope.currentTrip.likes).forEach((key) => {
					Object.values(scope.currentTrip.likes[key]).forEach((like) => {
						if(likes[like]) {
							likes[like]++;
						} else {
							likes[like] = 1;
						}
					});
				});
			}
			return likes;
		},
		orderedAttractionLikes(scope) {
			const likes = {
				'magic-kingdom':[],
				'epcot':[],
				'hollywood-studios':[],
				'animal-kingdom':[],
			};
			if(scope.currentTrip && Object.keys(scope.attractionLikes).length > 0) {
				Object.keys(scope.attractionLikes).forEach((attr) => {
					const park = scope.attractionsByShortname[attr];
					likes[park.park].push({id: attr, likes: scope.attractionLikes[attr]});
				})
				
				Object.keys(likes).forEach((park) => {
					likes[park].sort((a,b) => {
						if(b.likes != a.likes) return b.likes - a.likes;
						const aAttr = scope.attractionsByShortname[a.id], bAttr = scope.attractionsByShortname[b.id];
						if(aAttr.not_to_be_missed && !bAttr.not_to_be_missed) return -1;
						if(!aAttr.not_to_be_missed && bAttr.not_to_be_missed) return 1;

						return 0;
					});
					likes[park] = likes[park].slice(0, 5);
				})
			}
			
			return likes;
		},
		diningDate(scope) {
			if(!scope.currentTrip) return new Date();
			const sd = new Date(scope.currentTrip.startDate);
			sd.setDate(sd.getDate() - 180);
			return sd;
		},
		hotelFastpassDate(scope) {
			if(!scope.currentTrip) return new Date();
			const sd = new Date(scope.currentTrip.startDate);
			sd.setDate(sd.getDate() - 60);
			return sd;
		},
		offsiteFastpassDate(scope) {
			if(!scope.currentTrip) return new Date();
			const sd = new Date(scope.currentTrip.startDate);
			sd.setDate(sd.getDate() - 30);
			return sd;
		},
		
	}
}

</script>

<style lang="less" scoped>
@import '../styles/mixins.less';

	.trip-summary-container {
		padding-bottom: 50px;
	}
	.trip-plan-link {
		display: inline-block;
		margin-bottom: 15px;
	}
	.trip-title {
		margin-bottom: 10px;
		font-size: 28px;
	}
	.trip-dates {
		margin-bottom: 5px;
		font-size: 18px;
	}
	.reservation-dates {
		font-size:14px;
		line-height: 18px;
		em {
			font-weight: bold;
			color: #93000f;
		}
	}
	.attractions-container {
		display: flex;
		justify-content: center;
		.tablet({
			flex-wrap: wrap;
		})
	}
	.top-attractions-container {
		margin: 20px 10px 0px;
		padding-top: 45px;
		background-repeat: no-repeat;
		background-size: auto 40px;
		background-position: center top;
		h3 {
			margin: 0 auto;
			max-width: 250px;
		}
		ul {
			margin: 5px auto 0;
			width: 95%;
			text-align: center;
			li {
				margin-right: 20px;
				font-size: 18px;
				line-height: 22px;
				p:hover {
					cursor: pointer;
					color: @red;
					text-decoration: underline;
				}
			}
		}
		&.magic-kingdom{
			.magic-kingdom();
		}
		&.epcot{
			.epcot();
		}
		&.hollywood-studios{
			.hollywood-studios();
		}
		&.animal-kingdom{
			.animal-kingdom();
		}
		.tablet({
			width: 44%;
			h3 {
				font-size: 15px;
			}
			ul li {
				font-size: 14px;
				line-height: 16px;
			}
		})
	}
	.likes-container {
		display: flex;
		justify-content: space-around;
	}
	.date-picker-container {
		margin: 25px auto 0;
		width: 95%;
		text-align: left;
		display: flex;
		flex-wrap: wrap;
		.date {
			padding: 20px 10px;
			border: 1px solid #000;
			width: 188px;
			margin-top: -1px;
			margin-left: -1px;
			.date-title {
				text-align: center;
				margin-bottom: 10px;
			}
			.fastpass-select {
				max-width: 100%;
				margin-bottom: 10px;
			}

		}
		.tablet({
			justify-content: center;
			.date {
				width: 145px;
			}
		})
	}

	.attractionDetailsPop {

		.close-tooltip {
			position: absolute;
			right: 10px;
			top: 10px;
			color: #000;
			cursor: pointer;
		}
		.attraction-details-container {
			max-width: 500px;
			.attraction-details {
				width: 100%;
				max-width: 470px;
				border: none;
				color: #000;
				.tablet({
					width: 90%;
					padding: 15px 15px 15px 25px;
				});
			}

		}
	}
</style>