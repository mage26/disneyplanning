<template>
	<div class="disney-planning-home">
		<h1>Welcome to Your Disney World Planner</h1>
		<p>Planning a Disney vacation with a large group? Having trouble keeping track of what everyone wants to do? Use this tool to keep track of everyone's top attractions. You'll know exactly what fastpasses your group wants to get once you're done.</p>
		<div class="vacation-link" v-for="(trip, k) in trips">
			<h3>{{trip.name}}</h3>
			<p><router-link :to="'/attractions/'+k">Plan this trip</router-link>|</p>
			<p v-show="hasLikes(trip)"><router-link :to="'/vacation/'+k">This Trip Summary</router-link>|</p>
			<p><router-link :to="'/edit/'+k">Edit Trip Details</router-link></p>
		</div>
		<router-link class="create-link" to="/create">Create a new Trip</router-link>
	
	</div>
</template>

<script>
	import { mapState } from 'vuex'

	export default {
		name : 'DisneyHome',
		computed : {
			...mapState(['trips'])
		},
		methods : {
			hasLikes(trip) {
				const likes = Object.values(trip.likes)
				for(let a = 0; a < likes.length; a++) {
					if(likes[a].length > 0) return true;
				}

				return false;
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '../styles/mixins.less';
	.disney-planning-home {
		padding-top: 50px;
		h1 {
			margin: 15px 0;
		}
		> p {
			line-height: 22px;
			width: 80%;
			margin: 0 auto;
		}
		.tablet({
			padding-top: 20px;
			>p {
				line-height: 18px;
				width: 90%;
			}
		})
	}
	.vacation-link {
		margin: 25px 0;
		p {
			display: inline-block;
			margin-right: 10px;
			a {
				margin-right: 10px;
			}
		}
		.tablet({
			margin: 10px 0;
		})
	}
	.create-link {
		padding: 15px 45px;
		background-color: #9f0007;
		border: 1px solid #9f0007;
		color: #fff;
		text-decoration: none;
		border-radius: 5px;
		width: 155px;
		display: block;
		margin: 20px auto 0;
		transition: all .5s;
		&:hover {
			background-color: #fff;
			color: #9f0007
		}
	}
</style>