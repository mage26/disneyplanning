<template>
	<div class="create-trip-container">
		<h1>Create Your Vacation</h1>
		<section class="vacation-name">
			<div>
				<h3>Name Your Vacation:</h3> 
				<a v-show="!showName" @click="showName = true">{{name}}</a> <input type="text" v-model="name" v-show="showName" @blur="checkName()" @keyup.enter='checkName()'/>
			</div>
		</section>
		<section class="vacation-dates" v-show="steps.hasName">
			<div><h3>Vacation Start Date:</h3> <datepicker v-model="startDate" name='startDate' :highlighted="datehighlights" @input="checkStart()"></datepicker></div>
			<div><h3>Vacation End Date:</h3> <datepicker v-model="endDate" name="endDate" :highlighted="datehighlights" :disabled-dates="disabledDates" @input="checkEnd()"></datepicker></div>
		</section>
		<!--<section class="days-in-park" v-show="steps.hasName && steps.hasStart && steps.hasEnd && !steps.unknownDays">
			<h3>Do you know how many days you're spending in theme parks?</h3>
			<div class="button-container" v-show="!steps.knownDays"><p class="yesno-button" @click="steps.knownDays = true">Yes</p><p class="yesno-button" @click="steps.unknownDays = true">No</p></div>
			<div v-show="steps.knownDays">How many?</div>
			<input v-show="steps.knownDays" type="number" v-model.number="daysInPark" :max="totalVacationDays" @change="checkDays"/>
		</section>-->
		<section class="vacation-members" v-show="steps.hasName && steps.hasStart && steps.hasEnd ">
			<h3>Add group members to your vacation</h3>
			<div class="vacation-member" v-for="(member, k) in members" >
				<input type="text" v-model="members[k]" @blur="checkMembers()" /> 
				<div class="color-picker" :style="{backgroundColor: memberColors[k]}" @click="showColorPicker = k">
					<div class="color-picker-selection" v-show="showColorPicker == k">
						<span class="color-picker-close" @click.stop="showColorPicker = -1">X</span>
						<p>Choose a color for {{members[k] || 'this person.'}}</p>
						<div class="color-picker" @click.stop="pickColor(k, col)" v-for="col in colors" :style="{backgroundColor : col}"></div>
					</div>
				</div>
				<button @click="removeMember(k)">-</button>
			</div>
			<button @click="addMember()">ADD +</button>
		</section>
		<section class="vacation-save" v-show="steps.hasName && steps.hasStart && steps.hasEnd && steps.hasMembers">
			<div class="vacation-save-button" @click="saveTrip()">{{saveText}}</div>
		</section>
	</div>
</template>

<script>
	import Datepicker from 'vuejs-datepicker';
	import { mapState } from 'vuex'

	export default {
		name: 'create-trip',
		data : () => ({
			name : "",
			members : [],
			memberColors : [],
			startDate : new Date(),
			endDate : new Date(),
			daysInPark : 0,

			showColorPicker : -1,
			showName : true,
			steps : {
				hasName : false,
				hasStart : false,
				hasEnd : false,
				hasDays : false,
				knownDays : false,	
				unknownDays : false,
				hasMembers: false,
			},

			colors : {
				grey : "#999999",
				green: "#66ff00",
				pink: "#ff66cc",
				blue: "#6699ff",
				red: "#cc3333",
				yellow: "#ffcc66",
				orange: "#ff6633",
				purple: "#6633cc",
			},
			saveText: "CREATE VACATION",
		}),
		computed : {
			...mapState(['trips']),
			datehighlights(scope) {
				return {
					from: scope.startDate,
					to: scope.endDate
				};
			},
			disabledDates(scope) {
				return {
					to: scope.startDate
				}
			},
			totalVacationDays(scope) {
				return (scope.endDate.getTime() - scope.startDate.getTime()) / (1000 * 3600 * 24) + 1;
			},
		},
		methods : {
			checkName() {
				if(this.name && this.name.length > 0) { this.showName = false; this.steps.hasName = true; }
				else { this.showName = true; this.steps.hasName = false; }
			},
			checkStart() {
				if(this.startDate > this.endDate) this.endDate = this.startDate;
				this.steps.hasStart = true;
			},
			checkEnd() {
				this.steps.hasEnd = true;
				if(this.startDate < this.endDate) this.steps.hasStart = true;
			},
			checkDays(e){
				//console.log(this.daysInPark, e);
				if(this.daysInPark > this.totalVacationDays) {
					this.daysInPark = this.totalVacationDays;
				}
				this.steps.hasDays = true;
			},
			addMember(){
				const scope = this;
				scope.members.push('');
				const memNum = scope.members.length - 1;
				scope.memberColors.push(scope.colors.grey);
			},
			removeMember(num) {
				this.members.splice(num, 1);
				this.memberColors.splice(num, 1);
				this.checkMembers();
			},
			pickColor(num, color) {
				this.memberColors[num] = color;
				this.showColorPicker = -1;
				//this.$forceUpdate();
			},
			checkMembers() {
				if(this.members.length == 0) { this.steps.hasMembers = false; return; }

				for(let m = 0; m < this.members.length; m++) {
					if(this.members[m] && this.members[m].length > 0) { 
						this.steps.hasMembers = true;
						return;
					}
				}
				this.steps.hasMembers = false;
			},
			saveTrip() {
				this.$store.dispatch('addTrip', {
					name : this.name,
					startDate : this.startDate,
					endDate : this.endDate,
					members : this.members,
					colors : this.memberColors,
				}).then(()=>{
					const numTrips = this.trips.length - 1;
					this.$router.push('/attractions/'+numTrips);
				})
			},
		},
		components: {
		  Datepicker
		}
	}
