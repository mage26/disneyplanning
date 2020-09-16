<template>
	<div class="park-picker-container">
		<div class='selected-park no-park' @click="showList = !showList" v-if="value && value == 'none'">
			No park today
		</div>
		<div class="selected-park" :class="value" @click="showList = !showList" v-else-if="value">
			{{parkName(value)}}
		</div>
		<div class="selected-park select-park" @click="showList = !showList" v-else>
			Click here to pick a park for today
		</div>
		<ul class="park-list" v-show="showList">
			<li class="park-list-item" :class="park" v-for="park in parks" @click="pickPark(park)">
				{{parkName(park)}}
			</li>
			<li class="park-list-item no-park" @click="pickPark('none')">
				No park today 
			</li>
		</ul>
	</div>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'

	export default {
		name: 'park-picker',
		props : ['value'],
		data: () => ({
			parks: [
				"magic-kingdom",
				"epcot",
				"hollywood-studios",
				"animal-kingdom",
			],
			showList : false,
		}),
		computed : {
			...mapGetters(['parkName']),
		},
		methods : {
			pickPark(park) {
				this.$emit('input', park);
				this.showList = false;
			}
		}
	}
</script>

<style scoped lang="less">

@import '../styles/mixins.less';

.crossout() {
	&:before{ 
		content: "";
		width: 33px;
		height: 33px;
		position: absolute;
		top: 0;
		left: 50%;
		.translate(-50%, 0);
		border-radius: 40px;
		border: 5px solid #000;
	}
	&:after {
		content: "";
		width: 40px;
		height: 5px;
		background-color: #000;
		position: absolute;
		top: 20px;
		transform: rotate(-45deg);
		left: 18px;
	}
}
	.park-picker-container {
		position: relative;
		margin-bottom: 10px;
		.selected-park {
			min-width: 40px;
			padding-top: 45px;
			background-size: auto 40px;
			background-repeat: no-repeat;
			background-position: center top;
			text-align: center;
			cursor: pointer;
			&.magic-kingdom { .magic-kingdom(); }
			&.epcot { .epcot(); }
			&.hollywood-studios { .hollywood-studios(); }
			&.animal-kingdom { .animal-kingdom(); }
			&.no-park {
				.crossout();
				&:after {
					left: 73px;
				}
				.tablet({
					&:after {
						left: 53px;
					}
				})
			}
			&.select-park {
				&:before {
					height: 35px;
					width: 35px;
					content: "";
					position: absolute;
					top: 0;
					left: 50%;
					.translate(-50%, 0);
					background-color: #ccc;
				}
			}
			font-size: 12px;
			//white-space: nowrap;

			&.no-park {
			//	width: 300px;
			}
		}
		.park-list {
			position: absolute;
			background-color: #fff;
			display: flex;
			padding: 10px;
			border: 1px solid #000;
			left: 50%;
			.translate(-50%, 0);
			top: 110%;
			z-index: 10;

			.park-list-item {
				margin: 0 10px;
				font-size: 12px;
				white-space: nowrap;
				padding-top: 45px;
				background-repeat: no-repeat;
				background-size: auto 40px;
				background-position: top center;
				min-width: 40px;
				cursor: pointer;
				position: relative;
				&.magic-kingdom { .magic-kingdom(); }
				&.epcot { .epcot(); }
				&.hollywood-studios { .hollywood-studios(); }
				&.animal-kingdom { .animal-kingdom(); }
				&.no-park {
					.crossout();
				}
			}

			.tablet({
				flex-wrap: wrap;
				width: 83vw;
				left: -11px;
				transform: none;
				.park-list-item {
					margin-bottom: 10px;
				}
			})
		}
	}
</style>