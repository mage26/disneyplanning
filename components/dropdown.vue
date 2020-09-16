<template>
	<div class="dropdown-container" @mouseover="showValues = true" @mouseleave="showValues = false">
		<div class="dropdown-title" :class="{selected : showValues }">{{title}}</div>
		<ul class="dropdown-options" v-show="showValues">
			<li v-for="item in itemList">
				<input class="dropdown-radio-option" type="radio" v-if="item.type == 'radio'" :name="item.typeGroup" :value="item.value" v-model="item.checked" @change="thinger()" />
				 <input class="dropdown-option" type="checkbox" v-else :id="item.value" :value="item.value" v-model="item.checked" @change="thinger()"/> <label :class="item.type" :for="item.value">{{item.name}}</label>
			</li>
		</ul>
	</div>
</template>

<script>
	///Ill come back to this
	export default {
		name : 'dropdown',
		//props : ['items', 'title', 'value', 'defaultChecked'],
		props : {
			title: String,
			items: Array,
			value: Array,
			defaultChecked: Boolean,
		},
		data : () => ({
			showValues : false,
			itemList : {},
		}),
		computed : {
			valueList(scope) {
				return Object.values(scope.itemList).filter((it) =>  it.checked).map((it) => it.value );
			},
		},
		mounted() {
			this.init();
		},
		methods:{
			init(){
				const il = {};
				this.items.forEach((it) => { it.checked = this.defaultChecked; il[it.value] = it;});
				this.itemList = il;
			},
			thinger(){
				this.itemList = { ...this.itemList};
			}
		},
		watch:{
			itemList (){
			   	this.$emit('input', this.valueList);
			   
			},
			items() {
				this.init();
			}
		}
	}

</script>

<style lang="less" scoped>
	.dropdown-container {
		margin: 10px;
		position: relative;
		.dropdown-options {
			position: absolute;
			min-width: 230px;
			left: 50%;
			transform: translate(-50%, 0);
			background: #f3f3f3;
			box-shadow: 2px 2px 7px rgba(0,0,0,0.5);
			z-index: 100;
			li {
				margin: 15px 0;
				padding-left: 10%;
				text-align: left;
				label {
					padding-left: 20px;
					position: relative;
					cursor: pointer;
					display: inline-block;
					&:after {
						content: "";
						width: 10px;
						height: 10px;
						background: #fff;
						border: 1px solid #000;
						position: absolute;
						left: 0;
						top: 1px;
					}
				}
				input[type='checkbox'] {
					visibility: hidden;
					position: absolute;
				}
				input:checked + label {
					&:before {
						content: "";
						width: 15px;
						height: 20px;
						background-image: url('../assets/checkmark.png');
						background-size: contain;
						background-repeat: no-repeat;
						background-position: center center;
						position: absolute;
						left: 0px;
						top: -6px;
						z-index: 10;
					}
				}
				label.radio{
					&:before {
						display: none;
					}
					&:after { 
						display: none;
					}
				}
			}
		}
		.dropdown-title {
			position: relative;
			padding: 5px 10px;
			cursor: pointer;
			&:after {
				content: "";
				width: 7px;
				height: 7px;
				border-right: 2px solid #9f0007;
				border-bottom: 2px solid #9f0007;
				transform: rotate(45deg);
				position: absolute;
				right: -10px;
				top: 7px;
			}
			&.selected:after {
				transform: rotate(-135deg);
				top: 11px;
			}
		}
	}
</style>