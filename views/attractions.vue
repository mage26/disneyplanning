<template>
  <div class="attractions">
    <DisneyPlanning/>
  </div>
</template>

<script>
// @ is an alias to /src
import DisneyPlanning from '@/components/DisneyPlanning.vue'

export default {
  name: 'attractions',
  components: {
    DisneyPlanning
  },
  created: () => {
  	console.log(this)
  }
}
</script>