</script>

<style lang="less">
@import '../styles/mixins.less';

	.create-trip-container {
		padding: 50px 0;
		h1 {
			margin-bottom: 20px;
			font-size: 36px;
		}
		section {
			margin-bottom: 20px;
		}
		input[type='text'] {
			font-size: 18px;
			padding: 5px;
			border: 1px solid #333;
		}
		.vacation-dates {
			display: flex;
			justify-content: center;
			.tablet({
				display: block;
				> div {
					margin-top: 20px;
				}
			})
		}
		.days-in-park h3 {
			margin-bottom: 10px;
		}
		.button-container {
			display: flex;
			justify-content: center;
			margin: 0 0 10px;
			.yesno-button {
				background-color: #9f0007;
				color: #fff;
				padding: 10px 25px;
				border-radius: 5px;
				border: 1px solid #9f0007;
				transition: all .5s;
				cursor: pointer;
				&:first-child {
					margin-right: 50px;
				}
				&:hover {
					background-color: #fff;
					color: #9f0007;
				}
			}
		} 
		.vacation-members {

			h3 {
				margin-bottom: 10px;
			}
			.vacation-member {
				display: flex;
				justify-content: center;
				margin-bottom: 5px;
				position: relative;
				input {
					width: 250px;
					margin-right: 10px;
				}

			}
			.color-picker {
				display: inline-block;
				width: 35px;
				height: 35px;
				margin-right: 10px;
				position: relative;
				cursor: pointer;
				.tablet({
					position: static;
				})
			}
			.color-picker-selection {
				position: absolute;
				bottom: ~"calc(100% + 20px)";
				padding: 15px;
				width: 360px;
				background: #fff;
				left: 50%;
				transform: translate(-50%, 0);
				border: 1px solid #000;
				p {
					margin-bottom: 10px;
				}
				.color-picker-close {
					position: absolute;
					right: 5px;
					top: 5px;
					font-size: 14px;
				}
				&:before {
					content: "";
					position: absolute;
					bottom: -21px;
					left: 50%;
					transform: translate(-50%, 0);
					border-left: 20px solid transparent;
					border-right: 20px solid transparent;
					border-top: 20px solid #000;
				}
				&:after {
					content: "";
					position: absolute;
					bottom: -20px;
					left: 50%;
					transform: translate(-50%, 0);
					border-left: 20px solid transparent;
					border-right: 20px solid transparent;
					border-top: 20px solid #fff;
				}
			}
			button {
				padding: 6px 11px;
				font-size: 18px;
				cursor: pointer;
				border-radius: 5px;
				outline: none;
			}
		}

		.vacation-save-button {
			background-color: #9f0007;
			color: #fff;
			padding: 10px 25px;
			border-radius: 5px;
			border: 1px solid #9f0007;
			transition: all .5s;
			cursor: pointer;
			max-width: 300px;
			margin: 0 auto;
			&:hover {
				background-color: #fff;
				color: #9f0007;
			}
		}

		.vdp-datepicker {
			width: 300px;
			margin: 0 auto;
			text-align: center;
			&__calendar {
				text-align: left;
			}		
		}
	}
	
</style>