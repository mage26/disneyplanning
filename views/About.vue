<template>
  <div class="about">
    <h1>About My Disney Planner</h1>
    <p>The last time I went to Walt Disney World was with a large group of 9 people, plus a toddler. I was tasked with planning the trip, booking our Dining Reservations and Fastpasses, and attempting to plan out our day. While I was trying to make plans I wanted to make sure that I knew what everyone in the group wanted to do and not just pick my own preferences. I ended up using a Google Sheet that allowed everyone to pick their fastpass preferences for each park. But I thought, "There has to be a better tool to plan this out."</p>
    <p>So that brought me to building out this tool. It allows you to keep track of what everyone in your Disney World group wants to do and lists the top attractions based on which ones have the most likes. You can also then plan what fastpasses to try and get based on the most popular rides in your group.</p>

    <p>This wouldn't have been possible without <a href="https://touringplans.com/" target="_blank">Touring Plans</a> and their API.</p>
    <p>If you would like to give me feedback, please <a href="mailto:bberlin26@gmail.com">email me</a>.</p>
  </div>
</template>

<style scoped lang="less">
	.about {
		width: 90%;
		margin: 0 auto;
		p {
			margin: 20px 0;
			line-height: 22px;
			font-size: 18px;
		}
	}
</style>