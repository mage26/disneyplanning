
<script>
	import createTrip from './createTrip.vue';
	import { mapGetters } from 'vuex'

	export default {
		name: 'edit-trip',
		extends: createTrip,
		data : () => ({
			showName: false,
			
			steps : {
				hasName : true,
				hasStart : true,
				hasEnd : true,
				hasDays : false,
				knownDays : false,	
				unknownDays : false,
				hasMembers: true,
			},
			saveText: "SAVE CHANGES",
		}),
		computed : {
			...mapGetters(['getTrip']),
	    
			currentTrip(scope) {
		      return scope.getTrip(scope.tripId);
		    },
			tripId(scope) {
				return scope.$route.params.tripId;
			},
		},
		methods: {
			initEdit() {
				if(!this.currentTrip) return;

				this.name = this.currentTrip.name;
				this.members = this.currentTrip.members;
				this.memberColors = this.currentTrip.colors;
				this.startDate = this.currentTrip.startDate;
				this.endDate = this.currentTrip.endDate;
			},
			saveTrip() {
				this.$store.dispatch('editTrip', {
					id : this.tripId,
					trip : {
						...this.currentTrip,
						name : this.name,
						startDate : this.startDate,
						endDate : this.endDate,
						members : this.members,
						colors : Object.values(this.memberColors),
					}
				}).then(()=>{
					this.$router.push('/');
				})
			},
		},
		watch: {
			currentTrip() {
				this.initEdit();
			}
		},
		mounted() {
			this.initEdit();
		}

	}
</script>