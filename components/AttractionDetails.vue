<template>
<div class="attraction-details">
	<h3>{{attraction.name}}</h3>
	<ul>
		<li>{{attraction.summary}}</li>
		<li>What it is: {{attraction.what_it_is}}</li>
		<li>Location: {{attraction.location}}</li>
		<li>Duration: {{attraction.duration}} minutes</li>
		<li v-show="attraction.probable_wait_time">Probable Wait Time: {{attraction.probable_wait_time}} minutes</li>
		<li v-show="attraction.height_restriction">Height Restriction: {{attraction.height_restriction}}"</li>
		<li v-show="attraction.when_to_go">Best Time to go: {{attraction.when_to_go}}</li>
	</ul>
	<div class='attraction-likes'>
		<h4>Who is interested in this {{translateAttractionType(attraction.category_code)}}?</h4>
		<div class='attraction-member' :class="{selected : checkLiked(member)}" :style="[checkLiked(member) ? {backgroundColor : currentTrip.colors[k]} : {}]" v-for="(member, k) in currentTrip.members" @click="addLike(member)">{{member}}</div>
	</div>
</div>
</template>

<script>

export default {
	name : 'AttractionDetails',
	props : ['attraction', 'currentTrip'],
	
	methods : {
		checkLiked(member) {
			return this.currentTrip.likes[member].indexOf(this.attraction.match_name) >= 0;
		},
		addLike(member) {
			this.$store.dispatch("addLike", {
				tripId : this.$route.params.tripId,
				memberId : member,
				attraction : this.attraction.match_name,
			})
			this.$forceUpdate();
		},
		translateAttractionType(type) {
	        return {
	          "ride":"Ride",
	          "scheduled_show":"Show", 
	          "continuous_show":"Show", 
	          "play_area":"Play Area", 
	          "character_greeting":"Meet and Greet", 
	          "arcade":"Arcade", 
	          "walkthrough":"Walkthrough", 
	          "other":"Attraction", 
	        }[type];
	     }
	}

}
</script>

<style scoped lang="less">
@import '../styles/mixins.less';

	.attraction-details {
		border: 1px solid #000;
		text-align: left;
		//width: 40%;
		padding: 15px;
		background-color: #fff;
		h3 {
			margin: 0 0 20px;
		}
		li {
			margin-bottom: 15px;
			font-size: 14px;
			line-height: 18px;
		}
	}


	.attraction-likes h4{
		background-color: #9f0003;
		color: #fff;
		padding: 5px;
		margin: 10px 0 5px;
	}
	.attraction-member {
		display: inline-block;
		padding: 5px 20px 5px 5px;
		cursor: pointer;
		position: relative;
		margin-bottom: 5px;
		margin-right: 5px;
		&.selected {
			color: #fff;
			&:before {
				content: "";
				height: 15px;
				width: 15px;
				position: absolute;
				right: 3px;
				top: 6px;
				background-image: url('../assets/thumb.png');
				background-size: contain;
				background-repeat: no-repeat;
				background-position: center center;
			}
		}
	}
</style>